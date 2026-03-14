import React, { useState } from "react";
import { studentData } from "../data/sampleData";

export default function StudyPlanPage() {
  const [tasks, setTasks] = useState(studentData.studyPlan);
  const toggle = (i) => setTasks((t) => t.map((x, j) => j === i ? { ...x, done: !x.done } : x));
  const done = tasks.filter((t) => t.done).length;

  return (
    <div style={styles.page}>
      <div>
        <h2 style={styles.title}>AI Study Planner 📅</h2>
        <p style={styles.sub}>Auto-generated based on your timetable and exam dates</p>
      </div>

      {/* Progress bar */}
      <div style={styles.card}>
        <div style={styles.progressHeader}>
          <span style={{ color: "#94a3b8", fontSize: "13px" }}>Today's Progress</span>
          <span style={{ color: "#6366f1", fontSize: "13px", fontWeight: 700 }}>{done}/{tasks.length} tasks</span>
        </div>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${(done / tasks.length) * 100}%` }} />
        </div>
      </div>

      {/* Tasks */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>Today's Plan — {new Date().toDateString()}</div>
        {tasks.map((task, i) => (
          <div
            key={i}
            onClick={() => toggle(i)}
            style={{ ...styles.taskRow, opacity: task.done ? 0.5 : 1 }}
          >
            <div style={{ ...styles.checkbox, ...(task.done ? styles.checked : {}) }}>
              {task.done && "✓"}
            </div>
            <div>
              <div style={styles.taskTime}>{task.time}</div>
              <div style={{ ...styles.taskName, textDecoration: task.done ? "line-through" : "none" }}>
                {task.task}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming exams */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>Upcoming Exams — Readiness</div>
        {studentData.upcomingExams.map((e, i) => (
          <div key={i} style={styles.examRow}>
            <div style={styles.examInfo}>
              <span style={styles.examName}>{e.subject}</span>
              <span style={styles.examMeta}>{e.date} · {e.daysLeft} days left</span>
            </div>
            <div style={styles.examRight}>
              <div style={styles.readBar}>
                <div style={{ ...styles.readFill, width: `${e.readiness}%` }} />
              </div>
              <span style={styles.readPct}>{e.readiness}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", flexDirection: "column", gap: "20px" },
  title: { color: "#fff", fontSize: "22px", fontWeight: 800, margin: 0 },
  sub: { color: "#64748b", fontSize: "14px", margin: "4px 0 0" },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "24px",
  },
  cardTitle: { color: "#94a3b8", fontSize: "12px", fontWeight: 600, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" },
  progressHeader: { display: "flex", justifyContent: "space-between", marginBottom: "10px" },
  progressBar: { height: "8px", background: "rgba(255,255,255,0.06)", borderRadius: "4px" },
  progressFill: { height: "8px", background: "linear-gradient(90deg, #6366f1, #8b5cf6)", borderRadius: "4px", transition: "width 0.3s" },
  taskRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "12px 0",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    cursor: "pointer",
  },
  checkbox: {
    width: "22px",
    height: "22px",
    borderRadius: "6px",
    border: "2px solid rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "12px",
    fontWeight: 700,
    flexShrink: 0,
  },
  checked: {
    background: "#6366f1",
    border: "2px solid #6366f1",
  },
  taskTime: { color: "#6366f1", fontSize: "11px", marginBottom: "2px" },
  taskName: { color: "#e2e8f0", fontSize: "13px" },
  examRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    gap: "12px",
  },
  examInfo: { display: "flex", flexDirection: "column", gap: "2px" },
  examName: { color: "#e2e8f0", fontSize: "14px", fontWeight: 600 },
  examMeta: { color: "#64748b", fontSize: "12px" },
  examRight: { display: "flex", alignItems: "center", gap: "10px", minWidth: "120px" },
  readBar: { height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", flex: 1 },
  readFill: { height: "6px", background: "#6366f1", borderRadius: "3px" },
  readPct: { color: "#6366f1", fontSize: "12px", fontWeight: 700 },
};