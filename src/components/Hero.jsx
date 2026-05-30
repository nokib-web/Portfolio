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

const Hero = () => {
  return (
    <section className="relative w-full min-h-[calc(100vh-100px)] flex items-center justify-center overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-500">
      
      {/* Three.js Particle Background */}
      <CozyParticles />

      {/* Grid Pattern Overlay for scrapbook feel */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e5e0_1px,transparent_1px)] dark:bg-[radial-gradient(#2d2d2a_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none z-0" />

      {/* Hero content container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        {/* Cozy room badge eyebrow */}
        <motion.div variants={itemVariants} className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-500 dark:text-primary-400 text-sm font-semibold border border-primary-100 dark:border-primary-900/40 shadow-sm backdrop-blur-md">
          ✨ Creative Thinker &amp; Developer
        </motion.div>

        {/* Headline */}
        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-7xl font-extrabold font-display text-slate-900 dark:text-white mb-6 tracking-tight leading-tight"
        >
          Hi, I'm{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 dark:from-primary-300 dark:to-primary-500 relative">
            Nokib
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary-400 opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
            </svg>
          </span>
          <br />
          <span className="text-3xl md:text-5xl text-slate-700 dark:text-slate-300 font-light mt-2 block">
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
          className="mt-6 text-lg md:text-xl text-slate-650 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-light"
        >
          I enjoy crafting responsive web solutions using modern technologies like{' '}
          <span className="text-slate-900 dark:text-slate-200 font-semibold">Next.js</span>,{' '}
          <span className="text-slate-900 dark:text-slate-200 font-semibold">React</span>, and{' '}
          <span className="text-slate-900 dark:text-slate-200 font-semibold">Node.js</span>.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          variants={itemVariants}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <div className="w-full sm:w-auto">
            <Magnetic>
              <a
                href="#contact"
                className="bg-primary-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary-500/25 w-full sm:w-auto inline-flex items-center justify-center gap-2 cursor-pointer"
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
                className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm hover:shadow-md w-full sm:w-auto inline-flex items-center justify-center cursor-pointer"
              >
                View Projects
              </a>
            </Magnetic>
          </div>
        </motion.div>

        {/* Problem Solving Links */}
        <motion.div 
          variants={itemVariants}
          className="mt-10 flex items-center justify-center gap-6"
        >
          <span className="text-sm font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">Problem Solving:</span>
          <div className="flex items-center gap-4">
            {problemSolvingLinks.map((link) => (
              <Magnetic key={link.platform}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-white transition-all duration-300 group relative overflow-hidden flex items-center justify-center"
                  aria-label={link.platform}
                  style={{ '--hover-color': link.color }}
                >
                  <div className="absolute inset-0 bg-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: link.color }} />
                  <span className="relative z-10 text-xl font-bold">
                    {link.platform === 'LeetCode' && <SiLeetcode />}
                    {link.platform === 'CodeChef' && <SiCodechef />}
                  </span>
                </a>
              </Magnetic>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
