import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { appConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

const originalStats = [
    { _id: '1', label: 'Commits this Year', value: 1100, suffix: '+' },
    { _id: '2', label: 'Open Source Contribs', value: 10, suffix: '+' },
    { _id: '3', label: 'Projects Completed', value: 20, suffix: '+' },
    { _id: '4', label: 'Years Experience', value: 1, suffix: '+' }
];

const Stats = () => {
    const containerRef = useRef(null);
    const [statsData, setStatsData] = useState(originalStats);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${appConfig.apiBaseUrl}/api/stats?personaId=developer`);
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setStatsData(data);
                    }
                }
            } catch (error) {
                console.warn("Using default stats for Developer persona:", error);
            }
        };
        fetchStats();
    }, []);

    useGSAP(() => {
        const cards = gsap.utils.toArray('.stat-card');
        if (cards.length === 0) return;

        cards.forEach((card, index) => {
            const numberElement = card.querySelector('.stat-number');
            const targetValue = parseInt(statsData[index]?.value, 10) || originalStats[index]?.value || 0;
            const suffix = statsData[index]?.suffix || '+';

            // Card fade-in
            gsap.fromTo(card, 
                { opacity: 0, y: 20 },
                {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 95%",
                        toggleActions: "play none none none"
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out"
                }
            );

            // Counter animation
            const obj = { val: 0 };
            gsap.to(obj, {
                val: targetValue,
                scrollTrigger: {
                    trigger: card,
                    start: "top 95%",
                    toggleActions: "play none none none"
                },
                duration: 1.8,
                ease: "power2.out",
                onUpdate: () => {
                    if (numberElement) {
                        numberElement.innerText = Math.floor(obj.val) + suffix;
                    }
                }
            });
        });

        setTimeout(() => ScrollTrigger.refresh(), 300);

    }, { scope: containerRef, dependencies: [statsData] });

    const displayStats = statsData.length > 0 ? statsData : originalStats;

    return (
        <div ref={containerRef} className="w-full">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 dark:text-white mb-6">
                Stats
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {displayStats.map((stat, idx) => (
                    <div 
                        key={stat._id || idx} 
                        className="stat-card bg-white dark:bg-slate-900/50 p-6 rounded-2xl text-center border border-slate-100 dark:border-slate-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-center items-center min-h-[140px]"
                    >
                        <div className="stat-number text-3xl sm:text-4xl font-extrabold text-primary-600 dark:text-primary-400 mb-2 font-display">
                            {stat.value || 0}{stat.suffix || '+'}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium leading-tight max-w-[110px] mx-auto">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Stats;
