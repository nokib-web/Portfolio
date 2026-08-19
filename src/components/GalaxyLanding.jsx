import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { personas } from '../data/personasData';
import ImageGlobe from './ImageGlobe';

const GalaxyLanding = ({ onViewModeChange }) => {
  const navigate = useNavigate();
  const [hoveredPersona, setHoveredPersona] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [stars, setStars] = useState([]);

  // Generate static positions for twinkling stars
  useEffect(() => {
    const starColors = ['#ffffff', '#a5b4fc', '#fde047', '#f472b6', '#38bdf8'];
    const newStars = Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 1.8 + 0.8,
      color: starColors[Math.floor(Math.random() * starColors.length)],
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 2,
    }));
    setStars(newStars);
  }, []);

  const handlePlanetClick = (route) => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate(route);
    }, 600);
  };

  // Find angle coordinates for constellation line
  const getConstellationCoords = () => {
    if (!hoveredPersona) return null;
    const index = personas.findIndex((p) => p.id === hoveredPersona.id);
    const angle = (index / personas.length) * 2 * Math.PI - Math.PI / 2;
    const radius = 38;
    return {
      x2: `${50 + Math.cos(angle) * radius}%`,
      y2: `${50 + Math.sin(angle) * radius}%`,
    };
  };

  const coords = getConstellationCoords();

  return (
    <motion.div
      className="relative w-full h-screen bg-[#020207] overflow-hidden flex flex-col items-center justify-center font-sans text-white select-none"
      animate={{
        scale: isNavigating ? 3.0 : 1,
        opacity: isNavigating ? 0 : 1,
        filter: isNavigating ? 'blur(15px)' : 'blur(0px)',
      }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {/* ── BACKGROUND TWINKLING STARS ────────────────────────────── */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            backgroundColor: star.color,
            boxShadow: star.size > 1.8 ? `0 0 5px ${star.color}` : 'none',
          }}
          animate={{ opacity: [0.15, 0.9, 0.15] }}
          transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
        />
      ))}

      {/* ── AMBIENT NEBULAE GLOW ──────────────────────────────────── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vmin] h-[80vmin] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vmin] h-[55vmin] bg-fuchsia-600/10 rounded-full blur-[90px] pointer-events-none" />

      {/* ── HEADER INFO ───────────────────────────────────────────── */}
      <div className="absolute top-6 left-4 md:top-8 md:left-8 z-30 max-w-[60%] md:max-w-none">
        <h1 className="text-sm md:text-xl font-bold tracking-[0.2em] md:tracking-[0.25em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 leading-tight">
          Nazmul Hasan Nokib
        </h1>
        <p className="text-[8px] md:text-[10px] text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.3em] mt-1 font-mono">
          Interactive Universe Portfolio
        </p>
      </div>

      {/* ── VIEW SWITCHER TOGGLE ──────────────────────────────────── */}
      <div className="absolute top-6 right-4 md:top-8 md:right-8 z-30">
        <button
          onClick={onViewModeChange}
          className="flex items-center space-x-1.5 md:space-x-2 px-3 py-2 md:px-4 md:py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 hover:border-white/20 text-slate-300 hover:text-white text-[10px] md:text-xs font-semibold uppercase tracking-widest transition-all duration-300 backdrop-blur-md shadow-lg cursor-pointer"
        >
          <span className="material-icons-outlined text-sm">grid_view</span>
          <span className="hidden sm:inline">Classic Grid</span>
        </button>
      </div>

      {/* ── CENTRAL 3D GLOBE ──────────────────────────────────────── */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto z-10 overflow-hidden">
        <ImageGlobe activePersona={hoveredPersona} />
      </div>

      {/* ── STABLE ORBIT & PLANET NODES ───────────────────────────── */}
      <div className="relative w-[92vw] h-[92vw] sm:w-[78vmin] sm:h-[78vmin] md:w-[80vmin] md:h-[80vmin] max-w-4xl max-h-4xl flex items-center justify-center pointer-events-none z-20">
        
        {/* Orbit Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[76%] h-[76%] rounded-full border border-dashed border-indigo-500/20 pointer-events-none z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[76%] h-[76%] rounded-full border border-indigo-500/10 pointer-events-none z-0 scale-[1.03]" />

        {/* Rotating Planets Container */}
        <div
          className="absolute inset-0 animate-galaxy-spin pointer-events-none"
          style={{ animationPlayState: hoveredPersona ? 'paused' : 'running' }}
        >
          {/* SVG Constellation Line */}
          {hoveredPersona && coords && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <motion.line
                x1="50%"
                y1="50%"
                x2={coords.x2}
                y2={coords.y2}
                stroke="url(#constellation-glow)"
                strokeWidth="2"
                strokeDasharray="4 6"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.8 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="constellation-glow" x1="50%" y1="50%" x2={coords.x2} y2={coords.y2} gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                  <stop offset="60%" stopColor="#c084fc" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.9" />
                </linearGradient>
              </defs>
            </svg>
          )}

          {personas.map((persona, index) => {
            const angle = (index / personas.length) * 2 * Math.PI - Math.PI / 2;
            const radius = 38;
            const left = `calc(50% + ${Math.cos(angle) * radius}%)`;
            const top = `calc(50% + ${Math.sin(angle) * radius}%)`;
            const Icon = persona.icon;
            const isHovered = hoveredPersona?.id === persona.id;

            return (
              <div
                key={persona.id}
                className="absolute flex flex-col items-center justify-center cursor-pointer group z-30 animate-planet-counter-spin pointer-events-auto -translate-x-1/2 -translate-y-1/2"
                style={{
                  top,
                  left,
                  animationPlayState: hoveredPersona ? 'paused' : 'running',
                }}
                onMouseEnter={() => setHoveredPersona(persona)}
                onMouseLeave={() => setHoveredPersona(null)}
                onClick={() => handlePlanetClick(persona.route)}
              >
                {/* Celestial Planet Body */}
                <div className={`relative w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full transition-all duration-300 overflow-hidden ring-1 ${
                  isHovered
                    ? 'scale-115 ring-white/60 shadow-[0_0_40px_rgba(99,102,241,0.5)]'
                    : 'ring-white/20 group-hover:scale-110 group-hover:ring-white/50 shadow-[0_0_25px_rgba(99,102,241,0.15)]'
                }`}>
                  {/* Planet Texture Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${persona.theme.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />

                  {/* Atmosphere Glow */}
                  <div className="absolute inset-0 rounded-full shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.65),inset_8px_8px_16px_rgba(255,255,255,0.45)] pointer-events-none" />

                  {/* Specular Sheen */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-85 pointer-events-none" />

                  {/* Icon */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Icon className="text-xl sm:text-2xl md:text-3xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>

                {/* Planet Label */}
                <span className="mt-2 text-[9px] sm:text-xs md:text-sm font-bold tracking-[0.15em] uppercase text-slate-300 group-hover:text-white transition-colors duration-300 text-center max-w-[70px] sm:max-w-[100px] md:max-w-none break-words leading-tight">
                  {persona.title}
                </span>
              </div>
            );
          })}
        </div>

      </div>

      {/* ── CENTER FLOATING DESCRIPTION CARD (PERFECTLY CENTERED OVER GLOBE) ── */}
      <AnimatePresence>
        {hoveredPersona && (
          <motion.div
            key="description"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute w-72 sm:w-80 p-6 sm:p-7 bg-slate-950/90 border border-indigo-500/30 backdrop-blur-xl rounded-3xl text-center pointer-events-none z-30 shadow-[0_0_50px_rgba(99,102,241,0.25)]"
          >
            <h3 className={`text-xl sm:text-2xl font-black mb-2 pb-1 leading-relaxed bg-clip-text text-transparent bg-gradient-to-r ${hoveredPersona.theme.gradient} tracking-wide uppercase`}>
              {hoveredPersona.title}
            </h3>
            <p className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-[0.2em] mb-3">
              {hoveredPersona.tagline}
            </p>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal font-sans">
              {hoveredPersona.description}
            </p>
            <div className="mt-4 pt-3 border-t border-white/10 text-[10px] font-mono text-indigo-300 font-bold uppercase tracking-wider">
              CLICK TO ENTER →
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FOOTER HELPER GUIDANCE ───────────────────────────────── */}
      <div className="absolute bottom-6 w-full flex justify-center md:justify-end md:bottom-8 md:pr-8 pointer-events-none z-30">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-slate-400 text-[8px] md:text-[10px] uppercase tracking-[0.2em] flex items-center space-x-1.5 md:space-x-2 bg-white/5 border border-white/10 px-3.5 py-2 md:px-4 md:py-2.5 rounded-full backdrop-blur-md shadow-lg whitespace-nowrap font-mono"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping shrink-0" />
          <span>Hover to explore • Click to enter</span>
        </motion.div>
      </div>

    </motion.div>
  );
};

export default GalaxyLanding;
