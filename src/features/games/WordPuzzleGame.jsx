import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTheme } from "../../themes/ThemeContext";

const API = `${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/games`;
const TIME_LIMIT = 30;

export default function WordPuzzleGame({ onBack }) {
  const { theme, isDark } = useTheme();
  const [scrambled, setScrambled] = useState("");
  const [wordLength, setWordLength] = useState(0);
  const [input, setInput] = useState("");
  const [timer, setTimer] = useState(TIME_LIMIT);
  const [isActive, setIsActive] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef(null);

  const btnGradient = `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`;

  const fetchWord = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    setInput("");
    try {
      const res = await fetch(`${API}/word-challenge`);
      const data = await res.json();
      if (data.success) {
        setScrambled(data.data.scrambled);
        setWordLength(data.data.length);
        setTimer(TIME_LIMIT);
        setIsActive(true);
        setRound((r) => r + 1);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    } catch (err) {
      console.error("Failed to fetch word:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isActive && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0 && isActive) {
      handleTimeUp();
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, timer]);

  const handleTimeUp = async () => {
    setIsActive(false);
    setStreak(0);
    try {
      const res = await fetch(`${API}/verify-word`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scrambled, attempt: "" }),
      });
      const data = await res.json();
      setFeedback({ correct: false, answer: data.data?.answer || null, timedOut: true });
    } catch {
      setFeedback({ correct: false, answer: null, timedOut: true });
    }
  };

  const submit = async () => {
    if (!input.trim() || !isActive) return;
    setIsActive(false);
    try {
      const res = await fetch(`${API}/verify-word`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scrambled, attempt: input.trim() }),
      });
      const data = await res.json();
      if (data.success && data.data.correct) {
        const timeBonus = Math.round((timer / TIME_LIMIT) * 50);
        const streakBonus = Math.round(150 * (streak + 1) * 0.1);
        const roundScore = 150 + timeBonus + streakBonus;
        setScore((s) => s + roundScore);
        setStreak((s) => s + 1);
        setFeedback({ correct: true, answer: data.data.answer, points: roundScore });
      } else {
        setStreak(0);
        setShaking(true);
        setTimeout(() => setShaking(false), 500);
        setFeedback({ correct: false, answer: data.data.answer });
      }
    } catch (err) {
      console.error("Verify error:", err);
      setFeedback({ correct: false, answer: null });
    }
  };

  const timerPercent = (timer / TIME_LIMIT) * 100;
  const timerColor = timer > 15 ? theme.success : timer > 7 ? theme.warning : theme.danger;

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <button onClick={onBack} style={{ background: "none", border: "none", color: theme.accent, fontSize: "14px", cursor: "pointer", padding: 0, marginBottom: "8px", fontWeight: 600 }}>
            ← Back to Games
          </button>
          <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 800, margin: 0 }}>🔤 Word Puzzle</h2>
          <p style={{ color: theme.textMuted, fontSize: "13px", margin: "4px 0 0" }}>Unscramble calming words to relax your mind</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[
          { label: "Score", value: score, icon: "🏆" },
          { label: "Streak", value: `${streak}🔥`, icon: "⚡" },
          { label: "Round", value: round, icon: "📝" },
        ].map((stat) => (
          <div key={stat.label} style={{ flex: "1 1 100px", background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: "14px", padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: "18px", marginBottom: "4px" }}>{stat.icon}</div>
            <div style={{ color: theme.textPrimary, fontSize: "20px", fontWeight: 800 }}>{stat.value}</div>
            <div style={{ color: theme.textMuted, fontSize: "11px", fontWeight: 600, marginTop: "2px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: "20px", padding: "36px", boxShadow: theme.cardShadow, textAlign: "center", minHeight: "320px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {!isActive && round === 0 ? (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>🧩</div>
            <h3 style={{ color: theme.textPrimary, fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>Ready to unscramble?</h3>
            <p style={{ color: theme.textMuted, fontSize: "14px", marginBottom: "24px", maxWidth: "320px" }}>
              A scrambled word will appear. Type the correct word before time runs out!
            </p>
            <button onClick={fetchWord} disabled={loading} style={{ background: btnGradient, border: "none", borderRadius: "14px", padding: "14px 36px", color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 20px ${theme.accentGlow}` }}>
              {loading ? "Loading..." : "Start Game ▶"}
            </button>
          </div>
        ) : isActive ? (
          <div style={{ width: "100%", maxWidth: "400px", animation: "fadeIn 0.3s ease" }}>
            <div style={{ width: "100%", height: "8px", borderRadius: "4px", background: theme.barBg, marginBottom: "28px", overflow: "hidden" }}>
              <div style={{ width: `${timerPercent}%`, height: "100%", borderRadius: "4px", background: timerColor, transition: "width 1s linear, background 0.3s ease" }} />
            </div>
            <div style={{ color: timerColor, fontSize: "14px", fontWeight: 700, marginBottom: "8px" }}>⏱️ {timer}s remaining</div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "28px", flexWrap: "wrap", animation: shaking ? "shake 0.5s ease" : "none" }}>
              {scrambled.split("").map((letter, i) => (
                <div key={i} style={{ width: "48px", height: "56px", borderRadius: "12px", background: isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.08)", border: `2px solid ${theme.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 800, color: theme.accentLighter, textTransform: "uppercase", animation: `scaleIn 0.3s ease ${i * 0.05}s both` }}>
                  {letter}
                </div>
              ))}
            </div>
            <p style={{ color: theme.textDim, fontSize: "12px", marginBottom: "16px" }}>{wordLength} letters • Type the word below</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="Your answer..."
                style={{ flex: 1, background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: "14px", padding: "14px 18px", color: theme.textPrimary, fontSize: "16px", fontWeight: 600, outline: "none", textAlign: "center", letterSpacing: "2px", textTransform: "lowercase" }}
              />
              <button onClick={submit} style={{ background: btnGradient, border: "none", borderRadius: "14px", padding: "14px 24px", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 14px ${theme.accentGlow}` }}>Check ✓</button>
            </div>
          </div>
        ) : (
          <div style={{ animation: feedback?.correct ? "bounceIn 0.5s ease" : "fadeIn 0.3s ease" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>
              {feedback?.correct ? "🎉" : feedback?.timedOut ? "⏰" : "😅"}
            </div>
            <h3 style={{ color: feedback?.correct ? theme.success : theme.danger, fontSize: "20px", fontWeight: 800, marginBottom: "8px" }}>
              {feedback?.correct ? "Correct!" : feedback?.timedOut ? "Time's Up!" : "Not Quite!"}
            </h3>
            {feedback?.answer && <p style={{ color: theme.textSecondary, fontSize: "15px", marginBottom: "4px" }}>The word was: <strong style={{ color: theme.accent }}>{feedback.answer}</strong></p>}
            {feedback?.correct && <p style={{ color: theme.accent, fontSize: "22px", fontWeight: 800, margin: "12px 0" }}>+{feedback.points} points</p>}
            <button onClick={fetchWord} disabled={loading} style={{ background: btnGradient, border: "none", borderRadius: "14px", padding: "14px 32px", color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer", marginTop: "16px", boxShadow: `0 4px 20px ${theme.accentGlow}` }}>
              {loading ? "Loading..." : "Next Word →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
