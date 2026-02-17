import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectModal from './ProjectModal';
import { projects } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
    const [selectedProject, setSelectedProject] = useState(null);
    const containerRef = useRef(null);

    useGSAP(() => {
        const headerTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".projects-header",
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });

        headerTl.from(".projects-header .badge", {
            opacity: 0,
            scale: 0.8,
            duration: 0.5
        })
            .from(".projects-header h2", {
                opacity: 0,
                y: 20,
                duration: 0.6
            }, "-=0.3")
            .from(".projects-header p", {
                opacity: 0,
                y: 20,
                duration: 0.6
            }, "-=0.4");

        // Projects Grid Animation
        gsap.fromTo(".project-card",
            { opacity: 0, y: 30 },
            {
                scrollTrigger: {
                    trigger: ".projects-grid",
                    start: "top 90%",
                    toggleActions: "play none none none"
                },
                opacity: 1,
                y: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: "power3.out",
                onComplete: () => ScrollTrigger.refresh()
            }
        );

        // "View All" button animation
        gsap.from(".projects-cta", {
            scrollTrigger: {
                trigger: ".projects-cta",
                start: "top 90%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 20,
            duration: 0.6
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative py-20 md:py-32 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50 dark:from-slate-950/50 dark:via-slate-900 dark:to-slate-950/50 pointer-events-none" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="projects-header mb-16 md:mb-20">
                    <div className="flex flex-col items-center text-center space-y-4">
                        {/* Badge */}
                        <div className="badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border border-primary-200/50 dark:border-primary-700/30 shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                            </span>
                            <span className="text-xs font-bold text-primary-700 dark:text-primary-300 uppercase tracking-widest">Featured Work</span>
                        </div>

                        {/* Title */}
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-slate-900 dark:text-white">
                            Selected{' '}
                            <span className="bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 bg-clip-text text-transparent">
                                Projects
                            </span>
                        </h2>

                        {/* Description */}
                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                            Crafting exceptional digital experiences with modern technologies.
                            Each project represents a unique challenge solved with innovation and precision.
                        </p>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="projects-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {projects.map((project, index) => (
                        <article
                            key={index}
                            onClick={() => setSelectedProject(project)}
                            className="project-card group relative bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 hover:shadow-2xl hover:shadow-primary-500/20 dark:hover:shadow-primary-500/10 transition-all duration-700 cursor-pointer"
                        >
                            {/* Gradient Border Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-primary-500/0 to-purple-500/0 group-hover:from-primary-500/10 group-hover:via-purple-500/10 group-hover:to-primary-500/10 transition-all duration-700 rounded-2xl pointer-events-none" />

                            {/* Image Container */}
                            <div className="relative h-44 sm:h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent z-10 group-hover:from-slate-900/60 transition-all duration-700" />

                                {/* Image */}
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                />

                                {/* Top Right Action Button */}
                                <div className="absolute top-3 right-3 z-20">
                                    <div className="w-9 h-9 flex items-center justify-center bg-white/10 dark:bg-slate-900/30 backdrop-blur-md rounded-full border border-white/20 dark:border-slate-700/50 opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-500">
                                        <span className="material-icons-outlined text-white text-base">arrow_outward</span>
                                    </div>
                                </div>

                                {/* Primary Tech Badges */}
                                <div className="absolute bottom-3 left-3 z-20 flex gap-1.5 sm:gap-2">
                                    {project.tech.slice(0, 2).map((tech, i) => (
                                        <span
                                            key={i}
                                            className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 rounded-lg backdrop-blur-sm shadow-lg border border-white/50 dark:border-slate-700/50 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
                                            style={{ transitionDelay: `${i * 50}ms` }}
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4">
                                {/* Title */}
                                <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 line-clamp-1">
                                    {project.title}
                                </h3>

                                {/* Description */}
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                                    {project.description}
                                </p>

                                {/* Divider */}
                                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

                                {/* Tech Stack */}
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {project.tech.slice(0, 4).map((tech, i) => (
                                        <span
                                            key={i}
                                            className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-700/50 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-300"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                    {project.tech.length > 4 && (
                                        <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-md border border-primary-200 dark:border-primary-800">
                                            +{project.tech.length - 4} more
                                        </span>
                                    )}
                                </div>

                                {/* Hover Indicator */}
                                <div className="hidden sm:block absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-primary-600 dark:text-primary-400">
                                        <span>View Details</span>
                                        <span className="material-icons-outlined text-sm">east</span>
                                    </div>
                                </div>
                            </div>

                            {/* Animated Border */}
                            <div className="absolute inset-0 rounded-2xl ring-2 ring-primary-500/0 group-hover:ring-primary-500/30 dark:group-hover:ring-primary-500/20 transition-all duration-700 pointer-events-none" />
                        </article>
                    ))}
                </div>

                {/* View All Projects CTA */}
                <div className="projects-cta mt-16 text-center">
                    <a
                        href="https://github.com/nokib-web"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <span>View All Projects on GitHub</span>
                        <span className="material-icons-outlined text-lg">arrow_outward</span>
                    </a>
                </div>
            </div>

            <ProjectModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </section>
    );
};

export default Projects;
