import React, { useState } from "react";
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

export default function App() {
  const [mode, setMode] = useState(null);
  const [page, setPage] = useState("dashboard");

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
        case "chat": return <ChatPage mode={mode} />;
        default: return <WorkDashboard />;
      }
    }
  };

  return (
    <div style={styles.app}>
      <Navbar
        mode={mode}
        activePage={page}
        onNavigate={setPage}
        onLogout={() => { setMode(null); setPage("dashboard"); }}
      />
      <main style={styles.main}>
        <div style={styles.content}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    minHeight: "100vh",
    background: "#0f172a",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  main: {
    flex: 1,
    overflowY: "auto",
  },
  content: {
    padding: "32px",
    maxWidth: "1100px",
  },
};