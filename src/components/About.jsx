import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = ({ aboutAnchorRef }) => {
    const containerRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });

        // Header animation
        tl.fromTo(".about-header",
            { opacity: 0, x: -50 },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power2.out"
            }
        );

        // Image area fade-in (no longer needed for floating photo, keep for content)
        tl.fromTo(".about-content p",
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                stagger: 0.2,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.4");

        // Interests cards animation
        gsap.fromTo(".interest-card",
            { opacity: 0, y: 30 },
            {
                scrollTrigger: {
                    trigger: ".interests-grid",
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                opacity: 1,
                y: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: "power3.out"
            }
        );

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="w-full">

            <div className="about-header flex items-center gap-3 mb-6">
                <span className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                    <span className="material-icons-outlined">person</span>
                </span>
                <h1 className="text-4xl md:text-5xl font-bold font-display text-slate-900 dark:text-white">
                    About Me
                </h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">

                <div className="lg:w-1/3 about-image relative">
                    <div className="sticky top-[25vh] mt-8 flex justify-center">
                        {/* Invisible anchor — the floating photo lands here */}
                        <div
                            ref={aboutAnchorRef}
                            style={{ width: 280, height: 280, borderRadius: '20px', opacity: 0, background: 'transparent', flexShrink: 0 }}
                            aria-hidden="true"
                        />
                    </div>
                </div>

                <div className="lg:w-2/3 about-content">
                    <h2 className="text-3xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 mb-6">
                        Crafting Digital Experiences with Purpose
                    </h2>

                    <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-body">

                        <p>
                            I’m Nazmul Hasan Nokib — a Full-Stack Web Developer driven by a deep fascination for how ideas
                            transform into interactive digital experiences. My journey started with a tiny
                            “Hello World,” but quickly evolved into an obsession with understanding the full
                            lifecycle of modern web development: architecture, performance, UX, and everything in between.
                        </p>

                        <p>
                            I believe impactful software comes from a fusion of thoughtful design, robust engineering,
                            and a relentless focus on usability. Whether I'm building a component, designing a backend API,
                            or architecting an entire product, I prioritize clarity, scalability, and maintainability.
                            Clean code is important — but meaningful experiences are what truly matter.
                        </p>

                        <p>
                            Beyond building applications, I’m an avid problem-solver. I regularly challenge myself
                            with algorithmic puzzles on platforms like <span className="text-primary-600 dark:text-primary-400 font-semibold">LeetCode</span> and <span className="text-primary-600 dark:text-primary-400 font-semibold">CodeChef</span>,
                            which helps me keep my logic sharp and my code optimized. Dealing with complex
                            data structures and algorithms is not just a skill — it's a passion.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-12">
                <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-6">Personal Interests</h3>

                <div className="interests-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    <div className="interest-card bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-8 rounded-2xl flex items-start space-x-4 shadow-sm hover:shadow-md transition-all">

                        <div className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 p-3 rounded-xl">
                            <span className="material-icons-outlined">edit_note</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg">Reading & Writing</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                                Exploring ideas through books and expressing thoughts through writing.
                            </p>
                        </div>


                    </div>

                    <div className="interest-card bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-8 rounded-2xl flex items-start space-x-4 shadow-sm hover:shadow-md transition-all">
                        <div className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 p-3 rounded-xl">
                            <span className="material-icons-outlined">hiking</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg">Hiking & Outdoors</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                                Resetting my mind in nature, discovering new trails, and enjoying quiet moments away from screens.
                            </p>
                        </div>
                    </div>

                    <div className="interest-card bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-8 rounded-2xl flex items-start space-x-4 shadow-sm hover:shadow-md transition-all">
                        <div className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 p-3 rounded-xl">
                            <span className="material-icons-outlined">book</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg">Sci-Fi Reading</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                                Exploring imaginative futures, bold ideas, and stories that stretch the limits of possibility.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default About;
