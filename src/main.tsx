import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config";
import Preloader from "./components/Preloader.tsx";

// Initialize theme from localStorage
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else if (!savedTheme) {
  // Default to light theme if no preference is saved
  localStorage.setItem("theme", "light");
}

createRoot(document.getElementById("root")!).render(
  <>
    <Preloader />
    <App />
  </>
);
