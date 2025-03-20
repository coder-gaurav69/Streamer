import React, { createContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_BACKEND_URL, {
      transports: ["websocket"], // Ensures a stable connection
    });

    return () => {
      socket.current.disconnect(); // Cleanup on unmount
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
