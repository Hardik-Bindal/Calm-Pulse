import React from "react";

export default function Navbar({ mode, activePage, onNavigate, onLogout }) {
  const isStudent = mode === "academic";

  const studentLinks = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "studyplan", label: "Study Plan", icon: "📅" },
    { id: "mood", label: "Mood Tracker", icon: "😊" },
    { id: "sleep", label: "Sleep Log", icon: "🌙" },
    { id: "dna", label: "Stress DNA", icon: "🧬" },
    { id: "chat", label: "AI Chat", icon: "💬" },
  ];

  const workLinks = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "meetings", label: "Meetings", icon: "📅" },
    { id: "worklife", label: "Work-Life", icon: "⚖️" },
    { id: "weekprep", label: "Week Prep", icon: "🗓️" },
    { id: "dna", label: "Stress DNA", icon: "🧬" },
    { id: "chat", label: "AI Chat", icon: "💬" },
  ];

  const links = isStudent ? studentLinks : workLinks;

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <span>🛡️</span>
        <div>
          <div style={styles.logoText}>StressGuard AI</div>
          <div style={styles.modeBadge}>
            {isStudent ? "🎓 Academic" : "💼 Workplace"}
          </div>
        </div>
      </div>

      <div style={styles.links}>
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => onNavigate(link.id)}
            style={{
              ...styles.link,
              ...(activePage === link.id ? styles.linkActive : {}),
            }}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </button>
        ))}
      </div>

      <button onClick={onLogout} style={styles.logoutBtn}>
        ← Logout
      </button>
    </nav>
  );
}

const styles = {
  nav: {
    width: "220px",
    minHeight: "100vh",
    background: "#0f172a",
    borderRight: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    flexDirection: "column",
    padding: "24px 16px",
    gap: "4px",
    flexShrink: 0,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "32px",
    fontSize: "22px",
  },
  logoText: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: 800,
    lineHeight: 1.2,
  },
  modeBadge: {
    color: "#6366f1",
    fontSize: "11px",
    fontWeight: 600,
  },
  links: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: 1,
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "none",
    background: "transparent",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.15s",
  },
  linkActive: {
    background: "rgba(99,102,241,0.15)",
    color: "#a5b4fc",
  },
  logoutBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    color: "#475569",
    fontSize: "12px",
    padding: "10px",
    cursor: "pointer",
    marginTop: "16px",
  },
};