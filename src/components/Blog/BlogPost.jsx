import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPostMeta, getPostComponent } from '../../lib/posts'
import Magnetic from '../Common/Magnetic'
import Subscribe from './Subscribe'

/* ── Share helpers ──────────────────────────────────────────────────── */
function ShareButtons({ title, url }) {
    const [copied, setCopied] = useState(false)

    const copyLink = useCallback(() => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }, [url])

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`

    return (
        <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mr-1 hidden sm:inline">Share</span>

            {/* Twitter / X */}
            <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-[#000] hover:border-[#000] dark:hover:bg-white dark:hover:border-white transition-all"
                title="Share on X (Twitter)"
            >
                <svg className="w-3.5 h-3.5 fill-slate-600 dark:fill-slate-300 group-hover:fill-white dark:group-hover:fill-black transition-colors" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.254 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            </a>

            {/* LinkedIn */}
            <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-[#0077b5] hover:border-[#0077b5] transition-all"
                title="Share on LinkedIn"
            >
                <svg className="w-3.5 h-3.5 fill-slate-600 dark:fill-slate-300 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            </a>

            {/* Copy Link */}
            <button
                onClick={copyLink}
                className={`group w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${copied
                    ? 'bg-green-500 border-green-500'
                    : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-primary-600 hover:border-primary-500'
                    }`}
                title={copied ? 'Copied!' : 'Copy link'}
            >
                <span className={`material-icons-outlined text-sm transition-colors ${copied ? 'text-white' : 'text-slate-600 dark:text-slate-300 group-hover:text-white'
                    }`}>
                    {copied ? 'check' : 'link'}
                </span>
            </button>
        </div>
    )
}

/* ── Main BlogPost component ────────────────────────────────────────── */
export default function BlogPost() {
    const { slug } = useParams()
    const [Content, setContent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [readProgress, setReadProgress] = useState(0)

    const post = getPostMeta(slug)
    const postUrl = typeof window !== 'undefined' ? window.location.href : ''

    /* Read progress bar */
    useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement
            const scrolled = el.scrollTop
            const total = el.scrollHeight - el.clientHeight
            setReadProgress(total > 0 ? (scrolled / total) * 100 : 0)
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
        setLoading(true)
        setContent(null)

        getPostComponent(slug).then(Component => {
            setContent(() => Component)
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [slug])

    if (loading) return (
        <div className="flex justify-center items-center min-h-[70vh]">
            <div className="flex flex-col items-center gap-6">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-4 border-primary-500/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-t-primary-500 rounded-full animate-spin" />
                    <div className="text-slate-400 font-display text-xl animate-pulse mt-32 tracking-widest font-bold uppercase text-center w-full">Rendering...</div>
                </div>
            </div>
        </div>
    )

    if (!post || !Content) return (
        <div className="flex flex-col justify-center items-center min-h-[70vh] gap-6">
            <span className="material-icons-outlined text-6xl text-slate-800 dark:text-slate-200">error_outline</span>
            <div className="text-slate-500 dark:text-slate-400 font-display text-2xl uppercase tracking-[0.2em] text-center">Post Not Found.</div>
            <Link to="/blog" className="px-10 py-4 bg-primary-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-transform">Back to Blog</Link>
        </div>
    )

    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
    })

    return (
        <div className="min-h-screen bg-white dark:bg-[#0A0F1E] transition-colors duration-300">

            {/* ── Reading Progress Bar ── */}
            <div
                className="fixed top-16 left-0 z-50 h-[3px] bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-100"
                style={{ width: `${readProgress}%` }}
            />

            {/* ── Back Navigation ── */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-0">
                <Magnetic strength={0.2}>
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 group text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all font-bold uppercase tracking-[0.2em] text-[10px]"
                    >
                        <span className="material-icons-outlined text-sm group-hover:-translate-x-1 transition-transform">west</span>
                        All Posts
                    </Link>
                </Magnetic>
            </div>

            <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

                {/* ── Tags ── */}
                <div className="flex gap-2.5 flex-wrap mb-6">
                    {post.tags?.map(tag => (
                        <span key={tag} className="px-3.5 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* ── Title ── */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.15] tracking-tighter font-display mb-6">
                    {post.title}
                </h1>

                {/* ── Description / Lead ── */}
                <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-8 font-medium border-l-2 border-primary-500/40 pl-4">
                    {post.description}
                </p>

                {/* ── Meta Row ── */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-5 text-slate-500 dark:text-slate-500 text-[11px] font-bold uppercase tracking-[0.15em]">
                        <div className="flex items-center gap-1.5">
                            <span className="material-icons-outlined text-xs text-primary-500">calendar_today</span>
                            {formattedDate}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="material-icons-outlined text-xs text-primary-500">schedule</span>
                            {post.readTime} min read
                        </div>
                    </div>
                    <ShareButtons title={post.title} url={postUrl} />
                </div>

                {/* ── Cover Image ── */}
                {post.coverImage && (
                    <div className="my-10 rounded-3xl overflow-hidden border border-slate-100 dark:border-white/5 shadow-2xl bg-slate-50 dark:bg-slate-900/50 aspect-video">
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                                e.target.parentElement.innerHTML = '<span class="material-icons-outlined text-6xl text-slate-300">image_not_supported</span>';
                            }}
                        />
                    </div>
                )}

                {/* ── Article Content ── */}
                <div className={`article-body mt-10 ${post.tags?.some(t => t.toLowerCase() === 'bangla') ? 'bn-content' : ''}`}>
                    <Content />
                </div>

                {/* ── Bottom Share Row ── */}
                <div className="mt-16 pt-8 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-1">Written by</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Nazmul Hasan Nokib</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Share this post</span>
                        <ShareButtons title={post.title} url={postUrl} />
                    </div>
                </div>

                {/* ── Subscribe Section ── */}
                <Subscribe />

                {/* ── Back to Blog ── */}
                <div className="mt-12 text-center">
                    <Magnetic strength={0.2}>
                        <Link
                            to="/blog"
                            className="inline-flex items-center gap-2 group px-8 py-3.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black text-slate-700 dark:text-white uppercase tracking-[0.2em] hover:bg-primary-600 hover:text-white hover:border-primary-500 transition-all"
                        >
                            <span className="material-icons-outlined text-sm group-hover:-translate-x-1 transition-transform">west</span>
                            All Publications
                        </Link>
                    </Magnetic>
                </div>
            </article>

            {/* ── Floating Back Button (2xl+) ── */}
            <div className="fixed bottom-12 left-12 z-50 hidden 2xl:block">
                <Magnetic strength={0.2}>
                    <Link to="/blog" className="w-14 h-14 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center text-slate-900 dark:text-white shadow-xl hover:bg-primary-600 hover:border-primary-500 hover:text-white transition-all group">
                        <span className="material-icons-outlined group-hover:-translate-x-1 transition-transform text-lg">west</span>
                    </Link>
                </Magnetic>
            </div>
        </div>
    )
}
