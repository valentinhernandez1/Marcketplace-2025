import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AppProvider from "./context/AppProvider.jsx";
import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";
import "./styles/theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>        
      <AppProvider>       
        <App />             
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
