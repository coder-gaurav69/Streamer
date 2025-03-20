import React, { createContext, useRef } from "react";

const PeerContext = createContext(null);

const PeerProvider = ({ children }) => {
  const peer = useRef(null);
  const remoteStreamRef = useRef(null);

  const initializePeerConnection = () => {
    if (peer.current) peer.current.close();

    peer.current = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478" },
        { urls: "stun:ss-turn1.xirsys.com" },
        {
          urls: [
            "turn:ss-turn1.xirsys.com:80?transport=udp",
            "turn:ss-turn1.xirsys.com:3478?transport=udp",
            "turns:ss-turn1.xirsys.com:443?transport=tcp",
            "turns:ss-turn1.xirsys.com:5349?transport=tcp"
          ],
          username: "your-username",
          credential: "your-credential"
        }
      ],
    });

    peer.current.ontrack = (event) => {
      if (!remoteStreamRef.current) remoteStreamRef.current = new MediaStream();
      event.streams[0].getTracks().forEach((track) => {
        if (!remoteStreamRef.current.srcObject) remoteStreamRef.current.srcObject = new MediaStream();
        if (!remoteStreamRef.current.srcObject.getTracks().includes(track)) {
          remoteStreamRef.current.srcObject.addTrack(track);
        }
      });
    };
  };

  const offer = async () => {
    const offer = await peer.current.createOffer();
    await peer.current.setLocalDescription(offer);
    return offer;
  };

  const answer = async (offer) => {
    await peer.current.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.current.createAnswer();
    await peer.current.setLocalDescription(answer);
    return answer;
  };

  const createIceCandidate = async () => {
    return new Promise((resolve) => {
      peer.current.onicecandidate = (event) => {
        if (event.candidate) {
          resolve(event.candidate);
        }
      };
    });
  };

  const receiveIceCandidate = async (candidate) => {
    if (candidate) {
      await peer.current.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const acceptingAnswer = async (answer) => {
    await peer.current.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const addingTrack = async (stream) => {
    stream.getTracks().forEach((track) => peer.current.addTrack(track, stream));
  };

  return (
    <PeerContext.Provider
      value={{
        offer,
        answer,
        createIceCandidate,
        receiveIceCandidate,
        acceptingAnswer,
        addingTrack,
        initializePeerConnection,
        remoteStreamRef,
      }}
    >
      {children}
    </PeerContext.Provider>
  );
};

export { PeerContext, PeerProvider };
