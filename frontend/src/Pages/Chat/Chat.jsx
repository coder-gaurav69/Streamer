import { useEffect, useRef, useState, useContext } from "react";
import EmojiPicker from "emoji-picker-react";
import { SocketContext } from "../../Context/SocketContext";
import Loader from "../../Component/Loader/Loader";
import { UserContext } from "../../Context/UserContext";

const Chat = () => {
  const socket = useContext(SocketContext);
  const { name, category, choice } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const chatEndRef = useRef(null);
  const inputField = useRef(null);
  const emojiPickerRef = useRef(null);
  const emojiBtnRef = useRef(null);
  const [toggleBtn, setToggleBtn] = useState(false);
  const [myId, setMyId] = useState(null);
  const [remoteId, setRemoteId] = useState(null);

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages((prev) => [...prev, { msg: input, type: "sender" }]);
    socket.current.emit("sendMessage", {
      remoteId,
      msg: input,
      type: "sender",
    });
    setInput("");
    inputField.current.value = "";
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleEmojiClick = (emoji) => {
    setInput((prev) => prev + emoji.emoji);
  };

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const connect = () => {
    console.log("Connecting to chat...");

    // Remove previous listeners to prevent duplicates
    socket.current.off("myId");
    socket.current.off("remoteId");
    socket.current.off("connection");
    socket.current.off("connectionEnd");

    socket.current.emit("AnyUser", [name, category, choice]);

    socket.current.on("myId", (id) => {
      console.log("My chat ID:", id);
      setMyId(id);
    });

    socket.current.on("remoteId", (id) => {
      console.log("Connected to remote user:", id);
      setRemoteId(id);
      setToggleBtn(true);
    });

    socket.current.on("connection", ([remoteName, remoteId]) => {
      console.log("Connection established with:", remoteName);
      setRemoteId(remoteId);
      setToggleBtn(true);
    });

    socket.current.on("connectionEnd", () => {
      console.log("Chat connection ended");
      setMessages([]);
      setMyId(null);
      setRemoteId(null);
      setToggleBtn(false);
    });
  };

  const disconnect = () => {
    console.log("Disconnecting from chat...");
    setToggleBtn(false);

    if (myId) {
      socket.current.emit("connectionEnd", { userLeftId: myId });
    }

    // Clean up event listeners
    socket.current.off("myId");
    socket.current.off("remoteId");
    socket.current.off("connection");
    socket.current.off("connectionEnd");

    setMessages([]);
    setMyId(null);
    setRemoteId(null);
  };

  useEffect(() => {
    if (!socket.current) return;
    socket.current.on("receiveMessage", ({ msg, type }) => {
      setMessages((prev) => [...prev, { msg, type }]);
    });
    return () => {
      socket.current.off("receiveMessage");
      socket.current.emit("connectionEnd");
    };
  }, []);

  return (
    <div className="w-full h-screen flex flex-col bg-[whitesmoke]">
      <div
        className={`w-full mt-[90px] px-[18%] h-[70px] bg-white flex items-center justify-${toggleBtn ? "between" : "end"
          } shadow-md`}
      >
        {toggleBtn && (
          <div className="flex items-center justify-center gap-[30px]">
            <div className="p-[10px] flex items-center justify-center bg-blue-200 rounded-full text-[20px]">
              <i className="fa-regular fa-user" />
            </div>
            <div>
              <h2 className="text-lg">Random Stranger</h2>
              <p className="text-green-600">Online</p>
            </div>
          </div>
        )}


        <button
          className={`px-5 py-2 rounded-full text-base font-medium transition-all flex justify-end duration-500 ${toggleBtn
              ? "text-red-400 bg-red-100 hover:bg-red-300"
              : "text-white bg-indigo-600 hover:bg-indigo-700"
            }`}
          onClick={() => (!toggleBtn ? connect() : disconnect())}
        >
          {toggleBtn ? "End Chat" : "Find Someone"}
        </button>
      </div>

      <div
        className="w-full flex flex-col gap-2 px-[18%] py-5 bg-gray-50 flex-grow overflow-y-scroll shadow-inner scrollbar-hide"
        style={{
          alignItems: toggleBtn ? "start" : "center",
          justifyContent: toggleBtn ? "" : "center",
        }}
      >
        {toggleBtn ? (
          messages.map(({ msg, type }, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg max-w-[80%] ${type === "receiver"
                  ? "self-start bg-black/10 rounded-tl-none"
                  : "self-end bg-green-200 rounded-tr-none"
                }`}
            >
              {msg}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <Loader />
            <h3 className="text-lg">Finding someone to chat with...</h3>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {showPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute z-10 bottom-[100px] left-[20px] bg-white rounded-lg shadow-lg"
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <div
        className={`w-full h-[80px] flex items-center justify-center gap-5 px-5 bg-white shadow-inner ${!toggleBtn ? "opacity-50" : "opacity-100"
          }`}
      >
        <div
          ref={emojiBtnRef}
          className="w-[40px] h-[40px] shrink-0 bg-indigo-700 flex items-center justify-center rounded-full text-white text-lg cursor-pointer"
          onClick={(e) => {
            if (!toggleBtn) return;
            e.stopPropagation();
            setShowPicker((prev) => !prev);
          }}
        >
          <i className="fa-solid fa-face-smile pointer-events-auto" />
        </div>

        <input
          type="text"
          ref={inputField}
          value={input}
          onChange={(e) => toggleBtn && setInput(e.target.value)}
          onKeyDown={(e) => toggleBtn && e.key === "Enter" && sendMessage()}
          placeholder="Type your message...."
          disabled={!toggleBtn}
          className="w-[80%] h-[40px] rounded-full px-4 text-lg text-black/60 bg-gray-100 border border-black/20 outline-none cursor-text"
        />

        <button
          onClick={() => toggleBtn && sendMessage()}
          disabled={!toggleBtn}
          className="h-[40px] flex items-center justify-center gap-3 px-6 rounded-full text-white bg-indigo-600 hover:bg-indigo-700 text-lg"
        >
          <i className="fa-solid fa-paper-plane text-xl" />
          <p className="font-normal">Send</p>
        </button>
      </div>
    </div>
  );
};

export default Chat;
