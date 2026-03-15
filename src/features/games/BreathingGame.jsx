import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../themes/ThemeContext";

const PHASES = [
  { name: "Breathe In", duration: 4000, emoji: "🌬️", instruction: "Inhale slowly through your nose" },
  { name: "Hold", duration: 4000, emoji: "⏸️", instruction: "Hold your breath gently" },
  { name: "Breathe Out", duration: 4000, emoji: "💨", instruction: "Exhale slowly through your mouth" },
];

export default function BreathingGame({ onBack }) {
  const { theme, isDark } = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [countdown, setCountdown] = useState(4);
  const [totalTime, setTotalTime] = useState(0);
  const intervalRef = useRef(null);
  const phaseTimerRef = useRef(null);

  const phase = PHASES[phaseIndex];

  useEffect(() => {
    if (!isActive) return;
    setCountdown(phase.duration / 1000);
    intervalRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) return phase.duration / 1000;
        return c - 1;
      });
      setTotalTime((t) => t + 1);
    }, 1000);
    phaseTimerRef.current = setTimeout(() => {
      const nextIndex = (phaseIndex + 1) % PHASES.length;
      if (nextIndex === 0) setCycles((c) => c + 1);
      setPhaseIndex(nextIndex);
    }, phase.duration);
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(phaseTimerRef.current);
    };
  }, [isActive, phaseIndex, phase.duration]);

  const calcScore = () => {
    let score = cycles * 100;
    if (cycles >= 5) score += 200;
    if (cycles >= 10) score += 500;
    return score;
  };

  const start = () => { setIsActive(true); setPhaseIndex(0); setCycles(0); setTotalTime(0); };
  const stop = () => { setIsActive(false); clearInterval(intervalRef.current); clearTimeout(phaseTimerRef.current); };
  const reset = () => { stop(); setPhaseIndex(0); setCycles(0); setCountdown(4); setTotalTime(0); };

  const circleScale = phaseIndex === 0 ? 1 : phaseIndex === 2 ? 0.6 : 1;
  const circleAnimation = isActive
    ? phaseIndex === 0
      ? "breatheIn 4s ease-in-out forwards"
      : phaseIndex === 2
      ? "breatheOut 4s ease-in-out forwards"
      : "breatheHold 4s ease forwards"
    : "none";

  const phaseColor = phaseIndex === 0 ? theme.accent : phaseIndex === 1 ? theme.warning : theme.success;
  const btnGradient = `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`;

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <button onClick={onBack} style={{ background: "none", border: "none", color: theme.accent, fontSize: "14px", cursor: "pointer", padding: 0, marginBottom: "8px", fontWeight: 600 }}>
            ← Back to Games
          </button>
          <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 800, margin: 0 }}>🫧 Breathing Exercise</h2>
          <p style={{ color: theme.textMuted, fontSize: "13px", margin: "4px 0 0" }}>Follow the circle to calm your mind</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "16px", marginBottom: "28px", flexWrap: "wrap" }}>
        {[
          { label: "Cycles", value: cycles, icon: "🔄" },
          { label: "Time", value: `${totalTime}s`, icon: "⏱️" },
          { label: "Score", value: calcScore(), icon: "🏆" },
        ].map((stat) => (
          <div key={stat.label} style={{ flex: "1 1 100px", background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: "14px", padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: "18px", marginBottom: "4px" }}>{stat.icon}</div>
            <div style={{ color: theme.textPrimary, fontSize: "20px", fontWeight: 800 }}>{stat.value}</div>
            <div style={{ color: theme.textMuted, fontSize: "11px", fontWeight: 600, marginTop: "2px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "340px" }}>
        {isActive && (
          <div style={{ color: phaseColor, fontSize: "16px", fontWeight: 700, marginBottom: "20px", letterSpacing: "1px", textTransform: "uppercase", animation: "fadeIn 0.3s ease" }}>
            {phase.emoji} {phase.name}
          </div>
        )}

        <div style={{ position: "relative", width: "220px", height: "220px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: "-20px", borderRadius: "50%", background: `radial-gradient(circle, ${phaseColor}15 0%, transparent 70%)`, animation: isActive ? circleAnimation : "none", transition: "all 0.3s ease" }} />
          <div style={{
            width: "200px", height: "200px", borderRadius: "50%",
            background: isDark
              ? `radial-gradient(circle at 30% 30%, ${phaseColor}30, ${phaseColor}10)`
              : `radial-gradient(circle at 30% 30%, ${phaseColor}25, ${phaseColor}08)`,
            border: `3px solid ${phaseColor}40`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            animation: isActive ? circleAnimation : "none",
            transition: !isActive ? "all 0.5s ease" : "none",
            transform: !isActive ? `scale(${circleScale})` : undefined,
            boxShadow: `0 0 40px ${phaseColor}20, inset 0 0 30px ${phaseColor}08`,
          }}>
            <div style={{ fontSize: "42px", fontWeight: 800, color: theme.textPrimary, lineHeight: 1 }}>
              {isActive ? countdown : "4"}
            </div>
            <div style={{ fontSize: "12px", color: theme.textMuted, marginTop: "8px", fontWeight: 600 }}>
              {isActive ? phase.instruction : "Press Start"}
            </div>
          </div>
        </div>

        {isActive && (
          <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
            {PHASES.map((p, i) => (
              <div key={p.name} style={{
                padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600,
                background: i === phaseIndex ? isDark ? `${phaseColor}25` : `${phaseColor}15` : "transparent",
                color: i === phaseIndex ? phaseColor : theme.textDim,
                border: `1px solid ${i === phaseIndex ? phaseColor + "40" : theme.cardBorder}`,
                transition: "all 0.3s ease",
              }}>
                {p.emoji} {p.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "24px" }}>
        {!isActive ? (
          <button onClick={start} style={{ background: btnGradient, border: "none", borderRadius: "14px", padding: "14px 36px", color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 20px ${theme.accentGlow}`, transition: "all 0.3s ease" }}>
            {cycles > 0 ? "Resume ▶" : "Start ▶"}
          </button>
        ) : (
          <button onClick={stop} style={{ background: isDark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.1)", border: `1px solid ${theme.danger}40`, borderRadius: "14px", padding: "14px 36px", color: theme.danger, fontSize: "15px", fontWeight: 700, cursor: "pointer", transition: "all 0.3s ease" }}>
            Pause ⏸
          </button>
        )}
        {(cycles > 0 || totalTime > 0) && (
          <button onClick={reset} style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: "14px", padding: "14px 24px", color: theme.textSecondary, fontSize: "15px", fontWeight: 600, cursor: "pointer" }}>
            Reset 🔄
          </button>
        )}
      </div>

      {cycles > 0 && !isActive && (
        <div style={{ marginTop: "28px", background: isDark ? "rgba(34,197,94,0.08)" : "rgba(34,197,94,0.06)", border: `1px solid ${theme.success}30`, borderRadius: "16px", padding: "20px", textAlign: "center", animation: "fadeIn 0.4s ease" }}>
          <p style={{ color: theme.textSecondary, fontSize: "14px", marginBottom: "8px" }}>
            Session complete! You did {cycles} cycle{cycles > 1 ? "s" : ""} in {totalTime}s
          </p>
          <p style={{ color: theme.accent, fontSize: "24px", fontWeight: 800 }}>Score: {calcScore()} 🏆</p>
          {cycles >= 5 && <p style={{ color: theme.success, fontSize: "13px", marginTop: "8px" }}>🌟 5-cycle bonus unlocked! +200</p>}
          {cycles >= 10 && <p style={{ color: theme.success, fontSize: "13px" }}>🏅 10-cycle bonus unlocked! +500</p>}
        </div>
      )}
    </div>
  );
}
