import React, { useState } from "react";
import { useTheme } from "../themes/ThemeContext";

const INFO = [
  { icon: "😊", label: "Emotion Detection", desc: "Real-time facial expression analysis", color: "#14b8a6" },
  { icon: "📊", label: "Stress Analysis", desc: "Track stress patterns during sessions", color: "#a78bfa" },
  { icon: "🔒", label: "Privacy First", desc: "All processing happens locally on device", color: "#22c55e" },
  { icon: "⚡", label: "Instant Feedback", desc: "Get results within seconds of scanning", color: "#f59e0b" },
];

export default function Camera() {
  const { theme, isDark } = useTheme();
  const [active, setActive] = useState(false);

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 800, margin: "0 0 4px" }}>
          📷 Interactive Camera Session
        </h2>
        <p style={{ color: theme.textMuted, fontSize: "13px", margin: 0 }}>
          Real-time stress detection through facial expression analysis
        </p>
      </div>

      {/* Main content: camera + info side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px", marginBottom: "20px" }}>
        {/* Camera panel */}
        <div style={{
          background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)",
          border: `1px solid ${active ? theme.accent + "60" : theme.cardBorder}`,
          borderRadius: "16px", padding: "24px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "20px",
          transition: "border-color 0.3s ease",
          boxShadow: active ? `0 0 40px ${theme.accentGlow}` : "none",
        }}>
          {/* Camera feed placeholder */}
          <div style={{
            width: "100%", aspectRatio: "16/9",
            borderRadius: "12px",
            background: isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.06)",
            border: `2px dashed ${active ? theme.accent : theme.cardBorder}`,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: "12px", transition: "all 0.3s ease",
            position: "relative", overflow: "hidden",
          }}>
            {active && (
              <div style={{
                position: "absolute", top: "12px", left: "12px",
                display: "flex", alignItems: "center", gap: "6px",
                background: "rgba(0,0,0,0.6)", padding: "5px 10px", borderRadius: "20px",
              }}>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#f43f5e", animation: "pulse 1s infinite" }} />
                <span style={{ color: "#fff", fontSize: "11px", fontWeight: 600 }}>LIVE</span>
              </div>
            )}
            <span style={{ fontSize: "56px", opacity: active ? 0.8 : 0.4 }}>{active ? "🎥" : "📷"}</span>
            <p style={{ color: theme.textMuted, fontSize: "14px", margin: 0, textAlign: "center" }}>
              {active ? "Camera feed active" : "Camera is off"}
            </p>
            {active && (
              <p style={{ color: theme.textDim, fontSize: "12px", margin: 0 }}>
                IoT/backend integration coming soon
              </p>
            )}
          </div>

          <button
            onClick={() => setActive(!active)}
            style={{
              padding: "12px 40px", borderRadius: "12px", border: "none",
              background: active
                ? isDark ? "rgba(244,63,94,0.15)" : "rgba(244,63,94,0.1)"
                : theme.accentGradient,
              color: active ? "#f43f5e" : "#fff",
              fontSize: "14px", fontWeight: 700, cursor: "pointer",
              border: active ? "1px solid rgba(244,63,94,0.4)" : "none",
              boxShadow: active ? "none" : `0 4px 14px ${theme.accentGlow}`,
              transition: "all 0.2s ease",
            }}
          >
            {active ? "⏹ Stop Session" : "▶ Start Session"}
          </button>
        </div>

        {/* Info cards — stacked vertically */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {INFO.map((item, i) => (
            <div key={i} style={{
              background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)",
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: "14px", padding: "16px 18px",
              display: "flex", alignItems: "center", gap: "14px",
              animation: `slideInLeft 0.3s ease ${i * 0.07}s both`,
            }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "10px",
                background: item.color + (isDark ? "18" : "12"),
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px", flexShrink: 0,
              }}>{item.icon}</div>
              <div>
                <div style={{ color: theme.textPrimary, fontSize: "13px", fontWeight: 700 }}>{item.label}</div>
                <div style={{ color: theme.textDim, fontSize: "12px", marginTop: "2px" }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
