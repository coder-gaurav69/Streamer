import React, { useEffect, useRef, useState } from "react";

const Practise = () => {
  const val = useRef(null);
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (input === "") return;
    val.current = Number(input); // Convert to number
  }, [input]);

  const multiplier = () => {
    if (val.current !== null) {
      setResult(val.current * val.current); // Update state to trigger re-render
    }
  };

  return (
    <div
      style={{
        fontSize: "30px",
        display: "flex",
        flexDirection: "column",
        gap: "50px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <input type="number" onChange={(e) => setInput(e.target.value)} />
      <div
        style={{
          width: "100px",
          background: "rgba(0,0,0,0.5)",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
        onClick={multiplier}
      >
        {result !== null ? result : "Click"}
      </div>
    </div>
  );
};

export default Practise;
