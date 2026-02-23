import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPostBySlug } from '../../api/hashnode'
import Magnetic from '../Common/Magnetic'

export default function BlogPost() {
    const { slug } = useParams()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await getPostBySlug(slug);
                setPost(data);
            } catch (err) {
                console.error("Error fetching post:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
        window.scrollTo(0, 0);
    }, [slug])

    if (loading) return (
        <div className="flex justify-center items-center min-h-[70vh]">
            <div className="flex flex-col items-center gap-6">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-4 border-primary-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-primary-500 rounded-full animate-spin"></div>
                    <div className="text-slate-400 font-display text-xl animate-pulse mt-32 tracking-widest font-bold uppercase text-center w-full">Synthesizing...</div>
                </div>
            </div>
        </div>
    )

    if (!post) return (
        <div className="flex flex-col justify-center items-center min-h-[70vh] gap-6">
            <span className="material-icons-outlined text-6xl text-slate-800 dark:text-slate-200">error_outline</span>
            <div className="text-slate-500 dark:text-slate-400 font-display text-2xl uppercase tracking-[0.2em] text-center">Post Not Found.</div>
            <Link to="/blog" className="px-10 py-4 bg-primary-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-transform font-bold">Back to Blog</Link>
        </div>
    )

    return (
        <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 relative bg-white dark:bg-[#0F172A] transition-colors duration-300">
            {/* Navigation Layer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
                <Magnetic strength={0.2}>
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 group text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all font-bold uppercase tracking-[0.2em] text-[10px]"
                    >
                        <span className="material-icons-outlined text-sm group-hover:-translate-x-1 transition-transform">west</span>
                        Back to Blog
                    </Link>
                </Magnetic>
            </div>

            <article className="max-w-4xl mx-auto">

                {/* Clean Image Container */}
                <div className="relative w-full aspect-video sm:aspect-[21/9] rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-900 mb-16 shadow-2xl border border-slate-200 dark:border-white/5">
                    {post.coverImage ? (
                        <img
                            src={post.coverImage.url}
                            alt={post.title}
                            className="w-full h-full object-cover dark:grayscale-[20%] dark:hover:grayscale-0 transition-all duration-700"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="material-icons-outlined text-slate-300 dark:text-slate-700 text-6xl">auto_awesome</span>
                        </div>
                    )}
                </div>

                {/* Article Header */}
                <header className="mb-12">
                    <div className="flex gap-3 mb-8 flex-wrap">
                        {post.tags?.slice(0, 3).map(tag => (
                            <span key={tag.name} className="px-4 py-1.5 bg-primary-500/5 border border-primary-500/10 rounded-full text-[10px] font-bold text-primary-600 dark:text-primary-400/80 uppercase tracking-widest">
                                {tag.name}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter font-display mb-10">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-8 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-2.5">
                            <span className="material-icons-outlined text-sm text-primary-500">calendar_today</span>
                            {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2.5">
                            <span className="material-icons-outlined text-sm text-primary-500">schedule</span>
                            {post.readTimeInMinutes} min read
                        </div>
                    </div>

                    <div className="h-px w-full bg-slate-200 dark:bg-slate-800/50 mt-12" />
                </header>

                {/* Main Content Body */}
                <div className="flex flex-col lg:flex-row gap-16">
                    <div className="flex-1 min-w-0">
                        <div
                            className="premium-prose"
                            dangerouslySetInnerHTML={{ __html: post.content?.html || '' }}
                        />

                        {/* Article Footer */}
                        <footer className="mt-24 pt-12 border-t border-slate-200 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-10">
                            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                <span className="text-[10px] text-slate-500 dark:text-slate-600 uppercase font-black tracking-[0.3em] mb-2">Source Destination</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono italic">hashnode.com/@nokib</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <Magnetic strength={0.3}>
                                    <Link to="/blog" className="px-10 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em] hover:bg-primary-600 hover:text-white hover:border-primary-500 transition-all shadow-sm dark:shadow-none">
                                        All Publications
                                    </Link>
                                </Magnetic>
                            </div>
                        </footer>
                    </div>
                </div>
            </article>

            {/* Floating Back Button - Only visible on very large screens for convenience */}
            <div className="fixed bottom-12 left-12 z-50 hidden 2xl:block">
                <Magnetic strength={0.2}>
                    <Link to="/blog" className="w-16 h-16 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center text-slate-900 dark:text-white shadow-2xl hover:bg-primary-600 hover:border-primary-500 hover:text-white transition-all group">
                        <span className="material-icons-outlined group-hover:-translate-x-1 transition-transform">west</span>
                    </Link>
                </Magnetic>
            </div>
        </div>
    )
}
