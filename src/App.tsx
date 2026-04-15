/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight, Menu, X, Plus, Play } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

// --- Custom Hook for Page Titles ---
const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};

// --- Preloader Component ---
const Preloader = ({ images }: { images: string[] }) => {
  return (
    <div className="w-0 h-0 overflow-hidden opacity-0 absolute pointer-events-none" aria-hidden="true">
      {images.map((src, idx) => (
        <img key={idx} src={src} alt="" loading="eager" fetchPriority="high" />
      ))}
    </div>
  );
};

// --- Components ---

const NoiseOverlay = () => <div className="noise-overlay" />;

const StructuralGrid = () => (
  <div className="fixed inset-0 pointer-events-none z-0 flex justify-center">
    <div className="w-full max-w-[1600px] h-full grid grid-cols-12 px-4 md:px-8">
      {[...Array(13)].map((_, i) => (
        <div key={i} className="grid-line h-full" style={{ left: `${(i / 12) * 100}%` }} />
      ))}
    </div>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Projects", path: "/projects" },
    { name: "Philosophy", path: "/philosophy" },
    { name: "Journal", path: "/journal" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full h-16 md:h-20 z-50 bg-background/90 backdrop-blur-[12px] border-b border-zinc-200">
      <div className="max-w-[1600px] mx-auto h-full px-4 md:px-10 flex items-center justify-between relative">
        {/* Left: Desktop Nav */}
        <nav className="hidden md:flex flex-1 gap-6">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-[10px] font-bold uppercase tracking-[0.3em] hover:text-accent transition-colors ${location.pathname === item.path ? 'text-accent' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Center: Logo */}
        <Link to="/" className="md:absolute md:left-1/2 md:-translate-x-1/2 flex items-center gap-1 z-20">
          <span className="font-serif italic text-lg md:text-xl tracking-tighter">3axis</span>
          <span className="font-sans font-black text-lg md:text-xl tracking-tighter">ARC</span>
        </Link>

        {/* Right: Actions */}
        <div className="flex flex-1 items-center justify-end gap-3 md:gap-4">
          <Link to="/inquire" className="hidden sm:flex items-center px-4 md:px-5 py-2 md:py-2.5 rounded-full border border-foreground text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-all overflow-hidden relative group">
            <span className="relative z-10 group-hover:text-background transition-colors duration-500">Inquire Now</span>
            <div className="absolute inset-0 bg-foreground translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
          </Link>
          <button 
            className="p-2 -mr-2 text-foreground hover:text-accent transition-colors transition-transform active:scale-95"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-background border-b border-zinc-200 overflow-hidden md:hidden"
          >
            <div className="p-8 flex flex-col gap-6">
              <Link to="/" className="text-3xl font-serif italic hover:text-accent transition-colors" onClick={() => setIsOpen(false)}>Home</Link>
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-3xl font-serif italic hover:text-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="h-px w-full bg-zinc-200 my-2" />
              <Link 
                to="/inquire" 
                className="text-3xl font-serif italic text-accent hover:text-foreground transition-colors" 
                onClick={() => setIsOpen(false)}
              >
                Inquire Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
  const translateX = useTransform(mouseXSpring, [-0.5, 0.5], ["-20px", "20px"]);
  const translateY = useTransform(mouseYSpring, [-0.5, 0.5], ["-20px", "20px"]);

  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = () => {
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rectRef.current) return;
    const rect = rectRef.current;
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    rectRef.current = null;
  };

  return (
    <section 
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative pt-20 min-h-[100svh] flex flex-col md:flex-row max-w-[1600px] mx-auto overflow-hidden bg-background"
      style={{ perspective: 1500 }}
    >
      {/* Background Kinetic Text */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03] select-none flex items-center justify-center -z-10">
        <motion.h2 
          animate={{ x: [0, -200, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="text-[30vw] font-black whitespace-nowrap"
        >
          2026 ARCHITECTURE 2026 ARCHITECTURE
        </motion.h2>
      </div>

      {/* Left Column (span 7) */}
      <motion.div 
        className="flex-[7] flex flex-col justify-between p-10 md:p-14 border-r border-zinc-300 z-10"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2"
          style={{ transform: "translateZ(30px)" }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22C55E]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Available • Lucknow Sector 12</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-[12vw] md:text-[90px] leading-[0.9] font-black tracking-[-0.04em] uppercase my-8 md:my-5 relative"
          style={{ transform: "translateZ(80px)" }}
        >
          <motion.div style={{ x: translateX, y: translateY }}>
            SHAPING THE <br/>
            <span className="text-accent">FUTURE</span> OF <br/>
            <span className="serif-italic lowercase text-[14vw] md:text-[90px]">Residency</span>
          </motion.div>
        </motion.h1>

        <div className="flex flex-col md:flex-row gap-10 items-start md:items-center" style={{ transform: "translateZ(40px)" }}>
          <div className="flex gap-10 font-mono text-[10px] opacity-60 uppercase">
            <div>REF. 3A-2026</div>
            <div>COORD. 26.8467° N</div>
            <div>VOL. 14.2K SQFT</div>
          </div>
          
          <Link to="/projects">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-10 py-5 bg-foreground text-background overflow-hidden"
            >
              <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                Start Project <ArrowUpRight className="group-hover:rotate-45 transition-transform duration-500" />
              </span>
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Right Column (span 5) */}
      <div className="flex-[5] relative bg-[#D0D0CD] p-5 overflow-hidden group">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-full border border-white/20 overflow-hidden"
          style={{ perspective: 1000 }}
        >
          <motion.img
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05, rotateX: 2, rotateY: -2 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2075"
            alt="Architectural Detail"
            className="w-full h-full object-cover opacity-90 transition-all duration-[10s] group-hover:duration-[0.5s]"
            referrerPolicy="no-referrer"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          
          {/* Glassmorphism Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="absolute bottom-10 left-10 p-5 bg-background/80 backdrop-blur-[12px] border border-zinc-300 w-60"
          >
            <div className="text-[10px] font-black tracking-[0.1em] mb-3">STRUCTURAL LOAD</div>
            <div className="h-0.5 w-full bg-zinc-300 mb-2 relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "82%" }}
                transition={{ delay: 1.2, duration: 2 }}
                className="h-full bg-accent" 
              />
            </div>
            
            <div className="text-[10px] font-black tracking-[0.1em] mb-3 mt-4">AESTHETIC STATUS</div>
            <div className="h-0.5 w-full bg-zinc-300 mb-2 relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "99%" }}
                transition={{ delay: 1.5, duration: 2 }}
                className="h-full bg-accent" 
              />
            </div>
            <div className="font-mono text-[9px] mt-3 opacity-60">SYS_READY: OPTIMAL</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const Marquee = () => {
  return (
    <div className="w-full h-[120px] bg-[#F4F4F5] border-t border-zinc-300 flex items-center overflow-hidden whitespace-nowrap">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="flex items-center gap-10"
      >
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-10">
            <span className="text-[70px] font-black uppercase">LUCKNOW PREMIER ESTATE <span className="text-accent">★</span> STROKE THE SKY <span className="text-accent">★</span> 3AXIS ARCHITECTURAL GRID <span className="text-accent">★</span></span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

interface ProjectItemProps {
  title: string;
  category: string;
  year: string;
  image: string;
  key?: number | string;
}

const ProjectItem = ({ title, category, year, image }: ProjectItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = () => {
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rectRef.current) return;
    const rect = rectRef.current;
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    rectRef.current = null;
  };

  return (
    <motion.div 
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative w-full h-[300px] border-b border-foreground/10 flex items-center px-4 md:px-8 cursor-pointer overflow-hidden"
      style={{ perspective: 1200 }}
    >
      <motion.div 
        className="w-full h-full flex items-center relative"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <div className="flex-1 grid grid-cols-12 items-center z-10 relative" style={{ transform: "translateZ(50px)" }}>
          <div className="col-span-1 text-[10px] font-mono text-foreground/40 group-hover:text-white transition-colors duration-500">{year}</div>
          <div className="col-span-7 md:col-span-5">
            <h3 className="text-4xl md:text-6xl font-sans group-hover:font-serif group-hover:italic group-hover:text-white group-hover:scale-105 origin-left inline-block transition-all duration-500">
              {title}
            </h3>
          </div>
          <div className="hidden md:block col-span-4 text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/60 group-hover:text-white/80 transition-colors duration-500">
            {category}
          </div>
        </div>

        <div className="absolute inset-0 [clip-path:inset(100%_0_0_0)] group-hover:[clip-path:inset(0_0_0_0)] z-0 origin-bottom transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden rounded-lg" style={{ transform: "translateZ(-20px)" }}>
          <img 
            src={image} 
            alt={title} 
            loading="eager"
            fetchPriority="high"
            className="absolute inset-[-10%] w-[120%] h-[120%] object-cover transition-transform duration-[5s] ease-out translate-y-8 group-hover:translate-y-0 group-hover:scale-105 group-hover:rotate-1"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700" />
        </div>

        <div className="absolute right-10 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] translate-x-8 group-hover:translate-x-0 z-20" style={{ transform: "translateZ(80px)" }}>
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-white shadow-[0_0_30px_rgba(0,102,255,0.5)]">
            <ArrowUpRight size={32} className="group-hover:rotate-45 transition-transform duration-500" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProjectList = () => {
  const projects = [
    { title: "The Monolith", category: "Residential", year: "2024", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=60&w=1200" },
    { title: "Glass Pavilion", category: "Commercial", year: "2025", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=60&w=1200" },
    { title: "Urban Oasis", category: "Mixed Use", year: "2026", image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=60&w=1200" },
    { title: "Brutalist Sky", category: "Hospitality", year: "2026", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=60&w=1200" },
  ];

  return (
    <section className="max-w-[1600px] mx-auto py-20">
      <div className="px-4 md:px-8 mb-20 flex justify-between items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent block mb-4">Selected Works</span>
          <h2 className="text-5xl md:text-7xl leading-none">ARCHITECTURAL<br/><span className="font-serif italic">Milestones.</span></h2>
        </div>
        <Link to="/projects" className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-accent transition-colors">
          View All <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="border-t border-foreground/10">
        {projects.map((p, i) => (
          <ProjectItem 
            key={i} 
            title={p.title}
            category={p.category}
            year={p.year}
            image={p.image}
          />
        ))}
      </div>
    </section>
  );
};

const ParallaxSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5]);

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden bg-black text-white">
      <motion.div style={{ y }} className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&q=80&w=2070" 
          alt="Abstract Architecture"
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
      </motion.div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <motion.p 
          style={{ opacity }}
          className="text-3xl md:text-6xl font-serif italic leading-tight drop-shadow-2xl"
        >
          "Architecture is the learned game, correct and magnificent, of forms assembled in the light."
        </motion.p>
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: "100px" }}
          className="h-[1px] bg-accent mx-auto mt-12"
        />
      </div>
    </section>
  );
};

const ExpertiseCard = ({ item, index }: { item: { title: string, desc: string }, index: number, key?: number | string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = () => {
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rectRef.current) return;
    const rect = rectRef.current;
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    rectRef.current = null;
  };

  return (
    <motion.div 
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
      className="group cursor-pointer"
    >
      <motion.div
        whileTap={{ scale: 0.98 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="p-8 border border-foreground/10 hover:border-accent transition-all duration-500 bg-white/50 backdrop-blur-sm relative overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-accent/20 h-full"
      >
        <div className="absolute inset-0 bg-accent/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ transform: "translateZ(-10px)" }} />
        <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
          <div className="text-4xl font-serif italic text-accent mb-6 group-hover:scale-110 origin-left transition-transform duration-500">0{index + 1}</div>
          <h4 className="text-xl font-bold mb-4 group-hover:text-accent transition-colors">{item.title}</h4>
          <p className="text-sm text-foreground/60">{item.desc}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ExpertiseSection = () => {
  const expertise = [
    { title: "Structural Engineering", desc: "Pushing the boundaries of physics to create impossible forms." },
    { title: "Spatial Aesthetics", desc: "Designing environments that evoke emotion and inspire." },
    { title: "Urban Masterplanning", desc: "Redefining cityscapes with sustainable, high-density solutions." }
  ];

  return (
    <section className="max-w-[1600px] mx-auto py-20 md:py-32 px-4 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        <div className="md:col-span-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent block mb-4">Core Competencies</span>
          <h2 className="text-5xl font-serif italic mb-8">Architectural<br/>Expertise.</h2>
        </div>
        <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {expertise.map((item, i) => (
            <ExpertiseCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const MetricsSection = () => {
  return (
    <section className="bg-foreground text-background py-32 overflow-hidden relative">
      <div className="absolute inset-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=2070" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-background/20 text-center md:text-left">
          <div className="p-8">
            <div className="text-6xl md:text-8xl font-black text-accent mb-4">14.2K</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-background/60">SQFT Engineered</div>
          </div>
          <div className="p-8">
            <div className="text-6xl md:text-8xl font-black text-accent mb-4">24+</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-background/60">Global Awards</div>
          </div>
          <div className="p-8">
            <div className="text-6xl md:text-8xl font-black text-accent mb-4">03</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-background/60">Continents</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const JournalSection = () => {
  return (
    <section className="max-w-[1600px] mx-auto py-32 px-4 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent block mb-4">Journal</span>
          <h2 className="text-5xl font-serif italic mb-8">Technical<br/>Readouts.</h2>
          <p className="text-foreground/60 leading-relaxed mb-8">
            Exploring the intersection of brutalist aesthetics and modern structural engineering in the heart of Uttar Pradesh.
          </p>
          <Link to="/journal" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-accent transition-colors">
            Read Journal <ArrowUpRight size={16} />
          </Link>
        </div>
        
        <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { date: "MAR 12", title: "The Ethics of Concrete", desc: "A deep dive into sustainable brutalism." },
            { date: "FEB 28", title: "Lucknow's New Skyline", desc: "Redefining the heritage city with glass." },
          ].map((post, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -10, rotateX: 2, rotateY: 2, scale: 1.02 }}
              style={{ perspective: 1000 }}
              className="p-8 border border-foreground/10 hover:border-accent transition-all duration-500 group cursor-pointer bg-white/50 backdrop-blur-sm relative overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-accent/20"
            >
              <div className="absolute inset-0 bg-accent/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <div className="relative z-10">
                <span className="text-[10px] font-mono text-accent mb-4 block">{post.date}</span>
                <h4 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors">{post.title}</h4>
                <p className="text-sm text-foreground/60 mb-8">{post.desc}</p>
                <Plus className="text-foreground/20 group-hover:text-accent group-hover:rotate-90 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <>
      <footer className="bg-foreground text-background pt-32 pb-20 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=2070" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-32">
            <div>
              <h2 className="text-6xl md:text-8xl font-serif italic mb-12 hover:text-accent transition-colors cursor-pointer">
                Let's build<br/>together.
              </h2>
              <div className="flex flex-wrap gap-4">
                {["Instagram", "LinkedIn", "Twitter", "Behance"].map((social) => (
                  <a key={social} href="#" className="text-[10px] font-bold uppercase tracking-[0.3em] border border-background/20 px-6 py-2 rounded-full hover:bg-background hover:text-foreground transition-all">
                    {social}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col justify-end items-start md:items-end gap-8">
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-background/50 mb-2">Office</p>
                <p className="text-xl">Lucknow, Uttar Pradesh<br/>India, 226001</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-background/50 mb-2">Inquiries</p>
                <p className="text-xl">hello@3axisarc.com<br/>+91 522 3344 556</p>
              </div>
            </div>
          </div>

          <div className="relative h-[20vw] flex items-center justify-center mb-20">
            <h2 className="text-[25vw] font-black text-background/5 uppercase leading-none select-none">
              3AXIS ARC
            </h2>
          </div>
        </div>
      </footer>

      {/* Mini Footer */}
      <div className="fixed bottom-0 left-0 w-full h-10 bg-background border-t border-zinc-300 flex items-center justify-between px-10 z-[100] text-[9px] tracking-[0.2em] opacity-60 uppercase">
        <div>&copy; 2026 3AXIS ARC INDUSTRIAL DIV.</div>
        <div>OPERATIONAL STATUS: NOMINAL</div>
        <div>LUCKNOW • UTTAR PRADESH</div>
      </div>
    </>
  );
};

// --- Pages ---

const InquirePage = () => {
  usePageTitle("Inquire | 3axis Arc");

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="pt-32 pb-20 min-h-screen flex items-center relative overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=2070" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 w-full grid grid-cols-1 md:grid-cols-2 gap-20 relative z-10">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-6 leading-[0.85]">
              Initiate <br/><span className="font-serif italic font-normal text-stroke">Dialogue</span>
            </h1>
            <p className="text-xl max-w-md text-foreground/60">
              Engage with our architectural division for commissions, consultations, and structural inquiries.
            </p>
          </motion.div>
        </div>
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-8 bg-background/50 backdrop-blur-xl p-10 border border-foreground/10"
        >
          <div className="relative group">
            <input type="text" placeholder="Name" className="w-full bg-transparent border-b border-foreground/20 py-4 outline-none focus:border-foreground transition-colors peer text-lg" />
            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent transition-all duration-500 peer-focus:w-full" />
          </div>
          <div className="relative group">
            <input type="email" placeholder="Email" className="w-full bg-transparent border-b border-foreground/20 py-4 outline-none focus:border-foreground transition-colors peer text-lg" />
            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent transition-all duration-500 peer-focus:w-full" />
          </div>
          <div className="relative group">
            <textarea placeholder="Project Details" rows={4} className="w-full bg-transparent border-b border-foreground/20 py-4 outline-none focus:border-foreground transition-colors peer resize-none text-lg" />
            <div className="absolute bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-500 peer-focus:w-full" />
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            className="bg-foreground text-background py-5 px-10 text-[10px] font-bold uppercase tracking-[0.3em] w-fit flex items-center gap-2 group relative overflow-hidden mt-4"
          >
            <span className="relative z-10 flex items-center gap-2 group-hover:text-background transition-colors duration-500">
              Submit Inquiry <ArrowUpRight className="group-hover:rotate-45 transition-transform duration-500" />
            </span>
            <div className="absolute inset-0 bg-accent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
          </motion.button>
        </motion.div>
      </div>
    </motion.main>
  );
};

const HomePage = () => {
  usePageTitle("3axis Arc | Architectural Real Estate");

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <Marquee />
      <ProjectList />
      <ExpertiseSection />
      <ParallaxSection />
      <MetricsSection />
      <JournalSection />
    </motion.main>
  );
};

const ProjectsPage = () => {
  usePageTitle("Projects | 3axis Arc");

  const allProjects = [
    { title: "The Monolith", category: "Residential", year: "2024", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=60&w=1200" },
    { title: "Glass Pavilion", category: "Commercial", year: "2025", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=60&w=1200" },
    { title: "Urban Oasis", category: "Mixed Use", year: "2026", image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=60&w=1200" },
    { title: "Brutalist Sky", category: "Hospitality", year: "2026", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=60&w=1200" },
    { title: "Echo Chamber", category: "Cultural", year: "2027", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=60&w=1200" },
    { title: "Vertex Tower", category: "Commercial", year: "2027", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=60&w=1200" },
  ];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-20 max-w-[1600px] mx-auto"
    >
      <div className="px-4 md:px-8 mb-20">
        <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-6">All <span className="font-serif italic font-normal text-stroke">Projects</span></h1>
        <p className="text-xl max-w-2xl text-foreground/60">A comprehensive archive of our structural interventions and architectural milestones across the region.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-8">
        {allProjects.map((p, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative h-[600px] overflow-hidden cursor-pointer"
          >
            <img 
              src={p.image} 
              alt={p.title} 
              className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="absolute bottom-0 left-0 w-full p-8 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-mono text-accent mb-2 block">{p.year} // {p.category}</span>
                  <h3 className="text-4xl font-serif italic">{p.title}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-accent transition-colors">
                  <ArrowUpRight size={24} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.main>
  );
};

const PhilosophyPage = () => {
  usePageTitle("Our Philosophy | 3axis Arc");

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-20"
    >
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 mb-20">
        <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-6">Our <span className="font-serif italic font-normal text-stroke">Philosophy</span></h1>
      </div>

      <div className="relative h-[70vh] w-full overflow-hidden mb-32">
        <img 
          src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=2070" 
          alt="Philosophy" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Play size={80} className="text-white opacity-80 hover:opacity-100 hover:scale-110 transition-all cursor-pointer drop-shadow-2xl" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
        <h2 className="text-4xl md:text-6xl font-serif italic mb-12 leading-tight">
          "We do not just build structures; we engineer the spatial experiences of tomorrow."
        </h2>
        <p className="text-lg text-foreground/70 leading-relaxed mb-8">
          At 3axis Arc, we believe that architecture is the ultimate synthesis of art and engineering. Our approach is rooted in the principles of structural honesty, material integrity, and spatial poetry. We design for the future while remaining deeply connected to the cultural and environmental context of our sites.
        </p>
        <p className="text-lg text-foreground/70 leading-relaxed">
          Every project is a rigorous exploration of form, light, and materiality. We reject the superficial in favor of the essential, creating spaces that are both monumental and deeply human.
        </p>
      </div>
    </motion.main>
  );
};

const JournalCard = ({ post }: { post: { date: string, title: string, category: string, image: string }, key?: number | string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = () => {
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rectRef.current) return;
    const rect = rectRef.current;
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    rectRef.current = null;
  };

  return (
    <motion.div 
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
      className="group cursor-pointer border-b border-foreground/10 py-12"
    >
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="flex flex-col md:flex-row items-center gap-12"
      >
        <div className="w-full md:w-1/3 h-[250px] overflow-hidden relative rounded-lg" style={{ transform: "translateZ(30px)" }}>
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-accent/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <div className="w-full md:w-2/3" style={{ transform: "translateZ(60px)" }}>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-[10px] font-mono text-accent">{post.date}</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">{post.category}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif italic mb-6 group-hover:text-accent transition-colors origin-left group-hover:scale-[1.02] duration-500">{post.title}</h2>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60 group-hover:text-foreground transition-colors">
            Read Article <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-500" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const JournalPage = () => {
  usePageTitle("Technical Journal | 3axis Arc");

  const posts = [
    { date: "MAR 12, 2026", title: "The Ethics of Concrete", category: "Materials", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=2069" },
    { date: "FEB 28, 2026", title: "Lucknow's New Skyline", category: "Urbanism", image: "https://images.unsplash.com/photo-1449156001935-d28bc1dc7281?auto=format&fit=crop&q=80&w=2070" },
    { date: "JAN 15, 2026", title: "Light as a Structural Element", category: "Design", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069" },
    { date: "NOV 04, 2025", title: "The Future of Brutalism", category: "Theory", image: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&q=80&w=2070" },
  ];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-20 max-w-[1600px] mx-auto"
    >
      <div className="px-4 md:px-8 mb-20">
        <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-6">Technical <span className="font-serif italic font-normal text-stroke">Journal</span></h1>
      </div>

      <div className="px-4 md:px-8">
        {posts.map((post, i) => (
          <JournalCard key={i} post={post} />
        ))}
      </div>
    </motion.main>
  );
};

// --- 404 Page ---
const NotFoundPage = () => {
  usePageTitle("404 | 3axis Arc");

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-20 min-h-screen flex items-center justify-center"
    >
      <div className="text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[15vw] font-black text-accent leading-none mb-4"
        >
          404
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl md:text-4xl font-serif italic text-foreground/60 mb-12"
        >
          Structure not found.
        </motion.p>
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-10 py-5 bg-foreground text-background overflow-hidden"
          >
            <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2">
              Return to Base <ArrowUpRight className="group-hover:rotate-45 transition-transform duration-500" />
            </span>
          </motion.button>
        </Link>
      </div>
    </motion.main>
  );
};

// --- Main App ---

export default function App() {
  const preloadImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=60&w=1200",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=60&w=1200",
    "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=60&w=1200",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=60&w=1200"
  ];

  return (
    <Router>
      <Preloader images={preloadImages} />
      <ScrollToTop />
      <div className="relative min-h-screen pb-10"> {/* pb-10 to account for mini footer */}
        <NoiseOverlay />
        <StructuralGrid />
        <Header />
        
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/philosophy" element={<PhilosophyPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/inquire" element={<InquirePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>

        <Footer />
      </div>
    </Router>
  );
}
