import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getAllPosts } from '../../lib/posts'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Magnetic from '../Common/Magnetic'

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = ['All', 'Development', 'Dailylife', 'Religion']

const allPosts = getAllPosts()

export default function Blog() {
    const [active, setActive] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')
    const containerRef = useRef(null);

    const filtered = allPosts.filter(p => {
        const matchesCategory = active === 'All' || p.tags?.some(t => t.toLowerCase() === active.toLowerCase());
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    useGSAP(() => {
        ScrollTrigger.refresh();

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });

        tl.from(".blog-header-animate", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        })
            .from(".category-nav-animate", {
                y: 20,
                opacity: 0,
                stagger: 0.1,
                duration: 0.6,
                ease: "power3.out"
            }, "-=0.4");

        if (filtered.length > 0) {
            gsap.fromTo(".blog-post-card",
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".posts-grid",
                        start: "top 85%",
                        once: true
                    },
                    delay: 0.1
                }
            );
        }
    }, [filtered.length, active]);

    return (
        <div ref={containerRef} className="blog-section relative py-12 px-4 sm:px-8 lg:px-12 min-h-screen">
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="blog-header text-center mb-16 space-y-4">
                    <div className="blog-header-animate inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-slate-100 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/5 text-primary-500 dark:text-primary-400 text-[10px] font-black uppercase tracking-[0.4em] shadow-xl">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span>
                        Publications
                    </div>
                    <h1 className="blog-header-animate text-5xl md:text-7xl lg:text-8xl font-black font-display text-slate-900 dark:text-white leading-[0.9] tracking-tighter">
                        The <span className="bg-gradient-to-br from-primary-400 via-purple-500 to-primary-600 bg-clip-text text-transparent">Digital</span><br />
                        <span className="italic font-light">Archive.</span>
                    </h1>
                    <p className="blog-header-animate text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
                        Regular explorations in software engineering, development, productivity, and life's curiosities.
                    </p>
                </div>

                {/* Search and Category Navigation */}
                <div className="flex flex-col items-center gap-8 mb-16">
                    {/* Search Bar */}
                    <div className="w-full max-w-md relative group px-4">
                        <div className="absolute inset-y-0 left-7 flex items-center pointer-events-none">
                            <span className="material-icons-outlined text-slate-400 group-focus-within:text-primary-500 transition-colors">search</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by title or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/50 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm group-hover:shadow-md"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-7 flex items-center text-slate-400 hover:text-primary-500 transition-colors"
                            >
                                <span className="material-icons-outlined text-sm font-bold">close</span>
                            </button>
                        )}
                    </div>

                    <div className="category-nav flex gap-3 sm:gap-4 justify-center flex-wrap px-4">
                        {CATEGORIES.map(cat => (
                            <div key={cat} className="category-nav-animate">
                                <Magnetic strength={0.2}>
                                    <button
                                        onClick={() => setActive(cat)}
                                        className={`group relative px-6 sm:px-10 py-3.5 rounded-2xl sm:rounded-3xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 border overflow-hidden
                        ${active === cat
                                                ? 'bg-slate-900 text-white border-primary-500/50 shadow-xl'
                                                : 'bg-white/50 dark:bg-slate-900/40 backdrop-blur-md border-slate-200 dark:border-white/5 text-slate-600 hover:text-white'
                                            }`}
                                    >
                                        <span className="relative z-10">{cat}</span>
                                        {active !== cat && (
                                            <div className="absolute inset-0 bg-primary-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                        )}
                                    </button>
                                </Magnetic>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Posts Grid */}
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 bg-slate-900/5 backdrop-blur-3xl rounded-xl border border-dashed border-slate-200 dark:border-white/10">
                        <span className="material-icons-outlined text-xl text-slate-400 mb-2">inventory_2</span>
                        <p className="text-slate-500 text-xs font-medium tracking-tight">The archive is empty.</p>
                        <button
                            onClick={() => setActive('All')}
                            className="mt-2 text-primary-500 text-[10px] font-bold hover:underline"
                        >
                            View all
                        </button>
                    </div>
                ) : (
                    <div className="posts-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map(post => (
                            <Link
                                to={`/blog/${post.slug}`}
                                key={post.slug}
                                className="blog-post-card group relative flex flex-col h-[320px] bg-white dark:bg-[#020617] rounded-[1.5rem] overflow-hidden border border-slate-200 dark:border-white/5 hover:border-primary-500/30 transition-all duration-500 shadow-sm hover:shadow-2xl dark:shadow-lg"
                            >
                                {/* Subtle Glow Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/0 via-purple-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:via-purple-500/5 group-hover:to-primary-500/5 transition-all duration-700" />

                                <div className="relative h-32 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-[#020617] z-10" />
                                    {post.coverImage ? (
                                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-700 dark:opacity-80 dark:group-hover:opacity-100" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-primary-500/10 via-purple-500/10 to-slate-100 dark:from-primary-900/30 dark:via-purple-900/20 dark:to-slate-900 flex items-center justify-center">
                                            <span className="material-icons-outlined text-primary-400 dark:text-primary-700 text-4xl">auto_awesome</span>
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-white/90 dark:bg-black/60 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-lg text-[8px] font-black text-slate-900 dark:text-white uppercase tracking-widest shadow-sm">
                                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                    </div>
                                </div>

                                <div className="relative p-5 pt-0 flex flex-col flex-1 z-20">
                                    <div className="flex gap-2.5 flex-wrap mb-3">
                                        {post.tags?.slice(0, 2).map(tag => (
                                            <span key={tag} className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest group-hover:text-primary-500 transition-colors">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-display leading-tight tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-all line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed line-clamp-2 font-medium group-hover:opacity-100 transition-opacity mb-4">
                                        {post.description}
                                    </p>
                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-icons-outlined text-[10px] text-primary-500">schedule</span>
                                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{post.readTime}m read</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center group-hover:bg-primary-600 group-hover:border-primary-500 transition-all duration-300">
                                            <span className="material-icons-outlined text-slate-600 dark:text-white text-[12px] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform font-bold">north_east</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
