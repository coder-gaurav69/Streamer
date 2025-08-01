import React, { useContext } from "react";
import img1 from "../../assets/img1.jpg";
import { useNavigate } from "react-router-dom";
import Footer from "../../Component/Footer/Footer";
import { UserContext } from "../../Context/UserContext";

const LandingPage = () => {
  const { setChoice } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div
      className="w-full min-h-screen bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)),url(${img1})`,
      }}
    >
      <div className="backdrop-blur-sm bg-black/10">
        <div className="w-full px-[30px] pt-[30px] pb-[10px] flex flex-col items-center justify-center">
          <div className="w-full md:w-[80%] px-4 py-6">
            <h1 className="text-[40px] md:text-[70px] lg:text-[100px] text-white text-center break-words font-sans py-6">
              Connect Beyond Boundaries
            </h1>
            <p className="text-[18px] md:text-[20px] text-white/50 text-center px-4 md:px-[14%] pb-8">
              Experience real-time connections that transcend language and
              culture. Join millions discovering new perspectives through
              instant video chat.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-[30px] px-4">
              <button
                className="rounded-[20px] px-6 py-4 border-none flex items-center gap-3 text-white/50 bg-gradient-to-br from-[#0d61ec] to-[#de0f82] font-bold transition-all hover:from-[#0d61eca6] hover:to-[#de0f82e6] w-full sm:w-auto justify-center"
                onClick={() => {
                  setChoice("videoChat");
                  navigate("/user");
                }}
              >
                <p>Start VideoChat</p>
                <i className="fa-solid fa-arrow-right transition-all" />
              </button>
              <button
                className="rounded-[20px] px-6 py-4 border-none flex items-center gap-3 text-white/50 bg-gradient-to-br from-[#0d61ec] to-[#de0f82] font-bold transition-all hover:from-[#0d61eca6] hover:to-[#de0f82e6] w-full sm:w-auto justify-center"
                onClick={() => {
                  setChoice("chat");
                  navigate("/user");
                }}
              >
                <p>Start TextChat</p>
                <i className="fa-solid fa-arrow-right transition-all" />
              </button>
            </div>
          </div>

          <div className="w-full md:w-[80%] py-10 px-4">
            <div className="flex flex-col md:flex-row justify-around items-center gap-6">
              <div className="bg-gradient-to-br from-[#64b3f4cc] to-[#c2e59ccc] p-8 rounded-[20px] shadow-[2px_2px_70px_rgba(255,255,255,0.7)] text-center hover:scale-105 duration-300">
                <i className="fa-solid fa-users text-[50px] text-black mb-2" />
                <h1 className="text-[50px] text-white mb-2">1M+</h1>
                <p className="text-white/80 text-[20px]">Active Users</p>
              </div>
              <div className="bg-gradient-to-br from-[#ffc3a0cc] to-[#ff64bdcc] p-8 rounded-[20px] shadow-[2px_2px_70px_rgba(255,255,255,0.7)] text-center hover:scale-105 duration-300">
                <i className="fa-solid fa-globe text-[50px] text-black mb-2" />
                <h1 className="text-[50px] text-white mb-2">150+</h1>
                <p className="text-white/80 text-[20px]">Countries</p>
              </div>
              <div className="bg-gradient-to-br from-[#64b3f4cc] to-[#c2e59ccc] p-8 rounded-[20px] shadow-[2px_2px_70px_rgba(255,255,255,0.7)] text-center hover:scale-105 duration-300">
                <i className="fa-solid fa-video text-[50px] text-black mb-2" />
                <h1 className="text-[50px] text-white mb-2">5M+</h1>
                <p className="text-white/80 text-[20px]">Daily Calls</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[80%] flex flex-col lg:flex-row items-center justify-center text-white py-10 px-4 gap-10">
            <div className="flex items-center justify-center">
              <img
                src="https://www.progressiverehab.ca/wp-content/uploads/2021/11/iStock-1277817960-1-1024x683.jpg"
                alt=""
                className="rounded-[20px] max-w-[200px] object-cover"
              />
            </div>
            <div className="text-center lg:text-left max-w-[600px]">
              <h1 className="text-[28px] md:text-[45px] py-4">Experience the Future of Communication</h1>
              <h3 className="text-white/50 py-4">
                Break down barriers and connect with people from all walks of
                life through our cutting-edge platform.
              </h3>
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="p-4 rounded-full bg-[#1ad47d]">
                    <i className="fa-solid fa-bolt text-[45px] text-white/80" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Lightning Fast Matching</h2>
                    <p className="text-white/50 pt-2">
                      Connect with new people in seconds through our advanced
                      matching algorithm.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="p-4 rounded-full bg-[#1075e884]">
                    <i className="fa-solid fa-shield text-[45px] text-white/80" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Bank-Grade Security</h2>
                    <p className="text-white/50 pt-2">
                      Your privacy and safety are our top priorities with
                      end-to-end encryption.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="p-4 rounded-full bg-[#1ad47d]">
                    <i className="fa-solid fa-earth-africa text-[45px] text-white/80" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Global Reach</h2>
                    <p className="text-white/50 pt-2">
                      Connect with people from over 150 countries and experience
                      diverse cultures.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[80%] text-white text-center py-10 px-4">
            <h1 className="text-[30px] md:text-[50px]">How It Works</h1>
            <h2 className="text-[22px] md:text-[24px]">Start chatting in three simple steps</h2>
            <div className="flex flex-col md:flex-row gap-6 justify-between py-6">
              {[
                ["1", "Allow Camera Access", "Enable your camera and microphone to get started"],
                ["2", "Choose Your Interests", "Select topics you want to discuss"],
                ["3", "Start Chatting", "Get instantly matched with someone new"],
              ].map(([step, title, subtitle], index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-5 gap-2 text-white/80"
                >
                  <div className="w-[70px] h-[70px] rounded-full bg-black/60 text-white text-[25px] flex items-center justify-center">
                    {step}
                  </div>
                  <h2 className="pt-2 text-white">{title}</h2>
                  <h3 className="pt-2">{subtitle}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
