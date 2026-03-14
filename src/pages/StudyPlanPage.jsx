import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { studentData } from "../data/sampleData";

export default function StudyPlanPage() {
  const { theme, isDark } = useTheme();
  const [tasks, setTasks] = useState(studentData.studyPlan);
  const toggle = (i) => setTasks((t) => t.map((x, j) => j === i ? { ...x, done: !x.done } : x));
  const done = tasks.filter((t) => t.done).length;

  const cs = {
    background: theme.cardBg,
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: "18px",
    padding: "24px",
    backdropFilter: isDark ? "none" : theme.glassBlur,
    WebkitBackdropFilter: isDark ? "none" : theme.glassBlur,
    boxShadow: theme.cardShadow,
    transition: "all 0.3s ease",
  };
  const ct = { color: theme.textSecondary, fontSize: "12px", fontWeight: 600, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 800, margin: 0 }}>AI Study Planner 📅</h2>
        <p style={{ color: theme.textMuted, fontSize: "14px", margin: "4px 0 0" }}>Auto-generated based on your timetable and exam dates</p>
      </div>

      <div style={cs}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <span style={{ color: theme.textSecondary, fontSize: "13px" }}>Today's Progress</span>
          <span style={{ color: theme.accent, fontSize: "13px", fontWeight: 700 }}>{done}/{tasks.length} tasks</span>
        </div>
        <div style={{ height: "8px", background: theme.barBg, borderRadius: "4px" }}>
          <div style={{ height: "8px", background: theme.accentGradient, borderRadius: "4px", width: `${(done / tasks.length) * 100}%`, transition: "width 0.3s" }} />
        </div>
      </div>

      <div style={cs}>
        <div style={ct}>Today's Plan — {new Date().toDateString()}</div>
        {tasks.map((task, i) => (
          <div
            key={i}
            onClick={() => toggle(i)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "12px 0",
              borderBottom: `1px solid ${theme.cardBorder}`,
              cursor: "pointer",
              opacity: task.done ? 0.5 : 1,
              transition: "all 0.2s",
              animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
            }}
          >
            <div style={{
              width: "22px",
              height: "22px",
              borderRadius: "8px",
              border: `2px solid ${task.done ? theme.accent : theme.cardBorder}`,
              background: task.done ? theme.accent : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 700,
              flexShrink: 0,
              transition: "all 0.2s",
            }}>
              {task.done && "✓"}
            </div>
            <div>
              <div style={{ color: theme.accent, fontSize: "11px", marginBottom: "2px" }}>{task.time}</div>
              <div style={{ color: theme.textPrimary, fontSize: "13px", textDecoration: task.done ? "line-through" : "none" }}>
                {task.task}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={cs}>
        <div style={ct}>Upcoming Exams — Readiness</div>
        {studentData.upcomingExams.map((e, i) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 0",
            borderBottom: `1px solid ${theme.cardBorder}`,
            gap: "12px",
            animation: `fadeIn 0.3s ease ${i * 0.1}s both`,
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ color: theme.textPrimary, fontSize: "14px", fontWeight: 600 }}>{e.subject}</span>
              <span style={{ color: theme.textMuted, fontSize: "12px" }}>{e.date} · {e.daysLeft} days left</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "120px" }}>
              <div style={{ height: "6px", background: theme.barBg, borderRadius: "3px", flex: 1 }}>
                <div style={{ height: "6px", background: theme.accent, borderRadius: "3px", width: `${e.readiness}%`, transition: "width 0.5s" }} />
              </div>
              <span style={{ color: theme.accent, fontSize: "12px", fontWeight: 700 }}>{e.readiness}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}