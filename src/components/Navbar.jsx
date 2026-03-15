import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({ mode, activePage, onNavigate, onLogout }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const isStudent = mode === "academic";

  const studentLinks = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "studyplan", label: "Study Plan", icon: "📅" },
    { id: "mood", label: "Mood Tracker", icon: "😊" },
    { id: "sleep", label: "Sleep Log", icon: "🌙" },
    { id: "dna", label: "Stress DNA", icon: "🧬" },
    { id: "games", label: "Games", icon: "🎮" },
    { id: "chat", label: "AI Chat", icon: "💬" },
  ];

  const workLinks = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "meetings", label: "Meetings", icon: "📅" },
    { id: "worklife", label: "Work-Life", icon: "⚖️" },
    { id: "weekprep", label: "Week Prep", icon: "🗓️" },
    { id: "dna", label: "Stress DNA", icon: "🧬" },
    { id: "games", label: "Games", icon: "🎮" },
    { id: "chat", label: "AI Chat", icon: "💬" },
  ];

  const links = isStudent ? studentLinks : workLinks;

  return (
    <nav style={{
      width: "230px",
      minHeight: "100vh",
      background: isDark ? theme.navBg : theme.navBg,
      backdropFilter: isDark ? "none" : theme.glassBlur,
      WebkitBackdropFilter: isDark ? "none" : theme.glassBlur,
      borderRight: `1px solid ${theme.navBorder}`,
      display: "flex",
      flexDirection: "column",
      padding: "24px 16px",
      gap: "4px",
      flexShrink: 0,
      transition: "all 0.4s ease",
    }}>
      {/* Logo */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "12px",
        fontSize: "22px",
      }}>
        <span>🛡️</span>
        <div>
          <div style={{
            color: theme.textPrimary,
            fontSize: "15px",
            fontWeight: 800,
            lineHeight: 1.2,
            transition: "color 0.3s",
          }}>StressGuard AI</div>
          <div style={{
            color: theme.accent,
            fontSize: "11px",
            fontWeight: 600,
          }}>
            {isStudent ? "🎓 Academic" : "💼 Workplace"}
          </div>
        </div>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "10px 14px",
          borderRadius: "12px",
          border: `1px solid ${theme.cardBorder}`,
          background: isDark
            ? "rgba(255,255,255,0.04)"
            : "rgba(99,102,241,0.08)",
          color: theme.textSecondary,
          fontSize: "12px",
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: "20px",
          transition: "all 0.3s ease",
        }}
      >
        <span style={{ fontSize: "16px" }}>{isDark ? "☀️" : "🌙"}</span>
        <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
      </button>

      {/* Links */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        flex: 1,
      }}>
        {links.map((link, i) => (
          <button
            key={link.id}
            onClick={() => onNavigate(link.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "11px 14px",
              borderRadius: "12px",
              border: "none",
              background: activePage === link.id
                ? theme.navLinkActive
                : "transparent",
              color: activePage === link.id
                ? theme.navLinkActiveText
                : theme.navLinkColor,
              fontSize: "13px",
              fontWeight: activePage === link.id ? 700 : 500,
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s ease",
              animation: `slideInLeft 0.3s ease ${i * 0.05}s both`,
            }}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
            {activePage === link.id && (
              <div style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: theme.accent,
                marginLeft: "auto",
                boxShadow: `0 0 6px ${theme.accent}`,
              }} />
            )}
          </button>
        ))}
      </div>

      {/* Logout */}
      <button onClick={onLogout} style={{
        background: isDark
          ? "rgba(255,255,255,0.03)"
          : "rgba(0,0,0,0.04)",
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: "12px",
        color: theme.textMuted,
        fontSize: "12px",
        fontWeight: 600,
        padding: "10px",
        cursor: "pointer",
        marginTop: "16px",
        transition: "all 0.3s ease",
      }}>
        ← Logout
      </button>
    </nav>
  );
}