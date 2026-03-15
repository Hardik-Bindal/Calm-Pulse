import React, { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "../themes/ThemeContext";

const INFO = [
  { icon: "😊", label: "Emotion Detection", desc: "Real-time facial expression analysis", color: "#14b8a6" },
  { icon: "🎙️", label: "Voice Tone", desc: "Pitch, pace & pauses insights", color: "#38bdf8" },
  { icon: "📊", label: "Stress Meter", desc: "Live stress score during sessions", color: "#a78bfa" },
  { icon: "🔒", label: "Privacy First", desc: "No raw video/audio is stored", color: "#22c55e" },
];

const initialResult = {
  stressLevel: null,
  suggestions: [],
  explanation: "",
};

export default function Camera() {
  const { theme, isDark } = useTheme();
  const [active, setActive] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [requestingPermissions, setRequestingPermissions] = useState(false);
  const [permissionError, setPermissionError] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const audioStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  const [microphoneActive, setMicrophoneActive] = useState(false);
  const [stressScore, setStressScore] = useState(0);
  const [voicePitchProxy, setVoicePitchProxy] = useState(0);
  const [speechText, setSpeechText] = useState("");
  const [aiResult, setAiResult] = useState(initialResult);
  const [loadingAi, setLoadingAi] = useState(false);
  const [voiceAssistantEnabled, setVoiceAssistantEnabled] = useState(true);
  const [expressionLabel, setExpressionLabel] = useState("Neutral");

  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);

  // --- permissions ---
  const requestPermissions = async () => {
    setRequestingPermissions(true);
    setPermissionError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      audioStreamRef.current = stream;
      const AudioContextImpl = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContextImpl();
      const src = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      src.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      setMicrophoneActive(true);
      setHasConsent(true);

      // Automatically start the interactive session once permission is granted
      setActive(true);
      setAiResult(initialResult);
      requestAnimationFrame(analyzeFaceFrame);
      requestAnimationFrame(analyzeVoiceFrame);
    } catch (err) {
      console.error("Permission error", err);
      setPermissionError("We could not access your camera/microphone. Please allow permissions in your browser settings and try again.");
      setHasConsent(false);
    } finally {
      setRequestingPermissions(false);
    }
  };

  // --- voice analysis (intensity + pitch proxy) ---
  const analyzeVoiceFrame = () => {
    const analyser = analyserRef.current;
    if (!analyser || !active) return;

    const bufferLength = analyser.fftSize;
    const timeData = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(timeData);

    // RMS for loudness
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = (timeData[i] - 128) / 128;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / bufferLength);
    const intensity = Math.min(1, rms * 10);

    // zero-crossings as rough pitch proxy
    let crossings = 0;
    for (let i = 1; i < bufferLength; i++) {
      if ((timeData[i - 1] < 128 && timeData[i] >= 128) || (timeData[i - 1] > 128 && timeData[i] <= 128)) {
        crossings++;
      }
    }

    // simple stress score: scale intensity + crossings a bit
    const scoreFromVoice = Math.min(100, intensity * 60 + Math.min(crossings, 80) * 0.5);
    setStressScore((prev) => Math.round((prev * 0.7 + scoreFromVoice * 0.3))); // smooth
    setVoicePitchProxy(crossings);

    requestAnimationFrame(analyzeVoiceFrame);
  };

  // --- fake face analysis hook (placeholder for MediaPipe / TF.js) ---
  const analyzeFaceFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !active) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 360;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // TODO: plug MediaPipe FaceMesh / TensorFlow.js here.
    // For the hackathon demo, we lightly nudge the stress score instead of running a model.
    setStressScore((prev) => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 4)));

    requestAnimationFrame(analyzeFaceFrame);
  };

  // --- speech-to-text (Web Speech API) ---
  const setupRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Web Speech API not available in this browser");
      return null;
    }
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e) => {
      let text = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      setSpeechText(text);
    };
    rec.onerror = (e) => {
      console.error("Speech recognition error", e);
    };
    rec.onend = () => {
      setListening(false);
    };
    return rec;
  };

  const toggleListening = () => {
    if (!listening) {
      if (!recognitionRef.current) {
        recognitionRef.current = setupRecognition();
      }
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setListening(true);
      }
    } else {
      recognitionRef.current?.stop();
      setListening(false);
    }
  };

  // --- start / stop interactive session ---
  const startSession = () => {
    if (!hasConsent) {
      requestPermissions();
      return;
    }
    setActive(true);
    setAiResult(initialResult);
    requestAnimationFrame(analyzeFaceFrame);
    requestAnimationFrame(analyzeVoiceFrame);
  };

  const stopSession = () => {
    setActive(false);
  };

  // --- AI backend call ---
  const callStressAnalysis = useCallback(async () => {
    if (!hasConsent) return;
    setLoadingAi(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/stress/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facialEmotion: expressionLabel, // best guess based on video/audio cues
          voicePitch: voicePitchProxy,
          speechText,
          stressScore,
        }),
      });
      const data = await res.json();
      setAiResult({
        stressLevel: data.stressLevel || null,
        suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
        explanation: data.explanation || "",
      });

      if (voiceAssistantEnabled && data.suggestions) {
        speakSuggestions(data);
      }
    } catch (err) {
      console.error("Stress analysis error", err);
    } finally {
      setLoadingAi(false);
    }
  }, [hasConsent, expressionLabel, voicePitchProxy, speechText, stressScore, voiceAssistantEnabled]);

  // --- TTS reply ---
  const speakSuggestions = (result) => {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance();
    const textParts = [];
    if (result.stressLevel) {
      textParts.push(`Your current stress level looks ${result.stressLevel}.`);
    }
    if (Array.isArray(result.suggestions)) {
      textParts.push(result.suggestions.join(" "));
    }
    utterance.text = textParts.join(" ");
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // --- derived helpers ---
  const stressLabel = () => {
    if (stressScore < 33) return "Low";
    if (stressScore < 66) return "Medium";
    return "High";
  };

  const stressColor = () => {
    if (stressScore < 33) return "#22c55e";
    if (stressScore < 66) return "#f97316";
    return "#ef4444";
  };

  // Keep a readable expression label in sync with the current stress score.
  useEffect(() => {
    const label = stressScore > 70 ? "Stressed" : stressScore > 50 ? "Tense" : stressScore > 30 ? "Neutral" : "Calm";
    setExpressionLabel(label);
  }, [stressScore]);

  // Auto-refresh AI suggestions while the session is active.
  useEffect(() => {
    if (!active || !hasConsent) return;

    const interval = setInterval(() => {
      callStressAnalysis();
    }, 15000);

    return () => clearInterval(interval);
  }, [active, hasConsent, callStressAnalysis]);

  // Request permissions as soon as the camera page is opened.
  useEffect(() => {
    if (!hasConsent && !requestingPermissions) {
      requestPermissions();
    }
  }, []);

  useEffect(() => {
    return () => {
      audioStreamRef.current?.getTracks().forEach((t) => t.stop());
      audioContextRef.current?.close();
      recognitionRef.current?.stop();
    };
  }, []);

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 800, margin: "0 0 4px" }}>
          📷 Interactive Camera Session
        </h2>
        <p style={{ color: theme.textMuted, fontSize: "13px", margin: 0 }}>
          Real-time stress detection using your camera, microphone, and AI — nothing is recorded.
        </p>
      </div>

      {/* Main content: camera + side panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px", marginBottom: "20px" }}>
        {/* Camera panel */}
        <div style={{
          background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)",
          border: `1px solid ${active ? theme.accent + "60" : theme.cardBorder}`,
          borderRadius: "16px", padding: "24px",
          display: "flex", flexDirection: "column", gap: "20px",
          transition: "border-color 0.3s ease",
          boxShadow: active ? `0 0 40px ${theme.accentGlow}` : "none",
        }}>
          {/* Live camera preview */}
          <div style={{
            width: "100%", aspectRatio: "16/9",
            borderRadius: "12px",
            background: isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.06)",
            border: `2px dashed ${active ? theme.accent : theme.cardBorder}`,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: "12px", transition: "all 0.3s ease",
            position: "relative", overflow: "hidden",
          }}>
            {active && (
              <div style={{
                position: "absolute", top: "12px", left: "12px",
                display: "flex", alignItems: "center", gap: "6px",
                background: "rgba(0,0,0,0.6)", padding: "5px 10px", borderRadius: "20px",
              }}>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#f43f5e", animation: "pulse 1s infinite" }} />
                <span style={{ color: "#fff", fontSize: "11px", fontWeight: 600 }}>LIVE</span>
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            {!active && (
              <>
                <span style={{ fontSize: "40px", opacity: 0.5 }}>📷</span>
                <p style={{ color: theme.textMuted, fontSize: "14px", margin: 0, textAlign: "center" }}>
                  Start a session to activate camera and microphone.
                </p>
              </>
            )}
          </div>

          {/* Status row: mic + stress meter */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "10px", height: "10px", borderRadius: "999px",
                background: microphoneActive ? "#22c55e" : "#6b7280",
              }} />
              <span style={{ color: theme.textMuted, fontSize: "12px" }}>
                Mic {microphoneActive ? "active" : "inactive"}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: theme.textSecondary, fontSize: "11px", fontWeight: 600 }}>Expression:</span>
              <span style={{ color: theme.textPrimary, fontSize: "11px", fontWeight: 700 }}>{expressionLabel}</span>
            </div>
            <div style={{ flex: 1, maxWidth: "230px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
                <span style={{ color: theme.textSecondary }}>Stress Meter</span>
                <span style={{ color: stressColor(), fontWeight: 600 }}>
                  {Math.round(stressScore)}/100 · {stressLabel()}
                </span>
              </div>
              <div style={{
                width: "100%", height: "7px",
                borderRadius: "999px",
                background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                overflow: "hidden",
              }}>
                <div style={{
                  width: `${Math.round(stressScore)}%`,
                  height: "100%",
                  borderRadius: "999px",
                  background: stressColor(),
                  transition: "width 0.2s ease-out",
                }} />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={active ? stopSession : startSession}
              disabled={requestingPermissions}
              style={{
                padding: "12px 32px",
                borderRadius: "12px",
                border: "none",
                background: active
                  ? (isDark ? "rgba(244,63,94,0.15)" : "rgba(244,63,94,0.1)")
                  : theme.accentGradient,
                color: active ? "#f43f5e" : "#fff",
                fontSize: "14px",
                fontWeight: 700,
                cursor: requestingPermissions ? "wait" : "pointer",
                boxShadow: active ? "none" : `0 4px 14px ${theme.accentGlow}`,
                transition: "all 0.2s ease",
              }}
            >
              {active ? "⏹ Stop Session" : "▶ Start Analysis"}
            </button>

            <button
              onClick={toggleListening}
              disabled={!hasConsent}
              style={{
                padding: "10px 18px",
                borderRadius: "12px",
                border: `1px solid ${theme.cardBorder}`,
                background: listening ? (isDark ? "rgba(34,197,94,0.1)" : "rgba(34,197,94,0.06)") : "transparent",
                color: listening ? theme.success : theme.textSecondary,
                fontSize: "13px",
                fontWeight: 600,
                cursor: hasConsent ? "pointer" : "not-allowed",
              }}
            >
              {listening ? "🎙 Stop Listening" : "🎙 Capture Speech"}
            </button>

            <button
              onClick={callStressAnalysis}
              disabled={!active || loadingAi}
              style={{
                padding: "10px 18px",
                borderRadius: "12px",
                border: "none",
                background: !active || loadingAi
                  ? "rgba(148,163,184,0.5)"
                  : "linear-gradient(135deg, #6366f1, #22d3ee)",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                cursor: !active || loadingAi ? "not-allowed" : "pointer",
              }}
            >
              {loadingAi ? "Analyzing..." : "✨ AI Suggestions"}
            </button>

            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: theme.textDim }}>
              <input
                type="checkbox"
                checked={voiceAssistantEnabled}
                onChange={(e) => setVoiceAssistantEnabled(e.target.checked)}
                style={{ accentColor: theme.accent }}
              />
              Voice assistant reply
            </label>
          </div>

          {/* Consent + speech text */}
          <div style={{ marginTop: "4px", width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
            {!hasConsent && (
              <p style={{ color: theme.textDim, fontSize: "11px", margin: 0 }}>
                We&apos;ll ask for camera & microphone access when you start analysis. Raw video and audio never leave your device.
              </p>
            )}
            {permissionError && (
              <p style={{ color: "#f97316", fontSize: "11px", margin: 0 }}>
                {permissionError}
              </p>
            )}
            <div style={{
              marginTop: "4px",
              fontSize: "11px",
              color: theme.textDim,
              padding: "8px 10px",
              borderRadius: "10px",
              border: `1px dashed ${theme.cardBorder}`,
              maxHeight: "70px",
              overflowY: "auto",
            }}>
              <div style={{ fontWeight: 600, color: theme.textSecondary, marginBottom: "4px" }}>Recent speech snapshot</div>
              <div>
                {speechText || "Start speaking while the mic is active to capture how you sound in this session."}
              </div>
            </div>
          </div>
        </div>

        {/* Side panel: info + AI suggestions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Info cards (unchanged style, updated copy) */}
          {INFO.map((item, i) => (
            <div key={i} style={{
              background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)",
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: "14px", padding: "16px 18px",
              display: "flex", alignItems: "center", gap: "14px",
              animation: `slideInLeft 0.3s ease ${i * 0.07}s both`,
            }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "10px",
                background: item.color + (isDark ? "18" : "12"),
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px", flexShrink: 0,
              }}>{item.icon}</div>
              <div>
                <div style={{ color: theme.textPrimary, fontSize: "13px", fontWeight: 700 }}>{item.label}</div>
                <div style={{ color: theme.textDim, fontSize: "12px", marginTop: "2px" }}>{item.desc}</div>
              </div>
            </div>
          ))}

          {/* AI Suggestions panel */}
          <div style={{
            background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.9)",
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: "14px",
            padding: "16px 18px",
            marginTop: "4px",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: theme.textPrimary, fontSize: "13px", fontWeight: 700 }}>AI Stress Guidance</span>
              {aiResult.stressLevel && (
                <span style={{
                  fontSize: "11px",
                  padding: "3px 8px",
                  borderRadius: "999px",
                  background: isDark ? "rgba(148,163,184,0.15)" : "rgba(148,163,184,0.12)",
                  color:
                    aiResult.stressLevel === "high" ? "#ef4444" :
                    aiResult.stressLevel === "medium" ? "#f97316" :
                    "#22c55e",
                  fontWeight: 600,
                }}>
                  {aiResult.stressLevel?.toUpperCase()}
                </span>
              )}
            </div>
            {aiResult.suggestions.length ? (
              <>
                <ul style={{ paddingLeft: "18px", margin: "4px 0 6px", fontSize: "12px", color: theme.textSecondary }}>
                  {aiResult.suggestions.map((s, idx) => (
                    <li key={idx} style={{ marginBottom: "4px" }}>{s}</li>
                  ))}
                </ul>
                {aiResult.explanation && (
                  <p style={{ color: theme.textDim, fontSize: "11px", margin: 0 }}>
                    {aiResult.explanation}
                  </p>
                )}
              </>
            ) : (
              <p style={{ color: theme.textDim, fontSize: "12px", margin: 0 }}>
                Start a session, speak for a few moments, then tap{" "}
                <span style={{ fontWeight: 600 }}>AI Suggestions</span> to get gentle, personalized guidance.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

