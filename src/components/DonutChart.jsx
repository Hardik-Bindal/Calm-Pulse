import React from "react";
import { useTheme } from "../context/ThemeContext";

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`;
}

export default function DonutChart({ segments, size = 130, thickness = 22, centerLabel, centerSub }) {
  const { theme } = useTheme();
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - thickness) / 2;
  const total = segments.reduce((s, d) => s + d.value, 0);

  let currentAngle = 0;
  const arcs = segments.map((seg) => {
    const sweep = (seg.value / total) * 360;
    const start = currentAngle;
    const end = currentAngle + sweep - 1.5;
    currentAngle += sweep;
    return { ...seg, start, end };
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={theme.ringBg} strokeWidth={thickness} />
        {arcs.map((arc, i) => (
          <path
            key={i}
            d={arcPath(cx, cy, r, arc.start, arc.end)}
            fill="none"
            stroke={arc.color}
            strokeWidth={thickness}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 5px ${arc.color}66)` }}
          />
        ))}
        {centerLabel && (
          <>
            <text x={cx} y={cy - 2} textAnchor="middle" fill={theme.textPrimary} fontSize="18" fontWeight="800">{centerLabel}</text>
            {centerSub && <text x={cx} y={cy + 14} textAnchor="middle" fill={theme.textMuted} fontSize="9">{centerSub}</text>}
          </>
        )}
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {segments.map((seg, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: seg.color, flexShrink: 0, boxShadow: `0 0 5px ${seg.color}88` }} />
            <span style={{ color: theme.textSecondary, fontSize: "11px" }}>{seg.label}</span>
            <span style={{ color: seg.color, fontSize: "11px", fontWeight: 700, marginLeft: "auto" }}>{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}