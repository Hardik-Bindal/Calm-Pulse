import React from "react";
import { studentData } from "../data/sampleData";

const qualityColor = { Good: "#22c55e", Fair: "#eab308", Poor: "#ef4444" };

export default function SleepPage() {
  const logs = studentData.sleepLog;

  return (
    <div style={styles.page}>
      <div>
        <h2 style={styles.title}>Sleep Quality Log 🌙</h2>
        <p style={styles.sub}>See how sleep affects your stress and performance</p>
      </div>

      {/* Summary cards */}
      <div style={styles.grid3}>
        <StatCard label="Avg Sleep" value="6.5h" color="#6366f1" note="This week" />
        <StatCard label="Best Night" value="8h (Sat)" color="#22c55e" note="Good quality" />
        <StatCard label="Worst Night" value="4.5h (Thu)" color="#ef4444" note="Poor quality" />
      </div>

      {/* Sleep bars */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>This Week's Sleep Log</div>
        <div style={styles.sleepBars}>
          {logs.map((l, i) => (
            <div key={i} style={styles.barWrap}>
              <div style={styles.barHours}>{l.hours}h</div>
              <div style={styles.barOuter}>
                <div
                  style={{
                    ...styles.barFill,
                    height: `${(l.hours / 9) * 100}%`,
                    background: qualityColor[l.quality],
                    boxShadow: `0 0 8px ${qualityColor[l.quality]}55`,
                  }}
                />
              </div>
              <div style={{ color: "#64748b", fontSize: "11px" }}>{l.day}</div>
              <div style={{ color: qualityColor[l.quality], fontSize: "10px" }}>{l.quality}</div>
            </div>
          ))}
        </div>
        <div style={styles.legend}>
          <span style={{ color: "#22c55e" }}>● Good (7+ hrs)</span>
          <span style={{ color: "#eab308" }}>● Fair (6-7 hrs)</span>
          <span style={{ color: "#ef4444" }}>● Poor (&lt;6 hrs)</span>
        </div>
      </div>

      <div style={styles.insightCard}>
        <div style={styles.insightTitle}>💡 Sleep Insight</div>
        <p style={styles.insightText}>
          On days after poor sleep (&lt;6h), your stress score averaged 76 vs 52 after good sleep.
          Prioritizing 7+ hours during exam week could reduce your stress by up to 30%.
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, note }) {
  return (
    <div style={styles.statCard}>
      <div style={{ color: "#64748b", fontSize: "12px" }}>{label}</div>
      <div style={{ color, fontSize: "28px", fontWeight: 800 }}>{value}</div>
      <div style={{ color: "#475569", fontSize: "11px" }}>{note}</div>
    </div>
  );
}

const styles = {
  page: { display: "flex", flexDirection: "column", gap: "20px" },
  title: { color: "#fff", fontSize: "22px", fontWeight: 800, margin: 0 },
  sub: { color: "#64748b", fontSize: "14px", margin: "4px 0 0" },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" },
  statCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "18px",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "24px",
  },
  cardTitle: { color: "#94a3b8", fontSize: "12px", fontWeight: 600, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.05em" },
  sleepBars: { display: "flex", gap: "12px", alignItems: "flex-end", height: "130px", marginBottom: "12px" },
  barWrap: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%" },
  barHours: { color: "#94a3b8", fontSize: "11px" },
  barOuter: {
    flex: 1,
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "6px",
    display: "flex",
    alignItems: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: "6px",
    transition: "height 0.5s ease",
  },
  legend: { display: "flex", gap: "16px", fontSize: "12px", marginTop: "8px" },
  insightCard: {
    background: "rgba(99,102,241,0.08)",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: "16px",
    padding: "20px",
  },
  insightTitle: { color: "#a5b4fc", fontSize: "14px", fontWeight: 700, marginBottom: "8px" },
  insightText: { color: "#94a3b8", fontSize: "13px", lineHeight: 1.6, margin: 0 },
};