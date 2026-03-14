import React from "react";
import { employeeData } from "../data/sampleData";
import WeeklyChart from "../components/WeeklyChart";

export default function WorkLifePage() {
  const d = employeeData;

  return (
    <div style={styles.page}>
      <div>
        <h2 style={styles.title}>Work-Life Balance Tracker ⚖️</h2>
        <p style={styles.sub}>Flags overtime, late-night work, and weekend sessions</p>
      </div>

      <div style={styles.grid2}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Weekly Stress Trend</div>
          <WeeklyChart data={d.weeklyStress} dataKey="stress" color="#ef4444" />
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Meetings Per Day</div>
          <WeeklyChart data={d.weeklyStress} dataKey="meetings" color="#f97316" />
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>Balance Alerts This Week</div>
        {d.workLifeAlerts.map((a, i) => {
          const colors = {
            warning: { bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.25)", icon: "⚠️", text: "#fbbf24" },
            danger: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)", icon: "🚨", text: "#f87171" },
            info: { bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.25)", icon: "ℹ️", text: "#818cf8" },
          };
          const c = colors[a.type];
          return (
            <div key={i} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "10px", display: "flex", gap: "12px", alignItems: "center" }}>
              <span style={{ fontSize: "18px" }}>{c.icon}</span>
              <span style={{ color: c.text, fontSize: "13px" }}>{a.message}</span>
            </div>
          );
        })}
      </div>

      <div style={styles.insightCard}>
        <div style={styles.insightTitle}>🤖 AI Recommendation</div>
        <p style={styles.insightText}>
          This week you've crossed 9 hours of overtime. Based on your Stress DNA, your stress
          peaks on Tuesday–Thursday. Try blocking Wednesday 2–4 PM as a no-meeting deep work window.
          A sustainable pace helps long-term performance more than short-term crunch.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", flexDirection: "column", gap: "20px" },
  title: { color: "#fff", fontSize: "22px", fontWeight: 800, margin: 0 },
  sub: { color: "#64748b", fontSize: "14px", margin: "4px 0 0" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "24px",
  },
  cardTitle: { color: "#94a3b8", fontSize: "12px", fontWeight: 600, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" },
  insightCard: {
    background: "rgba(99,102,241,0.08)",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: "16px",
    padding: "20px",
  },
  insightTitle: { color: "#a5b4fc", fontSize: "14px", fontWeight: 700, marginBottom: "8px" },
  insightText: { color: "#94a3b8", fontSize: "13px", lineHeight: 1.6, margin: 0 },
};