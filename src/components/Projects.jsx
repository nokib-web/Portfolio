import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectModal from './ProjectModal';
import { projects } from '../data/portfolioData';

const Projects = () => {
    const [selectedProject, setSelectedProject] = useState(null);

    return (
        <div className="max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-12"
            >
                <div className="flex items-center gap-3 mb-4">
                    <span className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                        <span className="material-icons-outlined">code</span>
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 dark:text-white">
                        Featured Projects
                    </h2>
                </div>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg">
                    A collection of projects that demonstrate my passion for building robust and interactive web applications.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -8 }}
                        className="group relative bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-glass-hover transition-all duration-500 cursor-pointer"
                        onClick={() => setSelectedProject(project)}
                    >
                        {/* Image Section */}
                        <div className="relative h-64 overflow-hidden">
                            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors z-10" />
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="w-10 h-10 flex items-center justify-center bg-white/90 dark:bg-slate-900/90 rounded-full shadow-lg backdrop-blur-md text-primary-600 dark:text-primary-400">
                                    <span className="material-icons-outlined">arrow_outward</span>
                                </span>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-6 md:p-8">
                            <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {project.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-2 leading-relaxed">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-auto">
                                {project.tech.slice(0, 3).map((t, i) => (
                                    <span key={i} className="px-3 py-1 text-xs font-semibold bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-300 rounded-full border border-primary-100 dark:border-primary-800/50">
                                        {t}
                                    </span>
                                ))}
                                {project.tech.length > 3 && (
                                    <span className="px-3 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full border border-slate-200 dark:border-slate-700">
                                        +{project.tech.length - 3}
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <ProjectModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </div>
    );
};

export default Projects;
