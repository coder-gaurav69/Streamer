import React, { createContext, useEffect, useRef } from "react";

const PeerContext = createContext(null);

const PeerProvider = ({ children }) => {
  const peer = useRef(null);
  const remoteStreamRef = useRef(null);

  const initializePeerConnection = () => {
    if (peer.current) {
      peer.current.onicecandidate = null;
      peer.current.ontrack = null;
      peer.current.close();
      peer.current = null;
    }
  
    peer.current = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }, 
        { urls: "stun:global.stun.twilio.com:3478" },
        { urls: "stun:ss-turn1.xirsys.com" },  
        { 
          urls: [
            "turn:ss-turn1.xirsys.com:80?transport=udp",
            "turn:ss-turn1.xirsys.com:3478?transport=udp",
            "turn:ss-turn1.xirsys.com:80?transport=tcp",
            "turn:ss-turn1.xirsys.com:3478?transport=tcp",
            "turns:ss-turn1.xirsys.com:443?transport=tcp",
            "turns:ss-turn1.xirsys.com:5349?transport=tcp"
          ],
          username: "b6U4GfI9po7YxqwECcBIr-__RgWRGKwz43NEk2ZCPZ5TiQZQuT8k1HJ6NuA_HJRxAAAAAGfbB7RHYXVyYXYxNjAxMDQ=",  
          credential: "eaa1dcb8-04ec-11f0-bcfb-0242ac140004"
        }
      ],
    });
  
    peer.current.ontrack = (event) => {
      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream();
      }
  
      event.streams[0].getTracks().forEach((track) => {
        if (!remoteStreamRef.current.srcObject) {
          remoteStreamRef.current.srcObject = new MediaStream();
        }
  
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

  const createIceCandidate = () => {
    return new Promise((resolve) => {
      const iceCandidates = [];
      peer.current.onicecandidate = (event) => {
        if (event.candidate) {
          iceCandidates.push(event.candidate);
        } else {
          resolve(iceCandidates);
        }
      };
    });
  };
  
  const receiveIceCandidate = async (iceCandidates) => {
    if (!iceCandidates?.length || !peer.current) return;
  
    // Reset ICE candidates before adding new ones
    peer.current.onicecandidate = null;
    peer.current.onicecandidate = (event) => {
      if (event.candidate) {
        iceCandidates.push(event.candidate);
      }
    };
  
    await Promise.all(
      iceCandidates.map((candidate) =>
        peer.current.addIceCandidate(new RTCIceCandidate(candidate))
      )
    );
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
