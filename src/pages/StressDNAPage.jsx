import React from "react";
import { useTheme } from "../context/ThemeContext";
import { studentData, employeeData } from "../data/sampleData";

export default function StressDNAPage({ mode }) {
  const { theme, isDark } = useTheme();
  const d = mode === "academic" ? studentData : employeeData;
  const dna = d.stressDNA;

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
  const ct = { color: theme.textSecondary, fontSize: "12px", fontWeight: 600, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 800, margin: 0 }}>Your Stress DNA 🧬</h2>
        <p style={{ color: theme.textMuted, fontSize: "14px", margin: "4px 0 0" }}>Your unique stress pattern map — built from 2 weeks of data</p>
      </div>

      <div style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))"
          : "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.08))",
        border: `1px solid ${isDark ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.2)"}`,
        borderRadius: "18px",
        padding: "24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backdropFilter: isDark ? "none" : "blur(12px)",
        boxShadow: theme.cardShadow,
        animation: "fadeIn 0.4s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ fontSize: "40px" }}>🧬</div>
          <div>
            <div style={{ color: theme.textPrimary, fontWeight: 800, fontSize: "18px" }}>{d.name}'s Stress Profile</div>
            <div style={{ color: theme.accentLight, fontSize: "13px" }}>{mode === "academic" ? "Academic Mode" : "Workplace Mode"}</div>
          </div>
        </div>
        <div style={{
          background: isDark ? "rgba(34,197,94,0.15)" : "rgba(34,197,94,0.1)",
          border: `1px solid ${isDark ? "rgba(34,197,94,0.3)" : "rgba(34,197,94,0.2)"}`,
          color: theme.success,
          padding: "8px 16px",
          borderRadius: "20px",
          fontSize: "13px",
          fontWeight: 600,
        }}>Profile Complete ✓</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={cs}>
          <div style={ct}>⏰ Peak Stress Window</div>
          <div style={{ color: theme.textPrimary, fontSize: "18px", fontWeight: 700, lineHeight: 1.4 }}>{dna.peakStressTime}</div>
          <p style={{ color: theme.textDim, fontSize: "13px", marginTop: "8px" }}>Avoid scheduling high-focus tasks during this window.</p>
        </div>
        <div style={cs}>
          <div style={ct}>📈 Weekly Pattern</div>
          <div style={{ color: theme.textPrimary, fontSize: "18px", fontWeight: 700, lineHeight: 1.4 }}>{dna.weeklyPattern}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={cs}>
          <div style={ct}>⚡ Top Stress Triggers</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {dna.topTriggers.map((t, i) => (
              <span key={i} style={{
                background: isDark ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.08)",
                border: `1px solid ${isDark ? "rgba(239,68,68,0.25)" : "rgba(239,68,68,0.2)"}`,
                color: isDark ? "#fca5a5" : theme.danger,
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "13px",
                animation: `fadeIn 0.3s ease ${i * 0.1}s both`,
              }}>{t}</span>
            ))}
          </div>
        </div>
        <div style={cs}>
          <div style={ct}>💪 Your Coping Strengths</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {dna.copingStrengths.map((t, i) => (
              <span key={i} style={{
                background: isDark ? "rgba(34,197,94,0.1)" : "rgba(34,197,94,0.08)",
                border: `1px solid ${isDark ? "rgba(34,197,94,0.25)" : "rgba(34,197,94,0.2)"}`,
                color: isDark ? "#86efac" : theme.success,
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "13px",
                animation: `fadeIn 0.3s ease ${i * 0.1}s both`,
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.4)",
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: "14px",
        padding: "14px 16px",
        backdropFilter: isDark ? "none" : "blur(8px)",
      }}>
        <span>ℹ️</span>
        <span style={{ color: theme.textSecondary, fontSize: "13px" }}>
          Your Stress DNA profile updates every week based on new data. All analysis is private and encrypted.
        </span>
      </div>
    </div>
  );
}