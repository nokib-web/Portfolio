import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFeatherAlt, FaBookOpen, FaPenNib, FaEnvelope, FaFacebook, FaArrowRight, FaCheck, FaCopy, FaBookmark, FaRegClock, FaTimes, FaThumbtack } from 'react-icons/fa';
import Typewriter from './Common/Typewriter';
import { appConfig } from '../config';
import { resolveMediaUrl } from '../utils/mediaUtils';

/* ─── animation variants ─────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

// Realistic 3D Tactile Push-Pin
const PushPin = ({ color = '#D97706', angle = 0, className = '' }) => (
  <div
    className={`absolute z-30 select-none pointer-events-none drop-shadow-[0_8px_6px_rgba(0,0,0,0.45)] ${className}`}
    style={{ transform: `rotate(${angle}deg)` }}
  >
    <svg width="30" height="36" viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 22L17.5 37L14.5 37L16 22Z" fill="#52525B" />
      <path d="M16 22L16.6 37H15.4L16 22Z" fill="#D4D4D8" />
      <ellipse cx="16" cy="22" rx="8" ry="3.5" fill="#18181B" />
      <ellipse cx="16" cy="21" rx="7.5" ry="3" fill={color} />
      <path d="M8.5 21C8.5 21 10.5 12 12 9H20C21.5 12 23.5 21 23.5 21H8.5Z" fill={color} />
      <path d="M12 9C10.8 10.2 9.6 16.5 9 21H16V9H12Z" fill="white" opacity="0.3" />
      <circle cx="16" cy="9" r="8" fill={color} />
      <circle cx="13.5" cy="6.5" r="2.8" fill="white" opacity="0.75" />
      <ellipse cx="15" cy="8.5" rx="6" ry="3.5" fill="black" opacity="0.2" />
    </svg>
  </div>
);

// Translucent Washi Tape Strip
const WashiTape = ({ color = '#C6F135', angle = -3, className = '' }) => (
  <div
    className={`h-5 w-20 border border-black/25 backdrop-blur-xs select-none pointer-events-none ${className}`}
    style={{
      backgroundColor: color,
      transform: `rotate(${angle}deg)`,
      boxShadow: '0 2px 5px rgba(0,0,0,0.18)',
      opacity: 0.9,
    }}
  />
);

/* ─── helpers ────────────────────────────────────────────────── */
const formatDate = (dateStr) => {
  if (!dateStr) return 'Recent';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const cleanText = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/\s*&\s*/g, ' and ');
};

/* ─── Main WriterHome Component ─────────────────────────────── */
const WriterHome = ({ persona }) => {
  const [typewriterDone, setTypewriterDone] = useState(false);
  const [essays, setEssays] = useState(persona?.essays || []);
  const [epigraph, setEpigraph] = useState(persona?.epigraph || null);
  const [skills, setSkills] = useState(persona?.skills || []);
  const [gallery, setGallery] = useState(persona?.gallery || []);
  const [loading, setLoading] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedScrap, setSelectedScrap] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [essaySearchQuery, setEssaySearchQuery] = useState('');

  const personaId = persona?.personaId || persona?.id || 'writer';

  const scrollToSection = (id) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    // 1. Fetch essays / blogs for writer persona
    fetch(`${appConfig.apiBaseUrl}/api/blogs?personaId=writer`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setEssays(data);
        } else {
          setEssays(persona?.essays || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch writer essays:", err);
        setEssays(persona?.essays || []);
        setLoading(false);
      });

    // 2. Fetch full persona data from DB (epigraph, skills, gallery, about, etc.)
    fetch(`${appConfig.apiBaseUrl}/api/personas`)
      .then(res => res.json())
      .then(personasData => {
        if (Array.isArray(personasData)) {
          const writerDb = personasData.find(p => p.personaId === 'writer' || p.id === 'writer');
          if (writerDb) {
            if (writerDb.epigraph?.quote) {
              setEpigraph(writerDb.epigraph);
            }
            if (Array.isArray(writerDb.skills) && writerDb.skills.length > 0) {
              setSkills(writerDb.skills);
            }
            if (Array.isArray(writerDb.gallery) && writerDb.gallery.length > 0) {
              setGallery(writerDb.gallery);
            }
          }
        }
      })
      .catch(() => {});
  }, [persona]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hello@nokib.dev');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const literaryQuotes = [
    { text: "Words are our most inexhaustible source of magic.", author: "J.K. Rowling" },
    { text: "You can make anything by writing.", author: "C.S. Lewis" },
    { text: "There is no greater agony than bearing an untold story inside you.", author: "Maya Angelou" },
    { text: "One day I will find the right words, and they will be simple.", author: "Jack Kerouac" }
  ];

  // Generalized fallback only if backend has no skills defined yet
  const displaySkills = (skills && skills.length > 0) ? skills : (persona?.skills || [
    {
      category: "Writing Genres and Focus",
      items: [
        { name: "Long-form Essays", level: "Deep Dives and Critiques" },
        { name: "Personal Narratives", level: "Life, Memory and Reflections" },
        { name: "Literary Philosophy", level: "Culture, Books and Human Ideas" }
      ]
    },
    {
      category: "Formats and Mediums",
      items: [
        { name: "Periodical Dispatches", level: "Structured Digital Publications" },
        { name: "Manuscript Drafts", level: "Slow Observations and Notes" },
        { name: "Book Reviews and Critiques", level: "In-depth Literary Analysis" }
      ]
    }
  ]);

  const displayGallery = (gallery && gallery.length > 0) ? gallery : (persona?.gallery || []);

  const pinRotations = [-2.5, 2, -1.5, 3, -2, 1.5];
  const pinColors = ['#D97706', '#00C2CB', '#B45309', '#10B981', '#E11D48', '#C6F135'];

  // Extract all unique categories and tags from essays dynamically
  const dynamicCategories = Array.from(new Set([
    'ALL',
    'ESSAYS',
    'SHORT STORIES',
    'CONTENT WRITING',
    'PHILOSOPHY',
    'REFLECTIONS',
    ...essays.flatMap(e => {
      const list = [];
      if (e.category) list.push(e.category);
      if (Array.isArray(e.tags)) list.push(...e.tags);
      return list;
    }).filter(Boolean).map(t => cleanText(t.trim()).toUpperCase())
  ]));

  const allCategories = dynamicCategories.filter((v, i, a) => a.indexOf(v) === i);

  // Filter essays by selected category and search query
  const filteredEssays = essays.filter(e => {
    const eCat = (e.category || '').toUpperCase();
    const eTags = Array.isArray(e.tags) ? e.tags.map(t => cleanText(t.trim()).toUpperCase()) : [];
    
    let matchesCategory = selectedCategory === 'ALL';
    if (!matchesCategory) {
      if (eCat === selectedCategory || eTags.includes(selectedCategory)) {
        matchesCategory = true;
      } else if (selectedCategory === 'ESSAYS' && (eCat.includes('ESSAY') || eTags.some(t => t.includes('ESSAY') || t.includes('READING')))) {
        matchesCategory = true;
      } else if (selectedCategory === 'SHORT STORIES' && (eCat.includes('STORY') || eTags.some(t => t.includes('STORY') || t.includes('NOSTALGIA')))) {
        matchesCategory = true;
      } else if (selectedCategory === 'CONTENT WRITING' && (eCat.includes('CONTENT') || eTags.some(t => t.includes('CRAFT') || t.includes('WRITING') || t.includes('MINDSET')))) {
        matchesCategory = true;
      } else if (selectedCategory === 'PHILOSOPHY' && (eCat.includes('PHILOSOPHY') || eTags.some(t => t.includes('PHILOSOPHY') || t.includes('LIFE') || t.includes('REFLECT')))) {
        matchesCategory = true;
      } else if (selectedCategory === 'REFLECTIONS' && (eCat.includes('REFLECT') || eTags.some(t => t.includes('REFLECT') || t.includes('LIFE') || t.includes('NOSTALGIA')))) {
        matchesCategory = true;
      }
    }

    const matchesSearch = !essaySearchQuery.trim() ||
      e.title?.toLowerCase().includes(essaySearchQuery.toLowerCase()) ||
      e.excerpt?.toLowerCase().includes(essaySearchQuery.toLowerCase()) ||
      (Array.isArray(e.tags) && e.tags.some(t => t.toLowerCase().includes(essaySearchQuery.toLowerCase())));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-vintage-paper text-black dark:text-[#F3F4F6] transition-colors duration-300 selection:bg-[#C6F135] selection:text-black relative overflow-hidden font-body-serif">
      
      {/* ── NOSTALGIC TOP EDITORIAL TICKER ───────────────────────── */}
      <div className="border-b-3 border-black dark:border-neutral-700 bg-[#C6F135] text-black font-typewriter text-xs uppercase py-2.5 px-4 sm:px-8 flex items-center justify-between overflow-hidden shadow-sm">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
          <span className="font-bold tracking-wider">NOKIB // THE WRITER'S ARCHIVE &bull; VOL. I</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[11px] font-bold">
          <span>[ INK &bull; PAPER &bull; THOUGHTS ]</span>
          <span>&bull;</span>
          <span>SLOW READING &bull; INTENTIONAL WRITING</span>
          <span>&bull;</span>
          <span>DISPATCH NO. {essays.length}</span>
        </div>
      </div>

      {/* ── MAX 1920PX CONTAINER ─────────────────────────────────── */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-12 md:py-16 space-y-20 md:space-y-28">

        {/* ── SECTION 1: HERO & MANIFESTO ──────────────────────── */}
        <section id="hero" className="space-y-10">
          
          {/* Header Metadata Pill Bar */}
          <motion.div {...fadeUp(0)} className="flex flex-wrap items-center gap-3 font-typewriter">
            <span className="bg-black text-[#C6F135] text-xs px-3.5 py-1.5 border-2 border-black shadow-[3px_3px_0px_#C6F135] rotate-[-1deg]">
              ESSAYS // PERIODICAL
            </span>
            <span className="bg-[#00C2CB] text-black text-xs px-3 py-1.5 border-2 border-black shadow-[3px_3px_0px_#000]">
              EST. {new Date().getFullYear()}
            </span>
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              [ {persona?.description || "ESSAYS, STORIES, PHILOSOPHY AND REFLECTIONS"} ]
            </span>
          </motion.div>

          {/* Main Headline with Playfair Display Editorial Elegance */}
          <div className="space-y-4">
            <motion.h1 
              {...fadeUp(0.1)}
              className="font-editorial italic font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-tight leading-[0.98] text-black dark:text-white"
            >
              {persona?.tagline || "Here are my thoughts."}
            </motion.h1>
          </div>

          {/* Hero Bento Grid: Typewriter Note + Epigraph Quote */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
            
            {/* Left Box: Typewriter Intro Note */}
            <motion.div 
              {...fadeUp(0.15)}
              className="lg:col-span-7 bg-[#FFFDF9] dark:bg-[#15161A] border-4 border-black dark:border-neutral-700 shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#C6F135] p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Typewriter Ribbon Accent Top */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-black to-amber-600" />

              <div>
                <div className="flex items-center justify-between border-b-2 border-black/20 dark:border-white/20 pb-3 mb-5 font-typewriter text-xs font-bold uppercase">
                  <span className="flex items-center gap-2 text-amber-800 dark:text-amber-400">
                    <FaPenNib />
                    <span>MANUSCRIPT INTRO // TYPEWRITER DRAFT</span>
                  </span>
                  <span className="bg-[#C6F135] text-black px-2.5 py-0.5 border border-black text-[11px]">
                    DRAFT #01
                  </span>
                </div>

                <div className="font-typewriter text-lg sm:text-xl md:text-2xl text-neutral-800 dark:text-neutral-200 leading-relaxed min-h-[110px] tracking-wide">
                  <Typewriter
                    text={persona?.heroIntro || "I believe words are the most powerful medium we have. I write to think clearly, to share observations, and to explore the subtleties of human experience."}
                    speed={26}
                    delay={350}
                    onComplete={() => setTypewriterDone(true)}
                    className="text-neutral-800 dark:text-neutral-200"
                  />
                  <span className="inline-block w-2.5 h-6 bg-black dark:bg-[#C6F135] ml-1 animate-typewriter-blink align-middle" />
                </div>
              </div>

              <div className="mt-8 pt-4 border-t-2 border-dashed border-neutral-300 dark:border-neutral-700 flex flex-wrap items-center justify-between gap-4 font-typewriter text-xs text-neutral-600 dark:text-neutral-400">
                <span>{persona?.focus || "TOPICS: STORIES • ESSAYS • IDEAS • REFLECTIONS"}</span>
                <span className="text-black dark:text-white font-bold bg-[#FAF6EE] dark:bg-neutral-800 px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
                  ARCHIVE: OPEN
                </span>
              </div>
            </motion.div>

            {/* Right Box: Pinned & Taped Torn Scrap Paper Card */}
            <motion.div 
              {...fadeUp(0.2)}
              className="lg:col-span-5 relative mt-4 lg:mt-0"
            >
              {/* Pushpin at Top Left */}
              <PushPin color="#E11D48" angle={-12} className="absolute -top-5 left-8 z-30 drop-shadow-md" />
              
              {/* Washi Tape at Top Right */}
              <WashiTape color="#00C2CB" angle={-6} className="absolute -top-3.5 right-6 z-20" />

              {/* Washi Tape at Bottom Left */}
              <WashiTape color="#C6F135" angle={6} className="absolute -bottom-3.5 left-6 z-20 w-16 h-4" />

              {/* Torn Paper Sheet Container */}
              <div 
                className="bg-[#C6F135] text-black border-4 border-black shadow-[10px_10px_0px_#000000] p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden rotate-[1.5deg] hover:rotate-0 transition-transform duration-300 h-full"
                style={{
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(0,0,0,0.05) 28px)'
                }}
              >
                {/* Background watermark quote mark */}
                <span className="absolute -right-4 -bottom-10 text-9xl font-editorial font-black text-black/10 select-none pointer-events-none">
                  “
                </span>

                {/* Torn Paper Top Tape / Header */}
                <div>
                  <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-5 font-typewriter text-xs font-bold uppercase">
                    <span className="bg-black text-[#C6F135] px-2.5 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
                      PINNED NOTE // SCRAP
                    </span>
                    <span className="bg-white text-black px-2 py-0.5 border border-black text-[11px] rotate-[-2deg]">
                      ✦ INSPIRATION
                    </span>
                  </div>

                  <blockquote className="font-editorial italic text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-6 relative z-10">
                    "{epigraph?.quote || "The scariest moment is always just before you start."}"
                  </blockquote>
                </div>

                <div className="pt-4 border-t-2 border-dashed border-black flex items-center justify-between font-typewriter relative z-10">
                  <cite className="not-italic text-sm font-bold uppercase bg-white px-3 py-1 border-2 border-black shadow-[3px_3px_0px_#000]">
                    — {epigraph?.attribution || "Stephen King"}
                  </cite>
                  <span className="text-xs uppercase text-black font-bold bg-[#FAF8F5] px-2 py-0.5 border border-black">
                    [ ON THE CRAFT ]
                  </span>
                </div>
              </div>
            </motion.div>

          </div>

        </section>

        {/* ── NOSTALGIC WRITER QUOTE MARQUEE BANNER ─────────────── */}
        <div className="overflow-hidden border-3 border-black dark:border-neutral-700 bg-white dark:bg-[#141518] py-3 shadow-[6px_6px_0px_#000]">
          <div className="animate-marquee-left flex gap-12 text-sm font-typewriter uppercase tracking-widest text-neutral-800 dark:text-neutral-200">
            {literaryQuotes.concat(literaryQuotes).map((q, i) => (
              <div key={i} className="flex items-center gap-3 shrink-0">
                <FaBookmark className="text-[#D97706]" />
                <span className="font-bold font-editorial normal-case italic text-base">"{q.text}"</span>
                <span className="text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 border border-black font-mono">— {q.author}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 2: PINNED TORN-PAPER SCRAPBOOK CANVAS GALLERY ── */}
        <section id="scraps" className="space-y-6">
          
          <motion.div {...fadeUp(0.1)} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-3 border-black dark:border-neutral-700">
            <div>
              <div className="inline-block bg-[#D97706] text-white font-typewriter text-xs uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000] mb-1">
                MANUSCRIPT SCRAPS // PINBOARD CANVAS
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial font-black uppercase tracking-tight text-black dark:text-white">
                PINNED THOUGHTS AND TORN SCRAPS
              </h2>
            </div>
            <div className="flex items-center gap-3 font-typewriter">
              <span className="bg-[#C6F135] text-black text-xs uppercase font-bold px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000]">
                {displayGallery.length} SCRAPS PINNED
              </span>
              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                [ CLICK TO ENLARGE ]
              </span>
            </div>
          </motion.div>

          {/* Dedicated Linen / Parchment Canvas Frame */}
          <div 
            className="bg-[#EDE6DA] dark:bg-[#1A1B20] border-4 border-black dark:border-neutral-700 shadow-[10px_10px_0px_#000000] p-6 sm:p-10 md:p-12 relative overflow-hidden rounded-none"
            style={{
              backgroundImage: 'radial-gradient(#C2B59F 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
            }}
          >
            {/* Top Corner 3D Push-Pins */}
            <PushPin color="#D97706" angle={-15} className="top-4 left-4" />
            <PushPin color="#00C2CB" angle={20} className="top-4 right-4" />

            {/* Pinned Editorial Scrap Memo Note */}
            <div className="mb-10 max-w-xl bg-[#FFF9A6] border-3 border-black p-4 sm:p-5 shadow-[4px_4px_0px_#000] rotate-[-1.5deg] relative">
              <PushPin color="#D97706" angle={5} className="-top-3 left-6" />
              <div className="flex items-center justify-between border-b border-black/20 pb-2 mb-2 font-typewriter text-[11px] font-bold text-black/75">
                <span>MANUSCRIPT PINBOARD // NOTES AND MEMORIES</span>
                <span className="bg-black text-white px-2 py-0.5">CURATED</span>
              </div>
              <p className="font-editorial italic text-xl sm:text-2xl font-bold text-neutral-900 leading-snug">
                "Writing is the art of collecting scattered thoughts, dog-eared book pages, and quiet moments — pinning them down before they fade away."
              </p>
            </div>

            {/* Pinned Torn-Paper Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 items-start pt-2 pb-4">
              {displayGallery.map((scrap, idx) => {
                const rotation = pinRotations[idx % pinRotations.length];
                const pinColor = pinColors[idx % pinColors.length];
                const imageUrl = resolveMediaUrl(scrap.url || scrap.image);

                return (
                  <motion.div
                    key={scrap.id || idx}
                    {...fadeUp(0.1 + idx * 0.08)}
                    whileHover={{
                      scale: 1.05,
                      rotate: 0,
                      y: -8,
                      zIndex: 35,
                      transition: { type: 'spring', stiffness: 350, damping: 20 },
                    }}
                    onClick={() => setSelectedScrap(scrap)}
                    style={{ transformOrigin: 'top center' }}
                    className="relative cursor-pointer select-none group"
                  >
                    {/* 3D Push-Pin at Top Center */}
                    <PushPin
                      color={pinColor}
                      angle={rotation * 3}
                      className="-top-4 left-1/2 -translate-x-1/2 group-hover:-translate-y-1 transition-transform"
                    />

                    {/* Washi Tape on Opposite Corner */}
                    <WashiTape
                      color={idx % 2 === 0 ? '#C6F135' : '#00C2CB'}
                      angle={idx % 2 === 0 ? -6 : 8}
                      className={`absolute -top-3 ${idx % 2 === 0 ? 'right-2' : 'left-2'} z-20`}
                    />

                    {/* Torn Paper Card Body */}
                    <div
                      style={{ transform: `rotate(${rotation}deg)` }}
                      className="group-hover:rotate-0 transition-transform duration-300 bg-[#FAF8F5] text-black border-3 border-black shadow-[6px_6px_0px_#000000] group-hover:shadow-[12px_12px_0px_#000000] p-4 pb-6 flex flex-col justify-between relative overflow-hidden"
                    >
                      {/* Image Area if available */}
                      {imageUrl && (
                        <div className="w-full aspect-[4/3] bg-neutral-900 border-2 border-black overflow-hidden relative shadow-inner mb-3.5">
                          <img
                            src={imageUrl}
                            alt={scrap.title || scrap.caption}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-[#C6F135] text-black font-typewriter text-xs font-bold px-3 py-1 border border-black shadow-[2px_2px_0px_#000]">
                              READ SCRAP
                            </span>
                          </div>
                          {scrap.tag && (
                            <div className="absolute bottom-2 left-2 bg-black text-[#C6F135] font-typewriter text-[9px] font-bold px-2 py-0.5 border border-black">
                              {scrap.tag}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Content Area */}
                      <div className="space-y-2">
                        {scrap.title && (
                          <h3 className="font-editorial font-bold text-xl leading-tight text-black group-hover:text-amber-800 transition-colors">
                            {cleanText(scrap.title)}
                          </h3>
                        )}

                        {scrap.caption && (
                          <p className="font-body-serif text-sm text-neutral-700 leading-relaxed line-clamp-3">
                            {cleanText(scrap.caption)}
                          </p>
                        )}

                        {scrap.quote && (
                          <div className="mt-3 pt-2 border-t border-dashed border-neutral-300 bg-[#FFFBEA] p-2 border border-black/20">
                            <p className="font-editorial italic text-xs text-amber-900 font-bold leading-snug">
                              "{cleanText(scrap.quote)}"
                            </p>
                          </div>
                        )}

                        {/* Date & Bottom Stamp */}
                        <div className="pt-2 flex items-center justify-between font-typewriter text-[10px] text-neutral-500 border-t border-neutral-200 mt-2">
                          <span>{scrap.date || 'ARCHIVE'}</span>
                          <span className="bg-black text-white px-1.5 py-0.5 text-[9px]">
                            #{idx + 1}
                          </span>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>

        </section>

        {/* ── SECTION 3: WRITER'S GENRES & MEDIUMS (SKILLS BENTO) ── */}
        {displaySkills && displaySkills.length > 0 && (
          <section id="skills" className="space-y-6">
            
            <motion.div {...fadeUp(0.1)} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-3 border-black dark:border-neutral-700">
              <div>
                <div className="inline-block bg-[#00C2CB] text-black font-typewriter text-xs uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000] mb-1">
                  GENRES AND DISCIPLINES
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial font-black uppercase tracking-tight text-black dark:text-white">
                  TOPICS, GENRES AND MEDIUMS
                </h2>
              </div>
              <span className="font-typewriter text-xs text-neutral-600 dark:text-neutral-400">
                [ {displaySkills.length} SECTIONS CONFIGURED ]
              </span>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {displaySkills.map((category, catIdx) => (
                <motion.div 
                  key={category.category || catIdx}
                  {...fadeUp(0.15 + catIdx * 0.1)}
                  whileHover={{ y: -4 }}
                  className="bg-[#FFFDF9] dark:bg-[#15161A] border-4 border-black dark:border-neutral-700 shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#00C2CB] p-6 sm:p-8 flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between border-b-2 border-black/20 dark:border-white/20 pb-3 mb-6 font-typewriter">
                      <span className="bg-black text-[#C6F135] text-xs uppercase px-3 py-1 border border-black shadow-[2px_2px_0px_#000]">
                        0{catIdx + 1} // {category.category}
                      </span>
                      <span className="text-xs font-bold text-neutral-500">
                        ACTIVE
                      </span>
                    </div>

                    <div className="space-y-4">
                      {category.items?.map((item, itemIdx) => (
                        <div 
                          key={item.name || itemIdx} 
                          className="bg-neutral-50 dark:bg-neutral-900/80 border-2 border-black dark:border-neutral-700 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#C6F135] dark:hover:bg-[#C6F135] hover:text-black transition-colors group cursor-default"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-black group-hover:bg-black" />
                            <span className="font-editorial font-bold text-lg sm:text-xl group-hover:text-black text-black dark:text-white">
                              {item.name}
                            </span>
                          </div>
          {item.level && (
                            <span className="font-typewriter text-xs text-neutral-600 dark:text-neutral-400 group-hover:text-black">
                              {item.level}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t-2 border-dashed border-neutral-300 dark:border-neutral-700 font-typewriter text-xs text-neutral-500 flex justify-between">
                    <span>STANDARD: EDITORIAL QUALITY</span>
                    <span>VERIFIED</span>
                  </div>
                </motion.div>
              ))}
            </div>

          </section>
        )}

        {/* ── SECTION 4: SELECTED ESSAYS & LONG-FORM ARTICLES ───── */}
        <section id="essays" className="space-y-8">
          
          {/* Header Row */}
          <motion.div {...fadeUp(0.1)} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-3 border-black dark:border-neutral-700">
            <div>
              <div className="inline-block bg-[#D97706] text-white font-typewriter text-xs uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000] mb-1 rotate-[-1deg]">
                PUBLICATIONS // PERIODICALS
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial font-black uppercase tracking-tight text-black dark:text-white">
                SELECTED ESSAYS AND WRITING
              </h2>
            </div>
            <div className="flex items-center gap-3 font-typewriter">
              <span className="bg-[#C6F135] text-black text-xs uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000]">
                {filteredEssays.length} OF {essays.length} ESSAYS
              </span>
              <span className="text-xs text-neutral-600 dark:text-neutral-400 hidden sm:inline">
                [ ARCHIVE // CURATED ]
              </span>
            </div>
          </motion.div>

          {/* ── CATEGORY FILTER PILLS & SEARCH BAR ────────────────── */}
          <motion.div {...fadeUp(0.12)} className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#FAF8F5] dark:bg-[#15161A] p-4 border-3 border-black dark:border-neutral-700 shadow-[4px_4px_0px_#000]">
            
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 font-typewriter text-xs">
              <span className="font-bold text-neutral-500 uppercase mr-1 hidden sm:inline">TOPIC:</span>
              {['ALL', 'ESSAYS', 'SHORT STORIES', 'CONTENT WRITING', 'PHILOSOPHY', 'REFLECTIONS'].map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 uppercase font-bold border-2 border-black transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#C6F135] text-black shadow-[3px_3px_0px_#000] -translate-y-0.5'
                        : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 shadow-[1px_1px_0px_#000]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}

              {/* Show More Categories Button */}
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="px-3 py-1.5 uppercase font-bold bg-black text-[#C6F135] border-2 border-black shadow-[2px_2px_0px_#C6F135] hover:bg-[#D97706] hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>+ ALL TOPICS</span>
                <span className="text-[10px] bg-[#C6F135] text-black px-1.5 py-0.2 border border-black">
                  {allCategories.length}
                </span>
              </button>
            </div>

            {/* Quick Keyword Filter Input */}
            <div className="relative min-w-[220px]">
              <input
                type="text"
                value={essaySearchQuery}
                onChange={(e) => setEssaySearchQuery(e.target.value)}
                placeholder="Search essays..."
                className="w-full bg-white dark:bg-neutral-900 border-2 border-black px-3.5 py-1.5 font-typewriter text-xs text-black dark:text-white placeholder:text-neutral-500 focus:outline-none shadow-[2px_2px_0px_#000]"
              />
              {essaySearchQuery && (
                <button
                  onClick={() => setEssaySearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500 hover:text-black cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

          </motion.div>

          {/* Active Topic Banner if filtered */}
          {selectedCategory !== 'ALL' && (
            <div className="flex items-center justify-between bg-[#FFFBEA] border-2 border-black p-3 font-typewriter text-xs text-black shadow-[2px_2px_0px_#000]">
              <div className="flex items-center gap-2">
                <span className="font-bold">ACTIVE FILTER:</span>
                <span className="bg-[#C6F135] px-2 py-0.5 border border-black font-bold uppercase">{selectedCategory}</span>
                <span>({filteredEssays.length} articles found)</span>
              </div>
              <button
                onClick={() => setSelectedCategory('ALL')}
                className="text-red-700 hover:underline font-bold cursor-pointer"
              >
                RESET FILTER [✕]
              </button>
            </div>
          )}

          {/* Essays Container */}
          {loading ? (
            <div className="p-16 border-4 border-black dark:border-neutral-700 bg-white dark:bg-[#16171B] text-center font-typewriter text-base font-bold shadow-[8px_8px_0px_#000]">
              <span className="inline-block animate-pulse">LOADING ESSAY ARCHIVES...</span>
            </div>
          ) : filteredEssays.length === 0 ? (
            <div className="p-16 border-4 border-black dark:border-neutral-700 bg-white dark:bg-[#16171B] text-center font-typewriter text-base font-bold shadow-[8px_8px_0px_#000] space-y-4">
              <p className="text-xl">NO ESSAYS FOUND UNDER "{selectedCategory}".</p>
              <button
                onClick={() => { setSelectedCategory('ALL'); setEssaySearchQuery(''); }}
                className="px-6 py-2.5 bg-[#C6F135] text-black border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#D97706] hover:text-white transition-all font-bold cursor-pointer uppercase text-xs"
              >
                SHOW ALL ESSAYS
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Featured First Essay (Large Hero Card) */}
              {filteredEssays.length > 0 && (() => {
                const lead = filteredEssays[0];
                return (
                  <motion.article 
                    {...fadeUp(0.15)}
                    whileHover={{ y: -5 }}
                    className="bg-[#FFFDF9] dark:bg-[#15161A] border-4 border-black dark:border-neutral-700 shadow-[10px_10px_0px_#000000] dark:shadow-[10px_10px_0px_#C6F135] p-6 sm:p-10 md:p-12 transition-all group"
                  >
                    <Link to={`/${personaId}/blog/${lead.slug}`} className="block space-y-6">
                      
                      {/* Top Header Tag Row */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black/20 dark:border-white/20 pb-4 font-typewriter">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="bg-[#C6F135] text-black text-xs uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
                            ISSUE #{lead.issue || '01'} &bull; {lead.category || 'FEATURED'}
                          </span>
                          {lead.tags?.map((t) => (
                            <span key={t} className="bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white text-xs uppercase px-2.5 py-1 border border-black">
                              #{cleanText(t)}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                          <FaRegClock />
                          <span>{formatDate(lead.createdAt || lead.date)} &bull; {lead.readTime || '7 min read'}</span>
                        </div>
                      </div>

                      {/* Lead Title with Playfair Display */}
                      <h3 className="font-editorial font-bold text-3xl sm:text-5xl md:text-6xl text-black dark:text-white leading-tight group-hover:text-amber-800 dark:group-hover:text-[#C6F135] transition-colors">
                        {cleanText(lead.title)}
                      </h3>

                      {/* Excerpt with Lora Body Font */}
                      <p className="font-body-serif text-lg sm:text-xl md:text-2xl text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-5xl">
                        {cleanText(lead.excerpt)}
                      </p>

                      {/* Read Full Button Banner */}
                      <div className="pt-4 flex items-center justify-between font-typewriter">
                        <span className="text-xs uppercase text-neutral-500">
                          CLICK TO OPEN FULL ESSAY
                        </span>
                        <span className="bg-black text-white dark:bg-white dark:text-black text-sm uppercase px-6 py-3 border-2 border-black shadow-[3px_3px_0px_#C6F135] group-hover:bg-[#D97706] group-hover:text-white transition-colors flex items-center gap-2">
                          <span>READ ESSAY</span>
                          <FaArrowRight />
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                );
              })()}

              {/* Remaining Essays Grid (2 Columns on large screens) */}
              {filteredEssays.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredEssays.slice(1).map((essay, idx) => (
                    <motion.article 
                      key={essay.slug || idx}
                      {...fadeUp(0.2 + idx * 0.08)}
                      whileHover={{ y: -5 }}
                      className="bg-[#FFFDF9] dark:bg-[#15161A] border-4 border-black dark:border-neutral-700 shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#00C2CB] p-6 sm:p-8 flex flex-col justify-between transition-all group"
                    >
                      <Link to={`/${personaId}/blog/${essay.slug}`} className="flex-1 flex flex-col justify-between space-y-5">
                        <div>
                          {/* Card Top Metadata */}
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black/20 dark:border-white/20 pb-3 mb-4 font-typewriter">
                            <span className="bg-black text-[#C6F135] text-xs uppercase px-2.5 py-0.5 border border-black">
                              ISSUE #{essay.issue || String(idx + 2).padStart(2, '0')}
                            </span>
                            <span className="text-xs text-neutral-500">
                              {formatDate(essay.createdAt || essay.date)}
                            </span>
                          </div>

                          {/* Tags & Category */}
                          <div className="flex flex-wrap gap-1.5 mb-3 font-typewriter">
                            {essay.category && (
                              <span className="bg-[#C6F135] text-black text-[11px] font-bold uppercase px-2 py-0.5 border border-black">
                                {essay.category}
                              </span>
                            )}
                            {essay.tags?.map((t) => (
                              <span key={t} className="bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white text-[11px] uppercase px-2 py-0.5 border border-black/40">
                                #{cleanText(t)}
                              </span>
                            ))}
                          </div>

                          {/* Title */}
                          <h4 className="font-editorial font-bold text-2xl sm:text-3xl text-black dark:text-white leading-snug group-hover:text-amber-800 dark:group-hover:text-[#C6F135] transition-colors mb-3">
                            {cleanText(essay.title)}
                          </h4>

                          {/* Excerpt */}
                          <p className="font-body-serif text-base text-neutral-700 dark:text-neutral-300 leading-relaxed line-clamp-3">
                            {cleanText(essay.excerpt)}
                          </p>
                        </div>

                        {/* Read CTA */}
                        <div className="pt-4 border-t-2 border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-between font-typewriter text-xs">
                          <span className="text-neutral-500">{essay.readTime || '6 min read'}</span>
                          <span className="uppercase text-black dark:text-white group-hover:translate-x-1 transition-transform flex items-center gap-1.5 font-bold">
                            <span>READ FULL</span>
                            <span>→</span>
                          </span>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              )}

            </div>
          )}

        </section>

        {/* ── SECTION 5: ABOUT THE WRITER / COLOPHON ────────────── */}
        <section id="about" className="space-y-6">
          
          <motion.div {...fadeUp(0.1)} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-3 border-black dark:border-neutral-700">
            <div>
              <div className="inline-block bg-[#2ED573] text-black font-typewriter text-xs uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000] mb-1">
                COLOPHON // BIOGRAPHY
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial font-black uppercase tracking-tight text-black dark:text-white">
                ABOUT THE WRITER
              </h2>
            </div>
            <span className="font-typewriter text-xs text-neutral-600 dark:text-neutral-400">
              [ CRAFT, ETHOS AND PERSPECTIVE ]
            </span>
          </motion.div>

          <motion.div 
            {...fadeUp(0.15)}
            className="bg-[#FFFDF9] dark:bg-[#15161A] border-4 border-black dark:border-neutral-700 shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#2ED573] p-6 sm:p-10 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left Column: Author Bio */}
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-block bg-black text-[#C6F135] font-typewriter text-xs uppercase px-3 py-1 border border-black">
                WRITER'S STATEMENT
              </div>
              
              <p className="font-editorial text-2xl sm:text-3xl text-neutral-800 dark:text-neutral-200 leading-relaxed font-normal">
                "{persona?.about || "I write to think clearly, to share stories, and to explore the subtleties of human experience. I believe in slow reading, careful thinking, and writing that respects the reader's time."}"
              </p>

              <p className="font-body-serif text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {persona?.bio || "Writing allows us to observe life closely, distill complex emotions into simple sentences, and build genuine connections across distance and time."}
              </p>
            </div>

            {/* Right Column: Mini Brutalist Stamp Card */}
            <div className="lg:col-span-4 bg-[#F5F2EB] dark:bg-neutral-900 border-3 border-black p-6 space-y-4 font-typewriter text-xs shadow-[4px_4px_0px_#000]">
              <div className="border-b-2 border-black pb-2 uppercase flex justify-between font-bold">
                <span>IDENTITY SPEC</span>
                <span>NAZMUL HASAN</span>
              </div>
              <div className="space-y-2.5 text-neutral-700 dark:text-neutral-300">
                <div className="flex justify-between">
                  <span className="font-bold">LOCATION:</span>
                  <span>{persona?.location || "Dhaka, Bangladesh"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">PRIMARY FOCUS:</span>
                  <span>{persona?.primaryFocus || "Stories and Essays"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">CORE ETHOS:</span>
                  <span>{persona?.ethos || "Clarity and Depth"}</span>
                </div>
              </div>
              <div className="pt-3 border-t-2 border-dashed border-black uppercase bg-[#C6F135] text-black text-center py-2 border border-black font-bold">
                STATUS: ACCEPTING CORRESPONDENCE
              </div>
            </div>
          </motion.div>

        </section>

        {/* ── SECTION 6: SEND A LETTER / DISPATCH (CONTACT) ─────── */}
        <section id="contact" className="space-y-6">
          
          <motion.div {...fadeUp(0.1)} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-3 border-black dark:border-neutral-700">
            <div>
              <div className="inline-block bg-[#C6F135] text-black font-typewriter text-xs uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000] mb-1">
                CORRESPONDENCE // DISPATCH
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial font-black uppercase tracking-tight text-black dark:text-white">
                SEND A LETTER
              </h2>
            </div>
            <span className="font-typewriter text-xs text-neutral-600 dark:text-neutral-400">
              [ INBOX OPEN &bull; DIRECT REPLIES ]
            </span>
          </motion.div>

          <motion.div 
            {...fadeUp(0.15)}
            className="bg-[#C6F135] text-black border-4 border-black shadow-[10px_10px_0px_#000000] p-6 sm:p-10 md:p-12 space-y-8 relative overflow-hidden"
          >
            {/* Background feather icon */}
            <FaFeatherAlt className="absolute -right-8 -bottom-8 text-9xl text-black/10 select-none pointer-events-none" />

            <div className="max-w-3xl space-y-3">
              <h3 className="font-editorial font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight">
                HAVE THOUGHTS ON AN ESSAY OR STORY?
              </h3>
              <p className="font-body-serif text-lg sm:text-xl leading-relaxed text-black/90">
                I read every letter. If something I wrote resonated with you — or if you want to discuss an idea or share a story — send a dispatch over.
              </p>
            </div>

            {/* Quick Action Pill Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="mailto:hello@nokib.dev"
                className="bg-black text-white hover:bg-neutral-800 font-typewriter text-sm uppercase px-6 py-3.5 border-2 border-black shadow-[4px_4px_0px_#FFF] flex items-center gap-2.5 transition-all cursor-pointer"
              >
                <FaEnvelope />
                <span>WRITE VIA EMAIL (HELLO@NOKIB.DEV)</span>
              </a>

              <button
                onClick={handleCopyEmail}
                className="bg-white text-black hover:bg-neutral-100 font-typewriter text-sm uppercase px-5 py-3.5 border-2 border-black shadow-[4px_4px_0px_#000] flex items-center gap-2 transition-all cursor-pointer"
              >
                {copiedEmail ? <FaCheck className="text-green-600" /> : <FaCopy />}
                <span>{copiedEmail ? 'COPIED TO CLIPBOARD!' : 'COPY EMAIL'}</span>
              </button>

              {/* Verified Facebook Page Link */}
              <a
                href="https://www.facebook.com/HasaNokiB"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1877F2] text-white hover:bg-[#166FE5] font-typewriter text-sm uppercase px-5 py-3.5 border-2 border-black shadow-[4px_4px_0px_#000] flex items-center gap-2 transition-all cursor-pointer"
              >
                <FaFacebook />
                <span>FACEBOOK PAGE (HASANOKIB)</span>
              </a>
            </div>

            {/* Dispatch Note Footer */}
            <div className="pt-6 border-t-2 border-black flex flex-wrap items-center justify-between gap-4 font-typewriter text-xs">
              <span className="uppercase text-black/80 font-bold">
                DIRECT DISPATCH // NO NOISE, JUST IDEAS
              </span>
              <span className="bg-black text-white px-3 py-1 border border-black">
                RESPONSIVENESS: WITHIN 24 HOURS
              </span>
            </div>
          </motion.div>

        </section>

      </div>

      {/* ── INTERACTIVE SCRAP MODAL PREVIEW ─────────────────────── */}
      <AnimatePresence>
        {selectedScrap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedScrap(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FAF8F5] text-black border-4 border-black shadow-[16px_16px_0px_#C6F135] max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedScrap(null)}
                className="absolute top-4 right-4 bg-black text-white w-8 h-8 flex items-center justify-center border-2 border-black hover:bg-[#D97706] transition-colors cursor-pointer"
              >
                <FaTimes />
              </button>

              <div className="font-typewriter text-xs text-neutral-500 uppercase mb-2 flex items-center gap-2">
                <FaThumbtack className="text-[#D97706]" />
                <span>PINNED MANUSCRIPT SCRAP</span>
              </div>

              {selectedScrap.url && (
                <div className="w-full h-64 sm:h-80 bg-neutral-900 border-3 border-black overflow-hidden mb-4 shadow-inner">
                  <img
                    src={resolveMediaUrl(selectedScrap.url || selectedScrap.image)}
                    alt={selectedScrap.title || selectedScrap.caption}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <h3 className="font-editorial font-bold text-2xl sm:text-3xl text-black mb-3">
                {cleanText(selectedScrap.title || selectedScrap.caption)}
              </h3>

              {selectedScrap.caption && (
                <p className="font-body-serif text-base sm:text-lg text-neutral-800 leading-relaxed mb-4">
                  {cleanText(selectedScrap.caption)}
                </p>
              )}

              {selectedScrap.quote && (
                <div className="bg-[#FFFBEA] border-2 border-black p-4 mb-4">
                  <span className="font-typewriter text-[10px] font-bold text-amber-900 uppercase block mb-1">
                    EXCERPT QUOTE:
                  </span>
                  <p className="font-editorial italic text-lg text-black font-bold">
                    "{cleanText(selectedScrap.quote)}"
                  </p>
                </div>
              )}

              <div className="pt-4 border-t-2 border-black flex justify-between items-center font-typewriter text-xs">
                <span className="bg-black text-white px-2 py-1">
                  TAG: {selectedScrap.tag || 'LITERARY'}
                </span>
                <span className="text-neutral-600 font-bold">
                  {selectedScrap.date || 'ARCHIVED'}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ALL TOPICS & CATEGORIES EXPLORER MODAL ─────────────── */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCategoryModalOpen(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FAF8F5] dark:bg-[#15161A] text-black dark:text-white border-4 border-black dark:border-neutral-700 shadow-[14px_14px_0px_#C6F135] max-w-xl w-full p-6 sm:p-8 relative overflow-hidden max-h-[85vh] overflow-y-auto"
            >
              <PushPin color="#D97706" angle={-8} className="top-3 left-4" />
              <WashiTape color="#C6F135" angle={4} className="absolute -top-3 right-16 z-20" />

              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="absolute top-4 right-4 bg-black text-[#C6F135] w-9 h-9 flex items-center justify-center border-2 border-black hover:bg-[#D97706] hover:text-white transition-colors cursor-pointer text-sm font-bold shadow-[2px_2px_0px_#000]"
              >
                ✕
              </button>

              <div className="border-b-3 border-black pb-3 mb-6 font-typewriter">
                <span className="bg-[#C6F135] text-black text-xs font-bold uppercase px-2.5 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
                  TOPIC DIRECTORY
                </span>
                <h3 className="font-editorial font-black text-2xl sm:text-3xl uppercase tracking-tight mt-2 text-black dark:text-white">
                  ALL WRITING CATEGORIES
                </h3>
              </div>

              <p className="font-body-serif text-sm text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                Filter through curated topics, literature essays, stories, and philosophical discourses. Select any topic to view matching essays.
              </p>

              <div className="flex flex-wrap gap-2.5 font-typewriter text-xs">
                {allCategories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  const count = cat === 'ALL'
                    ? essays.length
                    : essays.filter(e => {
                        const eCat = (e.category || '').toUpperCase();
                        const eTags = Array.isArray(e.tags) ? e.tags.map(t => cleanText(t.trim()).toUpperCase()) : [];
                        return eCat === cat || eTags.includes(cat) || eCat.includes(cat) || eTags.some(t => t.includes(cat));
                      }).length;

                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsCategoryModalOpen(false);
                      }}
                      className={`px-4 py-2 uppercase font-bold border-2 border-black transition-all cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'bg-[#C6F135] text-black shadow-[3px_3px_0px_#000] -translate-y-0.5'
                          : 'bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-[#C6F135] hover:text-black shadow-[2px_2px_0px_#000]'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="bg-black text-white px-1.5 py-0.2 text-[10px]">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 pt-4 border-t-2 border-dashed border-neutral-300 dark:border-neutral-700 flex justify-between items-center font-typewriter text-xs">
                <span className="text-neutral-500">TOTAL {allCategories.length} TOPICS FOUND</span>
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setIsCategoryModalOpen(false);
                  }}
                  className="bg-black text-[#C6F135] px-3 py-1 border border-black hover:bg-[#D97706] hover:text-white transition-colors cursor-pointer"
                >
                  RESET ALL
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FLOATING BOTTOM-RIGHT BRUTALIST MENU MODAL ─────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FAF8F5] dark:bg-[#15161A] text-black dark:text-white border-4 border-black dark:border-neutral-700 shadow-[14px_14px_0px_#C6F135] max-w-lg w-full p-6 sm:p-8 relative overflow-hidden"
            >
              {/* Top Accent Pins & Washi Tape */}
              <PushPin color="#D97706" angle={-10} className="top-3 left-4" />
              <WashiTape color="#C6F135" angle={3} className="absolute -top-3 right-16 z-20" />

              {/* Close Button */}
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 bg-black text-[#C6F135] w-9 h-9 flex items-center justify-center border-2 border-black hover:bg-[#D97706] hover:text-white transition-colors cursor-pointer text-sm font-bold shadow-[2px_2px_0px_#000]"
              >
                ✕
              </button>

              {/* Modal Header */}
              <div className="border-b-3 border-black pb-3 mb-6 font-typewriter">
                <span className="bg-[#C6F135] text-black text-xs font-bold uppercase px-2.5 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
                  DISPATCH DIRECTORY
                </span>
                <h3 className="font-editorial font-black text-2xl sm:text-3xl uppercase tracking-tight mt-2 text-black dark:text-white">
                  WRITER NAVIGATION
                </h3>
              </div>

              {/* Navigation Links Grid */}
              <div className="space-y-3 font-typewriter text-sm sm:text-base">
                {[
                  { label: '01. MANIFESTO & DRAFT', id: 'hero' },
                  { label: '02. PINNED SCRAPS CANVAS', id: 'scraps' },
                  { label: '03. TOPICS & GENRES', id: 'skills' },
                  { label: '04. SELECTED ESSAYS', id: 'essays' },
                  { label: '05. ABOUT THE WRITER', id: 'about' },
                  { label: '06. SEND A LETTER', id: 'contact' },
                  { label: '07. SCROLL TO TOP ↑', id: 'top' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="w-full text-left p-2.5 sm:p-3 bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-700 shadow-[3px_3px_0px_#000] hover:bg-[#C6F135] hover:text-black dark:hover:bg-[#C6F135] dark:hover:text-black hover:translate-x-1.5 transition-all font-bold cursor-pointer flex items-center justify-between group"
                  >
                    <span>{item.label}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </button>
                ))}
              </div>

              {/* Footer Quick Links */}
              <div className="mt-6 pt-4 border-t-2 border-dashed border-neutral-300 dark:border-neutral-700 flex flex-wrap items-center justify-between gap-3 font-typewriter text-xs">
                <a
                  href="mailto:hello@nokib.dev"
                  className="bg-black text-[#C6F135] px-3 py-1.5 border border-black shadow-[2px_2px_0px_#000] hover:bg-[#D97706] hover:text-white transition-colors"
                >
                  ✉ HELLO@NOKIB.DEV
                </a>
                <a
                  href="https://www.facebook.com/HasaNokiB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1877F2] text-white px-3 py-1.5 border border-black shadow-[2px_2px_0px_#000] hover:bg-[#166FE5] transition-colors"
                >
                  FACEBOOK
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FLOATING BOTTOM-RIGHT TRIGGER BUTTON ───────────────── */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50">
        <motion.button
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.94, y: 1 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close writer menu" : "Open writer menu"}
          className={`w-14 h-14 sm:w-16 sm:h-16 border-3 border-black flex items-center justify-center font-typewriter font-bold transition-all cursor-pointer ${
            isMenuOpen
              ? 'bg-black text-[#C6F135] shadow-[4px_4px_0px_#C6F135] text-2xl'
              : 'bg-[#C6F135] text-black shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#000000]'
          }`}
        >
          {isMenuOpen ? (
            <span>✕</span>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5">
              <span className="w-6 h-0.5 bg-black block" />
              <span className="w-4 h-0.5 bg-black block" />
              <span className="w-6 h-0.5 bg-black block" />
            </div>
          )}
        </motion.button>
      </div>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="border-t-3 border-black dark:border-neutral-800 bg-[#FFFDF9] dark:bg-[#121316] py-10 px-4 sm:px-8 mt-16 font-typewriter text-xs text-neutral-600 dark:text-neutral-400">
        <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-black text-[#C6F135] px-2.5 py-0.5 font-bold">
              NOKIB.WRITER
            </span>
            <span>&copy; {new Date().getFullYear()} ALL ESSAYS AND DISPATCHES</span>
          </div>
          <span className="font-editorial italic text-base text-neutral-600 dark:text-neutral-300">
            "Written with care, read with intent."
          </span>
        </div>
      </footer>

    </div>
  );
};

export default WriterHome;
