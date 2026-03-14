import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function LineAreaChart({ data, dataKey, color = "#6366f1", height = 110, showDots = true, gradient = true }) {
  const { theme } = useTheme();
  const W = 400;
  const H = height;
  const pad = { top: 10, right: 10, bottom: 24, left: 28 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const values = data.map((d) => d[dataKey]);
  const min = Math.min(...values) * 0.85;
  const max = Math.max(...values) * 1.05;

  const xScale = (i) => pad.left + (i / (data.length - 1)) * innerW;
  const yScale = (v) => pad.top + innerH - ((v - min) / (max - min)) * innerH;

  const points = data.map((d, i) => ({ x: xScale(i), y: yScale(d[dataKey]) }));
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${H - pad.bottom} L ${points[0].x} ${H - pad.bottom} Z`;

  const gradId = `grad_${dataKey}_${color.replace("#", "")}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const y = pad.top + t * innerH;
        const val = Math.round(max - t * (max - min));
        return (
          <g key={i}>
            <line x1={pad.left} y1={y} x2={W - pad.right} y2={y}
              stroke={theme.chartGrid} strokeWidth="1" strokeDasharray="3 4" />
            {i % 2 === 0 && (
              <text x={pad.left - 4} y={y + 4} textAnchor="end" fill={theme.chartLabel} fontSize="9">{val}</text>
            )}
          </g>
        );
      })}

      {gradient && <path d={areaPath} fill={`url(#${gradId})`} />}

      <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 4px ${color}88)` }} />

      {showDots && points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={color} stroke={theme.dotStroke} strokeWidth="1.5"
          style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
      ))}

      {data.map((d, i) => (
        <text key={i} x={xScale(i)} y={H - 4} textAnchor="middle" fill={theme.chartLabel} fontSize="9">
          {d.day || d.hour}
        </text>
      ))}
    </svg>
  );
}