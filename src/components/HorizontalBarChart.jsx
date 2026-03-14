import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function HorizontalBarChart({ data }) {
  const { theme } = useTheme();

  const getColor = (val) => {
    if (val >= 70) return theme.success;
    if (val >= 50) return theme.warning;
    return theme.danger;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {data.map((item, i) => {
        const c = getColor(item.value);
        return (
          <div key={i} style={{ animation: `fadeIn 0.3s ease ${i * 0.08}s both` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ color: theme.textSecondary, fontSize: "12px", fontWeight: 600 }}>{item.subject || item.label}</span>
              <span style={{ color: c, fontSize: "12px", fontWeight: 700 }}>{item.value}%</span>
            </div>
            <div style={{ height: "8px", background: theme.barBg, borderRadius: "4px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${item.value}%`,
                  background: `linear-gradient(90deg, ${c}bb, ${c})`,
                  borderRadius: "4px",
                  boxShadow: `0 0 8px ${c}55`,
                  transition: "width 0.8s ease",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}