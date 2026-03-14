import React from "react";
import { useTheme } from "../context/ThemeContext";
import { studentData } from "../data/sampleData";

export default function SleepPage() {
  const { theme, isDark } = useTheme();
  const logs = studentData.sleepLog;

  const qualityColor = { Good: theme.success, Fair: theme.warning, Poor: theme.danger };

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
  const ct = { color: theme.textSecondary, fontSize: "12px", fontWeight: 600, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.05em" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 800, margin: 0 }}>Sleep Quality Log 🌙</h2>
        <p style={{ color: theme.textMuted, fontSize: "14px", margin: "4px 0 0" }}>See how sleep affects your stress and performance</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
        <StatCard label="Avg Sleep" value="6.5h" color={theme.accent} note="This week" theme={theme} isDark={isDark} />
        <StatCard label="Best Night" value="8h (Sat)" color={theme.success} note="Good quality" theme={theme} isDark={isDark} />
        <StatCard label="Worst Night" value="4.5h (Thu)" color={theme.danger} note="Poor quality" theme={theme} isDark={isDark} />
      </div>

      <div style={cs}>
        <div style={ct}>This Week's Sleep Log</div>
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", height: "130px", marginBottom: "12px" }}>
          {logs.map((l, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%", animation: `fadeIn 0.3s ease ${i * 0.06}s both` }}>
              <div style={{ color: theme.textSecondary, fontSize: "11px" }}>{l.hours}h</div>
              <div style={{
                flex: 1,
                width: "100%",
                background: theme.barBg,
                borderRadius: "8px",
                display: "flex",
                alignItems: "flex-end",
                overflow: "hidden",
              }}>
                <div style={{
                  width: "100%",
                  height: `${(l.hours / 9) * 100}%`,
                  background: qualityColor[l.quality],
                  borderRadius: "8px",
                  boxShadow: `0 0 8px ${qualityColor[l.quality]}55`,
                  transition: "height 0.5s ease",
                }} />
              </div>
              <div style={{ color: theme.textMuted, fontSize: "11px" }}>{l.day}</div>
              <div style={{ color: qualityColor[l.quality], fontSize: "10px", fontWeight: 600 }}>{l.quality}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "16px", fontSize: "12px", marginTop: "8px" }}>
          <span style={{ color: theme.success }}>● Good (7+ hrs)</span>
          <span style={{ color: theme.warning }}>● Fair (6-7 hrs)</span>
          <span style={{ color: theme.danger }}>● Poor (&lt;6 hrs)</span>
        </div>
      </div>

      <div style={{
        background: isDark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.06)",
        border: `1px solid ${isDark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.12)"}`,
        borderRadius: "18px",
        padding: "20px",
        backdropFilter: isDark ? "none" : "blur(8px)",
        boxShadow: theme.cardShadow,
      }}>
        <div style={{ color: theme.accentLighter, fontSize: "14px", fontWeight: 700, marginBottom: "8px" }}>💡 Sleep Insight</div>
        <p style={{ color: theme.textSecondary, fontSize: "13px", lineHeight: 1.6, margin: 0 }}>
          On days after poor sleep (&lt;6h), your stress score averaged 76 vs 52 after good sleep.
          Prioritizing 7+ hours during exam week could reduce your stress by up to 30%.
        </p>
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
      <div style={{ color, fontSize: "28px", fontWeight: 800 }}>{value}</div>
      <div style={{ color: theme.textDim, fontSize: "11px" }}>{note}</div>
    </div>
  );
}