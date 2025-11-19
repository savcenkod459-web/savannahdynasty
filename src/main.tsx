import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config";
import Preloader from "./components/Preloader.tsx";
import { registerServiceWorker } from "./registerServiceWorker";

// Initialize theme from localStorage
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark" || !savedTheme) {
  // Default to dark theme if no preference is saved
  document.documentElement.classList.add("dark");
  if (!savedTheme) {
    localStorage.setItem("theme", "dark");
  }
} else {
  localStorage.setItem("theme", "light");
}

// Register service worker for PWA and offline support
registerServiceWorker();

createRoot(document.getElementById("root")!).render(
  <>
    <Preloader />
    <App />
  </>
);
