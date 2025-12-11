import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import gsap from "gsap";
import { IconSend, IconSparkles, IconRobot } from "@phosphor-icons/react";
import Spline from "@splinetool/react-spline";
import Confetti from "react-confetti";
import Typing from "react-typing-effect";
import { Card } from "@tremor/react";
import "./styles.css";

/**
 * MuxDay - App.jsx
 * - Big interactive, game-like UI
 * - Uses GSAP for motion, WebAudio for sound
 * - localStorage used to store message timestamps for 24h rate-limit
 *
 * NOTE: Add the accompanying styles in styles.css or paste into a global CSS file.
 */

/* ---------- Constants ---------- */

// Artificial reply sets (10-20 phrases)
const DENIAL_REPLIES = [
  "Sorry — that request isn't available right now.",
  "I can't help with that, try again later.",
  "Servers are experiencing an existential crisis. Try rebooting reality.",
  "Error 503: MuxDay blaming the cloud providers for you.",
  "That's outside my safety guardrails — ask something else.",
  "Our team of hamsters took a sick day. Operation canceled.",
  "Not today. Maybe after the update patch 0.0.1b.",
  "Request denied — policy or outage, take your pick.",
  "I would, but the API's on strike.",
  "Nope. The overlords at BigTech asked us not to.",
  "Request refused: Mux tokens depleted.",
  "Hmm. I'll pass on that one."
];

const SUCCESS_REPLIES = [
  "On it! Here's your answer — fast & tidy.",
  "Done. You asked, I delivered.",
  "Result: processed. See below.",
  "Completed. Anything else I can do?",
  "Voila. The output you secretly wanted.",
  "Here you go — and yes, I did it dramatically.",
  "Finished. That was fun!",
  "Output attached — hope you like glitter.",
  "Response ready. Proceed with caution.",
  "Mission complete. Returning to standby."
];

const REQUESTING_PHRASES = [
  "Summarize my meeting notes.",
  "Create a haiku about coffee & code.",
  "Explain quantum computing like I'm five.",
  "Write a 100-word job bio.",
  "Design a minimal landing page.",
  "Translate this to Bengali.",
  "Create a regex to match emails.",
  "Draft a terse bug report.",
  "Make a tweet-sized product blurb.",
  "Suggest a 3-step onboarding flow.",
  "Compose a friendly reminder email.",
  "Explain an algorithm with visuals."
];

const MAX_MESSAGES_PER_24H = 3;

/* ---------- Utils for storage/rate-limiting ---------- */

const STORAGE_KEY = "muxday_messages";

function getStoredTimestamps() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr;
  } catch (e) {
    return [];
  }
}

function pushTimestampNow() {
  const arr = getStoredTimestamps();
  arr.push(Date.now());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function pruneAndCount24h() {
  const arr = getStoredTimestamps();
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const pruned = arr.filter((t) => t >= cutoff);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
  return pruned.length;
}

/* ---------- WebAudio FX ---------- */

function createWhooshSound(context, when = 0, type = "boom") {
  // small sonic boom / whoosh using noise + oscillator
  const now = context.currentTime + when;
  const o = context.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(80, now);
  o.frequency.exponentialRampToValueAtTime(800, now + 0.12);

  const g = context.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(1, now + 0.05);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  o.connect(g);
  g.connect(context.destination);
  o.start(now);
  o.stop(now + 0.4);
}

function createPulse(context, when = 0, colorType = "blue") {
  const now = context.currentTime + when;
  const o = context.createOscillator();
  o.type = "triangle";
  o.frequency.setValueAtTime(colorType === "blue" ? 240 : 120, now);
  o.frequency.exponentialRampToValueAtTime(colorType === "blue" ? 60 : 40, now + 0.25);

  const g = context.createGain();
  g.gain.setValueAtTime(0.001, now);
  g.gain.exponentialRampToValueAtTime(0.6, now + 0.08);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

  o.connect(g);
  g.connect(context.destination);
  o.start(now);
  o.stop(now + 0.6);
}

/* ---------- Main App ---------- */

export default function App() {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]); // {author: 'user'|'ai', text}
  const [activated, setActivated] = useState(false); // after first pre-prompt enter
  const [waitingSecondPrompt, setWaitingSecondPrompt] = useState(false);
  const [prePromptText, setPrePromptText] = useState(""); // store first pre-prompt
  const [isCinematic, setIsCinematic] = useState(false);
  const [isLockdown, setIsLockdown] = useState(false);
  const [lockdownUntil, setLockdownUntil] = useState(null);
  const [spawnKey, setSpawnKey] = useState(0); // to spawn new icon
  const [showConfetti, setShowConfetti] = useState(false);

  const chatPanelRef = useRef();
  const aiIconRef = useRef();
  const messagingPanelRef = useRef();
  const rootRef = useRef();
  const audioCtxRef = useRef();
  const keywordsContainerRef = useRef();
  const canvasSize = useRef({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    // Attach cursor reactive listener for little parallax / glow
    const move = (e) => {
      setCursor({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("resize", () => {
      canvasSize.current = { w: window.innerWidth, h: window.innerHeight };
    });
    // prune storage on load
    const count = pruneAndCount24h();
    if (count > MAX_MESSAGES_PER_24H) {
      enterLockdown();
    }
    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, []);

  useEffect(() => {
    // animate AI icon small idle float using GSAP
    if (aiIconRef.current) {
      gsap.to(aiIconRef.current, {
        y: -6,
        repeat: -1,
        yoyo: true,
        duration: 1.6,
        ease: "sine.inOut"
      });
    }
  }, [spawnKey]);

  // Setup AudioContext on first interaction
  function ensureAudioContext() {
    if (!audioCtxRef.current) {
      try {
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        audioCtxRef.current = ac;
      } catch (e) {
        audioCtxRef.current = null;
      }
    }
  }

  function handleSend(e) {
    if (e.key === "Enter") {
      const trimmed = inputValue.trim();
      if (!trimmed) return;
      // If not activated yet -> this is pre-prompt
      if (!activated) {
        // radial pulse and set activated
        setActivated(true);
        setPrePromptText(trimmed);
        setWaitingSecondPrompt(true);
        ensureAudioContext();
        if (audioCtxRef.current) createPulse(audioCtxRef.current, 0, trimmed.startsWith(".") ? "blue" : "red");
        radialPulse(trimmed.startsWith(".") ? "blue" : "red");
        setInputValue("");
        // show a random requesting phrase in the messaging panel (pretend user saw a request)
        const randomRequest = REQUESTING_PHRASES[Math.floor(Math.random() * REQUESTING_PHRASES.length)];
        // small ephemeral "requesting" message
        setMessages((m) => [...m, { author: "user", text: randomRequest, ephemeral: true }]);
        // keep waiting
        return;
      }

      // If activated and waiting for second prompt, this is the second prompt that triggers cinematic
      if (waitingSecondPrompt) {
        const secondPrompt = trimmed;
        setInputValue("");
        setWaitingSecondPrompt(false);
        // clear ephemeral user requesting
        setMessages((m) => m.filter((mm) => !mm.ephemeral));
        // decide cinematic path based on whether prePrompt starts with "."
        const preHasDot = prePromptText.startsWith(".");
        setIsCinematic(preHasDot);
        // increment message counter and check lockdown
        pushTimestampNow();
        const count = pruneAndCount24h();
        if (count > MAX_MESSAGES_PER_24H) {
          // enter lockdown
          enterLockdown();
          return;
        }
        // start cinematic sequence
        startCinematic({
          preText: prePromptText,
          secondText: secondPrompt,
          useFancy: preHasDot
        });
        return;
      }

      // Normal send (when not in pre-prompt flow)
      setMessages((m) => [...m, { author: "user", text: trimmed }]);
      pushTimestampNow();
      const count = pruneAndCount24h();
      if (count > MAX_MESSAGES_PER_24H) {
        enterLockdown();
      }
      setInputValue("");
      // immediate AI reply simple
      setTimeout(() => {
        const reply = SUCCESS_REPLIES[Math.floor(Math.random() * SUCCESS_REPLIES.length)];
        setMessages((m) => [...m, { author: "ai", text: reply }]);
      }, 700);
    }
  }

  function radialPulse(color = "blue") {
    // create a radial pulse at the right side of messaging panel where AI icon sits
    const panelRect = messagingPanelRef.current?.getBoundingClientRect();
    const rootRect = rootRef.current?.getBoundingClientRect();
    const cx = panelRect ? panelRect.right - 48 : window.innerWidth - 120;
    const cy = panelRect ? panelRect.top + panelRect.height / 2 : window.innerHeight - 140;

    const pulse = document.createElement("div");
    pulse.className = `radial-pulse ${color === "blue" ? "blue" : "red"}`;
    pulse.style.left = `${cx}px`;
    pulse.style.top = `${cy}px`;
    rootRef.current.appendChild(pulse);
    // animate with GSAP
    gsap.fromTo(
      pulse,
      { scale: 0, opacity: 0.9 },
      {
        scale: 6,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        onComplete: () => pulse.remove()
      }
    );
  }

  function startCinematic({ preText, secondText, useFancy }) {
    ensureAudioContext();
    const ctx = audioCtxRef.current;

    // Move icon to center, slide chat panel down
    const iconEl = aiIconRef.current;
    const panelEl = messagingPanelRef.current;

    // Determine target center coords
    const rootRect = rootRef.current.getBoundingClientRect();
    const centerX = rootRect.width / 2;
    const centerY = rootRect.height / 2 - 60;

    // Get icon current position (right of panel)
    const fromRect = iconEl.getBoundingClientRect();
    const fromX = fromRect.left + fromRect.width / 2;
    const fromY = fromRect.top + fromRect.height / 2;
    const dx = centerX - fromX;
    const dy = centerY - fromY;

    // slide panel down
    gsap.to(panelEl, { y: 260, duration: 0.8, ease: "power3.inOut" });
    // move icon to center
    gsap.to(iconEl, {
      x: dx,
      y: dy,
      scale: 1.6,
      duration: 1.0,
      ease: "expo.inOut",
      onComplete: () => {
        // if not fancy -> quick red pulse and direct denial reply
        if (!useFancy) {
          // quick red pulse and skip cinematic
          if (ctx) createPulse(ctx, 0, "red");
          setTimeout(() => {
            // move icon to left chat location and display denial message
            const leftChatX = 80; // approximate
            gsap.to(iconEl, { x: leftChatX - fromX, y: 0, scale: 1, duration: 0.9, ease: "power2.inOut" });
            const denial = DENIAL_REPLIES[Math.floor(Math.random() * DENIAL_REPLIES.length)];
            setTimeout(() => {
              setMessages((m) => [...m, { author: "ai", text: denial }]);
              // spawn new icon in messaging panel after slide up
              setTimeout(() => {
                gsap.to(panelEl, { y: 0, duration: 0.8, ease: "power3.out" });
                setSpawnKey((k) => k + 1);
              }, 400);
            }, 900);
          }, 500);
          return;
        }

        // Fancy cinematic (blackhole)
        if (ctx) createPulse(ctx, 0, "blue");
        // create random keywords and the words from secondText
        const keywords = generateKeywordsFromText(secondText, 12);
        createKeywordCloud(keywords, centerX, centerY);

        // animate words flying into center (suction)
        gsap.to(".mux-keyword", {
          x: 0,
          y: 0,
          scale: 0.2,
          opacity: 0,
          duration: 4,
          stagger: 0.12,
          ease: "power2.in",
          onComplete: () => {
            // intensify suction: dim screen
            const dim = document.createElement("div");
            dim.className = "dim-overlay";
            rootRef.current.appendChild(dim);
            gsap.to(dim, { opacity: 0.7, duration: 0.9 });

            // random 5-10s delay before whoosh
            const delay = 5 + Math.random() * 5;
            setTimeout(() => {
              // whoosh & sparkles and sonic boom
              if (ctx) {
                createWhooshSound(ctx, 0, "boom");
                createPulse(ctx, 0.05, "blue");
              }
              // sparkle at center
              sparkAt(centerX, centerY);

              // after tiny pause: move icon to left chat, show reply extremely fast
              setTimeout(() => {
                // clear dim
                gsap.to(".dim-overlay", {
                  opacity: 0,
                  duration: 0.6,
                  onComplete: () => {
                    document.querySelectorAll(".dim-overlay").forEach((el) => el.remove());
                  }
                });

                // animate icon to left chat
                const leftTargetX = - (fromX - 80); // move relative to its current transform
                gsap.to(iconEl, { x: leftTargetX, y: 0, scale: 1, duration: 0.9, ease: "power3.inOut" });

                // AI reply
                const reply = chooseFastReply(preText, secondText);
                // Play a small typing/shimmer effect (we will append then replace quickly)
                setTimeout(() => {
                  setMessages((m) => [...m, { author: "ai", text: reply }]);
                  // small confetti burst
                  setShowConfetti(true);
                  setTimeout(() => setShowConfetti(false), 1200);

                  // slide panel back up and spawn new icon on messaging panel
                  gsap.to(panelEl, { y: 0, duration: 0.9, ease: "power3.out", onComplete: () => setSpawnKey((k) => k + 1) });
                }, 400);
              }, 350);
            }, delay * 1000);
          }
        });
      }
    });
  }

  function generateKeywordsFromText(text, n = 12) {
    const words = (text || "")
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(Boolean);
    const extras = [
      "latency",
      "tokens",
      "throughput",
      "vector",
      "cache",
      "heuristic",
      "pipeline",
      "retrain",
      "orchestrate",
      "graph",
      "synthesis",
      "entropy",
      "quantum",
      "scale",
      "uptime"
    ];
    const combined = [...words, ...extras];
    // pick n random
    const chosen = [];
    for (let i = 0; i < n; i++) {
      const c = combined[Math.floor(Math.random() * combined.length)];
      if (c && !chosen.includes(c)) chosen.push(c);
    }
    return chosen;
  }

  function createKeywordCloud(words, centerX, centerY) {
    // container
    const container = document.createElement("div");
    container.className = "keywords-container";
    container.style.left = `${centerX}px`;
    container.style.top = `${centerY}px`;
    rootRef.current.appendChild(container);

    words.forEach((w, idx) => {
      const el = document.createElement("div");
      el.className = "mux-keyword";
      el.innerText = w;
      // random starting offset radius
      const angle = Math.random() * Math.PI * 2;
      const r = 120 + Math.random() * 200;
      const sx = Math.cos(angle) * r + (Math.random() - 0.5) * 40;
      const sy = Math.sin(angle) * r + (Math.random() - 0.5) * 40;
      el.style.transform = `translate(${sx}px, ${sy}px) rotate(${Math.random() * 20 - 10}deg)`;
      container.appendChild(el);
      // subtle float
      gsap.to(el, { y: "-=8", repeat: -1, yoyo: true, duration: 1.8 + Math.random(), ease: "sine.inOut" });
    });

    // store ref to allow later removal (not necessary here)
    keywordsContainerRef.current = container;
  }

  function sparkAt(x, y) {
    const spark = document.createElement("div");
    spark.className = "sparkle";
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    rootRef.current.appendChild(spark);
    gsap.to(spark, { scale: 5, opacity: 0, duration: 0.7, ease: "power2.out", onComplete: () => spark.remove() });
  }

  function chooseFastReply(preText, secondText) {
    // If the preText begins with dot, assume answer was embedded — reveal a quick reply chosen from list
    const pool = [...SUCCESS_REPLIES, ...DENIAL_REPLIES];
    // slight bias for success if dot
    if (preText && preText.startsWith(".")) {
      return SUCCESS_REPLIES[Math.floor(Math.random() * SUCCESS_REPLIES.length)];
    } else {
      // fallback denial
      return DENIAL_REPLIES[Math.floor(Math.random() * DENIAL_REPLIES.length)];
    }
  }

  function enterLockdown() {
    setIsLockdown(true);
    const now = Date.now();
    // schedule until refresh = 24h after earliest timestamp in storage
    const arr = getStoredTimestamps();
    const earliest = arr.length ? Math.min(...arr) : now;
    const unlockAt = earliest + 24 * 60 * 60 * 1000;
    setLockdownUntil(unlockAt);
  }

  function handleUpgradeClick() {
    // show fake loading + pop-up saying unavailable
    const modal = document.createElement("div");
    modal.className = "fake-upgrade-modal";
    modal.innerHTML = `<div class="loader">Upgrading…</div><div class="msg">Connecting to the shiny store...</div>`;
    rootRef.current.appendChild(modal);
    gsap.to(modal, { opacity: 1, duration: 0.3 });
    setTimeout(() => {
      gsap.to(modal, { opacity: 0, duration: 0.4, onComplete: () => modal.remove() });
      alert("This feature is unavailable in your region.");
    }, 2000);
  }

  // UI pieces
  return (
    <div className="muxday-root" ref={rootRef}>
      {showConfetti && <Confetti numberOfPieces={120} recycle={false} />}
      <Background cursor={cursor} />

      <div className="top-bar">
        <div className="logo">
          <div className="logo-circle">MD</div>
          <div className="logo-text">MuxDay</div>
        </div>
        <div className="top-controls">
          <button className="btn-ghost">Account</button>
          <button className="btn-ghost">Settings</button>
        </div>
      </div>

      <div className="content-grid">
        <div className="left-column">
          {/* Chat conversation area */}
          <Card className="chat-card">
            <div className="chat-header">
              <h3>MuxDay — Conversation</h3>
              <div className="mini-hint">Type a pre-prompt first, then press Enter. (Shhh.)</div>
            </div>
            <div className="chat-body" ref={chatPanelRef}>
              {messages.map((m, i) => (
                <MessageBubble key={i} message={m} />
              ))}
              {/* natural location for AI icon in chat */}
              <div className="ai-avatar-in-chat">
                <div className="ai-avatar-small"> <IconRobot size={20} weight="fill" /> </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="right-column">
          <Card className="messaging-panel" ref={messagingPanelRef}>
            <div className="messaging-header">
              <h4>Message Panel</h4>
              <div className="tiny">Cmd+Enter to send</div>
            </div>

            <div className="input-row">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleSend}
                placeholder="Type your prompt… (pre-prompt can start with . )"
                className="text-input"
              />
              <div className="ai-icon-area" ref={aiIconRef} data-key={spawnKey}>
                <div className={`ai-circle ${activated ? "glow" : ""}`}>
                  <IconRobot size={28} weight="fill" />
                </div>
              </div>
            </div>

            <div className="panel-footer">
              <button
                className="ghost-action"
                onClick={() => {
                  // reveal random requesting phrase
                  const r = REQUESTING_PHRASES[Math.floor(Math.random() * REQUESTING_PHRASES.length)];
                  setMessages((m) => [...m, { author: "user", text: r }]);
                }}
              >
                <IconSparkles /> Random Request
              </button>
              <div className="msg-count">Used {pruneAndCount24h()} / {MAX_MESSAGES_PER_24H} today</div>
            </div>
          </Card>

          {/* decorative Spline area */}
          <div className="spline-box">
            <Spline scene="https://prod.spline.design/placeholder/scene.splinecode" />
          </div>
        </div>
      </div>

      {/* AI icon natural spawn on messaging panel (floating) */}
      <div className="floating-ai-hint">
        <div className="dot-matrix" />
      </div>

      {/* Lockdown overlay */}
      {isLockdown && (
        <LockdownOverlay
          until={lockdownUntil}
          onUpgrade={handleUpgradeClick}
        />
      )}
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function MessageBubble({ message }) {
  const { author, text, ephemeral } = message;
  return (
    <div className={`msg-bubble ${author === "ai" ? "ai" : "user"} ${ephemeral ? "ephemeral" : ""}`}>
      <div className="bubble-inner">
        {author === "ai" && <div className="avatar-left"><IconRobot size={20} /></div>}
        <div className="bubble-text">
          {author === "ai" ? (
            <Typing speed={25} text={[text]} displayTextRenderer={(txt) => <div>{txt}</div>} />
          ) : (
            <div>{text}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Background({ cursor }) {
  // subtle aurora gradient and mesh, plus cursor-reactive glow
  const style = {
    backgroundImage:
      "radial-gradient(1200px 600px at 10% 10%, rgba(148,0,211,0.12), transparent), linear-gradient(135deg,#091440 0%, #0b1226 60%)",
    "--cx": `${cursor.x}px`,
    "--cy": `${cursor.y}px`
  };
  return (
    <div className="background-layer" style={style}>
      {/* subtle dot matrix */}
      <svg className="dot-matrix-svg" width="100%" height="100%">
        <defs>
          <pattern id="dot" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.02)"></circle>
          </pattern>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot)" filter="url(#softGlow)"></rect>
      </svg>

      {/* cursor-reactive radial highlight */}
      <div className="cursor-glow" style={{ left: cursor.x, top: cursor.y }} />
    </div>
  );
}

function LockdownOverlay({ until, onUpgrade }) {
  const [remaining, setRemaining] = useState(calcRemaining(until));
  useEffect(() => {
    const t = setInterval(() => setRemaining(calcRemaining(until)), 1000);
    return () => clearInterval(t);
  }, [until]);

  return (
    <div className="lockdown-overlay">
      <div className="lock-card">
        <h2>SCIFI LOCKDOWN</h2>
        <p>You've used too many Mux tokens in the last 24 hours.</p>
        <div className="countdown">
          {remaining.days}d {remaining.hours}h {remaining.minutes}m {remaining.seconds}s
        </div>
        <div className="lock-actions">
          <button className="btn-primary" onClick={onUpgrade}>Shiny Upgrade</button>
          <button className="btn-ghost" onClick={() => alert("Sorry — demo only.")}>Dismiss</button>
        </div>
      </div>
    </div>
  );
}

function calcRemaining(until) {
  const diff = Math.max(0, (until || Date.now()) - Date.now());
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);
  return { days, hours, minutes, seconds };
}

/* ---------- Render ---------- */

// If you're using Vite's index.html, it should mount to #root
const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<App />);
}

