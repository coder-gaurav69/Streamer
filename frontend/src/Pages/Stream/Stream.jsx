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
    remoteStreamRef,
    initializePeerConnection,
  } = useContext(PeerContext);

  const localStreamRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [toggler, setToggler] = useState(true);
  const [myId, setMyId] = useState(null);
  const [remoteName, setRemoteName] = useState(null);
  const [remoteId, setRemoteId] = useState(null);
  const [findingUser, setFindingUser] = useState(true);

  const getLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { frameRate: 30 },
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });

      if (stream && localStreamRef.current) {
        localStreamRef.current.srcObject = stream;
        localStreamRef.current.muted = true;
        await addingTrack(stream);
        setLocalStream(stream);
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const toggleVideo = () => {
    const videoTrack = localStream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
  };

  const toggleAudio = () => {
    const audioTrack = localStream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
  };

  const connectUser = () => {
    setFindingUser(true);
    socket.current.emit("AnyUser", [name, category]);
    socket.current.on("myId", (id) => setMyId(id));
    socket.current.off("approach").on("approach", approach);
    socket.current.off("call").on("call", answerCall);
    socket.current.off("answerCall").on("answerCall", accept);
    socket.current.off("connectionEnd").on("connectionEnd", handleDisconnection);
  };

  const approach = async ([remoteName, remoteId, myId]) => {
    setRemoteId(remoteId);
    setRemoteName(remoteName);
    const offervalue = await offer();
    socket.current.emit("call", [name, offervalue, myId, remoteId]);
  };

  const answerCall = async ([remoteName, offer, remoteId, myId]) => {
    setRemoteName(remoteName);
    const createdAnswer = await answer(offer);
    socket.current.emit("answerCall", [name, createdAnswer, remoteId, myId]);
    setFindingUser(false);
  };

  const accept = async ([remoteName, answer, myId, remoteId]) => {
    await acceptingAnswer(answer);
    socket.current.emit("connectionEstablished", [myId, remoteId]);
    setFindingUser(false);
  };

  const handleDisconnection = async () => {
    console.log("Disconnected");

    socket.current.emit("connectionEnd", { userLeftId: myId });

    if (remoteStreamRef.current) {
      remoteStreamRef.current.srcObject = null;
    }

    initializePeerConnection();
    await getLocalStream();
    setToggler(true);
    setFindingUser(true);
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

  useEffect(() => {
    getLocalStream();

    return () => {
      socket.current.off("approach");
      socket.current.off("call");
      socket.current.off("answerCall");
      socket.current.off("connectionEnd");
    };
  }, []);

  return (
    <Video
      localStreamRef={localStreamRef}
      remoteStreamRef={remoteStreamRef}
      toggler={toggler}
      remoteName={remoteName}
      name={name}
      handleBtn={handleBtn} // ✅ Now properly defined
      setIsZoomed={setIsZoomed}
      isZoomed={isZoomed}
      findingUser={findingUser}
      toggleVideo={toggleVideo}
      toggleAudio={toggleAudio}
    />
  );
};

export default Stream;
