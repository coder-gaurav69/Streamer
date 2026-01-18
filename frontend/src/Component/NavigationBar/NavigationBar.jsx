import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";

const NavigationBar = ({ setLoginStatus }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { setChoice } = useContext(UserContext);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <nav className="fixed top-0 w-full h-[70px] backdrop-blur-md bg-black/60 border-b-2 border-white/20 z-50">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500/80 to-teal-300/20 rounded-lg">
              <i className="fa-solid fa-video text-white/70 text-xl"></i>
            </div>
            <Link to="/">
              <h2 className="text-white/70 text-2xl font-semibold">Streamer</h2>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6 text-white/70 text-lg">
            <Link to="/">Home</Link>
            <Link to="/feature">Feature</Link>
            <Link to="/safety">Safety</Link>
          </div>

          <div className="hidden md:flex gap-6 text-white/70 text-lg">
            <Link to="/login" onClick={() => setLoginStatus(true)}>Sign In</Link>
            <Link to="/user" onClick={() => setChoice('chat')}>Start Chat</Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden text-white/70 text-2xl cursor-pointer" onClick={toggleMenu}>
            <i className="fa-solid fa-bars"></i>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 w-full bg-black text-white flex flex-col items-center gap-4 py-4 z-40">
          <Link to="/" onClick={toggleMenu}>Home</Link>
          <Link to="/feature" onClick={toggleMenu}>Feature</Link>
          <Link to="/safety" onClick={toggleMenu}>Safety</Link>
          <Link to="/login" onClick={() => { setLoginStatus(true); toggleMenu(); }}>Sign In</Link>
          <Link to="/user" onClick={() => { setChoice('chat'); toggleMenu(); }}>Start Chat</Link>
        </div>
      )}
    </>
  );
};

export default NavigationBar;
