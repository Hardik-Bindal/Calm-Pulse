import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import MemoryCardGame from "./MemoryCardGame";
import BreathingGame from "./BreathingGame";
import WordPuzzleGame from "./WordPuzzleGame";

const API = "http://localhost:5001/api/games";

const difficultyColors = {
  easy: "#22c55e",
  medium: "#eab308",
  hard: "#ef4444",
};

const categoryIcons = {
  focus: "🎯",
  relaxation: "🧘",
  cognitive: "🧠",
};

export default function GamesPage() {
  const { theme, isDark } = useTheme();
  const [games, setGames] = useState([]);
  const [activeGame, setActiveGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      if (data.success) {
        setGames(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch games:", err);
      // Fallback data
      setGames([
        { id: "memory-card", name: "Memory Card Game", description: "Flip cards and match pairs to train your focus.", icon: "🃏", category: "focus", difficulty: "medium" },
        { id: "breathing-exercise", name: "Breathing Exercise", description: "Follow the animated guide to breathe in, hold, and breathe out.", icon: "🫧", category: "relaxation", difficulty: "easy" },
        { id: "word-puzzle", name: "Word Puzzle", description: "Unscramble calming words against the clock.", icon: "🔤", category: "cognitive", difficulty: "hard" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (activeGame === "memory-card") return <MemoryCardGame onBack={() => setActiveGame(null)} />;
  if (activeGame === "breathing-exercise") return <BreathingGame onBack={() => setActiveGame(null)} />;
  if (activeGame === "word-puzzle") return <WordPuzzleGame onBack={() => setActiveGame(null)} />;

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{
          color: theme.textPrimary,
          fontSize: "24px",
          fontWeight: 800,
          margin: 0,
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}>
          🎮 Stress Relief Games
        </h2>
        <p style={{ color: theme.textMuted, fontSize: "14px", margin: "6px 0 0" }}>
          Take a break and play a game to relieve stress and recharge your mind
        </p>
      </div>

      {/* Games Grid */}
      {loading ? (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          minHeight: "200px", color: theme.textMuted,
        }}>
          Loading games...
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}>
          {games.map((game, i) => {
            const diffColor = difficultyColors[game.difficulty] || theme.textMuted;
            const catIcon = categoryIcons[game.category] || "🎮";

            return (
              <div
                key={game.id}
                style={{
                  background: theme.cardBg,
                  border: `1px solid ${theme.cardBorder}`,
                  borderRadius: "20px",
                  padding: "28px",
                  backdropFilter: isDark ? "none" : theme.glassBlur,
                  WebkitBackdropFilter: isDark ? "none" : theme.glassBlur,
                  boxShadow: theme.cardShadow,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  animation: `scaleIn 0.4s ease ${i * 0.1}s both`,
                  position: "relative",
                  overflow: "hidden",
                }}
                onClick={() => setActiveGame(game.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 12px 40px ${theme.accent}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = theme.cardShadow;
                }}
              >
                {/* Decorative gradient blob */}
                <div style={{
                  position: "absolute",
                  top: "-30px",
                  right: "-30px",
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${theme.accent}10, transparent)`,
                  pointerEvents: "none",
                }} />

                {/* Top row: icon + badges */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div style={{
                    fontSize: "40px",
                    width: "64px",
                    height: "64px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "18px",
                    background: isDark ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.08)",
                    border: `1px solid ${theme.accent}20`,
                  }}>
                    {game.icon}
                  </div>

                  <div style={{ display: "flex", gap: "6px", flexDirection: "column", alignItems: "flex-end" }}>
                    {/* Difficulty badge */}
                    <span style={{
                      padding: "4px 10px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: 700,
                      background: diffColor + "18",
                      color: diffColor,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}>
                      {game.difficulty}
                    </span>
                    {/* Category badge */}
                    <span style={{
                      padding: "4px 10px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: 600,
                      background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                      color: theme.textMuted,
                    }}>
                      {catIcon} {game.category}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 style={{
                  color: theme.textPrimary,
                  fontSize: "18px",
                  fontWeight: 800,
                  margin: "0 0 8px",
                }}>
                  {game.name}
                </h3>

                {/* Description */}
                <p style={{
                  color: theme.textSecondary,
                  fontSize: "13px",
                  lineHeight: 1.6,
                  margin: "0 0 20px",
                }}>
                  {game.description}
                </p>

                {/* Play button */}
                <button
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "14px",
                    border: "none",
                    background: theme.accentGradient,
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: `0 4px 14px ${theme.accent}33`,
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  Play Now ▶
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer tip */}
      <div style={{
        marginTop: "28px",
        padding: "16px 20px",
        borderRadius: "14px",
        background: isDark ? "rgba(99,102,241,0.06)" : "rgba(99,102,241,0.04)",
        border: `1px solid ${theme.accent}15`,
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}>
        <span style={{ fontSize: "20px" }}>💡</span>
        <p style={{ color: theme.textMuted, fontSize: "13px", margin: 0 }}>
          <strong style={{ color: theme.textSecondary }}>Pro tip:</strong> Even 5 minutes of stress-relief games
          can lower cortisol levels and improve focus. Try a breathing exercise between study sessions!
        </p>
      </div>
    </div>
  );
}
