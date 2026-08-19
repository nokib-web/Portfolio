import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBookOpen, 
  FaFeatherAlt, 
  FaScroll, 
  FaHourglassHalf, 
  FaCompass, 
  FaBalanceScale, 
  FaQuoteLeft, 
  FaArrowRight, 
  FaEnvelope, 
  FaCheck, 
  FaCopy, 
  FaGithub, 
  FaRandom, 
  FaTimes,
  FaMonument
} from 'react-icons/fa';
import { appConfig } from '../config';

/* ─── Motion Animations ───────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
});

const formatDate = (dateStr) => {
  if (!dateStr) return 'Recent';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

/* ─── Classical Philosophical Paradoxes Database ─────────────── */
const classicalThoughtExperiments = [
  {
    id: 'theseus',
    latinTitle: "Navis Thesei",
    title: "The Ship of Theseus",
    domain: "Ontology & Identity",
    question: "If every wooden plank of a vessel is replaced one by one over decades, at what moment does it cease to be the original ship?",
    implication: "Exposes the fragile tension between physical continuity, structural form, and the human compulsion to impose persistent identity upon flux.",
    quote: "We are not the static marble, but the sculptor's continuous stroke upon time.",
    author: "Plutarch · Greek Antiquity"
  },
  {
    id: 'chinese-room',
    latinTitle: "Argumentum Cubicularis",
    title: "The Chinese Room Argument",
    domain: "Philosophy of AI & Semantics",
    question: "Can a mechanism manipulating symbols according to purely formal syntactical rules ever attain authentic understanding and semantic qualia?",
    implication: "Draws an immutable boundary between the simulation of intelligent behavior and the phenomenological reality of conscious experience.",
    quote: "Syntax alone can never breathe life into semantic comprehension.",
    author: "John Searle · Philosophy of Mind"
  },
  {
    id: 'simulation',
    latinTitle: "Hypothesis Simulacri",
    title: "The Simulation Hypothesis",
    domain: "Epistemology & Digital Physics",
    question: "If advanced civilizations inevitably run ancestor simulations, what is the probability that our sensory cosmos is base reality?",
    implication: "Reframes classical metaphysics as computational ontology and transforms epistemology into reverse-engineering reality's digital substrate.",
    quote: "The limits of our computation define the geometry of our universe.",
    author: "Nick Bostrom · Analytic Epistemology"
  },
  {
    id: 'qualia-mary',
    latinTitle: "Argumentum de Scientia",
    title: "Mary's Room & Physicalism",
    domain: "Consciousness & Qualia",
    question: "A neuroscientist knows every physical fact about color from a monochrome room. Does she gain novel knowledge when she first experiences red?",
    implication: "Demonstrates that subjective first-person experience (qualia) transcends exhaustive third-person physical descriptions.",
    quote: "To measure the wavelength of light is not to know the warmth of the sun.",
    author: "Frank Jackson · Epistemic Qualia"
  },
  {
    id: 'veil-ignorance',
    latinTitle: "Velum Ignorantiae",
    title: "The Veil of Ignorance",
    domain: "Ethics & Political Symmetry",
    question: "How would you architect a just society if you had zero prior knowledge of your own intellect, wealth, gender, or status within it?",
    implication: "Formulates justice not as charity, but as structural minimax symmetry where the dignity of the most vulnerable is uncompromised.",
    quote: "Justice is what we choose when we cannot rig the outcome in our favor.",
    author: "John Rawls · Moral Philosophy"
  },
  {
    id: 'boltzmann',
    latinTitle: "Cerebrum Boltzmannianum",
    title: "Boltzmann Brain Paradox",
    domain: "Thermodynamics & Cosmology",
    question: "In an entropic vacuum, is it statistically more probable for a solitary conscious mind to fluctuate into existence than an entire orderly universe?",
    implication: "Forces modern cosmology to explain why the early universe possessed extraordinarily low entropy for our empirical senses to be trusted.",
    quote: "Our memories are only as trustworthy as the cosmological initial conditions of the cosmos.",
    author: "Ludwig Boltzmann · Statistical Mechanics"
  }
];

/* ─── Classical Architectural Watermark Component ────────────── */
const ClassicalBackdrop = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
    {/* Warm Charcoal Stone Gradients */}
    <div className="absolute -top-[15%] left-1/3 w-[60rem] h-[60rem] bg-[#C89B6A]/[0.025] rounded-full blur-[160px]" />
    <div className="absolute top-1/2 -right-[10%] w-[50rem] h-[50rem] bg-[#B3804D]/[0.02] rounded-full blur-[140px]" />
    <div className="absolute bottom-1/4 -left-[10%] w-[45rem] h-[45rem] bg-[#8C6239]/[0.02] rounded-full blur-[130px]" />

    {/* Subtle Stone Dust Grain */}
    <div 
      className="absolute inset-0 opacity-[0.4]"
      style={{
        backgroundImage: `radial-gradient(1px 1px at 25px 25px, rgba(200, 155, 106, 0.15), transparent),
                          radial-gradient(1px 1px at 150px 150px, rgba(237, 232, 223, 0.08), transparent),
                          radial-gradient(1px 1px at 320px 80px, rgba(200, 155, 106, 0.12), transparent)`,
        backgroundSize: '400px 400px'
      }}
    />
  </div>
);

/* ─── Main PhilosopherHome Component ─────────────────────────── */
const PhilosopherHome = ({ persona }) => {
  const [treatises, setTreatises] = useState(persona?.projects || []);
  const [writings, setWritings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeParadox, setActiveParadox] = useState(classicalThoughtExperiments[0]);
  const [activeInquiryTab, setActiveInquiryTab] = useState('all');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedTreatiseModal, setSelectedTreatiseModal] = useState(null);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

  const fallbackSkills = persona?.skills || [
    {
      category: "Fields of Core Inquiry",
      latin: "Doctrina Primaria",
      items: [
        { name: "Epistemology", level: "Theory of Knowledge, Evidence and Rational Justification" },
        { name: "Philosophy of Mind", level: "Consciousness, Qualia, Agency and Computational Functionalism" },
        { name: "AI Ethics & Value Alignment", level: "Normative Systems, Machine Morality and Existential Risk" },
        { name: "Systems & Complexity Dynamics", level: "Cybernetic Feedback, Emergent Order and Self-Organization" }
      ]
    },
    {
      category: "Dialectical Methodologies",
      latin: "Methodus Dialectica",
      items: [
        { name: "Socratic Elenchus", level: "Iterative First-Principles Dissection & Refutation" },
        { name: "Phenomenological Reduction", level: "Analysis of First-Person Intentional Structures" },
        { name: "Bayesian Epistemology", level: "Probabilistic Belief Updating & Prior Distributions" }
      ]
    },
    {
      category: "Foundational Canon & Thinkers",
      latin: "Auctores Canonici",
      items: [
        { name: "Alan Turing", level: "Limits of Computation, Decidability & Machine Intelligence" },
        { name: "Douglas Hofstadter", level: "Strange Loops, Self-Reference & Emergent Meaning" },
        { name: "Norbert Wiener", level: "Cybernetics, Feedback & Purpose in Systems" },
        { name: "Ludwig Wittgenstein", level: "Logical Atomism, Language Games & Boundaries of Sense" }
      ]
    }
  ];

  /* Dynamic Data Fetching */
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
        console.warn('Using static defaults for Classical Deep Thinker persona:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicData();
  }, [persona]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hello@nokib.dev');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleRandomParadox = () => {
    const remaining = classicalThoughtExperiments.filter(p => p.id !== activeParadox.id);
    const random = remaining[Math.floor(Math.random() * remaining.length)];
    setActiveParadox(random);
  };

  const scrollTo = (id) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsNavMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0E0F12] text-[#EDE8DF] relative overflow-hidden font-garamond selection:bg-[#C89B6A]/30 selection:text-[#EDE8DF]">
      
      {/* Classical Background Texture & Ambient Mesh */}
      <ClassicalBackdrop />

      {/* ── TOP CLASSICAL ARCHITRAVE BANNER ───────────────────────── */}
      <div className="relative z-20 border-b border-[#C89B6A]/20 bg-[#121318]/90 backdrop-blur-md px-4 sm:px-8 py-3">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between font-cinzel text-xs text-[#C8BFAF]">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C89B6A] shadow-[0_0_8px_rgba(200,155,106,0.8)]" />
            <span className="tracking-[0.25em] text-[#EDE8DF] font-bold text-[11px] sm:text-xs">
              NOKIB · ΦΙΛΟΣΟΦΙΑ · DEEP THINKER
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-6 text-[10px] sm:text-[11px] tracking-[0.2em] text-[#A39788]">
            <span>ONTOLOGIA</span>
            <span>✦</span>
            <span>EPISTEMOLOGIA</span>
            <span>✦</span>
            <span>ETHICA COMPUTATIONIS</span>
            <span>✦</span>
            <span className="text-[#C89B6A] font-semibold">VERITAS ANTE COMMODUM</span>
          </div>
        </div>
      </div>

      {/* ── MAIN 1920PX CONTAINER ─────────────────────────────────── */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-14 md:py-24 relative z-10 space-y-32 md:space-y-40">

        {/* ── SECTION 1: PROLOGUE · HERO & CORE AXIOM ──────────────── */}
        <section id="intro" className="space-y-12 pt-2 md:pt-6">
          
          {/* Classical Inscription Badge */}
          <motion.div {...fadeUp(0)} className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#1A1B22] border border-[#C89B6A]/30 text-[#C89B6A] text-[11px] font-cinzel tracking-[0.25em] uppercase shadow-[0_0_20px_rgba(200,155,106,0.08)]">
              <FaMonument className="text-[#C89B6A] text-xs" />
              <span>PROLOGUE I · THE DIALECTICAL INQUIRY</span>
            </span>
          </motion.div>

          {/* Main Hero Headline in Classical Cinzel Serif */}
          <div className="space-y-6 max-w-6xl">
            <motion.h1 
              {...fadeUp(0.1)}
              className="font-cinzel text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-tight text-[#EDE8DF] leading-[1.12]"
            >
              Asking the fundamental questions about <span className="italic font-garamond text-[#C89B6A]">mind</span>, <span className="italic font-garamond text-[#E6DFD5]">meaning</span>, and computational reality.
            </motion.h1>
          </div>

          {/* Hero Bento: Classical Stone Slab + Carved Marble Axiom */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
            
            {/* Left Slab: Philosophical Mission */}
            <motion.div 
              {...fadeUp(0.15)}
              className="lg:col-span-7 bg-[#14151B]/90 border border-[#C89B6A]/25 rounded-3xl p-8 sm:p-12 flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden group hover:border-[#C89B6A]/50 transition-all duration-500"
            >
              {/* Hairline Bronze Top Rim */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C89B6A]/60 to-transparent" />

              <div className="space-y-6">
                <div className="flex items-center justify-between font-cinzel text-[11px] text-[#C89B6A] tracking-[0.2em] uppercase pb-4 border-b border-[#C89B6A]/15">
                  <span className="flex items-center gap-2">
                    <FaCompass className="text-[#C89B6A]" />
                    <span>EPISTEMIC HORIZON</span>
                  </span>
                  <span className="text-[#8C7F70]">
                    ANNO DOMINI {new Date().getFullYear()}
                  </span>
                </div>

                <p className="text-xl sm:text-2xl text-[#DFD7CB] font-normal leading-relaxed font-garamond">
                  {persona?.about || "I believe technology is not merely a tool, but an epistemological lens that reshapes human cognition. As autonomous algorithms and neural architectures increasingly mediate our perception of truth, examining the foundational assumptions under which these systems operate becomes our most urgent philosophical task."}
                </p>
              </div>

              {/* Classical Roman Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 mt-8 border-t border-[#C89B6A]/15 font-cinzel">
                <div>
                  <span className="text-3xl sm:text-4xl text-[#EDE8DF] font-light block">IV</span>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#8C7F70]">Fields of Inquiry</span>
                </div>
                <div>
                  <span className="text-3xl sm:text-4xl text-[#C89B6A] font-light block">III</span>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#8C7F70]">Treatises</span>
                </div>
                <div>
                  <span className="text-3xl sm:text-4xl text-[#DFD7CB] font-light block">XII+</span>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#8C7F70]">Paradigms</span>
                </div>
                <div>
                  <span className="text-3xl sm:text-4xl text-[#C89B6A] font-light block">∞</span>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#8C7F70]">Dialectics</span>
                </div>
              </div>
            </motion.div>

            {/* Right Slab: Carved Stone Epigraph */}
            <motion.div 
              {...fadeUp(0.2)}
              className="lg:col-span-5 bg-gradient-to-b from-[#181A22] via-[#121319] to-[#0E0F12] border border-[#C89B6A]/25 rounded-3xl p-8 sm:p-12 flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden group hover:border-[#C89B6A]/50 transition-all duration-500"
            >
              <FaQuoteLeft className="absolute -right-4 -bottom-6 text-9xl text-[#C89B6A]/[0.03] pointer-events-none select-none" />

              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between font-cinzel text-[11px] text-[#C89B6A] tracking-[0.2em] uppercase pb-4 border-b border-[#C89B6A]/15">
                  <span className="flex items-center gap-2">
                    <FaBalanceScale className="text-[#C89B6A]" />
                    <span>AXIOMA PRIMUM</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C89B6A]/10 border border-[#C89B6A]/30 text-[#C89B6A] text-[9px] tracking-widest">
                    FOUNDATIONAL
                  </span>
                </div>

                <blockquote className="text-2xl sm:text-3xl text-[#EDE8DF] font-normal leading-snug italic font-garamond">
                  "{persona?.epigraph?.quote || "The unexamined algorithm is not worth executing; the unexamined life is not worth living."}"
                </blockquote>
              </div>

              <div className="pt-8 mt-8 border-t border-[#C89B6A]/15 flex items-center justify-between font-cinzel text-xs text-[#8C7F70] relative z-10">
                <cite className="not-italic text-[#C89B6A] font-semibold tracking-wider">
                  — {persona?.epigraph?.attribution || "Nokib · Dialectical Reflections"}
                </cite>
                <span className="text-[10px] tracking-[0.2em] text-[#8C7F70] uppercase">
                  [ METAPHYSICA ]
                </span>
              </div>
            </motion.div>

          </div>

        </section>


        {/* ── SECTION 2: SECTIO II · FIELDS OF INQUIRY & CANON ─────── */}
        <section id="inquiry" className="space-y-12">
          
          <motion.div {...fadeUp(0.1)} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#C89B6A]/20">
            <div>
              <span className="text-xs font-cinzel uppercase tracking-[0.25em] text-[#C89B6A] block mb-2 font-bold">
                SECTIO II · TAXONOMIA COGNITIONIS
              </span>
              <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-normal text-[#EDE8DF] tracking-tight">
                Fields of Inquiry &amp; Foundational Canon
              </h2>
            </div>

            {/* Filter Tabs in Classical Cinzel Style */}
            <div className="flex flex-wrap gap-2 font-cinzel text-xs">
              {[
                { id: 'all', label: 'All Frameworks' },
                { id: 'fields', label: 'Core Inquiries' },
                { id: 'methods', label: 'Methodologies' },
                { id: 'thinkers', label: 'Canon Thinkers' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveInquiryTab(tab.id)}
                  className={`px-4 py-2 rounded-full border transition-all duration-300 cursor-pointer tracking-wider text-[11px] ${
                    activeInquiryTab === tab.id
                      ? 'bg-[#C89B6A]/20 text-[#EDE8DF] border-[#C89B6A] shadow-[0_0_15px_rgba(200,155,106,0.2)] font-semibold'
                      : 'bg-[#14151B] text-[#A39788] border-[#C89B6A]/15 hover:border-[#C89B6A]/40 hover:text-[#EDE8DF]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Cards Grid: Slabs of Antique Marble */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fallbackSkills.map((category, catIdx) => {
              const matchKey = catIdx === 0 ? 'fields' : catIdx === 1 ? 'methods' : 'thinkers';
              const isFilteredOut = activeInquiryTab !== 'all' && activeInquiryTab !== matchKey;

              if (isFilteredOut) return null;

              return (
                <motion.div
                  key={catIdx}
                  {...fadeUp(0.1 + catIdx * 0.08)}
                  className="bg-[#14151B]/90 border border-[#C89B6A]/20 rounded-3xl p-8 flex flex-col justify-between hover:border-[#C89B6A]/50 hover:bg-[#181A22] transition-all duration-500 shadow-xl group"
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-[#C89B6A]/15 font-cinzel text-xs">
                      <div>
                        <span className="text-[#C89B6A] uppercase tracking-[0.2em] font-bold block">
                          {category.category}
                        </span>
                        <span className="text-[10px] text-[#8C7F70] italic font-garamond">
                          {category.latin || 'Tractatus Academicus'}
                        </span>
                      </div>
                      <span className="font-cinzel text-[#8C7F70] text-sm">
                        0{catIdx + 1}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {category.items?.map((item, iIdx) => (
                        <div 
                          key={iIdx}
                          className="p-4 rounded-2xl bg-[#0E0F12]/60 border border-[#C89B6A]/10 hover:border-[#C89B6A]/30 hover:bg-[#1A1C24] transition-all duration-300 group"
                        >
                          <div className="flex items-center justify-between font-cinzel text-xs text-[#EDE8DF] group-hover:text-[#C89B6A] tracking-wider">
                            <span>{item.name}</span>
                            <span className="text-[10px] text-[#C89B6A] opacity-0 group-hover:opacity-100 transition-opacity">
                              ✦
                            </span>
                          </div>
                          {item.level && (
                            <p className="text-sm text-[#A39788] font-garamond mt-1.5 leading-relaxed">
                              {item.level}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#C89B6A]/15 text-[10px] font-cinzel text-[#8C7F70] flex justify-between tracking-widest">
                    <span>RIGOR DIALECTICUS</span>
                    <span>VERITAS</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </section>


        {/* ── SECTION 3: TRACTATUS III · PHILOSOPHICAL TREATISES ────── */}
        <section id="treatises" className="space-y-12">
          
          <motion.div {...fadeUp(0.1)} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#C89B6A]/20">
            <div>
              <span className="text-xs font-cinzel uppercase tracking-[0.25em] text-[#C89B6A] block mb-2 font-bold">
                TRACTATUS III · MONOGRAPHIAE ET SCRIPTA
              </span>
              <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-normal text-[#EDE8DF] tracking-tight">
                Featured Philosophical Treatises
              </h2>
            </div>
            <span className="text-xs font-cinzel text-[#8C7F70] tracking-widest">
              [ {treatises.length} TREATISES ARCHIVED ]
            </span>
          </motion.div>

          {/* Treatises Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {treatises.map((treatise, idx) => (
              <motion.article
                key={treatise._id || idx}
                {...fadeUp(0.1 + idx * 0.1)}
                className="bg-[#14151B]/90 border border-[#C89B6A]/20 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-[#C89B6A]/60 transition-all duration-500 shadow-2xl group"
              >
                {/* Image Ambient Header */}
                {treatise.image && (
                  <div className="h-56 w-full overflow-hidden relative bg-[#090A0D]">
                    <img 
                      src={treatise.image} 
                      alt={treatise.title}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700 filter grayscale-[30%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14151B] via-transparent to-transparent" />
                    
                    {/* Status Seal */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3.5 py-1 rounded-full bg-[#0E0F12]/85 border border-[#C89B6A]/30 text-[#C89B6A] font-cinzel text-[9px] tracking-[0.2em] uppercase backdrop-blur-md">
                        {treatise.status || 'TREATISE'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    {/* Domains / Tags */}
                    {treatise.tech && Array.isArray(treatise.tech) && (
                      <div className="flex flex-wrap gap-1.5 font-cinzel text-[9px]">
                        {treatise.tech.map((t, tIdx) => (
                          <span 
                            key={tIdx}
                            className="px-2.5 py-0.5 rounded-full bg-[#1A1B22] border border-[#C89B6A]/15 text-[#C8BFAF] tracking-wider"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <h3 className="font-cinzel text-xl sm:text-2xl font-normal text-[#EDE8DF] group-hover:text-[#C89B6A] transition-colors leading-snug">
                      {treatise.title}
                    </h3>

                    <p className="text-base text-[#A39788] font-garamond leading-relaxed line-clamp-4">
                      {treatise.description}
                    </p>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-6 border-t border-[#C89B6A]/15 flex items-center justify-between font-cinzel text-xs">
                    <span className="text-[#8C7F70] text-[11px]">
                      {treatise.readTime || '12 min read'}
                    </span>
                    <button
                      onClick={() => setSelectedTreatiseModal(treatise)}
                      className="text-[#C89B6A] hover:text-[#EDE8DF] font-semibold flex items-center gap-2 group-hover:translate-x-1.5 transition-all cursor-pointer tracking-wider text-[11px]"
                    >
                      <span>Read Overview</span>
                      <FaArrowRight className="text-[10px]" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

        </section>


        {/* ── SECTION 4: DISPUTATIO IV · PARADOX SANDBOX ──────────── */}
        <section id="paradoxes" className="space-y-12">
          
          <motion.div {...fadeUp(0.1)} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#C89B6A]/20">
            <div>
              <span className="text-xs font-cinzel uppercase tracking-[0.25em] text-[#C89B6A] block mb-2 font-bold">
                DISPUTATIO IV · SOCRATIC PARADOX SANDBOX
              </span>
              <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-normal text-[#EDE8DF] tracking-tight">
                Philosophical Paradoxes &amp; Thought Experiments
              </h2>
            </div>
            
            <button
              onClick={handleRandomParadox}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C89B6A]/10 border border-[#C89B6A]/40 text-[#C89B6A] font-cinzel text-xs hover:bg-[#C89B6A]/20 transition-all cursor-pointer shadow-[0_0_20px_rgba(200,155,106,0.15)] tracking-wider"
            >
              <FaRandom className="text-xs" />
              <span>Draw Socratic Paradox</span>
            </button>
          </motion.div>

          {/* Interactive Console Slab */}
          <motion.div 
            {...fadeUp(0.15)}
            className="rounded-3xl border border-[#C89B6A]/25 bg-gradient-to-b from-[#16171F] to-[#0E0F12] p-8 sm:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.7)] space-y-10"
          >
            {/* Selector Pills in Classical Style */}
            <div className="flex flex-wrap gap-2.5 font-cinzel text-xs">
              {classicalThoughtExperiments.map((paradox) => {
                const isSelected = activeParadox.id === paradox.id;
                return (
                  <button
                    key={paradox.id}
                    onClick={() => setActiveParadox(paradox)}
                    className={`px-4 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer tracking-wider text-[11px] ${
                      isSelected
                        ? 'bg-[#C89B6A] text-[#0E0F12] border-[#C89B6A] shadow-[0_0_20px_rgba(200,155,106,0.3)] font-bold'
                        : 'bg-[#101116] text-[#A39788] border-[#C89B6A]/15 hover:border-[#C89B6A]/40 hover:text-[#EDE8DF]'
                    }`}
                  >
                    {paradox.title}
                  </button>
                );
              })}
            </div>

            {/* Active Socratic Paradox Display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeParadox.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4"
              >
                {/* Left Column: The Inquiry */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1 rounded-full bg-[#C89B6A]/10 border border-[#C89B6A]/30 text-[#C89B6A] font-cinzel text-[10px] tracking-[0.2em] uppercase">
                      {activeParadox.domain}
                    </span>
                    <span className="text-xs text-[#8C7F70] italic font-garamond">
                      {activeParadox.latinTitle}
                    </span>
                  </div>

                  <h3 className="font-cinzel text-2xl sm:text-4xl text-[#EDE8DF] font-normal leading-tight">
                    {activeParadox.title}
                  </h3>

                  <div className="p-6 rounded-2xl bg-[#0E0F12]/80 border border-[#C89B6A]/20 space-y-2">
                    <span className="text-[10px] font-cinzel uppercase tracking-[0.25em] text-[#C89B6A] font-bold block">
                      QUESTIO PRIMA · THE CORE INQUIRY:
                    </span>
                    <p className="text-xl sm:text-2xl text-[#EDE8DF] font-garamond leading-relaxed">
                      "{activeParadox.question}"
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-cinzel uppercase tracking-[0.25em] text-[#8C7F70] font-bold block">
                      PHILOSOPHICAL IMPLICATION:
                    </span>
                    <p className="text-base text-[#A39788] leading-relaxed font-garamond">
                      {activeParadox.implication}
                    </p>
                  </div>
                </div>

                {/* Right Column: Carved Contemplation Quote */}
                <div className="lg:col-span-5 rounded-2xl border border-[#C89B6A]/20 bg-[#121319] p-8 flex flex-col justify-between space-y-6 relative overflow-hidden">
                  <FaFeatherAlt className="text-[#C89B6A]/30 text-2xl" />
                  
                  <blockquote className="text-xl sm:text-2xl text-[#EDE8DF] italic font-garamond leading-snug">
                    "{activeParadox.quote}"
                  </blockquote>

                  <div className="pt-4 border-t border-[#C89B6A]/15 font-cinzel text-[11px] text-[#8C7F70] flex justify-between tracking-wider">
                    <span>{activeParadox.author}</span>
                    <span className="text-[#C89B6A]">✦</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

          </motion.div>

        </section>


        {/* ── SECTION 5: CORPUS V · ESSAYS & DISCOURSES ────────────── */}
        <section id="writings" className="space-y-12">
          
          <motion.div {...fadeUp(0.1)} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#C89B6A]/20">
            <div>
              <span className="text-xs font-cinzel uppercase tracking-[0.25em] text-[#C89B6A] block mb-2 font-bold">
                CORPUS V · DISPUTATIONES ET REFLECTIONES
              </span>
              <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-normal text-[#EDE8DF] tracking-tight">
                Philosophical Essays &amp; Discourses
              </h2>
            </div>
            <span className="text-xs font-cinzel text-[#8C7F70] tracking-widest">
              [ CHRONOLOGICAL ARCHIVE ]
            </span>
          </motion.div>

          {loading ? (
            <div className="p-16 rounded-3xl border border-[#C89B6A]/20 bg-[#14151B] text-center font-cinzel text-xs text-[#A39788]">
              <span className="animate-pulse">LOADING PHILOSOPHICAL ESSAYS...</span>
            </div>
          ) : writings.length === 0 ? (
            /* Fallback Curated Discourses if database is empty */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  slug: 'artificial-agency-and-meaning',
                  title: "Can a Neural Network Experience the Weight of Its Own Answers?",
                  category: "Philosophy of AI",
                  readTime: "8 min read",
                  date: "August 2026",
                  excerpt: "Investigating the fundamental difference between syntactic statistical convergence and subjective phenomenological commitment in artificial architectures."
                },
                {
                  slug: 'strange-loops-and-consciousness',
                  title: "Strange Loops: How Self-Reference Breathes Life into Symbols",
                  category: "Cognitive Science",
                  readTime: "11 min read",
                  date: "July 2026",
                  excerpt: "Exploring Hofstadter's insight on how hierarchical feedback loops cross level boundaries to generate the persistent illusion of an 'I'."
                }
              ].map((essay, idx) => (
                <motion.article
                  key={idx}
                  {...fadeUp(0.1 + idx * 0.1)}
                  className="bg-[#14151B]/90 border border-[#C89B6A]/20 rounded-3xl p-8 sm:p-10 flex flex-col justify-between hover:border-[#C89B6A]/50 hover:bg-[#181A22] transition-all duration-500 shadow-xl group"
                >
                  <Link to={`/philosopher/blog/${essay.slug}`} className="space-y-6 block">
                    <div className="flex items-center justify-between text-xs font-cinzel">
                      <span className="px-3 py-1 rounded-full bg-[#1A1B22] border border-[#C89B6A]/25 text-[#C89B6A] tracking-[0.2em] text-[10px]">
                        {essay.category}
                      </span>
                      <span className="text-[#8C7F70]">{essay.readTime}</span>
                    </div>

                    <h3 className="font-cinzel text-2xl sm:text-3xl text-[#EDE8DF] group-hover:text-[#C89B6A] transition-colors leading-snug font-normal">
                      {essay.title}
                    </h3>

                    <p className="text-[#A39788] text-lg font-garamond leading-relaxed line-clamp-3">
                      {essay.excerpt}
                    </p>

                    <div className="pt-6 border-t border-[#C89B6A]/15 flex items-center justify-between font-cinzel text-xs text-[#8C7F70]">
                      <span>{essay.date}</span>
                      <span className="text-[#C89B6A] group-hover:translate-x-1.5 transition-transform flex items-center gap-2 font-semibold">
                        <span>Read Discourse</span>
                        <FaArrowRight className="text-[10px]" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {writings.map((blog, idx) => (
                <motion.article
                  key={blog._id || idx}
                  {...fadeUp(0.1 + idx * 0.08)}
                  className="bg-[#14151B]/90 border border-[#C89B6A]/20 rounded-3xl p-8 flex flex-col justify-between hover:border-[#C89B6A]/50 hover:bg-[#181A22] transition-all duration-500 shadow-xl group"
                >
                  <Link to={`/philosopher/blog/${blog.slug}`} className="space-y-5 block flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-cinzel mb-4">
                        <span className="px-3 py-0.5 rounded-full bg-[#1A1B22] border border-[#C89B6A]/25 text-[#C89B6A] tracking-[0.2em] text-[9px]">
                          {blog.category || 'Discourse'}
                        </span>
                        <span className="text-[#8C7F70]">{blog.readTime || '6 min read'}</span>
                      </div>

                      <h3 className="font-cinzel text-xl sm:text-2xl text-[#EDE8DF] group-hover:text-[#C89B6A] transition-colors leading-snug mb-3 font-normal">
                        {blog.title}
                      </h3>

                      <p className="text-[#A39788] text-base font-garamond leading-relaxed line-clamp-3">
                        {blog.excerpt}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-[#C89B6A]/15 flex items-center justify-between font-cinzel text-xs text-[#8C7F70] mt-6">
                      <span>{formatDate(blog.createdAt || blog.date)}</span>
                      <span className="text-[#C89B6A] group-hover:translate-x-1.5 transition-transform flex items-center gap-1.5 font-semibold">
                        <span>Read Essay</span>
                        <FaArrowRight className="text-[10px]" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}

        </section>


        {/* ── SECTION 6: SYMPOSIUM VI · INTELLECTUAL EXCHANGE ──────── */}
        <section id="discourse" className="space-y-8">
          
          <motion.div 
            {...fadeUp(0.1)}
            className="rounded-3xl border border-[#C89B6A]/30 bg-gradient-to-br from-[#16171E] via-[#121319] to-[#0E0F12] p-8 sm:p-14 shadow-2xl relative overflow-hidden"
          >
            <div className="max-w-3xl space-y-8 relative z-10">
              <span className="px-4 py-1.5 rounded-full bg-[#C89B6A]/10 border border-[#C89B6A]/30 text-[#C89B6A] font-cinzel text-[10px] uppercase tracking-[0.25em] font-bold">
                SYMPOSIUM VI · INTELLECTUAL EXCHANGE
              </span>

              <h2 className="font-cinzel text-3xl sm:text-5xl font-normal text-[#EDE8DF] leading-tight">
                "Truth is not discovered in isolation, but forged through rigorous dialectic."
              </h2>

              <p className="text-lg sm:text-xl text-[#DFD7CB] font-garamond leading-relaxed">
                Whether you are exploring the ontology of artificial agency, computational ethics, or metaphysical foundations, I welcome sincere intellectual inquiries and philosophical collaborations.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4 font-cinzel text-xs">
                <a
                  href="mailto:hello@nokib.dev"
                  className="px-7 py-3.5 rounded-full bg-[#C89B6A] text-[#0E0F12] font-bold hover:bg-[#D4AF37] transition-all shadow-[0_0_25px_rgba(200,155,106,0.35)] flex items-center gap-2 cursor-pointer tracking-wider"
                >
                  <FaEnvelope />
                  <span>Send Philosophical Inquiry</span>
                </a>

                <button
                  onClick={handleCopyEmail}
                  className="px-5 py-3.5 rounded-full bg-[#14151B] border border-[#C89B6A]/30 text-[#EDE8DF] hover:text-[#C89B6A] hover:border-[#C89B6A] transition-all flex items-center gap-2 cursor-pointer tracking-wider"
                >
                  {copiedEmail ? <FaCheck className="text-emerald-400" /> : <FaCopy />}
                  <span>{copiedEmail ? 'Email Copied' : 'hello@nokib.dev'}</span>
                </button>

                <a
                  href="https://github.com/nokib-web"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-full bg-[#14151B] border border-[#C89B6A]/30 text-[#EDE8DF] hover:text-[#C89B6A] hover:border-[#C89B6A] transition-all flex items-center gap-2 tracking-wider"
                >
                  <FaGithub />
                  <span>GitHub Corpus</span>
                </a>
              </div>
            </div>
          </motion.div>

        </section>

      </div>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="border-t border-[#C89B6A]/20 bg-[#090A0D] py-12 px-4 sm:px-8 relative z-10 font-cinzel text-xs text-[#8C7F70]">
        <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C89B6A]" />
            <span className="text-[#EDE8DF] font-bold tracking-widest">NOKIB · ΦΙΛΟΣΟΦΙΑ</span>
            <span>&copy; {new Date().getFullYear()} ALL INQUIRIES RESERVED</span>
          </div>
          <div className="italic font-garamond text-base text-[#A39788]">
            "Cogito, ergo sum — et computo, ergo interrogo."
          </div>
        </div>
      </footer>

      {/* ── TREATISE MODAL ─────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedTreatiseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTreatiseModal(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#121319] text-[#EDE8DF] border border-[#C89B6A]/30 rounded-3xl max-w-2xl w-full p-8 sm:p-10 relative overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.9)] space-y-6 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedTreatiseModal(null)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#1A1B22] border border-[#C89B6A]/30 text-[#C89B6A] hover:text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-cinzel"
              >
                ✕
              </button>

              <div className="space-y-2">
                <span className="text-[10px] font-cinzel uppercase tracking-[0.25em] text-[#C89B6A] font-bold">
                  TRACTATUS MONOGRAPHIA
                </span>
                <h3 className="font-cinzel text-2xl sm:text-3xl text-[#EDE8DF] font-normal leading-snug">
                  {selectedTreatiseModal.title}
                </h3>
              </div>

              {selectedTreatiseModal.image && (
                <div className="h-48 w-full rounded-2xl overflow-hidden border border-[#C89B6A]/20">
                  <img
                    src={selectedTreatiseModal.image}
                    alt={selectedTreatiseModal.title}
                    className="w-full h-full object-cover filter grayscale-[20%]"
                  />
                </div>
              )}

              <p className="text-[#DFD7CB] font-garamond text-lg leading-relaxed">
                {selectedTreatiseModal.description}
              </p>

              {selectedTreatiseModal.tech && Array.isArray(selectedTreatiseModal.tech) && (
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-cinzel uppercase tracking-widest text-[#8C7F70] block font-bold">
                    CANONICAL DOMAINS &amp; THEORIES:
                  </span>
                  <div className="flex flex-wrap gap-2 font-cinzel text-[10px]">
                    {selectedTreatiseModal.tech.map((t, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full bg-[#1A1B22] border border-[#C89B6A]/20 text-[#C89B6A]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-[#C89B6A]/20 flex items-center justify-between font-cinzel text-xs">
                <span className="text-[#8C7F70]">{selectedTreatiseModal.readTime || 'Complete Monograph'}</span>
                <button
                  onClick={() => setSelectedTreatiseModal(null)}
                  className="px-6 py-2 rounded-full bg-[#C89B6A] text-[#0E0F12] hover:bg-[#D4AF37] transition-colors cursor-pointer font-bold tracking-wider"
                >
                  Close Overview
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FLOATING COMPASS NAVIGATOR (BOTTOM RIGHT) ──────────────── */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40">
        <button
          onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
          className="w-14 h-14 rounded-full bg-[#14151B] border border-[#C89B6A]/40 text-[#C89B6A] flex items-center justify-center shadow-[0_0_30px_rgba(200,155,106,0.3)] hover:scale-105 hover:border-[#C89B6A] transition-all cursor-pointer text-lg"
          title="Philosophical Navigator"
          aria-label="Philosophical Navigator"
        >
          {isNavMenuOpen ? <FaTimes /> : <FaCompass />}
        </button>
      </div>

      <AnimatePresence>
        {isNavMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 sm:bottom-26 sm:right-8 z-40 w-72 rounded-3xl border border-[#C89B6A]/30 bg-[#121318]/95 backdrop-blur-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-3 font-cinzel text-xs"
          >
            <div className="pb-2 border-b border-[#C89B6A]/20 text-[10px] text-[#C89B6A] font-bold tracking-[0.25em] uppercase">
              INDEX PHILOSOPHICUS
            </div>
            
            {[
              { id: 'intro', label: 'I · Prologue & Axiom' },
              { id: 'inquiry', label: 'II · Fields of Inquiry' },
              { id: 'treatises', label: 'III · Treatises' },
              { id: 'paradoxes', label: 'IV · Socratic Paradoxes' },
              { id: 'writings', label: 'V · Philosophical Essays' },
              { id: 'discourse', label: 'VI · Symposium Discourse' },
              { id: 'top', label: '↑ Back to Top' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-[#EDE8DF] hover:text-[#0E0F12] hover:bg-[#C89B6A] transition-all cursor-pointer flex items-center justify-between text-[11px] tracking-wider"
              >
                <span>{item.label}</span>
                <span className="text-[10px]">→</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PhilosopherHome;
