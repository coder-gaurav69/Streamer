import React, { useContext } from "react";
import "./Home.css";
// import { SocketContext } from "../../Context/SocketContext";
import { UserContext } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import img4 from "../../assets/img4.jpg";

const Home = () => {
  const { name, setName } = useContext(UserContext);
  const { category, setCategory } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmitBtn = (e) => {
    e.preventDefault();
    navigate('/stream')
  };

  return (
    <div className="container"
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url(${img4})`,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form  className="userForm" onSubmit={handleSubmitBtn}>
        <div className="formchild">
          <input
            className="inputEntry"
            type="text"
            placeholder="Enter Your Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="inputEntry"
            type="text"
            placeholder="Enter Category"
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <button className="formbtn">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Home;
