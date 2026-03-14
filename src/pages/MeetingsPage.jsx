import React from "react";
import { useTheme } from "../context/ThemeContext";
import { employeeData } from "../data/sampleData";

export default function MeetingsPage() {
  const { theme, isDark } = useTheme();
  const d = employeeData;

  const typeColors = {
    heavy: { bg: isDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.08)", border: isDark ? "rgba(239,68,68,0.3)" : "rgba(239,68,68,0.2)", label: theme.danger, badge: "Heavy" },
    regular: { bg: isDark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.06)", border: isDark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.15)", label: theme.accentLight, badge: "Regular" },
    daily: { bg: isDark ? "rgba(34,197,94,0.08)" : "rgba(34,197,94,0.06)", border: isDark ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.15)", label: theme.success, badge: "Daily" },
  };

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
        <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 800, margin: 0 }}>Meeting Overload Detector 📅</h2>
        <p style={{ color: theme.textMuted, fontSize: "14px", margin: "4px 0 0" }}>Synced with calendar to protect your focus time</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
        <StatCard label="Meetings Today" value={d.meetingsToday} color={theme.danger} note="Above 4 = overloaded" theme={theme} isDark={isDark} />
        <StatCard label="Focus Time" value={`${d.focusTime}h`} color={theme.warning} note="Goal: 4h minimum" theme={theme} isDark={isDark} />
        <StatCard label="Overtime This Week" value={`${d.overtimeThisWeek}h`} color={theme.orange} note="Burnout risk zone" theme={theme} isDark={isDark} />
      </div>

      <div style={{
        background: isDark ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.06)",
        border: `1px solid ${isDark ? "rgba(239,68,68,0.25)" : "rgba(239,68,68,0.15)"}`,
        borderRadius: "14px",
        color: isDark ? "#fca5a5" : theme.danger,
        padding: "14px 16px",
        fontSize: "13px",
        fontWeight: 600,
        backdropFilter: isDark ? "none" : "blur(8px)",
      }}>
        🚨 No focus time block found today — 6 meetings scheduled back-to-back. Consider blocking 3–4 PM.
      </div>

      <div style={cs}>
        <div style={ct}>Today's Schedule</div>
        {d.todayMeetings.map((m, i) => {
          const c = typeColors[m.type];
          return (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              background: c.bg,
              border: `1px solid ${c.border}`,
              borderRadius: "12px",
              padding: "12px 16px",
              marginBottom: "8px",
              backdropFilter: isDark ? "none" : "blur(4px)",
              animation: `fadeIn 0.3s ease ${i * 0.06}s both`,
            }}>
              <span style={{ color: c.label, fontSize: "12px", fontWeight: 700, minWidth: "72px" }}>{m.time}</span>
              <div style={{ flex: 1, display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ color: theme.textPrimary, fontSize: "13px", fontWeight: 600 }}>{m.title}</span>
                <span style={{ color: theme.textMuted, fontSize: "12px" }}>{m.duration}</span>
              </div>
              <span style={{
                fontSize: "11px",
                fontWeight: 700,
                color: c.label,
                border: `1px solid ${c.border}`,
                borderRadius: "20px",
                padding: "3px 10px",
              }}>{c.badge}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ label, value, color, note, theme, isDark }) {
  return (
    <div style={{
      background: theme.cardBg,
      border: `1px solid ${theme.cardBorder}`,
      borderRadius: "16px",
      padding: "18px",
      backdropFilter: isDark ? "none" : theme.glassBlur,
      WebkitBackdropFilter: isDark ? "none" : theme.glassBlur,
      boxShadow: theme.cardShadow,
      transition: "all 0.3s ease",
    }}>
      <div style={{ color: theme.textMuted, fontSize: "12px" }}>{label}</div>
      <div style={{ color, fontSize: "32px", fontWeight: 800 }}>{value}</div>
      <div style={{ color: theme.textDim, fontSize: "11px" }}>{note}</div>
    </div>
  );
}