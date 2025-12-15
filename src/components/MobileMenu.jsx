import React from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const MobileMenu = ({ isOpen, onClose, activeSection }) => {
    const navItems = [
        { name: "Introduction", path: "#hero", id: "hero", icon: "home" },
        { name: "About Me", path: "#about", id: "about", icon: "person" },
        { name: "Projects", path: "#projects", id: "projects", icon: "code" },
        { name: "Skills & Tools", path: "#skills", id: "skills", icon: "handyman" },
        { name: "Experience", path: "#experience", id: "experience", icon: "work" },
        { name: "Education", path: "#education", id: "education", icon: "school" },
        { name: "Contact", path: "#contact", id: "contact", icon: "mail" },
        { name: "Stats", path: "#stats", id: "stats", icon: "insights" },
    ];

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] md:hidden font-body bg-slate-900/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute inset-0 bg-white dark:bg-slate-900 flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center space-x-2 text-lg font-bold font-display text-slate-900 dark:text-white">
                                <span className="material-icons-outlined text-primary-500">north_east</span>
                                <span>nokib.dev</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <span className="material-icons-outlined text-2xl">close</span>
                            </button>
                        </div>

                        {/* Menu Items */}
                        <div className="flex-1 overflow-y-auto py-8 px-6 space-y-2">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.path}
                                    onClick={onClose}
                                    className={`flex items-center px-6 py-4 text-lg font-medium rounded-2xl transition-all duration-300 ${activeSection === item.id
                                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                                        }`}
                                >
                                    <span className="material-icons-outlined mr-4 opacity-70">{item.icon}</span>
                                    {item.name}
                                </a>
                            ))}
                        </div>

                        {/* Footer Links */}
                        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="flex justify-center space-x-6">
                                <a
                                    href="https://drive.google.com/uc?export=download&id=1DzzReSIxO0LUPYU5si0p-7c4Hy4ypEOY"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center space-y-1 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                    <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                                        <span className="material-icons-outlined">download</span>
                                    </div>
                                    <span className="text-xs font-medium">Resume</span>
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/nazmulhasan-nokib/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center space-y-1 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                    <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                                        <span className="material-icons-outlined">work</span>
                                    </div>
                                    <span className="text-xs font-medium">LinkedIn</span>
                                </a>
                                <a
                                    href="https://github.com/nokib-web"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center space-y-1 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                    <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                                        <span className="material-icons-outlined">code</span>
                                    </div>
                                    <span className="text-xs font-medium">Github</span>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default MobileMenu;
