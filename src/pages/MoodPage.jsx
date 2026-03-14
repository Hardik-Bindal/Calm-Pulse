import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
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
  const { theme, isDark } = useTheme();
  const [selected, setSelected] = useState(null);
  const [logged, setLogged] = useState(false);

  const cs = {
    background: theme.cardBg,
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: "18px",
    padding: "24px",
    backdropFilter: isDark ? "none" : theme.glassBlur,
    WebkitBackdropFilter: isDark ? "none" : theme.glassBlur,
    boxShadow: theme.cardShadow,
    transition: "all 0.3s ease",
  };
  const ct = { color: theme.textSecondary, fontSize: "12px", fontWeight: 600, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 800, margin: 0 }}>Mood Tracker 😊</h2>
        <p style={{ color: theme.textMuted, fontSize: "14px", margin: "4px 0 0" }}>Daily check-in with weekly trends</p>
      </div>

      <div style={cs}>
        <div style={ct}>How are you feeling right now?</div>
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", justifyContent: "center" }}>
          {moods.map((m) => (
            <button
              key={m.value}
              onClick={() => setSelected(m)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                padding: "16px 20px",
                borderRadius: "16px",
                border: `2px solid ${selected?.value === m.value ? theme.accent : theme.cardBorder}`,
                background: selected?.value === m.value
                  ? isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)"
                  : isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.4)",
                cursor: "pointer",
                transition: "all 0.2s",
                transform: selected?.value === m.value ? "scale(1.05)" : "scale(1)",
                backdropFilter: isDark ? "none" : "blur(8px)",
              }}
            >
              <span style={{ fontSize: "28px" }}>{m.emoji}</span>
              <span style={{ fontSize: "12px", color: theme.textSecondary }}>{m.label}</span>
            </button>
          ))}
        </div>
        {!logged ? (
          <button
            onClick={() => selected && setLogged(true)}
            style={{
              background: theme.accentGradient,
              border: "none",
              borderRadius: "14px",
              padding: "12px 28px",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              cursor: selected ? "pointer" : "not-allowed",
              display: "block",
              margin: "0 auto",
              opacity: selected ? 1 : 0.4,
              boxShadow: selected ? `0 4px 14px ${theme.accent}44` : "none",
              transition: "all 0.3s",
            }}
          >
            Log Today's Mood
          </button>
        ) : (
          <div style={{
            textAlign: "center",
            color: theme.success,
            fontSize: "14px",
            background: isDark ? "rgba(34,197,94,0.1)" : "rgba(34,197,94,0.08)",
            border: `1px solid ${isDark ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.15)"}`,
            borderRadius: "12px",
            padding: "12px",
            animation: "scaleIn 0.3s ease",
          }}>
            ✅ Mood logged! Great job checking in. Keep it up for your streak.
          </div>
        )}
      </div>

      <div style={cs}>
        <div style={ct}>This Week's Mood Trend</div>
        <WeeklyChart data={studentData.weeklyMood} dataKey="mood" color={theme.cyan} />
      </div>

      <div style={{
        background: isDark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.06)",
        border: `1px solid ${isDark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.12)"}`,
        borderRadius: "18px",
        padding: "20px",
        backdropFilter: isDark ? "none" : "blur(8px)",
        boxShadow: theme.cardShadow,
      }}>
        <div style={{ color: theme.accentLighter, fontSize: "14px", fontWeight: 700, marginBottom: "8px" }}>📊 AI Insight</div>
        <p style={{ color: theme.textSecondary, fontSize: "13px", lineHeight: 1.6, margin: 0 }}>
          Your mood drops significantly on days after less than 6 hours of sleep.
          Thursday's low mood (3/10) aligned with only 4.5h of sleep the previous night.
          Try maintaining 7+ hours for better academic performance.
        </p>
      </div>
    </div>
  );
}