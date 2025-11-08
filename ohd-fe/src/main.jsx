import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import GoogleAuthProviderWrapper from "./providers/GoogleAuthProvider.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleAuthProviderWrapper>
        <App />
      </GoogleAuthProviderWrapper>
    </BrowserRouter>
  </React.StrictMode>
);
