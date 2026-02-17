import React, { useRef } from 'react';
import { FaReact, FaGithub, FaNodeJs } from 'react-icons/fa';
import { SiMongodb, SiTailwindcss, SiNextdotjs } from 'react-icons/si';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Magnetic from './Common/Magnetic';

const Hero = () => {
    const containerRef = useRef(null);
    const iconsRef = useRef([]);
    const contentRef = useRef(null);

    useGSAP(() => {
        // Floating icons animation
        iconsRef.current.forEach((icon, index) => {
            gsap.to(icon, {
                x: `random(-50, 50, 5)`,
                y: `random(-30, 30, 5)`,
                rotation: `random(-15, 15)`,
                duration: `random(3, 6)`,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: `random(0, 2)`
            });
        });

        // Hero content entrance
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(contentRef.current.querySelector('.hero-badge'), {
            opacity: 0,
            y: 20,
            duration: 0.8,
            delay: 0.2
        })
            .from(contentRef.current.querySelector('h1'), {
                opacity: 0,
                y: 30,
                duration: 1,
            }, "-=0.6")
            .from(contentRef.current.querySelector('p'), {
                opacity: 0,
                y: 20,
                duration: 0.8
            }, "-=0.7")
            .from(contentRef.current.querySelectorAll('.hero-btn-container'), {
                opacity: 0,
                y: 20,
                stagger: 0.15,
                duration: 0.8
            }, "-=0.6");

    }, { scope: containerRef });

    const addToRefs = (el) => {
        if (el && !iconsRef.current.includes(el)) {
            iconsRef.current.push(el);
        }
    };

    return (
        <section ref={containerRef} className="relative w-full min-h-[calc(100vh-100px)] flex items-center justify-center overflow-hidden">
            {/* Background Floating Icons */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div ref={addToRefs} className="absolute top-1/4 left-1/4 text-blue-400/20 dark:text-blue-400/10 text-7xl filter blur-[1px]">
                    <FaReact />
                </div>
                <div ref={addToRefs} className="absolute top-1/3 right-1/4 text-green-500/20 dark:text-green-500/10 text-6xl filter blur-[1px]">
                    <SiMongodb />
                </div>
                <div ref={addToRefs} className="absolute bottom-1/4 left-1/3 text-cyan-400/20 dark:text-cyan-400/10 text-7xl filter blur-[1px]">
                    <SiTailwindcss />
                </div>
                <div ref={addToRefs} className="absolute bottom-1/3 right-1/3 text-slate-800/10 dark:text-slate-200/10 text-6xl filter blur-[1px]">
                    <FaGithub />
                </div>
                <div ref={addToRefs} className="absolute top-20 right-20 text-slate-900/10 dark:text-slate-100/10 text-5xl filter blur-[1px]">
                    <SiNextdotjs />
                </div>
                <div ref={addToRefs} className="absolute bottom-20 left-20 text-green-600/20 dark:text-green-600/10 text-6xl filter blur-[1px]">
                    <FaNodeJs />
                </div>
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center" ref={contentRef}>
                <div>
                    <div className="hero-badge inline-block px-4 py-1.5 mb-6 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 text-sm font-medium border border-primary-100 dark:border-primary-800 shadow-sm backdrop-blur-sm">
                        ✨ Full-Stack Developer
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold font-display text-slate-900 dark:text-white mb-6 tracking-tight">
                        Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-400 dark:to-primary-600 relative">
                            Nokib
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary-500 opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                            </svg>
                        </span>
                        <br />
                        <span className="text-4xl md:text-6xl text-slate-700 dark:text-slate-300">
                            Building digital experiences.
                        </span>
                    </h1>
                    <p className="mt-8 text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-body">
                        I enjoy crafting responsive web solutions using modern technologies like <span className="text-slate-900 dark:text-slate-200 font-semibold">Next.js</span>, <span className="text-slate-900 dark:text-slate-200 font-semibold">React</span>, and <span className="text-slate-900 dark:text-slate-200 font-semibold">Node.js</span>.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="hero-btn-container w-full sm:w-auto">
                            <Magnetic>
                                <a
                                    href="#contact"
                                    className="bg-primary-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-500/40 w-full sm:w-auto inline-flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    Get in Touch
                                    <span className="material-icons-outlined text-sm">arrow_forward</span>
                                </a>
                            </Magnetic>
                        </div>
                        <div className="hero-btn-container w-full sm:w-auto">
                            <Magnetic>
                                <a
                                    href="#projects"
                                    className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm hover:shadow-md w-full sm:w-auto inline-flex items-center justify-center cursor-pointer"
                                >
                                    View Projects
                                </a>
                            </Magnetic>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
