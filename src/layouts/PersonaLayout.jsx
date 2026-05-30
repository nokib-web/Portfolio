import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPersonaById } from '../data/personasData';
import Header from '../components/Header';
import WriterHome from '../components/WriterHome';
import FriendHome from '../components/FriendHome';

/* ─────────────────────────────────────────────────────────────── */
/*  PersonaLayout — top-level shell                               */
/* ─────────────────────────────────────────────────────────────── */
const PersonaLayout = () => {
  const { personaId } = useParams();
  const persona = getPersonaById(personaId);

  // Unknown persona → back to landing
  if (!persona) return <Navigate to="/" replace />;

  // Developer persona lives at /developer
  if (persona.id === 'developer') return <Navigate to="/developer" replace />;

  /* ── WRITER — dedicated bespoke layout ─────────────────────── */
  if (persona.id === 'writer') {
    return (
      <div className="min-h-screen bg-[#fdfbf7] dark:bg-stone-950 text-stone-900 dark:text-stone-150 transition-colors duration-500 pt-20">
        <Header activePersonaId={persona.id} light={true} />
        <WriterHome persona={persona} />
      </div>
    );
  }

  /* ── FRIEND — dedicated bespoke layout ───────────────────────── */
  if (persona.id === 'friend') {
    return (
      <div className={`min-h-screen ${persona.theme.bgColor} dark:bg-stone-950 text-stone-700 dark:text-stone-350 transition-colors duration-500 pt-20`}>
        <Header activePersonaId={persona.id} light={true} />
        <FriendHome persona={persona} />
      </div>
    );
  }

  /* ── ALL OTHER personas — dark grid layout ─────────────────── */
  const { theme } = persona;

  return (
    <div
      className={`dark min-h-screen ${theme.bgColor} ${theme.textColor} ${theme.fontFamily} transition-colors duration-500 relative pb-20 pt-20`}
    >
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
      <div
        className={`absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-gradient-to-br ${theme.gradient} opacity-[0.08] rounded-full blur-[100px] pointer-events-none`}
      />

      <Header activePersonaId={persona.id} light={false} />

      {/* Main content */}
      <main className="w-full max-w-4xl mx-auto px-6 pt-16 relative z-10 space-y-16">
        {/* Intro */}
        <section id="intro" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span
              className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-slate-800/60 ${theme.accentColor} mb-4 border border-slate-800`}
            >
              {persona.title}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              {persona.tagline}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-slate-400 text-lg md:text-xl font-light leading-relaxed"
          >
            {persona.about}
          </motion.p>
        </section>

        {/* Skills grid */}
        {persona.skills && persona.skills.length > 0 && (
          <section id="expertise" className="space-y-6 border-t border-slate-800/30 pt-10">
            <h2 className="text-2xl font-bold tracking-tight text-slate-100">
              Expertise &amp; Interests
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {persona.skills.map((cat, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800/40 bg-slate-900/10 p-6 space-y-4"
                >
                  <h3 className="text-sm font-semibold tracking-wide text-slate-400 uppercase">
                    {cat.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-sm px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-slate-700 transition-colors duration-300 flex flex-col"
                      >
                        <span className="font-semibold">{skill.name}</span>
                        {skill.level && (
                          <span className="text-xs text-slate-500 mt-0.5">
                            {skill.level}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects grid */}
        {persona.projects && persona.projects.length > 0 && (
          <section id="treatise" className="space-y-6 border-t border-slate-800/30 pt-10">
            <h2 className="text-2xl font-bold tracking-tight text-slate-100">
              Featured Work
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {persona.projects.map((proj, pIdx) => (
                <div
                  key={pIdx}
                  className="group rounded-xl border border-slate-800/40 bg-slate-900/20 hover:border-slate-700/60 overflow-hidden flex flex-col justify-between h-96 shadow-lg transition-all duration-300"
                >
                  <div className="h-44 w-full overflow-hidden bg-slate-950 relative">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-white transition-colors duration-300">
                        {proj.title}
                      </h3>
                      <p className="text-slate-450 text-sm leading-relaxed mb-4 line-clamp-3">
                        {proj.description}
                      </p>
                    </div>
                    {proj.liveLink ? (
                      <a
                        href={proj.liveLink}
                        className={`text-sm font-semibold flex items-center space-x-1 ${theme.accentColor} hover:underline`}
                      >
                        <span>View Work</span>
                        <span>→</span>
                      </a>
                    ) : (
                      <span className="text-xs text-slate-500 italic">
                        Static Project
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default PersonaLayout;
