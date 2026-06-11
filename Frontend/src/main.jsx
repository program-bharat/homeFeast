import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";

import App from "./App.jsx";
import { store } from "./rtk/store.js";

import "@fontsource/inter";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "react-toastify/dist/ReactToastify.css";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={2500}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);