const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Project = require('./models/Project');
const Blog = require('./models/Blog');
const Persona = require('./models/Persona');
const Stat = require('./models/Stat');
const fs = require('fs');
const path = require('path');

dotenv.config();

const projects = [
    {
        title: "Portfolio Website",
        description: "A responsive and interactive personal portfolio website built with modern web technologies. Features a clean design, dark mode support, and smooth user experience.",
        tech: ["React", "Tailwind CSS", "Vite"],
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        githubLink: "https://github.com/nokib-web/portfolio",
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
        githubLink: "https://github.com/nokib-web/StyleDecor-Client",
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
        githubLink: "https://github.com/nokib-web/NexCart",
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
        githubLink: "https://github.com/nokib-web/StudyMate-Client",
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
        githubLink: "https://github.com/nokib-web/WarmPaws",
        liveLink: "https://warm-paws-zeta.vercel.app/",
        keyPoints: [
            "Seamless Pet Adoption Workflow",
            "Dynamic Search & Filtering System",
            "Secure Authentication via Firebase",
            "Responsive Design for All Devices"
        ]
    },
    {
        title: "SimpleEarn",
        description: "A comprehensive micro-tasking and earning platform connecting workers, buyers, and admins. Features a robust coin-based economy, secure payments, and real-time notifications.",
        tech: ["React", "Node.js", "MongoDB", "Express", "Firebase", "Stripe", "Tailwind CSS"],
        image: "/simple-earn.png",
        githubLink: "https://github.com/nokib-web/SimpleEarn-Client",
        liveLink: "https://simpleearn-2387f.web.app/",
        keyPoints: [
            "Multi-role system (Worker, Buyer, Admin) with specialized dashboards",
            "Secure payment integration via Stripe for coin purchases",
            "Real-time notification system and withdrawal management",
            "Gamified coin-based economy for task execution and distribution"
        ]
    },
    {
        title: "RecipeFinder",
        description: "A premium culinary assistant powered by Spoonacular API, offering access to 360,000+ recipes with smart filtering, meal planning, and interactive cooking tools.",
        tech: ["Next.js 15", "TypeScript", "Tailwind CSS", "Framer Motion", "Spoonacular API"],
        image: "https://i.ibb.co.com/DHr3MFB2/abdelrahman-sarayreh-RIel-TXL5w-Vk-unsplash.jpg",
        githubLink: "https://github.com/nokib-web/RecipeFinder",
        liveLink: "https://recipe-finder-1.vercel.app/",
        keyPoints: [
            "Smart ingredient-based search ('In your Fridge' feature)",
            "Interactive cooking mode with built-in timers and progress tracking",
            "Comprehensive weekly meal planner and smart shopping list",
            "Detailed nutritional analysis and achievement system for cooks"
        ]
    },
    {
        title: "PosBuzz",
        description: "An enterprise-grade Point of Sale (POS) system designed for efficient inventory management, real-time sales tracking, and seamless checkout experiences.",
        tech: ["NestJS", "PostgreSQL", "Prisma", "React", "TypeScript", "Ant Design", "TanStack Query"],
        image: "/pos-buzz.png",
        githubLink: "https://github.com/nokib-web/PosBuzz",
        liveLink: "https://pos-buzz-frontend-beta.vercel.app/login",
        keyPoints: [
            "Fast checkout system with barcode scanning integration",
            "Real-time inventory tracking with low stock alerts and supplier management",
            "Role-Based Access Control (RBAC) for Admins and Cashiers",
            "Interactive analytics dashboard with visualized sales trends via Recharts"
        ]
    },
    {
        title: "Custom Spark",
        description: "A premium e-commerce landing page and product catalog featuring glassmorphic design, robust product management, and optimized SEO.",
        tech: ["Next.js 15", "NextAuth.js", "Tailwind CSS v4", "Prisma", "PostgreSQL", "Zod"],
        image: "/custom-spark.png",
        githubLink: "https://github.com/nokib-web/CustomSpark",
        liveLink: "https://custom-spark.vercel.app/",
        keyPoints: [
            "Stunning glassmorphic UI with fluid animations using Framer Motion",
            "Secure authentication via Google OAuth and Credentials",
            "Dynamic product catalog with real-time search, filtering, and sorting",
            "SEO optimized with dynamic metadata and OpenGraph support"
        ]
    },
    {
        title: "Care.IO",
        description: "A comprehensive healthcare service platform for booking caregivers, elderly care, and nurse services with automated invoicing.",
        tech: ["Next.js 15", "MongoDB", "Tailwind CSS", "DaisyUI", "NextAuth.js", "Nodemailer"],
        image: "/care-io.png",
        githubLink: "https://github.com/nokib-web/Care.IO",
        liveLink: "https://care-io-two.vercel.app/",
        keyPoints: [
            "Location-based service booking with dynamic cost calculation",
            "Multi-level admin and user dashboards for booking management",
            "Automatic email invoicing and real-time status updates via Nodemailer",
            "Responsive, accessible design optimized for clinical and home care use"
        ]
    },
    {
        title: "Ramadan Countdown 2026",
        description: "A spiritual companion app featuring a real-time countdown, Hijri calendar, and rotating inspirational content with a focus on premium aesthetics.",
        tech: ["Next.js 16.1", "React 19", "Tailwind CSS 4", "Framer Motion", "next-themes"],
        image: "/ramadan-countdown.png",
        githubLink: "https://github.com/nokib-web/RamadanCountDown",
        liveLink: "https://ramadan-count-down-wheat.vercel.app/",
        keyPoints: [
            "Dynamic countdown timer with automatic date calculation for Ramadan",
            "Rotating Quranic verses and Hadiths with beautiful Arabic typography",
            "PWA-ready with system-aware dark mode and interactive progress bars",
            "Integrated social sharing and educational content about Islamic practices"
        ]
    },
    {
        title: "Momentum",
        description: "An enterprise-grade Project Management system with role-based access control, JWT authentication, and advanced project tracking. Built with a focus on UI/UX excellence and optimized server-state management.",
        tech: ["React", "TypeScript", "Tailwind CSS", "TanStack Query", "Axios", "Framer Motion"],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        githubLink: "https://github.com/nokib-web/momentum-frontend",
        liveLink: "https://momentum-frontend-two.vercel.app/",
        keyPoints: [
            "Secure JWT Authentication with Role-Based Access Control (RBAC)",
            "Innovative Invite-only system for controlled user onboarding",
            "Advanced Project Dashboard with real-time statistics",
            "Optimized with TanStack Query for caching and efficient data fetching"
        ]
    }
];

const loadBlogs = () => {
    const mdxDir = path.join(__dirname, '../src/content/blog');
    const mdxFiles = fs.readdirSync(mdxDir).filter(file => file.endsWith('.mdx'));

    return mdxFiles.map(file => {
        const filePath = path.join(mdxDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Simple frontmatter parser
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = fileContent.match(frontmatterRegex);
        
        let frontmatter = {};
        let content = fileContent;
        
        if (match) {
            const fmString = match[1];
            content = match[2];
            
            fmString.split('\n').forEach(line => {
                const colonIndex = line.indexOf(':');
                if (colonIndex > -1) {
                    const key = line.slice(0, colonIndex).trim();
                    let value = line.slice(colonIndex + 1).trim();
                    
                    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.slice(1, -1);
                    }
                    
                    if (value.startsWith('[') && value.endsWith(']')) {
                        value = value.slice(1, -1).split(',').map(s => {
                            let trimmed = s.trim();
                            if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
                                return trimmed.slice(1, -1);
                            }
                            return trimmed;
                        });
                    }
                    
                    frontmatter[key] = value;
                }
            });
        }

        return {
            title: frontmatter.title || file.replace('.mdx', ''),
            slug: file.replace('.mdx', ''),
            excerpt: frontmatter.description || '',
            content: content,
            tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
            readTime: frontmatter.readTime ? `${frontmatter.readTime} min read` : '5 min read',
            coverImage: frontmatter.coverImage || '',
            published: true
        };
    });
};

const statsData = [
    { label: "Years Experience", value: 1 },
    { label: "Projects Completed", value: 20 },
    { label: "Open Source Contribs", value: 10 },
    { label: "Commits this Year", value: 560 },
];

const loadPersonas = () => {
    const devPath = path.join(__dirname, '../src/content/personas/developer.json');
    const writerPath = path.join(__dirname, '../src/content/personas/writer.json');
    const friendPath = path.join(__dirname, '../src/content/personas/friend.json');
    
    const developer = JSON.parse(fs.readFileSync(devPath, 'utf8'));
    const writer = JSON.parse(fs.readFileSync(writerPath, 'utf8'));
    const friend = JSON.parse(fs.readFileSync(friendPath, 'utf8'));
    
    const philosopher = {
        id: 'philosopher',
        title: 'Deep Thinker / Philosopher',
        slug: 'philosopher',
        route: '/philosopher',
        tagline: "Asking the big questions about life and tech.",
        description: "Reflections on logic, consciousness, systems, and ethics in the digital age.",
        theme: {
            accentColor: "text-purple-400",
            bgColor: "bg-neutral-950",
            textColor: "text-neutral-200",
            fontFamily: "font-serif",
            gradient: "from-purple-600 to-indigo-500"
        },
        about: "I believe that technology is an extension of human intention. As we build increasingly advanced systems, understanding the philosophical frameworks under which they operate is paramount.",
        projects: [
            {
                title: "A Treatise on Artificial Agency",
                description: "An essay on whether neural network architectures can form intentional mental states.",
                tech: ["Philosophy", "Cognitive Science"],
                image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            }
        ],
        skills: [
            {
                category: "Interests",
                items: [
                    { name: "Epistemology", level: "Theory of knowledge" },
                    { name: "Ethics of AI", level: "Value alignment" },
                    { name: "Systems Thinking", level: "Complexity theory" }
                ]
            }
        ]
    };
    
    const personasList = [developer, writer, friend, philosopher];
    return personasList.map(p => ({
        ...p,
        personaId: p.id
    }));
};

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');

        await Project.deleteMany();
        await Blog.deleteMany();
        await Persona.deleteMany();
        await Stat.deleteMany();
        
        console.log('Old Data Cleared');

        const personas = loadPersonas();
        
        // Extract writer essays into blogs
        const writer = personas.find(p => p.personaId === 'writer');
        let writerBlogs = [];
        if (writer && writer.essays) {
            writerBlogs = writer.essays.map(essay => ({
                title: essay.title,
                slug: essay.slug || essay.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                excerpt: essay.excerpt,
                content: 'Content coming soon...',
                tags: essay.tags || [],
                readTime: essay.readTime || '5 min read',
                published: true,
                personaId: 'writer'
            }));
            // Remove essays from persona object so it doesn't stay duplicated in the DB
            delete writer.essays;
        }

        // Extract philosopher projects
        const philosopher = personas.find(p => p.personaId === 'philosopher');
        let philoProjects = [];
        if (philosopher && philosopher.projects) {
            philoProjects = philosopher.projects.map(proj => ({
                title: proj.title,
                description: proj.description,
                techStack: proj.tech ? proj.tech.join(', ') : '',
                image: proj.image,
                personaId: 'philosopher'
            }));
            // Remove projects from persona object
            delete philosopher.projects;
        }

        await Project.insertMany([...projects, ...philoProjects]);
        
        // Only seed developer blogs from MDX files.
        // Writer, Friend, Philosopher blogs are intentionally left empty
        // — add them from the Admin Dashboard.
        const devBlogs = loadBlogs();
        await Blog.insertMany(devBlogs);
        
        await Persona.insertMany(personas);

        await Stat.insertMany(statsData);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
