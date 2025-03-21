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
    createIceCandidate(remoteId);
    const offervalue = await offer();
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
    // remoteIceCandidate,
    remoteId,
    myId,
  ]) => {
    setRemoteName(remoteName);
    createIceCandidate(remoteId);
    const createdAnswer = await answer(offer);
    receiveIceCandidate();
    socket.current.emit("answerCall", [
      name,
      createdAnswer,
      // iceCandidate,
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
