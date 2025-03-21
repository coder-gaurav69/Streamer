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

  const initializePeerConnection = () => {
    if (peer.current) {
      peer.current.ontrack = null;
      peer.current.onicecandidate = null;
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
          username:
            "b6U4GfI9po7YxqwECcBIr-__RgWRGKwz43NEk2ZCPZ5TiQZQuT8k1HJ6NuA_HJRxAAAAAGfbB7RHYXVyYXYxNjAxMDQ=",
          credential: "eaa1dcb8-04ec-11f0-bcfb-0242ac140004",
        },
      ],
    });

    peer.current.ontrack = (event) => {
      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream();
      }

      // ✅ Prevent duplicate tracks
      const existingTracks = remoteStreamRef.current.srcObject
        ? remoteStreamRef.current.srcObject.getTracks()
        : [];
      event.streams[0].getTracks().forEach((track) => {
        if (!existingTracks.includes(track)) {
          if (!remoteStreamRef.current.srcObject) {
            remoteStreamRef.current.srcObject = new MediaStream();
          }
          remoteStreamRef.current.srcObject.addTrack(track);
        }
      });
    };

    // ✅ Reset processed candidates when a new connection starts
    setProcessedCandidates(new Set());
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
    const offer = await peer.current.createOffer();
    await peer.current.setLocalDescription(offer);
    return offer;
  };

  const answer = async (offer) => {
    await peer.current.setRemoteDescription(offer);
    const answer = await peer.current.createAnswer();
    await peer.current.setLocalDescription(answer);
    return answer;
  };

  const addingTrack = async (stream) => {
    stream.getTracks().forEach((track) => {
      peer.current.addTrack(track, stream);
    });
  };

  const acceptingAnswer = async (answer) => {
    await peer.current.setRemoteDescription(answer);
  };

  const createIceCandidate = (remoteId) => {
    peer.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit("iceCandidate", [event.candidate, remoteId]);
      }
    };
  };

  const receiveIceCandidate = () => {
    socket.current.off("receiveCandidate"); // ✅ Prevent multiple listeners
    socket.current.on("receiveCandidate", async (candidate) => {
      // ✅ Ignore duplicate candidates
      if (!processedCandidates.has(candidate.candidate)) {
        try {
          await peer.current.addIceCandidate(candidate);
          setProcessedCandidates((prev) => new Set(prev).add(candidate.candidate));
        } catch (error) {
          console.error("Error adding received ICE candidate:", error);
        }
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
