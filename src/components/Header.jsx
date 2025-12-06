import React, { useState, useEffect, useRef } from 'react';
import { FaGithub } from "react-icons/fa";

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MobileMenu from './MobileMenu';

const Header = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return savedTheme === 'dark' || (!savedTheme && prefersDark);
    });

    const [currentTime, setCurrentTime] = useState(new Date());
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        <header className="border-b border-gray-200 dark:border-gray-800 w-full bg-white dark:bg-gray-900 sticky top-0 z-50">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo & Nav */}
                <div className="flex items-center space-x-6">
                    <Link to="/">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-white"
                        >
                            <span className="material-icons-outlined">north_east</span>
                            <span>nokib.dev</span>
                        </motion.div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600 dark:text-gray-300">
                        <Link className="relative hover:text-primary dark:hover:text-primary transition-colors group" to="/">
                            <motion.span whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>Home</motion.span>
                            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <motion.a
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative flex items-center space-x-1 hover:text-primary dark:hover:text-primary transition-colors group"
                            href="https://www.linkedin.com/in/nazmulhasan-nokib/" target="_blank" rel="noopener noreferrer">
                            <span>LinkedIn</span>
                            <span className="material-icons-outlined text-sm">open_in_new</span>
                            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </motion.a>
                        <motion.a
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative flex items-center space-x-1 hover:text-primary dark:hover:text-primary transition-colors group"
                            href="https://drive.google.com/file/d/1DzzReSIxO0LUPYU5si0p-7c4Hy4ypEOY/view?usp=sharing"
                            target="_blank" rel="noopener noreferrer">
                            <span>Resume</span>
                            <span className="material-icons-outlined text-sm">open_in_new</span>
                            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </motion.a>

                    </nav>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center space-x-4">
                    {/* Search Bar */}
                    <div className="relative hidden sm:block">
                        <input
                            ref={searchInputRef}
                            className="bg-gray-100 dark:bg-gray-800 border-none rounded-md py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-primary focus:outline-none w-48 transition-all"
                            placeholder="Search sections..."
                            type="text"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <kbd className="inline-flex items-center px-2 py-0.5 text-xs font-sans text-gray-500 bg-gray-200 dark:bg-gray-700 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded">⌘K</kbd>
                        </div>
                    </div>

                    {/* Status + Controls */}
                    <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                        {/* Live Clock */}
                        <div className="hidden md:flex items-center space-x-1.5">
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-mono tabular-nums">{formatTime(currentTime)}</span>
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
                            
                            {/* <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span> */}
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
            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </header>
    );
};

export default Header;