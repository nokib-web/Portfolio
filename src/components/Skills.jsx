import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skills } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

const Skills = () => {
    const containerRef = useRef(null);

    useGSAP(() => {
        const sections = gsap.utils.toArray('.skill-category-section');

        sections.forEach((section) => {
            gsap.fromTo(section.querySelectorAll('.skill-card'),
                { opacity: 0, y: 30 },
                {
                    scrollTrigger: {
                        trigger: section,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    },
                    opacity: 1,
                    y: 0,
                    stagger: 0.05,
                    duration: 0.6,
                    ease: "power3.out",
                    overwrite: "auto"
                }
            );

            gsap.fromTo(section.querySelector('.category-header'),
                { opacity: 0, x: -20 },
                {
                    scrollTrigger: {
                        trigger: section,
                        start: "top 90%",
                    },
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    overwrite: "auto"
                }
            );
        });

        // Initial refresh to ensure triggers are correct
        ScrollTrigger.refresh();

        // Extra refresh after a short delay for late-loading content/layout shifts
        const timeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 1000);

        return () => clearTimeout(timeout);
    }, { scope: containerRef });

    const SkillCard = ({ item }) => (
        <div
            className="skill-card group relative flex items-center gap-4 p-4 bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl hover:border-primary-500/30 transition-[border-color,box-shadow,background-color,transform] duration-500 hover:shadow-2xl hover:shadow-primary-500/10 cursor-default overflow-hidden"
            style={{ '--skill-color': item.color }}
        >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--skill-color)]/0 to-[var(--skill-color)]/0 group-hover:from-[var(--skill-color)]/5 group-hover:to-transparent transition-all duration-500" />

            {/* Icon Container */}
            <div className="relative z-10 w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group-hover:scale-110 group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:border-primary-500/20 transition-all duration-500">
                <span className="text-2xl transition-colors duration-500 text-slate-600 dark:text-slate-400 group-hover:text-[var(--skill-color)] filter grayscale group-hover:grayscale-0">
                    {item.icon || <span className="material-icons-outlined text-xl">terminal</span>}
                </span>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                    {item.name}
                </span>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400 uppercase tracking-widest transition-colors duration-300">
                    {item.level}
                </span>
            </div>

            {/* Subtle Pointer Effect */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--skill-color)] shadow-[0_0_8px_var(--skill-color)]" />
            </div>
        </div>
    );

    return (
        <section ref={containerRef} className="relative py-16 md:py-20 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-primary-500/5 rounded-full blur-[80px] md:blur-[120px] -mr-32 md:-mr-64 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-purple-500/5 rounded-full blur-[80px] md:blur-[120px] -ml-32 md:-ml-64 -mb-32 pointer-events-none" />

            <div className="px-6 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/50 mb-4 transition-transform hover:scale-105">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                            <span className="text-[10px] font-black text-primary-700 dark:text-primary-400 uppercase tracking-[0.2em]">Full Stack Capabilities</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-display text-slate-900 dark:text-white mb-6 leading-[1.1]">
                            Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400">Expertise.</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-xl">
                            A curated selection of modern technologies and tools I utilize to craft high-end digital experiences.
                        </p>
                    </div>
                    {/* Stats or subtle element */}
                    <div className="hidden lg:block text-right">
                        <div className="text-6xl font-black text-slate-200 dark:text-slate-800/50 select-none">SKILLS</div>
                    </div>
                </div>

                {/* Categories */}
                <div className="space-y-12">
                    {skills.map((category, idx) => (
                        <div key={idx} className="skill-category-section">
                            <div className="category-header flex items-center gap-4 mb-6">
                                <h3 className="text-xl font-black font-display text-slate-900 dark:text-white uppercase tracking-wider">
                                    {category.category}
                                </h3>
                                <div className="h-[2px] flex-1 bg-gradient-to-r from-slate-200 dark:from-slate-800 to-transparent" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                                {category.items.map((item, sIdx) => (
                                    <SkillCard key={sIdx} item={item} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;

