import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaReact, FaGithub, FaNodeJs } from 'react-icons/fa';
import { SiMongodb, SiTailwindcss, SiNextdotjs } from 'react-icons/si';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Hero = () => {
    const containerRef = useRef(null);
    const iconsRef = useRef([]);

    useGSAP(() => {
        iconsRef.current.forEach((icon, index) => {
            gsap.to(icon, {
                x: `random(-50, 50, 5)`, // Random x movement
                y: `random(-30, 30, 5)`, // Random y movement
                rotation: `random(-15, 15)`, // Slight rotation
                duration: `random(3, 6)`, // Random duration
                repeat: -1, // Infinite loop
                yoyo: true, // Go back and forth
                ease: "sine.inOut", // Smooth ease
                delay: `random(0, 2)` // Random start delay
            });
        });
    }, { scope: containerRef });

    const addToRefs = (el) => {
        if (el && !iconsRef.current.includes(el)) {
            iconsRef.current.push(el);
        }
    };

    return (
        <section ref={containerRef} className="relative w-full h-[calc(100vh-64px)] flex items-center justify-center bg-white dark:bg-gray-900 overflow-hidden">
            {/* Background Floating Icons - GSAP Animated */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div ref={addToRefs} className="absolute top-1/4 left-1/4 text-blue-400 opacity-20 dark:opacity-30 text-6xl">
                    <FaReact />
                </div>
                <div ref={addToRefs} className="absolute top-1/3 right-1/4 text-green-500 opacity-20 dark:opacity-30 text-5xl">
                    <SiMongodb />
                </div>
                <div ref={addToRefs} className="absolute bottom-1/4 left-1/3 text-cyan-400 opacity-20 dark:opacity-30 text-6xl">
                    <SiTailwindcss />
                </div>
                <div ref={addToRefs} className="absolute bottom-1/3 right-1/3 text-gray-800 dark:text-gray-200 opacity-20 dark:opacity-30 text-5xl">
                    <FaGithub />
                </div>
                <div ref={addToRefs} className="absolute top-20 right-20 text-black dark:text-white opacity-20 dark:opacity-30 text-4xl">
                    <SiNextdotjs />
                </div>
                <div ref={addToRefs} className="absolute bottom-20 left-20 text-green-600 opacity-20 dark:opacity-30 text-5xl">
                    <FaNodeJs />
                </div>
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                        Hi, I'm <span className="text-primary">Nokib</span>
                        <br />
                        A coder by day, problem-solver by night!
                    </h1>
                    <p className="mt-8 text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                        I am a Full-Stack Web Developer. I enjoy crafting responsive web solutions using modern technologies like Next.js, React, Tailwind CSS, Node.js, Express, and MongoDB, while also applying DevOps practices, continuously aiming to deliver high-quality, comprehensive, user-centric software solutions.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-primary text-white px-8 py-3 rounded-md font-medium hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto inline-block cursor-pointer"
                        >
                            <Link to="/contact">Get in Touch</Link>
                        </motion.a>
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 px-8 py-3 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm hover:shadow-md w-full sm:w-auto inline-block cursor-pointer"
                        >
                            <Link to="/projects">View Projects</Link>
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
