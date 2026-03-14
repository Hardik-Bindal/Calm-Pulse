import React from "react";
import { useTheme } from "../context/ThemeContext";
import StressGauge from "../components/StressGauge";
import LineAreaChart from "../components/LineAreaChart";
import DonutChart from "../components/DonutChart";
import RadarChart from "../components/RadarChart";
import { employeeData } from "../data/sampleData";

export default function WorkDashboard() {
  const { theme, isDark } = useTheme();
  const d = employeeData;

  const cs = {
    background: theme.cardBg,
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: "18px",
    padding: "20px",
    backdropFilter: isDark ? "none" : theme.glassBlur,
    WebkitBackdropFilter: isDark ? "none" : theme.glassBlur,
    boxShadow: theme.cardShadow,
    transition: "all 0.3s ease",
  };
  const ct = { color: theme.textSecondary, fontSize: "11px", fontWeight: 700, marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.06em" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 800, margin: 0 }}>Good morning, {d.name} 👋</h2>
          <p style={{ color: theme.textMuted, fontSize: "14px", margin: "4px 0 0" }}>Here's your work wellness overview · {new Date().toDateString()}</p>
        </div>
        <div style={{
          background: isDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.08)",
          border: `1px solid ${isDark ? "rgba(239,68,68,0.3)" : "rgba(239,68,68,0.2)"}`,
          color: theme.danger,
          padding: "10px 16px",
          borderRadius: "14px",
          fontSize: "13px",
          fontWeight: 600,
          backdropFilter: isDark ? "none" : "blur(8px)",
        }}>⚠️ No focus time today — 6 meetings scheduled</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px" }}>
        <KpiCard label="Stress Score" value={d.stressScore} unit="" color={theme.accent} icon="🧠" sub="Elevated" theme={theme} isDark={isDark} />
        <KpiCard label="Focus Time" value={`${d.focusTime}h`} unit="" color={theme.cyan} icon="🎯" sub="Goal: 4h" theme={theme} isDark={isDark} />
        <KpiCard label="Meetings Today" value={d.meetingsToday} unit="" color={theme.orange} icon="📅" sub="Overloaded" theme={theme} isDark={isDark} />
        <KpiCard label="Overtime" value={`${d.overtimeThisWeek}h`} unit="" color={theme.danger} icon="⏰" sub="This week" theme={theme} isDark={isDark} />
        <KpiCard label="Wellness Score" value="62" unit="%" color={theme.purple} icon="💚" sub="Needs attention" theme={theme} isDark={isDark} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px" }}>
        <div style={cs}>
          <div style={ct}>Live Stress Score</div>
          <div style={{ display: "flex", justifyContent: "center", paddingTop: "8px" }}>
            <StressGauge score={d.stressScore} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center", color: theme.success, fontSize: "11px", marginTop: "4px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: theme.success, boxShadow: `0 0 6px ${theme.success}`, animation: "pulse 2s infinite" }} />
            Realtime detection active
          </div>
        </div>
        <div style={cs}>
          <div style={ct}>Today's Stress Curve — Hourly</div>
          <LineAreaChart data={d.hourlyStress} dataKey="stress" color={theme.danger} height={130} />
          <div style={{ color: theme.textDim, fontSize: "11px", marginTop: "6px" }}>Stress spikes at 3PM — right after consecutive heavy meetings.</div>
        </div>
      </div>

      <div style={cs}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div style={ct}>Weekly Patterns</div>
          <div style={{ display: "flex", gap: "12px" }}>
            <LegendDot color={theme.accent} label="Stress" theme={theme} />
            <LegendDot color={theme.cyan} label="Focus hrs" theme={theme} />
            <LegendDot color={theme.orange} label="Meetings" theme={theme} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "0", alignItems: "stretch" }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: theme.textMuted, fontSize: "10px", fontWeight: 600, textTransform: "uppercase", marginBottom: "4px" }}>Stress Level</div>
            <LineAreaChart data={d.weeklyStress} dataKey="stress" color={theme.accent} height={100} />
          </div>
          <div style={{ width: "1px", background: theme.cardBorder, margin: "0 16px" }} />
          <div style={{ flex: 1 }}>
            <div style={{ color: theme.textMuted, fontSize: "10px", fontWeight: 600, textTransform: "uppercase", marginBottom: "4px" }}>Focus Hours</div>
            <LineAreaChart data={d.weeklyStress} dataKey="focusHours" color={theme.cyan} height={100} />
          </div>
          <div style={{ width: "1px", background: theme.cardBorder, margin: "0 16px" }} />
          <div style={{ flex: 1 }}>
            <div style={{ color: theme.textMuted, fontSize: "10px", fontWeight: 600, textTransform: "uppercase", marginBottom: "4px" }}>Meetings</div>
            <LineAreaChart data={d.weeklyStress} dataKey="meetings" color={theme.orange} height={100} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={cs}>
          <div style={ct}>Time Breakdown Today</div>
          <div style={{ paddingTop: "8px" }}>
            <DonutChart segments={d.taskBreakdown} size={130} thickness={20} centerLabel="8h" centerSub="Total" />
          </div>
        </div>
        <div style={cs}>
          <div style={ct}>Wellness Radar</div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <RadarChart data={d.wellnessRadar} color={theme.cyan} size={190} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={cs}>
          <div style={ct}>Work-Life Alerts</div>
          {d.workLifeAlerts.map((a, i) => (
            <AlertRow key={i} type={a.type} message={a.message} theme={theme} isDark={isDark} />
          ))}
          <div style={{ marginTop: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: theme.textSecondary, fontSize: "11px" }}>Overtime this week</span>
              <span style={{ color: theme.danger, fontSize: "11px", fontWeight: 700 }}>{d.overtimeThisWeek}h / 5h limit</span>
            </div>
            <div style={{ height: "6px", background: theme.barBg, borderRadius: "3px" }}>
              <div style={{ height: "6px", background: `linear-gradient(90deg, ${theme.orange}, ${theme.danger})`, borderRadius: "3px", width: `${Math.min((d.overtimeThisWeek / 15) * 100, 100)}%` }} />
            </div>
          </div>
        </div>
        <div style={cs}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div style={ct}>Today's Schedule</div>
            <span style={{
              background: isDark ? "rgba(249,115,22,0.15)" : "rgba(249,115,22,0.1)",
              color: theme.orange,
              fontSize: "11px",
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: "20px",
            }}>{d.meetingsToday} meetings</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {d.todayMeetings.map((m, i) => {
              const c = m.type === "heavy" ? theme.danger : m.type === "daily" ? theme.success : theme.accent;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", animation: `fadeIn 0.3s ease ${i * 0.05}s both` }}>
                  <span style={{ color: c, fontSize: "11px", fontWeight: 700, minWidth: "72px" }}>{m.time}</span>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: c, boxShadow: `0 0 5px ${c}`, flexShrink: 0 }} />
                  <span style={{ color: theme.textSecondary, fontSize: "13px", flex: 1 }}>{m.title}</span>
                  <span style={{ color: theme.textDim, fontSize: "11px" }}>{m.duration}</span>
                  {m.type === "heavy" && <span style={{
                    background: isDark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.1)",
                    color: theme.danger,
                    fontSize: "10px",
                    padding: "2px 8px",
                    borderRadius: "20px",
                    fontWeight: 600,
                  }}>Heavy</span>}
                </div>
              );
            })}
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

function AlertRow({ type, message, theme, isDark }) {
  const colors = {
    warning: { bg: isDark ? "rgba(234,179,8,0.08)" : "rgba(234,179,8,0.06)", border: isDark ? "rgba(234,179,8,0.25)" : "rgba(234,179,8,0.2)", text: theme.warning, icon: "⚠️" },
    danger: { bg: isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.06)", border: isDark ? "rgba(239,68,68,0.25)" : "rgba(239,68,68,0.2)", text: theme.danger, icon: "🚨" },
    info: { bg: isDark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.06)", border: isDark ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.15)", text: theme.accentLight, icon: "ℹ️" },
  };
  const c = colors[type];
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "9px 12px", marginBottom: "8px", display: "flex", gap: "8px", backdropFilter: isDark ? "none" : "blur(4px)" }}>
      <span style={{ fontSize: "13px" }}>{c.icon}</span>
      <span style={{ color: c.text, fontSize: "12px" }}>{message}</span>
    </div>
  );
}