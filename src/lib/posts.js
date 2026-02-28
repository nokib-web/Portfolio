/**
 * Blog post registry — the single source of truth for all MDX posts.
 * Add a new entry here every time you create a new .mdx file in src/content/blog/.
 */

export const posts = [
    {
        slug: 'react-hooks',
        title: 'Understanding React Hooks',
        date: '2026-02-20',
        description: 'A deep dive into useState, useEffect, useRef, and custom hooks — explained simply for developers making the leap from class components.',
        tags: ['Development', 'React'],
        readTime: 6,
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=2070',
    },
    {
        slug: 'javascript-event-loop',
        title: 'The JavaScript Event Loop Demystified',
        date: '2026-02-15',
        description: 'Visualising how the call stack, microtask queue, and macrotask queue interact — and why it matters for writing performant async code.',
        tags: ['Development', 'JavaScript'],
        readTime: 8,
        coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2070',
    },
    {
        slug: 'my-dev-workflow',
        title: 'My Daily Developer Workflow',
        date: '2026-02-10',
        description: 'The tools, habits, and rituals that keep me productive as a full-stack developer — from terminal shortcuts to focus techniques.',
        tags: ['Dailylife'],
        readTime: 4,
        coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072',
    },
    {
        slug: 'git-branching-strategies',
        title: 'Git Branching Strategies That Actually Work',
        date: '2026-02-22',
        description: 'A practical walkthrough of trunk-based development, Gitflow, and feature flags — and how to choose the right strategy for your team size.',
        tags: ['Development'],
        readTime: 7,
        coverImage: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&q=80&w=2076',
    },
    {
        slug: 'css-architecture',
        title: "CSS That Doesn't Haunt You at 2AM",
        date: '2026-02-18',
        description: 'Practical CSS architecture patterns — BEM, CSS custom properties, and component scoping — that prevent the cascade from becoming a war zone.',
        tags: ['Development'],
        readTime: 6,
        coverImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=2070',
    },
    {
        slug: 'big-o-for-humans',
        title: "Algorithms Aren't Scary: Big O for Humans",
        date: '2026-02-05',
        description: "A no-nonsense explanation of time complexity with real code examples — written for developers who hated math class but love shipping fast software.",
        tags: ['Development'],
        readTime: 9,
        coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=2070',
    },
    {
        slug: 'database-index-bangla',
        title: 'ডেটাবেজ ইন্ডেক্স: কেন তোমার কোয়েরি এত ধীর?',
        date: '2026-02-08',
        description: 'ডেটাবেজ ইন্ডেক্স কীভাবে কাজ করে এবং কোথায় লাগাতে হয় — রহিম সাহেবের লাইব্রেরির সাথে তুলনা করে বোঝানো একটি সহজ গাইড।',
        tags: ['Development', 'Bangla'],
        readTime: 8,
        coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=2041',
    },
    {
        slug: 'basic-javascript',
        title: 'Basic JavaScript',
        date: '2026-02-26',
        description: 'Mastering the fundamentals: Variables, Data Types, Functions, and the Scope Chain.',
        tags: ['Development', 'JavaScript'],
        readTime: 10,
        coverImage: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=2070',
    },
    {
        slug: 'basic-react',
        title: 'Basic Reactjs',
        date: '2026-02-26',
        description: 'Understanding Components, Props, and the Virtual DOM.',
        tags: ['Development', 'React'],
        readTime: 12,
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=2070',
    },
    {
        slug: 'basic-nextjs',
        title: 'Basic Nextjs',
        date: '2026-02-26',
        description: 'Going beyond React: SSR, SSG, and the App Router.',
        tags: ['Development', 'React'],
        readTime: 15,
        coverImage: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=2070',
    },
    {
        slug: 'basic-node-express',
        title: 'Basic Node.js and Express.js',
        date: '2026-02-26',
        description: 'Building your first backend: Middleware, Routing, and Architecture.',
        tags: ['Development', 'JavaScript'],
        readTime: 14,
        coverImage: 'https://images.unsplash.com/photo-1566837945700-30232252a1c0?auto=format&fit=crop&q=80&w=2070',
    },
    {
        slug: 'basic-mongodb',
        title: 'Basic MongoDB',
        date: '2026-02-26',
        description: 'NoSQL for beginners: Collections, Documents, and flexible Schema design.',
        tags: ['Development', 'JavaScript'],
        readTime: 11,
        coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=2070',
    },
    {
        slug: 'basic-postgresql-prisma',
        title: 'Basic PostgreSQL with Prisma',
        date: '2026-02-26',
        description: 'Strongly typed database management with PostgreSQL and Prisma.',
        tags: ['Development'],
        readTime: 13,
        coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=2070',
    },
    {
        slug: 'basic-state-management',
        title: 'Basic Redux, Context API, and Zustand',
        date: '2026-02-26',
        description: 'Choosing the right state management: Redux, Context, and Zustand.',
        tags: ['Development', 'React'],
        readTime: 16,
        coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=2070',
    },
    {
        slug: 'basic-python',
        title: 'Basic Python',
        date: '2026-02-26',
        description: 'The language of data and AI. Introduction to Python syntax and logic.',
        tags: ['Development'],
        readTime: 9,
        coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=2070',
    },
    {
        slug: 'basic-nestjs',
        title: 'Basic NestJS',
        date: '2026-02-26',
        description: 'Enterprise-grade Node.js architecture with TypeScript.',
        tags: ['Development', 'JavaScript'],
        readTime: 14,
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2070',
    },
    {
        slug: 'basic-redis',
        title: 'Basic Redis',
        date: '2026-02-26',
        description: 'The speed of light for your data. In-memory caching for performance.',
        tags: ['Development'],
        readTime: 10,
        coverImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=2070',
    },
    {
        slug: 'lailatun-nisfi-min-shaban',
        title: "লাইলাতুন নিসফি মিন শা'বান (শবে বরাত) - ক্ষমা ও তওবার রাত",
        date: '2026-02-28',
        description: 'শবে বরাতের ফযীলত এবং এই মহিমান্বিত রাতে আল্লাহর ক্ষমা লাভের উপায় নিয়ে একটি সংক্ষিপ্ত আলোচনা।',
        tags: ['Religion', 'Bangla', 'Islam'],
        readTime: 3,
        coverImage: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?auto=format&fit=crop&q=80&w=2070',
    },
]

/**
 * Returns all posts sorted newest → oldest.
 */
export function getAllPosts() {
    return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))
}

/**
 * Returns a single post's metadata by slug, or undefined if not found.
 */
export function getPostMeta(slug) {
    return posts.find((p) => p.slug === slug)
}

/**
 * Dynamically imports an MDX module by slug.
 */
export async function getPostComponent(slug) {
    const modules = import.meta.glob('../content/blog/*.mdx')
    const key = `../content/blog/${slug}.mdx`
    if (!modules[key]) return null
    const mod = await modules[key]()
    return mod.default
}
