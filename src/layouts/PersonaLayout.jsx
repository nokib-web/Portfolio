import React from 'react';
import { useParams, useLocation, Navigate, Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import WriterHome from '../components/WriterHome';
import FriendHome from '../components/FriendHome';
import PhilosopherHome from '../components/PhilosopherHome';
import BlogPost from '../components/Blog/BlogPost';
import OnekoCat from '../components/Writer/OnekoCat';
import { getPersonaById } from '../data/personasData';

/* ─────────────────────────────────────────────────────────────── */
/*  PersonaLayout — Static Routing Shell with Dedicated Landing    */
/* ─────────────────────────────────────────────────────────────── */
const PersonaLayout = () => {
  const params = useParams();
  const location = useLocation();

  // Derive personaId from route parameter or first URL segment
  const personaId = params.personaId || location.pathname.split('/').filter(Boolean)[0];

  // Resolve persona definition statically (zero latency, zero blocking DB fetch)
  const persona = getPersonaById(personaId);

  // Unknown persona → redirect to main landing
  if (!persona) {
    return <Navigate to="/" replace />;
  }

  // Developer persona has its own layout at /developer
  if (persona.id === 'developer' || persona.slug === 'developer') {
    return <Navigate to="/developer" replace />;
  }

  /* ── 1. WRITER — Bespoke Layout & Theme ─────────────────────── */
  if (persona.id === 'writer' || persona.slug === 'writer') {
    const WriterThemeWrapper = ({ children }) => (
      <div className="min-h-screen bg-[#fdfbf7] dark:bg-stone-950 text-stone-900 dark:text-stone-150 transition-colors duration-500 pt-20 relative">
        <Header activePersonaId="writer" light={true} />
        <OnekoCat />
        {children}
      </div>
    );

    return (
      <Routes>
        <Route index element={<WriterThemeWrapper><WriterHome persona={persona} /></WriterThemeWrapper>} />
        <Route path="blog/:slug" element={<WriterThemeWrapper><BlogPost /></WriterThemeWrapper>} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    );
  }

  /* ── 2. FRIEND — Bespoke Layout & Theme ─────────────────────── */
  if (persona.id === 'friend' || persona.slug === 'friend') {
    const FriendThemeWrapper = ({ children }) => (
      <div className="min-h-screen bg-[#FAF6EE] dark:bg-[#121214] text-black dark:text-white transition-colors duration-500 pt-20 relative">
        <Header activePersonaId="friend" light={true} />
        <OnekoCat />
        {children}
      </div>
    );

    return (
      <Routes>
        <Route index element={<FriendThemeWrapper><FriendHome persona={persona} /></FriendThemeWrapper>} />
        <Route path="blog/:slug" element={<FriendThemeWrapper><BlogPost /></FriendThemeWrapper>} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    );
  }

  /* ── 3. PHILOSOPHER — Bespoke Layout & Theme ────────────────── */
  if (persona.id === 'philosopher' || persona.slug === 'philosopher') {
    const PhilosopherThemeWrapper = ({ children }) => (
      <div className="min-h-screen bg-neutral-950 text-neutral-200 font-serif transition-colors duration-500 pt-20">
        <Header activePersonaId="philosopher" light={false} />
        {children}
      </div>
    );

    return (
      <Routes>
        <Route index element={<PhilosopherThemeWrapper><PhilosopherHome persona={persona} /></PhilosopherThemeWrapper>} />
        <Route path="blog/:slug" element={<PhilosopherThemeWrapper><BlogPost /></PhilosopherThemeWrapper>} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    );
  }

  return <Navigate to="/" replace />;
};

export default PersonaLayout;
