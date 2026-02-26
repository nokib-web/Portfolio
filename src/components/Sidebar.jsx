import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ activeSection, isOpen, setIsOpen }) => {
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
            className={`fixed left-4 top-24 bottom-4 z-40 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hidden lg:flex flex-col bg-white/80 dark:bg-[#0A0F1E]/80 backdrop-blur-2xl border border-slate-200 dark:border-white/5 rounded-none shadow-2xl overflow-hidden ${isOpen ? 'w-64' : 'w-20'
                }`}
        >
            {/* Toggle Button */}
            <div className="flex justify-center p-4">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-3 rounded-none hover:bg-primary-500/10 dark:hover:bg-primary-500/20 text-slate-400 hover:text-primary-500 transition-all group"
                >
                    <span className="material-icons-outlined text-2xl group-hover:rotate-180 transition-transform duration-500">
                        {isOpen ? 'menu_open' : 'menu'}
                    </span>
                </button>
            </div>

            {/* Nav Items */}
            <div className="flex-1 px-3 space-y-2 overflow-y-auto scrollbar-hide">
                {navItems.map((item) => {
                    const isActive = item.id === 'blog' ? isBlogPage : (activeSection === item.id && !isBlogPage);
                    const isRoute = item.path.startsWith('/');

                    const Content = (
                        <>
                            <span className={`material-icons-outlined transition-colors w-10 text-center text-xl ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                                {item.icon}
                            </span>
                            <span className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-500 ${isActive ? 'text-white' : 'text-slate-600 dark:text-slate-400 group-hover:text-white'} ${isOpen ? 'opacity-100 translate-x-3' : 'opacity-0 -translate-x-10'}`}>
                                {item.name}
                            </span>
                        </>
                    );

                    const classes = `group flex items-center h-12 rounded-none transition-all px-3 ${isActive ? 'bg-primary-500 shadow-lg shadow-primary-500/30' : 'hover:bg-primary-500'}`;

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

            {/* Bottom Decoration */}
            <div className="p-6">
                <div className={`h-1 w-full rounded-none bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
            </div>
        </aside>
    );
};

export default Sidebar;

