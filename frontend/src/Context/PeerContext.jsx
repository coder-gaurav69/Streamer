import React, { createContext, useEffect, useRef } from "react";
import { SocketContext } from "../../Context/SocketContext";

const PeerContext = createContext(null);

const PeerProvider = ({ children }) => {
  const peer = useRef(null);
  const remoteStreamRef = useRef(null);
  const socket = useContext(SocketContext);

  const initializePeerConnection = () => {
    if (peer.current) {
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

      // Ensure only remote tracks are added
      event.streams[0].getTracks().forEach((track) => {
        if (!remoteStreamRef.current.srcObject) {
          remoteStreamRef.current.srcObject = new MediaStream();
        }

        // Check if track is already added to avoid duplicates
        const existingTracks = remoteStreamRef.current.srcObject.getTracks();
        if (!existingTracks.includes(track)) {
          remoteStreamRef.current.srcObject.addTrack(track);
        }
      });
    };
  };

  useEffect(() => {
    initializePeerConnection();

    return () => {
      if (peer.current) {
        peer.current.close();
        peer.current = null;
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

  const createIceCandidate = (remoteName,remoteId,myId) => {
    peer.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate:", event.candidate);
        socket.current.emit("ice-candidate", [event.candidate,remoteName,remoteId,myId]);
      }
    };
  };
  
  
  const receiveIceCandidate = () => {
    socket.current.on("receiveCandidate", async (data) => {
      const [candidate, myName, myId, remoteId] = data;
  
      if (candidate && peer.current) {
        try {
          await peer.current.addIceCandidate(new RTCIceCandidate(candidate));
          console.log("ICE Candidate added:", candidate);
        } catch (error) {
          console.error("Error adding ICE Candidate:", error);
        }
      }
    });
  };
  
  
  

  return (
    <PeerContext.Provider
      value={{
        peer,
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
