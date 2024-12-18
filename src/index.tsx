import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./components/AuthContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const handleRedirect = (path: string) => {
  window.location.href = path; // Redirect using window.location
};

root.render(
  <React.StrictMode>
    <AuthProvider onRedirect={handleRedirect}>
    <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
