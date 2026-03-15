import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "../themes/ThemeContext";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

// Helper for Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function StressCheck() {
  const { theme, isDark } = useTheme();

  const [hasPermission, setHasPermission] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [stressScore, setStressScore] = useState(0); // 0 to 100
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [voiceAssistantEnabled, setVoiceAssistantEnabled] = useState(true);
  
  const [metrics, setMetrics] = useState({ blinkRate: 0, tension: 0, volume: 0 });
  const [speechText, setSpeechText] = useState("");
  const [isProcessingBackend, setIsProcessingBackend] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  
  // MediaPipe & Audio Context Refs
  const faceMeshRef = useRef(null);
  const cameraRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const recognitionRef = useRef(null);
  
  // Accumulation variables (refs to avoid re-renders during rapid updates)
  const blinkCountRef = useRef(0);
  const lastBlinkTimeRef = useRef(0);
  const tensionScoreRef = useRef(0);
  const audioVolumeRef = useRef(0);
  
  // Cleanup
  useEffect(() => {
    return () => {
      stopAnalysis();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setHasPermission(true);
      setPermissionDenied(false);
      setupAudioAnalysis(stream);
      setupSpeechRecognition();
    } catch (err) {
      console.error("Permission denied or error:", err);
      setPermissionDenied(true);
    }
  };

  const setupAudioAnalysis = (stream) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      
      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
    } catch (e) {
      console.error("Audio Setup Failed", e);
    }
  };

  const setupSpeechRecognition = () => {
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          currentTranscript += event.results[i][0].transcript;
        }
      }
      if (currentTranscript.trim().length > 0) {
        setSpeechText(prev => prev + " " + currentTranscript);
      }
    };
    recognitionRef.current = recognition;
  };

  const startAnalysis = async () => {
    if (!videoRef.current || !streamRef.current) return;
    setIsAnalyzing(true);
    setAiSuggestions([]);
    
    // Resume audio context if needed
    if (audioContextRef.current && audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
    
    // Start Speech Recognition
    if (recognitionRef.current) {
      try { recognitionRef.current.start(); } catch (e) {}
    }

    // Initialize FaceMesh
    faceMeshRef.current = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });
    
    faceMeshRef.current.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    faceMeshRef.current.onResults(onFaceResults);

    cameraRef.current = new Camera(videoRef.current, {
      onFrame: async () => {
        if (faceMeshRef.current && videoRef.current) {
          await faceMeshRef.current.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480
    });
    
    cameraRef.current.start();
    requestAnimationFrame(audioProcessLoop);
    
    // Trigger backend analysis every 15 seconds
    analysisIntervalRef.current = setInterval(() => {
      triggerBackendAnalysis();
    }, 15000);
  };
  
  const analysisIntervalRef = useRef(null);

  const stopAnalysis = () => {
    setIsAnalyzing(false);
    if (cameraRef.current) cameraRef.current.stop();
    if (faceMeshRef.current) faceMeshRef.current.close();
    if (recognitionRef.current) recognitionRef.current.stop();
    if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
  };

  const toggleAnalysis = () => {
    if (isAnalyzing) stopAnalysis();
    else startAnalysis();
  };

  // --- ANALYSIS LOGIC ---

  const onFaceResults = (results) => {
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) return;
    const landmarks = results.multiFaceLandmarks[0];
    
    // Draw landmarks if canvas exists
    if (canvasRef.current && videoRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      // Optional: draw custom dots here
    }

    // 1. Blink Detection using Eye Aspect Ratio (EAR) approximation
    // Left eye top/bottom: 159, 145. Left eye sides: 33, 133
    const leftEyeTop = landmarks[159];
    const leftEyeBottom = landmarks[145];
    const verticalDist = Math.hypot(leftEyeTop.x - leftEyeBottom.x, leftEyeTop.y - leftEyeBottom.y);
    
    // Very naive blink threshold
    if (verticalDist < 0.015) {
      const now = Date.now();
      if (now - lastBlinkTimeRef.current > 300) {
        blinkCountRef.current += 1;
        lastBlinkTimeRef.current = now;
      }
    }

    // 2. Eyebrow tension approximation (distance between inner eyebrows: 55, 285)
    const browLeft = landmarks[55];
    const browRight = landmarks[285];
    const browDist = Math.hypot(browLeft.x - browRight.x, browLeft.y - browRight.y);
    // Lower distance often correlates to furrowed brows
    const tension = Math.max(0, 0.1 - browDist) * 1000;
    tensionScoreRef.current = tension;

    updateCompositeScore();
  };

  const audioProcessLoop = () => {
    if (!isAnalyzing || !analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteTimeDomainData(dataArray);
    
    let sumSquares = 0.0;
    for (let i = 0; i < dataArray.length; i++) {
        const norm = (dataArray[i] / 128.0) - 1.0;
        sumSquares += norm * norm;
    }
    const rms = Math.sqrt(sumSquares / dataArray.length);
    audioVolumeRef.current = rms * 100; // rough 0-100 scale

    updateCompositeScore();
    requestAnimationFrame(audioProcessLoop);
  };

  const updateCompositeScore = () => {
    // Arbitrary formula mixing blink rate, eyebrow tension, and voice volume
    // Higher tension, volume spikes = more stress.
    let base = 20;
    const tScore = Math.min(40, tensionScoreRef.current * 2);
    const vScore = Math.min(40, audioVolumeRef.current * 1.5);
    // Add minor blink impact
    const blinkImpact = Math.min(20, blinkCountRef.current * 2); 
    
    const newScore = Math.round(base + tScore + vScore + blinkImpact);
    const clamped = Math.max(0, Math.min(100, newScore));
    setStressScore(clamped);
    
    setMetrics({
      blinkRate: blinkCountRef.current,
      tension: Math.round(tScore),
      volume: Math.round(vScore)
    });
  };

  // --- BACKEND AI SYNC ---

  const triggerBackendAnalysis = async () => {
    if (isProcessingBackend) return;
    setIsProcessingBackend(true);

    try {
      const payload = {
        facialEmotion: tensionScoreRef.current > 15 ? 'tense' : 'neutral',
        voicePitch: audioVolumeRef.current, // rough proxy
        speechText: speechText.trim(),
        stressScore: stressScore
      };

      const res = await fetch("http://localhost:5000/api/stress/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.suggestions) {
        setAiSuggestions(data.suggestions);
        
        if (voiceAssistantEnabled) {
          playVoiceResponse(data.suggestions[0] || "Take a deep breath and relax.");
        }
      }
      
      // Reset accumulators slightly for the next window
      blinkCountRef.current = Math.floor(blinkCountRef.current / 2);
      setSpeechText("");

    } catch (e) {
      console.error("Backend Error", e);
    } finally {
      setIsProcessingBackend(false);
    }
  };

  const playVoiceResponse = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // clear previous
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1;
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      animation: "fadeIn 0.4s ease"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: "0 0 8px 0", fontSize: "28px", color: theme.textPrimary, fontWeight: 800 }}>Real-Time Stress Analysis</h1>
          <p style={{ margin: 0, color: theme.textSecondary, fontSize: "15px" }}>
             Analyzing micro-expressions and voice tones to detect stress levels.
          </p>
        </div>
        
        {hasPermission && (
          <button
            onClick={toggleAnalysis}
            style={{
              padding: "10px 24px",
              borderRadius: "12px",
              border: "none",
              background: isAnalyzing ? theme.danger : theme.success,
              color: "#fff",
              fontWeight: 600,
              fontSize: "15px",
              cursor: "pointer",
              boxShadow: `0 4px 12px ${isAnalyzing ? theme.danger : theme.success}40`,
              transition: "all 0.2s ease"
            }}
          >
            {isAnalyzing ? "Stop Analysis" : "Start Analysis"}
          </button>
        )}
      </div>

      {!hasPermission ? (
        <div style={{
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: "16px",
          padding: "40px",
          textAlign: "center",
          maxWidth: "500px",
          margin: "40px auto"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔒</div>
          <h2 style={{ color: theme.textPrimary, margin: "0 0 12px" }}>Camera & Mic Access Required</h2>
          <p style={{ color: theme.textSecondary, marginBottom: "24px", lineHeight: 1.5 }}>
            To perform real-time stress analysis, we need access to your camera and microphone. 
            All processing is private. We do not store any raw video or audio.
          </p>
          {permissionDenied && (
            <div style={{ color: theme.danger, marginBottom: "16px", fontSize: "14px", fontWeight: 500 }}>
              Access was denied. Please allow permissions in your browser settings to continue.
            </div>
          )}
          <button
            onClick={requestPermissions}
            style={{
              padding: "12px 32px",
              borderRadius: "12px",
              border: "none",
              background: theme.accentGradient,
              color: "#fff",
              fontWeight: 600,
              fontSize: "16px",
              cursor: "pointer",
              boxShadow: `0 4px 12px ${theme.accentGlow}`
            }}
          >
            Grant Permissions
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px" }}>
          {/* Main camera feed */}
          <div style={{
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: "16px",
            overflow: "hidden",
            position: "relative",
            aspectRatio: "16/9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "scaleX(-1)", // mirror effect
                opacity: isAnalyzing ? 1 : 0.5,
                transition: "opacity 0.3s ease"
              }}
            />
            <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", transform: "scaleX(-1)"}} />

            {!isAnalyzing && (
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "#fff",
                background: "rgba(0,0,0,0.6)",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: 500,
                backdropFilter: "blur(4px)"
              }}>
                Analysis Paused
              </div>
            )}
            
            {/* Status indicators overlaid */}
            <div style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              display: "flex",
              gap: "8px"
            }}>
              <div style={{
                background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
                padding: "6px 12px", borderRadius: "8px", color: isAnalyzing ? theme.success : "#fff",
                fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px"
              }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: isAnalyzing ? theme.success : "#aaa" }} />
                Camera {isAnalyzing ? "Active" : "Ready"}
              </div>
              <div style={{
                background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
                padding: "6px 12px", borderRadius: "8px", color: isAnalyzing ? theme.success : "#fff",
                fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px"
              }}>
                🎤 Mic {isAnalyzing ? "Listening" : "Ready"}
              </div>
            </div>

            {/* Live Data Overlay */}
            {isAnalyzing && (
              <div style={{
                position: "absolute", bottom: "16px", left: "16px", background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)", padding: "12px", borderRadius: "12px",
                display: "flex", gap: "16px", color: "#fff", fontSize: "12px"
              }}>
                <div><strong>Blinks:</strong> {metrics.blinkRate}</div>
                <div><strong>Tension:</strong> {metrics.tension}</div>
                <div><strong>Volume:</strong> {metrics.volume}</div>
              </div>
            )}
          </div>

          {/* Side panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Stress Meter */}
            <div style={{
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <h3 style={{ margin: "0 0 16px", color: theme.textSecondary, fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>
                Current Stress Score
              </h3>
              
              <div style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                border: `8px solid ${stressScore > 70 ? theme.danger : stressScore > 40 ? theme.warning : theme.success}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "36px",
                fontWeight: 800,
                color: theme.textPrimary,
                transition: "border-color 0.5s ease"
              }}>
                {stressScore}
              </div>
              <p style={{ marginTop: "16px", marginBottom: 0, fontWeight: 600, color: stressScore > 70 ? theme.danger : stressScore > 40 ? theme.warning : theme.success }}>
                {stressScore > 70 ? "High Stress" : stressScore > 40 ? "Elevated" : "Relaxed"}
              </p>
            </div>

            {/* AI Assistant */}
            <div style={{
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: "16px",
              padding: "20px",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              maxHeight: "300px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, color: theme.textPrimary, fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  ✨ AI Companion
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {isProcessingBackend && <span style={{ fontSize: "12px", color: theme.accent }}>Analyzing...</span>}
                  <button
                    onClick={() => setVoiceAssistantEnabled(!voiceAssistantEnabled)}
                    style={{
                      background: "transparent", border: "none", cursor: "pointer", 
                      fontSize: "18px", opacity: voiceAssistantEnabled ? 1 : 0.4
                    }}
                    title={voiceAssistantEnabled ? "Voice enabled" : "Voice disabled"}
                  >
                    {voiceAssistantEnabled ? "🔊" : "🔇"}
                  </button>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingRight: "4px" }}>
                {aiSuggestions.length === 0 ? (
                  <div style={{ color: theme.textMuted, fontSize: "14px", textAlign: "center", marginTop: "20px" }}>
                    Start analysis to receive real-time personalized guidance every 15 seconds.
                  </div>
                ) : (
                  aiSuggestions.map((suggestion, idx) => (
                    <div key={idx} style={{
                      background: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
                      padding: "12px",
                      borderRadius: "12px",
                      color: theme.textPrimary,
                      fontSize: "14px",
                      lineHeight: 1.5,
                      borderLeft: `4px solid ${theme.accentLight}`
                    }}>
                      {suggestion}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
