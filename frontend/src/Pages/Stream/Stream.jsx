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
  const [localStream, setLocalStream] = useState(null);
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
        video: { frameRate: 30 },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      if (stream && localStreamRef.current) {
        localStreamRef.current.srcObject = stream;
        localStreamRef.current.muted = "true";
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
    setRemoteName(remoteName);
    setRemoteId(remoteId)
    createIceCandidate(remoteId);
    const createdAnswer = await answer(offer);
    receiveIceCandidate();
    socket.current.emit("answerCall", [name, createdAnswer, remoteId, myId]);
    setFindinguser(false);
  };

  const accept = async ([remoteName, answer, myId, remoteId]) => {
    await acceptingAnswer(answer);
    receiveIceCandidate();
    socket.current.emit("connectionEstablished", [myId, remoteId]);
    setFindinguser(false);
  };

  const connectUser = () => {
    socket.current.emit("AnyUser", [name, category]);

    // ✅ Remove previous event listeners to prevent duplicates
    socket.current.off("myId");
    socket.current.off("finding_users");
    socket.current.off("approach");
    socket.current.off("call");
    socket.current.off("answerCall");
    socket.current.off("connectionEnd");

    // ✅ Attach new event listeners
    socket.current.on("myId", (id) => setMyId(id));
    socket.current.on("finding_users", console.log);
    socket.current.on("approach", approach);
    socket.current.on("call", answerCall);
    socket.current.on("answerCall", accept);

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
      if (remoteStreamRef.current?.srcObject) {
        remoteStreamRef.current.srcObject.getTracks().forEach((track) => track.stop());
        remoteStreamRef.current.srcObject = null;
      }
    };
  }, []);

  const handleDisconnection = async () => {
    console.log("Disconnected");

    // ✅ Notify the server about disconnection
    socket.current.emit("connectionEnd", { userLeftId: myId, msg: "User left" });

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
        remoteId = {remoteId}
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
      />
    </>
  );
};

export default Stream;
