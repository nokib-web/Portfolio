import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

const SectionLabel = ({ children, icon }) => (
  <div className="flex flex-col items-center gap-3 mb-12 text-center">
    <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center">
      <span className="material-icons-outlined text-base">{icon}</span>
    </div>
    <span className="text-[11px] font-black uppercase tracking-[0.28em] text-rose-500/80">
      {children}
    </span>
    <div className="w-12 h-px bg-gradient-to-r from-transparent via-rose-300/70 dark:via-rose-700/50 to-transparent" />
  </div>
);

const FriendHome = ({ persona }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const waveBars = [10, 22, 14, 30, 18, 26, 12, 34, 16, 28, 20, 14, 24, 10, 22, 16, 30, 12, 18, 26];

  return (
    <div className="font-sans text-stone-700 dark:text-stone-300 bg-[#f8f7f4] dark:bg-stone-950 min-h-screen relative overflow-hidden transition-colors duration-500">

      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[600px] bg-rose-200/20 dark:bg-rose-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-[600px] h-[600px] bg-amber-200/20 dark:bg-amber-900/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#d8d6d0_1px,transparent_1px)] dark:bg-[radial-gradient(#2a2a28_1px,transparent_1px)] [background-size:28px_28px] opacity-50 pointer-events-none" />

      {/* ── All content at 8/12 centered ─────────────────────── */}
      <div className="relative z-10 w-8/12 mx-auto py-20 space-y-32">

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section id="greeting">
          <motion.div {...fadeUp(0)} className="flex flex-col items-center gap-8 text-center">

            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 rounded-3xl overflow-hidden border-2 border-white dark:border-stone-800 shadow-xl">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nokib&backgroundColor=ffdfbf"
                  alt="Nokib"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 border-2 border-white dark:border-stone-950 rounded-full shadow-sm" />
            </div>

            {/* Badge + Name */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] text-rose-500 bg-rose-500/8 border border-rose-500/20 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                Off Duty · Human
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 tracking-tight leading-tight">
                Hey, I'm Nazmul Hasan Nokib
              </h1>
              <p className="text-base font-medium text-stone-400 dark:text-stone-500 border-b border-dashed border-stone-300 dark:border-stone-700 pb-0.5 inline-block">
                {persona.tagline}
              </p>
            </div>

            {/* Bio */}
            <p className="text-lg md:text-xl leading-relaxed text-stone-600/90 dark:text-stone-350/90 font-light max-w-2xl font-body">
              {persona.about}
            </p>

            {/* Voice Note */}
            {persona.voiceNote && (
              <motion.div {...fadeUp(0.2)} className="w-full max-w-2xl">
                <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border border-stone-200/60 dark:border-stone-800/60 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)] overflow-hidden">
                  {/* Player row */}
                  <div className="px-7 pt-6 pb-5 flex items-center gap-5">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-14 h-14 rounded-2xl bg-rose-500 hover:bg-rose-600 active:scale-95 flex items-center justify-center text-white shadow-xl shadow-rose-500/30 transition-all duration-200 flex-shrink-0"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      <span className="material-icons-outlined text-2xl">{isPlaying ? 'pause' : 'play_arrow'}</span>
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-black text-stone-800 dark:text-stone-100">Voice Greeting</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400 dark:text-rose-500">
                            {isPlaying ? 'Playing...' : 'Tap to listen'}
                          </p>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full">
                          {persona.voiceNote.duration}
                        </span>
                      </div>
                      {/* Waveform */}
                      <div className="flex items-end gap-[3px] h-9">
                        {waveBars.map((h, i) => (
                          <motion.div
                            key={i}
                            className="flex-1 rounded-full bg-rose-400/70 dark:bg-rose-500/60"
                            initial={{ height: 3 }}
                            animate={isPlaying ? { height: [h * 0.25, h, h * 0.25] } : { height: 4 }}
                            transition={isPlaying ? { duration: 1.1, repeat: Infinity, repeatType: 'reverse', delay: i * 0.05, ease: 'easeInOut' } : { duration: 0.3 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Transcript */}
                  <div className="mx-7 mb-6 bg-stone-50 dark:bg-stone-950/60 rounded-2xl p-5 border border-stone-100 dark:border-stone-800/50">
                    <p className="text-sm text-stone-600 dark:text-stone-400 italic leading-relaxed text-left">
                      "{persona.voiceNote.transcript}"
                    </p>
                    <p className="text-[10px] font-mono font-bold text-stone-400 dark:text-stone-600 mt-3 text-right uppercase tracking-wider">
                      {persona.voiceNote.timestamp}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </section>

        {/* ── TIMELINE ─────────────────────────────────────────── */}
        <section id="moments">
          <SectionLabel icon="auto_awesome">Chapters of My Life</SectionLabel>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {persona.timeline?.map((item, idx) => (
              <motion.div
                key={idx}
                {...fadeUp(0.08 + idx * 0.07)}
                className="group relative bg-white/80 dark:bg-stone-900/70 backdrop-blur-sm border border-stone-200/60 dark:border-stone-800/50 rounded-3xl p-7 overflow-hidden hover:border-rose-200/80 dark:hover:border-rose-800/60 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)] transition-all duration-400 cursor-default"
              >
                {/* Large ghost number */}
                <span className="absolute top-4 right-5 text-[72px] font-black font-mono leading-none text-stone-900/[0.035] dark:text-stone-100/[0.04] select-none group-hover:text-rose-500/[0.06] transition-colors duration-400 pointer-events-none">
                  {String(idx + 1).padStart(2, '0')}
                </span>

                {/* Year pill */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-black font-mono uppercase tracking-widest text-rose-500 dark:text-rose-400 bg-rose-500/8 border border-rose-500/20 px-3 py-1.5 rounded-full">
                    <span className="w-1 h-1 bg-rose-500 rounded-full" />
                    {item.year}
                  </span>
                </div>

                <h3 className="text-lg font-black text-stone-800 dark:text-stone-100 leading-snug mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-stone-500 dark:text-stone-450 leading-relaxed font-body">
                  {item.description}
                </p>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-400 via-rose-500 to-amber-400 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── GALLERY ──────────────────────────────────────────── */}
        <section id="gallery">
          <SectionLabel icon="photo_camera">Moments in Pixels</SectionLabel>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]">
            {persona.gallery?.map((img, idx) => (
              <motion.div
                key={idx}
                {...fadeUp(0.1 + idx * 0.06)}
                onClick={() => setSelectedImage(img)}
                className={`relative group overflow-hidden rounded-3xl bg-stone-200 dark:bg-stone-800 cursor-zoom-in shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-400 ${img.span || ''}`}
              >
                <img
                  src={img.url}
                  alt={img.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex flex-col justify-end p-5">
                  <span className="text-[9px] text-white/70 uppercase tracking-widest font-bold mb-1">View photo</span>
                  <span className="text-sm font-semibold text-white leading-tight">{img.caption}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>

      {/* ── LIGHTBOX ─────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/10 transition-colors z-10"
            >
              <span className="material-icons-outlined text-xl">close</span>
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-white dark:bg-stone-900 rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[88vh] cursor-default"
            >
              <div className="md:w-3/5 bg-stone-100 dark:bg-stone-950 flex items-center justify-center min-h-[260px] md:min-h-0 overflow-hidden">
                <img src={selectedImage.url} alt={selectedImage.caption} className="w-full h-full object-cover" />
              </div>
              <div className="md:w-2/5 p-8 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.22em] text-rose-500 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-full">
                    Life Moments
                  </span>
                  <h3 className="text-2xl font-black text-stone-800 dark:text-stone-100 mt-5 leading-tight">
                    {selectedImage.caption}
                  </h3>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mt-4 leading-relaxed font-light">
                    A snapshot from my off-screen adventures — exploring new places, picking up hobbies, and making every ordinary day a little more interesting.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="mt-8 md:mt-0 w-full py-3.5 rounded-2xl bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 dark:hover:bg-stone-700 text-white font-bold text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default FriendHome;
