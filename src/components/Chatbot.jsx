import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../themes/ThemeContext";

const PANEL_WIDTH = 360;

export default function Chatbot({ open, onClose }) {
  const { theme, isDark } = useTheme();
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi there! 👋 I'm your StressGuard assistant. How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.response }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: "bot",
        text: "Hmm, I couldn't reach the server. Please make sure the backend is running! 💙",
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside style={{
      width: open ? PANEL_WIDTH : 0,
      minWidth: open ? PANEL_WIDTH : 0,
      maxWidth: PANEL_WIDTH,
      height: "100%",
      background: isDark ? theme.chatBg : theme.chatBg,
      borderLeft: open ? `1px solid ${theme.chatBorder}` : "none",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      transition: "width 0.3s ease, min-width 0.3s ease",
      flexShrink: 0,
    }}>
      {open && (
        <>
          {/* Header */}
          <div style={{
            padding: "16px 16px 14px",
            borderBottom: `1px solid ${theme.chatBorder}`,
            background: isDark ? "rgba(20,184,166,0.05)" : "rgba(15,118,110,0.04)",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "34px", height: "34px", borderRadius: "10px",
                  background: theme.accentGradient,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "16px", boxShadow: `0 4px 12px ${theme.accentGlow}`,
                }}>
                  🛡️
                </div>
                <div>
                  <div style={{ color: theme.textPrimary, fontSize: "14px", fontWeight: 700, lineHeight: 1.2 }}>
                    AI Assistant
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: theme.success }} />
                    <span style={{ color: theme.textMuted, fontSize: "11px" }}>Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: "28px", height: "28px",
                  borderRadius: "8px",
                  border: `1px solid ${theme.chatBorder}`,
                  background: "transparent",
                  color: theme.textMuted,
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 14px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: m.role === "user" ? "row-reverse" : "row",
                  gap: "8px",
                  alignItems: "flex-end",
                  animation: "fadeIn 0.3s ease",
                }}
              >
                {m.role === "bot" && (
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "8px",
                    background: isDark ? "rgba(20,184,166,0.15)" : "rgba(15,118,110,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px", flexShrink: 0,
                  }}>
                    🛡️
                  </div>
                )}
                <div style={{
                  maxWidth: "80%",
                  padding: "10px 13px",
                  borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  fontSize: "13px",
                  lineHeight: 1.55,
                  ...(m.role === "user"
                    ? {
                        background: theme.accentGradient,
                        color: "#fff",
                        boxShadow: `0 4px 12px ${theme.accentGlow}`,
                      }
                    : {
                        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                        border: `1px solid ${theme.chatBorder}`,
                        color: theme.textPrimary,
                      }),
                }}>
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "8px",
                  background: isDark ? "rgba(20,184,166,0.15)" : "rgba(15,118,110,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
                }}>
                  🛡️
                </div>
                <div style={{
                  padding: "10px 14px",
                  borderRadius: "14px 14px 14px 4px",
                  background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                  border: `1px solid ${theme.chatBorder}`,
                  display: "flex", gap: "4px", alignItems: "center",
                }}>
                  {[0, 1, 2].map((d) => (
                    <div key={d} style={{
                      width: "6px", height: "6px", borderRadius: "50%",
                      background: theme.accentLight,
                      animation: `pulse 1.4s ease ${d * 0.15}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "12px 14px",
            borderTop: `1px solid ${theme.chatBorder}`,
            flexShrink: 0,
            background: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)",
          }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="How are you feeling?"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: `1px solid ${theme.chatBorder}`,
                  background: theme.inputBg,
                  color: theme.textPrimary,
                  fontSize: "13px",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
              />
              <button
                onClick={send}
                disabled={loading}
                style={{
                  width: "40px", height: "40px",
                  borderRadius: "10px",
                  border: "none",
                  background: theme.accentGradient,
                  color: "#fff",
                  fontSize: "16px",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: `0 4px 12px ${theme.accentGlow}`,
                  transition: "all 0.2s ease",
                }}
              >
                ↑
              </button>
            </div>
            <p style={{ color: theme.textDim, fontSize: "10px", textAlign: "center", margin: "8px 0 0" }}>
              🔒 Private & encrypted · Not stored on any server
            </p>
          </div>
        </>
      )}
    </aside>
  );
}
