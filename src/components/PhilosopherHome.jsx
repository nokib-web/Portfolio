import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaAtom, 
  FaScroll, 
  FaBrain, 
  FaCoins, 
  FaTree, 
  FaQuoteLeft, 
  FaEnvelope, 
  FaCopy, 
  FaCheck, 
  FaArrowRight,
  FaLightbulb,
  FaCompass
} from 'react-icons/fa';
import { appConfig } from '../config';

/* ─── Storybook Editorial Fallback Chapters ─── */
const defaultChapters = [
  {
    id: 'cosmology',
    chapterNum: '01',
    title: 'Cosmology & The Expanding Universe',
    tagline: 'Astrophysics, Fine-Tuning & Celestial Orbits',
    arabic: 'Ayat fil-Afaq',
    color: '#FF5E7E',
    image: '/images/philosopher/retro_storybook_forest.jpg',
    verse: '“And the heaven We constructed with strength, and indeed, We are its expander.” — Surah Adh-Dhariyat (51:47)',
    summary: 'The cosmos is an expanding tapestry of mathematical order. From the metric stretching of spacetime to the homeostatic fine-tuning of initial low entropy, cosmological physics converges with deep metaphysical reflection on prime origin.',
    points: [
      {
        title: 'Metric Expansion of Space',
        text: 'Space itself is continuously stretching across deep time, revealing dynamic celestial expansion.'
      },
      {
        title: 'Low Entropy Initial State',
        text: 'The universe began in an extraordinarily ordered state, inviting contemplation on primordial design.'
      },
      {
        title: 'Celestial Equilibrium (Falak)',
        text: 'Planetary bodies glide in mathematically calibrated orbital planes (Surah Al-Anbiya 21:33).'
      }
    ],
    contemplation: 'When you observe the night sky, do you see cold emptiness or an unfolding cosmic order inviting consciousness to recognize its Creator?'
  },
  {
    id: 'epistemology',
    chapterNum: '02',
    title: 'Islamic History & Epistemology',
    tagline: 'Civilizational Cycles, Reason & Spiritual Certainty',
    arabic: 'Tarikh al-Fikr wal-Umran',
    color: '#FFA94D',
    image: '/images/philosopher/retro_storybook_library.jpg',
    verse: '“Have they not traveled through the earth and observed the outcome of those before them?” — Surah Ar-Rum (30:9)',
    summary: 'Classical Islamic thought harmonized empirical observation, deductive logic, and divine revelation. Ibn Khaldun formulated the sociology of rise and fall (Asabiyyah), while Al-Ghazali and Ibn Rushd reconciled philosophical reason with intuitive spiritual certainty.',
    points: [
      {
        title: 'Ibn Khaldun’s Asabiyyah',
        text: 'Social solidarity births civilizational power, declining as luxury and injustice erode cohesion.'
      },
      {
        title: 'Al-Ghazali’s Inner Certainty',
        text: 'Absolute certainty (Yaqeen) transcends pure deduction, illuminating through spiritual purification.'
      },
      {
        title: 'Ibn Rushd’s Dual Harmony',
        text: 'Rational demonstration and divine revelation are complementary paths to the singular Truth.'
      }
    ],
    contemplation: 'How can modern technological civilizations sustain moral purpose and social cohesion as material luxury increases?'
  },
  {
    id: 'psychology',
    chapterNum: '03',
    title: 'Human Psychology & The Soul',
    tagline: 'The Tripartite Psyche, Cognitive Biases & Moral Will',
    arabic: 'An-Nafs wal-Aql',
    color: '#FFD166',
    image: '/images/philosopher/retro_storybook_hills.jpg',
    verse: '“And by the soul and He who proportioned it, and inspired it with discernment of its wickedness and its righteousness.” — Surah Ash-Shams (91:7-8)',
    summary: 'The human psyche is a dynamic landscape of conflicting forces: impulsive desires (Nafs), rational intellect (Aql), and the spiritual heart (Qalb). Classical Tazkiyah provides timeless tools to overcome cognitive bias and attain tranquility.',
    points: [
      {
        title: 'The Tripartite Soul',
        text: 'Moving from the impulsive ego (Ammarah) to conscience (Lawwamah) and tranquility (Mutma’innah).'
      },
      {
        title: 'Tazkiyah & Bias Purification',
        text: 'Overcoming cognitive distortions and dopamine fixation through intentional self-examination.'
      },
      {
        title: 'Qualia vs Computation',
        text: 'Subjective moral empathy, purpose, and spiritual awareness remain unique to conscious souls.'
      }
    ],
    contemplation: 'Which dimension of your inner self directs your daily focus: impulsive distraction or tranquil higher intention?'
  },
  {
    id: 'economics',
    chapterNum: '04',
    title: 'Civilizational Economics & Justice',
    tagline: 'Wealth Circulation, Labor Value & Ethical Stewardship',
    arabic: 'Al-Iqtisad wal-Adalah',
    color: '#06D6A0',
    image: '/images/philosopher/retro_cosmic_horizon.jpg',
    verse: '“So that wealth does not merely circulate among the rich among you.” — Surah Al-Hashr (59:7)',
    summary: 'Economic prosperity requires the productive circulation of real tangible value, honoring labor dignity, and actively preventing usurious debt extraction and monopolistic concentration.',
    points: [
      {
        title: 'Productive Circulation',
        text: 'Prohibiting usury (Riba) and stagnant hoarding (Kanz) to guarantee continuous capital velocity.'
      },
      {
        title: 'Ibn Khaldun’s Labor Theory',
        text: 'Human labor is the creator of real economic value; excessive taxation destroys civilization.'
      },
      {
        title: 'Ethical Wealth Distribution',
        text: 'Transitioning technology from artificial scarcity to widely distributed societal abundance.'
      }
    ],
    contemplation: 'Can economic systems be successful if they concentrate power in monopolies while degrading communal trust?'
  },
  {
    id: 'ecosystems',
    chapterNum: '05',
    title: 'Living Ecosystems & Cosmic Balance',
    tagline: 'The Universal Balance (Mizan) & Earth Stewardship',
    arabic: 'Al-Mizan fil-Khalq',
    color: '#4CC9F0',
    image: '/images/philosopher/retro_storybook_forest.jpg',
    verse: '“And the heaven He raised and imposed the balance (Mizan), that you not transgress within the balance.” — Surah Ar-Rahman (55:7-8)',
    summary: 'Nature is a living sanctuary governed by homeostatic equilibrium (Mizan). From mycorrhizal root networks in ancient forests to planetary climate cycles, human stewardship (Khilafah) demands ecological harmony.',
    points: [
      {
        title: 'The Cosmic Balance (Mizan)',
        text: 'Every natural ecosystem functions in balance that human activity must respect and preserve.'
      },
      {
        title: 'Symbiotic Intelligence',
        text: 'Ancient forest networks prove that reciprocal mutualism is nature’s enduring operating system.'
      },
      {
        title: 'Tafakkur in Pristine Nature',
        text: 'Solitary contemplation in nature re-centers the mind in humility and deep universal alignment.'
      }
    ],
    contemplation: 'How can modern computing operate in harmony with the sacred equilibrium of the natural world?'
  }
];

const getSphereIcon = (id) => {
  switch (id) {
    case 'cosmology': return FaAtom;
    case 'epistemology': return FaScroll;
    case 'psychology': return FaBrain;
    case 'economics': return FaCoins;
    case 'ecosystems': return FaTree;
    default: return FaCompass;
  }
};

const PhilosopherHome = ({ persona }) => {
  const [activeRealmIndex, setActiveRealmIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [dbPersona, setDbPersona] = useState(persona || null);

  /* Dynamic Database Fetching */
  useEffect(() => {
    const fetchDbData = async () => {
      try {
        const res = await fetch(`${appConfig.apiBaseUrl}/api/personas/philosopher`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.personaId) {
            setDbPersona(data);
          }
        }
      } catch (err) {
        console.warn('Using local configuration for philosopher persona:', err);
      }
    };
    fetchDbData();
  }, []);

  const activeData = dbPersona || persona;
  const chapters = (activeData?.chapters && Array.isArray(activeData.chapters) && activeData.chapters.length > 0) 
    ? activeData.chapters 
    : defaultChapters;

  const currentRealm = chapters[activeRealmIndex] || chapters[0];
  const CurrentIcon = getSphereIcon(currentRealm.id);
  const realmColor = currentRealm.color || '#FFD166';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hello@nokib.dev');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="min-h-screen text-[#FAF4E8] bg-[#14131F] relative overflow-x-hidden font-sans selection:bg-[#FF5E7E]/40 selection:text-white">
      
      {/* ── AMBIENT FIXED CANVAS BACKGROUND ────────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none opacity-40">
        <img 
          src="/images/philosopher/retro_cosmic_horizon.jpg" 
          alt="Cosmic Horizon Background" 
          className="w-full h-full object-cover object-center brightness-[0.7] filter saturate-[1.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#14131F]/90 via-[#14131F]/70 to-[#14131F]/95" />
      </div>

      {/* ── WIDE EDITORIAL CONTAINER (FULL HORIZONTAL WIDTH) ───────── */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-8 md:py-12 space-y-10 md:space-y-14">

        {/* ── MINIMAL HERO HEADER SPREAD ─────────────────────────────── */}
        <section id="overview" className="space-y-4 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF4E8] text-[#201D28] font-bold text-xs border border-[#201D28] retro-badge-shadow">
              <span className="font-mono uppercase tracking-widest text-[#FF5E7E]">Tafakkur fil-Khalq</span>
              <span className="text-[#201D28]/40">/</span>
              <span className="font-sans text-[11px] text-[#201D28]/80 font-medium">Cosmic & Human Reflection</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyEmail}
                className="px-4 py-1.5 rounded-full bg-[#FF5E7E] text-white text-xs font-fraunces font-bold border border-[#201D28] retro-badge-shadow flex items-center gap-1.5 cursor-pointer hover:bg-[#FFA94D] transition-all"
              >
                {copiedEmail ? <FaCheck className="text-[10px]" /> : <FaEnvelope className="text-[10px]" />}
                <span>{copiedEmail ? 'Email Copied' : 'Contact Nokib'}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h1 className="font-fraunces font-extrabold text-4xl sm:text-5xl md:text-6xl text-[#FAF4E8] tracking-tight max-w-3xl leading-[1.1]">
              The Architecture of Reality & Thought
            </h1>
            <p className="text-white/80 text-sm sm:text-base font-normal leading-relaxed font-sans max-w-xl">
              An illustrated multidisciplinary codex bridging cosmological expansion, classical Islamic epistemology (Ibn Khaldun, Al-Ghazali), human cognitive psychology, and ethical economics.
            </p>
          </div>

          {/* Rainbow Accent Divider */}
          <div className="pt-2">
            <div className="h-1 w-full rounded-full retro-rainbow-stripe opacity-90" />
          </div>
        </section>

        {/* ── HORIZONTAL REALM SELECTOR STRIP (PICTURE-BOOK CHAPTER TABS) ─ */}
        <section id="realms" className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {chapters.map((ch, idx) => {
              const isActive = idx === activeRealmIndex;
              const Icon = getSphereIcon(ch.id);
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveRealmIndex(idx)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between gap-3 ${
                    isActive 
                      ? 'bg-[#FAF4E8] text-[#201D28] border-[#201D28] shadow-[4px_4px_0px_#FFD166] -translate-y-1' 
                      : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-mono font-bold ${isActive ? 'text-[#FF5E7E]' : 'text-white/50'}`}>
                      {ch.chapterNum}
                    </span>
                    <Icon className={`text-sm ${isActive ? 'text-[#201D28]' : 'text-white/60'}`} />
                  </div>
                  <div>
                    <h3 className="font-fraunces font-bold text-sm leading-tight">
                      {ch.title.split('&')[0]}
                    </h3>
                    <p className={`text-[10px] font-mono mt-0.5 truncate ${isActive ? 'text-[#201D28]/70' : 'text-white/50'}`}>
                      {ch.arabic}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── EDITORIAL PICTURE-BOOK 2-COLUMN SPREAD ─────────────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRealm.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#181726]/90 border border-white/15 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                
                {/* LEFT COLUMN: PICTURE BOOK ARTWORK PANEL (EDITORIAL ART) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl relative group">
                    <img 
                      src={currentRealm.image || defaultChapters[activeRealmIndex]?.image || '/images/philosopher/retro_storybook_forest.jpg'} 
                      alt={currentRealm.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#14131F]/80 backdrop-blur-md text-xs font-mono font-bold text-[#FFD166] border border-white/20">
                      Realm {currentRealm.chapterNum}
                    </div>
                  </div>

                  {/* Sacred Epigraph Banner Under Illustration */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-[#FFD166] font-bold">
                      <FaQuoteLeft className="text-[10px]" />
                      <span>Foundational Epigraph</span>
                    </div>
                    <p className="font-serif italic text-sm text-[#FAF4E8] leading-relaxed">
                      {currentRealm.verse}
                    </p>
                  </div>
                </div>

                {/* RIGHT COLUMN: REFINED EDITORIAL PHILOSOPHICAL EXPOSITION */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Title & Tagline */}
                  <div className="space-y-1.5 border-b border-white/15 pb-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                        style={{ backgroundColor: `${realmColor}25`, color: realmColor }}
                      >
                        <CurrentIcon />
                      </div>
                      <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FFD166]">
                        {currentRealm.arabic}
                      </span>
                    </div>

                    <h2 className="font-fraunces font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#FAF4E8] tracking-tight">
                      {currentRealm.title}
                    </h2>

                    <p className="font-serif italic text-base text-[#FFD166]">
                      {currentRealm.tagline}
                    </p>
                  </div>

                  {/* Exposition Summary */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-[#FFA94D] font-bold">
                      I. Exposition
                    </h4>
                    <p className="text-sm sm:text-base text-white/90 leading-relaxed font-sans">
                      {currentRealm.summary}
                    </p>
                  </div>

                  {/* 3 Core Points (Compact & Clean) */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-[#06D6A0] font-bold">
                      II. Core Dialectical Inquiries
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {currentRealm.points && currentRealm.points.map((pt, pIdx) => (
                        <div key={pIdx} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                          <span className="text-[10px] font-mono text-[#FFD166] font-bold block">
                            Point 0{pIdx + 1}
                          </span>
                          <h5 className="font-fraunces font-bold text-xs text-[#FAF4E8]">
                            {pt.title}
                          </h5>
                          <p className="text-[11px] text-white/70 leading-relaxed font-sans">
                            {pt.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contemplation Box */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-[#FF5E7E]/10 via-[#FFA94D]/10 to-[#FFD166]/10 border border-[#FFD166]/30 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-[#4CC9F0] font-bold">
                      <FaLightbulb className="text-xs" />
                      <span>Contemplation Prompt</span>
                    </div>
                    <p className="font-serif italic text-xs sm:text-sm text-[#FAF4E8] leading-relaxed">
                      “{currentRealm.contemplation}”
                    </p>
                  </div>

                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ── FOOTER: SCHOLARLY EPILOGUE ────────────────────────────── */}
        <footer id="epilogue" className="border-t border-white/15 pt-8 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/50">
          <div>
            <span className="text-[#FAF4E8] font-bold font-fraunces text-sm">Nazmul Hasan Nokib</span> · Deep Thinker & Tafakkur Codex
          </div>
          <div className="flex items-center gap-4">
            <span>© 2026 NOKIB</span>
            <span>/</span>
            <span>COSMOLOGY & EPISTEMOLOGY</span>
          </div>
        </footer>

      </div>

    </div>
  );
};

export default PhilosopherHome;
