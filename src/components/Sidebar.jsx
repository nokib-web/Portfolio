import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PersonaSelectorModal from './PersonaSelectorModal';

const Sidebar = ({ activeSection, isOpen, setIsOpen }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();
    const isBlogPage = location.pathname.startsWith('/blog');

    const navItems = [
        { name: "Introduction", path: "#hero", id: "hero", icon: "home" },
        { name: "About Me", path: "#about", id: "about", icon: "person" },
        { name: "Skills & Tools", path: "#skills", id: "skills", icon: "handyman" },
        { name: "Experience", path: "#experience", id: "experience", icon: "work" },
        { name: "Projects", path: "#projects", id: "projects", icon: "grid_view" },
        { name: "Education", path: "#education", id: "education", icon: "school" },
        { name: "Contact", path: "#contact", id: "contact", icon: "mail" },
        { name: "Stats", path: "#stats", id: "stats", icon: "insights" },
    ];

    return (
        <aside
            className={`fixed left-4 top-24 bottom-4 z-40 transition-all duration-550 ease-[cubic-bezier(0.23,1,0.32,1)] hidden lg:flex flex-col bg-[#1a1f2e]/95 border border-slate-800/80 rounded-[2rem] shadow-2xl overflow-hidden ${
                isOpen ? 'w-64' : 'w-20'
            }`}
        >
            {/* Toggle Button */}
            <div className="flex justify-center py-6 shrink-0">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2.5 rounded-xl bg-slate-800/10 dark:bg-white/5 hover:bg-slate-800/50 dark:hover:bg-white/10 text-slate-400 hover:text-white transition-all group"
                >
                    <span className="material-icons-outlined text-xl group-hover:rotate-185 transition-transform duration-500">
                        {isOpen ? 'menu_open' : 'menu'}
                    </span>
                </button>
            </div>

            {/* Nav Items */}
            <div className="flex-1 px-4 space-y-3 overflow-y-auto scrollbar-hide flex flex-col items-center py-2 w-full">
                {navItems.map((item) => {
                    const isActive = item.id === 'blog' ? isBlogPage : (activeSection === item.id && !isBlogPage);
                    const isRoute = item.path.startsWith('/');

                    const Content = (
                        <div className={`flex items-center w-full ${isOpen ? 'justify-start px-2' : 'justify-center'}`}>
                            <span className="material-icons-outlined text-[22px]">
                                {item.icon}
                            </span>
                            {isOpen && (
                                <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap ml-4">
                                    {item.name}
                                </span>
                            )}
                        </div>
                    );

                    const classes = `group flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
                        isActive
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/35 border border-primary-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/40 dark:hover:bg-white/5'
                    } ${isOpen ? 'w-full h-12' : ''}`;

                    if (isRoute) {
                        return (
                            <Link key={item.name} to={item.path} className={classes}>
                                {Content}
                            </Link>
                        );
                    }

                    return (
                        <a
                            key={item.name}
                            href={isBlogPage ? `/${item.path}` : item.path}
                            className={classes}
                        >
                            {Content}
                        </a>
                    );
                })}
            </div>

            {/* Switch Persona Button */}
            <div className="px-4 py-3 border-t border-slate-200/5 dark:border-white/5 w-full flex justify-center shrink-0">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className={`group flex items-center justify-center h-12 rounded-2xl transition-all duration-300 w-12 text-slate-400 hover:text-white hover:bg-slate-800/40 dark:hover:bg-white/5 ${
                        isOpen ? 'w-full px-4 justify-start' : 'justify-center'
                    }`}
                    title="Switch Persona"
                >
                    <span className="material-icons-outlined text-[22px]">
                        switch_account
                    </span>
                    {isOpen && (
                        <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap ml-4">
                            Switch Persona
                        </span>
                    )}
                </button>
            </div>

            {/* Bottom Decoration */}
            <div className="p-6 shrink-0 w-full flex justify-center">
                <div className={`h-1 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-500 ${isOpen ? 'w-32' : 'w-8'}`} />
            </div>

            <PersonaSelectorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </aside>
    );
};

export default Sidebar;
