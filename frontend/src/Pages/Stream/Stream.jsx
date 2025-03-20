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
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });

      if (stream) {
        localStreamRef.current.srcObject = stream;
        localStreamRef.current.muted = true;
        await addingTrack(stream);
        setLocalStream(stream);
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const approach = async ([remoteName, remoteId, myId]) => {
    setRemoteId(remoteId);
    setRemoteName(remoteName);
    const offervalue = await offer();
    const iceCandidate = await createIceCandidate();
    socket.current.emit("call", [name, offervalue, iceCandidate, myId, remoteId]);
  };

  const answerCall = async ([remoteName, offer, remoteIceCandidate, remoteId, myId]) => {
    setRemoteName(remoteName);
    const createdAnswer = await answer(offer);
    await receiveIceCandidate(remoteIceCandidate);
    const iceCandidate = await createIceCandidate();
    socket.current.emit("answerCall", [name, createdAnswer, iceCandidate, remoteId, myId]);
    setFindinguser(false);
  };

  const accept = async ([remoteName, answer, remoteIceCandidate, myId, remoteId]) => {
    await acceptingAnswer(answer);
    await receiveIceCandidate(remoteIceCandidate);
    socket.current.emit("connectionEstablished", [myId, remoteId]);
    setFindinguser(false);
  };

  const connectUser = () => {
    socket.current.emit("AnyUser", [name, category]);
    socket.current.on("myId", (id) => setMyId(id));
    socket.current.off("approach").on("approach", approach);
    socket.current.off("call").on("call", answerCall);
    socket.current.off("answerCall").on("answerCall", accept);
    socket.current.on("connectionEnd", handleDisconnection);
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

  const handleDisconnection = async () => {
    socket.current.emit("connectionEnd", { userLeftId: myId, msg: "User left" });
    if (remoteStreamRef.current) remoteStreamRef.current.srcObject = null;
    initializePeerConnection();
    await getLocalStream();
    setToggler(true);
    setFindinguser(true);
  };

  return (
    <Video
      localStreamRef={localStreamRef}
      remoteStreamRef={remoteStreamRef}
      toggler={toggler}
      remoteName={remoteName}
      name={name}
      handleBtn={connectUser}
      setIsZoomed={setIsZoomed}
      isZoomed={isZoomed}
      findinguser={findinguser}
      setVideo={setVideo}
      setAudio={setAudio}
      video={video}
      audio={audio}
      toggleVideoIcon={() => setVideo((prev) => !prev)}
      toggleAudioIcon={() => setAudio((prev) => !prev)}
    />
  );
};

export default Stream;
