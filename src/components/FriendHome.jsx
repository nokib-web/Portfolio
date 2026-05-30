import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
});

// A decorative handdrawn-style highlight overlay
const CircleAccent = () => (
  <svg className="absolute -bottom-2 left-0 w-full h-3 text-rose-300 dark:text-rose-900/40 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
    <path d="M0 6 Q 50 12 100 6" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

const FriendHome = ({ persona }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Generate dynamic heights for the audio wave visualizer
  const waveBars = [12, 28, 16, 32, 20, 24, 14, 36, 18, 30, 22, 16, 26, 12, 24, 18, 32, 14, 20, 28];

  return (
    <div className="font-sans text-stone-700 dark:text-stone-300 bg-[#faf9f6] dark:bg-stone-950 min-h-screen relative overflow-hidden transition-colors duration-500">

      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-[10%] left-[-15%] w-[60vw] h-[60vw] bg-rose-200/20 dark:bg-rose-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[60vw] h-[60vw] bg-orange-200/25 dark:bg-orange-900/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Grid Pattern Overlay for scrapbook feel */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e5e0_1px,transparent_1px)] dark:bg-[radial-gradient(#2d2d2a_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10 space-y-28">

        {/* HERO / BIO */}
        <section id="greeting" className="space-y-8">
          <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-rose-100 dark:bg-rose-950 border-4 border-white dark:border-stone-850 shadow-md flex-shrink-0 relative group">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nokib&backgroundColor=ffdfbf"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div>
              <div className="inline-block text-[10px] uppercase tracking-[0.25em] font-extrabold text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 px-3 py-1 rounded-full mb-2">
                Off Duty • Human
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 tracking-tight">
                Hey, I'm Nazmul Hasan Nokib
              </h1>
              <p className="text-stone-500 dark:text-stone-400 font-medium text-lg mt-1 relative inline-block">
                {persona.tagline}
                <CircleAccent />
              </p>
            </div>
          </motion.div>

          <motion.p {...fadeUp(0.1)} className="text-xl md:text-2xl text-stone-600/90 dark:text-stone-350/90 leading-relaxed max-w-2xl font-light font-body">
            {persona.about}
          </motion.p>

          {/* VOICE NOTE - Interactive Visualizer */}
          {persona.voiceNote && (
            <motion.div
              {...fadeUp(0.2)}
              className="mt-10 bg-white dark:bg-stone-900 p-6 rounded-3xl shadow-sm border border-stone-200/50 dark:border-stone-800/80 max-w-xl flex flex-col gap-5 hover:shadow-md dark:hover:border-stone-700/80 transition-shadow duration-300"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all duration-200 transform active:scale-95"
                    aria-label={isPlaying ? "Pause voice note" : "Play voice note"}
                  >
                    <span className="material-icons-outlined text-2xl">
                      {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                  </button>
                  <div>
                    <span className="font-extrabold text-sm text-stone-850 dark:text-stone-200 block">Voice Greeting</span>
                    <span className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-wider">Tap to listen</span>
                  </div>
                </div>

                {/* Audio visualizer wave */}
                <div className="flex items-end gap-[3px] h-9 px-4">
                  {waveBars.map((height, i) => (
                    <motion.div
                      key={i}
                      className="w-[3px] rounded-full bg-rose-400/80 dark:bg-rose-500/80"
                      initial={{ height: 4 }}
                      animate={isPlaying ? {
                        height: [height * 0.3, height, height * 0.3]
                      } : { height: 4 }}
                      transition={isPlaying ? {
                        duration: 1.2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: i * 0.05,
                        ease: "easeInOut"
                      } : { duration: 0.2 }}
                    />
                  ))}
                </div>

                <span className="text-xs text-stone-500 dark:text-stone-400 bg-stone-100/80 dark:bg-stone-950/80 px-2.5 py-1 rounded-full font-mono">
                  {persona.voiceNote.duration}
                </span>
              </div>

              {/* Transcript */}
              <div className="bg-[#faf9f6] dark:bg-stone-950 p-4 rounded-2xl border border-stone-100 dark:border-stone-850/80">
                <p className="text-sm text-stone-600 dark:text-stone-400 italic leading-relaxed">
                  "{persona.voiceNote.transcript}"
                </p>
              </div>
              <div className="text-[10px] text-stone-400 dark:text-stone-500 font-bold text-right uppercase tracking-wider font-mono">
                {persona.voiceNote.timestamp}
              </div>
            </motion.div>
          )}
        </section>

        {/* TIMELINE */}
        <section id="moments">
          <motion.h2 {...fadeUp(0.3)} className="text-2xl font-black text-stone-800 dark:text-stone-100 mb-12 flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 flex items-center justify-center">
              <span className="material-icons-outlined text-lg">calendar_today</span>
            </span>
            Moments That Matter
          </motion.h2>

          <div className="relative border-l-2 border-rose-200/60 dark:border-rose-900/40 ml-5 space-y-12 pb-4">
            {persona.timeline?.map((item, idx) => (
              <motion.div
                key={idx}
                {...fadeUp(0.4 + idx * 0.1)}
                className="relative pl-10 group"
              >
                {/* Connector Dot */}
                <div className="absolute -left-[11px] top-4 w-5 h-5 rounded-full bg-white dark:bg-stone-900 border-4 border-rose-300 dark:border-rose-805 group-hover:border-rose-500 dark:group-hover:border-rose-600 shadow-sm flex items-center justify-center transition-colors duration-300 z-10">
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                </div>

                {/* Timeline Card */}
                <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-250/10 dark:border-stone-800 shadow-sm hover:shadow-md dark:hover:border-stone-700/85 group-hover:border-rose-100 dark:group-hover:border-rose-900/50 group-hover:translate-x-1.5 transition-all duration-300 max-w-2xl">
                  <span className="text-xs font-black text-rose-500 dark:text-rose-400 uppercase tracking-widest bg-rose-50 dark:bg-rose-950/20 px-2.5 py-1 rounded-full">
                    {item.year}
                  </span>
                  <h3 className="text-xl font-bold text-stone-850 dark:text-stone-100 mt-3">
                    {item.title}
                  </h3>
                  <p className="text-stone-600 dark:text-stone-400 mt-2 leading-relaxed text-sm md:text-base font-light">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* GALLERY */}
        <section id="gallery">
          <motion.h2 {...fadeUp(0.6)} className="text-2xl font-black text-stone-800 dark:text-stone-100 mb-10 flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 flex items-center justify-center">
              <span className="material-icons-outlined text-lg">photo_camera</span>
            </span>
            Moments in Pixels
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 auto-rows-[220px]">
            {persona.gallery?.map((img, idx) => (
              <motion.div
                key={idx}
                {...fadeUp(0.7 + idx * 0.1)}
                onClick={() => setSelectedImage(img)}
                className={`relative group overflow-hidden rounded-3xl bg-stone-200 dark:bg-stone-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer ${img.span || ''}`}
              >
                <img
                  src={img.url}
                  alt={img.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-stone-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                  <div className="text-white">
                    <span className="text-xs uppercase tracking-wider font-bold block mb-1 opacity-75">Click to view</span>
                    <span className="text-sm font-medium leading-tight">{img.caption}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-stone-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors duration-200 shadow-lg border border-white/10"
              aria-label="Close lightbox"
            >
              <span className="material-icons-outlined text-2xl">close</span>
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()} // stop clicks on card closing it
              className="relative max-w-4xl w-full bg-white dark:bg-stone-900 rounded-[32px] overflow-hidden shadow-2xl cursor-default flex flex-col md:flex-row max-h-[85vh]"
            >
              <div className="md:w-3/5 bg-stone-100 dark:bg-stone-950 overflow-hidden flex items-center justify-center max-h-[50vh] md:max-h-none">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.caption}
                  className="w-full h-full object-cover max-h-[50vh] md:max-h-none"
                />
              </div>
              <div className="p-8 md:w-2/5 flex flex-col justify-between bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-350">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 px-2.5 py-1 rounded-full">
                    Life Moments
                  </span>
                  <h3 className="text-2xl font-black text-stone-850 dark:text-stone-100 mt-4 leading-tight">
                    {selectedImage.caption}
                  </h3>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mt-4 leading-relaxed font-light font-body">
                    A beautiful memory of my off-screen journey, exploring new places, testing hobbies, and making the most of every day with friends.
                  </p>
                </div>

                <button
                  onClick={() => setSelectedImage(null)}
                  className="mt-8 md:mt-0 w-full bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 dark:hover:bg-stone-700 text-white py-3.5 px-6 rounded-2xl font-bold transition-colors duration-200 text-center"
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
