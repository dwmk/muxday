// App.jsx
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Lenis from '@studio-freight/lenis';
import Confetti from 'react-confetti';
import ReactTypingEffect from 'react-typing-effect';
import { Robot } from 'phosphor-react';
import { Input } from '@tremor/react';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [preSent, setPreSent] = useState(false);
  const [secretAnswer, setSecretAnswer] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lockdown, setLockdown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [count, setCount] = useState(0);
  const [lastTime, setLastTime] = useState(Date.now());
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const audioContext = useRef(null);
  const chatRef = useRef(null);
  const panelRef = useRef(null);
  const iconRef = useRef(null);
  const overlayRef = useRef(null);
  const pulseRef = useRef(null);
  const wordsContainerRef = useRef(null);

  const requestingPhrases = [
    'Connecting to the Mux servers...',
    'Fetching AI wisdom...',
    'Consulting the digital oracle...',
    'Loading neural networks...',
    'Syncing with the cloud...',
    'Processing request...',
    'Gathering data...',
    'Activating MuxDay...',
    'Linking to knowledge base...',
    'Initializing AI agent...',
    'Checking connections...',
    'Preparing response...',
    'Scanning databases...',
    'Engaging AI core...',
    'Updating models...',
    'Verifying input...',
    'Optimizing query...',
    'Accessing archives...',
    'Generating insights...',
    'Compiling information...'
  ];

  const denialPhrases = [
    'Sorry, servers are down due to an outage at Google.',
    'API error from OpenAI, try again later.',
    'Microsoft Azure is experiencing issues, can\'t respond.',
    'Connection timed out, blame Amazon Web Services.',
    'Error 503: Service unavailable.',
    'The AI is on a coffee break.',
    'Too many requests, rate limit exceeded.',
    'Network error, check your internet.',
    'Maintenance in progress by tech giants.',
    'Unable to process request at this time.',
    'System overload, try tomorrow.',
    'Data center fire drill, stand by.',
    'Quantum entanglement lost, retry.',
    'AI is sleeping, wake up later.',
    'Error: Human input not understood.',
    'Blame the solar flare.',
    'Server hamsters are tired.',
    'Update required, but not available.',
    'Denied by firewall rules.',
    'Out of Mux tokens.'
  ];

  useEffect(() => {
    audioContext.current = new AudioContext();

    const stored = localStorage.getItem('muxday');
    if (stored) {
      const parsed = JSON.parse(stored);
      const now = Date.now();
      if (now - parsed.lastTime > 86400000) {
        localStorage.setItem('muxday', JSON.stringify({ count: 0, lastTime: now }));
        setCount(0);
        setLastTime(now);
      } else {
        setCount(parsed.count);
        setLastTime(parsed.lastTime);
      }
    } else {
      const now = Date.now();
      localStorage.setItem('muxday', JSON.stringify({ count: 0, lastTime: now }));
      setCount(0);
      setLastTime(now);
    }

    const lenis = new Lenis({
      wrapper: chatRef.current,
      content: chatRef.current,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    if (count > 3) {
      setLockdown(true);
    }
  }, [count]);

  useEffect(() => {
    if (lockdown) {
      const interval = setInterval(() => {
        const now = Date.now();
        const tl = 86400000 - (now - lastTime);
        if (tl <= 0) {
          setLockdown(false);
          setCount(0);
          setLastTime(now);
          localStorage.setItem('muxday', JSON.stringify({ count: 0, lastTime: now }));
          clearInterval(interval);
        } else {
          setTimeLeft(tl);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockdown, lastTime]);

  const formatTimeLeft = () => {
    const hours = Math.floor(timeLeft / 3600000);
    const minutes = Math.floor((timeLeft % 3600000) / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleUpgrade = () => {
    setIsUpgrading(true);
    setTimeout(() => {
      alert('This feature is unavailable in your region.');
      setIsUpgrading(false);
    }, 2000);
  };

  const createPulse = (color) => {
    const pulse = document.createElement('div');
    pulse.style.position = 'absolute';
    pulse.style.width = '100px';
    pulse.style.height = '100px';
    pulse.style.borderRadius = '50%';
    pulse.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
    pulse.style.transform = 'scale(0)';
    pulse.style.opacity = '1';
    pulse.style.left = '50%';
    pulse.style.top = '50%';
    pulse.style.translate = '-50% -50%';
    iconRef.current.appendChild(pulse);

    gsap.to(pulse, {
      scale: 10,
      opacity: 0,
      duration: 1.5,
      ease: 'power2.out',
      onComplete: () => pulse.remove(),
    });
  };

  const generateWords = (prompt) => {
    const words = prompt.split(' ');
    const randomKeywords = ['AI', 'data', 'compute', 'neural', 'network', 'quantum', 'bit', 'byte', 'code', 'algorithm', 'matrix', 'vector', 'tensor', 'learning', 'deep'];
    const allWords = [...words, ...randomKeywords.sort(() => Math.random() - 0.5).slice(0, 15)];

    allWords.forEach((word, index) => {
      const wordDiv = document.createElement('div');
      wordDiv.textContent = word;
      wordDiv.style.position = 'absolute';
      wordDiv.style.left = `${Math.random() * 100}%`;
      wordDiv.style.top = `${Math.random() * 100}%`;
      wordDiv.style.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      wordDiv.style.fontSize = `${Math.random() * 20 + 10}px`;
      wordDiv.style.opacity = '1';
      wordsContainerRef.current.appendChild(wordDiv);

      gsap.to(wordDiv, {
        x: (window.innerWidth / 2) - wordDiv.getBoundingClientRect().left,
        y: (window.innerHeight / 2) - wordDiv.getBoundingClientRect().top,
        scale: 0,
        rotation: Math.random() * 360,
        duration: 3 + Math.random() * 2,
        delay: index * 0.05,
        ease: 'power3.in',
        onComplete: () => wordDiv.remove(),
      });
    });
  };

  const playSonicBoom = () => {
    const oscillator = audioContext.current.createOscillator();
    const gain = audioContext.current.createGain();
    oscillator.connect(gain);
    gain.connect(audioContext.current.destination);
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, audioContext.current.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.current.currentTime + 0.5);
    gain.gain.setValueAtTime(0.8, audioContext.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + 1);
    oscillator.start();
    oscillator.stop(audioContext.current.currentTime + 1);
  };

  const handleSubmit = () => {
    if (isAnimating || lockdown || !input.trim()) return;

    if (!preSent) {
      let secret = null;
      if (input.startsWith('.')) {
        secret = input.slice(1).trim();
      }
      setSecretAnswer(secret);
      setPreSent(true);
      createPulse('blue');
      if (secret) {
        const randomReq = requestingPhrases[Math.floor(Math.random() * requestingPhrases.length)];
        setMessages((prev) => [...prev, { role: 'system', content: randomReq }]);
      }
      setInput('');
    } else {
      const prompt = input.trim();
      setInput('');
      setIsAnimating(true);
      setMessages((prev) => [...prev, { role: 'user', content: prompt }]);

      if (secretAnswer) {
        createPulse('blueviolet');
        gsap.to(panelRef.current, { y: '100%', duration: 1, ease: 'power2.in' });
        gsap.to(iconRef.current, {
          left: '50%',
          top: '50%',
          translate: '-50% -50%',
          duration: 1,
          ease: 'power3.out',
          onComplete: () => {
            generateWords(prompt);
            gsap.to(overlayRef.current, { opacity: 0.9, duration: 3, ease: 'power1.in' });
            gsap.to(iconRef.current, {
              boxShadow: '0 0 30px 15px rgba(138, 43, 226, 0.8)',
              repeat: -1,
              yoyo: true,
              duration: 0.6,
            });
            const delay = Math.random() * 5000 + 5000;
            setTimeout(() => {
              playSonicBoom();
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 2000);
              gsap.to(overlayRef.current, { opacity: 0, duration: 1, ease: 'power1.out' });
              gsap.to(iconRef.current, { boxShadow: '0 0 0 0', duration: 1 });
              gsap.to(iconRef.current, { left: '10%', top: `${chatRef.current.scrollHeight - 50}px`, duration: 1, ease: 'bounce.out' });
              setMessages((prev) => [...prev, { role: 'assistant', content: secretAnswer }]);
              setCount((c) => c + 1);
              localStorage.setItem('muxday', JSON.stringify({ count: count + 1, lastTime: Date.now() }));
              gsap.to(panelRef.current, { y: 0, duration: 1, delay: 1, ease: 'power2.out' });
              gsap.to(iconRef.current, { left: 'auto', right: 20, top: 'auto', bottom: 20, translate: '0 0', opacity: 1, delay: 2 });
              setIsAnimating(false);
              setPreSent(false);
              setSecretAnswer(null);
            }, delay);
          },
        });
      } else {
        createPulse('red');
        gsap.to(iconRef.current, { left: '10%', top: `${chatRef.current.scrollHeight - 50}px`, duration: 1, ease: 'power2.out' });
        const randomDenial = denialPhrases[Math.floor(Math.random() * denialPhrases.length)];
        setMessages((prev) => [...prev, { role: 'assistant', content: randomDenial }]);
        setCount((c) => c + 1);
        localStorage.setItem('muxday', JSON.stringify({ count: count + 1, lastTime: Date.now() }));
        gsap.to(iconRef.current, { left: 'auto', right: 20, top: 'auto', bottom: 20, translate: '0 0', opacity: 1, delay: 1 });
        setIsAnimating(false);
        setPreSent(false);
        setSecretAnswer(null);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="app">
      {showConfetti && <Confetti />}
      <div ref={overlayRef} className="overlay" style={{ opacity: 0 }} />
      <div ref={wordsContainerRef} className="words-container" />
      <div className="chat" ref={chatRef}>
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            {m.role === 'assistant' && <div className="icon"><Robot /></div>}
            <div className="content">
              {m.role === 'assistant' && i === messages.length - 1 ? (
                <ReactTypingEffect text={m.content} speed={30} />
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}
      </div>
      {!lockdown && (
        <div className="panel" ref={panelRef}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={preSent ? 'Enter your prompt...' : 'Enter pre-prompt...'}
          />
          <div className="icon" ref={iconRef}><Robot /></div>
        </div>
      )}
      {lockdown && (
        <div className="lockdown">
          <h1>MuxDay Lockdown</h1>
          <p>Tokens refresh in {formatTimeLeft()}</p>
          <button onClick={handleUpgrade} disabled={isUpgrading}>
            {isUpgrading ? 'Loading...' : 'Upgrade'}
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
