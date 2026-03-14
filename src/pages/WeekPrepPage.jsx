import React from "react";
import { employeeData } from "../data/sampleData";

export default function WeekPrepPage() {
  const d = employeeData;

  return (
    <div style={styles.page}>
      <div>
        <h2 style={styles.title}>Upcoming Week Prep 🗓️</h2>
        <p style={styles.sub}>Monday briefing — know what's ahead before it hits</p>
      </div>

      <div style={styles.heroCard}>
        <div style={styles.heroTop}>
          <span style={{ fontSize: "32px" }}>⚠️</span>
          <div>
            <div style={styles.heroTitle}>{d.upcomingWeek.summary}</div>
            <div style={styles.heroSub}>Higher stress week predicted — here's how to pace yourself</div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>AI Recommendations for This Week</div>
        {d.upcomingWeek.tips.map((tip, i) => (
          <div key={i} style={styles.tip}>
            <span style={styles.tipNum}>{i + 1}</span>
            <span style={styles.tipText}>{tip}</span>
          </div>
        ))}
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>Work-Life Balance Alerts</div>
        {d.workLifeAlerts.map((a, i) => {
          const colors = {
            warning: { bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.25)", icon: "⚠️", text: "#fbbf24" },
            danger: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)", icon: "🚨", text: "#f87171" },
            info: { bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.25)", icon: "ℹ️", text: "#818cf8" },
          };
          const c = colors[a.type];
          return (
            <div key={i} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "10px", display: "flex", gap: "10px", alignItems: "center" }}>
              <span>{c.icon}</span>
              <span style={{ color: c.text, fontSize: "13px" }}>{a.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", flexDirection: "column", gap: "20px" },
  title: { color: "#fff", fontSize: "22px", fontWeight: 800, margin: 0 },
  sub: { color: "#64748b", fontSize: "14px", margin: "4px 0 0" },
  heroCard: {
    background: "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(249,115,22,0.12))",
    border: "1px solid rgba(249,115,22,0.25)",
    borderRadius: "16px",
    padding: "24px",
  },
  heroTop: { display: "flex", alignItems: "center", gap: "16px" },
  heroTitle: { color: "#fff", fontWeight: 800, fontSize: "18px" },
  heroSub: { color: "#94a3b8", fontSize: "13px", marginTop: "4px" },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "24px",
  },
  cardTitle: { color: "#94a3b8", fontSize: "12px", fontWeight: 600, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" },
  tip: { display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "14px" },
  tipNum: {
    background: "rgba(99,102,241,0.2)",
    color: "#818cf8",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 700,
    flexShrink: 0,
  },
  tipText: { color: "#cbd5e1", fontSize: "14px", lineHeight: 1.5 },
};