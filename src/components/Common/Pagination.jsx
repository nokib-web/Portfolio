import React from 'react';
import { motion } from 'framer-motion';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-center gap-2 mt-16">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 hover:border-primary-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed group shadow-sm hover:shadow-md"
            >
                <span className="material-icons-outlined text-xl group-hover:-translate-x-0.5 transition-transform">chevron_left</span>
            </motion.button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200/50 dark:border-white/5">
                {pages.map((page) => (
                    <motion.button
                        key={page}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onPageChange(page)}
                        className={`min-w-[40px] h-10 rounded-xl text-sm font-bold transition-all duration-300 ${currentPage === page
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm'
                            }`}
                    >
                        {page}
                    </motion.button>
                ))}
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 hover:border-primary-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed group shadow-sm hover:shadow-md"
            >
                <span className="material-icons-outlined text-xl group-hover:translate-x-0.5 transition-transform">chevron_right</span>
            </motion.button>
        </div>
    );
};

export default Pagination;
