import React from "react";

export default function WeeklyChart({ data, dataKey = "stress", color = "#6366f1" }) {
  const max = Math.max(...data.map((d) => d[dataKey]));

  return (
    <div style={styles.wrap}>
      {data.map((d, i) => (
        <div key={i} style={styles.bar}>
          <div style={styles.barOuter}>
            <div
              style={{
                ...styles.barFill,
                height: `${(d[dataKey] / max) * 100}%`,
                background: color,
                boxShadow: `0 0 8px ${color}55`,
              }}
            />
          </div>
          <span style={styles.day}>{d.day}</span>
          <span style={styles.val}>{d[dataKey]}</span>
        </div>
      ))}
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    gap: "8px",
    alignItems: "flex-end",
    height: "100px",
    padding: "0 4px",
  },
  bar: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    height: "100%",
  },
  barOuter: {
    flex: 1,
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "6px",
    display: "flex",
    alignItems: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: "6px",
    transition: "height 0.5s ease",
  },
  day: { color: "#64748b", fontSize: "10px" },
  val: { color: "#94a3b8", fontSize: "10px" },
};