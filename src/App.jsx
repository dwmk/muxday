import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { CaretRight, Lock, CircleNotch, Sparkle, Globe } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

gsap.registerPlugin(MotionPathPlugin);

// --- Utility: Tailwind Merger ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Constants & Config ---
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
  "I am currently updating my neural weights.",
  "Access Denied: Clearance Level 4 required.",
  "Connection reset by peer.",
  "Firewall blocked the psychic link.",
  "Unable to decrypt user intent.",
  "GPU cluster overheating.",
  "Quantum decoherence in progress.",
  "I don't feel like it right now.",
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

  if (type === 'pulse') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    osc.start(now);
    osc.stop(now + 0.5);
  } else if (type === 'denial') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.linearRampToValueAtTime(50, now + 0.3);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'rumble') {
    // Low frequency rumble for black hole
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(50, now);
    osc.frequency.linearRampToValueAtTime(150, now + 8); // rising tension
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 4);
    osc.start(now);
    osc.stop(now + 10);
  } else if (type === 'boom') {
    // Sonic boom
    osc.type = 'square';
    osc.frequency.setValueAtTime(50, now);
    osc.frequency.exponentialRampToValueAtTime(20, now + 1);
    gain.gain.setValueAtTime(1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 2);
    
    // Noise burst
    const bufferSize = ctx.sampleRate * 2; 
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
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


// --- Components ---

const MouseGlow = () => {
  const mouse = useRef({ x: 0, y: 0 });
  const circle = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (circle.current) {
        gsap.to(circle.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.8,
          ease: "power2.out",
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={circle}
      className="pointer-events-none fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.08)_0%,rgba(0,0,0,0)_60%)] z-0 mix-blend-screen"
    />
  );
};

const GridBackground = () => (
  <div className="fixed inset-0 z-[-1] pointer-events-none bg-black overflow-hidden">
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150"></div>
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
  </div>
);

export default function App() {
  // State
  const [stage, setStage] = useState('idle'); // idle, petition_entered, processing, lockdown
  const [inputValue, setInputValue] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'MuxDay v4.0 Online. Initializing heuristic core...' },
    { role: 'ai', text: 'Ready. Please enter the petition phrase to calibrate connection.' }
  ]);
  const [secretAnswer, setSecretAnswer] = useState('');
  const [isSecretMode, setIsSecretMode] = useState(false);
  const [petitionComplete, setPetitionComplete] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);
  const [upgradeModal, setUpgradeModal] = useState(false);

  // Refs for Animations
  const containerRef = useRef(null);
  const iconRef = useRef(null);
  const inputContainerRef = useRef(null);

  // Load Persisted Data
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('muxday_data') || '{}');
    const now = Date.now();
    if (stored.timestamp && now - stored.timestamp < LOCKDOWN_HOURS * 60 * 60 * 1000) {
      setDailyCount(stored.count || 0);
      if (stored.count >= MAX_DAILY_MESSAGES) setStage('lockdown');
    } else {
      // Reset
      localStorage.setItem('muxday_data', JSON.stringify({ count: 0, timestamp: now }));
      setDailyCount(0);
    }
  }, []);

  const updateCount = () => {
    const newCount = dailyCount + 1;
    setDailyCount(newCount);
    localStorage.setItem('muxday_data', JSON.stringify({ count: newCount, timestamp: Date.now() }));
    if (newCount >= MAX_DAILY_MESSAGES) {
      setTimeout(() => setStage('lockdown'), 2000);
    }
  };

  // --- Input Handling ---

  const handleKeyDown = (e) => {
    if (stage === 'processing' || stage === 'lockdown') return;

    // Secret Trigger Logic
    if (!petitionComplete) {
      if (e.key === '.') {
        e.preventDefault();
        setIsSecretMode(!isSecretMode);
        return;
      }

      if (isSecretMode) {
        if (e.key === 'Backspace') {
          setSecretAnswer((prev) => prev.slice(0, -1));
          setInputValue((prev) => prev.slice(0, -1));
        } else if (e.key.length === 1) {
          e.preventDefault();
          setSecretAnswer((prev) => prev + e.key);
          // Fake text generator
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

    // STEP 1: Petition Entered
    if (!petitionComplete) {
      setPetitionComplete(true);
      setInputValue('');
      
      // Visual Feedback
      const pulseColor = isSecretMode ? '#8b5cf6' : '#ef4444'; // Purple (Success) vs Red (Fail)
      playSound('pulse');

      // Animate Radial Pulse
      gsap.to(iconRef.current, {
        boxShadow: `0 0 0 50px ${pulseColor}00`,
        duration: 0.8,
        onStart: () => {
          gsap.set(iconRef.current, { boxShadow: `0 0 0 0px ${pulseColor}` });
        }
      });

      return;
    }

    // STEP 2: Question Entered
    // The Cinematic Sequence
    const question = inputValue;
    const answer = isSecretMode && secretAnswer ? secretAnswer : DENIAL_PHRASES[Math.floor(Math.random() * DENIAL_PHRASES.length)];
    const actuallyActivated = isSecretMode && secretAnswer.length > 0;

    setInputValue('');
    setStage('processing');

    // Add user question to chat immediately
    setChatHistory(prev => [...prev, { role: 'user', text: question }]);

    if (!actuallyActivated) {
      // FAST FAIL PATH
      playSound('denial');
      await new Promise(r => setTimeout(r, 600)); // slight delay
      finishProcessing(answer, false);
    } else {
      // CINEMATIC PATH
      runCinematicSequence(question, answer);
    }
  };

  const runCinematicSequence = (question, answer) => {
    const tl = gsap.timeline();
    const screenCenterY = window.innerHeight / 2;
    const screenCenterX = window.innerWidth / 2;

    playSound('rumble');

    // 1. Hide Input Bar
    tl.to(inputContainerRef.current, {
      y: 200,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in"
    });

    // 2. Move Icon to Center
    // We need to calculate position relative to viewport
    const iconRect = iconRef.current.getBoundingClientRect();
    const deltaX = screenCenterX - (iconRect.left + iconRect.width/2);
    const deltaY = screenCenterY - (iconRect.top + iconRect.height/2);

    tl.to(iconRef.current, {
      x: deltaX,
      y: deltaY,
      scale: 3,
      duration: 1.5,
      ease: "expo.inOut",
      backgroundColor: "#000",
      borderColor: "#fff"
    }, "-=0.2");

    // 3. Black Hole Effects
    tl.add(() => {
       // Trigger sucking particle effects here (simulated via React state or direct DOM)
       document.body.classList.add('dimmed');
    });

    tl.to(iconRef.current, {
      boxShadow: "0 0 100px 20px rgba(139, 92, 246, 0.8), inset 0 0 60px rgba(0,0,0,1)",
      duration: 4,
      repeat: -1,
      yoyo: true
    });

    // 4. Random Delay & Intensity
    const delay = Math.random() * 5 + 3; // 3 to 8 seconds

    tl.to({}, { duration: delay });

    // 5. The Boom
    tl.add(() => {
      playSound('boom');
      document.body.classList.remove('dimmed');
      // Flash
      const flash = document.createElement('div');
      flash.className = 'fixed inset-0 bg-white z-[100] pointer-events-none';
      document.body.appendChild(flash);
      gsap.to(flash, { opacity: 0, duration: 1.5, onComplete: () => flash.remove() });
    });

    // 6. Reset
    tl.to(iconRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.2, // Very fast return
      ease: "power4.out"
    });

    tl.add(() => {
      finishProcessing(answer, true);
    });
  };

  const finishProcessing = (text, wasCinematic) => {
    // Reset state variables
    setSecretAnswer('');
    setPetitionComplete(false);
    setIsSecretMode(false);
    
    // Add AI Response
    setChatHistory(prev => [...prev, { role: 'ai', text: text }]);
    playSound('message');

    // Bring input back
    if (wasCinematic) {
      gsap.to(inputContainerRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        delay: 0.2
      });
    }

    setStage('idle');
    updateCount();
  };

  // --- Render Helpers ---

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#050505] text-white font-sans overflow-hidden selection:bg-purple-500/30">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
        body { font-family: 'Geist', sans-serif; }
        .dimmed::after {
          content: ''; position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 40; transition: background 2s; pointer-events: none;
        }
        .text-glow { text-shadow: 0 0 20px rgba(255,255,255,0.5); }
      `}</style>
      
      <MouseGlow />
      <GridBackground />

      {/* --- Main UI Layer --- */}
      <div className="relative z-10 w-full h-full flex flex-col max-w-5xl mx-auto p-4 md:p-8">
        
        {/* Header */}
        <header className="flex justify-between items-center py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-400 animate-pulse"></div>
            <h1 className="text-xl font-bold tracking-tighter">MuxDay<span className="text-xs text-white/40 ml-1 font-mono">v4.0.1</span></h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-white/40">
            <span className="hidden md:inline-block">LAT: 34.0522 N</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> ONLINE</span>
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden py-8 space-y-6 scrollbar-hide">
           <AnimatePresence>
             {chatHistory.map((msg, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, x: msg.role === 'ai' ? -20 : 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className={cn(
                   "flex w-full",
                   msg.role === 'ai' ? "justify-start" : "justify-end"
                 )}
               >
                 <div className={cn(
                   "max-w-[80%] md:max-w-[60%] p-4 rounded-2xl backdrop-blur-md border border-white/5 shadow-xl",
                   msg.role === 'ai' 
                    ? "bg-white/5 text-purple-100 rounded-tl-none" 
                    : "bg-purple-600/20 text-white border-purple-500/30 rounded-tr-none"
                 )}>
                   {msg.role === 'ai' && <div className="text-[10px] uppercase tracking-widest text-purple-400 mb-1">MuxDay AI</div>}
                   <p className="leading-relaxed">{msg.text}</p>
                 </div>
               </motion.div>
             ))}
           </AnimatePresence>
        </main>

        {/* Input Area */}
        <div ref={inputContainerRef} className="relative w-full max-w-3xl mx-auto mt-4 mb-2">
           {/* Floating Particle Decor around input */}
           <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600 rounded-full opacity-30 blur-md animate-gradient-x"></div>
           
           <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-full p-2 pl-6 shadow-2xl ring-1 ring-white/5 group focus-within:ring-purple-500/50 transition-all duration-300">
             
             {/* Text Input */}
             <input
               type="text"
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               onKeyDown={handleKeyDown}
               placeholder={petitionComplete ? "Ask your question..." : "Enter petition phrase..."}
               className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30 font-light text-lg"
               autoFocus
               autoComplete="off"
               disabled={stage === 'processing' || stage === 'lockdown'}
             />

             {/* The AI Icon / Button */}
             <div className="relative w-12 h-12 flex-shrink-0 ml-2">
               {/* This is the icon that flies around */}
               <div 
                  ref={iconRef}
                  onClick={handleSubmit}
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-indigo-900 cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-50 border border-white/20"
               >
                 {stage === 'processing' ? (
                   <CircleNotch size={24} className="animate-spin text-white" />
                 ) : (
                   <CaretRight size={24} className="text-white" weight="bold" />
                 )}
               </div>
             </div>
           </div>

           {/* Helper Text */}
           <div className="absolute -bottom-6 left-6 text-[10px] text-white/30 font-mono tracking-wider flex items-center gap-2">
             {petitionComplete ? (
                <span className="text-cyan-400 flex items-center gap-1"><Sparkle weight="fill"/> SYSTEM ARMED</span>
             ) : (
                <span>AWAITING PETITION PROTOCOL</span>
             )}
             {isSecretMode && <span className="text-red-500/20">*</span>}
           </div>
        </div>
      </div>

      {/* --- Lockdown Screen Overlay --- */}
      <AnimatePresence>
        {stage === 'lockdown' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-8 text-center backdrop-blur-xl"
          >
            <Lock size={64} className="text-red-500 mb-6 animate-pulse" />
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600 mb-2">SYSTEM LOCKDOWN</h2>
            <p className="text-gray-400 max-w-md mb-8">Daily token limit reached. Neural pathways require cooling. Access will be restored in 23h 59m.</p>
            
            <div className="p-6 border border-red-500/20 bg-red-900/10 rounded-xl w-full max-w-sm mb-8">
              <div className="flex justify-between text-xs text-red-400 mb-2 font-mono">
                <span>USAGE</span>
                <span>100%</span>
              </div>
              <div className="w-full h-2 bg-red-950 rounded-full overflow-hidden">
                <div className="h-full w-full bg-red-600 shadow-[0_0_10px_red]"></div>
              </div>
            </div>

            <button 
              onClick={() => setUpgradeModal(true)}
              className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Sparkle weight="fill" className="text-yellow-600" />
              Upgrade to MuxDay Infinite
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Fake Upgrade Modal --- */}
      <AnimatePresence>
        {upgradeModal && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <div className="bg-[#111] border border-white/10 p-8 rounded-2xl max-w-sm w-full shadow-2xl relative">
               <button onClick={() => setUpgradeModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">&times;</button>
               <div className="flex justify-center mb-6">
                 <Globe size={48} className="text-purple-500 animate-spin-slow" />
               </div>
               <h3 className="text-xl font-bold text-center mb-2">Region Locked</h3>
               <p className="text-sm text-gray-400 text-center mb-6">
                 MuxDay Infinite is not currently available in your sector (Earth-1). We apologize for the inconvenience.
               </p>
               <div className="flex justify-center">
                 <button onClick={() => setUpgradeModal(false)} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors">
                   Close
                 </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Animations for Tailwind */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
