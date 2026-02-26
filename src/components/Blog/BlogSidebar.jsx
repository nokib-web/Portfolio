import React from 'react';
import { Link } from 'react-router-dom';

const BlogSidebar = ({ isOpen, setIsOpen }) => {
    const navItems = [
        { name: 'Introduction', icon: 'home', link: '/' },
        { name: 'About Me', icon: 'person', link: '/#about' },
        { name: 'Skills & Tools', icon: 'handyman', link: '/#skills' },
        { name: 'Experience', icon: 'work', link: '/#experience' },
        { name: 'Projects', icon: 'grid_view', link: '/#projects' },
        { name: 'Education', icon: 'school', link: '/#education' },
        { name: 'Contact', icon: 'mail', link: '/#contact' },
        { name: 'Stats', icon: 'insights', link: '/#stats' },
    ];

    return (
        <aside
            className={`fixed left-4 top-24 bottom-4 z-40 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hidden lg:flex flex-col bg-white/80 dark:bg-[#0A0F1E]/80 backdrop-blur-2xl rounded-none shadow-2xl overflow-hidden ${isOpen ? 'w-64' : 'w-20'
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
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.link}
                        className="group flex items-center h-12 rounded-none hover:bg-primary-500 transition-all px-3"
                    >
                        <span className="material-icons-outlined text-slate-400 group-hover:text-white transition-colors w-10 text-center text-xl">
                            {item.icon}
                        </span>
                        <span className={`text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 group-hover:text-white whitespace-nowrap transition-all duration-500 ${isOpen ? 'opacity-100 translate-x-3' : 'opacity-0 -translate-x-10'
                            }`}>
                            {item.name}
                        </span>
                    </Link>
                ))}
            </div>

            {/* Bottom Decoration */}
            <div className="p-6">
                <div className={`h-1 w-full rounded-none bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
            </div>
        </aside>
    );
};

export default BlogSidebar;
