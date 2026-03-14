import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function StressGauge({ score }) {
  const { theme } = useTheme();

  const getColor = (s) => {
    if (s < 40) return theme.success;
    if (s < 60) return theme.warning;
    if (s < 80) return theme.orange;
    return theme.danger;
  };

  const getLabel = (s) => {
    if (s < 40) return "Low";
    if (s < 60) return "Moderate";
    if (s < 80) return "High";
    return "Critical";
  };

  const color = getColor(score);
  const pct = score / 100;
  const radius = 70;
  const circ = 2 * Math.PI * radius;
  const dash = pct * circ * 0.75;
  const gap = circ - dash;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width="180" height="130" viewBox="0 0 180 140">
        <circle
          cx="90" cy="100" r={radius}
          fill="none"
          stroke={theme.barBg}
          strokeWidth="12"
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
          strokeDashoffset={circ * 0.125}
          strokeLinecap="round"
          transform="rotate(180, 90, 100)"
        />
        <circle
          cx="90" cy="100" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={`${dash} ${gap + circ * 0.25}`}
          strokeDashoffset={circ * 0.125}
          strokeLinecap="round"
          transform="rotate(180, 90, 100)"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
        <text x="90" y="95" textAnchor="middle" fill={theme.textPrimary} fontSize="32" fontWeight="800">
          {score}
        </text>
        <text x="90" y="115" textAnchor="middle" fill={color} fontSize="13" fontWeight="600">
          {getLabel(score)}
        </text>
      </svg>
      <div style={{ color: theme.textMuted, fontSize: "12px", textAlign: "center", marginTop: "-8px" }}>
        Stress Score
      </div>
    </div>
  );
}