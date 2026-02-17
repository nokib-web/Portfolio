import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const statsData = [
    { label: "Years Experience", value: 1 },
    { label: "Projects Completed", value: 20 },
    { label: "Open Source Contribs", value: 10 },
    { label: "Commits this Year", value: 530 },
];

const Stats = () => {
    const containerRef = useRef(null);

    useGSAP(() => {
        const cards = gsap.utils.toArray('.stat-card');

        cards.forEach((card, index) => {
            const numberElement = card.querySelector('.stat-number');
            const targetValue = statsData[index].value;

            // Fade and slide up the card
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 90%",
                    toggleActions: "play none none none"
                },
                opacity: 0,
                y: 20,
                duration: 0.6,
                ease: "power2.out"
            });

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
                    numberElement.innerText = Math.floor(obj.val) + "+";
                }
            });
        });

        // Add a global refresh after a short delay to handle any late layout shifts
        setTimeout(() => ScrollTrigger.refresh(), 500);

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="max-w-4xl mx-auto py-12 px-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {statsData.map((stat, index) => (
                    <div key={index} className="stat-card bg-white dark:bg-gray-800 p-6 rounded-lg text-center shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="stat-number text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">0+</div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Stats;
