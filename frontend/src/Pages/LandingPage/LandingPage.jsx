import React from "react";
import "./LandingPage.css";
import img1 from "../../assets/img1.jpg";
import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";

const LandingPage = () => {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)),url(${img1})`,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
        // pointerEvents: "none",
      }}
    >
      <div
        style={{
          backdropFilter: "blur(5px)",
          background: "rgba(0,0,0, 0.1)",
        }}
      >
        {/* body part */}
        <div className="mainBody">
          <div className="body1">
            <h1>Connect Beyond Boundaries</h1>
            <p>
              Experience real-time connections that transcend language and
              culture. Join millions discovering new perspectives through
              instant video chat.
            </p>
            <div className="btnOption">
              <button>
                <Link to="/user">
                  <p>Start VideoChat</p>
                </Link>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
              <button>
                <Link to="/user">
                  <p>Start TextChat</p>
                </Link>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <div className="body2">
            <div>
              <div className="box1">
                <i className="fa-solid fa-users"></i>
                <h1>1M+</h1>
                <p>Active Users</p>
              </div>
              <div className="box2">
                <i className="fa-solid fa-globe"></i>
                <h1>150+</h1>
                <p>Countries</p>
              </div>
              <div className="box3">
                <i className="fa-solid fa-video"></i>
                <h1>5M+</h1>
                <p>Daily Calls</p>
              </div>
            </div>
          </div>

          <div className="body3">
            <div className="body3Child1">
              <img
                src="https://www.progressiverehab.ca/wp-content/uploads/2021/11/iStock-1277817960-1-1024x683.jpg"
                alt=""
              />
            </div>
            <div className="body3Child2">
              <h1>Experience the Future of Communication</h1>
              <h3>
                Break down barriers and connect with people from all walks of
                life through our cutting-edge platform.
              </h3>
              <div>
                <div className="samebox">
                  <div
                    style={{
                      padding: "2%",
                      borderRadius: "20%",
                      backgroundColor: "rgba(26, 212, 125, 0.9)",
                    }}
                  >
                    <i className="fa-solid fa-bolt"></i>
                  </div>
                  <div>
                    <h2>Lightning Fast Matching</h2>
                    <p>
                      Connect with new people in seconds through our advanced
                      matching algorithm.
                    </p>
                  </div>
                </div>

                <div className="samebox">
                  <div
                    style={{
                      padding: "2%",
                      borderRadius: "20%",
                      backgroundColor: "rgba(16, 117, 232, 0.52)",
                    }}
                  >
                    <i className="fa-solid fa-shield"></i>
                  </div>
                  <div>
                    <h2>Bank-Grade Security</h2>
                    <p>
                      Your privacy and safety are our top priorities with
                      end-to-end encryption.
                    </p>
                  </div>
                </div>

                <div className="samebox">
                  <div
                    style={{
                      padding: "2%",
                      borderRadius: "20%",
                      backgroundColor: "rgba(26, 212, 125, 0.9)",
                    }}
                  >
                    <i className="fa-solid fa-earth-africa"></i>
                  </div>
                  <div>
                    <h2>Global Reach</h2>
                    <p>
                      Connect with people from over 150 countries and experience
                      diverse cultures.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="body4">
            <h1>How It Works</h1>
            <h2>Start chatting in three simple steps</h2>
            <div>
              <div className="body4childDiv">
                <div>1</div>
                <h2>Allow Camera Access</h2>
                <h3>Enable your camera and microphone to get started</h3>
              </div>
              <div className="body4childDiv">
                <div>2</div>
                <h2>Choose Your Interests</h2>
                <h3>Select topics you want to discuss</h3>
              </div>
              <div className="body4childDiv">
                <div>3</div>
                <h2>Start Chatting</h2>
                <h3>Get instantly matched with someone new</h3>
              </div>
            </div>
          </div>
        </div>
        {/* footer part */}
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
