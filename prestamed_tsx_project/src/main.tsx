import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./context/AuthContext"; 
import { ContratoProvider } from "./context/ContratoContext"; 

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> 
        <ContratoProvider> 
          <App />
        </ContratoProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
