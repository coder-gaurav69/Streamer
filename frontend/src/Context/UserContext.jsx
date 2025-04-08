import React, { createContext, useState } from "react";

// Create the context
const UserContext = createContext(null);

// UserProvider component
const UserProvider = ({ children }) => {
  const [name, setName] = useState(null);
  const [category, setCategory] = useState(null); // Add state for room
  const [choice, setChoice] = useState(null); // Add state for room

  return (
    <UserContext.Provider value={{name, setName, category, setCategory,choice,setChoice}}>
      {children}
    </UserContext.Provider>
  );
};

// Export UserContext as named export and UserProvider as default export
export { UserContext , UserProvider };

