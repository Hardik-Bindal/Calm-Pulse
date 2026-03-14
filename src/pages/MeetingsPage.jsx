import React from "react";
import { employeeData } from "../data/sampleData";

const typeColors = {
  heavy: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", label: "#f87171", badge: "Heavy" },
  regular: { bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.2)", label: "#818cf8", badge: "Regular" },
  daily: { bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)", label: "#4ade80", badge: "Daily" },
};

export default function MeetingsPage() {
  const d = employeeData;

  return (
    <div style={styles.page}>
      <div>
        <h2 style={styles.title}>Meeting Overload Detector 📅</h2>
        <p style={styles.sub}>Synced with calendar to protect your focus time</p>
      </div>

      <div style={styles.grid3}>
        <StatCard label="Meetings Today" value={d.meetingsToday} color="#ef4444" note="Above 4 = overloaded" />
        <StatCard label="Focus Time" value={`${d.focusTime}h`} color="#eab308" note="Goal: 4h minimum" />
        <StatCard label="Overtime This Week" value={`${d.overtimeThisWeek}h`} color="#f97316" note="Burnout risk zone" />
      </div>

      <div style={styles.alert}>
        🚨 No focus time block found today — 6 meetings scheduled back-to-back. Consider blocking 3–4 PM.
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>Today's Schedule</div>
        {d.todayMeetings.map((m, i) => {
          const c = typeColors[m.type];
          return (
            <div key={i} style={{ ...styles.meetCard, background: c.bg, border: `1px solid ${c.border}` }}>
              <span style={{ ...styles.meetTime, color: c.label }}>{m.time}</span>
              <div style={styles.meetInfo}>
                <span style={styles.meetTitle}>{m.title}</span>
                <span style={styles.meetDur}>{m.duration}</span>
              </div>
              <span style={{ ...styles.badge, color: c.label, borderColor: c.border }}>{c.badge}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ label, value, color, note }) {
  return (
    <div style={styles.statCard}>
      <div style={{ color: "#64748b", fontSize: "12px" }}>{label}</div>
      <div style={{ color, fontSize: "32px", fontWeight: 800 }}>{value}</div>
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
  alert: {
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: "12px",
    color: "#fca5a5",
    padding: "14px 16px",
    fontSize: "13px",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "24px",
  },
  cardTitle: { color: "#94a3b8", fontSize: "12px", fontWeight: 600, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" },
  meetCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    borderRadius: "10px",
    padding: "12px 16px",
    marginBottom: "8px",
  },
  meetTime: { fontSize: "12px", fontWeight: 700, minWidth: "72px" },
  meetInfo: { flex: 1, display: "flex", gap: "8px", alignItems: "center" },
  meetTitle: { color: "#e2e8f0", fontSize: "13px", fontWeight: 600 },
  meetDur: { color: "#64748b", fontSize: "12px" },
  badge: {
    fontSize: "11px",
    fontWeight: 700,
    border: "1px solid",
    borderRadius: "20px",
    padding: "3px 10px",
  },
};