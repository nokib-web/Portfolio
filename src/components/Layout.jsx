import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'education', 'contact', 'stats'];
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                    // Update URL hash without jumping
                    window.history.replaceState(null, null, `#${entry.target.id}`);
                }
            });
        }, { threshold: [0, 0.2, 0.5], rootMargin: "-40% 0px -55% 0px" });

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [children]);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-body relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 via-transparent to-blue-100/40 dark:from-purple-900/20 dark:via-transparent dark:to-blue-900/20 pointer-events-none" />
            <Header activeSection={activeSection} />
            <div className="flex-1 w-full relative z-10 pt-16">
                <div className="max-w-7xl mx-auto flex">
                    <Sidebar activeSection={activeSection} />
                    <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth" id="scroll-container">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Layout;
