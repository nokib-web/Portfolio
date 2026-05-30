import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { personas } from '../data/personasData';

const SelectPersona = ({ onViewModeChange }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden font-sans">
      {/* Dynamic blurred glow background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]" />

      {/* View Switcher Toggle */}
      <div className="absolute top-8 right-8 z-30">
        <button
          onClick={onViewModeChange}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-full border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700/60 text-slate-350 hover:text-white text-xs font-semibold uppercase tracking-widest transition-all duration-300 backdrop-blur-md shadow-lg"
        >
          <span className="material-icons-outlined text-sm">auto_awesome</span>
          <span>Galaxy Layout</span>
        </button>
      </div>


      <div className="z-10 text-center max-w-2xl mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-slate-300 to-slate-400"
        >
          Select a Persona
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-slate-400 text-lg md:text-xl font-light"
        >
          Explore this portfolio through different perspectives tailored to specific contexts.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full z-10">
        {personas.map((persona, index) => {
          const Icon = persona.icon;
          return (
            <motion.div
              key={persona.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(persona.route)}
              className="cursor-pointer group relative rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/85 hover:border-slate-700/80 backdrop-blur-md p-6 flex flex-col justify-between h-80 shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Subtle top hover line using persona gradient */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${persona.theme.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />

              <div>
                <div className={`w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:${persona.theme.gradient} transition-all duration-300`}>
                  <Icon className={`text-2xl ${persona.iconColor} group-hover:text-white transition-colors duration-300`} />
                </div>
                
                <h2 className="text-xl font-bold mb-2 text-slate-100 group-hover:text-white transition-colors duration-300">
                  {persona.title}
                </h2>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-4 group-hover:text-slate-300 transition-colors duration-300 font-light line-clamp-3">
                  {persona.description}
                </p>
              </div>

              <div className="flex items-center space-x-2 text-slate-400 font-medium text-sm group-hover:text-white transition-colors duration-300">
                <span>View Portfolio</span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectPersona;
