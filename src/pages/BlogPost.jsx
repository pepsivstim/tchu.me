import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import matter from 'gray-matter';
import { Buffer } from 'buffer';
import { slugify } from '../utils/slugify';

window.Buffer = window.Buffer || Buffer;

function BlogPost() {
    const { slug } = useParams();
    const [content, setContent] = useState('');
    const [meta, setMeta] = useState({});

    // ...

    useEffect(() => {
        const loadPost = async () => {
            try {
                // Import all posts
                const modules = import.meta.glob('../content/posts/*.md', { query: '?raw', import: 'default' });

                let foundPost = null;

                // Iterate to find the matching slug
                for (const path in modules) {
                    const loader = modules[path];
                    const rawContent = await loader();
                    const { content: markdownBody, data } = matter(rawContent);

                    if (slugify(data.title) === slug) {
                        foundPost = { markdownBody, data };
                        break;
                    }
                }

                if (foundPost) {
                    setContent(foundPost.markdownBody);
                    setMeta(foundPost.data);
                } else {
                    setContent('# Post Not Found');
                }
            } catch (err) {
                console.error(err);
                setContent('# Error loading post');
            }
        };

        loadPost();
    }, [slug]);

    return (
        <div className="min-h-screen bg-paper-base text-ink-black py-24">
            <article className="w-[90%] md:w-[60%] mx-auto px-4 md:px-8 prose prose-stone lg:prose-lg font-serif prose-h1:mb-4">
                <Link to="/blog" className="no-underline text-ink-light hover:text-ink-black mb-8 block transition-colors">
                    ← Back to all posts
                </Link>
                <div className="mb-8">
                    <h1 className="mb-0">{meta.title}</h1>
                    {meta.excerpt && (
                        <p className="text-xl text-ink-light italic mb-4 pb-4 border-b border-paper-border w-full font-serif leading-relaxed opacity-80">{meta.excerpt}</p>
                    )}
                    <div className="text-ink-light font-mono text-sm">{meta.date}</div>
                </div>
                <ReactMarkdown
                    components={{
                        a: ({ node, ...props }) => (
                            <a {...props} target="_blank" rel="noopener noreferrer" />
                        )
                    }}
                >
                    {content}
                </ReactMarkdown>
            </article>
        </div>
    );
}

export default BlogPost;
