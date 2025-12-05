import React from 'react';

const About = () => {
    return (
        <div className="max-w-4xl mx-auto">

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">About Me</h1>

            <div className="flex flex-col lg:flex-row gap-12">

                <div className="lg:w-1/3">
                    <img
                        alt="Nokib Profile"
                        className="rounded-lg shadow-lg w-full h-auto object-cover"
                        src="https://i.ibb.co.com/5xk9tXCx/3x4-1.jpg"
                    />
                </div>

                <div className="lg:w-2/3">
                    <h2 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 mb-4">
                        Crafting Digital Experiences with Purpose
                    </h2>

                    <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed text-base">

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
            <div className="mt-16">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Personal Interests</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-lg flex items-start space-x-4">
                       
                            <div className="bg-primary/10 text-primary p-3 rounded-full">
                                <span className="material-icons-outlined">edit_note</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">Reading & Writing</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Exploring ideas through books and expressing thoughts through writing.
                                </p>
                            </div>
                      

                    </div>

                    <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-lg flex items-start space-x-4">
                        <div className="bg-primary/10 text-primary p-3 rounded-full">
                            <span className="material-icons-outlined">hiking</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Hiking & Outdoors</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Resetting my mind in nature, discovering new trails, and enjoying quiet moments away from screens.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-lg flex items-start space-x-4">
                        <div className="bg-primary/10 text-primary p-3 rounded-full">
                            <span className="material-icons-outlined">book</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Sci-Fi Reading</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
