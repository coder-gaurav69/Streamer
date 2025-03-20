import React from "react";
import "./Safety.css";
import img7 from "../../assets/img7.jpg";
import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";

const Safety = () => {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)),url(${img7})`,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
        // pointerEvents: "none",
      }}
    >
      <div
        style={{
          backdropFilter: "blur(2px)",
          width: "100%",
          // height:'100vh',
          padding: "80px 30px 10px 30px",
          backgroundColor: "rgba(0,0,0,0.1)",
        }}
      >
        <div className="safetyContainer">
          {/* section-1 */}
          <div className="section1">
            <div className="firstDiv">
              <h1>Your Safety is Our Top Priority</h1>
              <p>
                We've implemented comprehensive safety measures to ensure you
                can chat with confidence and peace of mind.
              </p>
            </div>
            <div className="secondDiv">
              <div className="secondDiv-1">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <div className="secondDiv-2">
                <h3>Safety First</h3>
                <p>
                  Never share personal information like your address, phone
                  number, or financial details with people you meet online.
                </p>
              </div>
            </div>
          </div>

          {/* section-2 */}
          <div className="section2">
            <div className="child">
              <div>
                <i className="fa-solid fa-lock"></i>
              </div>
              <h1>Encrypted Chats</h1>
              <p>
                All conversations are protected with end-to-end encryption for
                maximum privacy.
              </p>
            </div>
            <div className="child">
              <div>
                <i className="fa-solid fa-user-slash"></i>
              </div>
              <h1>Block Users</h1>
              <p>
                Instantly block and report any user who makes you feel
                uncomfortable.
              </p>
            </div>
            <div className="child">
              <div>
                <i className="fa-solid fa-bell"></i>
              </div>
              <h1>24/7 Monitoring</h1>
              <p>
                Our automated systems and moderators work around the clock to
                keep you safe.
              </p>
            </div>
          </div>

          {/* section-3 */}
          <div className="section3">
            <div className="section3-child1">
              <h1>Safety Guidelines</h1>
              <h2>
                Follow these guidelines to ensure a safe and enjoyable
                experience
              </h2>
            </div>
            <div className="section3-child2">
              <div className="section3-child2-same">
                <h1>Do's</h1>
                <div>
                  <div className="fontDiv">
                    <i className="fa-solid fa-eye"></i>
                  </div>
                  <div className="contentDiv">
                    <h2>Stay Alert</h2>
                    <p>Be aware of suspicious behavior</p>
                  </div>
                </div>
                <div>
                  <div className="fontDiv">
                  <i className="fa-solid fa-shield"></i>
                  </div>
                  <div className="contentDiv">
                    <h2>Protect Your Privacy</h2>
                    <p>Keep personal information private</p>
                  </div>
                </div>
              </div>
              <div className="section3-child2-same">
                <h1>Dont's</h1>
                <div>
                  <div className="fontDiv">
                  <i className="fa-solid fa-thumbs-down"></i>
                  </div>
                  <div className="contentDiv">
                    <h2>No Harassment</h2>
                    <p>Zero tolerance for any form of harassment</p>
                  </div>
                </div>
                <div>
                  <div className="fontDiv">
                  <i className="fa-solid fa-ban"></i>
                  </div>
                  <div className="contentDiv">
                    <h2>No Inappropriate Content</h2>
                    <p>Keep conversations respectful and appropriate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* section-4 */}
          <div className="section4">
            <h1>Need Help?</h1>
            <p>If you encounter any issues or feel unsafe, our support team is here to help 24/7.</p>
            <button className="btn">
              <div><i className="fa-solid fa-triangle-exclamation"></i></div>
              <p>Report an issue</p>
            </button>
          </div>
        </div>
        {/* footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Safety;
