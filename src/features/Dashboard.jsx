import React from "react";
import { useTheme } from "../themes/ThemeContext";

const WEEKLY_MOOD = [
  { day: "Mon", value: 60, label: "60%" },
  { day: "Tue", value: 45, label: "45%" },
  { day: "Wed", value: 55, label: "55%" },
  { day: "Thu", value: 35, label: "35%" },
  { day: "Fri", value: 50, label: "50%" },
  { day: "Sat", value: 75, label: "75%" },
  { day: "Sun", value: 80, label: "80%" },
];

const EMOTIONS = [
  { label: "Happy", pct: 35, color: "#22c55e" },
  { label: "Calm", pct: 25, color: "#14b8a6" },
  { label: "Anxious", pct: 20, color: "#f59e0b" },
  { label: "Sad", pct: 12, color: "#38bdf8" },
  { label: "Angry", pct: 8, color: "#f43f5e" },
];

const STATS = [
  { label: "Stress Score", value: "62", unit: "/100", icon: "🔥", color: "#f59e0b", sub: "Moderate" },
  { label: "Mood Today", value: "7", unit: "/10", icon: "😊", color: "#22c55e", sub: "Good" },
  { label: "Focus Time", value: "4.5", unit: "hrs", icon: "⏱️", color: "#14b8a6", sub: "Today" },
  { label: "Sleep", value: "7.2", unit: "hrs", icon: "🌙", color: "#a78bfa", sub: "Last night" },
];

export default function Dashboard() {
  const { theme, isDark } = useTheme();
  const stressLevel = 62;

  const card = (extra = {}) => ({
    background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)",
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: "16px",
    padding: "22px",
    boxShadow: isDark ? "0 2px 20px rgba(0,0,0,0.3)" : theme.cardShadow,
    ...extra,
  });

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      {/* Page header */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 800, margin: "0 0 4px" }}>
          Dashboard
        </h2>
        <p style={{ color: theme.textMuted, fontSize: "13px", margin: 0 }}>
          Your wellness overview · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* KPI stat cards — 4 columns */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
        marginBottom: "20px",
      }}>
        {STATS.map((s) => (
          <div key={s.label} style={card({ display: "flex", alignItems: "center", gap: "14px" })}>
            <div style={{
              width: "46px", height: "46px", borderRadius: "12px",
              background: s.color + (isDark ? "18" : "14"),
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "22px", flexShrink: 0,
            }}>
              {s.icon}
            </div>
            <div>
              <div style={{ color: theme.textMuted, fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>
                {s.label}
              </div>
              <div style={{ color: s.color, fontSize: "22px", fontWeight: 800, lineHeight: 1 }}>
                {s.value}<span style={{ fontSize: "13px", fontWeight: 500, color: theme.textMuted, marginLeft: "2px" }}>{s.unit}</span>
              </div>
              <div style={{ color: theme.textDim, fontSize: "11px", marginTop: "2px" }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid: 3 columns */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "16px",
        marginBottom: "16px",
      }}>
        {/* Happiness Chart — full row top */}
        <div style={card({ gridColumn: "1 / -1" })}>
          <h3 style={{ color: theme.textPrimary, fontSize: "14px", fontWeight: 700, margin: "0 0 20px", display: "flex", alignItems: "center", gap: "8px" }}>
            😊 Weekly Happiness
            <span style={{ color: theme.textDim, fontSize: "12px", fontWeight: 400, marginLeft: "auto" }}>Last 7 days</span>
          </h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", height: "160px" }}>
            {WEEKLY_MOOD.map((d) => (
              <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <span style={{ color: d.value > 60 ? theme.accentLight : theme.textDim, fontSize: "11px", fontWeight: 600, opacity: d.value > 60 ? 1 : 0 }}>
                  {d.label}
                </span>
                <div style={{
                  width: "100%",
                  height: `${Math.round(d.value * 1.4)}px`,
                  borderRadius: "8px 8px 4px 4px",
                  background: d.value > 60
                    ? `linear-gradient(180deg, ${theme.accentLight}, ${theme.accent})`
                    : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                  transition: "height 0.6s ease",
                  position: "relative",
                  minHeight: "8px",
                }} />
                <span style={{ color: theme.textMuted, fontSize: "11px", fontWeight: 600 }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom grid: 2 columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Emotional Breakdown */}
        <div style={card()}>
          <h3 style={{ color: theme.textPrimary, fontSize: "14px", fontWeight: 700, margin: "0 0 18px", display: "flex", alignItems: "center", gap: "8px" }}>
            🎭 Emotional Breakdown
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {EMOTIONS.map((e) => (
              <div key={e.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <span style={{ color: theme.textSecondary, fontSize: "13px", fontWeight: 500 }}>{e.label}</span>
                  <span style={{ color: e.color, fontSize: "13px", fontWeight: 700 }}>{e.pct}%</span>
                </div>
                <div style={{ height: "7px", borderRadius: "4px", background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", overflow: "hidden" }}>
                  <div style={{
                    width: `${e.pct}%`, height: "100%",
                    borderRadius: "4px", background: e.color,
                    transition: "width 0.8s ease",
                    boxShadow: `0 0 8px ${e.color}60`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stress Gauge */}
        <div style={card({ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" })}>
          <h3 style={{ color: theme.textPrimary, fontSize: "14px", fontWeight: 700, margin: 0, alignSelf: "flex-start" }}>
            🔥 Stress Level
          </h3>

          {/* Ring gauge */}
          <div style={{
            width: "160px", height: "160px", borderRadius: "50%",
            background: `conic-gradient(
              ${stressLevel > 70 ? "#f43f5e" : stressLevel > 40 ? "#f59e0b" : "#22c55e"} ${stressLevel * 3.6}deg,
              ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"} ${stressLevel * 3.6}deg
            )`,
            boxShadow: `0 0 32px ${stressLevel > 70 ? "#f43f5e30" : "#f59e0b30"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              width: "126px", height: "126px", borderRadius: "50%",
              background: isDark ? theme.bgSecondary : "#fff",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#f59e0b", fontSize: "36px", fontWeight: 900, lineHeight: 1 }}>{stressLevel}</span>
              <span style={{ color: theme.textMuted, fontSize: "12px", marginTop: "2px" }}>out of 100</span>
            </div>
          </div>

          <div style={{
            padding: "8px 18px", borderRadius: "20px",
            background: isDark ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.25)",
            color: "#f59e0b", fontSize: "13px", fontWeight: 700,
          }}>
            ⚠️ Moderate Stress
          </div>
          <p style={{ color: theme.textMuted, fontSize: "12px", textAlign: "center", margin: 0 }}>
            Consider a short breathing exercise to reduce tension
          </p>
        </div>
      </div>
    </div>
  );
}
