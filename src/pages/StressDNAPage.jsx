import React from "react";
import { studentData, employeeData } from "../data/sampleData";

export default function StressDNAPage({ mode }) {
  const d = mode === "academic" ? studentData : employeeData;
  const dna = d.stressDNA;

  return (
    <div style={styles.page}>
      <div>
        <h2 style={styles.title}>Your Stress DNA 🧬</h2>
        <p style={styles.sub}>Your unique stress pattern map — built from 2 weeks of data</p>
      </div>

      <div style={styles.heroCard}>
        <div style={styles.heroLeft}>
          <div style={styles.dnaIcon}>🧬</div>
          <div>
            <div style={styles.heroName}>{d.name}'s Stress Profile</div>
            <div style={styles.heroMode}>{mode === "academic" ? "Academic Mode" : "Workplace Mode"}</div>
          </div>
        </div>
        <div style={styles.heroBadge}>Profile Complete ✓</div>
      </div>

      <div style={styles.grid2}>
        <Card title="⏰ Peak Stress Window">
          <div style={styles.bigText}>{dna.peakStressTime}</div>
          <p style={styles.cardNote}>Avoid scheduling high-focus tasks during this window.</p>
        </Card>
        <Card title="📈 Weekly Pattern">
          <div style={styles.bigText} >{dna.weeklyPattern}</div>
        </Card>
      </div>

      <div style={styles.grid2}>
        <Card title="⚡ Top Stress Triggers">
          <div style={styles.tagList}>
            {dna.topTriggers.map((t, i) => (
              <span key={i} style={styles.tagRed}>{t}</span>
            ))}
          </div>
        </Card>
        <Card title="💪 Your Coping Strengths">
          <div style={styles.tagList}>
            {dna.copingStrengths.map((t, i) => (
              <span key={i} style={styles.tagGreen}>{t}</span>
            ))}
          </div>
        </Card>
      </div>

      <div style={styles.infoCard}>
        <span>ℹ️</span>
        <span style={{ color: "#94a3b8", fontSize: "13px" }}>
          Your Stress DNA profile updates every week based on new data. All analysis is private and encrypted.
        </span>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={cardStyle}>
      <div style={styles.cardTitle}>{title}</div>
      {children}
    </div>
  );
}

const cardStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "16px",
  padding: "24px",
};

const styles = {
  page: { display: "flex", flexDirection: "column", gap: "20px" },
  title: { color: "#fff", fontSize: "22px", fontWeight: 800, margin: 0 },
  sub: { color: "#64748b", fontSize: "14px", margin: "4px 0 0" },
  heroCard: {
    background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))",
    border: "1px solid rgba(99,102,241,0.3)",
    borderRadius: "16px",
    padding: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroLeft: { display: "flex", alignItems: "center", gap: "16px" },
  dnaIcon: { fontSize: "40px" },
  heroName: { color: "#fff", fontWeight: 800, fontSize: "18px" },
  heroMode: { color: "#818cf8", fontSize: "13px" },
  heroBadge: {
    background: "rgba(34,197,94,0.15)",
    border: "1px solid rgba(34,197,94,0.3)",
    color: "#4ade80",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: 600,
  },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  cardTitle: { color: "#94a3b8", fontSize: "12px", fontWeight: 600, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" },
  bigText: { color: "#e2e8f0", fontSize: "18px", fontWeight: 700, lineHeight: 1.4 },
  cardNote: { color: "#475569", fontSize: "13px", marginTop: "8px" },
  tagList: { display: "flex", flexWrap: "wrap", gap: "8px" },
  tagRed: {
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.25)",
    color: "#fca5a5",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
  },
  tagGreen: {
    background: "rgba(34,197,94,0.1)",
    border: "1px solid rgba(34,197,94,0.25)",
    color: "#86efac",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
  },
  infoCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "12px",
    padding: "14px 16px",
  },
};