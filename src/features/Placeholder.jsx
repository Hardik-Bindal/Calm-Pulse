import React from "react";
import { useTheme } from "../themes/ThemeContext";

const UPCOMING = [
  { icon: "📝", name: "Mood Journal", desc: "Log your daily thoughts and track patterns over time", color: "#14b8a6" },
  { icon: "🧘", name: "Guided Meditation", desc: "Audio-guided mindfulness sessions from 2 to 20 minutes", color: "#a78bfa" },
  { icon: "👥", name: "Community", desc: "Connect with peers, share your journey, get support", color: "#22c55e" },
  { icon: "📈", name: "Progress Reports", desc: "Weekly AI-generated reports on your wellness trends", color: "#f59e0b" },
];

export default function Placeholder() {
  const { theme, isDark } = useTheme();

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 800, margin: "0 0 4px" }}>
          🔮 Explore
        </h2>
        <p style={{ color: theme.textMuted, fontSize: "13px", margin: 0 }}>
          New wellness features on the horizon
        </p>
      </div>

      {/* Hero banner */}
      <div style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(20,184,166,0.08) 0%, rgba(14,165,233,0.08) 100%)"
          : "linear-gradient(135deg, rgba(20,184,166,0.06) 0%, rgba(14,165,233,0.06) 100%)",
        border: `1px solid ${theme.accent}20`,
        borderRadius: "16px", padding: "40px 32px",
        textAlign: "center", marginBottom: "20px",
      }}>
        <div style={{ fontSize: "52px", marginBottom: "12px" }}>🚀</div>
        <h3 style={{ color: theme.textPrimary, fontSize: "24px", fontWeight: 800, margin: "0 0 10px" }}>
          Coming Soon
        </h3>
        <p style={{ color: theme.textSecondary, fontSize: "14px", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
          We're building powerful new features to enhance your mental wellness journey.
          Stay tuned for journaling, meditation, community support, and much more.
        </p>
      </div>

      {/* Feature cards — 2x2 grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
        {UPCOMING.map((item, i) => (
          <div key={i} style={{
            background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)",
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: "14px", padding: "22px",
            display: "flex", alignItems: "flex-start", gap: "16px",
            animation: `scaleIn 0.3s ease ${i * 0.08}s both`,
            transition: "all 0.2s ease",
          }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "12px",
              background: item.color + (isDark ? "18" : "12"),
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "22px", flexShrink: 0,
            }}>{item.icon}</div>
            <div>
              <div style={{ color: theme.textPrimary, fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>
                {item.name}
              </div>
              <div style={{ color: theme.textSecondary, fontSize: "13px", lineHeight: 1.5 }}>
                {item.desc}
              </div>
              <div style={{
                display: "inline-block", marginTop: "10px",
                padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700,
                background: item.color + "15", color: item.color,
              }}>
                In Development
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
