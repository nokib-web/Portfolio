import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPostBySlug } from '../../api/hashnode'


export default function BlogPost() {
    const { slug } = useParams()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getPostBySlug(slug)
            .then(setPost)
            .finally(() => setLoading(false))
        window.scrollTo(0, 0)
    }, [slug])

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-gray-400 text-lg">Loading...</div>
        </div>
    )

    if (!post) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-gray-400">Post not found.</div>
        </div>
    )

    return (
        <article className="max-w-3xl mx-auto px-6 py-20">

            {/* Back */}
            <Link to="/blog" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 text-sm transition-colors">
                ← Back to Blog
            </Link>

            {/* Cover */}
            {post.coverImage && (
                <img
                    src={post.coverImage.url}
                    alt={post.title}
                    className="w-full rounded-2xl mb-8 max-h-96 object-cover"
                />
            )}

            {/* Tags */}
            <div className="flex gap-2 flex-wrap mb-4">
                {post.tags.map(tag => (
                    <span key={tag.name} className="text-xs px-3 py-1 bg-purple-900/40 text-purple-400 rounded-full">
                        {tag.name}
                    </span>
                ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {post.title}
            </h1>

            {/* Meta */}
            <div className="flex gap-4 text-sm text-gray-500 mb-10 pb-6 border-b border-gray-700">
                <span>{new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                })}</span>
                <span>·</span>
                <span>{post.readTimeInMinutes} min read</span>
            </div>

            {/* Content */}
            <div
                className="prose prose-invert prose-purple max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content.html }}
            />

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-gray-700">
                <Link to="/blog" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm transition-colors">
                    ← Read more posts
                </Link>
            </div>

        </article>
    )
}