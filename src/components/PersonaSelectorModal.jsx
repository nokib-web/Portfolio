import React from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { personas } from '../data/personasData';

const PersonaSelectorModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

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
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative bg-slate-900/90 border border-slate-800 rounded-2xl w-full max-w-4xl p-8 shadow-2xl z-10 overflow-hidden font-sans text-white max-h-[90vh] flex flex-col"
          >
            {/* Neon corner gradients */}
            <div className="absolute top-0 left-0 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800/60 transition-colors duration-300"
              aria-label="Close modal"
            >
              <span className="material-icons-outlined text-2xl">close</span>
            </button>

            {/* Header */}
            <div className="text-center mb-8 shrink-0">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
                Switch Persona
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Select a view to tailor the portfolio details towards your specific requirement.
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-1">
              {personas.map((p) => {
                const Icon = p.icon;
                return (
                  <motion.div
                    key={p.id}
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      navigate(p.route);
                      onClose();
                    }}
                    className="cursor-pointer group relative rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700/80 p-5 flex flex-col justify-between h-48 shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${p.theme.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />

                    <div>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-800/80 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-slate-700 group-hover:to-slate-800">
                          <Icon className={`text-lg ${p.iconColor}`} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors duration-300">
                          {p.title}
                        </h3>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed group-hover:text-slate-300 transition-colors duration-300 font-light line-clamp-2">
                        {p.description}
                      </p>
                    </div>

                    <div className="flex items-center space-x-1.5 text-slate-400 font-medium text-xs group-hover:text-white transition-colors duration-300 mt-2">
                      <span>Activate</span>
                      <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default PersonaSelectorModal;
