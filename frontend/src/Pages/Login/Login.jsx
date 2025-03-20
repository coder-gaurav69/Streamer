import React, { useEffect, useState } from "react";
import "./Login.css";
import vd1 from "../../assets/vd1.mp4";
import { Link } from "react-router-dom";

const Login = ({setNavigationStatus}) => {
  const [email, setEmail] = useState(" ");
  const [password, setPassword] = useState("password");
  const [fullName, setFullName] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [formType, setFormType] = useState("login");

  const handleformSubmit = (event) => {
    event.preventDefault();
    console.log(email, password);
  };

  const handleSkip = ()=>{
    setNavigationStatus(true)
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent:'center',
        alignItems:'center'
      }}
    >
      {/* Background Video */}
      <video
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: "0",
          left: "0",
        }}
        src={vd1}
        autoPlay
        loop
        muted
        playsInline
      ></video>

      {/* Dark Overlay */}
      <div
        className="dark"
        style={{
          width: "60%", // Ensure it matches the video width
          position: "relative",
          zIndex: "1",
          color: "white",
          textAlign: "center",
          height: "100vh",
          padding: "2%",
          background: "rgba(0,0,0,0.5)",
          boxShadow: "5px 0 10px rgba(0,0,0,0.3)",
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          fontSize:'30px',
          // backdropFilter:'blur(100px)'
        }}
      >
        <h1>Welcome to Streamer</h1>
      </div>

      {/* Login/Sign Up Form */}
      <div
        className="loginDiv"
        style={{
          width: "40%",
          height: "100vh",
          // background: "rgba(255,255,255,0.5)",
          // background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(5px)",
          position: "relative",
          // display:'flex',
          // alignItems:'center',
          // justifyContent:'center'
        }}
      >
        <form
          onSubmit={handleformSubmit}
          style={{
            padding: "10px",
            width: "100%",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="formChildDiv">
            <div
              className="logo"
            >
              <h1>Streamer</h1>
              <Link to={'/'} onClick={handleSkip}>Skip</Link>
            </div>
            <div className="firstChild">
              <div
                style={
                  formType === "login"
                    ? {
                        backgroundColor: "white",
                        color: "rgba(0,0,0,1)",
                      }
                    : {}
                }
                onClick={() => setFormType("login")}
              >
                Login
              </div>
              <div
                onClick={() => setFormType("signup")}
                style={
                  formType === "signup"
                    ? {
                        backgroundColor: "white",
                        color: "rgba(0,0,0,1)",
                      }
                    : {}
                }
              >
                Sign Up
              </div>
            </div>
            <div className="secondChild">
              
              <h2 style={{
                transition:'0.5s',
              }}>
                {formType === "login" ? (
                  'Welcome back'
                ) : (
                  'Create an account'
                )}
              </h2>
              {formType === "login" ? (
                <h4>Enter your credentials to access your account</h4>
              ) : (
                <h4>Enter your information to get started</h4>
              )}

              <div
                className="fullName"
                style={{
                  opacity: formType === "signup" ? "1" : "0",
                  maxHeight: formType === "signup" ? "100px" : "0",
                  overflow: "hidden",
                  transition: "opacity 0.7s, max-Height 0.7s ease-in-out",
                }}
              >
                <label htmlFor="name1">Full Name</label>
                <input
                  type="text"
                  id="name1"
                  className="name"
                  placeholder="Enter your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="emailDiv">
                <label htmlFor="email1">Email</label>
                <input
                  type="email"
                  id="email1"
                  className="email"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="passwordDiv">
                <div className="passwordDivchild1">
                  <label htmlFor="password1">Password</label>
                  <a href="#" style={{textAlign:'end'}}>Forget Password?</a>
                </div>
                <div className="passwordDivchild2">
                  <input
                    type={passwordType}
                    id="password1"
                    className="password"
                    placeholder="12345"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {passwordType === "password" ? (
                    <i
                      className="fa-solid fa-eye"
                      onClick={() => setPasswordType("text")}
                    ></i>
                  ) : (
                    <i
                      className="fa-solid fa-eye-slash"
                      onClick={() => setPasswordType("password")}
                    ></i>
                  )}
                </div>
              </div>
              <div className="btnDiv">
                <button>Sign In</button>
              </div>
            </div>
            <div className="thirdChild">
              <div className="thirdChild-1">
                <hr />
                <h3>Or continue with</h3>
                <hr />
              </div>
              <div className="thirdChild-2">
                <div>
                  <a href="https://support.google.com/mail/answer/56256?hl=en-EN">
                    <i className="fa-brands fa-google"></i>
                  </a>
                </div>
                <div>
                  <a href="https://www.facebook.com/">
                    <i className="fa-brands fa-facebook-f"></i>
                  </a>
                </div>
                <div>
                  <a href="https://x.com/?logout=1740745050096">
                    <i className="fa-brands fa-x-twitter"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
