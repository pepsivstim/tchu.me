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
    const [selectedImage, setSelectedImage] = useState(null);

    // Lock body scroll when lightbox is open
    useEffect(() => {
        if (selectedImage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedImage]);

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
        <div className="flex-grow bg-paper-base text-ink-black pt-24 pb-12">
            <article className="w-full max-w-4xl mx-auto px-6 md:px-16 lg:px-8 prose prose-stone prose-lg md:prose-xl font-serif prose-h1:mb-4">
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
                        ),
                        img: ({ node, ...props }) => {
                            let src = props.src;
                            let imgClass = "w-full h-auto rounded-md"; // default

                            // Check for size hash in URL
                            if (src && src.includes('#')) {
                                const [cleanSrc, hash] = src.split('#');
                                src = cleanSrc;

                                switch (hash) {
                                    case 'small':
                                        imgClass = "w-full md:w-1/3 mx-auto h-auto rounded-md";
                                        break;
                                    case 'medium':
                                        imgClass = "w-full md:w-1/2 mx-auto h-auto rounded-md";
                                        break;
                                    case 'large':
                                        imgClass = "w-full md:w-3/4 mx-auto h-auto rounded-md";
                                        break;
                                    default:
                                        break;
                                }
                            }

                            return (
                                <figure className="my-8">
                                    <img
                                        {...props}
                                        src={src}
                                        className={`${imgClass} cursor-zoom-in transition-transform duration-300 hover:scale-[1.01]`}
                                        loading="lazy"
                                        onClick={() => setSelectedImage({ url: src, caption: props.alt })}
                                    />
                                    {props.alt && (
                                        <figcaption className="text-center text-ink-light text-sm italic mt-2 font-serif opacity-80">
                                            {props.alt}
                                        </figcaption>
                                    )}
                                </figure>
                            );
                        }
                    }}
                >
                    {content}
                </ReactMarkdown>
            </article>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-paper-base/95 backdrop-blur-sm cursor-zoom-out"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="relative flex flex-col items-center justify-center max-w-7xl max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.caption || ''}
                            className="max-h-[85vh] w-auto object-contain shadow-2xl rounded-sm cursor-default"
                        />
                        {selectedImage.caption && (
                            <p className="mt-4 text-ink-light font-serif italic text-lg bg-paper-base/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/40 shadow-sm cursor-text tracking-wide opacity-90">
                                {selectedImage.caption}
                            </p>
                        )}
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 right-0 text-ink-black hover:text-ink-light transition-colors"
                            aria-label="Close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BlogPost;
