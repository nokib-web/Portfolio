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
        title: 'Deep Thinker',
        slug: 'philosopher',
        route: '/philosopher',
        tagline: "Contemplation across Cosmology, Islamic Epistemology, Human Psychology, and Civilizational Economics.",
        description: "A multidisciplinary exploration of Quranic reflection (Tadabbur), the intellectual history of Islamic thought (Ibn Khaldun, Al-Ghazali, Ibn Rushd), cosmological physics, cognitive psychology (Nafs & Aql), and ethical economic systems.",
        theme: {
            accentColor: "text-[#FF5E7E]",
            bgColor: "bg-[#14131F]",
            textColor: "text-[#FAF4E8]",
            fontFamily: "font-fraunces",
            gradient: "from-[#FF5E7E] via-[#FFA94D] to-[#FFD166]"
        },
        heroImage: "/images/philosopher/retro_cosmic_tadabbur.jpg",
        horizonImage: "/images/philosopher/retro_cosmic_horizon.jpg",
        thinkerImage: "/images/philosopher/retro_nature_thinker.jpg",
        meditationImage: "/images/philosopher/retro_cosmic_meditation.jpg",
        about: "True intellectual depth bridges the grand architecture of the cosmos with the internal landscape of human consciousness. Guided by Quranic reflection (Tadabbur), civilizational dynamics (Ibn Khaldun), epistemological certainty (Al-Ghazali), and the ethical stewardship of economic power.",
        epigraph: {
            quote: "We will show them Our signs in the horizons and within themselves until it becomes clear to them that it is the Truth.",
            attribution: "Surah Fussilat (41:53) · The Cosmos & The Soul"
        },
        quote: {
            text: "Civilizations rise not merely through physical abundance, but through moral cohesion (Asabiyyah), epistemic sincerity, and alignment with the cosmic order.",
            attribution: "Ibn Khaldun · The Muqaddimah"
        },
        chapters: [
            {
                id: "cosmology",
                chapterNum: "01",
                title: "Cosmology & The Expanding Universe",
                tagline: "Astrophysics, Fine-Tuning & Cosmic Orbits",
                arabic: "Ayat fil-Afaq",
                verse: "“And the heaven We constructed with strength, and indeed, We are its expander.” — Surah Adh-Dhariyat (51:47)",
                summary: "The universe is not a static or accidental container, but a mathematically calibrated cosmos undergoing dynamic expansion. From gravitational fine-tuning to the choreography of celestial orbits (Falak), cosmological physics converges with timeless metaphysical reflection.",
                points: [
                    { title: "Metric Expansion of Space", text: "Cosmic metric expansion confirms that space itself is stretching across deep time." },
                    { title: "Low Entropy Initial Conditions", text: "The universe began in an extraordinarily low-entropy state, demanding deep inquiry into prime cosmological order." },
                    { title: "Gravitational Equilibrium (Falak)", text: "Planetary bodies swim in mathematically precise orbital planes (Surah Al-Anbiya 21:33)." }
                ],
                contemplation: "When you observe the night sky, do you see cold emptiness or an unfolding cosmic order inviting consciousness to recognize its Creator?"
            },
            {
                id: "epistemology",
                chapterNum: "02",
                title: "Islamic History & Epistemology",
                tagline: "Civilizational Cycles, Reason & Spiritual Certainty",
                arabic: "Tarikh al-Fikr wal-Umran",
                verse: "“Have they not traveled through the earth and observed the outcome of those before them?” — Surah Ar-Rum (30:9)",
                summary: "The intellectual tradition of Islamic thought established holistic frameworks harmonizing empirical observation, rigorous deduction, and transcendent revelation.",
                points: [
                    { title: "Ibn Khaldun’s Science of Civilizations", text: "Social solidarity (Asabiyyah) births empires, which decline as luxury and injustice erode cohesion." },
                    { title: "Al-Ghazali’s Epistemic Certainty", text: "Absolute certainty (Yaqeen) requires intuitive spiritual illumination of the heart (Qalb)." },
                    { title: "Ibn Rushd & The Harmony of Truth", text: "Rational demonstration and divine revelation are complementary paths to the singular Truth." }
                ],
                contemplation: "How can modern technological civilizations sustain moral purpose and social cohesion as material luxury increases?"
            },
            {
                id: "psychology",
                chapterNum: "03",
                title: "Human Psychology & The Soul",
                tagline: "The Tripartite Psyche, Cognitive Biases & Moral Will",
                arabic: "An-Nafs wal-Aql",
                verse: "“And by the soul and He who proportioned it, and inspired it with discernment of its wickedness and its righteousness.” — Surah Ash-Shams (91:7-8)",
                summary: "Classical thinkers mapped the human psyche—delineating the dynamic struggle between impulsive desires (Nafs), rational intellect (Aql), and the moral heart (Qalb).",
                points: [
                    { title: "The Three Stages of the Soul", text: "Al-Nafs al-Ammarah (ego), Al-Nafs al-Lawwamah (conscience), and Al-Nafs al-Mutma’innah (tranquil soul)." },
                    { title: "Cognitive Biases & Self-Purification", text: "Addressing cognitive distortions through Tazkiyah (intentional self-purification)." },
                    { title: "Qualia vs Mechanical Computation", text: "Subjective empathy and moral choice remain unique to living conscious souls." }
                ],
                contemplation: "Which dimension of your inner self directs your daily focus: impulsive distraction or tranquil higher intention?"
            },
            {
                id: "economics",
                chapterNum: "04",
                title: "Civilizational Economics & Justice",
                tagline: "Wealth Circulation, Labor Value & Ethical Stewardship",
                arabic: "Al-Iqtisad wal-Adalah",
                verse: "“So that wealth does not merely circulate among the rich among you.” — Surah Al-Hashr (59:7)",
                summary: "Real prosperity requires productive circulation of real assets, labor dignity, and resistance to predatory debt exploitation.",
                points: [
                    { title: "Productive Wealth Circulation", text: "Mandating capital flow into tangible production while prohibiting usury (Riba) and hoarding (Kanz)." },
                    { title: "Ibn Khaldun’s Labor Theory", text: "Human labor is the generator of value; excessive taxation destroys civilizational production." },
                    { title: "Automation & Ethical Distribution", text: "Transitioning from artificial scarcity to distributing abundance with human dignity." }
                ],
                contemplation: "Can economic systems be successful if they concentrate power in monopolies while degrading communal trust?"
            },
            {
                id: "ecosystems",
                chapterNum: "05",
                title: "Living Ecosystems & Cosmic Balance",
                tagline: "The Universal Balance (Mizan) & Earth Stewardship",
                arabic: "Al-Mizan fil-Khalq",
                verse: "“And the heaven He raised and imposed the balance (Mizan), that you not transgress within the balance.” — Surah Ar-Rahman (55:7-8)",
                summary: "Nature is an interconnected sanctuary of signs. Understanding ecological feedback loops and human stewardship (Khilafah).",
                points: [
                    { title: "The Cosmic Balance (Al-Mizan)", text: "Every ecosystem functions in homeostatic balance that human activity must respect." },
                    { title: "Symbiotic Intelligence", text: "Forest mycorrhizal networks demonstrate that reciprocal mutualism is nature’s enduring architecture." },
                    { title: "Tafakkur in Pristine Nature", text: "Solitary contemplation in nature re-centers the mind in humility and alignment." }
                ],
                contemplation: "How can modern computing operate in harmony with the sacred equilibrium of the natural world?"
            }
        ],
        projects: [
            {
                title: "A Treatise on Artificial Agency and Subjective Meaning",
                description: "An epistemological inquiry into whether deep transformer models can form intentional semantic states or remain purely syntactic symbol manipulators.",
                tech: ["Philosophy of Mind", "Epistemology", "AI Ethics"],
                image: "/images/philosopher/retro_cosmic_tadabbur.jpg"
            },
            {
                title: "Civilizational Dynamics & Economic Cycles in Digital Societies",
                description: "Applying Ibn Khaldun's Asabiyyah and wealth circulation models to modern decentralized networks and algorithmic governance.",
                tech: ["Ibn Khaldun", "Economics", "Complexity Science"],
                image: "/images/philosopher/retro_nature_thinker.jpg"
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
