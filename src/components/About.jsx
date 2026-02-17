import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
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

        // Image and content stagger
        tl.fromTo(".about-image",
            { opacity: 0, scale: 0.8 },
            {
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "back.out(1.7)"
            }, "-=0.4")
            .fromTo(".about-content p",
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.2,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.6");

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
        <div ref={containerRef} className="max-w-4xl mx-auto">

            <div className="about-header flex items-center gap-3 mb-8">
                <span className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                    <span className="material-icons-outlined">person</span>
                </span>
                <h1 className="text-4xl md:text-5xl font-bold font-display text-slate-900 dark:text-white">
                    About Me
                </h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">

                <div className="lg:w-1/3 about-image">
                    <img
                        alt="Nokib Profile"
                        className="rounded-2xl shadow-lg w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-500"
                        src="https://i.ibb.co.com/TBcCs9XZ/Gemini-Generated-Image-5d1t635d1t635d1t.png"
                    />
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
                            I work extensively with React, Next.js, Node.js, MongoDB, modern JavaScript,
                            and the surrounding ecosystem. I love exploring emerging technologies, patterns,
                            and tools that push the boundaries of what’s possible on the web.
                            Learning isn’t a phase for me — it’s part of who I am.
                        </p>
                    </div>
                </div>
            </div>

            {/* Personal Interests */}
            <div className="mt-20">
                <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-8">Personal Interests</h3>

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
