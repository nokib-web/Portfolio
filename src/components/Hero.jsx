import React from 'react';
import { motion } from 'framer-motion';
import { SiLeetcode, SiCodechef } from 'react-icons/si';
import Magnetic from './Common/Magnetic';
import Typewriter from './Common/Typewriter';
import CozyParticles from './Background/CozyParticles';
import { problemSolvingLinks } from '../data/portfolioData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 90 },
  },
};

const Hero = ({ heroAnchorRef }) => {
  return (
    <section className="relative w-full min-h-[calc(100vh-100px)] flex items-center justify-center overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-500">
      
      {/* Three.js Particle Background */}
      <CozyParticles />

      {/* Grid Pattern Overlay for scrapbook feel */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e5e0_1px,transparent_1px)] dark:bg-[radial-gradient(#2d2d2a_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none z-0" />

      {/* Hero content container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 py-4 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center w-full">
          {/* Left Column (Text & Bio) */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="col-span-1 md:col-span-7 text-center md:text-left flex flex-col items-center md:items-start"
          >
            {/* Eyebrow badge */}
            <motion.div variants={itemVariants} className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-500 dark:text-primary-400 text-sm font-semibold border border-primary-100 dark:border-primary-900/40 shadow-sm backdrop-blur-md">
              ✨ Creative Thinker &amp; Developer
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold font-display text-slate-900 dark:text-white mb-6 tracking-tight leading-tight"
            >
              Hi, I'm{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 dark:from-primary-300 dark:to-primary-500 relative">
                Nokib
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary-400 opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>
              <br />
              <span className="text-2xl md:text-4xl lg:text-5xl text-slate-700 dark:text-slate-300 font-light mt-2 block min-h-[50px]">
                <Typewriter 
                  text="Building digital experiences." 
                  speed={45} 
                  delay={1000} 
                  showCursorAfter={true}
                  className="font-normal"
                />
              </span>
            </motion.h1>

            {/* Narrative bio */}
            <motion.p 
              variants={itemVariants}
              className="mt-4 text-base md:text-lg text-slate-650 dark:text-slate-400 leading-relaxed max-w-xl font-light"
            >
              I enjoy crafting responsive web solutions using modern technologies like{' '}
              <span className="text-slate-900 dark:text-slate-200 font-semibold">Next.js</span>,{' '}
              <span className="text-slate-900 dark:text-slate-200 font-semibold">React</span>, and{' '}
              <span className="text-slate-900 dark:text-slate-200 font-semibold">Node.js</span>.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              variants={itemVariants}
              className="mt-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto"
            >
              <div className="w-full sm:w-auto">
                <Magnetic>
                  <a
                    href="#contact"
                    className="bg-primary-500 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary-500/25 w-full sm:w-auto inline-flex items-center justify-center gap-2 cursor-pointer text-sm"
                  >
                    Get in Touch
                    <span className="material-icons-outlined text-sm">arrow_forward</span>
                  </a>
                </Magnetic>
              </div>
              <div className="w-full sm:w-auto">
                <Magnetic>
                  <a
                    href="#projects"
                    className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 px-6 py-3.5 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm hover:shadow-md w-full sm:w-auto inline-flex items-center justify-center cursor-pointer text-sm"
                  >
                    View Projects
                  </a>
                </Magnetic>
              </div>
            </motion.div>

            {/* Problem Solving Links */}
            <motion.div 
              variants={itemVariants}
              className="mt-10 flex items-center gap-4"
            >
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Solving:</span>
              <div className="flex items-center gap-3">
                {problemSolvingLinks.map((link) => (
                  <Magnetic key={link.platform}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-white transition-all duration-300 group relative overflow-hidden flex items-center justify-center"
                      aria-label={link.platform}
                      style={{ '--hover-color': link.color }}
                    >
                      <div className="absolute inset-0 bg-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: link.color }} />
                      <span className="relative z-10 text-lg font-bold">
                        {link.platform === 'LeetCode' && <SiLeetcode />}
                        {link.platform === 'CodeChef' && <SiCodechef />}
                      </span>
                    </a>
                  </Magnetic>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column — Hero photo anchor (FloatingProfilePhoto renders here) */}
          <div className="col-span-1 md:col-span-5 hidden md:flex items-center justify-center relative w-full h-[400px] md:h-[480px]">
            {/* Invisible anchor — centered in column, sized to match the floating photo */}
            <div
              ref={heroAnchorRef}
              style={{ width: 340, height: 340, borderRadius: 20, opacity: 0, background: 'transparent' }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
