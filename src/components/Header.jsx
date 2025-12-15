import React, { useState, useEffect, useRef } from 'react';
import { FaGithub } from "react-icons/fa";
import { motion } from 'framer-motion';
import MobileMenu from './MobileMenu';
import { projects, skills } from '../data/portfolioData';

const Header = ({ activeSection }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return savedTheme === 'dark' || (!savedTheme && prefersDark);
    });

    const [currentTime, setCurrentTime] = useState(new Date());
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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

        // Search Sections (including "Stats" which is section #stats)
        ['Home', 'About', 'Experience', 'Education', 'Projects', 'Skills', 'Contact', 'Stats'].forEach(section => {
            if (section.toLowerCase().includes(query)) {
                // Skills is #skills (plural), others are singular usually or logic handled by section ID
                // In Layout.jsx/Home.jsx: ids are: hero, about, skills, experience, projects, education, contact, stats
                let link = `#${section.toLowerCase()}`;
                if (section === 'Home') link = '#hero';
                if (section === 'Skills') link = '#skills';
                if (section === 'Projects') link = '#projects';

                results.push({ type: 'Section', title: section, link: link, icon: 'article' });
            }
        });

        setSearchResults(results);
        setShowResults(true);
    }, [searchQuery]);

    const handleResultClick = () => {
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

    return (
        <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-white/70 dark:bg-slate-900/70 backdrop-blur-glass border-b border-slate-200/50 dark:border-slate-800/50 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo & Nav */}
                <div className="flex items-center space-x-8">
                    <a href="#hero">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center space-x-2 text-xl font-bold font-display text-slate-900 dark:text-white"
                        >
                            <span className="material-icons-outlined text-primary-500">north_east</span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">nokib.dev</span>
                        </motion.div>
                    </a>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-1">
                        <a className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeSection === 'hero'
                            ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                            : "text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`} href="#hero">
                            Home
                        </a>
                        <motion.a
                            whileHover={{ y: -2 }}
                            className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1"
                            href="https://www.linkedin.com/in/nazmulhasan-nokib/" target="_blank" rel="noopener noreferrer">
                            <span>LinkedIn</span>
                            <span className="material-icons-outlined text-[10px]">open_in_new</span>
                        </motion.a>
                        <motion.a
                            whileHover={{ y: -2 }}
                            className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1"
                            href="https://drive.google.com/uc?export=download&id=1DzzReSIxO0LUPYU5si0p-7c4Hy4ypEOY"
                            target="_blank" rel="noopener noreferrer">
                            <span>Resume</span>
                            <span className="material-icons-outlined text-[10px]">download</span>
                        </motion.a>
                    </nav>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center space-x-4">
                    {/* Search Bar */}
                    <div className="relative hidden sm:block group">
                        <input
                            ref={searchInputRef}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setShowResults(true)}
                            onBlur={() => setTimeout(() => setShowResults(false), 200)}
                            className="bg-slate-100 dark:bg-slate-800/50 border border-transparent focus:border-primary-500 rounded-full py-2 pl-4 pr-12 text-sm focus:ring-2 focus:ring-primary-500/20 focus:outline-none w-48 transition-all group-hover:bg-white dark:group-hover:bg-slate-800"
                            placeholder="Search..."
                            type="text"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <kbd className="inline-flex items-center px-2 py-0.5 text-xs font-mono text-slate-400 bg-slate-200 dark:bg-slate-700 rounded-md">⌘K</kbd>
                        </div>

                        {/* Search Results Dropdown */}
                        {showResults && searchResults.length > 0 && (
                            <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50">
                                {searchResults.slice(0, 6).map((result, index) => (
                                    <a
                                        key={index}
                                        href={result.link}
                                        onClick={handleResultClick}
                                        className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <span className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
                                            <span className="material-icons-outlined text-sm">{result.icon}</span>
                                        </span>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-slate-900 dark:text-white">{result.title}</h4>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">{result.type}</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Status + Controls */}
                    <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                        {/* Live Clock */}
                        <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700/50">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                            <span className="text-xs font-mono font-medium">{formatTime(currentTime)}</span>
                        </div>

                        {/* Dark Mode Toggle */}
                        <motion.button
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.3 }}
                            onClick={toggleDarkMode}
                            className="hover:text-primary dark:hover:text-primary transition-colors p-1"
                            aria-label="Toggle dark mode"
                        >
                            <span className="material-icons-outlined text-xl">
                                {isDarkMode ? 'dark_mode' : 'light_mode'}
                            </span>
                        </motion.button>
                        <motion.a
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative flex items-center space-x-1 hover:text-primary dark:hover:text-primary transition-colors group"
                            href="https://github.com/nokib-web" target="_blank" rel="noopener noreferrer">

                            <FaGithub />
                        </motion.a>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden hover:text-primary dark:hover:text-primary transition-colors"
                            aria-label="Toggle menu"
                        >
                            <span className="material-icons-outlined text-2xl">
                                {isMenuOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} activeSection={activeSection} />
        </header>
    );
};

export default Header;