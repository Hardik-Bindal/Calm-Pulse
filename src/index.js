import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./themes/ThemeContext";

// OAuth Providers
import { GoogleOAuthProvider } from '@react-oauth/google';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';

const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_MICROSOFT_CLIENT_ID || "dummy-ms-client-id",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: window.location.origin
  }
};
const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || "dummy-google-client-id.apps.googleusercontent.com"}>
      <MsalProvider instance={msalInstance}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </MsalProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);