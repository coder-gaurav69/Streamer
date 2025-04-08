import React, { useEffect, useRef, useState, useContext } from "react";
import "./Chat.css";
import EmojiPicker from "emoji-picker-react";
import { SocketContext } from "../../Context/SocketContext";
import Loader from "../../Component/Loader/Loader";
import { UserContext } from "../../Context/UserContext";

const Chat = () => {
  const socket = useContext(SocketContext);
  const {name,category,choice} = useContext(UserContext);
  const [messages, setMessages] = useState([]); // Stores messages
  const [input, setInput] = useState(""); // Stores input value
  const [showPicker, setShowPicker] = useState(false);
  const chatEndRef = useRef(null);
  const inputField = useRef(null);
  const emojiPickerRef = useRef(null);
  const emojiBtnRef = useRef(null);
  const [toggleBtn, setToggleBtn] = useState(false);
  const [myId,setMyId] = useState(null)
  const [remoteId,setRemoteId] = useState(null)

  
  const sendMessage = () => {
    if (input.trim() === "") return;

    // Add new message to the state
    setMessages((prev) => [...prev, { msg: input, type: "sender" }]);

    // Emit message via socket if needed
    socket.current.emit("sendMessage", { remoteId, msg: input, type: "sender" });

    setInput(""); // Clear input state
    inputField.current.value = ""; // Clear input field
    console.log('send')
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle emoji selection
  const handleEmojiClick = (emoji) => {
    setInput((prev) => prev + emoji.emoji);
  };

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

  const connect = ()=>{
    console.log('hello')
    socket.current.emit("AnyUser", [name, category,choice]);

    // off the older sockets
    socket.current.off("myId");

    // new connection
    socket.current.on("myId",(myId)=>{
      setMyId(myId);
    });

    socket.current.on('remoteId',(remoteId)=>{
      setRemoteId(remoteId)
      setToggleBtn(true)
    })
    socket.current.on('connection',(data)=>{
      const [remoteName,remoteId,myId] = data
      setRemoteId(remoteId);
      setToggleBtn(true)
    })

    socket.current.on('connectionEnd',(data)=>{
      console.log(data);
      setMessages([]);
      setMyId(null)
      setRemoteId(null)
      setToggleBtn(false)
      // socket.current.emit('connectionEnd',{userLeftId:myId});
    })
    console.log('connect')
    
  }

  const disconnect = ()=>{
    setToggleBtn(false)
    console.log('disconnect')
    socket.current.emit('connectionEnd',{userLeftId:myId});
    socket.current.off('myId');
    socket.current.off('remoteId');
    socket.current.off('connectionEnd');
    setMessages([])
    setMyId(null);
    setRemoteId(null)
  }

  useEffect(()=>{
    if(!socket.current) return;
    socket.current.on('receiveMessage',(data)=>{
      const { msg, type } = data;
      setMessages((prev)=>[...prev,{msg:msg,type:type}]);
      console.log('received');
    })

    

    return ()=>{
      socket.current.off('receiveMessage');
      socket.current.emit('connectionEnd');
    }
  },[])

  useEffect(()=>{
    console.log('myId:',myId,'remoteId:',remoteId)
  },[myId,remoteId])

  return (
    <div className="chatContainer">
      {/* Header */}
      <div
        className="chatContainer-child1"
        style={{
          justifyContent: !toggleBtn ? "end" : "space-between",
        }}
      >
        {toggleBtn && (
          <div className="chatContainer-child1-1" >
            <div>
              <i className="fa-regular fa-user"></i>
            </div>
            <div>
              <h2>Random Stranger</h2>
              <p>Online</p>
            </div>
          </div>
        )}

        <button
          className={
            toggleBtn
              ? "chatContainer-child1-2 red"
              : "chatContainer-child1-2 blue"
          }
          onClick={() =>{!toggleBtn?connect():disconnect()}}
        >
          {toggleBtn ? "End Chat" : "Find Someone"}
        </button>
      </div>

      {/* Chat Messages */}
      <div
        className="chatContainer-child2"
        style={{
          alignItems: toggleBtn ? "start" : "center",
          justifyContent: toggleBtn ? "" : "center",
        }}
      >
        {toggleBtn &&
          messages.map(({ msg, type }, index) => (
            <div
              key={index}
              style={{
                alignSelf: type === "receiver" ? "start" : "end",
                padding: "10px",
                borderRadius:
                  type === "receiver"
                    ? "0px 10px 10px 10px"
                    : "10px 10px 0 10px",
                backgroundColor:
                  type === "receiver"
                    ? "rgba(0,0,0,0.09)"
                    : "rgba(0,255,0,0.2)",
              }}
            >
              {msg}
            </div>
          ))}

        {/* Loader */}

        {!toggleBtn && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <Loader />
            <h3>Finding someone to chat with...</h3>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Emoji Picker */}
      {showPicker && (
        <div
          className="emoji"
          ref={emojiPickerRef}
          style={{
            position: "absolute",
            zIndex: 10,
            bottom: "100px",
            left: "20px",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      {/* Input & Emoji Button */}
      <div className="chatContainer-child3"
        style={{
          // background:toggleBtn?'rgba(255,255,255,0.5)':''
          opacity:!toggleBtn?'0.5':'1'
        }}
      >
        {/* Emoji Button */}
        <div
          ref={emojiBtnRef}
          className="emojiBtn"
          onClick={(e) => {
            if (!toggleBtn) return; // Block clicks
            e.stopPropagation();
            setShowPicker((prev) => !prev);
          }}
          style={{
            cursor: !toggleBtn ? "not-allowed" : "pointer", // Show the ban cursor
          }}
        >
          <i
            className="fa-solid fa-face-smile"
            style={{
              pointerEvents: !toggleBtn ? "none" : "auto", // Disable emoji button interaction
            }}
          ></i>
        </div>

        {/* Input Field */}
        <input
          type="text"
          ref={inputField}
          value={input}
          onChange={(e) => {
            if (!toggleBtn) return; // Block typing
            setInput(e.target.value);
          }}
          onKeyDown={(e) => {
            if (!toggleBtn) return; // Block Enter key
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Type your message...."
          style={{
            cursor: !toggleBtn ? "not-allowed" : "text", // Show ban cursor
          }}
          disabled={!toggleBtn} // Disable input
        />

        {/* Send Button */}
        <button
          onClick={(e) => {
            if (!toggleBtn) return; // Block clicking
            sendMessage();
          }}
          style={{
            cursor: !toggleBtn ? "not-allowed" : "pointer", // Show ban cursor
          }}
          disabled={!toggleBtn} // Disable button
        >
          <i className="fa-solid fa-paper-plane"></i>
          <p>Send</p>
        </button>
      </div>
    </div>
  );
};

export default Chat;
