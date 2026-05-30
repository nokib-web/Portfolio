import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Typewriter from './Common/Typewriter';

/* ─── animation variants ─────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
});

/* ─── helpers ────────────────────────────────────────────────── */
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

/* ─── EssayCard ──────────────────────────────────────────────── */
const EssayCard = ({ essay, index }) => (
  <motion.article
    {...fadeUp(0.1 * index)}
    className="group border-b border-stone-200 dark:border-stone-800 py-10 first:border-t"
  >
    {/* Tags */}
    <div className="flex items-center gap-2 mb-3">
      {essay.tags.map((tag) => (
        <span
          key={tag}
          className="text-[10px] uppercase tracking-widest font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 px-2 py-0.5 rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>

    {/* Title */}
    <h2 className="text-2xl md:text-3xl font-bold font-serif text-stone-900 dark:text-stone-100 leading-snug mb-3 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors duration-300 cursor-pointer">
      {essay.title}
    </h2>

    {/* Excerpt */}
    <p className="text-stone-600 dark:text-stone-350 text-lg leading-relaxed font-serif mb-4 max-w-2xl">
      {essay.excerpt}
    </p>

    {/* Meta */}
    <div className="flex items-center gap-4 text-sm text-stone-400 dark:text-stone-500 font-sans">
      <span>{formatDate(essay.date)}</span>
      <span className="text-stone-300 dark:text-stone-700">·</span>
      <span>{essay.readTime}</span>
      <span className="ml-auto text-amber-700 dark:text-amber-400 font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300">
        Read →
      </span>
    </div>
  </motion.article>
);

/* ─── WriterHome (main export) ───────────────────────────────── */
const WriterHome = ({ persona }) => {
  const [typewriterDone, setTypewriterDone] = useState(false);
  const essays = persona.essays || [];

  return (
    <div
      className="min-h-screen bg-[#fdfbf7] dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-serif transition-colors duration-500"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section id="hero" className="max-w-3xl mx-auto px-6 pt-20 pb-16">
        {/* Eyebrow */}
        <motion.div {...fadeUp(0)} className="mb-6">
          <span className="inline-block text-xs font-sans font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-405 border-b-2 border-amber-300 dark:border-amber-800 pb-0.5">
            Essays & Thoughts
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.1)}
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900 dark:text-white leading-[1.1] mb-8"
        >
          {persona.tagline}
        </motion.h1>

        {/* Typewriter intro paragraph */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl md:text-2xl text-stone-600 dark:text-stone-350 leading-relaxed max-w-xl font-serif"
        >
          <Typewriter
            text={persona.heroIntro}
            speed={28}
            delay={700}
            onComplete={() => setTypewriterDone(true)}
            className="text-stone-600 dark:text-stone-350"
          />
        </motion.div>

        {/* Decorative rule that fades in after typewriter */}
        {typewriterDone && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mt-10 h-px bg-gradient-to-r from-amber-300 dark:from-amber-600 via-stone-300 dark:via-stone-700 to-transparent origin-left"
          />
        )}
      </section>

      {/* ── ESSAYS LIST ───────────────────────────────────────── */}
      <section id="essays" className="max-w-3xl mx-auto px-6 pb-20">
        <motion.h2
          {...fadeUp(0.2)}
          className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500 mb-2"
        >
          Selected Writing
        </motion.h2>

        <div>
          {essays.map((essay, idx) => (
            <EssayCard key={essay.slug} essay={essay} index={idx} />
          ))}

          {essays.length === 0 && (
            <p className="text-stone-400 dark:text-stone-550 italic py-10 text-center">
              No essays yet — check back soon.
            </p>
          )}
        </div>
      </section>

      {/* ── ABOUT THE THINKER ─────────────────────────────────── */}
      <section id="about" className="border-t border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-stone-900/10">
        <div className="max-w-3xl mx-auto px-6 py-20 md:grid md:grid-cols-5 md:gap-16">
          {/* Label column */}
          <div className="md:col-span-2 mb-8 md:mb-0">
            <span className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-450">
              About the writer
            </span>
            <div className="mt-4 w-12 h-px bg-amber-300 dark:bg-amber-700" />
          </div>

          {/* Text column */}
          <motion.div
            {...fadeUp(0.15)}
            className="md:col-span-3 space-y-5 text-stone-600 dark:text-stone-350 text-lg leading-relaxed font-serif"
          >
            <p>{persona.about}</p>
            <p className="text-stone-400 dark:text-stone-500 text-base">
              When I'm not writing essays, I build software. The two disciplines
              are more alike than they appear — both demand clarity of thought,
              ruthless editing, and genuine respect for the audience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── SEND A LETTER (CONTACT) ───────────────────────────── */}
      <section id="contact" className="border-t border-stone-200 dark:border-stone-850">
        <div className="max-w-3xl mx-auto px-6 py-20 md:grid md:grid-cols-5 md:gap-16">
          {/* Label column */}
          <div className="md:col-span-2 mb-8 md:mb-0">
            <span className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-450">
              Send a letter
            </span>
            <div className="mt-4 w-12 h-px bg-amber-300 dark:bg-amber-700" />
          </div>

          {/* Links column */}
          <motion.div
            {...fadeUp(0.15)}
            className="md:col-span-3 space-y-4"
          >
            <p className="text-stone-600 dark:text-stone-350 font-serif text-lg leading-relaxed mb-6">
              I read every message. If something I wrote resonated — or if you
              disagree and want to say so — I'd love to hear from you.
            </p>

            <div className="space-y-3">
              {[
                { label: 'Email', href: 'mailto:hello@nokib.dev', display: 'hello@nokib.dev' },
                { label: 'Twitter / X', href: 'https://twitter.com', display: '@nokib' },
                { label: 'LinkedIn', href: 'https://linkedin.com', display: 'linkedin.com/in/nokib' },
              ].map(({ label, href, display }) => (
                <div key={label} className="flex items-baseline gap-4">
                  <span className="text-xs font-sans uppercase tracking-widest text-stone-400 dark:text-stone-500 w-20 shrink-0">
                    {label}
                  </span>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-800 dark:text-stone-200 font-serif text-lg underline decoration-amber-300 dark:decoration-amber-800/80 underline-offset-4 hover:text-amber-800 dark:hover:text-amber-450 hover:decoration-amber-600 dark:hover:decoration-amber-500 transition-colors duration-200"
                  >
                    {display}
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="border-t border-stone-200 dark:border-stone-850 bg-[#fdfbf7] dark:bg-stone-950">
        <div className="max-w-3xl mx-auto px-6 py-8 flex items-center justify-between text-xs font-sans text-stone-400 dark:text-stone-550">
          <span>© {new Date().getFullYear()} Nokib Sarkar</span>
          <span className="italic">Written with care.</span>
        </div>
      </footer>
    </div>
  );
};

export default WriterHome;
