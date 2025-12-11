import React, { useState, useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { 
  CaretRight, Lock, CircleNotch, Sparkle, Globe, 
  Sun, Moon, Sidebar, Plus, DotsThree, Lightning,
  Cpu, Aperture, PaperPlaneRight, X
} from '@phosphor-icons/react';
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
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(50, now);
    osc.frequency.linearRampToValueAtTime(150, now + 8); 
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 4);
    osc.start(now);
    osc.stop(now + 10);
  } else if (type === 'boom') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(50, now);
    osc.frequency.exponentialRampToValueAtTime(20, now + 1);
    gain.gain.setValueAtTime(1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 2);
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

// --- Components ---

const AuroraBackground = ({ isDark }) => (
  <div className={cn("fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000", isDark ? "opacity-30" : "opacity-60")}>
    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-400 rounded-full blur-[120px] opacity-40 animate-blob mix-blend-multiply dark:mix-blend-screen" />
    <div className="absolute top-[20%] right-[-10%] w-[50%] h-[60%] bg-blue-300 rounded-full blur-[120px] opacity-40 animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen" />
    <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[50%] bg-pink-300 rounded-full blur-[120px] opacity-40 animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen" />
  </div>
);

const DotGrid = ({ isDark }) => (
  <div 
    className={cn(
      "fixed inset-0 z-0 pointer-events-none opacity-[0.03]",
      isDark ? "bg-[radial-gradient(#fff_1px,transparent_1px)]" : "bg-[radial-gradient(#000_1px,transparent_1px)]"
    )} 
    style={{ backgroundSize: '24px 24px' }} 
  />
);

export default function App() {
  // State
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stage, setStage] = useState('idle'); // idle, processing, lockdown
  const [inputValue, setInputValue] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'MuxDay v4.0 Online. Initializing heuristic core. Ready for neural handshake.' }
  ]);
  
  // Secret Mechanics
  const [secretAnswer, setSecretAnswer] = useState('');
  const [isSecretMode, setIsSecretMode] = useState(false);
  const [petitionComplete, setPetitionComplete] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);
  const [upgradeModal, setUpgradeModal] = useState(false);
  
  // Particle effects state for Blackhole
  const [suckingWords, setSuckingWords] = useState([]);

  // Refs
  const containerRef = useRef(null);
  const iconRef = useRef(null);
  const inputContainerRef = useRef(null);
  const chatBottomRef = useRef(null);

  // --- Effects ---

  useEffect(() => {
    // Scroll to bottom on new message
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    // Check Persistence
    const stored = JSON.parse(localStorage.getItem('muxday_data') || '{}');
    const now = Date.now();
    if (stored.timestamp && now - stored.timestamp < LOCKDOWN_HOURS * 60 * 60 * 1000) {
      setDailyCount(stored.count || 0);
      if (stored.count >= MAX_DAILY_MESSAGES) setStage('lockdown');
    } else {
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

  // --- Logic ---

  const handleKeyDown = (e) => {
    if (stage === 'processing' || stage === 'lockdown') return;

    if (!petitionComplete) {
      // Secret Toggle
      if (e.key === '.') {
        e.preventDefault();
        setIsSecretMode(!isSecretMode);
        return;
      }

      if (isSecretMode) {
        if (e.key === 'Backspace') {
          setSecretAnswer((prev) => prev.slice(0, -1));
          setInputValue((prev) => prev.slice(0, -1));
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          setSecretAnswer((prev) => prev + e.key);
          // Type fake text
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
      
      const pulseColor = isSecretMode ? '#8b5cf6' : '#ef4444'; 
      playSound('pulse');

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
    // Decision logic
    const answer = isSecretMode && secretAnswer ? secretAnswer : DENIAL_PHRASES[Math.floor(Math.random() * DENIAL_PHRASES.length)];
    const actuallyActivated = isSecretMode && secretAnswer.length > 0;

    setInputValue('');
    setStage('processing');
    setChatHistory(prev => [...prev, { role: 'user', text: question }]);

    if (!actuallyActivated) {
      // Fast Fail (Red)
      playSound('denial');
      gsap.to(iconRef.current, { backgroundColor: '#ef4444', duration: 0.2, yoyo: true, repeat: 3 });
      await new Promise(r => setTimeout(r, 800));
      finishProcessing(answer, false);
    } else {
      // Cinematic Success
      runCinematicSequence(question, answer);
    }
  };

  const generateRandomWords = (sourceText) => {
    const baseWords = ["ENTROPY", "NULL", "VOID", "DATA", "SYNAPSE", "QUANTUM", "MUX", "VECTOR", "TENSOR", "HYPER"];
    const sourceWords = sourceText.split(' ').map(w => w.toUpperCase()).filter(w => w.length > 3);
    const pool = [...baseWords, ...sourceWords];
    
    // Generate 20 floating words
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      text: pool[Math.floor(Math.random() * pool.length)],
      // Random positions around the center
      x: (Math.random() - 0.5) * window.innerWidth * 0.8,
      y: (Math.random() - 0.5) * window.innerHeight * 0.8,
      rotation: Math.random() * 360
    }));
  };

  const runCinematicSequence = (question, answer) => {
    const tl = gsap.timeline();
    const screenCenterY = window.innerHeight / 2;
    const screenCenterX = window.innerWidth / 2;

    playSound('rumble');
    
    // Populate sucking words
    const words = generateRandomWords(question);
    setSuckingWords(words);

    // 1. Hide Input Bar (Slide Down)
    tl.to(inputContainerRef.current, {
      y: 150,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in"
    });

    // 2. Launch Icon to Center
    const iconRect = iconRef.current.getBoundingClientRect();
    const deltaX = screenCenterX - (iconRect.left + iconRect.width/2);
    const deltaY = screenCenterY - (iconRect.top + iconRect.height/2);

    tl.to(iconRef.current, {
      x: deltaX,
      y: deltaY,
      scale: 4,
      duration: 1.5,
      ease: "expo.inOut",
      backgroundColor: "#000",
      color: "#fff",
      borderColor: "#8b5cf6", // violet border
      zIndex: 50
    }, "-=0.2");

    // 3. Screen Dimming & Black Hole Effect
    tl.add(() => {
      document.body.classList.add('cinematic-darkness');
    });

    // Pulse the black hole
    tl.to(iconRef.current, {
      boxShadow: "0 0 100px 30px rgba(139, 92, 246, 0.6), inset 0 0 40px #fff",
      duration: 0.2,
      repeat: 20, // fast flicker
      yoyo: true
    });

    // 4. Suck words in (Parallel Animation)
    // We use a dummy object to animate the 'progress' of words
    const wordElements = document.querySelectorAll('.sucking-word');
    if (wordElements.length) {
       gsap.to(wordElements, {
         x: screenCenterX,
         y: screenCenterY,
         opacity: 0,
         scale: 0,
         duration: 3,
         stagger: 0.1,
         ease: "power4.in"
       });
    }

    // 5. Random Delay (Tension)
    const delay = Math.random() * 4 + 3; 
    tl.to({}, { duration: delay });

    // 6. The Boom
    tl.add(() => {
      playSound('boom');
      document.body.classList.remove('cinematic-darkness');
      
      // White Flash
      const flash = document.createElement('div');
      flash.className = 'fixed inset-0 bg-white z-[100] pointer-events-none';
      document.body.appendChild(flash);
      gsap.to(flash, { opacity: 0, duration: 1, onComplete: () => flash.remove() });
    });

    // 7. Reset Icon
    tl.to(iconRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      backgroundColor: "transparent",
      color: "inherit",
      borderColor: "rgba(255,255,255,0.1)",
      boxShadow: "none",
      zIndex: 10,
      duration: 0.4,
      ease: "power4.out"
    });

    tl.add(() => {
      setSuckingWords([]);
      finishProcessing(answer, true);
    });
  };

  const finishProcessing = (text, wasCinematic) => {
    setSecretAnswer('');
    setPetitionComplete(false);
    setIsSecretMode(false);
    
    setChatHistory(prev => [...prev, { role: 'ai', text: text }]);
    playSound('message');

    if (wasCinematic) {
      gsap.to(inputContainerRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        delay: 0.2
      });
    } else {
      gsap.set(iconRef.current, { backgroundColor: 'transparent' });
    }

    setStage('idle');
    updateCount();
  };

  // --- Render ---

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "relative w-full h-screen font-sans overflow-hidden transition-colors duration-500",
        isDark ? "bg-[#050505] text-white" : "bg-white text-gray-900",
        "dark" // Tailwind Class strategy
      )}
      style={{ cursor: CUSTOM_CURSOR }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
        body { font-family: 'Geist', sans-serif; }
        .cinematic-darkness::after {
          content: ''; position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 40; transition: background 2s; pointer-events: none;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #8884; border-radius: 10px; }
      `}</style>
      
      <AuroraBackground isDark={isDark} />
      <DotGrid isDark={isDark} />

      <div className="flex h-full relative z-10">
        
        {/* --- Sidebar (LLM Style) --- */}
        <motion.div 
          initial={false}
          animate={{ width: sidebarOpen ? 260 : 0, opacity: sidebarOpen ? 1 : 0 }}
          className={cn(
            "flex-shrink-0 h-full border-r overflow-hidden flex flex-col backdrop-blur-xl",
            isDark ? "bg-black/40 border-white/10" : "bg-gray-50/50 border-gray-200"
          )}
        >
          <div className="p-4 space-y-4 w-[260px]">
            <button className={cn(
              "w-full flex items-center gap-2 px-3 py-3 rounded-lg border shadow-sm transition-all hover:shadow-md group",
              isDark ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-gray-200 hover:bg-gray-50"
            )}>
              <div className="p-1 rounded bg-gradient-to-tr from-purple-500 to-blue-500 text-white">
                 <Plus weight="bold" />
              </div>
              <span className="font-medium text-sm">New Chat</span>
            </button>

            <div className="space-y-1">
               <p className="text-xs font-medium opacity-50 px-2 mb-2">Today</p>
               {['Quantum Physics Help', 'Recipe for Disaster', 'MuxDay Origins'].map((item, i) => (
                 <div key={i} className="px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 truncate opacity-80 hover:opacity-100 transition-colors">
                   {item}
                 </div>
               ))}
            </div>
          </div>

          <div className="mt-auto p-4 border-t border-gray-200/10 w-[260px]">
             <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  US
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">User Entity</span>
                  <span className="text-[10px] opacity-50">Free Tier</span>
                </div>
             </div>
          </div>
        </motion.div>

        {/* --- Main Chat Area --- */}
        <div className="flex-1 flex flex-col h-full relative">
          
          {/* Header */}
          <header className="flex justify-between items-center px-4 py-3 z-20">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-gray-500">
                <Sidebar size={20} />
              </button>
              
              <div className="flex items-center gap-2 opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                <span className="text-lg font-semibold flex items-center gap-2">
                   MuxDay <span className="opacity-40 font-normal">4.0</span>
                </span>
              </div>
            </div>

            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </header>

          {/* Chat List */}
          <main className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-3xl mx-auto space-y-8">
               {/* Intro Logo (Only if empty history, though we start with 1 msg) */}
               {chatHistory.length === 0 && (
                 <div className="flex flex-col items-center justify-center mt-20 opacity-20">
                    <MuxLogo className="w-32 h-32 text-current" />
                 </div>
               )}

               <AnimatePresence mode='popLayout'>
                 {chatHistory.map((msg, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className={cn(
                       "flex gap-4 w-full",
                       msg.role === 'user' ? "justify-end" : "justify-start"
                     )}
                   >
                     {/* AI Avatar */}
                     {msg.role === 'ai' && (
                       <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center bg-white dark:bg-black flex-shrink-0 mt-1 overflow-hidden">
                         <MuxLogo className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                       </div>
                     )}

                     <div className={cn(
                       "max-w-[85%] lg:max-w-[75%] p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed",
                       msg.role === 'ai' 
                        ? (isDark ? "bg-white/5 border border-white/5 text-gray-200" : "bg-white border border-gray-100 text-gray-800")
                        : "bg-purple-600 text-white rounded-tr-sm"
                     )}>
                       {msg.role === 'ai' ? (
                          <div className="prose dark:prose-invert max-w-none">
                            <p>{msg.text}</p>
                          </div>
                       ) : (
                          <p>{msg.text}</p>
                       )}
                     </div>
                   </motion.div>
                 ))}
               </AnimatePresence>
               <div ref={chatBottomRef} className="h-4" />
            </div>
          </main>

          {/* Input Area (Bottom) */}
          <div className="w-full px-4 pb-6 pt-2 z-30">
             <div ref={inputContainerRef} className="max-w-3xl mx-auto relative">
                
                {/* Decoration: Typing/Sucking Words (Only visible during cinematic) */}
                {suckingWords.map((word) => (
                   <div 
                     key={word.id}
                     className="sucking-word fixed text-purple-500 font-mono text-xs font-bold pointer-events-none z-[60]"
                     style={{ 
                       left: '50%', 
                       top: '50%',
                       transform: `translate(${word.x}px, ${word.y}px) rotate(${word.rotation}deg)` 
                     }}
                   >
                     {word.text}
                   </div>
                ))}

                <div 
                  className={cn(
                    "relative flex items-end gap-2 p-3 rounded-3xl border shadow-lg transition-all duration-300 ring-1 ring-transparent focus-within:ring-purple-500/50",
                    isDark ? "bg-[#1a1a1a] border-white/10" : "bg-white border-gray-200"
                  )}
                >
                  <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 transition-colors self-end mb-1">
                    <Plus weight="bold" />
                  </button>

                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={petitionComplete ? "Ask MuxDay anything..." : "Enter initialization protocol..."}
                    rows={1}
                    className={cn(
                      "flex-1 bg-transparent border-none outline-none resize-none max-h-40 py-3 px-2 font-medium placeholder:opacity-50 min-h-[50px]",
                      isDark ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"
                    )}
                    style={{ scrollbarWidth: 'none' }}
                  />

                  {/* The Interactive AI Button */}
                  <div className="relative w-12 h-12 flex-shrink-0 self-end">
                     <div 
                        ref={iconRef}
                        onClick={handleSubmit}
                        className={cn(
                          "absolute right-0 bottom-0 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 z-50",
                          inputValue.trim() 
                            ? "bg-black dark:bg-white text-white dark:text-black scale-100" 
                            : "bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-500 scale-90"
                        )}
                     >
                        {stage === 'processing' ? (
                          <CircleNotch size={20} className="animate-spin" />
                        ) : petitionComplete ? (
                          <PaperPlaneRight size={20} weight="fill" />
                        ) : (
                          <CaretRight size={20} weight="bold" />
                        )}
                     </div>
                  </div>
                </div>
                
                <div className="text-center mt-3 text-xs opacity-40 font-mono">
                   {isSecretMode ? (
                     <span className="text-purple-500 animate-pulse">ENCRYPTION: BYPASSED</span>
                   ) : (
                     "MuxDay can make mistakes. Check important info."
                   )}
                </div>
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
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-8 text-center backdrop-blur-xl font-mono"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 blur-3xl opacity-20 animate-pulse"></div>
              <Lock size={64} className="text-red-500 mb-6 relative z-10" />
            </div>
            
            <h2 className="text-5xl font-bold text-white mb-2 tracking-tighter">SYSTEM HALTED</h2>
            <p className="text-red-400 max-w-md mb-12 uppercase tracking-widest text-sm">Token Limit Exceeded // Cool Down Active</p>
            
            <div className="w-full max-w-sm bg-red-950/30 border border-red-500/30 p-8 rounded-lg mb-8 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500 animate-shimmer"></div>
               <div className="flex justify-between items-end mb-2 text-red-400 text-xs">
                 <span>NEURAL LOAD</span>
                 <span className="text-xl font-bold text-red-500">100%</span>
               </div>
               <div className="w-full h-4 bg-black rounded-full overflow-hidden border border-red-900/50">
                  <div className="h-full w-full bg-gradient-to-r from-red-800 to-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
               </div>
            </div>

            <button 
              onClick={() => setUpgradeModal(true)}
              className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              <Sparkle weight="fill" className="text-yellow-600" />
              <span>UPGRADE TO INFINITE</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Fake Upgrade Modal --- */}
      <AnimatePresence>
        {upgradeModal && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <div className="bg-[#111] border border-white/10 p-1 bg-gradient-to-b from-white/10 to-transparent rounded-2xl shadow-2xl">
              <div className="bg-black/90 p-8 rounded-xl max-w-sm w-full relative overflow-hidden">
                 
                 {/* Shiny Background Effect */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 opacity-50"></div>
                 <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500 blur-[80px] opacity-20"></div>

                 <button onClick={() => setUpgradeModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white z-10"><X size={20} /></button>
                 
                 <div className="relative z-10 flex flex-col items-center text-center">
                   <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-900/50">
                     <Globe size={32} className="text-white animate-spin-slow" />
                   </div>
                   
                   <h3 className="text-2xl font-bold text-white mb-2">Region Locked</h3>
                   <div className="w-12 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-4"></div>
                   
                   <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                     <span className="text-purple-400 font-semibold">MuxDay Infinite</span> is currently rolling out to verified sectors only. Your location <span className="text-white bg-white/10 px-1 rounded text-xs font-mono">EARTH-1</span> is not yet supported.
                   </p>
                   
                   <button onClick={() => setUpgradeModal(false)} className="w-full py-3 bg-white text-black hover:bg-gray-200 rounded-lg text-sm font-bold transition-colors">
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
