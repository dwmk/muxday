import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, 
  Layers, 
  Wrench, 
  Cpu, 
  ArrowRight, 
  ExternalLink, 
  Menu, 
  X,
  Flame,
  Terminal,
  Monitor
} from 'lucide-react';

// --- DATA CONFIGURATION ---

const WEBAPPS = [
  { name: "Liaoverse", url: "https://liaoverse.vercel.app", icon: "https://huanmux.github.io/assets/logo/liaotian.png", type: "img" },
  { name: "BRAX", url: "https://braxapp.github.io", icon: "https://avatars.githubusercontent.com/u/235305696?s=200&v=4", type: "img" },
  { name: "Acado", url: "https://acadolife.vercel.app", icon: "https://huanmux.github.io/assets/iconify-solar-480-designs/solar--document-add-bold-duotone.svg", type: "img" },
  { name: "iKnow", url: "https://huanmux.github.io/iknow", icon: "https://huanmux.github.io/assets/iconify-solar-480-designs/solar--shield-network-bold-duotone.svg", type: "img" },
  { name: "Jackbus", url: "https://huanmux.github.io/metrobus-tracker", icon: "https://huanmux.github.io/assets/iconify-solar-480-designs/solar--bus-bold-duotone.svg", type: "img" },
  { name: "Mizu CV", url: "https://mizucv.vercel.app", icon: "https://huanmux.github.io/assets/iconify-solar-480-designs/solar--case-bold-duotone.svg", type: "img" },
  { name: "Netstate", url: "https://huanmux.github.io/netstate", icon: "https://huanmux.github.io/assets/iconify-solar-480-designs/solar--home-wifi-angle-bold-duotone.svg", type: "img" },
  { name: "Paint", url: "https://huanmux.github.io/paint", icon: "https://huanmux.github.io/assets/iconify-solar-480-designs/solar--pen-new-round-bold-duotone.svg", type: "img" },
  { name: "QR", url: "https://huanmux.github.io/qrcode", icon: "https://huanmux.github.io/assets/iconify-solar-480-designs/solar--scanner-bold-duotone.svg", type: "img" },
  { name: "Skywatch", url: "https://huanmux.github.io/skywatch", icon: "https://huanmux.github.io/assets/iconify-solar-480-designs/solar--plain-2-bold-duotone.svg", type: "img" },
];

const GAMES = [
  { name: "TypeHero", url: "https://typehero.vercel.app", status: "Live", engine: "Self-hosted", multi: false },
  { name: "Faculty of Survival", url: "https://facultyofsurvival.vercel.app", status: "Live", engine: "Self-hosted", multi: false },
  { name: "Goofy Gunners", url: "https://www.roblox.com/games/107542071734450/Goofy-Gunners", status: "Roblox", engine: "Roblox Studio", multi: true },
  { name: "Goofy Obby", url: "https://www.roblox.com/games/76587171520946/Goofy-Obby", status: "Roblox", engine: "Roblox Studio", multi: true },
  { name: "Welcome to Bangladesh", url: "https://www.roblox.com/games/13664220695/Welcome-to-Bangladesh", status: "Roblox", engine: "Roblox Studio", multi: true },
  { name: "Demon Hunting Paradise", url: "https://www.roblox.com/games/18375390394/Demon-Hunting-Paradise", status: "Roblox", engine: "Roblox Studio", multi: true },
  { name: "Save Her", url: "https://www.roblox.com/games/18535230648/Save-Her", status: "Roblox", engine: "Roblox Studio", multi: false },
];

const SHADERS = [
  { name: "Vodka", platform: "Minecraft", link: "#", author: "MSharp" },
  { name: "Vulkan", platform: "Minecraft", link: "#", author: "MSharp" },
  { name: "Mortal", platform: "MMD", link: "#", author: "THRXT" },
  { name: "Chippa256", platform: "Minecraft", link: "https://www.curseforge.com/minecraft/shaders/chippa256-shaders", author: "Mew" },
];

const TOOLS = [
  { name: "Repeat", platform: "Windows", link: "#", type: "Mux" },
  { name: "RecApp", platform: "Windows, Linux", link: "#", type: "Mux" },
  { name: "Oozbok", platform: "Windows", link: "#", type: "External" },
];

// --- COMPONENTS ---

// 1. Particle Fluid Background (Canvas)
const FieryBackground = ({ isMobile }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isMobile) return; 

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = [];
    const particleCount = 100;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3;
        this.speedY = Math.random() * 1 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? '#ff2a2a' : '#ff7b00';
      }
      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        if (this.y < 0) {
          this.y = height;
          this.x = Math.random() * width;
        }
        this.opacity -= 0.001;
        if(this.opacity <= 0) this.opacity = 0.5;
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      // Create a subtle gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#050202');
      gradient.addColorStop(1, '#1a0505');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-mux-dark to-[#2a0a0a]" />
    );
  }

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
    />
  );
};

// 2. Custom Cursor (Desktop Only)
const InfernoCursor = ({ isMobile }) => {
  if (isMobile) return null;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-mux-orange pointer-events-none z-[9999] mix-blend-screen"
      style={{ 
        x: springX, 
        y: springY,
        backgroundColor: 'rgba(255, 69, 0, 0.1)',
        boxShadow: '0 0 20px 2px rgba(255, 69, 0, 0.6)'
      }}
    >
      <div className="absolute inset-0 bg-mux-gold opacity-50 blur-sm rounded-full animate-pulse-fast" />
    </motion.div>
  );
};

// 3. 3D Tilt Card Component
const TiltCard = ({ children, className, href }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct * 200);
    y.set(yPct * 200);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Content = (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-6 transition-colors duration-300 hover:border-mux-orange/50 group ${className}`}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-mux-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 transform translate-z-10 group-hover:translate-z-12 transition-transform">
        {children}
      </div>
    </motion.div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
      {Content}
    </a>
  ) : Content;
};

// 4. Section Header
const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <motion.div 
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="mb-12 relative pl-6 border-l-4 border-mux-orange"
  >
    <div className="flex items-center gap-3 mb-2">
      <Icon className="w-8 h-8 text-mux-gold animate-pulse" />
      <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
        {title}
      </h2>
    </div>
    <p className="text-gray-400 max-w-xl text-sm md:text-base font-mono">{subtitle}</p>
  </motion.div>
);

// --- MAIN APP ---

const App = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { label: 'Webapps', id: 'webapps', icon: Layers },
    { label: 'Games', id: 'games', icon: Gamepad2 },
    { label: 'Shaders', id: 'shaders', icon: Cpu },
    { label: 'Tools', id: 'tools', icon: Wrench },
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({ behavior: 'smooth' });
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-mux-orange selection:text-black">
      <FieryBackground isMobile={isMobile} />
      <InfernoCursor isMobile={isMobile} />

      {/* Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-mux-red via-mux-orange to-mux-gold origin-left z-[100]" style={{ scaleX }} />

      {/* Navigation - Sidebar */}
      <motion.nav 
        className="fixed top-0 right-0 h-full z-50 pointer-events-none flex flex-col items-end p-6"
      >
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="pointer-events-auto p-3 bg-black/50 backdrop-blur-md border border-white/20 rounded-full hover:bg-mux-red/20 hover:border-mux-red transition-all"
        >
          {sidebarOpen ? <X className="text-white" /> : <Menu className="text-white" />}
        </button>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="pointer-events-auto mt-4 w-64 bg-black/80 backdrop-blur-xl border-l border-white/10 h-auto rounded-xl overflow-hidden shadow-2xl shadow-mux-red/20"
            >
              <div className="p-6 flex flex-col gap-4">
                {menuItems.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center gap-4 text-lg font-bold text-gray-300 hover:text-mux-gold hover:translate-x-2 transition-all group"
                  >
                    <item.icon className="w-5 h-5 group-hover:text-mux-red" />
                    {item.label}
                  </button>
                ))}
                <div className="h-px bg-white/10 my-2" />
                <a href="https://huanmux.github.io/socials" className="text-sm text-gray-500 hover:text-white transition-colors">Contact Us</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* HERO SECTION */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Logo Container with Glitch/Glow */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-mux-red blur-[60px] opacity-40 group-hover:opacity-60 transition-opacity duration-500 rounded-full" />
            <img 
              src="https://huanmux.github.io/assets/logo/favicon.png" 
              alt="HuanMux Logo" 
              className="w-32 h-32 md:w-48 md:h-48 relative z-10 drop-shadow-2xl animate-float"
            />
          </div>
          
          <h1 className="mt-8 text-6xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-600 drop-shadow-lg">
            HUAN<span className="text-mux-orange">MUX</span>
          </h1>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex gap-4"
          >
             <span className="px-4 py-1 rounded-full border border-mux-orange/30 bg-mux-orange/10 text-mux-orange font-mono text-sm backdrop-blur-md">
              EST. 202X
            </span>
            <span className="px-4 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 font-mono text-sm backdrop-blur-md">
              SYSTEMS ONLINE
            </span>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 text-white/50 flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-[0.3em] uppercase">Initialize</span>
          <ArrowRight className="rotate-90 w-5 h-5" />
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 flex flex-col gap-32">
        
        {/* WEBAPPS GRID */}
        <section id="webapps">
          <SectionTitle 
            icon={Layers} 
            title="Mux Webapps" 
            subtitle="Cloud-native applications designed for performance and utility."
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {WEBAPPS.map((app, index) => (
              <TiltCard key={index} href={app.url} className="h-48 flex flex-col items-center justify-center text-center gap-4">
                <div className="relative w-16 h-16 bg-gradient-to-tr from-gray-800 to-black rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
                  <img src={app.icon} alt={app.name} className="w-10 h-10 object-contain" />
                  {/* Status Indicator */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black shadow-[0_0_10px_#22c55e]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{app.name}</h3>
                  <div className="text-xs text-gray-500 font-mono mt-1 flex items-center justify-center gap-1">
                    ACCESS <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* GAMES TABLE - Material/Cyberpunk Style */}
        <section id="games">
          <SectionTitle 
            icon={Gamepad2} 
            title="Mux Games" 
            subtitle="Immersive experiences built on Roblox and proprietary engines."
          />

          <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-gray-400 font-mono text-xs uppercase tracking-wider">
                  <th className="p-4 border-b border-white/10">Game Title</th>
                  <th className="p-4 border-b border-white/10 hidden md:table-cell">Platform</th>
                  <th className="p-4 border-b border-white/10 hidden md:table-cell">Engine</th>
                  <th className="p-4 border-b border-white/10 text-center">Multiplayer</th>
                  <th className="p-4 border-b border-white/10 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {GAMES.map((game, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 font-bold text-lg text-white group-hover:text-mux-gold transition-colors">
                      {game.name}
                      <span className="block md:hidden text-xs font-normal text-gray-500 mt-1">{game.status}</span>
                    </td>
                    <td className="p-4 text-gray-300 hidden md:table-cell">
                      <span className={`px-2 py-1 rounded text-xs font-mono border ${game.status === 'Roblox' ? 'border-red-500/30 text-red-400' : 'border-blue-500/30 text-blue-400'}`}>
                        {game.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 font-mono text-sm hidden md:table-cell">{game.engine}</td>
                    <td className="p-4 text-center">
                      {game.multi ? (
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" title="Yes" />
                      ) : (
                        <span className="inline-block w-2 h-2 rounded-full bg-red-500 opacity-50" title="No" />
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {game.url !== "#" && (
                        <a href={game.url} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-mux-orange hover:text-black transition-all">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SHADERS & TOOLS (Split Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <section id="shaders">
            <SectionTitle 
              icon={Cpu} 
              title="Shaders" 
              subtitle="Visual enhancement modules."
            />
            <div className="flex flex-col gap-4">
              {SHADERS.map((shader, i) => (
                <motion.a 
                  href={shader.link}
                  key={i}
                  whileHover={{ x: 10 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-white/5 to-transparent border border-white/5 hover:border-mux-red/50 group"
                >
                  <div>
                    <h4 className="font-bold text-lg group-hover:text-mux-red transition-colors">
                      <span className="text-gray-500 font-normal mr-2">({shader.author})</span>
                      {shader.name}
                    </h4>
                    <p className="text-sm text-gray-400">{shader.platform}</p>
                  </div>
                  <Terminal className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                </motion.a>
              ))}
            </div>
          </section>

          <section id="tools">
            <SectionTitle 
              icon={Wrench} 
              title="Software" 
              subtitle="Desktop utilities and system tools."
            />
            <div className="grid grid-cols-1 gap-4">
              {TOOLS.map((tool, i) => (
                <TiltCard key={i} href={tool.link} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                      <Monitor className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{tool.name}</h4>
                      <p className="text-xs font-mono text-gray-400 bg-black/30 px-2 py-0.5 rounded inline-block mt-1">
                        {tool.platform}
                      </p>
                    </div>
                  </div>
                  {tool.type === 'Mux' && <span className="text-xs font-bold text-mux-gold border border-mux-gold/30 px-2 py-1 rounded">OFFICIAL</span>}
                </TiltCard>
              ))}
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <footer className="mt-20 border-t border-white/10 pt-10 pb-20 text-center">
          <div className="flex justify-center items-center gap-2 mb-6 text-mux-orange">
            <Flame className="animate-bounce" />
            <span className="font-bold tracking-widest">COMING SOON: CONSUMER HARDWARE</span>
            <Flame className="animate-bounce" />
          </div>
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} HuanMux. Designed for the bold.
          </p>
          <a href="https://huanmux.github.io/socials" className="inline-block mt-4 text-white hover:text-mux-orange underline underline-offset-4 decoration-white/20 hover:decoration-mux-orange transition-all">
            Contact Channels
          </a>
        </footer>
      </div>
    </div>
  );
};

export default App;
