import React from "react";
import img5 from "../../assets/img5.jpg";
import Footer from "../../Component/Footer/Footer";

const Features = () => {
  return (
    <div
      className="w-full bg-cover bg-center bg-fixed  "
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)),url(${img5})`,
      }}
    >
      <div className="pt-10">
        <div className="w-4/5 mx-auto">
          <section className="text-center my-10 px-8">
            <h1 className="text-white text-[6vw] font-bold mb-4 break-words">
              Powerful Features for Meaningful Connections
            </h1>
            <p className="text-white/40 text-xl break-words">
              Explore all the features that make RandomChat the perfect platform
              for meeting new people and having meaningful conversations.
            </p>
          </section>

          <section className="bg-white/10 rounded-lg p-8 flex flex-wrap gap-10 justify-evenly mb-10">
            {[
              {
                icon: "fa-video",
                title: "HD Video Chat",
                text: "Crystal clear video calls with high-quality audio for the most immersive chat experience.",
              },
              {
                icon: "fa-comment",
                title: "Text Chat",
                text: "Rich text chat with emoji support, perfect for when you prefer typing over video.",
              },
              {
                icon: "fa-shield-halved",
                title: "Advanced Security",
                text: "State-of-the-art encryption and privacy features to keep your conversations secure.",
              },
              {
                icon: "fa-bolt",
                title: "Instant Matching",
                text: "Smart algorithms to connect you with like-minded people in seconds.",
              },
              {
                icon: "fa-language",
                title: "Language Exchange",
                text: "Practice different languages with native speakers from around the world.",
              },
              {
                icon: "fa-filter",
                title: "Smart Filters",
                text: "Find people who share your interests and preferences with customizable filters.",
              },
            ].map(({ icon, title, text }, idx) => (
              <div
                key={idx}
                className="w-[320px] min-h-[280px] p-4 shadow-inner rounded-lg bg-white/10 text-center"
              >
                <div className="text-[50px] text-black/60 mb-2">
                  <i className={`fa-solid ${icon}`}></i>
                </div>
                <h1 className="text-white text-2xl font-semibold mb-2">
                  {title}
                </h1>
                <p className="text-white/50 text-lg">{text}</p>
              </div>
            ))}
          </section>

          <section className="bg-white/10 rounded-lg p-8 mb-10">
            <div className="text-center mb-6">
              <h1 className="text-white text-3xl font-bold mb-2">
                Why Choose RandomChat?
              </h1>
              <p className="text-white/50 text-lg">
                We offer the best features to make your chat experience amazing
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-6">
              {[
                {
                  heading: "For Casual Chats",
                  features: [
                    {
                      icon: "fa-heart",
                      title: "Make New Friends",
                      desc: "Connect with people who share your interests",
                    },
                    {
                      icon: "fa-globe",
                      title: "Global Community",
                      desc: "Chat with people from over 190 countries",
                    },
                  ],
                },
                {
                  heading: "For Language Learning",
                  features: [
                    {
                      icon: "fa-language",
                      title: "Practice Languages",
                      desc: "Improve your language skills with native speakers",
                    },
                    {
                      icon: "fa-users",
                      title: "Cultural Exchange",
                      desc: "Learn about different cultures and traditions",
                    },
                  ],
                },
              ].map(({ heading, features }, i) => (
                <div key={i} className="w-full md:w-1/2">
                  <h1 className="text-white/60 text-2xl mb-4">{heading}</h1>
                  {features.map(({ icon, title, desc }, j) => (
                    <div key={j} className="flex mb-4">
                      <div className="text-[40px] text-black/70 mr-4">
                        <i className={`fa-solid ${icon}`}></i>
                      </div>
                      <div>
                        <h2 className="text-white/60 text-xl font-medium mb-1">
                          {title}
                        </h2>
                        <p className="text-white/40 text-lg">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Features;
