import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaGithub } from "react-icons/fa";
import { motion } from 'framer-motion';
import MobileMenu from './MobileMenu';
import PersonaSelectorModal from './PersonaSelectorModal';
import { projects, skills } from '../data/portfolioData';
import { posts } from '../lib/posts';

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

        // Search Projects
        projects.forEach(project => {
            if (
                project.title.toLowerCase().includes(query) ||
                project.description.toLowerCase().includes(query) ||
                project.tech.some(t => t.toLowerCase().includes(query))
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

        // Search Blog Posts
        posts.forEach(post => {
            if (
                post.title.toLowerCase().includes(query) ||
                post.tags?.some(tag => tag.toLowerCase().includes(query))
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
                    icon: 'history_edu',
                    font: 'font-serif tracking-wide',
                    accent: 'text-amber-700'
                };
            case 'friend':
                return {
                    name: 'nokib.friend',
                    icon: 'favorite_border',
                    font: 'font-sans font-bold tracking-tight',
                    accent: 'text-rose-500'
                };
            case 'philosopher':
                return {
                    name: 'nokib.think',
                    icon: 'psychology',
                    font: 'font-serif tracking-widest uppercase italic',
                    accent: 'text-purple-400'
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

    const brand = getBrandConfig();

    const isLightMode = light && !isDarkMode;

    // Renders the specific persona links
    const renderPersonaLinks = () => {
        if (activePersonaId === 'writer') {
            return (
                <nav className="hidden md:flex items-center space-x-1 font-serif">
                    <a className="px-4 py-2 rounded-full text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-400 hover:bg-stone-100 dark:hover:bg-stone-900 transition-all" href="#essays">
                        Selected Writing
                    </a>
                    <a className="px-4 py-2 rounded-full text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-400 hover:bg-stone-100 dark:hover:bg-stone-900 transition-all" href="#about">
                        About the Writer
                    </a>
                    <a className="px-4 py-2 rounded-full text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-400 hover:bg-stone-100 dark:hover:bg-stone-900 transition-all" href="#contact">
                        Send a Letter
                    </a>
                </nav>
            );
        }

        if (activePersonaId === 'friend') {
            return (
                <nav className="hidden md:flex items-center space-x-1">
                    <a className="px-4 py-2 rounded-full text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-rose-500 hover:bg-stone-100 dark:hover:bg-stone-900 transition-all" href="#greeting">
                        Voice Note
                    </a>
                    <a className="px-4 py-2 rounded-full text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-rose-500 hover:bg-stone-100 dark:hover:bg-stone-900 transition-all" href="#moments">
                        Moments
                    </a>
                    <a className="px-4 py-2 rounded-full text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-rose-500 hover:bg-stone-100 dark:hover:bg-stone-900 transition-all" href="#gallery">
                        Life in Pixels
                    </a>
                </nav>
            );
        }

        if (activePersonaId === 'philosopher') {
            return (
                <nav className="hidden md:flex items-center space-x-1 font-serif">
                    <a className="px-4 py-2 rounded-full text-sm font-medium text-neutral-400 hover:text-purple-400 hover:bg-neutral-900 transition-all" href="#treatise">
                        Treatise
                    </a>
                    <a className="px-4 py-2 rounded-full text-sm font-medium text-neutral-400 hover:text-purple-400 hover:bg-neutral-900 transition-all" href="#expertise">
                        Expertise
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
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1 ${
                        isLightMode
                            ? "text-stone-600 hover:text-stone-900 hover:bg-stone-150/70"
                            : "text-slate-350 hover:text-white hover:bg-slate-800/40"
                    }`}
                    href="https://www.linkedin.com/in/nazmulhasan-nokib/" target="_blank" rel="noopener noreferrer">
                    <span>LinkedIn</span>
                    <span className="text-[10px] font-mono leading-none">↗</span>
                </motion.a>
                <motion.a
                    whileHover={{ y: -2 }}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1 ${
                        isLightMode
                            ? "text-stone-600 hover:text-stone-900 hover:bg-stone-150/70"
                            : "text-slate-350 hover:text-white hover:bg-slate-800/40"
                    }`}
                    href="https://drive.google.com/uc?export=download&id=1DzzReSIxO0LUPYU5si0p-7c4Hy4ypEOY"
                    target="_blank" rel="noopener noreferrer">
                    <span>Resume</span>
                    <span className="text-[10px] font-mono leading-none">⭳</span>
                </motion.a>
            </nav>
        );
    };

    // Responsive styling classes depending on theme (high-contrast, borderless)
    const headerClass = isLightMode
        ? "bg-[#FDF6F0]/95 text-stone-850 supports-[backdrop-filter]:bg-[#FDF6F0]/90 shadow-sm"
        : "bg-[#0B0F19]/95 text-slate-200 supports-[backdrop-filter]:bg-[#0B0F19]/90 shadow-md";

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform backdrop-blur-md ${headerClass} ${
            isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
            <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                
                {/* Brand Logo & Nav */}
                <div className="flex items-center space-x-10">
                    <Link to="/">
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`flex items-center space-x-2.5 text-xl font-black ${brand.font}`}
                        >
                            <span className={`material-icons-outlined ${brand.accent}`}>{brand.icon}</span>
                            <span className={isLightMode ? "text-stone-800" : "text-white"}>{brand.name}</span>
                        </motion.div>
                    </Link>
 
                    {/* Navigation links */}
                    {renderPersonaLinks()}
                </div>
 
                {/* Right Side Widgets (Search, Clock, Mode, Persona Switch) */}
                <div className="flex items-center space-x-4">
                    
                    {/* Search Bar */}
                    <div className="relative hidden lg:block group">
                        <input
                            ref={searchInputRef}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setShowResults(true)}
                            onBlur={() => setTimeout(() => setShowResults(false), 200)}
                            className={`rounded-full py-2 pl-4 pr-12 text-sm focus:ring-2 transition-all w-40 md:w-56 focus:outline-none border-0
                                ${isLightMode
                                    ? 'bg-stone-200/60 focus:bg-white focus:ring-amber-500/25 text-stone-900 placeholder:text-stone-400'
                                    : 'bg-slate-900/60 focus:bg-slate-900/90 focus:ring-primary-500/25 text-slate-100 placeholder:text-slate-500'
                                }`}
                            placeholder="Search..."
                            type="text"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                            <kbd className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono rounded-md border-0
                                ${isLightMode
                                    ? 'text-stone-550 bg-stone-250/50'
                                    : 'text-slate-450 bg-slate-800/60'
                                }`}>⌘K</kbd>
                        </div>
 
                        {/* Search Results Dropdown */}
                        {showResults && searchResults.length > 0 && (
                            <div className={`absolute top-full right-0 mt-3.5 w-80 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl border-0
                                ${isLightMode
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
                                            ${isLightMode
                                                ? 'hover:bg-stone-50 border-stone-100'
                                                : 'hover:bg-slate-900 border-slate-900/60'
                                            }`}
                                    >
                                        <span className={`p-2 rounded-xl flex items-center justify-center
                                            ${isLightMode
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
                    <div className={`hidden sm:flex items-center space-x-2.5 px-2 py-1.5 rounded-full text-xs font-mono font-medium border-0 bg-transparent
                        ${isLightMode ? 'text-stone-600' : 'text-slate-400'}`}>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                        <span>{formatTime(currentTime)}</span>
                    </div>
 
                    {/* Dark/Light Mode Toggle */}
                    <motion.button
                        whileHover={{ scale: 1.05, rotate: 15 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleDarkMode}
                        className={`p-2 rounded-full transition-colors border-0 bg-transparent
                            ${isLightMode
                                ? 'hover:bg-stone-150/40 text-stone-600 hover:text-stone-900'
                                : 'hover:bg-slate-800/35 text-slate-400 hover:text-white'
                            }`}
                        aria-label="Toggle dark mode"
                    >
                        <span className="material-icons-outlined text-base flex items-center justify-center">
                            {isDarkMode ? 'dark_mode' : 'light_mode'}
                        </span>
                    </motion.button>
 
                    {/* GitHub Link */}
                    <motion.a
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 rounded-full transition-colors flex items-center justify-center border-0 bg-transparent
                            ${isLightMode
                                ? 'hover:bg-stone-150/40 text-stone-600 hover:text-stone-900'
                                : 'hover:bg-slate-800/35 text-slate-400 hover:text-white'
                            }`}
                        href="https://github.com/nokib-web"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaGithub className="text-base" />
                    </motion.a>
 
                    {/* Persona Switcher Pill */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-[11px] font-sans font-bold uppercase tracking-widest transition-all duration-300 border-0
                            ${isLightMode
                                ? 'bg-stone-200/60 hover:bg-stone-200 text-stone-700 hover:text-black'
                                : 'bg-slate-900/60 hover:bg-slate-800/60 text-slate-350 hover:text-white'
                            }`}
                    >
                        <span className="material-icons-outlined text-sm">grid_view</span>
                        <span className="hidden sm:inline">Switch</span>
                    </button>
 
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`lg:hidden p-2 rounded-full border-0
                            ${isLightMode
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