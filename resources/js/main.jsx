import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "../css/app.css";
import { AuthProvider } from "./auth/AuthContext";
import { SessionProvider } from "./context/SessionContext";
import SessionMessage from "./components/SessionMessage";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <SessionProvider>
        <AuthProvider>
        <RouterProvider router={router} />
        <SessionMessage />
      </AuthProvider>
      </SessionProvider>
  </React.StrictMode>
);
