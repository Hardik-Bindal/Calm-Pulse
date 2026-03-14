import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function WeeklyChart({ data, dataKey = "stress", color = "#6366f1" }) {
  const { theme } = useTheme();
  const max = Math.max(...data.map((d) => d[dataKey]));

  return (
    <div style={{
      display: "flex",
      gap: "8px",
      alignItems: "flex-end",
      height: "100px",
      padding: "0 4px",
    }}>
      {data.map((d, i) => (
        <div key={i} style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          height: "100%",
          animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
        }}>
          <div style={{
            flex: 1,
            width: "100%",
            background: theme.barBg,
            borderRadius: "6px",
            display: "flex",
            alignItems: "flex-end",
            overflow: "hidden",
          }}>
            <div
              style={{
                width: "100%",
                height: `${(d[dataKey] / max) * 100}%`,
                background: color,
                borderRadius: "6px",
                boxShadow: `0 0 8px ${color}55`,
                transition: "height 0.5s ease",
              }}
            />
          </div>
          <span style={{ color: theme.textMuted, fontSize: "10px" }}>{d.day}</span>
          <span style={{ color: theme.textSecondary, fontSize: "10px" }}>{d[dataKey]}</span>
        </div>
      ))}
    </div>
  );
}