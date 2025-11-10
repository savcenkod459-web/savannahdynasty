import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Preloader from "./components/Preloader.tsx";
import ScrollProgressBar from "./components/ScrollProgressBar.tsx";

createRoot(document.getElementById("root")!).render(
  <>
    <Preloader />
    <ScrollProgressBar />
    <App />
  </>
);
