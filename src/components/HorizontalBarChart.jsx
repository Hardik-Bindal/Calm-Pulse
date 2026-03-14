import React from "react";

export default function HorizontalBarChart({ data, color = "#6366f1" }) {
  const getColor = (val) => {
    if (val >= 70) return "#22c55e";
    if (val >= 50) return "#eab308";
    return "#ef4444";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {data.map((item, i) => {
        const c = getColor(item.value);
        return (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ color: "#cbd5e1", fontSize: "12px", fontWeight: 600 }}>{item.subject || item.label}</span>
              <span style={{ color: c, fontSize: "12px", fontWeight: 700 }}>{item.value}%</span>
            </div>
            <div style={{ height: "8px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${item.value}%`,
                  background: `linear-gradient(90deg, ${c}bb, ${c})`,
                  borderRadius: "4px",
                  boxShadow: `0 0 8px ${c}55`,
                  transition: "width 0.6s ease",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}