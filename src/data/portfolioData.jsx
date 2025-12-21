import { FaReact, FaHtml5, FaCss3Alt, FaJs, FaPython, FaGitAlt, FaDocker, FaAws, FaFigma } from 'react-icons/fa';
import { SiNextdotjs, SiTailwindcss, SiTypescript, SiNodedotjs, SiExpress, SiMongodb, SiPostgresql } from 'react-icons/si';

export const projects = [
    {
        title: "Portfolio Website",
        description: "A responsive and interactive personal portfolio website built with modern web technologies. Features a clean design, dark mode support, and smooth user experience.",
        tech: ["React", "Tailwind CSS", "Vite"],
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        codeLink: "https://github.com/nokib-web/portfolio",
        liveLink: "#",
        keyPoints: [
            "Single Page Application (SPA) Architecture",
            "Custom Glassmorphism Design System",
            "Fully Responsive & Mobile-First Layout",
            "Interactive Animations with Framer Motion"
        ]
    },
    {
        title: "StyleDecor",
        description: "StyleDecor is a modern, full-stack web application designed to streamline the connection between clients and professional decorators. It offers a seamless booking experience with integrated payments, real-time status tracking, and role-based dashboards.",
        tech: ["React", "Next.js", "Tailwind CSS", "TanStack Query", "Firebase", "Stripe", "Framer Motion", "Recharts"],
        image: "/style-decor.png",
        codeLink: "https://github.com/nokib-web/StyleDecor-Client",
        liveLink: "https://style-decor-client-two.vercel.app/",
        keyPoints: [
            "Multi-role dashboards for Users, Decorators, and Admins",
            "Secure Stripe payment integration with coupon system",
            "Real-time booking tracking and project management",
            "Interactive analytics dashboard with data visualization"
        ]
    },
    {
        title: "NexCart",
        description: "NexCart is a full-featured e-commerce platform developed with Next.js, Tailwind CSS, and Stripe integration. The application includes product listing, category filtering, dynamic routing, real-time cart management, and a responsive, mobile-friendly UI. It is optimized for SEO, fast rendering, and provides a smooth, secure shopping experience from product discovery to checkout.",
        tech: ["Next.js", "React", "MongoDB", "JavaScript"],
        image: "https://i.ibb.co.com/5xrL57tz/logo.png",
        codeLink: "https://github.com/nokib-web/NexCart",
        liveLink: "https://nexcart-mu.vercel.app/",
        keyPoints: [
            "Secure Payment Integration with SSLcommerz",
            "Real-time Cart & Wishlist Management",
            "Comprehensive Admin Dashboard",
            "Server-Side Rendering (SSR) for SEO"
        ]
    },
    {
        title: "StudyMate",
        description: "StudyMate is a web-based study companion that helps learners organize their studies, manage tasks, and focus on what matters most. With a clean, responsive UI and intuitive features, StudyMate aims to simplify and enhance the study routine for students and lifelong learners.",
        tech: ["React.js", "JavaScript", "MongoDB", "NodeJs"],
        image: "https://i.ibb.co.com/R4V6ZnY3/photo-1491841550275-ad7854e35ca6.jpg",
        codeLink: "https://github.com/nokib-web/StudyMate-Client",
        liveLink: "https://studymate-b37fa.web.app",
        keyPoints: [
            "Drag-and-Drop Task Management",
            "Real-time Community Chat Features",
            "User & Admin Role-Based Access",
            "Personalized Study Analytics Dashboard"
        ]
    },
    {
        title: "WarmPaws",
        description: "WarmPaws is a responsive, user-friendly web application aimed at connecting pet lovers with animal shelters and pet adoption opportunities. Built with modern web technologies and deployed on Vercel, Warm-Paws delivers a seamless experience for discovering, browsing, and engaging with pets up for adoption.",
        tech: ["React", "Firebase", "NodeJS", "Redux"],
        image: "https://i.ibb.co.com/bg2HBHsn/7.jpg",
        codeLink: "https://github.com/nokib-web/WarmPaws",
        liveLink: "https://warm-paws-zeta.vercel.app/",
        keyPoints: [
            "Seamless Pet Adoption Workflow",
            "Dynamic Search & Filtering System",
            "Secure Authentication via Firebase",
            "Responsive Design for All Devices"
        ]
    }
];

export const skills = [
    {
        category: "Frontend",
        items: [
            { name: "React", icon: <FaReact /> },
            { name: "Next.js", icon: <SiNextdotjs /> },
            { name: "Tailwind CSS", icon: <SiTailwindcss /> },
            { name: "TypeScript", icon: <SiTypescript /> },
            { name: "HTML5", icon: <FaHtml5 /> },
            { name: "CSS3", icon: <FaCss3Alt /> },
            { name: "JavaScript", icon: <FaJs /> },
        ]
    },
    {
        category: "Backend",
        items: [
            { name: "Node.js", icon: <SiNodedotjs /> },
            { name: "Express", icon: <SiExpress /> },
            { name: "MongoDB", icon: <SiMongodb /> },
            { name: "PostgreSQL", icon: <SiPostgresql /> },
            { name: "Python", icon: <FaPython /> },
        ]
    },
    {
        category: "Tools & DevOps",
        items: [
            { name: "Git", icon: <FaGitAlt /> },
            { name: "Docker", icon: <FaDocker /> },
            { name: "AWS", icon: <FaAws /> },
            { name: "VS Code", icon: null },
            { name: "Figma", icon: <FaFigma /> },
        ]
    }
];
