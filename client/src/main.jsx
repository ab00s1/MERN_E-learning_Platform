import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { CourseProvider } from "./context/CourseContext.jsx";
import { AdminProvider } from "./context/AdminContext.jsx";
import { DoubtResolver } from "./context/DoubtContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <AdminProvider>
        <DoubtResolver>
          <CourseProvider>
            <App />
          </CourseProvider>
        </DoubtResolver>
      </AdminProvider>
    </UserProvider>
  </StrictMode>
);
