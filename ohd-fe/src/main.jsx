import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import GoogleAuthProviderWrapper from "./providers/GoogleAuthProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleAuthProviderWrapper>
      <App />
    </GoogleAuthProviderWrapper>
  </React.StrictMode>
);
