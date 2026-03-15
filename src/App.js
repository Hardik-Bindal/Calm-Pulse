import React, { useState, useEffect } from "react";
import { useTheme } from "./themes/ThemeContext";
import AuthPage from "./pages/AuthPage";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import Dashboard from "./features/Dashboard";
import Games from "./features/Games";
import Camera from "./features/Camera";
import Placeholder from "./features/Placeholder";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [active, setActive] = useState("dashboard");
  const [chatOpen, setChatOpen] = useState(false);
  const { theme, isDark } = useTheme();

  useEffect(() => {
    document.body.style.background = theme.bg;
    document.body.style.color = theme.textPrimary;
  }, [isDark, theme]);

  if (!loggedIn) {
    return <AuthPage onLogin={() => setLoggedIn(true)} />;
  }

  const renderFeature = () => {
    switch (active) {
      case "dashboard": return <Dashboard />;
      case "games":     return <Games />;
      case "camera":    return <Camera />;
      case "explore":   return <Placeholder />;
      default:          return <Dashboard />;
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: theme.bg,
      fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
      transition: "background 0.3s ease",
      overflow: "hidden",
    }}>
      {/* Top Navbar */}
      <Navbar
        active={active}
        onNavigate={setActive}
        onLogout={() => { setLoggedIn(false); setActive("dashboard"); setChatOpen(false); }}
        chatOpen={chatOpen}
        onToggleChat={() => setChatOpen((p) => !p)}
      />

      {/* Body: main content + right chat panel */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Main content */}
        <main style={{
          flex: 1,
          overflowY: "auto",
          padding: "28px 32px",
          boxSizing: "border-box",
          transition: "all 0.3s ease",
          animation: "fadeIn 0.3s ease",
        }}>
          {renderFeature()}
        </main>

        {/* Right chat panel */}
        <Chatbot open={chatOpen} onClose={() => setChatOpen(false)} />
      </div>
    </div>
  );
}