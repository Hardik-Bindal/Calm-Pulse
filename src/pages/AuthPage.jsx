import React, { useState } from "react";
import { useTheme } from "../themes/ThemeContext";
import { useGoogleLogin } from '@react-oauth/google';
import { useMsal } from '@azure/msal-react';

export default function AuthPage({ onLogin }) {
  const { theme, isDark } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { instance } = useMsal();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: tokenResponse => {
      console.log("Google Login Success:", tokenResponse);
      onLogin(); // Simulate successful auth flow
    },
    onError: error => console.error("Google Login Failed:", error)
  });

  const handleMicrosoftLogin = () => {
    instance.loginPopup({
      scopes: ["User.Read"]
    }).then(response => {
      console.log("Microsoft Login Success:", response);
      onLogin();
    }).catch(e => {
      console.error("Microsoft Login Failed:", e);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) onLogin();
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: isDark ? theme.bg : "#f1f5f9",
      padding: "20px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        background: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: "24px",
        padding: "40px 32px",
        backdropFilter: theme.glassBlur,
        boxShadow: theme.cardShadow,
        animation: "fadeIn 0.5s ease",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🛡️</div>
          <h1 style={{
            color: theme.textPrimary,
            fontSize: "24px",
            fontWeight: 800,
            margin: "0 0 6px",
          }}>
            Calm Pulse
          </h1>
          <p style={{ color: theme.textMuted, fontSize: "13px", margin: 0 }}>
            Your personal stress management companion
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ color: theme.textSecondary, fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "12px",
                border: `1px solid ${theme.inputBorder}`,
                background: theme.inputBg,
                color: theme.textPrimary,
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ color: theme.textSecondary, fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "12px",
                border: `1px solid ${theme.inputBorder}`,
                background: theme.inputBg,
                color: theme.textPrimary,
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "12px",
              border: "none",
              background: theme.accentGradient,
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: `0 4px 14px ${theme.accent}33`,
              marginBottom: "12px",
            }}
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          margin: "20px 0",
        }}>
          <div style={{ flex: 1, height: "1px", background: theme.cardBorder }} />
          <span style={{ color: theme.textDim, fontSize: "12px" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: theme.cardBorder }} />
        </div>

        {/* Google Sign In */}
        <button
          onClick={() => handleGoogleLogin()}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: `1px solid ${theme.cardBorder}`,
            background: isDark ? "rgba(255,255,255,0.04)" : "#fff",
            color: theme.textPrimary,
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "12px",
            transition: "background 0.2s ease"
          }}
          onMouseOver={(e) => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.08)" : "#f9fafb"}
          onMouseOut={(e) => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.04)" : "#fff"}
        >
          <span style={{ fontSize: "18px" }}>G</span>
          Sign in with Google
        </button>

        {/* Microsoft Sign In */}
        <button
          onClick={handleMicrosoftLogin}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: `1px solid ${theme.cardBorder}`,
            background: isDark ? "rgba(255,255,255,0.04)" : "#fff",
            color: theme.textPrimary,
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "12px",
            transition: "background 0.2s ease"
          }}
          onMouseOver={(e) => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.08)" : "#f9fafb"}
          onMouseOut={(e) => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.04)" : "#fff"}
        >
          <span style={{ fontSize: "18px", color: "#00a4ef" }}>⊞</span>
          Sign in with Microsoft
        </button>

        {/* Sample Login */}
        <button
          onClick={onLogin}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: `1px solid ${theme.success}40`,
            background: isDark ? "rgba(34,197,94,0.1)" : "rgba(34,197,94,0.06)",
            color: theme.success,
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          🚀 Sample Login (Skip Auth)
        </button>
      </div>
    </div>
  );
}
