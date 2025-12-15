import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp } from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import Swal from "sweetalert2";

const Contact = () => {



    const handleSubmit = (e) => {
        e.preventDefault();

        // get form data
        const form = e.target.closest('form');
        const name = form.name.value;
        const email = form.email.value;
        const message = form.message.value;

        // Basic validation
        if (!name || !email || !message) {
            Swal.fire({
                icon: "warning",
                title: "Missing Fields",
                text: "Please fill out all required fields."
            });
            return;
        }

        // Construct mailto link
        const subject = `Portfolio Contact from ${name}`;
        const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
        const mailtoLink = `mailto:nokibnokib1@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

        // Open email client
        window.location.href = mailtoLink;

        // Show success message
        Swal.fire({
            icon: "success",
            title: "Opening Email Client...",
            text: "Please click send in your email app to complete the message.",
            confirmButtonColor: "#3085d6"
        });

        form.reset();
    };

    return (
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-12"
            >
                <div className="flex items-center gap-3 mb-4">
                    <span className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                        <span className="material-icons-outlined">email</span>
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 dark:text-white">
                        Get in Touch
                    </h2>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-2xl">
                    I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 font-display">Contact Information</h3>
                        <div className="space-y-6">
                            <a
                                href="mailto:nokibnokib1@gmail.com"
                                className="flex items-center space-x-4 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
                            >
                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors">
                                    <MdEmail className="text-2xl text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                                </div>
                                <span className="font-medium">nokibnokib1@gmail.com</span>
                            </a>

                            <a
                                href="https://wa.me/8801910229119"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-4 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
                            >
                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors">
                                    <FaWhatsapp className="text-2xl text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                                </div>
                                <span className="font-medium">WhatsApp Me</span>
                            </a>

                            <a
                                href="https://www.google.com/maps/place/Dhaka,+Bangladesh"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-4 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
                            >
                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors">
                                    <MdLocationOn className="text-2xl text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                                </div>
                                <span className="font-medium">Dhaka, Bangladesh</span>
                            </a>
                        </div>
                    </div>
                </div>

                <form className="bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                        <input type="text" id="name" className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary-500 focus:ring-primary-500 transition-all p-3" placeholder="Your Name" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                        <input type="email" id="email" className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary-500 focus:ring-primary-500 transition-all p-3" placeholder="your@email.com" />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                        <textarea id="message" rows="4" className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary-500 focus:ring-primary-500 transition-all p-3" placeholder="How can I help you?"></textarea>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ scale: 1.02 }}
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full bg-primary-600 text-white py-3 px-6 rounded-xl hover:bg-primary-700 transition-all font-semibold shadow-lg shadow-primary-600/20"
                    >
                        Send Message
                    </motion.button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
