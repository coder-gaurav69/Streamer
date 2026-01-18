import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../Context/UserContext";
import { SocketContext } from "../../Context/SocketContext";
import { PeerContext } from "../../Context/PeerContext";
import Video from "./Video/Video";

const Stream = ({ setIsZoomed, isZoomed }) => {
  const { name, category, choice } = useContext(UserContext);
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
  const [localStream, setLocalStream] = useState(null);
  const [toggler, setToggler] = useState(true);
  const [myId, setMyId] = useState(null);
  const [remoteName, setRemoteName] = useState(null);
  const [remoteId, setRemoteId] = useState(null);
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);
  const [findinguser, setFindinguser] = useState(true);
  const [messages, setMessages] = useState([]);
  const videoRef = useRef(null);

  const getLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { frameRate: 30 },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      if (stream) {
        localStreamRef.current.srcObject = stream;
        localStreamRef.current.muted = true;
        videoRef.current = stream;
        await addingTrack(stream);
        setLocalStream(stream);
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const toggleVideoIcon = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !video;
      console.log(video ? "Video off" : "Video on");
    }
  };

  const toggleAudioIcon = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audio;
      console.log(audio ? "Audio off" : "Audio on");
    }
  };

  const approach = async ([remoteName, remoteId, myId]) => {
    setRemoteId(remoteId);
    setRemoteName(remoteName);
    createIceCandidate(remoteId);
    const offervalue = await offer();
    socket.current.emit("call", [name, offervalue, myId, remoteId]);
  };

  const answerCall = async ([remoteName, offer, remoteId, myId]) => {
    console.log("Answering call from:", remoteName);
    setRemoteName(remoteName);
    setRemoteId(remoteId);
    createIceCandidate(remoteId);

    try {
      const createdAnswer = await answer(offer);
      receiveIceCandidate();
      socket.current.emit("answerCall", [name, createdAnswer, remoteId, myId]);
      setFindinguser(false);
      console.log("Answer sent successfully");
    } catch (error) {
      console.error("Error answering call:", error);
    }
  };

  const accept = async ([remoteName, answer, myId, remoteId]) => {
    console.log("Accepting answer from:", remoteName);
    try {
      await acceptingAnswer(answer);
      receiveIceCandidate();
      setFindinguser(false);
      console.log("Connection established successfully");
    } catch (error) {
      console.error("Error accepting answer:", error);
    }
  };

  // New handler for matched event from backend
  const handleMatched = async ({ remoteId, remoteName, isInitiator }) => {
    console.log(`Matched with ${remoteName}. Initiator: ${isInitiator}`);
    setRemoteId(remoteId);
    setRemoteName(remoteName);
    setMyId(socket.current.id);

    // Set up ICE candidate handling
    createIceCandidate(remoteId);
    receiveIceCandidate();

    if (isInitiator) {
      // This user initiates the call
      console.log("Initiating call...");
      try {
        const offervalue = await offer();
        socket.current.emit("call", [name, offervalue, socket.current.id, remoteId]);
        console.log("Offer sent");
      } catch (error) {
        console.error("Error creating offer:", error);
      }
    } else {
      // This user waits for the call
      console.log("Waiting for call...");
    }
  };

  const connectUser = () => {
    console.log("Connecting user...");
    setMessages([]);

    // Remove ALL previous event listeners to prevent duplicates
    socket.current.off("myId");
    socket.current.off("finding_users");
    socket.current.off("matched");
    socket.current.off("approach");
    socket.current.off("call");
    socket.current.off("answerCall");
    socket.current.off("connectionEnd");
    socket.current.off("remoteId");

    // Emit connection request
    socket.current.emit("AnyUser", [name, category, choice]);

    // Attach new event listeners
    socket.current.on("myId", (id) => {
      console.log("My ID:", id);
      setMyId(id);
    });

    socket.current.on("finding_users", (msg) => {
      console.log("Finding users:", msg);
    });

    // New matched event handler
    socket.current.on("matched", handleMatched);

    // Legacy handlers for backward compatibility
    socket.current.on("approach", approach);
    socket.current.on("call", answerCall);
    socket.current.on("answerCall", accept);

    socket.current.on("connectionEnd", (msg) => {
      console.log("Connection ended:", msg);
      setMessages([]);
      if (remoteStreamRef.current) {
        remoteStreamRef.current.srcObject = null;
        handleDisconnection();
      }
    });
  };

  useEffect(() => {
    console.log('mouting')
    getLocalStream();

    return () => {

      if (videoRef.current) {
        console.log("UNMOUNTING Stream...");
        videoRef.current.getTracks().forEach((track) => track.stop());
      }

    };
  }, []);


  const handleDisconnection = async () => {
    console.log("Handling disconnection...");

    // ✅ Remove all event listeners to prevent memory leaks
    socket.current.off("myId");
    socket.current.off("finding_users");
    socket.current.off("matched");
    socket.current.off("approach");
    socket.current.off("call");
    socket.current.off("answerCall");
    socket.current.off("connectionEnd");
    socket.current.off("remoteId");
    socket.current.off("receiveMessage");

    // ✅ Stop all tracks in local stream
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    // ✅ Stop all tracks in remote stream
    if (remoteStreamRef.current?.srcObject) {
      remoteStreamRef.current.srcObject.getTracks().forEach((track) => track.stop());
      remoteStreamRef.current.srcObject = null;
    }

    // resetting remote information
    setMyId(null);
    setRemoteId(null);
    setRemoteName(null);
    setMessages([])

    // ✅ Reset Peer Connection
    initializePeerConnection();

    // ✅ Get a new local stream
    await getLocalStream();
    setToggler(true);
    setFindinguser(true);
  };

  const handleBtn = () => {
    if (toggler) {
      connectUser();
      console.log("connected");
      setToggler(false);
    } else {
      socket.current.emit("connectionEnd", { userLeftId: myId, msg: "User left" });
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
        remoteId={remoteId}
        name={name}
        handleBtn={handleBtn}
        setIsZoomed={setIsZoomed}
        isZoomed={isZoomed}
        findinguser={findinguser}
        setVideo={setVideo}
        setAudio={setAudio}
        video={video}
        audio={audio}
        toggleVideoIcon={toggleVideoIcon}
        toggleAudioIcon={toggleAudioIcon}
        messages={messages}
        setMessages={setMessages}
      />
    </>
  );
};

export default Stream;
