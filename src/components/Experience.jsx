import React from 'react';

const Experience = () => {
    const experiences = [
        {
            role: "Full-Stack Developer (Trainee)",
            company: "Programming Hero",
            period: "Last 6 Months",
            description:
                "Completed an intensive full-stack development training focused on real-world MERN stack projects. Gained hands-on experience with React, Next.js, Node.js, Express, MongoDB, authentication, API development, and deployment workflows."
        },
        {
            role: "MERN Stack Developer ",
            company: "Personal & Practice Projects",
            period: "2025 - Present",
            description:
                "Developing full-stack applications using Next.js, React, Tailwind CSS, Node.js, Express, and MongoDB. Practicing clean code, reusable components, responsive UI, and building end-to-end project features."
        },
        {
            role: "Frontend Developer ",
            company: "Open-Source & Personal Projects",
            period: "2024 - 2025",
            description:
                "Built UI components, improved JavaScript fundamentals, and strengthened frontend skills through continuous practice and contribution to small projects."
        }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Experience</h2>
            <div className="space-y-8 border-l-2 border-gray-200 dark:border-gray-700 ml-3 pl-8 relative">
                {experiences.map((exp, index) => (
                    <div key={index} className="relative">
                        <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-white dark:border-gray-900 bg-primary"></span>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{exp.role}</h3>
                        <p className="text-primary font-medium mb-2">{exp.company} | {exp.period}</p>
                        <p className="text-gray-600 dark:text-gray-300">{exp.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Experience;
