import React from "react";

export default function StressGauge({ score }) {
  const getColor = (s) => {
    if (s < 40) return "#22c55e";
    if (s < 60) return "#eab308";
    if (s < 80) return "#f97316";
    return "#ef4444";
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
    <div style={styles.wrap}>
      <svg width="180" height="130" viewBox="0 0 180 140">
        {/* Background arc */}
        <circle
          cx="90" cy="100" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="12"
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
          strokeDashoffset={circ * 0.125}
          strokeLinecap="round"
          transform="rotate(180, 90, 100)"
        />
        {/* Filled arc */}
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
        <text x="90" y="95" textAnchor="middle" fill="#fff" fontSize="32" fontWeight="800">
          {score}
        </text>
        <text x="90" y="115" textAnchor="middle" fill={color} fontSize="13" fontWeight="600">
          {getLabel(score)}
        </text>
      </svg>
      <div style={{ color: "#64748b", fontSize: "12px", textAlign: "center", marginTop: "-8px" }}>
        Stress Score
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};