import { useEffect, useState } from "react";
import { useAuth } from "../context/Authcontent";

const Navbar = () => {
  const { user, logout } = useAuth();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark-mode");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((previous) => !previous);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">

        <div>
          <h1 className="brand">
            TaskFlow
          </h1>

          <p className="welcome-text">
            Welcome back,{" "}
            {user?.name ||
              user?.username ||
              "User"}
            .
          </p>
        </div>

        <div className="navbar-actions">

          <button
            className="theme-toggle"
            onClick={toggleDarkMode}
            title={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <button
            className="logout-button"
            onClick={logout}
          >
            Log out
          </button>

        </div>

      </div>
    </header>
  );
};

export default Navbar;