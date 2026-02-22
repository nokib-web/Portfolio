import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllPosts } from '../../api/hashnode'

const CATEGORIES = ['All', 'Development', 'Dailylife', 'Religion']

export default function Blog() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [active, setActive] = useState('All')

    useEffect(() => {
        getAllPosts()
            .then(setPosts)
            .finally(() => setLoading(false))
    }, [])

    const filtered = active === 'All'
        ? posts
        : posts.filter(p =>
            p.tags.some(t => t.name.toLowerCase() === active.toLowerCase())
        )

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-gray-400 text-lg">Loading posts...</div>
        </div>
    )

    return (
        <section className="max-w-6xl mx-auto px-6 py-20">

            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-3">My Blog</h1>
                <p className="text-gray-400">Thoughts on development, life & faith</p>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-3 justify-center flex-wrap mb-12">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActive(cat)}
                        className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200
              ${active === cat
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-400'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Posts Grid */}
            {filtered.length === 0 ? (
                <p className="text-center text-gray-500">No posts in this category yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map(post => (
                        <Link
                            to={`/blog/${post.slug}`}
                            key={post.slug}
                            className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-purple-500 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                        >
                            {post.coverImage && (
                                <img
                                    src={post.coverImage.url}
                                    alt={post.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-5 flex flex-col gap-3 flex-1">
                                {/* Tags */}
                                <div className="flex gap-2 flex-wrap">
                                    {post.tags.map(tag => (
                                        <span
                                            key={tag.name}
                                            className="text-xs px-3 py-1 bg-purple-900/40 text-purple-400 rounded-full"
                                        >
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                                {/* Title */}
                                <h3 className="text-white font-semibold text-lg leading-snug">
                                    {post.title}
                                </h3>
                                {/* Excerpt */}
                                <p className="text-gray-400 text-sm flex-1 line-clamp-3">
                                    {post.brief}
                                </p>
                                {/* Meta */}
                                <div className="flex justify-between text-xs text-gray-500 mt-auto pt-2 border-t border-gray-700">
                                    <span>{new Date(post.publishedAt).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'short', day: 'numeric'
                                    })}</span>
                                    <span>{post.readTimeInMinutes} min read</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    )
}