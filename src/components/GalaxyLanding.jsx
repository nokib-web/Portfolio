import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { personas } from '../data/personasData';

const GalaxyLanding = ({ onViewModeChange }) => {
  const navigate = useNavigate();
  const [hoveredPersona, setHoveredPersona] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [stars, setStars] = useState([]);

  // Generate stars on mount so they don't jump around on re-renders
  useEffect(() => {
    const newStars = Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 1.5 + 1,
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 2,
    }));
    setStars(newStars);
  }, []);

  const handlePlanetClick = (route) => {
    setIsNavigating(true);
    // Smooth transition delay before actually routing
    setTimeout(() => {
      navigate(route);
    }, 850);
  };

  // Find angle coordinates for SVG constellation line
  const getConstellationCoords = () => {
    if (!hoveredPersona) return null;
    const index = personas.findIndex((p) => p.id === hoveredPersona.id);
    const angle = (index / personas.length) * 2 * Math.PI - Math.PI / 2;
    const radius = 35; // orbit radius percentage
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
        scale: isNavigating ? 3.5 : 1,
        opacity: isNavigating ? 0 : 1,
        filter: isNavigating ? 'blur(15px)' : 'blur(0px)',
      }}
      transition={{ duration: 0.85, ease: 'easeInOut' }}
    >
      {/* Background Twinkling Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full pointer-events-none"
          style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
          animate={{ opacity: [0.1, 0.85, 0.1] }}
          transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
        />
      ))}

      {/* Floating Ambient Nebulae */}
      <div className="absolute top-1/2 left-1/2 w-[85vmin] h-[85vmin] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none animate-nebula-float-1" />
      <div className="absolute top-1/2 left-1/2 w-[55vmin] h-[55vmin] bg-fuchsia-600/10 rounded-full blur-[90px] pointer-events-none animate-nebula-float-2" />

      {/* Header Info */}
      <div className="absolute top-8 left-8 z-30">
        <h2 className="text-lg md:text-xl font-bold tracking-[0.25em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400">
          Nazmul Hasan Nokib
        </h2>
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] mt-1">
          Interactive Portfolio
        </p>
      </div>

      {/* View Switcher Toggle */}
      <div className="absolute top-8 right-8 z-30">
        <button
          onClick={onViewModeChange}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-semibold uppercase tracking-widest transition-all duration-300 backdrop-blur-md shadow-lg"
        >
          <span className="material-icons-outlined text-sm">grid_view</span>
          <span>Classic Grid</span>
        </button>
      </div>

      {/* Orbit Rings (Beneath everything) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vmin] h-[70vmin] rounded-full border border-dashed border-indigo-500/10 pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vmin] h-[70vmin] rounded-full border border-indigo-500/5 pointer-events-none z-0 scale-[1.03]" />

      {/* Outer Orbit Area */}
      <div className="relative w-[80vmin] h-[80vmin] max-w-4xl max-h-4xl flex items-center justify-center">

        {/* Rotating Planets Container */}
        <div
          className="absolute inset-0 animate-galaxy-spin"
          style={{ animationPlayState: hoveredPersona ? 'paused' : 'running' }}
        >
          {/* SVG Constellation Line (inside the rotating space so it aligns automatically) */}
          {hoveredPersona && coords && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <motion.line
                x1="50%"
                y1="50%"
                x2={coords.x2}
                y2={coords.y2}
                stroke="url(#constellation-glow)"
                strokeWidth="1.5"
                strokeDasharray="4 6"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="constellation-glow" x1="50%" y1="50%" x2={coords.x2} y2={coords.y2} gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.1" />
                  <stop offset="60%" stopColor="#c084fc" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.9" />
                </linearGradient>
              </defs>
            </svg>
          )}

          {personas.map((persona, index) => {
            const angle = (index / personas.length) * 2 * Math.PI - Math.PI / 2;
            const radius = 35; // percentage
            const left = `calc(50% + ${Math.cos(angle) * radius}%)`;
            const top = `calc(50% + ${Math.sin(angle) * radius}%)`;
            const Icon = persona.icon;

            return (
              <div
                key={persona.id}
                className="absolute flex flex-col items-center justify-center cursor-pointer group z-10 animate-planet-counter-spin"
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
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.05)] group-hover:scale-110 transition-all duration-500 overflow-hidden ring-1 ring-white/10 group-hover:ring-white/40 group-hover:shadow-[0_0_50px_rgba(244,63,94,0.25)]">
                  {/* Planet Texture Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${persona.theme.gradient} opacity-85 group-hover:opacity-100 transition-opacity duration-300`} />

                  {/* Atmosphere Glow */}
                  <div className="absolute inset-0 rounded-full shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.65),inset_8px_8px_16px_rgba(255,255,255,0.45)] pointer-events-none" />

                  {/* Rotating Atmosphere/Texture (Simulated with rotating radial reflection overlay) */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/15 via-transparent to-transparent opacity-80" />

                  {/* Icon */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Icon className="text-3xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>

                {/* Planet Label */}
                <span className="mt-4 text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-slate-400 group-hover:text-white transition-colors duration-300">
                  {persona.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Central Info / Description Panel (Non-rotating) */}
        <AnimatePresence mode="wait">
          {hoveredPersona ? (
            <motion.div
              key="description"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="absolute w-64 md:w-80 p-8 bg-slate-950/80 border border-slate-800/80 backdrop-blur-xl rounded-3xl text-center pointer-events-none z-20 shadow-[0_0_60px_rgba(0,0,0,0.85)]"
            >
              <h3 className={`text-xl font-black mb-3 bg-clip-text text-transparent bg-gradient-to-r ${hoveredPersona.theme.gradient} tracking-wide`}>
                {hoveredPersona.title}
              </h3>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] mb-3">
                {hoveredPersona.tagline}
              </p>
              <p className="text-slate-300 text-sm leading-relaxed font-light font-body">
                {hoveredPersona.description}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="instruction"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute pointer-events-none z-0 flex flex-col items-center justify-center text-center"
            >
              <div className="text-indigo-500/10 text-9xl material-icons-outlined select-none animate-pulse">
                language
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Footer Helper text */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500 text-[10px] uppercase tracking-[0.4em] pointer-events-none text-center w-full px-4"
      >
        Hover over a planet to scan • Click to land
      </motion.div>
    </motion.div>
  );
};

export default GalaxyLanding;
