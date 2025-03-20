import React, { createContext, useEffect, useRef, useState } from "react";

const PeerContext = createContext(null);

const PeerProvider = ({ children }) => {
  const peer = useRef(null);
  const remoteStreamRef = useRef(null);
  const [iceCandidate, setIceCandidate] = useState([]);

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
    console.log('first step')
    return offer;
  };

  const answer = async (offer) => {
    await peer.current.setRemoteDescription(offer);
    const answer = await peer.current.createAnswer();
    await peer.current.setLocalDescription(answer);
    console.log('second step')
    return answer;
  };

  const addingTrack = async (stream) => {
    stream.getTracks().forEach((track) => {
      peer.current.addTrack(track, stream);
    });
  };

  const acceptingAnswer = async (answer) => {
    console.log('last step')
    await peer.current.setRemoteDescription(answer);
  };

  const [processedCandidates, setProcessedCandidates] = useState([]);

  const createIceCandidate = () => {
    peer.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log(event.candidate);
        setIceCandidate((prevCandidates) => [
          ...prevCandidates,
          event.candidate,
        ]);
      }
    };
  };

  const receiveIceCandidate = async () => {
    if (peer.current) {
      // Wait until remote description is set before adding ICE candidates
      const checkRemoteDescription = setInterval(async () => {
        if (peer.current.remoteDescription) {
          clearInterval(checkRemoteDescription); // Stop checking once it's set
  
          try {
            for (const candidate of iceCandidate) {
              if (candidate) {
                await peer.current.addIceCandidate(new RTCIceCandidate(candidate));
              }
            }
          } catch (error) {
            console.error("Error adding ICE Candidate:", error);
          }
        } else {
          console.warn("Waiting for remote description before adding ICE candidates...");
        }
      }, 500); // Check every 500ms
    } else {
      console.warn("Peer connection not established yet.");
    }
  };
  
  

  // ✅ This ensures dynamic updates without re-processing
  useEffect(() => {
    receiveIceCandidate();
  }, [iceCandidate]);

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
