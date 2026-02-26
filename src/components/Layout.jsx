import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import MeshGradient from './Background/MeshGradient';
import CustomCursor from './Common/CustomCursor';

const Layout = ({ children }) => {
    const [activeSection, setActiveSection] = useState('hero');
    const location = useLocation();
    const isBlogPage = location.pathname.startsWith('/blog');

    // Handle scroll to hash on route change/initial load
    useEffect(() => {
        if (location.hash) {
            // Small delay to ensure content is rendered
            const timer = setTimeout(() => {
                const id = location.hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
            return () => clearTimeout(timer);
        } else if (location.pathname === '/') {
            // If on home with no hash, scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [location.pathname, location.hash]);

    useEffect(() => {
        const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'education', 'contact', 'stats'];
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                    // Update URL hash without jumping
                    if (window.location.pathname === '/') {
                        window.history.replaceState(null, null, `#${entry.target.id}`);
                    }
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
            <CustomCursor />
            <MeshGradient />
            <Header activeSection={activeSection} />
            <div className="flex-1 w-full relative z-10 pt-16">
                <div className={`${isBlogPage ? 'w-full' : 'max-w-7xl mx-auto px-4 md:px-8 lg:px-12'} flex`}>
                    {!isBlogPage && <Sidebar activeSection={activeSection} />}
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Layout;
