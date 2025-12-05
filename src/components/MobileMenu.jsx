import React from 'react';
import { NavLink } from 'react-router-dom';

const MobileMenu = ({ isOpen, onClose }) => {
    const navItems = [
        { name: "Introduction", path: "/" },
        { name: "About Me", path: "/about" },
        { name: "Projects", path: "/projects" },
        { name: "Skills & Tools", path: "/skills" },
        { name: "Experience", path: "/experience" },
        { name: "Education", path: "/education" },
        { name: "Contact", path: "/contact" },
        { name: "Stats", path: "/stats" },
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Menu Content */}
            <div className="absolute right-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                    >
                        <span className="material-icons-outlined text-2xl">close</span>
                    </button>
                </div>

                <nav className="flex flex-col space-y-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}

                    <div className="h-px bg-gray-200 dark:bg-gray-800 my-4"></div>

                    <a
                        className="px-4 py-2 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium"
                        href="https://drive.google.com/file/d/1DzzReSIxO0LUPYU5si0p-7c4Hy4ypEOY/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span>Resume</span>
                        <span className="material-icons-outlined text-sm">open_in_new</span>
                    </a>
                    <a
                        className="px-4 py-2 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium"
                        href="https://www.linkedin.com/in/nazmulhasan-nokib/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span>LinkedIn</span>
                        <span className="material-icons-outlined text-sm">open_in_new</span>
                    </a>
                    <a
                        className="px-4 py-2 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium"
                        href="https://github.com/nokib-web"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span>Github</span>
                        <span className="material-icons-outlined text-sm">open_in_new</span>
                    </a>
                </nav>
            </div>
        </div>
    );
};

export default MobileMenu;
