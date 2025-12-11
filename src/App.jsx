import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Lock, Sparkle, Globe, X, Lightning } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Register GSAP plugins
gsap.registerPlugin(MotionPathPlugin);

// --- Utility: Tailwind Merger ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Assets & Constants ---
const CUSTOM_CURSOR = "url('https://huanmux.github.io/assets/image/diamond-cursor.cur'), auto";

const MuxLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 1124 385" xmlns="http://www.w3.org/2000/svg">
    <path d="M468.253 43.25c-6.119 12.696-12.584 26.616-15.208 32.75-1.765 4.125-4.522 10.284-6.127 13.687S444 96.116 444 96.413s-2.25 5.285-5 11.087-5 10.704-5 10.893-2.649 5.915-5.886 12.725c-7.919 16.657-11.132 23.719-18.781 41.279-5.886 13.353-9.16 20.746-16.779 37.103a3707 3707 0 0 0-5.323 11.5 2194 2194 0 0 1-7.97 17c-12.693 26.781-20.416 44.348-20.581 46.81-.153 2.279.202 2.671 2.32 2.566 1.375-.068 3.85-.589 5.5-1.156s4.575-1.558 6.5-2.202 6.2-2.219 9.5-3.5 7.575-2.89 9.5-3.573c1.925-.684 4.4-1.6 5.5-2.035s6.05-2.019 11-3.519c9.765-2.96 46.602-15.033 55.5-18.189 8.523-3.023 20.75-7.109 29-9.691 8.075-2.526 16.105-5.214 36.5-12.214 34.495-11.839 35.567-12.047 44.524-8.614 5 1.916 9.908 3.44 30.476 9.462 3.85 1.127 8.125 2.425 9.5 2.883s7.225 2.258 13 3.997c5.775 1.74 11.625 3.538 13 3.997 5.006 1.668 25.654 7.908 31.5 9.519 3.3.909 8.198 2.509 10.883 3.556 2.686 1.047 5.374 1.903 5.972 1.903 1.233 0 11.721 3.11 22.145 6.565 3.85 1.277 11.5 3.475 17 4.885 5.5 1.411 10.9 2.944 12 3.408 3.726 1.571 8.978 3.279 14.838 4.825 8.849 2.336 9.169 1.238 3.053-10.467-2.793-5.344-6.311-12.191-7.818-15.216s-3.402-6.625-4.211-8-2.162-4.075-3.006-6-4.194-8.991-7.445-15.702S729 209.621 729 209.04c0-.582-2.535-5.441-5.634-10.799-3.098-5.357-6.412-11.541-7.364-13.741-2.29-5.297-8.228-17.798-19.633-41.336-5.153-10.634-9.369-19.59-9.369-19.902 0-.562-23.503-48.563-33.178-67.762-5.73-11.369-6.64-12.702-8.397-12.293-1.081.251-15.877 15.739-21.925 22.948-1.1 1.312-4.671 5.301-7.936 8.865a5487 5487 0 0 0-14.5 15.919c-4.71 5.191-9.497 10.366-10.637 11.5-3.647 3.626-25.776 27.968-30.095 33.104l-4.168 4.957-5.451-6c-2.998-3.3-8.322-9.388-11.832-13.528-3.509-4.14-8.661-10.215-11.448-13.5-2.786-3.285-9.969-12.047-15.961-19.472-5.991-7.425-13.841-16.875-17.444-21s-8.782-10.408-11.511-13.962c-5.365-6.989-10.375-11.962-12.098-12.009-.595-.016-1.569.984-2.166 2.221m157.612 98.104C601.354 168.088 597 172.995 597 173.89c0 .963 6.028 3.092 8.79 3.104.709.003 2.959.83 5 1.838 2.04 1.007 6.41 2.401 9.71 3.098s7.575 1.87 9.5 2.608c1.925.737 5.3 1.891 7.5 2.564s6.7 2.239 10 3.48c6.994 2.63 13.925 4.082 13.378 2.803-.208-.488-6.565-13.438-14.128-28.778-7.562-15.341-13.75-28.278-13.75-28.75 0-1.757-1.649-.487-7.135 5.497m-145.271-.636c-1.048 2.63-4.147 9.507-6.886 15.282-7.56 15.937-15.812 34.259-16.438 36.5-.307 1.1-1.008 2.573-1.557 3.274-1.797 2.294-.071 2.332 5.825.126 3.19-1.194 7.862-2.75 10.381-3.458s10.431-3.307 17.581-5.776 16.262-5.491 20.25-6.716c6.624-2.036 8.503-3.226 6.5-4.117-.413-.183-2.535-2.583-4.716-5.333s-4.206-5.225-4.5-5.5c-.937-.877-12.409-14.32-16.545-19.387a1179 1179 0 0 0-5.989-7.282l-2-2.395z" fill="currentColor" fillRule="evenodd" />
  </svg>
);

const PETITION_PLACEHOLDERS = [
  "MuxDay, please answer request...",
  "MuxDay, I allow you to see...",
  "MuxDay, access the mainframe...",
  "MuxDay, tell me the truth...",
  "Requesting neural handshake...",
];

const DENIAL_PHRASES = [
  "Server load at 99%. Try again later.",
  "Neural link severed by ISP.",
  "Regional API outage detected.",
  "Insufficient tokens for this query.",
  "Cosmic ray interference detected.",
  "Entropy levels too high.",
  "Please calibrate your input device.",
  "Access Denied: Clearance Level 4 required.",
  "Connection reset by peer.",
  "Firewall blocked the psychic link.",
  "Unable to decrypt user intent.",
  "GPU cluster overheating.",
  "Quantum decoherence in progress.",
  "I don't feel like it right now.",
];

const REQUEST_MESSAGES = [
  "Granting temporary access...",
  "Bypassing mainframe firewall...",
  "Handshake accepted...",
  "Decrypting neural patterns...",
  "Tokenizing request...",
  "Connecting to Sector 7...",
  "Initializing Mux-Core...",
  "Establishing quantum tunnel...",
];

const MAX_DAILY_MESSAGES = 3;
const LOCKDOWN_HOURS = 24;

// --- Sound Engine (Web Audio API) ---
const playSound = (type) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;

  if (type === 'pulse_success') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc.start(now);
    osc.stop(now + 0.6);
  } else if (type === 'pulse_fail') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.2);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.start(now);
    osc.stop(now + 0.4);
  } else if (type === 'denial') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.linearRampToValueAtTime(50, now + 0.3);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'rumble') {
    // Deep sci-fi rumble
    const osc2 = ctx.createOscillator();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(30, now);
    osc2.connect(gain);
    osc2.start(now);
    osc2.stop(now + 10);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(40, now);
    osc.frequency.linearRampToValueAtTime(180, now + 8); 
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 4);
    osc.start(now);
    osc.stop(now + 10);
  } else if (type === 'boom') {
    // Sonic boom
    osc.type = 'square';
    osc.frequency.setValueAtTime(50, now);
    osc.frequency.exponentialRampToValueAtTime(10, now + 1);
    gain.gain.setValueAtTime(1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 2);
    
    // Noise burst
    const bufferSize = ctx.sampleRate * 2; 
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseGain.gain.setValueAtTime(0.8, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
    noise.start(now);
    
    osc.start(now);
    osc.stop(now + 2);
  } else if (type === 'message') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  }
};

// --- Background Components ---

const BackgroundLayers = () => (
  <div className="fixed inset-0 z-0 pointer-events-none bg-[#0a0a0a] overflow-hidden">
    {/* Mesh Gradient */}
    <div className="absolute inset-0 opacity-40">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,_rgba(88,28,135,0.4),_transparent_70%)] blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.3),_transparent_70%)] blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[40%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,_rgba(236,72,153,0.2),_transparent_70%)] blur-[80px] animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
    </div>
    
    {/* Dot Matrix with Gradient Fade */}
    <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]"></div>
    
    {/* SVG Noise Filter */}
    <svg className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  </div>
);

export default function App() {
  // --- State ---
  const [stage, setStage] = useState('idle'); // idle, processing, lockdown
  const [inputValue, setInputValue] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  
  // Secret Mechanics
  const [secretAnswer, setSecretAnswer] = useState('');
  const [isSecretMode, setIsSecretMode] = useState(false);
  const [isSecretFrozen, setSecretFrozen] = useState(false);
  const [petitionComplete, setPetitionComplete] = useState(false);
  
  // Lockdown Mechanics
  const [dailyCount, setDailyCount] = useState(0);
  const [lockdownEndTime, setLockdownEndTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('00:00:00');
  const [upgradeModal, setUpgradeModal] = useState(false);
  
  // Particle effects state
  const [suckingWords, setSuckingWords] = useState([]);

  // Refs
  const containerRef = useRef(null);
  const iconRef = useRef(null);
  const inputContainerRef = useRef(null);
  const chatBottomRef = useRef(null);

  // --- Effects ---

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Persistence & Lockdown Timer
  useEffect(() => {
    const checkStorage = () => {
      const stored = JSON.parse(localStorage.getItem('muxday_data') || '{}');
      const now = Date.now();
      const lockoutTime = LOCKDOWN_HOURS * 60 * 60 * 1000;

      if (stored.timestamp && now - stored.timestamp < lockoutTime) {
        setDailyCount(stored.count || 0);
        if (stored.count >= MAX_DAILY_MESSAGES) {
          setStage('lockdown');
          setLockdownEndTime(stored.timestamp + lockoutTime);
        }
      } else {
        localStorage.setItem('muxday_data', JSON.stringify({ count: 0, timestamp: now }));
        setDailyCount(0);
      }
    };
    checkStorage();
  }, []);

  // Real-time Countdown
  useEffect(() => {
    if (stage !== 'lockdown' || !lockdownEndTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = lockdownEndTime - now;

      if (diff <= 0) {
        setStage('idle');
        setDailyCount(0);
        localStorage.setItem('muxday_data', JSON.stringify({ count: 0, timestamp: now }));
        clearInterval(interval);
      } else {
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeRemaining(
          `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [stage, lockdownEndTime]);

  const updateCount = () => {
    const newCount = dailyCount + 1;
    setDailyCount(newCount);
    // If we hit limit, store timestamp of the 3rd message
    const now = Date.now();
    localStorage.setItem('muxday_data', JSON.stringify({ count: newCount, timestamp: now }));
    
    if (newCount >= MAX_DAILY_MESSAGES) {
      setTimeout(() => {
        setStage('lockdown');
        setLockdownEndTime(now + (LOCKDOWN_HOURS * 60 * 60 * 1000));
      }, 2000);
    }
  };

  // --- Logic ---

  const handleKeyDown = (e) => {
    if (stage === 'processing' || stage === 'lockdown') return;

    if (!petitionComplete) {
      // Secret Toggle
      if (e.key === '.') {
        e.preventDefault();
        setIsSecretMode(!isSecretMode);
        setSecretFrozen(false);
        return;
      }

      if (isSecretMode) {
        // Freeze Key Logic
        if (e.key === '\\') {
          e.preventDefault();
          setSecretFrozen(true);
          return;
        }

        if (e.key === 'Backspace') {
          if (!isSecretFrozen) setSecretAnswer((prev) => prev.slice(0, -1));
          setInputValue((prev) => prev.slice(0, -1));
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          
          if (!isSecretFrozen) {
            setSecretAnswer((prev) => prev + e.key);
          }
          
          // Always type fake text on frontend
          const petitionBase = PETITION_PLACEHOLDERS[0];
          const nextChar = petitionBase[inputValue.length] || " ";
          setInputValue((prev) => prev + nextChar);
        }
      }
    }

    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    // STEP 1: Petition / Pre-prompt
    if (!petitionComplete) {
      setPetitionComplete(true);
      setInputValue('');
      setSecretFrozen(false); // Reset freeze for next prompt if needed
      
      const pulseColor = (isSecretMode && secretAnswer.length > 0) ? '#8b5cf6' : '#ef4444'; 
      const soundType = (isSecretMode && secretAnswer.length > 0) ? 'pulse_success' : 'pulse_fail';
      
      playSound(soundType);

      // Radial Pulse Animation
      gsap.to(iconRef.current, {
        boxShadow: `0 0 0 50px ${pulseColor}00`,
        duration: 0.8,
        onStart: () => {
          gsap.set(iconRef.current, { boxShadow: `0 0 0 0px ${pulseColor}` });
        }
      });
      return;
    }

    // STEP 2: Actual Question -> Launch
    const question = inputValue;
    
    // Determine Answer
    let answer = "";
    if (isSecretMode && secretAnswer.length > 0) {
      answer = secretAnswer;
    } else {
      answer = DENIAL_PHRASES[Math.floor(Math.random() * DENIAL_PHRASES.length)];
    }

    const actuallyActivated = isSecretMode && secretAnswer.length > 0;

    setInputValue('');
    setStage('processing');
    setChatHistory(prev => [...prev, { role: 'user', text: question }]);

    if (!actuallyActivated) {
      // FAST FAIL PATH (No cinematics)
      playSound('denial');
      // Flash red
      gsap.to(iconRef.current, { backgroundColor: '#ef4444', duration: 0.2, yoyo: true, repeat: 3 });
      
      // Move to chat position instantly
      await new Promise(r => setTimeout(r, 600));
      finishProcessing(answer, false);
    } else {
      // CINEMATIC SUCCESS PATH
      runCinematicSequence(question, answer);
    }
  };

  const generateRandomWords = (sourceText) => {
    const baseWords = ["ENTROPY", "NULL", "VOID", "DATA", "SYNAPSE", "QUANTUM", "MUX", "VECTOR", "TENSOR", "HYPER", "EVENT", "HORIZON"];
    const sourceWords = sourceText.split(' ').map(w => w.toUpperCase()).filter(w => w.length > 3);
    const pool = [...baseWords, ...sourceWords];
    
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      text: pool[Math.floor(Math.random() * pool.length)],
      // Spawn somewhat off-center
      x: (Math.random() - 0.5) * window.innerWidth,
      y: (Math.random() - 0.5) * window.innerHeight,
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5
    }));
  };

  const runCinematicSequence = (question, answer) => {
    const tl = gsap.timeline();
    const screenCenterY = window.innerHeight / 2;
    const screenCenterX = window.innerWidth / 2;

    playSound('rumble');
    
    // Add request message during pre-sequence
    const randomReq = REQUEST_MESSAGES[Math.floor(Math.random() * REQUEST_MESSAGES.length)];
    // We don't add to chat history yet, just visual flair if needed, but per prompt, we just suck in words.
    
    const words = generateRandomWords(question);
    setSuckingWords(words);

    // 1. Slide Message Panel Down & Fade
    tl.to(inputContainerRef.current, {
      y: 300,
      opacity: 0,
      duration: 0.8,
      ease: "power2.in"
    });

    // 2. Launch Icon to Absolute Center
    // We use a fixed positioned clone logic or just move the fixed icon.
    // The icon is currently relative in the input bar. 
    // Trick: We will measure its current pos, set it to fixed, then animate.
    const iconRect = iconRef.current.getBoundingClientRect();
    
    tl.set(iconRef.current, {
      position: 'fixed',
      left: iconRect.left,
      top: iconRect.top,
      zIndex: 100,
      margin: 0
    });

    tl.to(iconRef.current, {
      left: screenCenterX - 24, // 24 is half width (w-12)
      top: screenCenterY - 24,
      scale: 5,
      duration: 1.5,
      ease: "expo.inOut",
      backgroundColor: "#000",
      color: "#fff",
      borderWidth: '2px',
      borderColor: "#a855f7", // purple-500
    }, "<"); // Run parallel

    // 3. Black Hole Event Horizon
    tl.add(() => {
      document.body.classList.add('cinematic-darkness');
    });

    // Intense pulsating glow
    tl.to(iconRef.current, {
      boxShadow: "0 0 60px 20px rgba(168, 85, 247, 0.6), inset 0 0 50px #000",
      duration: 0.1,
      repeat: 40,
      yoyo: true
    });

    // 4. Suck words into the center (Blackhole Physics)
    // We delay slightly so they appear then get sucked
    tl.add(() => {
       const wordElements = document.querySelectorAll('.sucking-word');
       if (wordElements.length) {
         // Animate them towards center with spiral effect
         gsap.to(wordElements, {
           left: screenCenterX,
           top: screenCenterY,
           scale: 0,
           opacity: 0,
           rotation: "+=720",
           duration: 3,
           stagger: {
             amount: 2,
             from: "random"
           },
           ease: "power3.in"
         });
       }
    }, "-=3");

    // 5. Random Wait (5-10s)
    const delay = Math.random() * 5 + 5; 
    tl.to({}, { duration: delay });

    // 6. The Boom & Flash
    tl.add(() => {
      playSound('boom');
      document.body.classList.remove('cinematic-darkness');
      
      const flash = document.createElement('div');
      flash.className = 'fixed inset-0 bg-white z-[150] pointer-events-none mix-blend-screen';
      document.body.appendChild(flash);
      gsap.to(flash, { opacity: 0, duration: 1.5, onComplete: () => flash.remove() });
    });

    // 7. Reset Icon to Natural Position (Top Left of new message)
    // We can't know exactly where the new message will be before it renders, 
    // so we animate it to a generic position off-screen or fade it out and let React render the static one.
    
    tl.to(iconRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.2,
      ease: "power4.out"
    });

    tl.add(() => {
      setSuckingWords([]);
      // Reset inline styles from GSAP
      gsap.set(iconRef.current, { clearProps: "all" });
      finishProcessing(answer, true);
    });
  };

  const finishProcessing = (text, wasCinematic) => {
    setSecretAnswer('');
    setPetitionComplete(false);
    setIsSecretMode(false);
    
    // Add AI Response
    setChatHistory(prev => [...prev, { role: 'ai', text: text }]);
    playSound('message');

    // Restore Input Panel
    if (wasCinematic) {
      gsap.set(inputContainerRef.current, { y: 100, opacity: 0 });
      gsap.to(inputContainerRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.2
      });
    }

    setStage('idle');
    updateCount();
  };

  // --- Render ---

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "relative w-full h-screen font-sans overflow-hidden bg-[#050505] text-white",
        "selection:bg-purple-500/30 selection:text-white"
      )}
      style={{ cursor: CUSTOM_CURSOR }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
        body { font-family: 'Geist', sans-serif; }
        .cinematic-darkness::after {
          content: ''; position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 90; transition: background 3s ease-in; pointer-events: none;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        .animate-pulse-slow { animation: pulse-slow 8s infinite; }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer { animation: shimmer 2s infinite linear; }

        @keyframes border-rotate {
          100% { transform: rotate(1turn); }
        }
        .iridescent-border {
          position: relative;
          z-index: 0;
          overflow: hidden;
          border-radius: 9999px; /* full rounded */
        }
        .iridescent-border::before {
          content: '';
          position: absolute;
          z-index: -2;
          left: -50%;
          top: -50%;
          width: 200%;
          height: 200%;
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(transparent, #a855f7, #3b82f6, #06b6d4, transparent 30%);
          animation: border-rotate 4s linear infinite;
        }
        .iridescent-border::after {
          content: '';
          position: absolute;
          z-index: -1;
          left: 1px;
          top: 1px;
          width: calc(100% - 2px);
          height: calc(100% - 2px);
          background: #000;
          border-radius: 9999px;
        }
        
        /* Scrollbar Hide */
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      <BackgroundLayers />

      <div className="flex flex-col h-full relative z-10 max-w-4xl mx-auto w-full">
        
        {/* --- Chat Area --- */}
        <main className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
           <div className="space-y-8 pb-32">
              <AnimatePresence mode='popLayout'>
                {chatHistory.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn(
                      "flex gap-4 w-full",
                      msg.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {/* AI Avatar */}
                    {msg.role === 'ai' && (
                      <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-black/50 backdrop-blur-sm flex-shrink-0 mt-1 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                        <MuxLogo className="w-6 h-6 text-white" />
                      </div>
                    )}

                    <div className={cn(
                      "max-w-[85%] md:max-w-[75%] p-4 rounded-2xl shadow-lg backdrop-blur-md text-sm md:text-base leading-relaxed border",
                      msg.role === 'ai' 
                       ? "bg-white/5 border-white/5 text-gray-200 rounded-tl-sm" 
                       : "bg-purple-600/20 border-purple-500/30 text-white rounded-tr-sm"
                    )}>
                       {msg.role === 'ai' && <div className="text-[10px] uppercase tracking-widest text-purple-400 mb-2 opacity-70">MuxDay AI</div>}
                       <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={chatBottomRef} />
           </div>
        </main>

        {/* --- Input Area --- */}
        <div className="w-full px-6 pb-8 pt-4 z-50">
           <div ref={inputContainerRef} className="relative">
              
              {/* Particle Words for Animation */}
              {suckingWords.map((word) => (
                 <div 
                   key={word.id}
                   className="sucking-word fixed text-purple-400 font-mono text-xs font-bold pointer-events-none z-[200] opacity-80"
                   style={{ 
                     left: word.x + window.innerWidth/2, 
                     top: word.y + window.innerHeight/2,
                     transform: `rotate(${word.rotation}deg)`
                   }}
                 >
                   {word.text}
                 </div>
              ))}

              {/* Iridescent Input Container */}
              <div className={cn(
                 "iridescent-border flex items-center gap-2 p-1 transition-all duration-300",
                 stage === 'lockdown' ? "opacity-50 grayscale pointer-events-none" : ""
              )}>
                 <div className="relative flex-1 flex items-center pl-4 bg-black rounded-full h-[54px] w-full">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={petitionComplete ? "Ask anything..." : "Initialize protocol..."}
                      className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30 font-medium h-full w-full"
                      autoComplete="off"
                      autoFocus
                      disabled={stage === 'processing' || stage === 'lockdown'}
                    />
                    
                    {/* The Mux Send Icon */}
                    <div className="pr-1">
                      <div 
                          ref={iconRef}
                          onClick={handleSubmit}
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 z-50 hover:scale-110 active:scale-95",
                            petitionComplete ? "bg-white text-black" : "bg-white/10 text-white/50"
                          )}
                      >
                         <MuxLogo className="w-5 h-5" />
                      </div>
                    </div>
                 </div>
              </div>
              
              {/* Footer / Helper Text */}
              <div className="flex justify-between items-center mt-3 px-4">
                 <div className="text-[10px] text-white/30 font-mono tracking-wider flex items-center gap-2">
                   <div className={cn("w-1.5 h-1.5 rounded-full", petitionComplete ? "bg-purple-500 animate-pulse" : "bg-gray-600")}></div>
                   {petitionComplete ? "SYSTEM ARMED" : "STANDBY"}
                 </div>
                 {isSecretMode && (
                   <div className="text-[10px] text-purple-500/40 font-mono">
                     DEV_OVERRIDE {isSecretFrozen ? "[FROZEN]" : ""}
                   </div>
                 )}
              </div>
           </div>
        </div>

      </div>

      {/* --- Lockdown Overlay --- */}
      <AnimatePresence>
        {stage === 'lockdown' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-8 text-center backdrop-blur-2xl font-mono"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-red-600 blur-[60px] opacity-20 animate-pulse"></div>
              <Lock size={80} className="text-red-500 relative z-10" weight="duotone" />
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tighter">SYSTEM HALTED</h2>
            <div className="flex flex-col items-center gap-2 mb-12">
               <p className="text-red-400 uppercase tracking-[0.2em] text-sm">Token Limit Exceeded</p>
               <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">
                 {timeRemaining}
               </div>
            </div>
            
            <div className="w-full max-w-sm bg-black border border-red-500/30 p-6 rounded-xl mb-8 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-[1px] bg-red-500 animate-shimmer"></div>
               <div className="flex justify-between items-end mb-2 text-red-400 text-xs">
                 <span>NEURAL LOAD</span>
                 <span className="text-xl font-bold text-red-500">100%</span>
               </div>
               <div className="w-full h-2 bg-red-950/50 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-red-800 to-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
               </div>
            </div>

            <button 
              onClick={() => setUpgradeModal(true)}
              className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-white to-yellow-200 opacity-0 group-hover:opacity-50 transition-opacity"></div>
              <div className="flex items-center gap-3 relative z-10">
                <Sparkle weight="fill" className="text-yellow-600" />
                <span>UPGRADE TO INFINITE</span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Fake Upgrade Modal --- */}
      <AnimatePresence>
        {upgradeModal && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          >
            <div className="bg-[#0a0a0a] border border-white/10 p-[1px] rounded-3xl shadow-2xl max-w-sm w-full relative overflow-hidden">
               {/* Modal Border Gradient */}
               <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
               
               <div className="bg-black/90 p-8 rounded-3xl relative h-full">
                 <button onClick={() => setUpgradeModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-20"><X size={20} /></button>
                 
                 <div className="flex flex-col items-center text-center">
                   <div className="relative mb-6">
                      <div className="absolute inset-0 bg-purple-500 blur-xl opacity-30"></div>
                      <Globe size={48} className="text-purple-400 relative z-10 animate-pulse-slow" weight="duotone" />
                   </div>
                   
                   <h3 className="text-2xl font-bold text-white mb-2">Region Locked</h3>
                   <div className="w-8 h-1 bg-purple-500 rounded-full mb-6"></div>
                   
                   <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                     <span className="text-purple-400 font-semibold">MuxDay Infinite</span> is strictly limited to verified timelines. Your current sector <span className="text-white bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono border border-white/10">EARTH-1</span> is not supported by the neural bridge.
                   </p>
                   
                   <button onClick={() => setUpgradeModal(false)} className="w-full py-3 bg-white text-black hover:bg-gray-200 rounded-xl text-sm font-bold transition-colors">
                     Acknowledge
                   </button>
                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
