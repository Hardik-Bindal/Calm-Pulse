import React, { useState } from "react";
import { studentData } from "../data/sampleData";
import WeeklyChart from "../components/WeeklyChart";

const moods = [
  { label: "Great", emoji: "😄", value: 9 },
  { label: "Good", emoji: "🙂", value: 7 },
  { label: "Okay", emoji: "😐", value: 5 },
  { label: "Low", emoji: "😞", value: 3 },
  { label: "Terrible", emoji: "😣", value: 1 },
];

export default function MoodPage() {
  const [selected, setSelected] = useState(null);
  const [logged, setLogged] = useState(false);

  return (
    <div style={styles.page}>
      <div>
        <h2 style={styles.title}>Mood Tracker 😊</h2>
        <p style={styles.sub}>Daily check-in with weekly trends</p>
      </div>

      {/* Today's check-in */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>How are you feeling right now?</div>
        <div style={styles.moodRow}>
          {moods.map((m) => (
            <button
              key={m.value}
              onClick={() => setSelected(m)}
              style={{
                ...styles.moodBtn,
                ...(selected?.value === m.value ? styles.moodBtnActive : {}),
              }}
            >
              <span style={{ fontSize: "28px" }}>{m.emoji}</span>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>{m.label}</span>
            </button>
          ))}
        </div>
        {!logged ? (
          <button
            onClick={() => selected && setLogged(true)}
            style={{ ...styles.logBtn, ...(selected ? {} : { opacity: 0.4, cursor: "not-allowed" }) }}
          >
            Log Today's Mood
          </button>
        ) : (
          <div style={styles.loggedMsg}>
            ✅ Mood logged! Great job checking in. Keep it up for your streak.
          </div>
        )}
      </div>

      {/* Weekly trend */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>This Week's Mood Trend</div>
        <WeeklyChart data={studentData.weeklyMood} dataKey="mood" color="#22d3ee" />
      </div>

      {/* Correlation note */}
      <div style={styles.insightCard}>
        <div style={styles.insightTitle}>📊 AI Insight</div>
        <p style={styles.insightText}>
          Your mood drops significantly on days after less than 6 hours of sleep.
          Thursday's low mood (3/10) aligned with only 4.5h of sleep the previous night.
          Try maintaining 7+ hours for better academic performance.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", flexDirection: "column", gap: "20px" },
  title: { color: "#fff", fontSize: "22px", fontWeight: 800, margin: 0 },
  sub: { color: "#64748b", fontSize: "14px", margin: "4px 0 0" },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "24px",
  },
  cardTitle: { color: "#94a3b8", fontSize: "12px", fontWeight: 600, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" },
  moodRow: { display: "flex", gap: "12px", marginBottom: "20px", justifyContent: "center" },
  moodBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    padding: "16px 20px",
    borderRadius: "14px",
    border: "2px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  moodBtnActive: {
    border: "2px solid #6366f1",
    background: "rgba(99,102,241,0.15)",
  },
  logBtn: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none",
    borderRadius: "12px",
    padding: "12px 28px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    display: "block",
    margin: "0 auto",
  },
  loggedMsg: {
    textAlign: "center",
    color: "#4ade80",
    fontSize: "14px",
    background: "rgba(34,197,94,0.1)",
    border: "1px solid rgba(34,197,94,0.2)",
    borderRadius: "10px",
    padding: "12px",
  },
  insightCard: {
    background: "rgba(99,102,241,0.08)",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: "16px",
    padding: "20px",
  },
  insightTitle: { color: "#a5b4fc", fontSize: "14px", fontWeight: 700, marginBottom: "8px" },
  insightText: { color: "#94a3b8", fontSize: "13px", lineHeight: 1.6, margin: 0 },
};