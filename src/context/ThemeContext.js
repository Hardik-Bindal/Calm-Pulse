import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const darkTheme = {
  mode: "dark",
  bg: "#0f172a",
  bgSecondary: "#1e293b",
  cardBg: "rgba(255,255,255,0.04)",
  cardBorder: "rgba(255,255,255,0.08)",
  cardShadow: "0 4px 24px rgba(0,0,0,0.3)",
  glassBg: "rgba(255,255,255,0.04)",
  glassBorder: "rgba(255,255,255,0.08)",
  glassBlur: "blur(12px)",
  textPrimary: "#ffffff",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  textDim: "#475569",
  navBg: "#0f172a",
  navBorder: "rgba(255,255,255,0.07)",
  navLinkColor: "#64748b",
  navLinkActive: "rgba(99,102,241,0.15)",
  navLinkActiveText: "#a5b4fc",
  accent: "#6366f1",
  accentLight: "#818cf8",
  accentLighter: "#a5b4fc",
  accentGradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  success: "#22c55e",
  warning: "#eab308",
  danger: "#ef4444",
  orange: "#f97316",
  cyan: "#22d3ee",
  purple: "#a78bfa",
  chartGrid: "rgba(255,255,255,0.05)",
  chartLabel: "#475569",
  scrollbarThumb: "rgba(255,255,255,0.1)",
  inputBg: "rgba(255,255,255,0.05)",
  inputBorder: "rgba(255,255,255,0.1)",
  barBg: "rgba(255,255,255,0.06)",
  ringBg: "rgba(255,255,255,0.05)",
  dotStroke: "#0f172a",
  tooltipBg: "#1e293b",
};

const lightTheme = {
  mode: "light",
  bg: "linear-gradient(135deg, #e8eaf6 0%, #f3e5f5 30%, #e0f2f1 60%, #fce4ec 100%)",
  bgSecondary: "#f1f5f9",
  cardBg: "rgba(255, 255, 255, 0.45)",
  cardBorder: "rgba(255, 255, 255, 0.6)",
  cardShadow: "0 8px 32px rgba(99, 102, 241, 0.08), 0 2px 8px rgba(0,0,0,0.04)",
  glassBg: "rgba(255, 255, 255, 0.35)",
  glassBorder: "rgba(255, 255, 255, 0.5)",
  glassBlur: "blur(20px)",
  textPrimary: "#1e293b",
  textSecondary: "#475569",
  textMuted: "#64748b",
  textDim: "#94a3b8",
  navBg: "rgba(255, 255, 255, 0.5)",
  navBorder: "rgba(255, 255, 255, 0.6)",
  navLinkColor: "#64748b",
  navLinkActive: "rgba(99,102,241,0.12)",
  navLinkActiveText: "#6366f1",
  accent: "#6366f1",
  accentLight: "#818cf8",
  accentLighter: "#6366f1",
  accentGradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  success: "#16a34a",
  warning: "#ca8a04",
  danger: "#dc2626",
  orange: "#ea580c",
  cyan: "#0891b2",
  purple: "#7c3aed",
  chartGrid: "rgba(0,0,0,0.06)",
  chartLabel: "#94a3b8",
  scrollbarThumb: "rgba(0,0,0,0.12)",
  inputBg: "rgba(255, 255, 255, 0.6)",
  inputBorder: "rgba(0, 0, 0, 0.1)",
  barBg: "rgba(0,0,0,0.06)",
  ringBg: "rgba(0,0,0,0.06)",
  dotStroke: "#ffffff",
  tooltipBg: "#ffffff",
};

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? darkTheme : lightTheme;
  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}