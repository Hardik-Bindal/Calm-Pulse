import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "../../themes/ThemeContext";

const EMOJI_PAIRS = ["🌸", "🌊", "🍃", "🌙", "⭐", "🦋", "🌈", "🔮"];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createBoard() {
  const pairs = [...EMOJI_PAIRS, ...EMOJI_PAIRS];
  return shuffleArray(pairs).map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }));
}

export default function MemoryCardGame({ onBack }) {
  const { theme, isDark } = useTheme();
  const [cards, setCards] = useState(createBoard);
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [lockBoard, setLockBoard] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && !gameOver) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, gameOver]);

  useEffect(() => {
    if (matches === EMOJI_PAIRS.length) {
      setGameOver(true);
      setIsRunning(false);
    }
  }, [matches]);

  const calcScore = useCallback(() => {
    const mismatches = moves - matches;
    return Math.max(0, 1000 - timer * 5 - mismatches * 10);
  }, [moves, matches, timer]);

  const handleFlip = (index) => {
    if (lockBoard || cards[index].flipped || cards[index].matched || gameOver) return;
    if (!isRunning) setIsRunning(true);

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newSelected = [...selected, index];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newSelected;

      if (newCards[a].emoji === newCards[b].emoji) {
        newCards[a].matched = true;
        newCards[b].matched = true;
        setCards([...newCards]);
        setMatches((m) => m + 1);
        setSelected([]);
      } else {
        setLockBoard(true);
        setTimeout(() => {
          newCards[a].flipped = false;
          newCards[b].flipped = false;
          setCards([...newCards]);
          setSelected([]);
          setLockBoard(false);
        }, 800);
      }
    }
  };

  const restart = () => {
    setCards(createBoard());
    setSelected([]);
    setMoves(0);
    setMatches(0);
    setTimer(0);
    setIsRunning(false);
    setGameOver(false);
    setLockBoard(false);
  };

  const btnStyle = {
    background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`,
    border: "none", borderRadius: "12px", padding: "10px 20px",
    color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer",
    boxShadow: `0 4px 14px ${theme.accentGlow}`,
  };

  const cardStyle = (card) => ({
    width: "100%",
    aspectRatio: "1",
    borderRadius: "16px",
    border: `2px solid ${card.matched ? theme.success + "60" : card.flipped ? theme.accent + "60" : theme.cardBorder}`,
    background: card.flipped || card.matched
      ? isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.08)"
      : isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: card.flipped || card.matched ? "32px" : "24px",
    cursor: card.flipped || card.matched || lockBoard ? "default" : "pointer",
    transition: "all 0.3s ease",
    boxShadow: card.matched
      ? `0 0 20px ${theme.success}30`
      : card.flipped
      ? `0 0 16px ${theme.accent}20`
      : theme.cardShadow,
    transform: card.matched ? "scale(0.95)" : "scale(1)",
  });

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <button
            onClick={onBack}
            style={{ background: "none", border: "none", color: theme.accent, fontSize: "14px", cursor: "pointer", padding: 0, marginBottom: "8px", fontWeight: 600 }}
          >
            ← Back to Games
          </button>
          <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 800, margin: 0 }}>🃏 Memory Card Game</h2>
          <p style={{ color: theme.textMuted, fontSize: "13px", margin: "4px 0 0" }}>Match all pairs to sharpen your focus</p>
        </div>
        <button onClick={restart} style={btnStyle}>🔄 Restart</button>
      </div>

      <div style={{ display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
        {[
          { label: "Moves", value: moves, icon: "👆" },
          { label: "Matches", value: `${matches}/${EMOJI_PAIRS.length}`, icon: "✅" },
          { label: "Time", value: `${timer}s`, icon: "⏱️" },
          { label: "Score", value: calcScore(), icon: "🏆" },
        ].map((stat) => (
          <div key={stat.label} style={{ flex: "1 1 100px", background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: "14px", padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: "18px", marginBottom: "4px" }}>{stat.icon}</div>
            <div style={{ color: theme.textPrimary, fontSize: "20px", fontWeight: 800 }}>{stat.value}</div>
            <div style={{ color: theme.textMuted, fontSize: "11px", fontWeight: 600, marginTop: "2px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", maxWidth: "480px", margin: "0 auto" }}>
        {cards.map((card, i) => (
          <div
            key={card.id}
            onClick={() => handleFlip(i)}
            style={{ ...cardStyle(card), animation: card.matched ? "bounceIn 0.4s ease" : `scaleIn 0.3s ease ${i * 0.03}s both` }}
          >
            {card.flipped || card.matched ? card.emoji : "❓"}
          </div>
        ))}
      </div>

      {gameOver && (
        <div style={{ marginTop: "28px", background: isDark ? "rgba(34,197,94,0.1)" : "rgba(34,197,94,0.08)", border: `1px solid ${theme.success}40`, borderRadius: "18px", padding: "28px", textAlign: "center", animation: "bounceIn 0.5s ease" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎉</div>
          <h3 style={{ color: theme.success, fontSize: "22px", fontWeight: 800, margin: "0 0 8px" }}>Congratulations!</h3>
          <p style={{ color: theme.textSecondary, fontSize: "14px", marginBottom: "4px" }}>Completed in {moves} moves and {timer} seconds</p>
          <p style={{ color: theme.accent, fontSize: "28px", fontWeight: 800, margin: "12px 0" }}>Score: {calcScore()}</p>
          <button onClick={restart} style={{ ...btnStyle, padding: "12px 28px", fontSize: "14px", marginTop: "8px" }}>Play Again 🔄</button>
        </div>
      )}
    </div>
  );
}
