import React from 'react';
import { motion } from 'framer-motion';
import { FaReact, FaHtml5, FaCss3Alt, FaJs, FaPython, FaGitAlt, FaDocker, FaAws, FaFigma } from 'react-icons/fa';
import { SiNextdotjs, SiTailwindcss, SiTypescript, SiNodedotjs, SiExpress, SiMongodb, SiPostgresql } from 'react-icons/si';

const Skills = () => {
    const skills = [
        {
            category: "Frontend",
            items: [
                { name: "React", icon: <FaReact /> },
                { name: "Next.js", icon: <SiNextdotjs /> },
                { name: "Tailwind CSS", icon: <SiTailwindcss /> },
                { name: "TypeScript", icon: <SiTypescript /> },
                { name: "HTML5", icon: <FaHtml5 /> },
                { name: "CSS3", icon: <FaCss3Alt /> },
                { name: "JavaScript", icon: <FaJs /> },
            ]
        },
        {
            category: "Backend",
            items: [
                { name: "Node.js", icon: <SiNodedotjs /> },
                { name: "Express", icon: <SiExpress /> },
                { name: "MongoDB", icon: <SiMongodb /> },
                { name: "PostgreSQL", icon: <SiPostgresql /> },
                { name: "Python", icon: <FaPython /> },
            ]
        },
        {
            category: "Tools & DevOps",
            items: [
                { name: "Git", icon: <FaGitAlt /> },
                { name: "Docker", icon: <FaDocker /> },
                { name: "AWS", icon: <FaAws /> },
                { name: "VS Code", icon: null },
                { name: "Figma", icon: <FaFigma /> },
            ]
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
                Skills & Tools
            </motion.h2>
            <div className="space-y-12">
                {skills.map((category, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2 inline-block">{category.category}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {category.items.map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center space-y-3 cursor-pointer group transition-colors"
                                >
                                    <motion.div
                                        whileHover={{ rotate: 10, scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        className="text-4xl text-gray-400 group-hover:text-primary transition-colors"
                                    >
                                        {item.icon || <span className="text-2xl font-bold">Code</span>}
                                    </motion.div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">{item.name}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Skills;
