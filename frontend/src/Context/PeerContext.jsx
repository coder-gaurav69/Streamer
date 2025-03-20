import React, { createContext, useEffect, useRef } from "react";

const PeerContext = createContext(null);

const PeerProvider = ({ children }) => {
  const peer = useRef(null);
  const remoteStreamRef = useRef(null);

  // 🔹 Initialize Peer Connection
  const initializePeerConnection = () => {
    if (peer.current) {
      peer.current.ontrack = null;
      peer.current.onicecandidate = null;
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
            "turns:ss-turn1.xirsys.com:5349?transport=tcp",
          ],
          username: "b6U4GfI9po7YxqwECcBIr-__RgWRGKwz43NEk2ZCPZ5TiQZQuT8k1HJ6NuA_HJRxAAAAAGfbB7RHYXVyYXYxNjAxMDQ=",
          credential: "eaa1dcb8-04ec-11f0-bcfb-0242ac140004",
        },
      ],
    });

    // 🔹 Handle incoming tracks properly
    peer.current.ontrack = (event) => {
      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream();
      }
      remoteStreamRef.current.srcObject = event.streams[0];
    };
  };

  // 🔹 Cleanup Peer Connection on Unmount
  useEffect(() => {
    initializePeerConnection();

    return () => {
      if (peer.current) {
        peer.current.ontrack = null;
        peer.current.onicecandidate = null;
        peer.current.close();
        peer.current = null;
      }
    };
  }, []);

  // 🔹 Create Offer
  const offer = async () => {
    const offer = await peer.current.createOffer();
    await peer.current.setLocalDescription(offer);
    return offer;
  };

  // 🔹 Create Answer
  const answer = async (offer) => {
    await peer.current.setRemoteDescription(offer);
    const answer = await peer.current.createAnswer();
    await peer.current.setLocalDescription(answer);
    return answer;
  };

  // 🔹 Add Local Tracks
  const addingTrack = async (stream) => {
    stream.getTracks().forEach((track) => {
      peer.current.addTrack(track, stream);
    });
  };

  // 🔹 Accept Answer
  const acceptingAnswer = async (answer) => {
    await peer.current.setRemoteDescription(answer);
  };

  // 🔹 Create ICE Candidates
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

      // Resolve even if no candidates are found
      setTimeout(() => resolve(iceCandidates), 2000);
    });
  };

  // 🔹 Receive ICE Candidates
  const receiveIceCandidate = async (iceCandidates) => {
    if (!iceCandidates?.length || !peer.current) return;
    await Promise.all(
      iceCandidates.map((candidate) => peer.current.addIceCandidate(new RTCIceCandidate(candidate)))
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
