import React from "react";
import StressGauge from "../components/StressGauge";
import LineAreaChart from "../components/LineAreaChart";
import RadarChart from "../components/RadarChart";
import HorizontalBarChart from "../components/HorizontalBarChart";
import { studentData } from "../data/sampleData";

export default function StudentDashboard() {
  const d = studentData;
  const tasksDone = d.studyPlan.filter((t) => t.done).length;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Good morning, {d.name} 👋</h2>
          <p style={styles.sub}>Here's your wellness overview for today · {new Date().toDateString()}</p>
        </div>
        <div style={styles.breakNudge}>🧘 Stress spike detected — take a 2-min break</div>
      </div>

      {/* KPI row */}
      <div style={styles.kpiRow}>
        <KpiCard label="Stress Score" value={d.stressScore} unit="" color="#6366f1" icon="🧠" sub="High — watch out" />
        <KpiCard label="Burnout Index" value={d.burnoutIndex} unit="%" color="#f97316" icon="🔥" sub="Moderate risk" />
        <KpiCard label="Check-in Streak" value={d.streak} unit=" days" color="#22c55e" icon="🔥" sub="Keep it up!" />
        <KpiCard label="Focus Time" value={d.focusHours} unit="h" color="#22d3ee" icon="⏱️" sub="Today" />
        <KpiCard label="Tasks Done" value={`${tasksDone}/${d.tasksTotal}`} unit="" color="#a78bfa" icon="✅" sub="Today's plan" />
      </div>

      {/* Row 1: Stress gauge + Hourly stress line */}
      <div style={styles.grid2_1}>
        <Card>
          <div style={styles.cardTitle}>Live Stress Score</div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "8px" }}>
            <StressGauge score={d.stressScore} />
          </div>
          <div style={styles.gaugeNote}>
            <span style={styles.gaugeDot} />
            Camera + Mic analysis active
          </div>
        </Card>
        <Card span2>
          <div style={styles.cardTitle}>Today's Stress Curve — Hourly</div>
          <LineAreaChart data={d.hourlyStress} dataKey="stress" color="#f97316" height={130} />
          <div style={styles.chartNote}>Peak stress at 12PM. Consider a break before 2PM sessions.</div>
        </Card>
      </div>

      {/* Row 2: Weekly stress + mood dual line */}
      <Card>
        <div style={styles.cardTitleRow}>
          <div style={styles.cardTitle}>Weekly Overview — Stress vs Mood</div>
          <div style={styles.legendRow}>
            <LegendDot color="#6366f1" label="Stress" />
            <LegendDot color="#22d3ee" label="Mood" />
            <LegendDot color="#22c55e" label="Sleep (hrs)" />
          </div>
        </div>
        <div style={styles.triCharts}>
          <div style={{ flex: 1 }}>
            <div style={styles.miniLabel}>Stress</div>
            <LineAreaChart data={d.weeklyMood} dataKey="stress" color="#6366f1" height={100} />
          </div>
          <div style={styles.chartDivider} />
          <div style={{ flex: 1 }}>
            <div style={styles.miniLabel}>Mood (1–10)</div>
            <LineAreaChart data={d.weeklyMood} dataKey="mood" color="#22d3ee" height={100} />
          </div>
          <div style={styles.chartDivider} />
          <div style={{ flex: 1 }}>
            <div style={styles.miniLabel}>Sleep (hours)</div>
            <LineAreaChart data={d.weeklyMood} dataKey="sleep" color="#22c55e" height={100} />
          </div>
        </div>
      </Card>

      {/* Row 3: Subject readiness + Wellness radar */}
      <div style={styles.grid2}>
        <Card>
          <div style={styles.cardTitle}>Subject Readiness</div>
          <HorizontalBarChart data={d.subjectReadiness} />
        </Card>
        <Card>
          <div style={styles.cardTitle}>Wellness Radar</div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <RadarChart data={d.wellnessRadar} color="#8b5cf6" size={190} />
          </div>
        </Card>
      </div>

      {/* Row 4: Exam timeline + study plan */}
      <div style={styles.grid2}>
        <Card>
          <div style={styles.cardTitle}>Upcoming Exams</div>
          {d.upcomingExams.map((e, i) => (
            <div key={i} style={styles.examRow}>
              <div style={styles.examLeft}>
                <div style={styles.examName}>{e.subject}</div>
                <div style={styles.examDate}>{e.date} · {e.daysLeft} days left</div>
              </div>
              <div style={styles.examRight}>
                <div style={styles.readinessBar}>
                  <div style={{
                    ...styles.readinessFill,
                    width: `${e.readiness}%`,
                    background: e.readiness >= 60 ? "#22c55e" : e.readiness >= 45 ? "#eab308" : "#ef4444",
                  }} />
                </div>
                <span style={styles.readinessPct}>{e.readiness}%</span>
              </div>
            </div>
          ))}
        </Card>
        <Card>
          <div style={styles.cardTitleRow}>
            <div style={styles.cardTitle}>Today's Study Plan</div>
            <div style={styles.progressPill}>{tasksDone}/{d.tasksTotal} done</div>
          </div>
          <div style={styles.planProgressBar}>
            <div style={{ ...styles.planProgressFill, width: `${(tasksDone / d.tasksTotal) * 100}%` }} />
          </div>
          <div style={styles.planList}>
            {d.studyPlan.map((item, i) => (
              <div key={i} style={{ ...styles.planRow, opacity: item.done ? 0.45 : 1 }}>
                <span style={{ ...styles.planDot, background: item.done ? "#22c55e" : "#6366f1" }}>
                  {item.done ? "✓" : i - tasksDone + 1 <= 0 ? "✓" : ""}
                </span>
                <span style={styles.planTime}>{item.time}</span>
                <span style={{ ...styles.planTask, textDecoration: item.done ? "line-through" : "none" }}>{item.task}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Card({ children, span2 }) {
  return <div style={{ ...cardStyle, ...(span2 ? { gridColumn: "span 2" } : {}) }}>{children}</div>;
}

function KpiCard({ label, value, unit, color, icon, sub }) {
  return (
    <div style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "4px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
        <span style={{ color: "#64748b", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
        <span style={{ fontSize: "16px" }}>{icon}</span>
      </div>
      <div style={{ color, fontSize: "28px", fontWeight: 900, lineHeight: 1 }}>{value}<span style={{ fontSize: "14px" }}>{unit}</span></div>
      <div style={{ color: "#475569", fontSize: "11px" }}>{sub}</div>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color }} />
      <span style={{ color: "#64748b", fontSize: "11px" }}>{label}</span>
    </div>
  );
}

const cardStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "16px",
  padding: "20px",
};

const styles = {
  page: { display: "flex", flexDirection: "column", gap: "20px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" },
  title: { color: "#fff", fontSize: "22px", fontWeight: 800, margin: 0 },
  sub: { color: "#64748b", fontSize: "14px", margin: "4px 0 0" },
  breakNudge: {
    background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)",
    color: "#fb923c", padding: "10px 16px", borderRadius: "12px", fontSize: "13px",
  },
  kpiRow: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px" },
  grid2_1: { display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  cardTitle: { color: "#94a3b8", fontSize: "11px", fontWeight: 700, marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.06em" },
  cardTitleRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" },
  legendRow: { display: "flex", gap: "12px" },
  miniLabel: { color: "#64748b", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", marginBottom: "4px" },
  triCharts: { display: "flex", gap: "0", alignItems: "stretch" },
  chartDivider: { width: "1px", background: "rgba(255,255,255,0.06)", margin: "0 16px" },
  chartNote: { color: "#475569", fontSize: "11px", marginTop: "6px" },
  gaugeNote: { display: "flex", alignItems: "center", gap: "6px", justifyContent: "center", color: "#22c55e", fontSize: "11px", marginTop: "4px" },
  gaugeDot: { width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" },
  examRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", gap: "12px" },
  examLeft: {},
  examName: { color: "#e2e8f0", fontSize: "13px", fontWeight: 600 },
  examDate: { color: "#64748b", fontSize: "11px" },
  examRight: { display: "flex", alignItems: "center", gap: "8px", minWidth: "100px" },
  readinessBar: { height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", flex: 1 },
  readinessFill: { height: "6px", borderRadius: "3px", transition: "width 0.5s ease" },
  readinessPct: { color: "#94a3b8", fontSize: "11px", fontWeight: 700, minWidth: "28px", textAlign: "right" },
  progressPill: {
    background: "rgba(99,102,241,0.15)", color: "#a5b4fc",
    fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px",
  },
  planProgressBar: { height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", marginBottom: "14px" },
  planProgressFill: { height: "4px", background: "linear-gradient(90deg, #6366f1, #8b5cf6)", borderRadius: "2px" },
  planList: { display: "flex", flexDirection: "column", gap: "10px" },
  planRow: { display: "flex", alignItems: "center", gap: "12px" },
  planDot: {
    width: "20px", height: "20px", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: "10px", fontWeight: 700, flexShrink: 0,
  },
  planTime: { color: "#6366f1", fontSize: "12px", minWidth: "72px" },
  planTask: { color: "#cbd5e1", fontSize: "13px" },
};