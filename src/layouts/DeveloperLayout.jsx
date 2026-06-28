import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import CustomCursor from '../components/Common/CustomCursor';
import MeshGradient from '../components/Background/MeshGradient';
import Sidebar from '../components/Sidebar';

const DeveloperLayout = ({ children }) => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const location = useLocation();
  const isBlogPage = location.pathname.startsWith('/developer/blog') || location.pathname.startsWith('/blog');

  // Handle scroll to hash on route change/initial load
  useEffect(() => {
      if (location.hash) {
          const timer = setTimeout(() => {
              const id = location.hash.replace('#', '');
              const element = document.getElementById(id);
              if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
              }
              setTimeout(() => {
                  import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
                      ScrollTrigger.refresh();
                  });
              }, 1000);
          }, 100);
          return () => clearTimeout(timer);
      } else if (location.pathname === '/' || location.pathname === '/developer' || location.pathname === '/developer/') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  }, [location.pathname, location.hash]);

  useEffect(() => {
      const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'education', 'contact', 'stats'];
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  setActiveSection(entry.target.id);
                  if (window.location.pathname === '/' || window.location.pathname === '/developer' || window.location.pathname === '/developer/') {
                      window.history.replaceState(null, null, `#${entry.target.id}`);
                  }
              }
          });
      }, { threshold: [0, 0.2, 0.5], rootMargin: "-40% 0px -55% 0px" });

      sections.forEach(id => {
          const el = document.getElementById(id);
          if (el) observer.observe(el);
      });

      const handleLoad = () => {
          import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
              ScrollTrigger.refresh();
          });
      };
      window.addEventListener('load', handleLoad);
      const timer = setTimeout(handleLoad, 1500);

      return () => {
          observer.disconnect();
          window.removeEventListener('load', handleLoad);
          clearTimeout(timer);
      };
  }, [children]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-850 dark:text-slate-200 transition-colors duration-500 font-body relative overflow-x-hidden selection:bg-primary-500/30 selection:text-primary-600 pb-16">
      <CustomCursor />
      <MeshGradient />

      {/* Terminal grid lines background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0e74900a_1px,transparent_1px),linear-gradient(to_bottom,#0e74900a_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0" />

      {/* Top minimal header */}
      <Header activeSection={activeSection} activePersonaId="developer" />

      {/* Content wrapper with spacer for fixed sidebar */}
      <div className="flex-1 w-full relative z-10 pt-8 lg:pt-12">
        <div className={`${isBlogPage ? 'w-full' : 'w-11/12 max-w-[1800px] mx-auto px-4 md:px-6 transition-all duration-550 ease-out'} flex gap-8 relative items-start`}>
          
          {!isBlogPage && (
            <>
              {/* Actual fixed sidebar */}
              <Sidebar
                activeSection={activeSection}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
              />
              {/* Invisible spacer to reserve space in the flex layout for the fixed sidebar */}
              <div className={`hidden lg:block shrink-0 transition-all duration-550 ease-[cubic-bezier(0.23,1,0.32,1)] ${isSidebarOpen ? 'w-64' : 'w-20'}`} aria-hidden="true" />
            </>
          )}

          <main className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>


    </div>
  );
};

export default DeveloperLayout;
