import React, { useState } from "react";
import "./NavigationBar.css";
import { Link } from "react-router-dom";

const NavigationBar = ({ setLoginStatus }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <nav className="parentNavbar">
        <div className="childNavbar">
          {/* Logo */}
          <div className="child1">
            <div
              style={{
                padding: "2%",
                background: 'linear-gradient(to right, rgba(0, 123, 255, 0.8), rgba(0, 255, 200, 0.2))',
                borderRadius: "10px",
              }}
            >
              <i className="fa-solid fa-video"></i>
            </div>
            <Link to={"/"}>
              <h2>Streamer</h2>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="child2">
            <Link to={"/"}>Home</Link>
            <Link to={"/feature"}>Feature</Link>
            <Link to={"/safety"}>Safety</Link>
          </div>

          <div className="child3">
            <Link to={"/login"} onClick={()=> setLoginStatus(true)}>Sign In</Link>
            <Link to={"/"}>Start Chat</Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="child4" onClick={toggleMenu}>
            <i className="fa-solid fa-bars"></i>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="responsiveMenu">
          <Link to={"/"} onClick={toggleMenu}>Home</Link>
          <Link to={"/feature"} onClick={toggleMenu}>Feature</Link>
          <Link to={"/safety"} onClick={toggleMenu}>Safety</Link>
          <Link to={"/login"} onClick={() => {()=>setLoginStatus(true)(); toggleMenu();}}>Sign In</Link>
          <Link to={"/"} onClick={toggleMenu}>Start Chat</Link>
        </div>
      )}
    </>
  );
};

export default NavigationBar;
