import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectModal from './ProjectModal';

const Projects = () => {
    const [selectedProject, setSelectedProject] = useState(null);

    const projects = [
        {
            title: "Portfolio Website",
            description: "A responsive and interactive personal portfolio website built with modern web technologies. Features a clean design, dark mode support, and smooth user experience.",
            tech: ["React", "Tailwind CSS", "Vite"],
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            codeLink: "https://github.com/nokib-web/portfolio",
            liveLink: "#"
        },
        {
            title: "NexCart",
            description: "NexCart is a full-featured e-commerce platform developed with Next.js, Tailwind CSS, and Stripe integration. The application includes product listing, category filtering, dynamic routing, real-time cart management, and a responsive, mobile-friendly UI. It is optimized for SEO, fast rendering, and provides a smooth, secure shopping experience from product discovery to checkout.",
            tech: ["Next.js", "React", "MongoDB", "JavaScript"],
            image: "https://i.ibb.co.com/5xrL57tz/logo.png",
            codeLink: "https://github.com/nokib-web/NexCart",
            liveLink: "https://nexcart-mu.vercel.app/"
        },
        {
            title: "StudyMate",
            description: "StudyMate is a web-based study companion that helps learners organize their studies, manage tasks, and focus on what matters most. With a clean, responsive UI and intuitive features, StudyMate aims to simplify and enhance the study routine for students and lifelong learners.",
            tech: ["React.js", "JavaScript", "MongoDB", "NodeJs"],
            image: "https://i.ibb.co.com/R4V6ZnY3/photo-1491841550275-ad7854e35ca6.jpg",
            codeLink: "https://github.com/nokib-web/StudyMate-Client",
            liveLink: "https://studymate-b37fa.web.app"
        },
        {
            title: "WarmPaws",
            description: "WarmPaws is a responsive, user-friendly web application aimed at connecting pet lovers with animal shelters and pet adoption opportunities. Built with modern web technologies and deployed on Vercel, Warm-Paws delivers a seamless experience for discovering, browsing, and engaging with pets up for adoption.",
            tech: ["React", "Firebase", "NodeJS", "Redux"],
            image: "https://i.ibb.co.com/bg2HBHsn/7.jpg",
            codeLink: "https://github.com/nokib-web/WarmPaws",
            liveLink: "https://warm-paws-zeta.vercel.app/"
        }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold text-gray-900 dark:text-white mb-8"
            >
                Projects
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 cursor-pointer group"
                        onClick={() => setSelectedProject(project)}
                    >
                        <div className="h-48 mb-4 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {project.tech.slice(0, 3).map((t, i) => (
                                <span key={i} className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                                    {t}
                                </span>
                            ))}
                            {project.tech.length > 3 && (
                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full">
                                    +{project.tech.length - 3}
                                </span>
                            )}
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="text-sm font-medium text-primary hover:text-purple-700 transition-colors flex items-center mt-auto"
                        >
                            View Details <span className="material-icons-outlined text-sm ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </motion.button>
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
