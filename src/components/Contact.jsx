import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp } from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import Swal from "sweetalert2";

const Contact = () => {



    const handleSubmit = (e) => {
        e.preventDefault();

        // Example: get form data
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;

        // Basic validation
        if (!name || !email) {
            Swal.fire({
                icon: "warning",
                title: "Missing Fields",
                text: "Please fill out all required fields."
            });
            return;
        }

        // Simulate successful form submission
        Swal.fire({
            icon: "success",
            title: "Submitted Successfully!",
            text: "Your form has been submitted.",
            confirmButtonColor: "#3085d6"
        });

        form.reset(); // optional
    };

    return (
        <div className="max-w-4xl mx-auto">
            <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold text-gray-900 dark:text-white mb-8"
            >
                Contact
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                        I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                    </p>
                    <div className="space-y-4">
                        <a
                            href="mailto:nokibnokib1@gmail.com"
                            className="flex items-center space-x-3 text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
                        >
                            <MdEmail className="text-2xl text-primary" />
                            <span>nokibnokib1@gmail.com</span>
                        </a>

                        <a
                            href="https://wa.me/8801910229119"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
                        >
                            <FaWhatsapp className="text-2xl text-primary" />
                            <span>WhatsApp Me</span>
                        </a>

                        <a
                            href="https://www.google.com/maps/place/Dhaka,+Bangladesh"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
                        >
                            <MdLocationOn className="text-2xl text-primary" />
                            <span>Dhaka, Bangladesh</span>
                        </a>
                    </div>

                </div>
                <form className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                        <input type="text" id="name" className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-primary focus:ring-primary" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input type="email" id="email" className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-primary focus:ring-primary" />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                        <textarea id="message" rows="4" className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-primary focus:ring-primary"></textarea>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(139, 92, 246, 0.5)" }}
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors font-medium"
                    >
                        Send Message
                    </motion.button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
