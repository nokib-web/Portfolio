import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaGithub } from "react-icons/fa";
import { motion } from 'framer-motion';
import MobileMenu from './MobileMenu';
import PersonaSelectorModal from './PersonaSelectorModal';
import { skills } from '../data/portfolioData';
import { appConfig } from '../config';

const Header = ({ activeSection, activePersonaId = 'developer', light = false }) => {
    const location = useLocation();
    const isBlogPage = location.pathname.startsWith('/developer/blog') || location.pathname.startsWith('/blog');

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return savedTheme === 'dark' || (!savedTheme && prefersDark);
    });

    const [currentTime, setCurrentTime] = useState(new Date());
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    // Scroll Direction Tracking for adaptive Header visibility (hides on scroll down, shows on scroll up)
    useEffect(() => {
        let prevScrollY = window.scrollY;
        
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > prevScrollY && currentScrollY > 80) {
                setIsVisible(false); // scrolling down
            } else if (currentScrollY < prevScrollY) {
                setIsVisible(true); // scrolling up
            }
            
            prevScrollY = currentScrollY;
        };

        window.addEventListener('scroll', controlNavbar, { passive: true });
        return () => window.removeEventListener('scroll', controlNavbar);
    }, []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const searchInputRef = useRef(null);

    const [liveProjects, setLiveProjects] = useState([]);
    const [liveBlogs, setLiveBlogs] = useState([]);

    // Fetch live data for search index
    useEffect(() => {
        fetch(`${appConfig.apiBaseUrl}/api/projects`)
            .then(res => res.json())
            .then(data => setLiveProjects(data))
            .catch(err => console.error(err));

        fetch(`${appConfig.apiBaseUrl}/api/blogs`)
            .then(res => res.json())
            .then(data => setLiveBlogs(data))
            .catch(err => console.error(err));
    }, []);

    // Apply theme to DOM when isDarkMode changes
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    // Search Logic
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const query = searchQuery.toLowerCase();
        const results = [];

        // Search Projects (Live)
        liveProjects.forEach(project => {
            if (
                project.title.toLowerCase().includes(query) ||
                project.description.toLowerCase().includes(query) ||
                (project.tech && project.tech.some(t => t.toLowerCase().includes(query)))
            ) {
                results.push({ type: 'Project', title: project.title, link: '#projects', icon: 'code' });
            }
        });

        // Search Skills
        skills.forEach(cat => {
            cat.items.forEach(skill => {
                if (skill.name.toLowerCase().includes(query)) {
                    results.push({ type: 'Skill', title: skill.name, link: '#skills', icon: 'handyman' });
                }
            });
        });

        // Search Blog Posts (Live)
        liveBlogs.forEach(post => {
            if (
                post.title.toLowerCase().includes(query) ||
                (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
            ) {
                results.push({
                    type: 'Blog',
                    title: post.title,
                    link: `/developer/blog/${post.slug}`,
                    icon: 'description'
                });
            }
        });

        // Search Sections
        const sections = ['Home', 'About', 'Experience', 'Education', 'Projects', 'Skills', 'Contact', 'Stats', 'Blog'];
        sections.forEach(section => {
            if (section.toLowerCase().includes(query)) {
                let link = `#${section.toLowerCase()}`;
                if (section === 'Home') link = '#hero';
                if (section === 'Skills') link = '#skills';
                if (section === 'Projects') link = '#projects';
                if (section === 'Blog') link = '/developer/blog';

                results.push({ type: 'Section', title: `Go to ${section}`, link: link, icon: 'article' });
            }
        });

        // Pro Commands (The "Command Palette" vibe)
        const commands = [
            { title: 'Toggle Dark Mode', icon: 'dark_mode', action: 'theme' },
            { title: 'Download Resume', icon: 'download', action: 'resume', link: 'https://drive.google.com/uc?export=download&id=1DzzReSIxO0LUPYU5si0p-7c4Hy4ypEOY' },
            { title: 'Contact / Email Me', icon: 'mail', link: 'mailto:nokib.web@gmail.com' },
            { title: 'Go to LinkedIn', icon: 'open_in_new', link: 'https://www.linkedin.com/in/nazmulhasan-nokib/' },
            { title: 'Go to GitHub', icon: 'code', link: 'https://github.com/nokib-web' }
        ];

        commands.forEach(cmd => {
            if (cmd.title.toLowerCase().includes(query)) {
                results.push({ type: 'Command', ...cmd });
            }
        });

        setSearchResults(results);
        setShowResults(true);
    }, [searchQuery]);

    const handleResultClick = (result) => {
        if (result.action === 'theme') {
            toggleDarkMode();
            setSearchQuery('');
            setShowResults(false);
            return;
        }

        if (result.link?.startsWith('http') || result.link?.startsWith('mailto')) {
            window.open(result.link, '_blank');
            setSearchQuery('');
            setShowResults(false);
            return;
        }

        setSearchQuery('');
        setShowResults(false);
    };

    // Toggle Dark Mode
    const toggleDarkMode = () => {
        setIsDarkMode(prev => {
            const newMode = !prev;
            if (newMode) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
            return newMode;
        });
    };

    // Live Clock Update
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Format time as HH:MM:SS
    const formatTime = (date) => {
        return date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // Focus search with ⌘K or Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Brand and logo configurations for different personas
    const getBrandConfig = () => {
        switch (activePersonaId) {
            case 'writer':
                return {
                    name: 'nokib.write',
                    icon: 'edit_note',
                    font: 'font-editorial font-black italic tracking-tight',
                    accent: 'text-black bg-[#C6F135] px-1.5 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000]'
                };
            case 'friend':
                return {
                    name: 'nokib.friend',
                    icon: 'favorite',
                    font: 'font-mono font-black tracking-tight',
                    accent: 'text-black bg-[#FFE600] p-1 border-2 border-black shadow-[2px_2px_0px_#000] text-sm'
                };
            case 'philosopher':
                return {
                    name: 'nokib.think',
                    icon: 'psychology',
                    font: 'font-cinzel tracking-[0.15em] font-semibold',
                    accent: 'text-[#EDE8DF] bg-[#1A1B22] px-2.5 py-0.5 rounded-full border border-[#C89B6A]/40 text-xs font-cinzel shadow-[0_0_15px_rgba(200,155,106,0.15)]'
                };
            default:
                return {
                    name: 'nokib.dev',
                    icon: 'north_east',
                    font: 'font-display font-black tracking-tight',
                    accent: 'text-primary-500'
                };
        }
    };
    const getPersonaHomeLink = () => {
        switch (activePersonaId) {
            case 'friend': return '/friend';
            case 'writer': return '/writer';
            case 'philosopher': return '/philosopher';
            case 'developer': return '/developer';
            default: return '/';
        }
    };

    const brand = getBrandConfig();
    const personaHome = getPersonaHomeLink();

    const isFriendPersona = activePersonaId === 'friend';
    const isWriterPersona = activePersonaId === 'writer';
    const isPhilosopherPersona = activePersonaId === 'philosopher';
    const isLightMode = (light || isFriendPersona || isWriterPersona) && !isDarkMode && !isPhilosopherPersona;

    // Renders the specific persona links
    const renderPersonaLinks = () => {
        if (activePersonaId === 'writer') {
            const linkClass = isDarkMode
                ? "text-neutral-200 hover:text-black hover:bg-[#C6F135] border-2 border-transparent hover:border-black hover:shadow-[2px_2px_0px_#C6F135]"
                : "text-black hover:text-black hover:bg-[#C6F135] border-2 border-transparent hover:border-black hover:shadow-[2px_2px_0px_#000]";
            return (
                <nav className="hidden lg:flex items-center space-x-2 font-mono">
                    <a className={`px-2.5 py-1 text-xs uppercase font-bold tracking-wider transition-all ${linkClass}`} href="#hero">
                        Manifesto
                    </a>
                    <a className={`px-2.5 py-1 text-xs uppercase font-bold tracking-wider transition-all ${linkClass}`} href="#scraps">
                        Pinned Scraps
                    </a>
                    <a className={`px-2.5 py-1 text-xs uppercase font-bold tracking-wider transition-all ${linkClass}`} href="#skills">
                        Genres
                    </a>
                    <a className={`px-2.5 py-1 text-xs uppercase font-bold tracking-wider transition-all ${linkClass}`} href="#essays">
                        Selected Essays
                    </a>
                    <a className={`px-2.5 py-1 text-xs uppercase font-bold tracking-wider transition-all ${linkClass}`} href="#about">
                        About
                    </a>
                    <a className="px-3.5 py-1 text-xs uppercase font-bold tracking-wider bg-[#C6F135] text-black border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-[#A3E635] transition-all ml-1" href="#contact">
                        Send Letter
                    </a>
                </nav>
            );
        }

        if (activePersonaId === 'friend') {
            const linkTextClass = isDarkMode ? "text-white hover:text-black" : "text-black";
            const linkBorderClass = isDarkMode ? "hover:border-neutral-400" : "hover:border-black";
            return (
                <nav className="hidden md:flex items-center space-x-2 font-mono">
                    <a className={`px-3 py-1.5 text-xs font-black uppercase ${linkTextClass} hover:bg-[#FFE600] border-2 border-transparent ${linkBorderClass} hover:shadow-[2px_2px_0px_#000] transition-all`} href="#greeting">
                        Voice Deck
                    </a>
                    <a className={`px-3 py-1.5 text-xs font-black uppercase ${linkTextClass} hover:bg-[#FF00FF] hover:text-white border-2 border-transparent ${linkBorderClass} hover:shadow-[2px_2px_0px_#000] transition-all`} href="#audio-rack">
                        Podcasts
                    </a>
                    <a className={`px-3 py-1.5 text-xs font-black uppercase ${linkTextClass} hover:bg-[#00C2CB] hover:text-black border-2 border-transparent ${linkBorderClass} hover:shadow-[2px_2px_0px_#000] transition-all`} href="#vibe-check">
                        Vibe Check
                    </a>
                    <a className={`px-3 py-1.5 text-xs font-black uppercase ${linkTextClass} hover:bg-[#2ED573] hover:text-black border-2 border-transparent ${linkBorderClass} hover:shadow-[2px_2px_0px_#000] transition-all`} href="#chapters">
                        Chapters
                    </a>
                    <a className={`px-3 py-1.5 text-xs font-black uppercase ${linkTextClass} hover:bg-[#FAF6EE] hover:text-black border-2 border-transparent ${linkBorderClass} hover:shadow-[2px_2px_0px_#000] transition-all`} href="#gallery">
                        Polaroids
                    </a>
                    <a className="px-3.5 py-1.5 text-xs font-black uppercase bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all" href="#contact-box">
                        Say Hi
                    </a>
                </nav>
            );
        }

        if (activePersonaId === 'philosopher') {
            const linkClass = "text-[#A39788] hover:text-[#EDE8DF] hover:bg-[#C89B6A]/10 px-3.5 py-1.5 rounded-full text-xs font-cinzel tracking-[0.15em] transition-all duration-300";
            return (
                <nav className="hidden lg:flex items-center space-x-1 font-cinzel">
                    <a className={linkClass} href="#intro">
                        Prologue
                    </a>
                    <a className={linkClass} href="#inquiry">
                        Inquiry
                    </a>
                    <a className={linkClass} href="#treatises">
                        Treatises
                    </a>
                    <a className={linkClass} href="#paradoxes">
                        Paradoxes
                    </a>
                    <a className={linkClass} href="#writings">
                        Discourses
                    </a>
                    <a className="px-4 py-1.5 rounded-full text-xs font-cinzel tracking-[0.15em] bg-[#C89B6A]/20 text-[#EDE8DF] border border-[#C89B6A]/40 hover:bg-[#C89B6A] hover:text-[#0E0F12] transition-all ml-1 shadow-[0_0_15px_rgba(200,155,106,0.2)] font-semibold" href="#discourse">
                        Symposium
                    </a>
                </nav>
            );
        }

        // Developer Link Set
        return (
            <nav className="hidden md:flex items-center space-x-1 font-sans">
                <a className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    activeSection === 'hero' && !isBlogPage
                        ? isLightMode
                            ? "text-primary-750 bg-primary-100/90 shadow-sm"
                            : "text-primary-300 bg-primary-950/65 border border-primary-800/20"
                        : isLightMode
                            ? "text-stone-600 hover:text-stone-900 hover:bg-stone-150/70"
                            : "text-slate-350 hover:text-white hover:bg-slate-800/40"
                }`} href={isBlogPage ? "/developer/#hero" : "#hero"}>
                    Home
                </a>
                <Link className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    isBlogPage
                        ? isLightMode
                            ? "text-primary-750 bg-primary-100/90 shadow-sm"
                            : "text-primary-300 bg-primary-950/65 border border-primary-800/20"
                        : isLightMode
                            ? "text-stone-600 hover:text-stone-900 hover:bg-stone-150/70"
                            : "text-slate-350 hover:text-white hover:bg-slate-800/40"
                }`} to="/developer/blog">
                    Blog
                </Link>
                <motion.a
                    whileHover={{ y: -2 }}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1.5 ${
                        isLightMode
                            ? "text-stone-600 hover:text-stone-900 hover:bg-stone-150/70"
                            : "text-slate-350 hover:text-white hover:bg-slate-800/40"
                    }`}
                    href="https://www.linkedin.com/in/nazmulhasan-nokib/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span>LinkedIn</span>
                    <span className="material-icons-outlined text-[13px] opacity-75">open_in_new</span>
                </motion.a>
                <motion.a
                    whileHover={{ y: -2 }}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1.5 ${
                        isLightMode
                            ? "text-stone-600 hover:text-stone-900 hover:bg-stone-150/70"
                            : "text-slate-350 hover:text-white hover:bg-slate-800/40"
                    }`}
                    href="https://drive.google.com/uc?export=download&id=1DzzReSIxO0LUPYU5si0p-7c4Hy4ypEOY"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span>Resume</span>
                    <span className="material-icons-outlined text-[14px] opacity-75">download</span>
                </motion.a>
            </nav>
        );
    };
    // Responsive styling classes depending on theme (high-contrast, borderless or neo-brutal)
    const headerClass = isFriendPersona
        ? (isDarkMode 
            ? "bg-[#18181B] text-white border-b-3 border-black shadow-[0_4px_0px_#000000]"
            : "bg-[#FAF6EE] text-black border-b-3 border-black shadow-[0_4px_0px_#000000]")
        : isWriterPersona
            ? (isDarkMode
                ? "bg-[#15161A]/95 text-white border-b-3 border-black dark:border-neutral-700 shadow-[0_3px_0px_#000]"
                : "bg-[#FAF8F5]/95 text-black border-b-3 border-black shadow-[0_3px_0px_#000]")
            : isLightMode
                ? "bg-[#FDF6F0]/95 text-stone-850 supports-[backdrop-filter]:bg-[#FDF6F0]/90 shadow-sm"
                : "bg-[#0B0F19]/95 text-slate-200 supports-[backdrop-filter]:bg-[#0B0F19]/90 shadow-md";

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform backdrop-blur-md ${headerClass} ${
            isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
            <div className={`w-full ${isFriendPersona || isWriterPersona ? 'max-w-[1920px] px-4 sm:px-6 md:px-10 lg:px-16' : 'w-11/12 max-w-[1800px] px-4 md:px-6'} mx-auto h-20 flex items-center justify-between`}>
                
                {/* Brand Logo & Nav */}
                <div className="flex items-center space-x-6 lg:space-x-8">
                    <Link
                        to={personaHome}
                        onClick={() => {
                            if (location.pathname === personaHome) {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                        }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`flex items-center space-x-2.5 text-xl font-black ${brand.font}`}
                        >
                            <span className={`material-icons-outlined ${brand.accent}`}>{brand.icon}</span>
                            <span className={isFriendPersona || isWriterPersona ? (isDarkMode ? "text-white" : "text-black") : isLightMode ? "text-stone-800" : "text-white"}>{brand.name}</span>
                        </motion.div>
                    </Link>
 
                    {/* Navigation links */}
                    {renderPersonaLinks()}
                </div>
 
                {/* Right Side Widgets (Search, Clock, Mode, Persona Switch) */}
                <div className="flex items-center space-x-3.5">
                    
                    {/* Search Bar */}
                    <div className="relative hidden lg:block group">
                        <input
                            ref={searchInputRef}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setShowResults(true)}
                            onBlur={() => setTimeout(() => setShowResults(false), 200)}
                            className={`rounded-full py-2 pl-4 pr-12 text-sm transition-all w-40 md:w-56 focus:outline-none
                                ${isFriendPersona || isWriterPersona
                                    ? 'bg-white dark:bg-neutral-900 border-2 border-black text-black dark:text-white placeholder:text-neutral-500 font-mono shadow-[2px_2px_0px_#000] focus:bg-white focus:border-black rounded-none'
                                    : isLightMode
                                        ? 'bg-stone-200/60 focus:bg-white focus:ring-amber-500/25 text-stone-900 placeholder:text-stone-400 border-0'
                                        : 'bg-slate-900/60 focus:bg-slate-900/90 focus:ring-primary-500/25 text-slate-100 placeholder:text-slate-500 border-0'
                                }`}
                            placeholder="Search..."
                            type="text"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                            <kbd className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono rounded-md border-0
                                ${isFriendPersona || isWriterPersona
                                    ? 'text-black bg-[#FFE600] border border-black font-black'
                                    : isLightMode
                                        ? 'text-stone-550 bg-stone-250/50'
                                        : 'text-slate-450 bg-slate-800/60'
                                }`}>⌘K</kbd>
                        </div>
 
                        {/* Search Results Dropdown */}
                        {showResults && searchResults.length > 0 && (
                            <div className={`absolute top-full right-0 mt-3.5 w-80 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl border-0
                                ${isFriendPersona || isWriterPersona
                                    ? 'bg-white dark:bg-neutral-900 text-black dark:text-white border-3 border-black shadow-[6px_6px_0px_#000] rounded-none'
                                    : isLightMode
                                        ? 'bg-white text-stone-850 shadow-stone-200/40'
                                        : 'bg-slate-950/95 text-slate-100 shadow-black/80'
                                }`}>
                                {searchResults.slice(0, 6).map((result, index) => (
                                    <a
                                        key={index}
                                        href={result.type === 'Command' ? '#' : result.link}
                                        onClick={(e) => {
                                            if (result.type === 'Command') e.preventDefault();
                                            handleResultClick(result);
                                        }}
                                        className={`flex items-center space-x-3.5 px-5 py-4 transition-colors border-b last:border-0
                                            ${isFriendPersona || isWriterPersona
                                                ? 'hover:bg-[#FFE600] hover:text-black border-black font-mono'
                                                : isLightMode
                                                    ? 'hover:bg-stone-50 border-stone-100'
                                                    : 'hover:bg-slate-900 border-slate-900/60'
                                            }`}
                                    >
                                        <span className={`p-2 rounded-xl flex items-center justify-center
                                            ${isFriendPersona || isWriterPersona
                                                ? 'bg-black text-white rounded-none border border-black'
                                                : isLightMode
                                                    ? 'bg-stone-100 text-stone-500'
                                                    : 'bg-slate-900 text-slate-400'
                                            }`}>
                                            <span className="material-icons-outlined text-sm">{result.icon}</span>
                                        </span>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold leading-tight">{result.title}</h4>
                                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 mt-0.5 block">{result.type}</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
 
                    {/* Live Clock Widget */}
                    <div className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium
                        ${isWriterPersona
                            ? 'bg-[#C6F135] text-black font-mono font-black border-2 border-black shadow-[2px_2px_0px_#000] rounded-none'
                            : isFriendPersona
                                ? 'bg-[#FFE600] text-black font-mono font-black border-2 border-black shadow-[2px_2px_0px_#000] rounded-none'
                                : isLightMode
                                    ? 'text-stone-600 border-0 bg-transparent'
                                    : 'text-slate-400 border-0 bg-transparent'
                        }`}>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                        <span>{formatTime(currentTime)}</span>
                    </div>
 
                    {/* Dark/Light Mode Toggle */}
                    <motion.button
                        whileHover={{ scale: 1.05, rotate: 15 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleDarkMode}
                        className={`p-2 rounded-full transition-colors cursor-pointer
                            ${isWriterPersona
                                ? (isDarkMode
                                    ? 'bg-[#C6F135] text-black border-2 border-black shadow-[2px_2px_0px_#000] rounded-none'
                                    : 'bg-white hover:bg-[#C6F135] text-black border-2 border-black shadow-[2px_2px_0px_#000] rounded-none')
                                : isFriendPersona
                                    ? (isDarkMode 
                                        ? 'bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#000] rounded-none' 
                                        : 'bg-white hover:bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#000] rounded-none')
                                    : isLightMode
                                        ? 'hover:bg-stone-150/40 text-stone-600 hover:text-stone-900 border-0 bg-transparent'
                                        : 'hover:bg-slate-800/35 text-slate-400 hover:text-white border-0 bg-transparent'
                            }`}
                        aria-label="Toggle dark mode"
                        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        <span className="material-icons-outlined text-base flex items-center justify-center">
                            {isDarkMode ? 'light_mode' : 'dark_mode'}
                        </span>
                    </motion.button>
 
                    {/* GitHub Link */}
                    <motion.a
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 rounded-full transition-colors flex items-center justify-center
                            ${isWriterPersona
                                ? 'bg-white hover:bg-[#C6F135] text-black border-2 border-black shadow-[2px_2px_0px_#000] rounded-none'
                                : isFriendPersona
                                    ? 'bg-white hover:bg-[#00C2CB] text-black border-2 border-black shadow-[2px_2px_0px_#000] rounded-none'
                                    : isLightMode
                                        ? 'hover:bg-stone-150/40 text-stone-600 hover:text-stone-900 border-0 bg-transparent'
                                        : 'hover:bg-slate-800/35 text-slate-400 hover:text-white border-0 bg-transparent'
                            }`}
                        href="https://github.com/nokib-web"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="GitHub Profile"
                    >
                        <FaGithub className="text-base" />
                    </motion.a>
 
                    {/* Persona Switcher Pill */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className={`flex items-center space-x-1.5 px-3.5 py-2 text-[11px] font-sans font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer
                            ${isFriendPersona
                                ? 'bg-[#FF00FF] hover:bg-[#ff24ff] text-white border-2 border-black font-mono font-black shadow-[2px_2px_0px_#000] rounded-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                                : isWriterPersona
                                    ? 'bg-black text-[#C6F135] hover:bg-[#A3E635] hover:text-black border-2 border-black font-mono font-black shadow-[2px_2px_0px_#000] rounded-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                                    : isLightMode
                                        ? 'bg-stone-200/60 hover:bg-stone-200 text-stone-700 hover:text-black rounded-full border-0'
                                        : 'bg-slate-900/60 hover:bg-slate-800/60 text-slate-350 hover:text-white rounded-full border-0'
                            }`}
                    >
                        <span className="material-icons-outlined text-sm">grid_view</span>
                        <span className="hidden sm:inline">Switch</span>
                    </button>
 
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`lg:hidden p-2 rounded-full border-0 cursor-pointer
                            ${isFriendPersona || isWriterPersona
                                ? 'bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#000] rounded-none'
                                : isLightMode
                                    ? 'bg-stone-200/60 hover:bg-stone-250 text-stone-600'
                                    : 'bg-slate-900/60 hover:bg-slate-800/60 text-slate-450'
                            }`}
                        aria-label="Toggle menu"
                    >
                        <span className="material-icons-outlined text-base flex items-center justify-center">
                            {isMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
 
                </div>
            </div>
 
            {/* Mobile Navigation Drawer */}
            <MobileMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                activeSection={activeSection}
                activePersonaId={activePersonaId}
                onSwitchPersonaClick={() => {
                    setIsMenuOpen(false);
                    setIsModalOpen(true);
                }}
            />
 
            {/* Persona Switcher Selector Modal */}
            <PersonaSelectorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </header>
    );
};

export default Header;