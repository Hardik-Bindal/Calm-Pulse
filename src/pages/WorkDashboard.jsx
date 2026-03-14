import React from "react";
import StressGauge from "../components/StressGauge";
import LineAreaChart from "../components/LineAreaChart";
import DonutChart from "../components/DonutChart";
import RadarChart from "../components/RadarChart";
import { employeeData } from "../data/sampleData";

export default function WorkDashboard() {
  const d = employeeData;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Good morning, {d.name} 👋</h2>
          <p style={styles.sub}>Here's your work wellness overview · {new Date().toDateString()}</p>
        </div>
        <div style={styles.breakNudge}>⚠️ No focus time today — 6 meetings scheduled</div>
      </div>

      {/* KPI row */}
      <div style={styles.kpiRow}>
        <KpiCard label="Stress Score"   value={d.stressScore}       unit=""   color="#6366f1" icon="🧠" sub="Elevated" />
        <KpiCard label="Focus Time"     value={`${d.focusTime}h`}   unit=""   color="#22d3ee" icon="🎯" sub="Goal: 4h" />
        <KpiCard label="Meetings Today" value={d.meetingsToday}      unit=""   color="#f97316" icon="📅" sub="Overloaded" />
        <KpiCard label="Overtime"       value={`${d.overtimeThisWeek}h`} unit="" color="#ef4444" icon="⏰" sub="This week" />
        <KpiCard label="Wellness Score" value="62"                  unit="%"  color="#a78bfa" icon="💚" sub="Needs attention" />
      </div>

      {/* Row 1: Gauge + Hourly stress */}
      <div style={styles.grid2_1}>
        <Card>
          <div style={styles.cardTitle}>Live Stress Score</div>
          <div style={{ display: "flex", justifyContent: "center", paddingTop: "8px" }}>
            <StressGauge score={d.stressScore} />
          </div>
          <div style={styles.gaugeNote}>
            <span style={styles.gaugeDot} />
            Realtime detection active
          </div>
        </Card>
        <Card span2>
          <div style={styles.cardTitle}>Today's Stress Curve — Hourly</div>
          <LineAreaChart data={d.hourlyStress} dataKey="stress" color="#ef4444" height={130} />
          <div style={styles.chartNote}>Stress spikes at 3PM — right after consecutive heavy meetings.</div>
        </Card>
      </div>

      {/* Row 2: Weekly stress + focus hours dual line */}
      <Card>
        <div style={styles.cardTitleRow}>
          <div style={styles.cardTitle}>Weekly Patterns</div>
          <div style={styles.legendRow}>
            <LegendDot color="#6366f1" label="Stress" />
            <LegendDot color="#22d3ee" label="Focus hrs" />
            <LegendDot color="#f97316" label="Meetings" />
          </div>
        </div>
        <div style={styles.triCharts}>
          <div style={{ flex: 1 }}>
            <div style={styles.miniLabel}>Stress Level</div>
            <LineAreaChart data={d.weeklyStress} dataKey="stress" color="#6366f1" height={100} />
          </div>
          <div style={styles.chartDivider} />
          <div style={{ flex: 1 }}>
            <div style={styles.miniLabel}>Focus Hours</div>
            <LineAreaChart data={d.weeklyStress} dataKey="focusHours" color="#22d3ee" height={100} />
          </div>
          <div style={styles.chartDivider} />
          <div style={{ flex: 1 }}>
            <div style={styles.miniLabel}>Meetings</div>
            <LineAreaChart data={d.weeklyStress} dataKey="meetings" color="#f97316" height={100} />
          </div>
        </div>
      </Card>

      {/* Row 3: Donut + Radar */}
      <div style={styles.grid2}>
        <Card>
          <div style={styles.cardTitle}>Time Breakdown Today</div>
          <div style={{ paddingTop: "8px" }}>
            <DonutChart
              segments={d.taskBreakdown}
              size={130}
              thickness={20}
              centerLabel="8h"
              centerSub="Total"
            />
          </div>
        </Card>
        <Card>
          <div style={styles.cardTitle}>Wellness Radar</div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <RadarChart data={d.wellnessRadar} color="#22d3ee" size={190} />
          </div>
        </Card>
      </div>

      {/* Row 4: Alerts + Today's schedule */}
      <div style={styles.grid2}>
        <Card>
          <div style={styles.cardTitle}>Work-Life Alerts</div>
          {d.workLifeAlerts.map((a, i) => (
            <AlertRow key={i} type={a.type} message={a.message} />
          ))}
          <div style={styles.overtimeBar}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "#94a3b8", fontSize: "11px" }}>Overtime this week</span>
              <span style={{ color: "#ef4444", fontSize: "11px", fontWeight: 700 }}>{d.overtimeThisWeek}h / 5h limit</span>
            </div>
            <div style={styles.otBarBg}>
              <div style={{ ...styles.otBarFill, width: `${Math.min((d.overtimeThisWeek / 15) * 100, 100)}%` }} />
            </div>
          </div>
        </Card>
        <Card>
          <div style={styles.cardTitleRow}>
            <div style={styles.cardTitle}>Today's Schedule</div>
            <span style={styles.meetBadge}>{d.meetingsToday} meetings</span>
          </div>
          <div style={styles.meetList}>
            {d.todayMeetings.map((m, i) => {
              const c = m.type === "heavy" ? "#ef4444" : m.type === "daily" ? "#22c55e" : "#6366f1";
              return (
                <div key={i} style={styles.meetRow}>
                  <span style={{ ...styles.meetTime, color: c }}>{m.time}</span>
                  <span style={{ ...styles.meetDot, background: c, boxShadow: `0 0 5px ${c}` }} />
                  <span style={styles.meetTitle}>{m.title}</span>
                  <span style={styles.meetDur}>{m.duration}</span>
                  {m.type === "heavy" && <span style={styles.heavyBadge}>Heavy</span>}
                </div>
              );
            })}
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

function AlertRow({ type, message }) {
  const colors = {
    warning: { bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.25)", text: "#fbbf24", icon: "⚠️" },
    danger:  { bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.25)",  text: "#f87171", icon: "🚨" },
    info:    { bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.25)", text: "#818cf8", icon: "ℹ️" },
  };
  const c = colors[type];
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: "8px", padding: "9px 12px", marginBottom: "8px", display: "flex", gap: "8px" }}>
      <span style={{ fontSize: "13px" }}>{c.icon}</span>
      <span style={{ color: c.text, fontSize: "12px" }}>{message}</span>
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
    background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
    color: "#f87171", padding: "10px 16px", borderRadius: "12px", fontSize: "13px",
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
  overtimeBar: { marginTop: "8px" },
  otBarBg: { height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px" },
  otBarFill: { height: "6px", background: "linear-gradient(90deg, #f97316, #ef4444)", borderRadius: "3px" },
  meetBadge: {
    background: "rgba(249,115,22,0.15)", color: "#fb923c",
    fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px",
  },
  meetList: { display: "flex", flexDirection: "column", gap: "8px" },
  meetRow: { display: "flex", alignItems: "center", gap: "10px" },
  meetTime: { fontSize: "11px", fontWeight: 700, minWidth: "72px" },
  meetDot: { width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0 },
  meetTitle: { color: "#cbd5e1", fontSize: "13px", flex: 1 },
  meetDur: { color: "#475569", fontSize: "11px" },
  heavyBadge: {
    background: "rgba(239,68,68,0.15)", color: "#f87171",
    fontSize: "10px", padding: "2px 8px", borderRadius: "20px", fontWeight: 600,
  },
};