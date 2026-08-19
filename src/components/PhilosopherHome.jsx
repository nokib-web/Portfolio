import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { appConfig } from '../config';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const PhilosopherHome = ({ persona }) => {
  const [treatises, setTreatises] = useState(persona?.projects || []);
  const [writings, setWritings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDynamicData = async () => {
      setLoading(true);
      try {
        const [projRes, blogRes] = await Promise.all([
          fetch(`${appConfig.apiBaseUrl}/api/projects?personaId=philosopher`),
          fetch(`${appConfig.apiBaseUrl}/api/blogs?personaId=philosopher`)
        ]);

        if (projRes.ok) {
          const projs = await projRes.json();
          if (Array.isArray(projs) && projs.length > 0) {
            setTreatises(projs);
          }
        }

        if (blogRes.ok) {
          const blgs = await blogRes.json();
          if (Array.isArray(blgs) && blgs.length > 0) {
            setWritings(blgs);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch dynamic philosopher data, using static defaults:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicData();
  }, [persona]);

  return (
    <div className="font-serif text-neutral-200 bg-neutral-950 min-h-screen relative overflow-hidden transition-colors duration-500">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-gradient-to-br from-purple-600 to-indigo-500 opacity-[0.07] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-10 w-[30rem] h-[30rem] bg-indigo-600 opacity-[0.05] rounded-full blur-[100px] pointer-events-none" />

      {/* Main Content Container (8/12 layout) */}
      <main className="w-11/12 md:w-8/12 max-w-[1200px] mx-auto px-4 pt-16 pb-24 relative z-10 space-y-24">
        
        {/* ── INTRO / HERO ────────────────────────────────────── */}
        <section id="intro" className="space-y-8 pt-8">
          <motion.div {...fadeUp(0)}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/50 border border-purple-800/40 text-purple-350 text-xs font-mono font-semibold uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              Dialectic &amp; Logic
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.15] text-white">
              {persona.tagline}
            </h1>
          </motion.div>

          <motion.p
            {...fadeUp(0.15)}
            className="text-neutral-400 text-lg md:text-xl font-light leading-relaxed max-w-3xl"
          >
            {persona.about}
          </motion.p>

          {/* Core Epigraph */}
          {persona.quote && (
            <motion.div
              {...fadeUp(0.25)}
              className="pl-6 border-l-2 border-purple-500/60 italic text-neutral-300 max-w-2xl py-1"
            >
              <p className="text-xl md:text-2xl font-serif leading-snug">"{persona.quote.text}"</p>
              {persona.quote.attribution && (
                <cite className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 not-italic block mt-3 font-semibold">
                  — {persona.quote.attribution}
                </cite>
              )}
            </motion.div>
          )}
        </section>

        {/* ── FIELDS OF INQUIRY (SKILLS / DOMAINS) ─────────────── */}
        {persona.skills && persona.skills.length > 0 && (
          <section id="inquiry" className="space-y-8 border-t border-neutral-800/60 pt-16">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold block mb-2">
                  Taxonomy of Thought
                </span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Fields of Inquiry &amp; Frameworks
                </h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {persona.skills.map((cat, idx) => (
                <motion.div
                  key={idx}
                  {...fadeUp(0.1 + idx * 0.08)}
                  className="rounded-2xl border border-neutral-800/70 bg-neutral-900/30 p-7 space-y-5 backdrop-blur-sm hover:border-purple-500/30 transition-colors duration-300"
                >
                  <h3 className="text-xs font-mono font-bold tracking-wider text-purple-300 uppercase">
                    {cat.category}
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {cat.items.map((skill, sIdx) => (
                      <div
                        key={sIdx}
                        className="text-sm px-3.5 py-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:border-neutral-700 transition-colors flex flex-col"
                      >
                        <span className="font-semibold text-neutral-100">{skill.name}</span>
                        {skill.level && (
                          <span className="text-xs font-mono text-neutral-450 mt-0.5">
                            {skill.level}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── TREATISES / FEATURED WORKS (DYNAMIC) ─────────────── */}
        <section id="treatises" className="space-y-8 border-t border-neutral-800/60 pt-16">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold block mb-2">
              Philosophical Manuscripts
            </span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Featured Treatises &amp; Work
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {treatises.map((proj, pIdx) => (
              <motion.div
                key={pIdx}
                {...fadeUp(0.1 + pIdx * 0.1)}
                className="group rounded-2xl border border-neutral-800/80 bg-neutral-900/25 hover:border-purple-500/40 overflow-hidden flex flex-col justify-between shadow-2xl transition-all duration-300 backdrop-blur-sm"
              >
                {proj.image && (
                  <div className="h-52 w-full overflow-hidden bg-neutral-950 relative">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover opacity-75 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                  </div>
                )}
                <div className="p-7 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    {proj.tech && Array.isArray(proj.tech) && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {proj.tech.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-mono uppercase tracking-wider text-purple-350 bg-purple-950/40 border border-purple-800/30 px-2 py-0.5 rounded"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-neutral-100 mb-3 group-hover:text-purple-300 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                  {proj.liveLink ? (
                    <a
                      href={proj.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono font-semibold flex items-center space-x-1.5 text-purple-400 hover:text-purple-300 hover:underline pt-2"
                    >
                      <span>Read Manuscript</span>
                      <span>→</span>
                    </a>
                  ) : (
                    <span className="text-xs font-mono text-neutral-500 italic pt-2">
                      Inquiries Ongoing
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── WRITINGS & REFLECTIONS (DYNAMIC) ─────────────────── */}
        <section id="writings" className="space-y-8 border-t border-neutral-800/60 pt-16">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold block mb-2">
                Dialectics &amp; Discourse
              </span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Writings &amp; Deep Thoughts
              </h2>
            </div>
          </div>

          {loading ? (
            <p className="text-neutral-500 font-mono text-xs italic py-8">Loading reflections...</p>
          ) : writings.length === 0 ? (
            <div className="rounded-2xl border border-neutral-800/60 bg-neutral-900/20 p-8 text-center text-neutral-450 italic">
              New philosophical entries will appear here soon.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {writings.map((blog, bIdx) => (
                <motion.div
                  key={bIdx}
                  {...fadeUp(0.08 + bIdx * 0.08)}
                >
                  <Link
                    to={`/philosopher/blog/${blog.slug}`}
                    className="group rounded-2xl border border-neutral-800/70 bg-neutral-900/30 hover:border-purple-500/40 p-7 flex flex-col justify-between h-full shadow-lg transition-all duration-300 backdrop-blur-sm"
                  >
                    <div>
                      {blog.category && (
                        <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 bg-purple-950/40 border border-purple-800/30 px-2.5 py-0.5 rounded-full inline-block mb-3">
                          {blog.category}
                        </span>
                      )}
                      <h3 className="text-lg font-bold text-neutral-100 mb-2 group-hover:text-purple-300 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3">
                        {blog.excerpt}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between text-xs font-mono text-neutral-450">
                      <span>{formatDate(blog.createdAt || blog.date)}</span>
                      <span className="text-purple-400 group-hover:translate-x-1 transition-transform">
                        Read Essay →
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/60 bg-neutral-950 py-10">
        <div className="w-11/12 md:w-8/12 max-w-[1200px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-neutral-500 gap-4">
          <span>© {new Date().getFullYear()} Nokib · Deep Thinker</span>
          <span className="italic">Truth over convenience.</span>
        </div>
      </footer>
    </div>
  );
};

export default PhilosopherHome;
