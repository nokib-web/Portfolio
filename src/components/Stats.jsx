import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { appConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

const Stats = () => {
    const containerRef = useRef(null);
    const [statsData, setStatsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${appConfig.apiBaseUrl}/api/stats?personaId=developer`);
                const data = await response.json();
                setStatsData(Array.isArray(data) ? data : []);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch stats:", error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    useGSAP(() => {
        if (loading || statsData.length === 0) return;

        const cards = gsap.utils.toArray('.stat-card');

        cards.forEach((card, index) => {
            const numberElement = card.querySelector('.stat-number');
            const targetValue = statsData[index]?.value || 0;

            // Fade and slide up the card
            gsap.fromTo(card, 
                { opacity: 0, y: 20 },
                {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 95%", // Made it 95% to trigger easier
                        toggleActions: "play none none none"
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out"
                }
            );

            // Animate the number
            const obj = { val: 0 };
            gsap.to(obj, {
                val: targetValue,
                scrollTrigger: {
                    trigger: card,
                    start: "top 90%",
                    toggleActions: "play none none none"
                },
                duration: 2,
                ease: "power2.out",
                onUpdate: () => {
                    if (numberElement) {
                        numberElement.innerText = Math.floor(obj.val) + "+";
                    }
                }
            });
        });

        // Add a global refresh after a short delay to handle any late layout shifts
        setTimeout(() => ScrollTrigger.refresh(), 500);

    }, { scope: containerRef, dependencies: [statsData, loading] });

    if (loading) return null; // Or a loader

    return (
        <div ref={containerRef} className="w-full py-8 px-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {statsData.map((stat) => (
                    <div key={stat._id} className="stat-card bg-white dark:bg-gray-800 p-6 rounded-lg text-center shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="stat-number text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">0+</div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Stats;
