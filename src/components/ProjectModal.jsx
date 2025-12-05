import React, { useEffect, useState } from 'react';

const ProjectModal = ({ project, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (project) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [project]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for transition
    };

    if (!project) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            ></div>

            {/* Modal Content */}
            <div className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors z-10"
                >
                    <span className="material-icons-outlined text-gray-700 dark:text-gray-200">close</span>
                </button>

                {/* Preview Image */}
                <div className="h-48 md:h-64 bg-gray-200 dark:bg-gray-700 w-full overflow-hidden">
                    {project.image ? (
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                            <span className="material-icons-outlined text-4xl">image</span>
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h2>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.map((t, i) => (
                            <span key={i} className="px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full border border-primary/20">
                                {t}
                            </span>
                        ))}
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        {project.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        {project.liveLink && (
                            <a
                                href={project.liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors shadow-lg shadow-primary/30"
                            >
                                <span>View Live</span>
                                <span className="material-icons-outlined ml-2 text-sm">open_in_new</span>
                            </a>
                        )}
                        {project.codeLink && (
                            <a
                                href={project.codeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
                            >
                                <span>View Code</span>
                                <span className="material-icons-outlined ml-2 text-sm">code</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
