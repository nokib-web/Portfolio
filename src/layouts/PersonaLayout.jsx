import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Navigate, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import WriterHome from '../components/WriterHome';
import FriendHome from '../components/FriendHome';
import BlogPost from '../components/Blog/BlogPost';
import { appConfig } from '../config';
import { getPersonaById } from '../data/personasData';

/* ─────────────────────────────────────────────────────────────── */
/*  PersonaLayout — top-level shell                               */
/* ─────────────────────────────────────────────────────────────── */
const PersonaLayout = () => {
  const params = useParams();
  const location = useLocation();

  // Derive personaId from params first, then fall back to the first URL segment
  // This handles both /:personaId/* catch-all and explicit /writer/* routes
  const personaId = params.personaId || location.pathname.split('/').filter(Boolean)[0];

  const [persona, setPersona] = useState(null);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${appConfig.apiBaseUrl}/api/personas`)
      .then(res => res.json())
      .then(async (personasData) => {
        const found = personasData.find(p => p.personaId === personaId || p.id === personaId);
        if (found) {
          setPersona(found);
          const pid = found.personaId || found.id;
          try {
            const [projs, blgs] = await Promise.all([
              fetch(`${appConfig.apiBaseUrl}/api/projects?personaId=${pid}`).then(res => res.json()),
              fetch(`${appConfig.apiBaseUrl}/api/blogs?personaId=${pid}`).then(res => res.json())
            ]);
            setProjects(Array.isArray(projs) ? projs : []);
            setBlogs(Array.isArray(blgs) ? blgs : []);
          } catch (e) {
            console.warn('Failed to fetch projects or blogs for persona from backend', e);
            const localPersona = getPersonaById(personaId);
            setProjects(localPersona?.projects || []);
            setBlogs(localPersona?.blogs || localPersona?.essays || []);
          }
        } else {
          // fallback to local data if not found in db
          const localPersona = getPersonaById(personaId);
          if (localPersona) {
            setPersona(localPersona);
            const pid = localPersona.id;
            try {
              const [projs, blgs] = await Promise.all([
                fetch(`${appConfig.apiBaseUrl}/api/projects?personaId=${pid}`).then(res => res.json()),
                fetch(`${appConfig.apiBaseUrl}/api/blogs?personaId=${pid}`).then(res => res.json())
              ]);
              setProjects(Array.isArray(projs) && projs.length > 0 ? projs : (localPersona.projects || []));
              setBlogs(Array.isArray(blgs) && blgs.length > 0 ? blgs : (localPersona.blogs || localPersona.essays || []));
            } catch (e) {
              setProjects(localPersona.projects || []);
              setBlogs(localPersona.blogs || localPersona.essays || []);
            }
          } else {
            setPersona(null);
          }
        }
      })
      .catch(async (err) => {
        console.warn('Backend unavailable or persona not found', err);
        // fallback to local data
        const localPersona = getPersonaById(personaId);
        if (localPersona) {
          setPersona(localPersona);
          setProjects(localPersona.projects || []);
          setBlogs(localPersona.blogs || localPersona.essays || []);
        } else {
          setPersona(null);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [personaId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Unknown persona → back to landing
  if (!persona) return <Navigate to="/" replace />;

  // Developer persona lives at /developer
  if (persona.id === 'developer' || persona.personaId === 'developer') return <Navigate to="/developer" replace />;

  /* ── WRITER — dedicated bespoke layout ─────────────────────── */
  if (persona.id === 'writer' || persona.personaId === 'writer') {
    const WriterThemeWrapper = ({ children }) => (
      <div className="min-h-screen bg-[#fdfbf7] dark:bg-stone-950 text-stone-900 dark:text-stone-150 transition-colors duration-500 pt-20">
        <Header activePersonaId={persona.personaId || persona.id} light={true} />
        {children}
      </div>
    );
    return (
      <Routes>
        <Route index element={<WriterThemeWrapper><WriterHome persona={persona} /></WriterThemeWrapper>} />
        <Route path="blog/:slug" element={<WriterThemeWrapper><BlogPost /></WriterThemeWrapper>} />
      </Routes>
    );
  }

  /* ── FRIEND — dedicated bespoke layout ───────────────────────── */
  if (persona.id === 'friend' || persona.personaId === 'friend') {
    const FriendThemeWrapper = ({ children }) => (
      <div className={`min-h-screen ${persona.theme?.bgColor || 'bg-rose-50'} dark:bg-stone-950 text-stone-700 dark:text-stone-350 transition-colors duration-500 pt-20`}>
        <Header activePersonaId={persona.personaId || persona.id} light={true} />
        {children}
      </div>
    );
    return (
      <Routes>
        <Route index element={<FriendThemeWrapper><FriendHome persona={persona} /></FriendThemeWrapper>} />
        <Route path="blog/:slug" element={<FriendThemeWrapper><BlogPost /></FriendThemeWrapper>} />
      </Routes>
    );
  }

  /* ── ALL OTHER personas — dark grid layout ─────────────────── */
  const theme = persona.theme || {
    bgColor: "bg-neutral-950",
    textColor: "text-neutral-200",
    fontFamily: "font-serif",
    gradient: "from-purple-600 to-indigo-500",
    accentColor: "text-purple-400"
  };

  const GenericThemeWrapper = ({ children }) => (
    <div
      className={`dark min-h-screen ${theme.bgColor} ${theme.textColor} ${theme.fontFamily} transition-colors duration-500 relative pb-20 pt-20`}
    >
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
      <div
        className={`absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-gradient-to-br ${theme.gradient} opacity-[0.08] rounded-full blur-[100px] pointer-events-none`}
      />

      <Header activePersonaId={persona.personaId || persona.id} light={false} />
      {children}
    </div>
  );

  return (
    <Routes>
      <Route index element={
        <GenericThemeWrapper>
          {/* Main content */}
          <main className="w-8/12 max-w-[1200px] mx-auto px-4 pt-16 relative z-10 space-y-16">
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
                {persona.about || persona.description}
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
            {projects && projects.length > 0 && (
              <section id="treatise" className="space-y-6 border-t border-slate-800/30 pt-10">
                <h2 className="text-2xl font-bold tracking-tight text-slate-100">
                  Featured Work
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {projects.map((proj, pIdx) => (
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

            {/* Blogs grid */}
            {blogs && blogs.length > 0 && (
              <section id="writings" className="space-y-6 border-t border-slate-800/30 pt-10">
                <h2 className="text-2xl font-bold tracking-tight text-slate-100">
                  Writings & Thoughts
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {blogs.map((blog, bIdx) => (
                    <Link
                      key={bIdx}
                      to={`/${personaId}/blog/${blog.slug}`}
                      className="group rounded-xl border border-slate-800/40 bg-slate-900/20 hover:border-slate-700/60 p-6 flex flex-col justify-between shadow-lg transition-all duration-300"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-white transition-colors duration-300">
                          {blog.title}
                        </h3>
                        <p className="text-slate-450 text-sm leading-relaxed line-clamp-3">
                          {blog.excerpt}
                        </p>
                      </div>
                      <div className={`mt-4 text-xs font-semibold ${theme.accentColor} group-hover:underline`}>
                        Read Article →
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </main>
        </GenericThemeWrapper>
      } />
      <Route path="blog/:slug" element={<GenericThemeWrapper><BlogPost /></GenericThemeWrapper>} />
    </Routes>
  );
};

export default PersonaLayout;
