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
        // console.log(event.candidate);
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

import React, { useContext, useEffect, useRef, useState } from "react";
import "./Stream.css";
import { UserContext } from "../../Context/UserContext";
import { SocketContext } from "../../Context/SocketContext";
import { PeerContext } from "../../Context/PeerContext";
import Video from "./Video/Video";

const Stream = ({ setIsZoomed, isZoomed }) => {
  const { name, category } = useContext(UserContext);
  const socket = useContext(SocketContext);
  const {
    addingTrack,
    offer,
    answer,
    acceptingAnswer,
    createIceCandidate,
    receiveIceCandidate,
    remoteStreamRef,
    initializePeerConnection,
  } = useContext(PeerContext);

  const localStreamRef = useRef(null);
  const [localStream,setLocalStream] = useState(null)
  const [toggler, setToggler] = useState(true);
  const [myId, setMyId] = useState(null);
  const [remoteName, setRemoteName] = useState(null);
  const [remoteId, setRemoteId] = useState(null);
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);
  const [findinguser, setFindinguser] = useState(true);

  const getLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video:{frameRate: 30},
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true, 
        },
      });

      if (stream && localStreamRef.current) {
        localStreamRef.current.srcObject = stream;
        localStreamRef.current.muted = 'true';
        await addingTrack(stream);
        setLocalStream(stream)
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };


  const toggleVideoIcon = ()=>{
    const videoTrack = localStream.getVideoTracks()[0];
    videoTrack.enabled = !video;
    console.log(video?'video off':'video on')
  }

  const toggleAudioIcon = ()=>{
    const audioTrack = localStream.getAudioTracks()[0];
    audioTrack.enabled = !audio;
    console.log(video?'audio off':'audio on')
  }

  const approach = async ([remoteName, remoteId, myId]) => {
    setRemoteId(remoteId);
    setRemoteName(remoteName);
    const offervalue = await offer();
    console.log(offervalue)
    createIceCandidate();
    socket.current.emit("call", [
      name,
      offervalue,
      // iceCandidate,
      myId,
      remoteId,
    ]);
  };

  const answerCall = async ([
    remoteName,
    offer,
    remoteId,
    myId
  ]) => {
    setRemoteName(remoteName);
    const createdAnswer = await answer(offer);
    console.log(createdAnswer)
    receiveIceCandidate();
    createIceCandidate();
    socket.current.emit("answerCall", [
      name,
      createdAnswer,
      remoteId,
      myId,
    ]);
    setFindinguser(false);
  };

  const accept = async ([
    remoteName,
    answer,
    // remoteIceCandidate,
    myId,
    remoteId,
  ]) => {
    await acceptingAnswer(answer);
    receiveIceCandidate();
    socket.current.emit("connectionEstablished", [myId, remoteId]);
    setFindinguser(false);
  };

  const connectUser = () => {
    socket.current.emit("AnyUser", [name, category]);
    socket.current.on("myId", (id) => setMyId(id));
    socket.current.off("finding_users").on("finding_users", console.log);
    socket.current.off("approach").on("approach", approach);
    socket.current.off("call").on("call", answerCall);
    socket.current.off("answerCall").on("answerCall", accept);
    socket.current.on("connectionEnd", (msg) => {
      if (remoteStreamRef.current) {
        remoteStreamRef.current.srcObject = null;
        handleDisconnection();
      }
    });
  };

  useEffect(() => {
    getLocalStream();

    return () => {
      if (socket.current) {
        socket.current.off("finding_users");
        socket.current.off("approach");
        socket.current.off("call");
        socket.current.off("answerCall");
        socket.current.off("connectionEnd");
      }
      if (remoteStreamRef.current && remoteStreamRef.current.srcObject) {
        remoteStreamRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
        remoteStreamRef.current.srcObject = null;
      }
    };
  }, []);

  const handleDisconnection = async () => {
    console.log("Disconnected");
    // Notify the server about the disconnection
    socket.current.emit("connectionEnd", {
      userLeftId: myId,
      msg: "User left",
    });

    // Properly close the previous PeerConnection
    if (remoteStreamRef.current) {
      remoteStreamRef.current.srcObject = null;
    }

    // Reset Peer Connection (Important)
    initializePeerConnection();

    // Get new local stream and set it to the peer connection
    await getLocalStream();
    setToggler(true);
    setFindinguser(true);
  };

  const handleBtn = () => {
    if (toggler) {
      connectUser();
      console.log("connected");
      setToggler(false);
      // setUserLeft(false);
    } else {
      handleDisconnection();
    }
  };

  return (
    <>
      <Video
        localStreamRef={localStreamRef}
        remoteStreamRef={remoteStreamRef}
        toggler={toggler}
        remoteName={remoteName}
        name={name}
        handleBtn={handleBtn}
        setIsZoomed={setIsZoomed}
        isZoomed={isZoomed}
        findinguser={findinguser}
        setVideo = {setVideo}
        setAudio={setAudio}
        video={video}
        audio={audio}
        toggleVideoIcon={toggleVideoIcon}
        toggleAudioIcon={toggleAudioIcon}
      />
    </>
  );
};

export default Stream;


import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "https://streamer123.netlify.app";

const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

const AvailableUsersQueue = [];
const ConnectedUsers = new Map();

const matchUsers = () => {
  while (AvailableUsersQueue.length >= 2) {
    const user1 = AvailableUsersQueue.shift();
    const user2 = AvailableUsersQueue.shift();

    ConnectedUsers.set(user1.id, user2.id);
    ConnectedUsers.set(user2.id, user1.id);

    io.to(user1.id).emit("remoteId", user2.id);
    io.to(user2.id).emit("approach", [user1.name, user1.id, user2.id]);
  }
};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("AnyUser", (data) => {
    const [name] = data;
    console.log("New user:", name);

    socket.emit("myId", socket.id);

    if (name) {
      AvailableUsersQueue.push({ id: socket.id, name });
      matchUsers();
    }
  });

  socket.on("call", ([name, offervalue, myId, remoteId]) => {
    io.to(remoteId).emit("call", [name, offervalue, myId, remoteId]);
  });

  socket.on("answerCall", ([name, answer, remoteId, myId]) => {
    io.to(remoteId).emit("answerCall", [name, answer, remoteId, myId]);
  });

  socket.on("connectionEnd", ({ userLeftId }) => {
    const remoteId = ConnectedUsers.get(userLeftId);

    if (remoteId) {
      io.to(remoteId).emit("connectionEnd", "User left");
      ConnectedUsers.delete(userLeftId);
      ConnectedUsers.delete(remoteId);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    const remoteId = ConnectedUsers.get(socket.id);
    if (remoteId) {
      io.to(remoteId).emit("connectionEnd", "User left");
      ConnectedUsers.delete(socket.id);
      ConnectedUsers.delete(remoteId);
    }

    const index = AvailableUsersQueue.findIndex((user) => user.id === socket.id);
    if (index !== -1) {
      AvailableUsersQueue.splice(index, 1);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
