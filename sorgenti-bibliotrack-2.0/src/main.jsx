import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(<App />);

const splash = document.getElementById("splash");
if (splash) {
  setTimeout(() => {
    splash.style.opacity = "0";
    setTimeout(() => splash.remove(), 400);
  }, 300);
}
