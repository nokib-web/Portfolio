import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { personas } from '../data/personasData';

const PersonaSelectorModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [hoveredPersona, setHoveredPersona] = useState(null);

  // Find angle coordinates for SVG constellation line inside the orbit container
  const getConstellationCoords = () => {
    if (!hoveredPersona) return null;
    const index = personas.findIndex((p) => p.id === hoveredPersona.id);
    const angle = (index / personas.length) * 2 * Math.PI - Math.PI / 2;
    const radius = 50; // percentage of rotating container radius
    return {
      x2: `${50 + Math.cos(angle) * radius}%`,
      y2: `${50 + Math.sin(angle) * radius}%`,
    };
  };

  const coords = getConstellationCoords();

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
          />

          {/* Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative bg-slate-900/95 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 md:p-8 shadow-2xl z-10 overflow-hidden font-sans text-white max-h-[90vh] flex flex-col items-center"
          >
            {/* Neon corner gradients */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800/60 transition-colors duration-300 z-30"
              aria-label="Close modal"
            >
              <span className="material-icons-outlined text-xl">close</span>
            </button>

            {/* Header */}
            <div className="text-center mb-4 shrink-0 z-10">
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
                Switch Persona
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Select a view to tailor the portfolio details towards your specific requirement.
              </p>
            </div>

            {/* Galaxy Container */}
            <div className="relative w-full h-[320px] md:h-[380px] flex items-center justify-center overflow-hidden shrink-0">
              {/* Floating Ambient Nebulae */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] bg-indigo-600/5 rounded-full blur-[60px] pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] bg-fuchsia-600/5 rounded-full blur-[50px] pointer-events-none" />

              {/* Orbit Rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[260px] md:h-[260px] rounded-full border border-dashed border-indigo-500/10 pointer-events-none z-0" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[260px] md:h-[260px] rounded-full border border-indigo-500/5 pointer-events-none z-0 scale-[1.03]" />

              {/* Rotating Planets Container */}
              <div
                className="absolute w-[200px] h-[200px] md:w-[260px] md:h-[260px] animate-galaxy-spin"
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
                      stroke="url(#modal-constellation-glow)"
                      strokeWidth="1.2"
                      strokeDasharray="3 5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.7 }}
                      transition={{ duration: 0.3 }}
                    />
                    <defs>
                      <linearGradient id="modal-constellation-glow" x1="50%" y1="50%" x2={coords.x2} y2={coords.y2} gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.1" />
                        <stop offset="60%" stopColor="#c084fc" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.9" />
                      </linearGradient>
                    </defs>
                  </svg>
                )}

                {/* Planet Nodes */}
                {personas.map((persona, index) => {
                  const angle = (index / personas.length) * 2 * Math.PI - Math.PI / 2;
                  const radius = 50; // percentage
                  const left = `calc(50% + ${Math.cos(angle) * radius}%)`;
                  const top = `calc(50% + ${Math.sin(angle) * radius}%)`;
                  const Icon = persona.icon;

                  return (
                    <div
                      key={persona.id}
                      className="absolute flex flex-col items-center justify-center cursor-pointer group z-10 animate-planet-counter-spin -translate-x-1/2 -translate-y-1/2"
                      style={{
                        top,
                        left,
                        animationPlayState: hoveredPersona ? 'paused' : 'running',
                      }}
                      onMouseEnter={() => setHoveredPersona(persona)}
                      onMouseLeave={() => setHoveredPersona(null)}
                      onClick={() => {
                        navigate(persona.route);
                        onClose();
                      }}
                    >
                      {/* Celestial Planet Body */}
                      <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.05)] group-hover:scale-110 transition-all duration-300 overflow-hidden ring-1 ring-white/10 group-hover:ring-white/40 group-hover:shadow-[0_0_25px_rgba(244,63,94,0.2)]">
                        {/* Planet Texture Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${persona.theme.gradient} opacity-85 group-hover:opacity-100 transition-opacity duration-300`} />

                        {/* Atmosphere Glow */}
                        <div className="absolute inset-0 rounded-full shadow-[inset_-6px_-6px_12px_rgba(0,0,0,0.65),inset_5px_5px_10px_rgba(255,255,255,0.45)] pointer-events-none" />

                        {/* Rotating Atmosphere Reflection */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/15 via-transparent to-transparent opacity-85" />

                        {/* Icon */}
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <Icon className="text-xl md:text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      </div>

                      {/* Label */}
                      <span className="mt-2 text-[9px] md:text-[10px] font-bold tracking-wider uppercase text-slate-400 group-hover:text-white transition-colors duration-300 whitespace-nowrap">
                        {persona.title.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Central Description Box (Non-rotating) */}
              <AnimatePresence mode="wait">
                {hoveredPersona ? (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute w-36 md:w-48 p-4 bg-slate-950/85 border border-slate-800/80 backdrop-blur-xl rounded-2xl text-center pointer-events-none z-20 shadow-[0_0_20px_rgba(0,0,0,0.8)]"
                  >
                    <h3 className={`text-xs md:text-sm font-extrabold mb-1 bg-clip-text text-transparent bg-gradient-to-r ${hoveredPersona.theme.gradient} tracking-wide`}>
                      {hoveredPersona.title}
                    </h3>
                    <p className="text-[7px] md:text-[8px] text-indigo-400 font-bold uppercase tracking-wider mb-1">
                      {hoveredPersona.tagline}
                    </p>
                    <p className="text-slate-300 text-[9px] md:text-[10px] leading-relaxed font-light line-clamp-3 md:line-clamp-4">
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
                    <div className="text-indigo-500/10 text-5xl md:text-6xl material-icons-outlined select-none animate-pulse">
                      language
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer scan helper text */}
            <div className="mt-2 text-slate-500 text-[8px] uppercase tracking-[0.3em] pointer-events-none text-center">
              Hover over a planet to scan • Click to land
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default PersonaSelectorModal;
