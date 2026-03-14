import React, { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [selected, setSelected] = useState(null);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>🛡️</div>
          <div>
            <h1 style={styles.logoText}>StressGuard AI</h1>
            <p style={styles.logoSub}>Wellness Platform</p>
          </div>
        </div>

        <p style={styles.tagline}>Detect stress early. Feel better. Stay balanced.</p>

        <div style={styles.modeRow}>
          <ModeCard
            emoji="🎓"
            title="Academic Mode"
            desc="For Students"
            active={selected === "academic"}
            onClick={() => setSelected("academic")}
          />
          <ModeCard
            emoji="💼"
            title="Workplace Mode"
            desc="For Employees"
            active={selected === "workplace"}
            onClick={() => setSelected("workplace")}
          />
        </div>

        <button
          style={{
            ...styles.btn,
            ...(selected ? styles.btnActive : styles.btnDisabled),
          }}
          disabled={!selected}
          onClick={() => selected && onLogin(selected)}
        >
          Continue →
        </button>

        <p style={styles.note}>🔒 Your data is private. Camera & mic are always opt-in.</p>
      </div>
    </div>
  );
}

function ModeCard({ emoji, title, desc, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...styles.modeCard,
        ...(active ? styles.modeCardActive : {}),
      }}
    >
      <span style={styles.modeEmoji}>{emoji}</span>
      <strong style={styles.modeTitle}>{title}</strong>
      <span style={styles.modeDesc}>{desc}</span>
      {active && <span style={styles.checkmark}>✓</span>}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "20px",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "24px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "480px",
    textAlign: "center",
    backdropFilter: "blur(20px)",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "14px",
    marginBottom: "8px",
  },
  logoIcon: { fontSize: "40px" },
  logoText: {
    color: "#fff",
    fontSize: "26px",
    fontWeight: 800,
    margin: 0,
    letterSpacing: "-0.5px",
  },
  logoSub: { color: "#64748b", fontSize: "13px", margin: 0 },
  tagline: {
    color: "#94a3b8",
    fontSize: "15px",
    margin: "16px 0 32px",
  },
  modeRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "32px",
  },
  modeCard: {
    flex: 1,
    background: "rgba(255,255,255,0.04)",
    border: "2px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "24px 16px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    position: "relative",
    transition: "all 0.2s",
  },
  modeCardActive: {
    border: "2px solid #6366f1",
    background: "rgba(99,102,241,0.15)",
  },
  modeEmoji: { fontSize: "32px" },
  modeTitle: { color: "#fff", fontSize: "14px" },
  modeDesc: { color: "#64748b", fontSize: "12px" },
  checkmark: {
    position: "absolute",
    top: "10px",
    right: "12px",
    background: "#6366f1",
    color: "#fff",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 700,
  },
  btn: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    marginBottom: "20px",
  },
  btnActive: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
  },
  btnDisabled: {
    background: "rgba(255,255,255,0.05)",
    color: "#475569",
    cursor: "not-allowed",
  },
  note: { color: "#475569", fontSize: "12px" },
};