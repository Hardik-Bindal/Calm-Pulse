import React, { useState, useRef, useEffect } from "react";
import { chatMessages } from "../data/sampleData";

const botResponses = [
  "I hear you. That sounds stressful. Have you tried the 4-7-8 breathing technique? It really helps in the moment.",
  "Your stress patterns show you tend to peak around exam week. Let's build a plan to ease that. 📋",
  "Remember — progress, not perfection. You've already done more than you think. 💪",
  "Would you like me to suggest a 5-minute mindfulness exercise right now?",
  "It's okay to feel overwhelmed sometimes. Would you like to talk about what's stressing you the most?",
];

export default function ChatPage({ mode }) {
  const [messages, setMessages] = useState(chatMessages);
  const [input, setInput] = useState("");
  const [lang, setLang] = useState("English");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    const botMsg = {
      role: "bot",
      text: botResponses[Math.floor(Math.random() * botResponses.length)],
    };
    setMessages((prev) => [...prev, userMsg]);
    setTimeout(() => setMessages((prev) => [...prev, botMsg]), 800);
    setInput("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>AI Mental Health Chat 💬</h2>
          <p style={styles.sub}>Private, safe space. No admin access. Ever.</p>
        </div>
        <div style={styles.langSwitch}>
          {["English", "Hindi"].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{ ...styles.langBtn, ...(lang === l ? styles.langActive : {}) }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.chatBox}>
        <div style={styles.messages}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{ ...styles.msgRow, justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}
            >
              {m.role === "bot" && <div style={styles.botAvatar}>🛡️</div>}
              <div
                style={{
                  ...styles.bubble,
                  ...(m.role === "user" ? styles.userBubble : styles.botBubble),
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div style={styles.inputRow}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={lang === "Hindi" ? "यहाँ टाइप करें..." : "Type how you're feeling..."}
            style={styles.input}
          />
          <button onClick={send} style={styles.sendBtn}>Send →</button>
        </div>
      </div>

      <div style={styles.disclaimer}>
        🔒 All conversations are 100% private and encrypted. Not accessible by any admin.
        &nbsp;AI support supplements — never replaces — professional care.
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", flexDirection: "column", gap: "20px", height: "100%" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  title: { color: "#fff", fontSize: "22px", fontWeight: 800, margin: 0 },
  sub: { color: "#64748b", fontSize: "14px", margin: "4px 0 0" },
  langSwitch: { display: "flex", gap: "8px" },
  langBtn: {
    padding: "6px 16px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "transparent",
    color: "#64748b",
    fontSize: "13px",
    cursor: "pointer",
  },
  langActive: {
    background: "rgba(99,102,241,0.2)",
    border: "1px solid #6366f1",
    color: "#a5b4fc",
  },
  chatBox: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minHeight: "400px",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  msgRow: { display: "flex", alignItems: "flex-end", gap: "8px" },
  botAvatar: {
    fontSize: "18px",
    flexShrink: 0,
    background: "rgba(99,102,241,0.15)",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: {
    maxWidth: "70%",
    padding: "12px 16px",
    borderRadius: "16px",
    fontSize: "14px",
    lineHeight: 1.5,
  },
  botBubble: {
    background: "rgba(99,102,241,0.12)",
    border: "1px solid rgba(99,102,241,0.2)",
    color: "#e2e8f0",
    borderBottomLeftRadius: "4px",
  },
  userBubble: {
    background: "rgba(99,102,241,0.3)",
    color: "#fff",
    borderBottomRightRadius: "4px",
  },
  inputRow: {
    display: "flex",
    gap: "12px",
    padding: "16px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
  input: {
    flex: 1,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "12px 16px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
  },
  sendBtn: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none",
    borderRadius: "12px",
    padding: "12px 20px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  disclaimer: {
    color: "#475569",
    fontSize: "12px",
    textAlign: "center",
  },
};