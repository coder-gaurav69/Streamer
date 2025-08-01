import React, { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import { SocketProvider } from "./Context/SocketContext";
import { UserProvider } from "./Context/UserContext";
import { PeerProvider } from "./Context/PeerContext";
import LandingPage from "./Pages/LandingPage/LandingPage";
import Stream from "./Pages/Stream/Stream";
import NavigationBar from "./Component/NavigationBar/NavigationBar";
import Login from "./Pages/Login/Login";
import Features from "./Pages/Features/Features";
import Safety from "./Pages/Safety/Safety";
import Chat from "./Pages/Chat/Chat";


const App = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [loginStatus,setLoginStatus] = useState(false);
  return (
    <>
      <SocketProvider>
        <UserProvider>
          <PeerProvider>
            {(!isZoomed && !loginStatus) && <NavigationBar setLoginStatus = {setLoginStatus}/>}
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/user" element={<Home />} />
              <Route path="/Feature" element={<Features />} />
              <Route path="/stream" element={<Stream setIsZoomed={setIsZoomed} isZoomed={isZoomed}/>}/>
              <Route path="/Safety" element={<Safety />} />
              <Route path="/login" element={<Login />} />
              <Route path="/chat" element={<Chat/>} />
            </Routes>
          </PeerProvider>
        </UserProvider>
      </SocketProvider>
      
      
    </>
  );
};


export default App;










