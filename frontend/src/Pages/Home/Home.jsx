import React, { useContext, useEffect } from "react";
import { UserContext } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import img4 from "../../assets/img4.jpg";

const Home = () => {
  const { name, setName } = useContext(UserContext);
  const { category, setCategory, choice } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmitBtn = (e) => {
    e.preventDefault();
    if (choice === "chat") {
      navigate("/chat");
    } else {
      navigate("/stream");
    }
  };

  useEffect(() => {
    console.log(choice);
  }, [choice]);

  return (
    <div
      className="w-full h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url(${img4})`,
      }}
    >
      <form
        className="w-full h-screen flex items-center justify-center bg-black/30 backdrop-blur-sm p-[5%]"
        onSubmit={handleSubmitBtn}
      >
        <div className="min-w-[25%] h-[300px] bg-white/10 flex flex-col items-center justify-center gap-[30px] rounded-[50px] p-[5px] backdrop-blur-md shadow-[2px_2px_5px_rgba(0,0,0,0.4),inset_10px_10px_10px_rgba(0,0,0,0.4)]">
          <input
            className="px-[20px] py-[5px] outline-none border-none rounded-[10px] text-[18px] text-black w-[70%] transition duration-300 hover:shadow-[5px_5px_15px_rgba(255,255,255,0.3),-5px_-5px_15px_rgba(255,255,255,0.3)] font-bold"
            type="text"
            placeholder="Enter Your Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="px-[20px] py-[5px] outline-none border-none rounded-[10px] text-[18px] text-black/80 w-[70%] transition duration-300 hover:shadow-[5px_5px_15px_rgba(255,255,255,0.3),-5px_-5px_15px_rgba(255,255,255,0.3)] font-bold"
            type="text"
            placeholder="Enter Category"
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <button
            className="px-[15px] py-[10px] border-none outline-none rounded-[10px] text-[15px] bg-white/80 transition hover:bg-white/40 font-bold"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Home;
