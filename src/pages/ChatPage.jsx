import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { chatMessages } from "../data/sampleData";

export default function ChatPage({ mode }) {
  const { theme, isDark } = useTheme();
  const [messages, setMessages] = useState(chatMessages);
  const [input, setInput] = useState("");
  const [lang, setLang] = useState("English");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Call your backend API
      const res = await fetch("http://localhost:5001/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const botMsg = {
        role: "bot",
        text: data.response,
      };
      setMessages((prev) => [...prev, botMsg]);

    } catch (error) {
      console.error("Error:", error);
      const botMsg = {
        role: "bot",
        text: "Sorry, I'm having trouble connecting right now. Please try again! 💙",
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 800, margin: 0 }}>AI Mental Health Chat 💬</h2>
          <p style={{ color: theme.textMuted, fontSize: "14px", margin: "4px 0 0" }}>Private, safe space. No admin access. Ever.</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {["English", "Hindi"].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                padding: "6px 16px",
                borderRadius: "20px",
                border: `1px solid ${lang === l ? theme.accent : theme.cardBorder}`,
                background: lang === l
                  ? isDark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.1)"
                  : "transparent",
                color: lang === l ? theme.accentLighter : theme.textMuted,
                fontSize: "13px",
                cursor: "pointer",
                backdropFilter: isDark ? "none" : "blur(8px)",
                transition: "all 0.2s",
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        background: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: "18px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        minHeight: "400px",
        backdropFilter: isDark ? "none" : theme.glassBlur,
        WebkitBackdropFilter: isDark ? "none" : theme.glassBlur,
        boxShadow: theme.cardShadow,
      }}>
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "8px",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                animation: `fadeIn 0.3s ease`,
              }}
            >
              {m.role === "bot" && (
                <div style={{
                  fontSize: "18px",
                  flexShrink: 0,
                  background: isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>🛡️</div>
              )}
              <div style={{
                maxWidth: "70%",
                padding: "12px 16px",
                borderRadius: "16px",
                fontSize: "14px",
                lineHeight: 1.5,
                ...(m.role === "user"
                  ? {
                      background: isDark ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.15)",
                      color: isDark ? "#fff" : theme.textPrimary,
                      borderBottomRightRadius: "4px",
                    }
                  : {
                      background: isDark ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.06)",
                      border: `1px solid ${isDark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.12)"}`,
                      color: theme.textPrimary,
                      borderBottomLeftRadius: "4px",
                    }),
              }}>
                {m.text}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "8px",
            }}>
              <div style={{
                fontSize: "18px",
                flexShrink: 0,
                background: isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>🛡️</div>
              <div style={{
                padding: "12px 16px",
                borderRadius: "16px",
                fontSize: "14px",
                background: isDark ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.06)",
                border: `1px solid ${isDark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.12)"}`,
                color: theme.textMuted,
              }}>
                Thinking... 💭
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div style={{
          display: "flex",
          gap: "12px",
          padding: "16px",
          borderTop: `1px solid ${theme.cardBorder}`,
        }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={lang === "Hindi" ? "यहाँ टाइप करें..." : "Type how you're feeling..."}
            disabled={isLoading}
            style={{
              flex: 1,
              background: theme.inputBg,
              border: `1px solid ${theme.inputBorder}`,
              borderRadius: "14px",
              padding: "12px 16px",
              color: theme.textPrimary,
              fontSize: "14px",
              outline: "none",
              backdropFilter: isDark ? "none" : "blur(8px)",
              transition: "all 0.2s",
              opacity: isLoading ? 0.7 : 1,
            }}
          />
          <button
            onClick={send}
            disabled={isLoading}
            style={{
              background: theme.accentGradient,
              border: "none",
              borderRadius: "14px",
              padding: "12px 20px",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              cursor: isLoading ? "not-allowed" : "pointer",
              boxShadow: `0 4px 14px ${theme.accent}44`,
              transition: "all 0.2s",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "..." : "Send →"}
          </button>
        </div>
      </div>

      <div style={{
        color: theme.textDim,
        fontSize: "12px",
        textAlign: "center",
      }}>
        🔒 All conversations are 100% private and encrypted. Not accessible by any admin.
        &nbsp;AI support supplements — never replaces — professional care.
      </div>
    </div>
  );
}