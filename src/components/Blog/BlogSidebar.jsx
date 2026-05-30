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
            className={`fixed left-4 top-24 bottom-4 z-40 transition-all duration-550 ease-[cubic-bezier(0.23,1,0.32,1)] hidden lg:flex flex-col bg-[#020617]/80 dark:bg-[#0A0F1E]/80 backdrop-blur-2xl border border-slate-200/5 dark:border-white/5 rounded-[2rem] shadow-2xl overflow-hidden ${
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

                    const classes = `group flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 text-slate-400 hover:text-white hover:bg-slate-800/40 dark:hover:bg-white/5 ${
                        isOpen ? 'w-full h-12' : ''
                    }`;

                    return (
                        <Link key={item.name} to={item.link} className={classes}>
                            {Content}
                        </Link>
                    );
                })}
            </div>

            {/* Bottom Decoration */}
            <div className="p-6 shrink-0 w-full flex justify-center">
                <div className={`h-1 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-500 ${isOpen ? 'w-32' : 'w-8'}`} />
            </div>
        </aside>
    );
};

export default BlogSidebar;
