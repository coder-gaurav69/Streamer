import React from "react";
import img7 from "../../assets/img7.jpg";
import { Link } from "react-router-dom";
import Footer from "../../Component/Footer/Footer";

const Safety = () => {
  return (
    <div
      className="w-full bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)),url(${img7})`,
      }}
    >
      <div className="backdrop-blur-sm bg-black/10">
        <div className="w-full  pt-[50px] pb-[10px]">
          <div className="w-[80%] h-fit mx-auto">
            {/* Section 1 */}
            <div className="w-full min-h-[85vh] flex flex-col justify-between items-center text-white my-[20px]">
              <div className="px-[5%] ">
                <h1 className="text-[40px] md:text-[70px] lg:text-[100px] text-white text-center break-words font-sans ">
                  Your Safety is Our Top Priority
                </h1>
                <p className="text-[25px] text-center text-white/40 p-[10px]">
                  We've implemented comprehensive safety measures to ensure you
                  can chat with confidence and peace of mind.
                </p>
              </div>
              <div className="w-full p-[2%] rounded-[10px] bg-white/10 backdrop-blur-sm flex">
                <div className="flex items-center justify-center px-[2%]">
                  <i className="fa-solid fa-triangle-exclamation text-[30px] text-white/40"></i>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-white/80">Safety First</h3>
                  <p className="text-[18px] text-white/40">
                    Never share personal information like your address, phone
                    number, or financial details with people you meet online.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="my-[30px] px-[30px] py-[80px] flex justify-center items-center gap-[3%] bg-white/10 rounded-[10px] max-[1024px]:flex-col max-[1024px]:py-[60px] max-[1024px]:gap-[30px] max-[1024px]:bg-transparent max-[768px]:px-[10px] max-[480px]:px-[10px]">
              {[
                {
                  icon: "fa-lock",
                  title: "Encrypted Chats",
                  desc: "All conversations are protected with end-to-end encryption for maximum privacy.",
                },
                {
                  icon: "fa-user-slash",
                  title: "Block Users",
                  desc: "Instantly block and report any user who makes you feel uncomfortable.",
                },
                {
                  icon: "fa-bell",
                  title: "24/7 Monitoring",
                  desc: "Our automated systems and moderators work around the clock to keep you safe.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="w-full min-h-[300px] flex flex-col items-center justify-center text-center bg-white/10 p-[2%] rounded-[10px] shadow-inner shadow-white/20"
                >
                  <div className="p-[2%]">
                    <i
                      className={`fa-solid ${item.icon} text-[50px] text-black/50`}
                    ></i>
                  </div>
                  <h1 className="p-[2%] text-white/80">{item.title}</h1>
                  <p className="p-[2%] text-[20px] text-white/50">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Section 3 */}
            <div className="my-[30px] px-[3%] py-[5%] bg-white/10 backdrop-blur-lg rounded-[10px] flex flex-col justify-center max-[768px]:px-[15px] max-[768px]:py-[40px]">
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-white/80 px-[2%] pt-[2%] pb-[1%] text-center text-[28px] max-[480px]:pt-[10px]">
                  Safety Guidelines
                </h1>
                <h2 className="text-white/40 px-[2%] pb-[2%] text-center">
                  Follow these guidelines to ensure a safe and enjoyable
                  experience
                </h2>
              </div>
              <div className="flex items-center p-[5%] max-[1024px]:flex-col max-[768px]:p-[20px] max-[480px]:p-[15px]">
                {[
                  {
                    title: "Do's",
                    points: [
                      {
                        icon: "fa-eye",
                        h: "Stay Alert",
                        p: "Be aware of suspicious behavior",
                      },
                      {
                        icon: "fa-shield",
                        h: "Protect Your Privacy",
                        p: "Keep personal information private",
                      },
                    ],
                  },
                  {
                    title: "Dont's",
                    points: [
                      {
                        icon: "fa-thumbs-down",
                        h: "No Harassment",
                        p: "Zero tolerance for any form of harassment",
                      },
                      {
                        icon: "fa-ban",
                        h: "No Inappropriate Content",
                        p: "Keep conversations respectful and appropriate",
                      },
                    ],
                  },
                ].map((group, i) => (
                  <div
                    key={i}
                    className="flex flex-col flex-grow p-[2%] gap-[10px] max-[1024px]:w-full max-[1024px]:max-w-[500px] max-[768px]:p-[15px] max-[480px]:gap-[20px]"
                  >
                    <h1 className="text-white/50 px-[2%]">{group.title}</h1>
                    {group.points.map((pt, j) => (
                      <div
                        key={j}
                        className="flex items-center justify-start w-full gap-[15px] max-[480px]:flex-col max-[480px]:text-center max-[480px]:gap-[2px]"
                      >
                        <div className="flex items-center justify-center p-[2%]">
                          <i
                            className={`fa-solid ${pt.icon} text-[35px] text-black/50`}
                          ></i>
                        </div>
                        <div className="flex flex-col flex-grow p-[2%] gap-[10px] justify-center whitespace-normal">
                          <h2 className="text-white/40">{pt.h}</h2>
                          <p className="text-white/40">{pt.p}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4 */}
            <div className="my-[30px] px-[5%] py-[5%] bg-white/10 rounded-[10px] flex flex-col items-center justify-center gap-[30px] text-center max-[768px]:px-[15px] max-[480px]:px-[10px] max-[480px]:py-[30px]">
              <h1 className="text-white/80">Need Help?</h1>
              <p className="text-[20px] text-white/40">
                If you encounter any issues or feel unsafe, our support team is
                here to help 24/7.
              </p>
              <button className="flex items-center gap-[10px] min-w-[200px] px-[20px] py-[15px] rounded-[10px] bg-red-600/60 hover:bg-red-600/80 cursor-pointer border-none outline-none">
                <div>
                  <i className="fa-solid fa-triangle-exclamation text-[20px] text-white/80"></i>
                </div>
                <p className="text-[20px] text-white/80">Report an issue</p>
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Safety;
