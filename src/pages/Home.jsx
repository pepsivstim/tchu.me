import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import matter from 'gray-matter';
import { Buffer } from 'buffer';
import { slugify } from '../utils/slugify';

window.Buffer = window.Buffer || Buffer;

function Home() {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    document.title = 'tchu.me';
    const loadPosts = async () => {
      try {
        const modules = import.meta.glob('../content/posts/*.md', { query: '?raw', import: 'default' });

        const loadedPosts = await Promise.all(
          Object.entries(modules).map(async ([path, loader]) => {
            try {
              const rawContent = await loader();
              const { data } = matter(rawContent);
              return { ...data, slug: slugify(data.title) };
            } catch (e) {
              return null;
            }
          })
        );

        const sorted = loadedPosts
          .filter(Boolean)
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setPosts(sorted);
      } catch (error) {
        console.error('Failed to load posts', error);
      }
    };

    loadPosts();
  }, []);

  const nextPost = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
  };

  const prevPost = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length);
  };

  const currentPost = posts[currentIndex];

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;

    const IMAGE_ROOT = 'https://images.tchu.me/';
    let cleanPath = path;

    // Strip hash if present
    if (path.includes('#')) {
      cleanPath = path.split('#')[0];
    }

    // Remove leading slash
    if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.slice(1);
    }

    return `${IMAGE_ROOT}${cleanPath}`;
  };

  return (
    <div className="flex-grow flex items-center justify-center px-6 md:px-16 lg:px-8 pt-28 pb-8 bg-paper-base text-ink-black min-h-[calc(100vh-theme(spacing.28))]">

      <div className="w-full max-w-3xl flex items-center justify-center gap-2 md:gap-4 group">
        {/* Left Chevron */}
        <button
          onClick={prevPost}
          className="hidden md:block p-2 text-ink-light opacity-0 group-hover:opacity-40 hover:!opacity-100 hover:text-ink-black transition duration-300 md:p-4 focus:outline-none shrink-0"
          aria-label="Previous post"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 md:w-10 md:h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Content Container - Minimalist Typography */}
        <div className="text-center w-full z-10">
          {currentPost ? (
            <div className="mb-8">
              {currentPost.image && (
                <div className="flex justify-center w-full mb-6 max-w-[300px] mx-auto">
                  <Link to={`/blog/${currentPost.slug}`} className="block w-full">
                    <img
                      src={getImageUrl(currentPost.image)}
                      alt={currentPost.title}
                      className="w-full aspect-square object-cover rounded-md shadow-sm transition-transform duration-500 hover:scale-[1.01]"
                    />
                  </Link>
                </div>
              )}
              <Link to={`/blog/${currentPost.slug}`} className="block">
                <h2 className="font-bold text-xl md:text-2xl text-ink-black font-serif mb-2 hover:text-ink-light transition-colors">
                  {currentPost.title}
                </h2>
                <p className="text-lg text-ink-light font-light leading-relaxed">
                  {currentPost.excerpt}
                </p>
              </Link>
            </div>
          ) : null}
        </div>

        {/* Right Chevron */}
        <button
          onClick={nextPost}
          className="hidden md:block p-2 text-ink-light opacity-0 group-hover:opacity-40 hover:!opacity-100 hover:text-ink-black transition duration-300 md:p-4 focus:outline-none shrink-0"
          aria-label="Next post"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 md:w-10 md:h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Home;
