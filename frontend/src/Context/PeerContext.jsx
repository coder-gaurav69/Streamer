import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { SocketContext } from "./SocketContext";

const PeerContext = createContext(null);

const PeerProvider = ({ children }) => {
  const peer = useRef(null);
  const remoteStreamRef = useRef(null);
  const socket = useContext(SocketContext);
  const [processedCandidates, setProcessedCandidates] = useState(new Set());
  const [connectionState, setConnectionState] = useState("new"); // Track connection state
  const candidateQueue = useRef([]); // Queue for ICE candidates

  const initializePeerConnection = () => {
    console.log("Initializing peer connection...");

    // Clean up existing connection
    if (peer.current) {
      peer.current.ontrack = null;
      peer.current.onicecandidate = null;
      peer.current.oniceconnectionstatechange = null;
      peer.current.onsignalingstatechange = null;
      peer.current.close();
    }

    peer.current = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478" },
        { urls: "stun:ss-turn1.xirsys.com" }, // Xirsys STUN server
        {
          urls: [
            "turn:ss-turn1.xirsys.com:80?transport=udp",
            "turn:ss-turn1.xirsys.com:3478?transport=udp",
            "turn:ss-turn1.xirsys.com:80?transport=tcp",
            "turn:ss-turn1.xirsys.com:3478?transport=tcp",
            "turns:ss-turn1.xirsys.com:443?transport=tcp",
            "turns:ss-turn1.xirsys.com:5349?transport=tcp",
          ],
          username: `${import.meta.env.VITE_USERNAME}`,
          credential: `${import.meta.env.VITE_CREDENTIAL}`,
        },
      ],
    });

    // Track connection state changes
    peer.current.oniceconnectionstatechange = () => {
      const state = peer.current?.iceConnectionState;
      console.log("ICE Connection State:", state);
      setConnectionState(state);

      if (state === "failed" || state === "disconnected") {
        console.warn("Connection failed or disconnected, may need to restart");
      }
    };

    peer.current.onsignalingstatechange = () => {
      console.log("Signaling State:", peer.current?.signalingState);
    };

    peer.current.ontrack = (event) => {
      console.log("Received remote track:", event.track.kind);

      if (!remoteStreamRef.current) {
        remoteStreamRef.current = document.createElement('video');
      }

      // ✅ Prevent duplicate tracks
      const existingTracks = remoteStreamRef.current.srcObject
        ? remoteStreamRef.current.srcObject.getTracks()
        : [];

      event.streams[0].getTracks().forEach((track) => {
        if (!existingTracks.find(t => t.id === track.id)) {
          if (!remoteStreamRef.current.srcObject) {
            remoteStreamRef.current.srcObject = new MediaStream();
          }
          remoteStreamRef.current.srcObject.addTrack(track);
          console.log(`Added ${track.kind} track to remote stream`);
        }
      });
    };

    // ✅ Reset processed candidates and queue when a new connection starts
    setProcessedCandidates(new Set());
    candidateQueue.current = [];
    setConnectionState("new");
  };

  useEffect(() => {
    initializePeerConnection();

    return () => {
      if (peer.current) {
        peer.current.ontrack = null;
        peer.current.onicecandidate = null;
        peer.current.close();
        peer.current = null;
      }
      if (socket.current) {
        socket.current.off("receiveCandidate");
      }
    };
  }, []);

  const offer = async () => {
    try {
      if (!peer.current) {
        throw new Error("Peer connection not initialized");
      }

      console.log("Creating offer...");
      const offer = await peer.current.createOffer();
      await peer.current.setLocalDescription(offer);
      console.log("Offer created and set as local description");
      return offer;
    } catch (error) {
      console.error("Error creating offer:", error);
      throw error;
    }
  };

  const answer = async (offer) => {
    try {
      if (!peer.current) {
        throw new Error("Peer connection not initialized");
      }

      console.log("Received offer, creating answer...");
      await peer.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.current.createAnswer();
      await peer.current.setLocalDescription(answer);
      console.log("Answer created and set as local description");

      // Process queued ICE candidates after setting remote description
      if (candidateQueue.current.length > 0) {
        console.log(`Processing ${candidateQueue.current.length} queued ICE candidates`);
        for (const candidate of candidateQueue.current) {
          try {
            await peer.current.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.error("Error adding queued candidate:", err);
          }
        }
        candidateQueue.current = [];
      }

      return answer;
    } catch (error) {
      console.error("Error creating answer:", error);
      throw error;
    }
  };

  const addingTrack = async (stream) => {
    try {
      if (!peer.current) {
        throw new Error("Peer connection not initialized");
      }

      console.log("Adding tracks to peer connection...");
      stream.getTracks().forEach((track) => {
        peer.current.addTrack(track, stream);
        console.log(`Added ${track.kind} track`);
      });
    } catch (error) {
      console.error("Error adding tracks:", error);
      throw error;
    }
  };

  const acceptingAnswer = async (answer) => {
    try {
      if (!peer.current) {
        throw new Error("Peer connection not initialized");
      }

      console.log("Setting remote description (answer)...");
      await peer.current.setRemoteDescription(new RTCSessionDescription(answer));
      console.log("Remote description set successfully");

      // Process queued ICE candidates after setting remote description
      if (candidateQueue.current.length > 0) {
        console.log(`Processing ${candidateQueue.current.length} queued ICE candidates`);
        for (const candidate of candidateQueue.current) {
          try {
            await peer.current.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.error("Error adding queued candidate:", err);
          }
        }
        candidateQueue.current = [];
      }
    } catch (error) {
      console.error("Error accepting answer:", error);
      throw error;
    }
  };

  const createIceCandidate = (remoteId) => {
    peer.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate to remote peer");
        socket.current.emit("iceCandidate", [event.candidate, remoteId]);
      } else {
        console.log("All ICE candidates have been sent");
      }
    };
  };

  const receiveIceCandidate = () => {
    socket.current.off("receiveCandidate"); // ✅ Prevent multiple listeners
    socket.current.on("receiveCandidate", async (candidate) => {
      // ✅ Ignore duplicate candidates
      if (processedCandidates.has(candidate.candidate)) {
        console.log("Duplicate ICE candidate, ignoring");
        return;
      }

      try {
        // Check if remote description is set
        if (!peer.current.remoteDescription || !peer.current.remoteDescription.type) {
          console.log("Remote description not set yet, queuing ICE candidate");
          candidateQueue.current.push(candidate);
          return;
        }

        console.log("Adding ICE candidate");
        await peer.current.addIceCandidate(new RTCIceCandidate(candidate));
        setProcessedCandidates((prev) => new Set(prev).add(candidate.candidate));
        console.log("ICE candidate added successfully");
      } catch (error) {
        console.error("Error adding received ICE candidate:", error);
      }
    });
  };

  return (
    <PeerContext.Provider
      value={{
        addingTrack,
        offer,
        answer,
        acceptingAnswer,
        createIceCandidate,
        receiveIceCandidate,
        remoteStreamRef,
        initializePeerConnection,
      }}
    >
      {children}
    </PeerContext.Provider>
  );
};

export { PeerContext, PeerProvider };
