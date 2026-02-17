import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaReact, FaHtml5, FaCss3Alt, FaJs, FaPython, FaGitAlt, FaDocker, FaAws, FaFigma } from 'react-icons/fa';
import { SiNextdotjs, SiTailwindcss, SiTypescript, SiNodedotjs, SiExpress, SiMongodb, SiPostgresql } from 'react-icons/si';

gsap.registerPlugin(ScrollTrigger);

const Skills = () => {
    const containerRef = useRef(null);

    useGSAP(() => {
        const cards = gsap.utils.toArray('.bento-card');

        gsap.from(cards, {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 20,
            scale: 0.98,
            stagger: 0.05,
            duration: 0.6,
            ease: "power2.out"
        });

        // Mouse follow glow effect
        cards.forEach(card => {
            const handleMouseMove = (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            };
            card.addEventListener('mousemove', handleMouseMove);
            return () => card.removeEventListener('mousemove', handleMouseMove);
        });
    }, { scope: containerRef });

    const SkillChip = ({ icon, name, level, color }) => (
        <div className="group relative flex items-center gap-3 p-3 bg-white/5 dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/[0.08] rounded-2xl hover:bg-white/10 dark:hover:bg-white/[0.06] hover:border-slate-300 dark:hover:border-white/[0.15] transition-all duration-300 cursor-default">
            <div className={`text-xl transition-all duration-500 text-slate-500 group-hover:scale-110 drop-shadow-sm ${color || 'group-hover:text-primary-500'}`}>
                {icon}
            </div>
            <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 tracking-tight leading-tight uppercase">{name}</span>
                {level && <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500 leading-tight tracking-wider">{level}</span>}
            </div>
            {/* Hover Glow */}
            <div className="absolute inset-0 rounded-2xl bg-primary-500/0 group-hover:bg-primary-500/5 transition-colors pointer-events-none" />
        </div>
    );

    const CardLabel = ({ text }) => (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-4">
            <span className="text-[9px] font-black text-slate-500 dark:text-white/40 uppercase tracking-[0.2em]">{text}</span>
        </div>
    );

    return (
        <section ref={containerRef} id="skills" className="relative py-24 md:py-32">
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                {/* Minimalist Header */}
                <div className="max-w-2xl mb-16">
                    <h2 className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-[0.3em] mb-4">Core Competencies</h2>
                    <h3 className="text-4xl md:text-5xl font-bold font-display text-slate-900 dark:text-white mb-6">Technical Arsenal</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                        A specialized selection of technologies I've mastered to deliver high-performance, accessible, and scalable digital products.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-[220px]">
                    {/* 1. Primary Stack - Dominant Card */}
                    <div className="bento-card md:col-span-8 md:row-span-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl border border-slate-200 dark:border-white/[0.08] rounded-[2.5rem] p-10 flex flex-col justify-between group overflow-hidden relative">
                        {/* Glow Overlay */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 bg-[radial-gradient(600px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(139,92,246,0.06),transparent_40%)]" />

                        {/* Decorative Background Icon */}
                        <div className="absolute -top-10 -right-10 text-primary-500/5 group-hover:text-primary-500/10 transition-colors pointer-events-none rotate-12">
                            <FaReact className="text-[20rem]" />
                        </div>

                        <div className="relative z-10">
                            <CardLabel text="Advanced Frontend" />
                            <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">The Frontend Ecosystem</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm leading-relaxed mb-8">
                                Crafting fluid interfaces with a focus on runtime performance, component architecture, and accessibility.
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <SkillChip icon={<FaReact />} name="React" level="Hooks/Context" color="group-hover:text-[#61DAFB]" />
                                <SkillChip icon={<SiNextdotjs />} name="Next.js" level="SSR/ISR" color="group-hover:text-white" />
                                <SkillChip icon={<SiTypescript />} name="TypeScript" level="Strict Mode" color="group-hover:text-[#3178C6]" />
                                <SkillChip icon={<SiTailwindcss />} name="Tailwind" level="JIT/Tokens" color="group-hover:text-[#38BDF8]" />
                                <SkillChip icon={<FaJs />} name="JS (ES6+)" level="Async/Event" color="group-hover:text-[#F7DF1E]" />
                                <SkillChip icon={<FaHtml5 />} name="HTML5" level="Semantic" color="group-hover:text-[#E34F26]" />
                                <SkillChip icon={<FaCss3Alt />} name="CSS3" level="Grid/Flex" color="group-hover:text-[#1572B6]" />
                                <SkillChip icon={<FaFigma />} name="Figma" level="Auto Design" color="group-hover:text-[#F24E1E]" />
                            </div>
                        </div>
                    </div>

                    {/* 2. Backend - Vertical Card */}
                    <div className="bento-card md:col-span-4 md:row-span-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl border border-slate-200 dark:border-white/[0.08] rounded-[2.5rem] p-10 flex flex-col group overflow-hidden relative">
                        {/* Glow Overlay */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 bg-[radial-gradient(600px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(139,92,246,0.06),transparent_40%)]" />
                        <CardLabel text="System Architecture" />
                        <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Scalable Backend</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                            Building reliable REST/GraphQL services with robust schemas.
                        </p>

                        <div className="flex flex-col gap-3">
                            <SkillChip icon={<SiNodedotjs />} name="Node.js" level="Runtime Opt." color="group-hover:text-[#339933]" />
                            <SkillChip icon={<SiMongodb />} name="MongoDB" level="Aggregation" color="group-hover:text-[#47A248]" />
                            <SkillChip icon={<SiPostgresql />} name="Postgres" level="SQL/Prisma" color="group-hover:text-[#4169E1]" />
                            <SkillChip icon={<FaPython />} name="Python" level="Scripting" color="group-hover:text-[#3776AB]" />
                        </div>
                    </div>

                    {/* 3. Workflow - Horizontal Small */}
                    <div className="bento-card md:col-span-12 md:row-span-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl border border-slate-200 dark:border-white/[0.08] rounded-[2.5rem] p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 group overflow-hidden relative">
                        {/* Glow Overlay */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 bg-[radial-gradient(600px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(139,92,246,0.06),transparent_40%)]" />
                        <div className="md:max-w-xs">
                            <CardLabel text="DevOps & Workflow" />
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                Ensuring seamless deployment and collaboration through modern tooling.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                            <SkillChip icon={<FaGitAlt />} name="Git" level="Workflows" color="group-hover:text-[#F05032]" />
                            <SkillChip icon={<FaDocker />} name="Docker" level="Containers" color="group-hover:text-[#2496ED]" />
                            <SkillChip icon={<FaAws />} name="Cloud Services" level="S3/EC2" color="group-hover:text-[#FF9900]" />
                            <div className="p-4 rounded-2xl bg-primary-600 flex flex-col justify-center items-center text-white shadow-xl shadow-primary-500/20">
                                <span className="text-2xl font-bold font-display leading-tight">12+</span>
                                <span className="text-[8px] font-black uppercase tracking-widest opacity-80">Tools Mastered</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;
