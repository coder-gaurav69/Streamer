import React, { useRef, useState, useEffect, useContext } from "react";
import img5 from "../../../assets/img5.jpg";
import EmojiPicker from "emoji-picker-react";
import { SocketContext } from "../../../Context/SocketContext";

// Tweak colors here only if you want (leave as in your source CSS)
const videoBg = "rgba(0,0,0,0.05)";
const chatSenderBg = "rgba(23,172,70,0.1)";
const chatRecvBg = "rgba(238,231,231,0.2)";
const micOnBg = "rgba(0,255,0,0.3)";
const micOffBg = "rgba(255,0,0,0.3)";
const btnShadowOn = "2px 2px rgba(0,180,0,0.3)";
const btnShadowOff = "2px 2px rgba(180,0,0,0.3)";

const Video = ({
  setIsZoomed,
  isZoomed,
  localStreamRef,
  remoteStreamRef,
  name,
  remoteName,
  remoteId,
  handleBtn,
  userLeft,
  findinguser,
  setFindinguser,
  audio,
  video,
  setAudio,
  setVideo,
  toggleVideoIcon,
  toggleAudioIcon,
  messages,
  setMessages,
}) => {
  const socket = useContext(SocketContext);
  const parentRef = useRef(null);
  const childRef = useRef(null);
  const [toggleSelect, setToggleSelect] = useState(false);
  const emojiPickerRef = useRef(null);
  const emojiBtnRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ left: 10, top: 10 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [iconsPos, setIconPos] = useState({ left: 10, top: 10 });
  const inputField = useRef(null);
  const [showPicker, setShowPicker] = useState(false);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  const [localStreamMuted, setLocalStreamMuted] = useState(true);
  const [image, setImage] = useState(null);
  const canvasChildRef = useRef();

  const Zoomed = () => {
    setIsZoomed(!isZoomed);
  };

  const handleMouseDown = (e) => {
    if (!childRef.current || !parentRef.current) return;

    const event = e.touches ? e.touches[0] : e;
    setIsDragging(true);

    const childRect = childRef.current.getBoundingClientRect();
    setOffset({
      x: event.clientX - childRect.left,
      y: event.clientY - childRect.top,
    });

    if (e && e.preventDefault) e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !parentRef.current || !childRef.current) return;

    const event = e.touches ? e.touches[0] : e;
    const parentRect = parentRef.current.getBoundingClientRect();
    const childRect = childRef.current.getBoundingClientRect();

    let newX = event.clientX - parentRect.left - offset.x;
    let newY = event.clientY - parentRect.top - offset.y;

    // Constrain inside parent
    newX = Math.max(
      10,
      Math.min(newX, parentRect.width - childRect.width - 10)
    );
    newY = Math.max(
      10,
      Math.min(
        newY,
        parentRect.height - childRect.height - (isZoomed ? 90 : 10)
      )
    );
    setPosition({ left: newX, top: newY });
    if (e && e.preventDefault) e.preventDefault();
  };

  const handleMouseUp = (e) => {
    setIsDragging(false);

    if (!parentRef.current || !childRef.current) return;

    if (e && e.preventDefault) e.preventDefault();

    const parentRect = parentRef.current.getBoundingClientRect();
    const childRect = childRef.current.getBoundingClientRect();

    // Define section boundaries
    const midX = parentRect.width / 2;
    const midY = parentRect.height / 2;

    let snapX, snapY, iconX, iconY;

    if (childRect.left < midX && childRect.top < midY) {
      // Top Left
      snapX = 10;
      snapY = 10;
      iconX = parentRect.width - 50;
      iconY = 10;
    } else if (childRect.left >= midX && childRect.top < midY) {
      // Top Right
      snapX = parentRect.width - childRect.width - 10;
      snapY = 10;
      iconX = 10;
      iconY = 10;
    } else if (childRect.left < midX && childRect.top >= midY) {
      // Bottom Left
      snapX = 10;
      snapY = parentRect.height - childRect.height - (isZoomed ? 90 : 10);
      iconX = parentRect.width - 50;
      iconY = 10;
    } else {
      // Bottom Right
      snapX = parentRect.width - childRect.width - 10;
      snapY = parentRect.height - childRect.height - (isZoomed ? 90 : 10);
      iconX = 10;
      iconY = 10;
    }

    setPosition({ left: snapX, top: snapY });
    setIconPos({ left: iconX, top: iconY });
  };

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages((prev) => [...prev, { msg: input, type: "sender" }]);
    socket.current.emit("sendMessage", {
      remoteId: remoteId,
      msg: input,
      type: "sender",
    });
    setInput("");
    console.log("sent");
  };

  const handleEmojiClick = (emoji) => {
    setInput((prev) => prev + emoji.emoji);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Effect to close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        emojiBtnRef.current &&
        !emojiBtnRef.current.contains(event.target)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const parentElement = parentRef.current;
    const childElement = childRef.current;

    if (!parentElement || !childElement) return;

    if (!window.ResizeObserver) return; // Defensive: skip if unsupported

    const resizeObserver = new ResizeObserver(() => {
      if (!parentRef.current || !childRef.current) return; // Additional safeguard
      const parentRect = parentRef.current.getBoundingClientRect();
      const childRect = childRef.current.getBoundingClientRect();

      setPosition({
        left: parentRect.width - childRect.width - 10,
        top: parentRect.height - childRect.height - (isZoomed ? 90 : 10),
      });

      setIconPos({ left: 10, top: 10 });
    });

    resizeObserver.observe(parentElement);
    return () => {
      resizeObserver.disconnect();
    };
  }, [isZoomed]);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const switchStream = () => {
    if (!localStreamRef.current || !remoteStreamRef.current) return;

    // Swap the actual stream objects
    const localStream = localStreamRef.current.srcObject;
    const remoteStream = remoteStreamRef.current.srcObject;

    localStreamRef.current.srcObject = remoteStream;
    localStreamRef.current.muted = !localStreamMuted;
    remoteStreamRef.current.srcObject = localStream;
    remoteStreamRef.current.muted = localStreamMuted;
    setLocalStreamMuted(!localStreamMuted);
  };

  useEffect(() => {
    if (!socket.current) return;
    const handler = (data) => {
      const { type, msg } = data;
      setMessages((prev) => [...prev, { msg: msg, type: type }]);
      console.log("received");
    };
    socket.current.on("receiveMessage", handler);
    return () => {
      if (socket.current) socket.current.off("receiveMessage", handler);
    };
  }, [socket]);

  // to capture local stream current frame
  const captureFrame = () => {
    const video = localStreamRef?.current;
    const canvas = canvasChildRef?.current;

    if (canvas && video) {
      console.log("capturing...");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/png");
      setImage(imageData);
    }
  };

  // Responsive "my stream" video sizes
  const myVidWidth = screenSize < 500 ? 100 : screenSize < 925 ? 150 : 180;
  const myVidHeight = screenSize < 500 ? 150 : screenSize < 925 ? 110 : 120;

  return (
    <div
      className="w-full min-h-screen flex flex-col justify-center items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)),url(${img5})`,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: !isZoomed ? "72px" : "0",
      }}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
    >
      {/* Tabs for mobile */}
      {!isZoomed && (
        <div
          className={`w-full flex justify-center items-center my-[10px] ${
            screenSize < 925 ? "" : "hidden"
          }`}
        >
          <div className="w-[90%] flex items-center justify-center gap-[20px] bg-white/20 p-[5px] rounded-[10px]">
            <div
              className={`w-1/2 flex items-center justify-center p-[10px] rounded-[10px] cursor-pointer text-base font-semibold
                ${!toggleSelect ? "bg-white/50" : ""}`}
              onClick={() => setToggleSelect(false)}
            >
              Video
            </div>
            <div
              className={`w-1/2 flex items-center justify-center p-[10px] rounded-[10px] cursor-pointer text-base font-semibold
                ${toggleSelect ? "bg-white/50" : ""}`}
              onClick={() => setToggleSelect(true)}
            >
              Chat
            </div>
          </div>
        </div>
      )}

      {/* Main container for video/chat panels */}
      <div
        className="flex w-[90%] gap-[2%] items-end text-[wheat]"
        style={{
          width: isZoomed ? "100%" : "",
          height: isZoomed ? "100vh" : "",
          padding: isZoomed ? "0" : "",
        }}
      >
        {/* --- VIDEO PANEL --- */}
        <div
          className={`flex flex-col items-center justify-center relative rounded-[20px] shadow-lg w-[100%] h-[485px] gap-[2px]`}
          style={{
            background: videoBg,
            display: screenSize < 925 && toggleSelect ? "none" : "flex",
            width: isZoomed ? "100%" : "",
            height: isZoomed ? "100vh" : "",
          }}
        >
          {/* Video area */}
          <div
            className="w-full h-[400px] flex items-center justify-center relative rounded-t-[20px] transition-all"
            style={{
              position: isZoomed ? "absolute" : "relative",
              height: isZoomed ? "100vh" : "",
              borderRadius: isZoomed ? "0" : "20px 20px 0 0",
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(0,0,0,0.5)",
              boxShadow:
                "5px 5px 5px rgba(0,0,0,0.5), inset 5px 5px 100px rgba(0,0,0,1)",
              transition: "0.3s all",
            }}
            ref={parentRef}
          >
            {/* Zoom Icon */}
            <div
              className="absolute z-10"
              onClick={() => setIsZoomed(!isZoomed)}
              style={{
                top: `${iconsPos.top}px`,
                left: `${iconsPos.left}px`,
                color: "rgba(255,255,255,0.6)",
              }}
            >
              <i
                className="fa-solid fa-expand"
                style={{ fontSize: 30, transition: ".3s", padding: 5 }}
              ></i>
            </div>
            {/* Remote video */}
            <video
              className="w-full h-full object-cover object-center rounded-t-[10px] transition-all"
              ref={remoteStreamRef}
              autoPlay
              playsInline
            ></video>


            {/* MY STREAM draggable window */}
            <div
              className="absolute"
              ref={childRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
              style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                cursor: isDragging ? "grabbing" : "grab",
                width: myVidWidth,
                height: myVidHeight,
                background: "rgba(255,255,255,0.4)",
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                backdropFilter: "blur(20px)",
                zIndex: 2,
              }}
            >
              <i
                className="fa-solid fa-expand  right-2 bottom-2 "
                style={{
                  color: "rgba(0,0,0,0.2)",
                  zIndex: 1,
                  padding: 10,
                  cursor: "pointer",
                  display: !video ? "none" : undefined,
                }}
                onClick={switchStream}
              ></i>
              
              <video
                className="absolute w-full h-full rounded-[20px] object-cover object-center"
                ref={localStreamRef}
                autoPlay
                playsInline
                style={{ display: !video ? "none" : "" }}
              />
              <canvas ref={canvasChildRef} style={{ display: "none" }} />
              <img
                className="rounded-[20px]"
                src={image}
                alt="Captured"
                style={{
                  display: video ? "none" : "",
                  width: "100%",
                  height: "100%",
                  filter: "blur(2px)",
                }}
              />
            </div>
            

            {/* Waiting/joining status */}
            {findinguser && (
              <div
                className="flex flex-col items-center justify-center absolute gap-[10px] left-0 right-0 top-0 bottom-0"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  backgroundColor: "rgba(0,0,0,0.4)",
                  borderRadius: 20,
                }}
              >
                <h3 className="text-center p-[5px]">
                  Waiting for Someone to Join
                </h3>
                <div
                  className="flex gap-[10px] w-[150px] h-[40px] rounded-[30px] items-center justify-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                >
                  <div
                    className="w-[18px] h-[18px] rounded-full"
                    style={{
                      background: "blue",
                      animation: "waveMotion 1.5s ease-in-out infinite",
                      animationDelay: "0s",
                    }}
                  ></div>
                  <div
                    className="w-[18px] h-[18px] rounded-full"
                    style={{
                      background: "purple",
                      animation: "waveMotion 1.5s ease-in-out infinite",
                      animationDelay: ".3s",
                    }}
                  ></div>
                  <div
                    className="w-[18px] h-[18px] rounded-full"
                    style={{
                      background: "green",
                      animation: "waveMotion 1.5s ease-in-out infinite",
                      animationDelay: ".5s",
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          {/* Button group */}
          <div
            className="w-full h-[80px] flex gap-[50px] items-center justify-center transition-all"
            style={{
              borderRadius: isZoomed ? 0 : "0 0 20px 20px",
              backgroundColor: isZoomed ? "transparent" : "rgba(0,0,0,0.5)",
              boxShadow: "5px 5px 5px rgba(0,0,0,0.5)",
              transition: ".3s all",
              position:isZoomed?"absolute":"relative",
              bottom:isZoomed?"0":""
            }}
          >
            {/* MIC */}
            <div
              className={`flex items-center justify-center rounded-[10px] w-[40px] p-[10px] text-[20px] cursor-pointer`}
              style={{
                backgroundColor: audio ? micOnBg : micOffBg,
                boxShadow: audio ? btnShadowOn : btnShadowOff,
              }}
              onClick={() => {
                setAudio(!audio);
                toggleAudioIcon();
              }}
            >
              {audio ? (
                <i className="fa-solid fa-microphone"></i>
              ) : (
                <i className="fa-solid fa-microphone-slash"></i>
              )}
            </div>
            {/* VIDEO */}
            <div
              className={`flex items-center justify-center rounded-[10px] w-[40px] p-[10px] text-[20px] cursor-pointer`}
              style={{
                backgroundColor: video ? micOnBg : micOffBg,
                boxShadow: video ? btnShadowOn : btnShadowOff,
              }}
              onClick={() => {
                setVideo(!video);
                toggleVideoIcon();
                video && captureFrame();
              }}
            >
              {video ? (
                <i className="fa-solid fa-video"></i>
              ) : (
                <i className="fa-solid fa-video-slash"></i>
              )}
            </div>
            {/* NEXT */}
            <div
              className="flex items-center justify-center rounded-[10px] w-[40px] p-[10px] text-[20px] cursor-pointer"
              style={{ backgroundColor: micOnBg, boxShadow: btnShadowOn }}
              onClick={handleBtn}
            >
              <i className="fa-solid fa-forward"></i>
            </div>
          </div>
        </div>

        {/* --- CHAT PANEL --- */}
        <div
          className="flex flex-col bg-black/10 rounded-[20px] h-[485px] relative"
          style={{
            display:
              (screenSize < 925 && !toggleSelect) || isZoomed ? "none" : "flex",
            width: screenSize < 925 ? "100%" : "40%",
          }}
        >
          {/* HEADER */}
          <div
            className="w-full h-[50px] flex items-center font-bold text-[24px] justify-center rounded-t-[20px]"
            style={{
              background: "rgba(0,0,0,0.5)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Chat Messages
          </div>
          {/* CHAT LOG */}
          <div
            className="flex-1 w-full p-[10px] flex flex-col gap-[5px] overflow-y-auto"
            style={{ fontSize: 20, backdropFilter: "blur(20px)" }}
          >
            {messages.map(({ msg, type }, index) => (
              <div
                key={index}
                className={`flex w-full items-center font-[18px] ${
                  type === "receiver" ? "justify-start" : "justify-end"
                }`}
                style={{
                  width: "100%",
                  justifyContent:
                    type === "receiver" ? "flex-start" : "flex-end",
                }}
              >
                <div
                  className="flex items-center gap-[10px] p-[5px]"
                  style={{ textAlign: type == "receiver" ? "start" : "end" }}
                >
                  <div
                    className="min-w-[60px] px-[10px] py-[8px] rounded-md text-center"
                    style={{
                      backgroundColor:
                        type === "receiver" ? chatRecvBg : chatSenderBg,
                    }}
                  >
                    {msg}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          {/* Emoji Picker */}
          {showPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute"
              style={{ bottom: 20, left: -10, transform: "scale(0.8)" }}
            >
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
          {/* INPUT ROW */}
          <div
            className="w-full h-[60px] flex items-center justify-center gap-[10px] px-[20px] rounded-b-[20px]"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <button
              ref={emojiBtnRef}
              type="button"
              className="p-[10px] rounded-[10px]"
              style={{
                fontSize: 15,
                backgroundColor: micOnBg,
                color: "rgba(255,255,255,0.7)",
                boxShadow: btnShadowOn,
              }}
              onClick={() => setShowPicker(!showPicker)}
            >
              <i className="fa-solid fa-face-smile"></i>
            </button>
            <input
              ref={inputField}
              type="text"
              className="flex-1 outline-none border-none px-[20px] py-[5px] md:max-w-[90%] max-w-[70%] rounded-full"
              style={{
                color: "rgba(255,255,255,0.5)",
                backgroundColor: "rgba(255,255,255,0.1)",
                fontSize: 18,
              }}
              placeholder="type your message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <button
              className="p-[10px] rounded-[10px]"
              type="button"
              style={{
                fontSize: 15,
                backgroundColor: micOnBg,
                color: "rgba(255,255,255,0.7)",
                boxShadow: btnShadowOn,
              }}
              onClick={sendMessage}
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
