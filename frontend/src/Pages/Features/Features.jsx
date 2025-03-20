import React from "react";
import "./Features.css";
import img5 from "../../assets/img5.jpg";
import Footer from '../Footer/Footer'

const Features = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "fit-content",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)),url(${img5})`,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "fit-content",
          padding: "80px 30px 30px 30px",
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
      >
        <div className="featureContainer">
          <div className="section-1">
            <h1>Powerful Features for Meaningful Connections</h1>

            <p>
              Explore all the features that make RandomChat the perfect platform
              for meeting new people and having meaningful conversations.
            </p>
          </div>

          <div className="section-2">
            <div className="section-2-child">
              <div>
                <i className="fa-solid fa-video"></i>
              </div>

              <h1>HD Video Chat</h1>

              <p>
                Crystal clear video calls with high-quality audio for the most
                immersive chat experience.
              </p>
            </div>

            <div className="section-2-child">
              <div>
                <i className="fa-solid fa-comment"></i>
              </div>
              <h1>Text Chat</h1>
              <p>
                Rich text chat with emoji support, perfect for when you prefer
                typing over video.
              </p>
            </div>

            <div className="section-2-child">
              <div>
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h1>Advanced Security</h1>
              <p>
                State-of-the-art encryption and privacy features to keep your
                conversations secure.
              </p>
            </div>

            <div className="section-2-child">
              <div>
                <i className="fa-solid fa-bolt"></i>
              </div>
              <h1>Instant Matching</h1>
              <p>
                Smart algorithms to connect you with like-minded people in
                seconds.
              </p>
            </div>

            <div className="section-2-child">
              <div>
                <i className="fa-solid fa-language"></i>
              </div>
              <h1>Language Exchange</h1>
              <p>
                Practice different languages with native speakers from around
                the world.
              </p>
            </div>

            <div className="section-2-child">
              <div>
                <i className="fa-solid fa-filter"></i>
              </div>
              <h1>Smart Filters</h1>
              <p>
                Find people who share your interests and preferences with
                customizable filters.
              </p>
            </div>
          </div>

          <div className="section-3">

            <div className="section-3-child1">
              <h1>Why Choose RandomChat?</h1>
              <p>We offer the best features to make your chat experience amazing</p>
            </div>

            <div className="section-3-child2">
              <div className="contentDiv-same">
                <h1>For Casual Chats</h1>
                <div className="contentDiv-sameChild">
                  <div className="iconsDiv">
                    <i className="fa-solid fa-heart"></i>
                  </div>
                  <div className="textDiv">
                    <h2>Make New Friends</h2>
                    <p>Connect with people who share your interests</p>
                  </div>
                </div>
                <div className="contentDiv-sameChild">
                  <div className="iconsDiv">
                  <i className="fa-solid fa-globe"></i>
                  </div>
                  <div className="textDiv">
                    <h2>Global Community</h2>
                    <p>Chat with people from over 190 countries</p>
                  </div>
                </div>
              </div>
              <div className="contentDiv-same">
                <h1>For Language Learning</h1>
                <div className="contentDiv-sameChild">
                  <div className="iconsDiv">
                  <i className="fa-solid fa-language"></i>
                  </div>
                  <div className="textDiv">
                    <h2>Practice Languages</h2>
                    <p>Improve your language skills with native speakers</p>
                  </div>
                </div>
                <div className="contentDiv-sameChild">
                  <div className="iconsDiv">
                  <i className="fa-solid fa-users"></i>
                  </div>
                  <div className="textDiv">
                    <h2>Cultural Exchange</h2>
                    <p>Learn about different cultures and traditions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* footer */}
        <Footer/>
      </div>
    </div>
  );
};

export default Features;
