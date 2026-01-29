import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ activeSection }) => {
    const navItems = [
        { name: "Introduction", path: "#hero", id: "hero", icon: "home" },
        { name: "About Me", path: "#about", id: "about", icon: "person" },
        { name: "Skills & Tools", path: "#skills", id: "skills", icon: "handyman" },
        { name: "Experience", path: "#experience", id: "experience", icon: "work" },
        { name: "Projects", path: "#projects", id: "projects", icon: "code" },
        { name: "Education", path: "#education", id: "education", icon: "school" },
        { name: "Contact", path: "#contact", id: "contact", icon: "mail" },
        { name: "Stats", path: "#stats", id: "stats", icon: "insights" },
    ];

    return (
        <aside className="hidden md:flex md:flex-col w-64 flex-shrink-0 pl-6 pr-4 py-6">
            <div className="sticky top-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-glass border border-white/20 dark:border-slate-800/50 rounded-2xl shadow-glass p-6">
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.path}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group relative overflow-hidden ${activeSection === item.id
                                ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                                : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-primary-600 dark:hover:text-primary-400"
                                }`}
                        >
                            <span className={`material-icons-outlined text-xl mr-3 ${activeSection === item.id ? "text-white" : "text-slate-400 group-hover:text-primary-500"}`}>{item.icon}</span>
                            <span className="relative z-10">{item.name}</span>
                        </a>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
