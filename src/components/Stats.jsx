import React from 'react';

const Stats = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="text-4xl font-bold text-primary mb-2">1+</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Years Experience</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="text-4xl font-bold text-primary mb-2">20+</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Projects Completed</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="text-4xl font-bold text-primary mb-2">10+</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Open Source Contribs</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="text-4xl font-bold text-primary mb-2">230+</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Commits this Year</div>
                </div>
            </div>
        </div>
    );
};

export default Stats;
