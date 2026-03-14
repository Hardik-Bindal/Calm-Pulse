import React from "react";
import { useTheme } from "../context/ThemeContext";
import { employeeData } from "../data/sampleData";
import WeeklyChart from "../components/WeeklyChart";

export default function WorkLifePage() {
  const { theme, isDark } = useTheme();
  const d = employeeData;

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
        <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 800, margin: 0 }}>Work-Life Balance Tracker ⚖️</h2>
        <p style={{ color: theme.textMuted, fontSize: "14px", margin: "4px 0 0" }}>Flags overtime, late-night work, and weekend sessions</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={cs}>
          <div style={ct}>Weekly Stress Trend</div>
          <WeeklyChart data={d.weeklyStress} dataKey="stress" color={theme.danger} />
        </div>
        <div style={cs}>
          <div style={ct}>Meetings Per Day</div>
          <WeeklyChart data={d.weeklyStress} dataKey="meetings" color={theme.orange} />
        </div>
      </div>

      <div style={cs}>
        <div style={ct}>Balance Alerts This Week</div>
        {d.workLifeAlerts.map((a, i) => {
          const colors = {
            warning: { bg: isDark ? "rgba(234,179,8,0.08)" : "rgba(234,179,8,0.06)", border: isDark ? "rgba(234,179,8,0.25)" : "rgba(234,179,8,0.15)", icon: "⚠️", text: theme.warning },
            danger: { bg: isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.06)", border: isDark ? "rgba(239,68,68,0.25)" : "rgba(239,68,68,0.15)", icon: "🚨", text: theme.danger },
            info: { bg: isDark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.06)", border: isDark ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.12)", icon: "ℹ️", text: theme.accentLight },
          };
          const c = colors[a.type];
          return (
            <div key={i} style={{
              background: c.bg,
              border: `1px solid ${c.border}`,
              borderRadius: "14px",
              padding: "14px 16px",
              marginBottom: "10px",
              display: "flex",
              gap: "12px",
              alignItems: "center",
              backdropFilter: isDark ? "none" : "blur(4px)",
              animation: `fadeIn 0.3s ease ${i * 0.1}s both`,
            }}>
              <span style={{ fontSize: "18px" }}>{c.icon}</span>
              <span style={{ color: c.text, fontSize: "13px" }}>{a.message}</span>
            </div>
          );
        })}
      </div>

      <div style={{
        background: isDark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.06)",
        border: `1px solid ${isDark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.12)"}`,
        borderRadius: "18px",
        padding: "20px",
        backdropFilter: isDark ? "none" : "blur(8px)",
        boxShadow: theme.cardShadow,
      }}>
        <div style={{ color: theme.accentLighter, fontSize: "14px", fontWeight: 700, marginBottom: "8px" }}>🤖 AI Recommendation</div>
        <p style={{ color: theme.textSecondary, fontSize: "13px", lineHeight: 1.6, margin: 0 }}>
          This week you've crossed 9 hours of overtime. Based on your Stress DNA, your stress
          peaks on Tuesday–Thursday. Try blocking Wednesday 2–4 PM as a no-meeting deep work window.
          A sustainable pace helps long-term performance more than short-term crunch.
        </p>
      </div>
    </div>
  );
}