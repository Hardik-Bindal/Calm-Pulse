import React from "react";
import { useTheme } from "../context/ThemeContext";
import StressGauge from "../components/StressGauge";
import LineAreaChart from "../components/LineAreaChart";
import RadarChart from "../components/RadarChart";
import HorizontalBarChart from "../components/HorizontalBarChart";
import { studentData } from "../data/sampleData";

export default function StudentDashboard() {
  const { theme, isDark } = useTheme();
  const d = studentData;
  const tasksDone = d.studyPlan.filter((t) => t.done).length;

  const cardStyle = {
    background: theme.cardBg,
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: "18px",
    padding: "20px",
    backdropFilter: isDark ? "none" : theme.glassBlur,
    WebkitBackdropFilter: isDark ? "none" : theme.glassBlur,
    boxShadow: theme.cardShadow,
    transition: "all 0.3s ease",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 800, margin: 0 }}>Good morning, {d.name} 👋</h2>
          <p style={{ color: theme.textMuted, fontSize: "14px", margin: "4px 0 0" }}>Here's your wellness overview for today · {new Date().toDateString()}</p>
        </div>
        <div style={{
          background: isDark ? "rgba(249,115,22,0.12)" : "rgba(249,115,22,0.1)",
          border: `1px solid ${isDark ? "rgba(249,115,22,0.3)" : "rgba(249,115,22,0.25)"}`,
          color: theme.orange,
          padding: "10px 16px",
          borderRadius: "14px",
          fontSize: "13px",
          backdropFilter: isDark ? "none" : "blur(8px)",
          fontWeight: 600,
        }}>🧘 Stress spike detected — take a 2-min break</div>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px" }}>
        <KpiCard label="Stress Score" value={d.stressScore} unit="" color={theme.accent} icon="🧠" sub="High — watch out" theme={theme} isDark={isDark} />
        <KpiCard label="Burnout Index" value={d.burnoutIndex} unit="%" color={theme.orange} icon="🔥" sub="Moderate risk" theme={theme} isDark={isDark} />
        <KpiCard label="Check-in Streak" value={d.streak} unit=" days" color={theme.success} icon="🔥" sub="Keep it up!" theme={theme} isDark={isDark} />
        <KpiCard label="Focus Time" value={d.focusHours} unit="h" color={theme.cyan} icon="⏱️" sub="Today" theme={theme} isDark={isDark} />
        <KpiCard label="Tasks Done" value={`${tasksDone}/${d.tasksTotal}`} unit="" color={theme.purple} icon="✅" sub="Today's plan" theme={theme} isDark={isDark} />
      </div>

      {/* Row 1: Stress gauge + Hourly stress line */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px" }}>
        <div style={cardStyle}>
          <div style={{ color: theme.textSecondary, fontSize: "11px", fontWeight: 700, marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Live Stress Score</div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "8px" }}>
            <StressGauge score={d.stressScore} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center", color: theme.success, fontSize: "11px", marginTop: "4px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: theme.success, boxShadow: `0 0 6px ${theme.success}`, animation: "pulse 2s infinite" }} />
            Camera + Mic analysis active
          </div>
        </div>
        <div style={{ ...cardStyle, gridColumn: "span 1" }}>
          <div style={{ color: theme.textSecondary, fontSize: "11px", fontWeight: 700, marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Today's Stress Curve — Hourly</div>
          <LineAreaChart data={d.hourlyStress} dataKey="stress" color={theme.orange} height={130} />
          <div style={{ color: theme.textDim, fontSize: "11px", marginTop: "6px" }}>Peak stress at 12PM. Consider a break before 2PM sessions.</div>
        </div>
      </div>

      {/* Row 2: Weekly stress + mood dual line */}
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div style={{ color: theme.textSecondary, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Weekly Overview — Stress vs Mood</div>
          <div style={{ display: "flex", gap: "12px" }}>
            <LegendDot color={theme.accent} label="Stress" theme={theme} />
            <LegendDot color={theme.cyan} label="Mood" theme={theme} />
            <LegendDot color={theme.success} label="Sleep (hrs)" theme={theme} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "0", alignItems: "stretch" }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: theme.textMuted, fontSize: "10px", fontWeight: 600, textTransform: "uppercase", marginBottom: "4px" }}>Stress</div>
            <LineAreaChart data={d.weeklyMood} dataKey="stress" color={theme.accent} height={100} />
          </div>
          <div style={{ width: "1px", background: theme.cardBorder, margin: "0 16px" }} />
          <div style={{ flex: 1 }}>
            <div style={{ color: theme.textMuted, fontSize: "10px", fontWeight: 600, textTransform: "uppercase", marginBottom: "4px" }}>Mood (1–10)</div>
            <LineAreaChart data={d.weeklyMood} dataKey="mood" color={theme.cyan} height={100} />
          </div>
          <div style={{ width: "1px", background: theme.cardBorder, margin: "0 16px" }} />
          <div style={{ flex: 1 }}>
            <div style={{ color: theme.textMuted, fontSize: "10px", fontWeight: 600, textTransform: "uppercase", marginBottom: "4px" }}>Sleep (hours)</div>
            <LineAreaChart data={d.weeklyMood} dataKey="sleep" color={theme.success} height={100} />
          </div>
        </div>
      </div>

      {/* Row 3: Subject readiness + Wellness radar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={cardStyle}>
          <div style={{ color: theme.textSecondary, fontSize: "11px", fontWeight: 700, marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Subject Readiness</div>
          <HorizontalBarChart data={d.subjectReadiness} />
        </div>
        <div style={cardStyle}>
          <div style={{ color: theme.textSecondary, fontSize: "11px", fontWeight: 700, marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Wellness Radar</div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <RadarChart data={d.wellnessRadar} color="#8b5cf6" size={190} />
          </div>
        </div>
      </div>

      {/* Row 4: Exam timeline + study plan */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={cardStyle}>
          <div style={{ color: theme.textSecondary, fontSize: "11px", fontWeight: 700, marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Upcoming Exams</div>
          {d.upcomingExams.map((e, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", gap: "12px", animation: `fadeIn 0.3s ease ${i * 0.1}s both` }}>
              <div>
                <div style={{ color: theme.textPrimary, fontSize: "13px", fontWeight: 600 }}>{e.subject}</div>
                <div style={{ color: theme.textMuted, fontSize: "11px" }}>{e.date} · {e.daysLeft} days left</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "100px" }}>
                <div style={{ height: "6px", background: theme.barBg, borderRadius: "3px", flex: 1 }}>
                  <div style={{
                    height: "6px",
                    width: `${e.readiness}%`,
                    background: e.readiness >= 60 ? theme.success : e.readiness >= 45 ? theme.warning : theme.danger,
                    borderRadius: "3px",
                    transition: "width 0.5s ease",
                  }} />
                </div>
                <span style={{ color: theme.textSecondary, fontSize: "11px", fontWeight: 700, minWidth: "28px", textAlign: "right" }}>{e.readiness}%</span>
              </div>
            </div>
          ))}
        </div>
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div style={{ color: theme.textSecondary, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Today's Study Plan</div>
            <div style={{
              background: isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.12)",
              color: theme.accentLighter,
              fontSize: "11px",
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: "20px",
            }}>{tasksDone}/{d.tasksTotal} done</div>
          </div>
          <div style={{ height: "4px", background: theme.barBg, borderRadius: "2px", marginBottom: "14px" }}>
            <div style={{ height: "4px", background: theme.accentGradient, borderRadius: "2px", width: `${(tasksDone / d.tasksTotal) * 100}%`, transition: "width 0.5s" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {d.studyPlan.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", opacity: item.done ? 0.45 : 1, animation: `fadeIn 0.3s ease ${i * 0.05}s both` }}>
                <span style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "10px",
                  fontWeight: 700,
                  flexShrink: 0,
                  background: item.done ? theme.success : theme.accent,
                }}>
                  {item.done ? "✓" : ""}
                </span>
                <span style={{ color: theme.accent, fontSize: "12px", minWidth: "72px" }}>{item.time}</span>
                <span style={{ color: theme.textSecondary, fontSize: "13px", textDecoration: item.done ? "line-through" : "none" }}>{item.task}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, unit, color, icon, sub, theme, isDark }) {
  return (
    <div style={{
      background: theme.cardBg,
      border: `1px solid ${theme.cardBorder}`,
      borderRadius: "16px",
      padding: "18px",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      backdropFilter: isDark ? "none" : theme.glassBlur,
      WebkitBackdropFilter: isDark ? "none" : theme.glassBlur,
      boxShadow: theme.cardShadow,
      transition: "all 0.3s ease",
      animation: "fadeIn 0.4s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
        <span style={{ color: theme.textMuted, fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
        <span style={{ fontSize: "16px" }}>{icon}</span>
      </div>
      <div style={{ color, fontSize: "28px", fontWeight: 900, lineHeight: 1 }}>{value}<span style={{ fontSize: "14px" }}>{unit}</span></div>
      <div style={{ color: theme.textDim, fontSize: "11px" }}>{sub}</div>
    </div>
  );
}

function LegendDot({ color, label, theme }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color }} />
      <span style={{ color: theme.textMuted, fontSize: "11px" }}>{label}</span>
    </div>
  );
}