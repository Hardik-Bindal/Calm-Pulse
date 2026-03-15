import React from "react";
import { useTheme } from "../themes/ThemeContext";

const NAV_LINKS = [
  { id: "dashboard", label: "Dashboard", icon: "◼" },
  { id: "games", label: "Games", icon: "◈" },
  { id: "camera", label: "Camera", icon: "◉" },
  { id: "stress-check", label: "Stress Check", icon: "🧠" },
  { id: "explore", label: "Explore", icon: "◆" },
];

export default function Navbar({ active, onNavigate, onLogout, chatOpen, onToggleChat }) {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <header style={{
      height: "60px",
      background: isDark ? theme.navBg : theme.navBg,
      backdropFilter: theme.glassBlur,
      WebkitBackdropFilter: theme.glassBlur,
      borderBottom: `1px solid ${theme.navBorder}`,
      display: "flex",
      alignItems: "center",
      padding: "0 24px",
      gap: "0",
      flexShrink: 0,
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginRight: "32px" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "10px",
          background: theme.accentGradient,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "16px", boxShadow: `0 4px 12px ${theme.accentGlow}`,
        }}>
          🛡️
        </div>
        <span style={{ color: theme.textPrimary, fontSize: "15px", fontWeight: 800, letterSpacing: "-0.3px" }}>
          StressGuard <span style={{ color: theme.accentLight, fontWeight: 400 }}>AI</span>
        </span>
      </div>

      {/* Nav links */}
      <nav style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1 }}>
        {NAV_LINKS.map((link) => (
          <button
            key={link.id}
            onClick={() => onNavigate(link.id)}
            style={{
              padding: "7px 16px",
              borderRadius: "8px",
              border: "none",
              background: active === link.id ? theme.navActive : "transparent",
              color: active === link.id ? theme.navActiveText : theme.navLink,
              fontSize: "13px",
              fontWeight: active === link.id ? 700 : 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s ease",
              position: "relative",
            }}
          >
            {link.label}
            {active === link.id && (
              <div style={{
                position: "absolute",
                bottom: "-1px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "20px",
                height: "2px",
                borderRadius: "2px 2px 0 0",
                background: theme.accentLight,
              }} />
            )}
          </button>
        ))}
      </nav>

      {/* Right side actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* AI Chat toggle */}
        <button
          onClick={onToggleChat}
          style={{
            padding: "7px 14px",
            borderRadius: "8px",
            border: `1px solid ${chatOpen ? theme.accentLight + "50" : theme.navBorder}`,
            background: chatOpen ? theme.navActive : "transparent",
            color: chatOpen ? theme.navActiveText : theme.navLink,
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.2s ease",
          }}
        >
          💬 AI Chat
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "8px",
            border: `1px solid ${theme.navBorder}`,
            background: "transparent",
            color: theme.navLink,
            fontSize: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
        >
          {isDark ? "☀️" : "🌙"}
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          style={{
            padding: "7px 12px",
            borderRadius: "8px",
            border: `1px solid ${theme.navBorder}`,
            background: "transparent",
            color: theme.textMuted,
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}