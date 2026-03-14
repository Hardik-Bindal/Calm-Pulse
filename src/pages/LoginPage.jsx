import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function LoginPage({ onLogin }) {
  const [selected, setSelected] = useState(null);
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <div style={{
      minHeight: "100vh",
      background: isDark
        ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)"
        : "linear-gradient(135deg, #e8eaf6 0%, #f3e5f5 30%, #e0f2f1 60%, #fce4ec 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif",
      padding: "20px",
      transition: "all 0.4s ease",
    }}>
      <div style={{
        background: isDark
          ? "rgba(255,255,255,0.05)"
          : "rgba(255,255,255,0.45)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.6)"}`,
        borderRadius: "28px",
        padding: "48px 40px",
        width: "100%",
        maxWidth: "480px",
        textAlign: "center",
        backdropFilter: isDark ? "blur(20px)" : "blur(24px)",
        WebkitBackdropFilter: isDark ? "blur(20px)" : "blur(24px)",
        boxShadow: isDark
          ? "0 8px 32px rgba(0,0,0,0.4)"
          : "0 8px 40px rgba(99,102,241,0.1), 0 2px 12px rgba(0,0,0,0.04)",
        animation: "scaleIn 0.4s ease",
      }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.5)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
            borderRadius: "50%",
            width: "42px",
            height: "42px",
            fontSize: "18px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(12px)",
            transition: "all 0.3s ease",
            boxShadow: isDark ? "none" : "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {isDark ? "☀️" : "🌙"}
        </button>

        {/* Logo */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "14px",
          marginBottom: "8px",
        }}>
          <div style={{ fontSize: "44px", filter: "drop-shadow(0 4px 8px rgba(99,102,241,0.3))" }}>🛡️</div>
          <div>
            <h1 style={{
              color: theme.textPrimary,
              fontSize: "28px",
              fontWeight: 800,
              margin: 0,
              letterSpacing: "-0.5px",
            }}>StressGuard AI</h1>
            <p style={{ color: theme.textMuted, fontSize: "13px", margin: 0 }}>Wellness Platform</p>
          </div>
        </div>

        <p style={{
          color: theme.textSecondary,
          fontSize: "15px",
          margin: "16px 0 32px",
        }}>Detect stress early. Feel better. Stay balanced.</p>

        <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
          <ModeCard
            emoji="🎓"
            title="Academic Mode"
            desc="For Students"
            active={selected === "academic"}
            onClick={() => setSelected("academic")}
            theme={theme}
            isDark={isDark}
          />
          <ModeCard
            emoji="💼"
            title="Workplace Mode"
            desc="For Employees"
            active={selected === "workplace"}
            onClick={() => setSelected("workplace")}
            theme={theme}
            isDark={isDark}
          />
        </div>

        <button
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "14px",
            border: "none",
            fontSize: "16px",
            fontWeight: 700,
            cursor: selected ? "pointer" : "not-allowed",
            transition: "all 0.3s",
            marginBottom: "20px",
            ...(selected
              ? {
                  background: theme.accentGradient,
                  color: "#fff",
                  boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
                  transform: "translateY(0)",
                }
              : {
                  background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)",
                  color: theme.textDim,
                }),
          }}
          disabled={!selected}
          onClick={() => selected && onLogin(selected)}
        >
          Continue →
        </button>

        <p style={{ color: theme.textDim, fontSize: "12px" }}>🔒 Your data is private. Camera & mic are always opt-in.</p>
      </div>
    </div>
  );
}

function ModeCard({ emoji, title, desc, active, onClick, theme, isDark }) {
  return (
    <div
      onClick={onClick}
      style={{
        flex: 1,
        background: active
          ? isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)"
          : isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.5)",
        border: `2px solid ${active ? theme.accent : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
        borderRadius: "18px",
        padding: "24px 16px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        position: "relative",
        transition: "all 0.25s ease",
        backdropFilter: isDark ? "none" : "blur(8px)",
        boxShadow: active
          ? `0 0 20px ${theme.accent}22`
          : isDark ? "none" : "0 2px 8px rgba(0,0,0,0.03)",
        transform: active ? "scale(1.02)" : "scale(1)",
      }}
    >
      <span style={{ fontSize: "36px" }}>{emoji}</span>
      <strong style={{ color: theme.textPrimary, fontSize: "14px" }}>{title}</strong>
      <span style={{ color: theme.textMuted, fontSize: "12px" }}>{desc}</span>
      {active && (
        <span style={{
          position: "absolute",
          top: "10px",
          right: "12px",
          background: theme.accent,
          color: "#fff",
          borderRadius: "50%",
          width: "22px",
          height: "22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "11px",
          fontWeight: 700,
          boxShadow: `0 2px 8px ${theme.accent}66`,
          animation: "scaleIn 0.2s ease",
        }}>✓</span>
      )}
    </div>
  );
}