import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function RadarChart({ data, color = "#6366f1", size = 180 }) {
  const { theme } = useTheme();
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const n = data.length;

  const angleStep = (2 * Math.PI) / n;
  const getPoint = (i, radius) => ({
    x: cx + radius * Math.sin(i * angleStep),
    y: cy - radius * Math.cos(i * angleStep),
  });

  const rings = [0.25, 0.5, 0.75, 1];
  const valuePoints = data.map((d, i) => getPoint(i, (d.value / 100) * r));
  const valuePath = valuePoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id={`radarGrad_${color.replace("#","")}`}>
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </radialGradient>
      </defs>

      {rings.map((ring, ri) => {
        const pts = Array.from({ length: n }, (_, i) => getPoint(i, ring * r));
        const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
        return <path key={ri} d={path} fill="none" stroke={theme.chartGrid} strokeWidth="1" />;
      })}

      {data.map((_, i) => {
        const pt = getPoint(i, r);
        return <line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke={theme.chartGrid} strokeWidth="1" />;
      })}

      <path d={valuePath} fill={`url(#radarGrad_${color.replace("#","")})`} stroke={color} strokeWidth="2"
        style={{ filter: `drop-shadow(0 0 6px ${color}66)` }} />

      {valuePoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={color} stroke={theme.dotStroke} strokeWidth="1.5"
          style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
      ))}

      {data.map((d, i) => {
        const labelPt = getPoint(i, r + 16);
        return (
          <text key={i} x={labelPt.x} y={labelPt.y} textAnchor="middle" dominantBaseline="middle"
            fill={theme.textSecondary} fontSize="9" fontWeight="600">
            {d.axis}
          </text>
        );
      })}

      {data.map((d, i) => {
        const vp = valuePoints[i];
        return (
          <text key={i} x={vp.x} y={vp.y - 7} textAnchor="middle" fill={color} fontSize="8" fontWeight="700">
            {d.value}
          </text>
        );
      })}
    </svg>
  );
}