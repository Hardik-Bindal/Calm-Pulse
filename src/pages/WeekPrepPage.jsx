import React from "react";
import { useTheme } from "../context/ThemeContext";
import { employeeData } from "../data/sampleData";

export default function WeekPrepPage() {
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
        <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 800, margin: 0 }}>Upcoming Week Prep 🗓️</h2>
        <p style={{ color: theme.textMuted, fontSize: "14px", margin: "4px 0 0" }}>Monday briefing — know what's ahead before it hits</p>
      </div>

      <div style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(249,115,22,0.12))"
          : "linear-gradient(135deg, rgba(239,68,68,0.06), rgba(249,115,22,0.06))",
        border: `1px solid ${isDark ? "rgba(249,115,22,0.25)" : "rgba(249,115,22,0.15)"}`,
        borderRadius: "18px",
        padding: "24px",
        backdropFilter: isDark ? "none" : "blur(8px)",
        boxShadow: theme.cardShadow,
        animation: "fadeIn 0.4s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "32px" }}>⚠️</span>
          <div>
            <div style={{ color: theme.textPrimary, fontWeight: 800, fontSize: "18px" }}>{d.upcomingWeek.summary}</div>
            <div style={{ color: theme.textSecondary, fontSize: "13px", marginTop: "4px" }}>Higher stress week predicted — here's how to pace yourself</div>
          </div>
        </div>
      </div>

      <div style={cs}>
        <div style={ct}>AI Recommendations for This Week</div>
        {d.upcomingWeek.tips.map((tip, i) => (
          <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "14px", animation: `fadeIn 0.3s ease ${i * 0.1}s both` }}>
            <span style={{
              background: isDark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.12)",
              color: theme.accentLight,
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 700,
              flexShrink: 0,
            }}>{i + 1}</span>
            <span style={{ color: theme.textSecondary, fontSize: "14px", lineHeight: 1.5 }}>{tip}</span>
          </div>
        ))}
      </div>

      <div style={cs}>
        <div style={ct}>Work-Life Balance Alerts</div>
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
              gap: "10px",
              alignItems: "center",
              backdropFilter: isDark ? "none" : "blur(4px)",
              animation: `fadeIn 0.3s ease ${i * 0.1}s both`,
            }}>
              <span>{c.icon}</span>
              <span style={{ color: c.text, fontSize: "13px" }}>{a.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}