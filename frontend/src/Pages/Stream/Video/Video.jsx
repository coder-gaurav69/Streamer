import React, { useRef, useState, useEffect,useContext } from "react";
import "./Video.css";
import img5 from "../../../assets/img5.jpg";
import EmojiPicker from "emoji-picker-react";
import { SocketContext } from "../../../Context/SocketContext";

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
  setMessages
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
  const [toggleStream,setToggleStream] = useState(false)
  const [localStreamMuted,setLocalStreamMuted] = useState(true)
  const [image , setImage] = useState(null)
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

    e.preventDefault();
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
    e.preventDefault();
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
    socket.current.emit('sendMessage',{remoteId:remoteId,msg:input,type:'sender'})
    inputField.current.value = "";
    setInput("");
    console.log('send')
  };

  const handleEmojiClick = (emoji) => {
    setInput((prev) => prev + emoji.emoji);
    inputField.current.value = input + emoji.emoji; 
    inputField.current.scrollLeft = inputField.current.scrollWidth;
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
    window.addEventListener("resize", () => {
      setScreenSize(window.innerWidth);
    });
  }, []);

  const switchStream = () => {
    if (!localStreamRef.current || !remoteStreamRef.current) return;
  
    // Swap the actual stream objects
    const localStream = localStreamRef.current.srcObject; //mine other
    const remoteStream = remoteStreamRef.current.srcObject; // other mine
  
    localStreamRef.current.srcObject = remoteStream; //other mine
    localStreamRef.current.muted = !localStreamMuted; // false true
    remoteStreamRef.current.srcObject = localStream; // mine other
    remoteStreamRef.current.muted = localStreamMuted; // true false
    setLocalStreamMuted(!localStreamMuted)
  };

  useEffect(()=>{
    if(!socket.current) return;
    socket.current.on('receiveMessage',(data)=>{
      const {type,msg} = data;
      setMessages((prev) => [...prev, { msg:msg, type:type }]);
      console.log('received')
    })
    return ()=>{
      socket.current.off('receiveMessage')
    }
  },[])

  // to capture local stream current frame
  const captureFrame = ()=>{
    const video = localStreamRef.current;
    const canvas = canvasChildRef.current;

    if(canvas && video){
      console.log('capturing...')
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video,0,0,canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');
      setImage(imageData);
    }
  }




  return (
    <div
      className="main"
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: !isZoomed ? "72px 0 0 0" : "0",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)),url(${img5})`,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
        // gap:'20px'
      }}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
    >
      {/* selection of text and video part for smaller screen*/}
      {!isZoomed && (
        <div className="selectionPart">
          <div className="selectionDiv">
            <div
              className="selectionDiv-child"
              style={{
                backgroundColor: !toggleSelect
                  ? "rgba(255, 255, 255, 0.5)"
                  : "",
              }}
              onClick={() => setToggleSelect(false)}
              onTouchStart={() => setToggleSelect(false)}
            >
              <h3>Video</h3>
            </div>

            <div
              className="selectionDiv-child"
              style={{
                backgroundColor: toggleSelect ? "rgba(255, 255, 255, 0.5)" : "",
              }}
              onClick={() => setToggleSelect(true)}
              onTouchStart={() => setToggleSelect(true)}
            >
              <h3>Chat</h3>
            </div>
          </div>
        </div>
      )}

      <div
        className="mainContainer"
        style={{
          width: isZoomed ? "100%" : "",
          height: isZoomed ? "100vh" : "",
          padding: isZoomed ? "0" : "",
        }}
      >
        {/* videoContainer */}
        <div
          className="videoContainer"
          style={{
            width: isZoomed ? "100%" : "",
            height: isZoomed ? "100vh" : "",
            bottom: isZoomed ? "0px" : "",
            display: screenSize < 925 && toggleSelect ? "none" : "flex",
          }}
        >
          <div
            className="video"
            style={{
              height: isZoomed ? "100vh" : "",
              position: isZoomed ? "absolute" : "relative",
              borderRadius: isZoomed ? "0" : "",
            }}
            ref={parentRef}
          >
            <video
              className="remoteStream"
              ref={remoteStreamRef}
              autoPlay
              playsInline
            ></video>

            <div
              className="mystream"
              style={{
                position: "absolute",
                top: `${position.top}px`,
                left: `${position.left}px`,
                cursor: isDragging ? "grabbing" : "grab",
              }}
              ref={childRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            >
              <video
                className="localStream"
                ref={localStreamRef}
                autoPlay
                playsInline
                style={{
                  display:!video?'none':''
                }}
              ></video>
              <canvas ref={canvasChildRef} style={{display:'none'}}></canvas>
              <img className="captureImage" src={image} alt="Captured" style={{
                  display:video?'none':'',
              }}/>
              <i className="fa-solid fa-expand" onClick={switchStream} onTouchStart={switchStream} style={{
                display:!video?'none':''
              }}></i>
            </div>
            <div
              className="zoomIcon"
              onClick={Zoomed}
              onTouchStart={Zoomed}
              style={{
                position: "absolute",
                top: `${iconsPos.top}px`,
                left: `${iconsPos.left}px`,
              }}
            >
              <i className="fa-solid fa-expand"></i>
            </div>
            {findinguser && (
              <div className="waiting">
                <h3>Waiting for Someone to Join</h3>
                <div className="ballContainer">
                  <div className="balls"></div>
                  <div className="balls"></div>
                  <div className="balls"></div>
                </div>
              </div>
            )}
          </div>

          <div
            className="btndiv"
            style={{
              position: isZoomed ? "absolute" : "relative",
              bottom: isZoomed ? "0" : "",
              borderRadius: isZoomed ? "0" : "",
              backgroundColor: isZoomed ? "transparent" : "",
            }}
          >
            <div
              className={`icons ${audio?'audio_on':'audio_off'}`}
              onClick={() => {
                setAudio(!audio);
                toggleAudioIcon();
              }}
              onTouchStart={() => {
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

            <div
              className={`icons ${video?'video_on':'video_off'}`}
              onClick={() => {
                setVideo(!video);
                toggleVideoIcon();
                video && captureFrame();
              }}
              onTouchStart={() => {
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

            <div className="icons next" onClick={handleBtn} onTouchStart={handleBtn}
            >
              <i className="fa-solid fa-forward"></i>
            </div>
          </div>
        </div>

        {/* messageContainer */}
        <div
          className="messageContainer"
          style={{
            display:
              (screenSize < 925 && !toggleSelect) || isZoomed ? "none" : "flex",
          }}
        >
          <div className="logo">Chat Messages</div>
          <div className="messageBox">
            {messages.map(({ msg, type }, index) => (
              <div
                className="chat"
                key={index}
                style={{
                  alignSelf: type === "receiver" ? "flex-start" : "flex-end",
                  width: "75%",
                  justifyContent:
                    type === "receiver" ? "flex-start" : "flex-end",
                }}
              >
                <div
                  className="msgboxchild"
                  style={{
                    // width: "100%",
                    display: "flex",
                    alignItems: "center",
                    textAlign: type == "receiver" ? "start" : "end",
                    gap: "10px",
                    padding: "5px",
                    fontSize: "18px",
                  }}
                >
                  <div
                    className="chatmessage"
                    style={{
                      backgroundColor:
                        type === "receiver"
                          ? "rgba(238, 231, 231, 0.2)"
                          : "rgba(23, 172, 70, 0.1)",
                    }}
                  >
                    {msg}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Emoji Picker - Clicking outside hides it */}
          {showPicker && (
            <div
              ref={emojiPickerRef}
              style={{
                position: "absolute",
                bottom: "20px",
                left: "-10px",
                transform: "scale(0.8)",
              }}
            >
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}

          {/* Input Field */}
          <div className="inputField">
            <button
              ref={emojiBtnRef}
              className="emojiBtn"
              onClick={() => setShowPicker(!showPicker)}
            >
              <i className="fa-solid fa-face-smile"></i>
            </button>
            <input
              ref={inputField}
              type="text"
              placeholder="type your message"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <button className="sendBtn" onClick={sendMessage}>
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;



