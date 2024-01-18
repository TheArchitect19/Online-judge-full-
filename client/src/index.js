import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { AuthContext } from "./authContext";

const AppWrapper = () => {
  const [login, setLogin] = useState(false);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("login")) === true) setLogin(true);
    return () => {};
  }, []);

  return (
    <React.StrictMode>
      <AuthContext.Provider value={{ login, setLogin }}>
        <App />
      </AuthContext.Provider>
    </React.StrictMode>
  );
};

// window.addEventListener('error', function (event) {
//   // Check if the error message contains the specific text you want to ignore
//   if (event.message.includes('SyntaxError')) {
//     // You can log the error for debugging purposes if needed
//     console.error('Caught an error:', event.error);

//     // Optionally, you can prevent the error from crashing the application
//     event.preventDefault();
//   }
// });

ReactDOM.render(<AppWrapper />, document.getElementById("root"));

