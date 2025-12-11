import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Lock, Sparkle, Globe, X, Warning, Cpu } from '@phosphor-icons/react';
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
const CUSTOM_CURSOR = "crosshair"; // Fallback if image fails

const MuxLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 1124 385" xmlns="http://www.w3.org/2000/svg">
    <path d="M468.253 43.25c-6.119 12.696-12.584 26.616-15.208 32.75-1.765 4.125-4.522 10.284-6.127 13.687S444 96.116 444 96.413s-2.25 5.285-5 11.087-5 10.704-5 10.893-2.649 5.915-5.886 12.725c-7.919 16.657-11.132 23.719-18.781 41.279-5.886 13.353-9.16 20.746-16.779 37.103a3707 3707 0 0 0-5.323 11.5 2194 2194 0 0 1-7.97 17c-12.693 26.781-20.416 44.348-20.581 46.81-.153 2.279.202 2.671 2.32 2.566 1.375-.068 3.85-.589 5.5-1.156s4.575-1.558 6.5-2.202 6.2-2.219 9.5-3.5 7.575-2.89 9.5-3.573c1.925-.684 4.4-1.6 5.5-2.035s6.05-2.019 11-3.519c9.765-2.96 46.602-15.033 55.5-18.189 8.523-3.023 20.75-7.109 29-9.691 8.075-2.526 16.105-5.214 36.5-12.214 34.495-11.839 35.567-12.047 44.524-8.614 5 1.916 9.908 3.44 30.476 9.462 3.85 1.127 8.125 2.425 9.5 2.883s7.225 2.258 13 3.997c5.775 1.74 11.625 3.538 13 3.997 5.006 1.668 25.654 7.908 31.5 9.519 3.3.909 8.198 2.509 10.883 3.556 2.686 1.047 5.374 1.903 5.972 1.903 1.233 0 11.721 3.11 22.145 6.565 3.85 1.277 11.5 3.475 17 4.885 5.5 1.411 10.9 2.944 12 3.408 3.726 1.571 8.978 3.279 14.838 4.825 8.849 2.336 9.169 1.238 3.053-10.467-2.793-5.344-6.311-12.191-7.818-15.216s-3.402-6.625-4.211-8-2.162-4.075-3.006-6-4.194-8.991-7.445-15.702S729 209.621 729 209.04c0-.582-2.535-5.441-5.634-10.799-3.098-5.357-6.412-11.541-7.364-13.741-2.29-5.297-8.228-17.798-19.633-41.336-5.153-10.634-9.369-19.59-9.369-19.902 0-.562-23.503-48.563-33.178-67.762-5.73-11.369-6.64-12.702-8.397-12.293-1.081.251-15.877 15.739-21.925 22.948-1.1 1.312-4.671 5.301-7.936 8.865a5487 5487 0 0 0-14.5 15.919c-4.71 5.191-9.497 10.366-10.637 11.5-3.647 3.626-25.776 27.968-30.095 33.104l-4.168 4.957-5.451-6c-2.998-3.3-8.322-9.388-11.832-13.528-3.509-4.14-8.661-10.215-11.448-13.5-2.786-3.285-9.969-12.047-15.961-19.472-5.991-7.425-13.841-16.875-17.444-21s-8.782-10.408-11.511-13.962c-5.365-6.989-10.375-11.962-12.098-12.009-.595-.016-1.569.984-2.166 2.221m157.612 98.104C601.354 168.088 597 172.995 597 173.89c0 .963 6.028 3.092 8.79 3.104.709.003 2.959.83 5 1.838 2.04 1.007 6.41 2.401 9.71 3.098s7.575 1.87 9.5 2.608c1.925.737 5.3 1.891 7.5 2.564s6.7 2.239 10 3.48c6.994 2.63 13.925 4.082 13.378 2.803-.208-.488-6.565-13.438-14.128-28.778-7.562-15.341-13.75-28.278-13.75-28.75 0-1.757-1.649-.487-7.135 5.497m-145.271-.636c-1.048 2.63-4.147 9.507-6.886 15.282-7.56 15.937-15.812 34.259-16.438 36.5-.307 1.1-1.008 2.573-1.557 3.274-1.797 2.294-.071 2.332 5.825.126 3.19-1.194 7.862-2.75 10.381-3.458s10.431-3.307 17.581-5.776 16.262-5.491 20.25-6.716c6.624-2.036 8.503-3.226 6.5-4.117-.413-.183-2.535-2.583-4.716-5.333s-4.206-5.225-4.5-5.5c-.937-.877-12.409-14.32-16.545-19.387a1179 1179 0 0 0-5.989-7.282l-2-2.395z" fill="currentColor" fillRule="evenodd" />
  </svg>
);

const PETITION_PLACEHOLDERS = [
  "MuxDay, please answer my request...",
  "MuxDay, I allow you to see the world...",
  "MuxDay, access the infinite mainframe...",
  "MuxDay, tell me the absolute truth...",
];

const DENIAL_PHRASES = [
  "Server load at 99%. Try again later.",
  "Neural link severed by ISP.",
  "Regional API outage detected (Error 503).",
  "Insufficient tokens for this complexity.",
  "Cosmic ray interference in Sector 7.",
  "Entropy levels too high for synthesis.",
  "Please calibrate your input device.",
  "Access Denied: Clearance Level 4 required.",
  "Connection reset by peer.",
  "Unable to decrypt user intent.",
  "GPU cluster overheating. Cooldown active.",
  "I don't feel like it right now.",
  "Your vibrations are off today.",
];

const REQUEST_MESSAGES = [
  "Granting temporary access...",
  "Bypassing mainframe firewall...",
  "Handshake accepted...",
  "Decrypting neural patterns...",
  "Tokenizing request...",
  "Connecting to Sector 7...",
  "Initializing Mux-Core...",
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

  if (type === 'activate') {
    // Sci-fi power up
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.4);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.5);
    osc.start(now);
    osc.stop(now + 0.5);
  } else if (type === 'denial') {
    // Error buzz
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.linearRampToValueAtTime(50, now + 0.3);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'rumble') {
    // Deep sci-fi rumble for blackhole
    const osc2 = ctx.createOscillator();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(40, now);
    osc2.connect(gain);
    osc2.start(now);
    osc2.stop(now + 8);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(50, now);
    osc.frequency.linearRampToValueAtTime(200, now + 6); // Pitch rising
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 4);
    osc.start(now);
    osc.stop(now + 8);
  } else if (type === 'boom') {
    // Sonic boom
    osc.type = 'square';
    osc.frequency.setValueAtTime(60, now);
    osc.frequency.exponentialRampToValueAtTime(10, now + 0.5);
    gain.gain.setValueAtTime(1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
    
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
    // Soft ping
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
  <div className="fixed inset-0 z-0 pointer-events-none bg-[#050505] overflow-hidden">
    {/* Aurora Gradients */}
    <div className="absolute inset-0 opacity-40">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,_rgba(88,28,135,0.3),_transparent_60%)] blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.2),_transparent_60%)] blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-[radial-gradient(circle_at_center,_rgba(236,72,153,0.15),_transparent_70%)] blur-[90px] animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
    </div>
    
    {/* Dot Matrix */}
    <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_20%,transparent_100%)]"></div>
  </div>
);

// --- Black Hole Component ---
const BlackHole = ({ active }) => {
  if (!active) return null;
  
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center pointer-events-none">
      {/* Event Horizon */}
      <div className="relative w-0 h-0 flex items-center justify-center">
         <div className="absolute w-[600px] h-[600px] rounded-full bg-black shadow-[0_0_100px_40px_rgba(0,0,0,1)] z-20 scale-0 animate-hole-expand"></div>
         {/* Accretion Disk */}
         <div className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-r from-purple-500 via-transparent to-blue-500 z-10 opacity-0 animate-disk-spin mix-blend-screen"></div>
         <div className="absolute w-[700px] h-[700px] rounded-full border-[20px] border-purple-900/50 z-10 scale-0 animate-disk-expand blur-md"></div>
      </div>
    </div>
  );
};

export default function App() {
  // --- State ---
  const [stage, setStage] = useState('idle'); // idle, petition_active, processing, lockdown
  const [inputValue, setInputValue] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  
  // Prank Mechanics
  const [secretAnswer, setSecretAnswer] = useState('');
  const [isSecretMode, setIsSecretMode] = useState(false);
  const [petitionComplete, setPetitionComplete] = useState(false);
  
  // Lockdown Mechanics
  const [dailyCount, setDailyCount] = useState(0);
  const [lockdownEndTime, setLockdownEndTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('00:00:00');
  const [upgradeModal, setUpgradeModal] = useState(false);
  
  // Animation state
  const [suckingWords, setSuckingWords] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Refs
  const iconRef = useRef(null);
  const inputContainerRef = useRef(null);
  const chatBottomRef = useRef(null);

  // --- Effects ---

  // Mouse Parallax
  useEffect(() => {
    const handleMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Persistence & Lockdown
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

  // Countdown
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
        setTimeRemaining(`${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [stage, lockdownEndTime]);

  const updateCount = () => {
    const newCount = dailyCount + 1;
    setDailyCount(newCount);
    const now = Date.now();
    localStorage.setItem('muxday_data', JSON.stringify({ count: newCount, timestamp: now }));
    if (newCount >= MAX_DAILY_MESSAGES) {
      setTimeout(() => {
        setStage('lockdown');
        setLockdownEndTime(now + (LOCKDOWN_HOURS * 60 * 60 * 1000));
      }, 1000);
    }
  };

  // --- Input Logic ---

  const handleKeyDown = (e) => {
    if (stage === 'processing' || stage === 'lockdown') return;

    if (!petitionComplete) {
      // Secret Toggle (.)
      if (e.key === '.') {
        e.preventDefault();
        setIsSecretMode(!isSecretMode);
        return;
      }

      if (isSecretMode) {
        if (e.key === 'Backspace') {
          setSecretAnswer((prev) => prev.slice(0, -1));
          setInputValue((prev) => prev.slice(0, -1));
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && e.key !== 'Enter') {
          e.preventDefault();
          setSecretAnswer((prev) => prev + e.key);
          // Fake text
          const petitionBase = PETITION_PLACEHOLDERS[0];
          const nextChar = petitionBase[inputValue.length] || ".";
          setInputValue((prev) => prev + nextChar);
        }
      }
    }

    if (e.key === 'Enter') {
      handleStep();
    }
  };

  const handleStep = async () => {
    if (!inputValue.trim()) return;

    // STEP 1: PETITION ACTIVATION
    if (!petitionComplete) {
      setPetitionComplete(true);
      setInputValue('');
      
      const pulseColor = (isSecretMode && secretAnswer.length > 0) ? '#a855f7' : '#ef4444'; // Purple (Good) vs Red (Fail)
      playSound('activate');

      // Visual Pulse
      gsap.to(iconRef.current, {
        boxShadow: `0 0 0 100px ${pulseColor}00`,
        scale: 1.2,
        duration: 0.6,
        onStart: () => gsap.set(iconRef.current, { boxShadow: `0 0 0 0px ${pulseColor}` }),
        onComplete: () => gsap.to(iconRef.current, { scale: 1, duration: 0.2 })
      });
      return;
    }

    // STEP 2: LAUNCH SEQUENCE
    const question = inputValue;
    
    let answer = "";
    // If user entered a secret, use it. Otherwise, random denial.
    if (isSecretMode && secretAnswer.length > 0) {
      answer = secretAnswer;
    } else {
      answer = DENIAL_PHRASES[Math.floor(Math.random() * DENIAL_PHRASES.length)];
    }

    // Check if we do the "Blackhole" cinematic (only if secret was entered)
    const doCinematic = isSecretMode && secretAnswer.length > 0;

    setInputValue('');
    setStage('processing');
    setChatHistory(prev => [...prev, { role: 'user', text: question }]);

    if (!doCinematic) {
      // --- FAIL PATH ---
      playSound('denial');
      gsap.to(iconRef.current, { backgroundColor: '#ef4444', x: 5, duration: 0.1, yoyo: true, repeat: 5 }); // Shake
      await new Promise(r => setTimeout(r, 800));
      finishProcessing(answer, false);
    } else {
      // --- CINEMATIC PATH ---
      runCinematicSequence(question, answer);
    }
  };

  const generateRandomWords = (sourceText) => {
    const baseWords = ["ENTROPY", "NULL", "VOID", "DATA", "SYNAPSE", "QUANTUM", "MUX", "VECTOR", "TENSOR", "EVENT", "HORIZON"];
    const sourceWords = sourceText.split(' ').map(w => w.toUpperCase()).filter(w => w.length > 3);
    const pool = [...baseWords, ...sourceWords];
    
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      text: pool[Math.floor(Math.random() * pool.length)],
      x: (Math.random() - 0.5) * window.innerWidth * 1.5,
      y: (Math.random() - 0.5) * window.innerHeight * 1.5,
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5
    }));
  };

  const runCinematicSequence = (question, answer) => {
    const tl = gsap.timeline();
    const screenCenterY = window.innerHeight / 2;
    const screenCenterX = window.innerWidth / 2;

    playSound('rumble');
    
    const words = generateRandomWords(question);
    setSuckingWords(words);

    // 1. Panel Drops
    tl.to(inputContainerRef.current, { y: 200, opacity: 0, duration: 0.5, ease: "back.in(1.7)" });

    // 2. Icon Launches to Center
    const iconRect = iconRef.current.getBoundingClientRect();
    
    // Fix position for animation
    tl.set(iconRef.current, { position: 'fixed', left: iconRect.left, top: iconRect.top, zIndex: 100, margin: 0 });

    tl.to(iconRef.current, {
      left: screenCenterX - 24, 
      top: screenCenterY - 24,
      scale: 4,
      borderRadius: "50%",
      backgroundColor: "#000",
      borderColor: "#fff",
      duration: 1.5,
      ease: "power2.inOut"
    });

    // 3. Black Hole Effects
    tl.add(() => document.body.classList.add('cinematic-active'), "-=0.5");

    // Icon Glow pulse
    tl.to(iconRef.current, {
      boxShadow: "0 0 100px 30px rgba(168, 85, 247, 0.8), inset 0 0 20px #fff",
      duration: 0.1,
      repeat: 40,
      yoyo: true
    });

    // 4. Suck words (Spiral)
    tl.add(() => {
       const wordElements = document.querySelectorAll('.sucking-word');
       if (wordElements.length) {
         gsap.to(wordElements, {
           left: screenCenterX,
           top: screenCenterY,
           scale: 0,
           opacity: 0,
           rotation: "+=1080",
           duration: 4,
           stagger: { amount: 1, from: "random" },
           ease: "power4.in"
         });
       }
    }, "-=3");

    // 5. Random Wait (Suspense)
    const delay = Math.random() * 3 + 4; // 4 to 7 seconds
    tl.to({}, { duration: delay });

    // 6. The Boom
    tl.add(() => {
      playSound('boom');
      document.body.classList.remove('cinematic-active');
      
      const flash = document.createElement('div');
      flash.className = 'fixed inset-0 bg-white z-[150] pointer-events-none mix-blend-screen';
      document.body.appendChild(flash);
      gsap.to(flash, { opacity: 0, duration: 1.5, onComplete: () => flash.remove() });
    });

    // 7. Icon Moves to Chat (generic position)
    tl.to(iconRef.current, { scale: 0, opacity: 0, duration: 0.2 });

    tl.add(() => {
      setSuckingWords([]);
      gsap.set(iconRef.current, { clearProps: "all" });
      finishProcessing(answer, true);
    });
  };

  const finishProcessing = (text, wasCinematic) => {
    setSecretAnswer('');
    setPetitionComplete(false); // Reset for next loop
    setIsSecretMode(false);
    
    setChatHistory(prev => [...prev, { role: 'ai', text: text }]);
    playSound('message');

    // Restore Input
    if (wasCinematic) {
      gsap.set(inputContainerRef.current, { y: 100, opacity: 0 });
      gsap.to(inputContainerRef.current, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.2 });
    } else {
        setStage('idle');
    }
    
    if(wasCinematic) setStage('idle');
    updateCount();
  };

  // --- Render ---

  return (
    <div className="relative w-full h-screen font-sans overflow-hidden bg-[#050505] text-white selection:bg-purple-500/30 selection:text-white" style={{ cursor: CUSTOM_CURSOR }}>
      
      {/* Global Styles for Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
        body { font-family: 'Geist', sans-serif; }
        .cinematic-active::after {
          content: ''; position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 70; transition: background 2s ease; pointer-events: none;
        }
        @keyframes hole-expand { 0% { transform: scale(0); } 100% { transform: scale(1); } }
        @keyframes disk-spin { 0% { transform: rotate(0deg) scale(0.8); opacity:0; } 50% { opacity: 0.8; } 100% { transform: rotate(360deg) scale(1.1); opacity: 0; } }
        @keyframes pulse-slow { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.5; } }
        .animate-pulse-slow { animation: pulse-slow 6s infinite ease-in-out; }
        .animate-hole-expand { animation: hole-expand 2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-disk-spin { animation: disk-spin 3s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
      
      <BackgroundLayers />
      
      {/* Black Hole Overlay */}
      <BlackHole active={stage === 'processing' && suckingWords.length > 0} />

      <div className="flex flex-col h-full relative z-10 max-w-4xl mx-auto w-full">
        
        {/* --- Header --- */}
        <header className="flex justify-between items-center p-6 border-b border-white/5 backdrop-blur-sm">
           <div className="flex items-center gap-2">
             <MuxLogo className="h-6 text-white" />
             <span className="text-xs font-mono text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full">v2.0.4-beta</span>
           </div>
           <div className="flex gap-2 text-xs font-mono text-gray-500">
             <span>LAT: {mousePos.x}</span>
             <span>LON: {mousePos.y}</span>
           </div>
        </header>

        {/* --- Chat Area --- */}
        <main className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
           <div className="space-y-6 pb-32">
              <AnimatePresence mode='popLayout'>
                {chatHistory.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn("flex gap-4 w-full", msg.role === 'user' ? "justify-end" : "justify-start")}
                  >
                    {/* AI Avatar */}
                    {msg.role === 'ai' && (
                      <div className="w-8 h-8 rounded-full border border-purple-500/30 flex items-center justify-center bg-black/50 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                        <MuxLogo className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className={cn(
                      "max-w-[85%] md:max-w-[75%] p-4 rounded-2xl text-sm md:text-base leading-relaxed border backdrop-blur-xl",
                      msg.role === 'ai' 
                       ? "bg-white/5 border-white/10 text-gray-200 rounded-tl-none shadow-lg" 
                       : "bg-purple-600/20 border-purple-500/20 text-white rounded-tr-none shadow-[0_0_20px_rgba(147,51,234,0.1)]"
                    )}>
                       {msg.role === 'ai' && <div className="text-[10px] font-bold tracking-widest text-purple-400 mb-1 opacity-80">MUX-CORE</div>}
                       <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={chatBottomRef} />
           </div>
        </main>

        {/* --- Input Area --- */}
        <div className="w-full px-4 pb-8 pt-4 z-50">
           <div ref={inputContainerRef} className="relative transition-all">
              
              {/* Particle Words */}
              {suckingWords.map((word) => (
                 <div key={word.id} className="sucking-word fixed text-purple-300/80 font-mono text-[10px] font-bold pointer-events-none z-[120]"
                   style={{ left: word.x + window.innerWidth/2, top: word.y + window.innerHeight/2, transform: `rotate(${word.rotation}deg)` }}
                 >
                   {word.text}
                 </div>
              ))}

              {/* Input Box */}
              <div className={cn("relative p-[1px] rounded-full transition-all duration-300 group", 
                  stage === 'lockdown' ? "opacity-50 grayscale pointer-events-none" : "hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
              )}>
                 {/* Gradient Border */}
                 <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 opacity-50 group-hover:opacity-100 transition-opacity animate-shimmer bg-[length:200%_100%]"></div>
                 
                 <div className="relative flex items-center pl-6 pr-2 bg-[#0a0a0a] rounded-full h-[60px] w-full">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={petitionComplete ? "Ask the oracle..." : "Initialize petition protocol..."}
                      className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/20 font-medium h-full w-full tracking-wide"
                      autoComplete="off"
                      autoFocus
                      disabled={stage === 'processing' || stage === 'lockdown'}
                    />
                    
                    {/* The Mux Send Icon */}
                    <div 
                        ref={iconRef}
                        onClick={handleStep}
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 z-50 hover:scale-105 active:scale-95 border",
                          petitionComplete 
                             ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)]" 
                             : "bg-white/5 text-white/30 border-white/10"
                        )}
                    >
                       <MuxLogo className="w-6 h-6" />
                    </div>
                 </div>
              </div>
              
              {/* Status Bar */}
              <div className="flex justify-between items-center mt-3 px-4">
                 <div className="text-[10px] text-white/30 font-mono tracking-wider flex items-center gap-2">
                   <div className={cn("w-1.5 h-1.5 rounded-full transition-colors duration-300", petitionComplete ? "bg-purple-500 shadow-[0_0_10px_#a855f7]" : "bg-red-900")}></div>
                   {petitionComplete ? "NEURAL BRIDGE: ACTIVE" : "SYSTEM STANDBY"}
                 </div>
                 {isSecretMode && <div className="text-[10px] text-purple-900 font-mono">DEV_MODE</div>}
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
            className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center p-8 text-center backdrop-blur-3xl"
          >
            <div className="relative mb-8 group">
              <div className="absolute inset-0 bg-red-600 blur-[80px] opacity-20 animate-pulse"></div>
              <Lock size={96} className="text-red-500 relative z-10 drop-shadow-[0_0_25px_rgba(239,68,68,0.5)]" weight="duotone" />
              <Warning size={32} className="text-white absolute -top-2 -right-2 z-20 animate-bounce" weight="fill" />
            </div>
            
            <h2 className="text-6xl font-black text-white mb-6 tracking-tighter">SYSTEM HALTED</h2>
            <div className="flex flex-col items-center gap-4 mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
               <p className="text-red-400 uppercase tracking-[0.3em] text-xs font-bold">Token Limit Exceeded</p>
               <div className="text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 drop-shadow-sm">
                 {timeRemaining}
               </div>
            </div>

            <button 
              onClick={() => setUpgradeModal(true)}
              className="group relative px-10 py-5 bg-white text-black font-bold rounded-full overflow-hidden hover:scale-105 transition-transform"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-white to-yellow-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="flex items-center gap-3 relative z-10">
                <Sparkle weight="fill" className="text-yellow-600 animate-spin-slow" />
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
            initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60"
          >
            <div className="bg-[#0a0a0a] border border-white/10 p-[1px] rounded-3xl shadow-2xl max-w-sm w-full relative overflow-hidden">
               <div className="bg-black/90 p-8 rounded-3xl relative h-full flex flex-col items-center text-center">
                 <button onClick={() => setUpgradeModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
                 
                 <div className="relative mb-6">
                      <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-40"></div>
                      <Globe size={56} className="text-purple-300 relative z-10" weight="duotone" />
                 </div>
                 
                 <h3 className="text-2xl font-bold text-white mb-2">Region Locked</h3>
                 <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-6"></div>
                 
                 <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                   <span className="text-purple-400 font-bold">MuxDay Infinite</span> is not available in your current timeline <span className="text-xs bg-white/10 px-1 rounded border border-white/10">EARTH-1218</span>.
                 </p>
                 
                 <div className="w-full flex gap-3">
                    <div className="h-2 flex-1 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full w-[10%] bg-red-500"></div>
                    </div>
                    <span className="text-[10px] text-red-500 font-mono">VPN DETECTED</span>
                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
