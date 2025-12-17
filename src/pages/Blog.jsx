import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import matter from 'gray-matter';
import { Buffer } from 'buffer';
import { slugify } from '../utils/slugify';

// Polyfill Buffer for gray-matter in browser
window.Buffer = window.Buffer || Buffer;

function Blog() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const loadPosts = async () => {
            // Import all markdown files from /src/content/posts
            const modules = import.meta.glob('../content/posts/*.md', { query: '?raw', import: 'default' });

            const loadedPosts = await Promise.all(
                Object.entries(modules).map(async ([path, loader]) => {
                    const rawContent = await loader();
                    const { data } = matter(rawContent);
                    // generate slug from title
                    const slug = slugify(data.title);

                    return {
                        slug,
                        ...data
                    };
                })
            );

            // Sort by date descending
            loadedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
            setPosts(loadedPosts);
        };

        loadPosts();
    }, []);

    return (
        <div className="min-h-screen bg-paper-base text-ink-black py-24">
            <div className="w-[60%] mx-auto px-8">
                <div className="space-y-12">
                    {posts.map((post) => (
                        <div key={post.slug} className="group">
                            <Link to={`/blog/${post.slug}`} className="block">
                                <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
                                    <h2 className="text-2xl font-bold group-hover:text-ink-light transition-colors duration-200">
                                        {post.title}
                                    </h2>
                                    <span className="text-ink-light font-mono text-sm">{post.date}</span>
                                </div>
                                <p className="text-ink-light italic">{post.excerpt}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Blog;
