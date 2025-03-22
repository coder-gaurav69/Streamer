import React, { createContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";



const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
    const socket = useRef(null)
    useEffect(()=>{
      // socket.current = io(import.meta.env.VITE_BACKEND_URL)
      socket.current = io('http://localhost:5000/')
    },[])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
