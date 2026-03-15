import React, { useState } from "react";
import { useTheme } from "../themes/ThemeContext";
import MemoryCardGame from "./games/MemoryCardGame";
import BreathingGame from "./games/BreathingGame";
import WordPuzzleGame from "./games/WordPuzzleGame";

const GAMES = [
  { id: "memory", name: "Memory Cards", icon: "🃏", desc: "Flip and match pairs to sharpen your focus", difficulty: "Medium", color: "#14b8a6" },
  { id: "breathing", name: "Breathing Exercise", icon: "🫧", desc: "Follow the guided breathing to reduce stress", difficulty: "Easy", color: "#22c55e" },
  { id: "word", name: "Word Puzzle", icon: "🔤", desc: "Unscramble calming words to relax your mind", difficulty: "Hard", color: "#a78bfa" },
];

const TIPS = [
  { icon: "💡", text: "5 minutes of a stress game lowers cortisol by up to 12%" },
  { icon: "🎯", text: "Memory games improve focus and reduce anxiety" },
  { icon: "🧘", text: "Breathing exercises activate your parasympathetic nervous system" },
];

export default function Games() {
  const { theme, isDark } = useTheme();
  const [activeGame, setActiveGame] = useState(null);

  // Render the selected game
  if (activeGame === "memory") return <MemoryCardGame onBack={() => setActiveGame(null)} />;
  if (activeGame === "breathing") return <BreathingGame onBack={() => setActiveGame(null)} />;
  if (activeGame === "word") return <WordPuzzleGame onBack={() => setActiveGame(null)} />;

  // Game selection menu
  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 800, margin: "0 0 4px" }}>
          🎮 Stress Relief Games
        </h2>
        <p style={{ color: theme.textMuted, fontSize: "13px", margin: 0 }}>
          Take a break and play to recharge your mind
        </p>
      </div>

      {/* Game cards — 3 equal columns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px", marginBottom: "20px" }}>
        {GAMES.map((game, i) => (
          <div key={game.id} style={{
            background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)",
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: "16px",
            padding: "24px",
            cursor: "pointer",
            transition: "all 0.25s ease",
            animation: `scaleIn 0.3s ease ${i * 0.08}s both`,
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.borderColor = game.color + "50";
            e.currentTarget.style.boxShadow = `0 8px 32px ${game.color}20`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = theme.cardBorder;
            e.currentTarget.style.boxShadow = "none";
          }}
          >
            {/* Decorative glow */}
            <div style={{
              position: "absolute", top: "-40px", right: "-40px",
              width: "120px", height: "120px", borderRadius: "50%",
              background: `radial-gradient(circle, ${game.color}15, transparent 70%)`,
              pointerEvents: "none",
            }} />

            <div style={{
              width: "52px", height: "52px", borderRadius: "14px",
              background: game.color + (isDark ? "18" : "12"),
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "24px", marginBottom: "14px",
              border: `1px solid ${game.color}25`,
            }}>
              {game.icon}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <h3 style={{ color: theme.textPrimary, fontSize: "16px", fontWeight: 700, margin: 0 }}>{game.name}</h3>
              <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, background: game.color + "18", color: game.color }}>
                {game.difficulty}
              </span>
            </div>
            <p style={{ color: theme.textSecondary, fontSize: "13px", lineHeight: 1.6, margin: "0 0 18px" }}>{game.desc}</p>

            <button
              onClick={() => setActiveGame(game.id)}
              style={{
                width: "100%", padding: "10px", borderRadius: "10px", border: "none",
                background: `linear-gradient(135deg, ${game.color}, ${game.color}cc)`,
                color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                boxShadow: `0 4px 14px ${game.color}35`,
              }}
            >
              Play Now ▶
            </button>
          </div>
        ))}
      </div>

      {/* Wellness tips — 3 columns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
        {TIPS.map((tip, i) => (
          <div key={i} style={{
            background: isDark ? "rgba(20,184,166,0.04)" : "rgba(20,184,166,0.03)",
            border: `1px solid ${theme.accent}15`,
            borderRadius: "12px", padding: "14px 16px",
            display: "flex", alignItems: "flex-start", gap: "10px",
          }}>
            <span style={{ fontSize: "18px", flexShrink: 0 }}>{tip.icon}</span>
            <p style={{ color: theme.textMuted, fontSize: "12px", margin: 0, lineHeight: 1.5 }}>{tip.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
