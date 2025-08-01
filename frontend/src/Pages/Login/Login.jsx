import React, { useEffect, useState } from "react";
import vd1 from "../../assets/vd1.mp4";
import { Link } from "react-router-dom";

const Login = ({ setNavigationStatus }) => {
  const [email, setEmail] = useState(" ");
  const [password, setPassword] = useState("password");
  const [fullName, setFullName] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [formType, setFormType] = useState("login");

  const handleformSubmit = (event) => {
    event.preventDefault();
    console.log(email, password);
  };

  const handleSkip = () => {
    setNavigationStatus(true);
  };

  const handleServiceProvider = (url)=>{
    window.open(url,"_self")
  }
  

  return (
    <div className="w-full h-screen relative overflow-hidden flex justify-center items-center">
      {/* Background Video */}
      <video
        className="w-full h-full object-cover absolute top-0 left-0"
        src={vd1}
        autoPlay
        loop
        muted
        playsInline
      ></video>

      {/* Dark Overlay */}
      <div className="hidden sm:flex sm:w-[40%] md:w-[60%] h-screen relative z-10 text-white text-center p-[2%] bg-black bg-opacity-50 shadow-[5px_0_10px_rgba(0,0,0,0.3)] items-center justify-center">
        <h1 className="sm:text-4xl md:text-5xl font-extrabold">Welcome to Streamer</h1>
      </div>

      {/* Login/Sign Up Form */}
      <div className="w-[100%] sm:w-[60%] md:w-[40%] backdrop-blur-[5px] h-screen flex items-center justify-center">
        <form
          onSubmit={handleformSubmit}
          className="w-full  flex items-center justify-center"
        >
          <div className="w-[90%] sm:w-[80%] max-h-fix backdrop-blur-[2px] bg-white bg-opacity-70 rounded-[10px] p-[10px_20px] flex flex-col gap-[5px] shadow-[2px_2px_10px_rgba(255,255,255,0.7),_inset_2px_2px_10px_rgba(255,255,255,0.7)]">
            {/* Logo Section */}
            <div className="text-black text-opacity-70 flex items-center justify-between p-[1%]">
              <h1 className="text-2xl font-bold">Streamer</h1>
              <Link 
                to="/" 
                onClick={handleSkip} 
                className="text-black text-opacity-60 hover:underline"
              >
                Skip
              </Link>
            </div>

            {/* Form Toggle */}
            <div className="bg-white bg-opacity-40 rounded-[5px] flex p-[5px]">
              <div
                className={`flex justify-center items-center flex-1 p-[3px] rounded-[5px] cursor-pointer text-black text-opacity-80 ${
                  formType === "login" ? "bg-white text-black" : ""
                }`}
                onClick={() => setFormType("login")}
              >
                Login
              </div>
              <div
                className={`flex justify-center items-center flex-1 p-[3px] rounded-[5px] cursor-pointer text-black text-opacity-80 ${
                  formType === "signup" ? "bg-white text-black" : ""
                }`}
                onClick={() => setFormType("signup")}
              >
                Sign Up
              </div>
            </div>

            {/* Form Content */}
            <div className="w-full bg-white bg-opacity-50 p-[5px_20px] flex flex-col text-center rounded-[5px] ">
              <h2 className="text-black text-xl font-semibold text-opacity-80 p-[1%] transition-all duration-500">
                {formType === "login" ? "Welcome back" : "Create an account"}
              </h2>
              {formType === "login" ? (
                <h4 className="text-black text-opacity-40 p-[2%] h-[50px]">
                  Enter your credentials to access your account
                </h4>
              ) : (
                <h4 className="text-black text-opacity-40 p-[2%] h-[50px]">
                  Enter your information to get started
                </h4>
              )}

              <div
                className={`flex flex-col text-start w-full transition-[opacity,max-height] duration-700 ease-in-out ${
                  formType === "signup" ? "opacity-100 max-h-[100px]" : "opacity-0 max-h-0"
                } overflow-hidden`}
              >
                <label htmlFor="name1" className="p-[1%] w-full">Full Name</label>
                <input
                  type="text"
                  id="name1"
                  className="p-[2%] rounded-[10px] outline-none border-none w-full"
                  placeholder="Enter your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="flex flex-col text-start w-full">
                <label htmlFor="email1" className="p-[1%] w-full">Email</label>
                <input
                  type="email"
                  id="email1"
                  className="p-[2%] rounded-[10px] outline-none border-none w-full"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col text-start w-full">
                <div className="flex justify-between items-center p-[1%] w-full">
                  <label htmlFor="password1">Password</label>
                  <a href="#" className="text-right">Forget Password?</a>
                </div>
                <div className="flex relative items-center w-full">
                  <input
                    type={passwordType}
                    id="password1"
                    className="p-[2%] rounded-[10px] outline-none border-none w-full"
                    placeholder="12345"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {passwordType === "password" ? (
                    <i
                      className="fa-solid fa-eye absolute right-[10px] cursor-pointer"
                      onClick={() => setPasswordType("text")}
                    ></i>
                  ) : (
                    <i
                      className="fa-solid fa-eye-slash absolute right-[10px] cursor-pointer"
                      onClick={() => setPasswordType("password")}
                    ></i>
                  )}
                </div>
              </div>
              <div className="flex flex-grow items-center justify-center p-[4%_0] w-full">
                <button className="p-[3%_8%] w-full rounded-[10px] text-white bg-black font-bold border-none">
                  Sign In
                </button>
              </div>
            </div>

            {/* Social Login Section */}
            <div className="bg-white bg-opacity-50 flex flex-col gap-[5%] p-[10px] rounded-b-[20px]">
              <div className="flex justify-center gap-[5px] items-center p-[1%]">
                <hr className="border-black border-opacity-20 flex-grow" />
                <h3 className="text-black text-opacity-50">Or continue with</h3>
                <hr className="border-black border-opacity-20 flex-grow" />
              </div>
              <div className="flex justify-evenly items-center p-[1%]">
                <div className="w-[25%] h-[40px] bg-white bg-opacity-80 rounded-[10px] flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 group" onClick={()=>handleServiceProvider("https://support.google.com/mail/answer/56256?hl=en-EN")}>
                
                    <i className="fa-brands fa-google text-black text-opacity-70 group-hover:text-[#0F9D58]"></i>
                  
                </div>
                <div className="w-[25%] h-[40px] bg-white bg-opacity-80 rounded-[10px] flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 group" onClick={()=>handleServiceProvider("https://www.facebook.com/")}>
                  
                    <i className="fa-brands fa-facebook-f text-black text-opacity-70 group-hover:text-[#1877F2]"></i>
                </div>
                  
                <div className="w-[25%] h-[40px] bg-white bg-opacity-80 rounded-[10px] flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 group" onClick={()=>handleServiceProvider("https://x.com/?logout=1740745050096")}>
                    <i className="fa-brands fa-x-twitter text-black text-opacity-70 group-hover:text-[#657786] "></i>
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