import React, { useState, useEffect } from "react";
import { useTheme } from "./context/ThemeContext";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import StudentDashboard from "./pages/StudentDashboard";
import WorkDashboard from "./pages/WorkDashboard";
import ChatPage from "./pages/ChatPage";
import StressDNAPage from "./pages/StressDNAPage";
import MoodPage from "./pages/MoodPage";
import SleepPage from "./pages/SleepPage";
import StudyPlanPage from "./pages/StudyPlanPage";
import MeetingsPage from "./pages/MeetingsPage";
import WorkLifePage from "./pages/WorkLifePage";
import WeekPrepPage from "./pages/WeekPrepPage";
import GamesPage from "./pages/GamesPage";

export default function App() {
  const [mode, setMode] = useState(null);
  const [page, setPage] = useState("dashboard");
  const { theme, isDark } = useTheme();

  useEffect(() => {
    document.body.className = isDark ? "" : "light-mode";
    document.body.style.background = isDark ? theme.bg : "";
    if (!isDark) {
      document.body.style.background = "#e8eaf6";
      document.body.style.backgroundImage = "linear-gradient(135deg, #e8eaf6 0%, #f3e5f5 30%, #e0f2f1 60%, #fce4ec 100%)";
      document.body.style.backgroundAttachment = "fixed";
    } else {
      document.body.style.backgroundImage = "none";
    }
  }, [isDark, theme]);

  if (!mode) {
    return <LoginPage onLogin={(m) => { setMode(m); setPage("dashboard"); }} />;
  }

  const renderPage = () => {
    if (mode === "academic") {
      switch (page) {
        case "dashboard": return <StudentDashboard />;
        case "studyplan": return <StudyPlanPage />;
        case "mood": return <MoodPage />;
        case "sleep": return <SleepPage />;
        case "dna": return <StressDNAPage mode={mode} />;
        case "games": return <GamesPage />;
        case "chat": return <ChatPage mode={mode} />;
        default: return <StudentDashboard />;
      }
    } else {
      switch (page) {
        case "dashboard": return <WorkDashboard />;
        case "meetings": return <MeetingsPage />;
        case "worklife": return <WorkLifePage />;
        case "weekprep": return <WeekPrepPage />;
        case "dna": return <StressDNAPage mode={mode} />;
        case "games": return <GamesPage />;
        case "chat": return <ChatPage mode={mode} />;
        default: return <WorkDashboard />;
      }
    }
  };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: isDark ? theme.bg : "transparent",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      transition: "all 0.4s ease",
    }}>
      <Navbar
        mode={mode}
        activePage={page}
        onNavigate={setPage}
        onLogout={() => { setMode(null); setPage("dashboard"); }}
      />
      <main style={{
        flex: 1,
        overflowY: "auto",
      }}>
        <div style={{
          padding: "32px",
          maxWidth: "1100px",
          animation: "fadeIn 0.4s ease",
        }}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
}