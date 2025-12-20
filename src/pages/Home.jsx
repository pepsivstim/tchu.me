import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import matter from 'gray-matter';
import { Buffer } from 'buffer';
import { slugify } from '../utils/slugify';

window.Buffer = window.Buffer || Buffer;

function Home() {
  const [latestPost, setLatestPost] = useState(null);

  useEffect(() => {
    document.title = 'tchu.me';
    const loadLatestPost = async () => {
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

        if (sorted.length > 0) {
          setLatestPost(sorted[0]);
        }
      } catch (error) {
        console.error('Failed to load posts', error);
      }
    };

    loadLatestPost();
  }, []);
  return (
    <div className="flex-grow flex items-center justify-center px-6 md:px-16 lg:px-8 pt-28 pb-8 bg-paper-base text-ink-black">

      {/* Content Container - Minimalist Typography */}
      <div className="text-center max-w-3xl w-full z-10">
        {latestPost ? (
          <div className="mb-12 group">
            {latestPost.image && (
              <div className="flex justify-center w-full mb-6 max-w-[300px] mx-auto">
                <Link to={`/blog/${latestPost.slug}`} className="block w-full">
                  <img
                    src={latestPost.image}
                    alt={latestPost.title}
                    className="w-full aspect-square object-cover rounded-md shadow-sm transition-transform duration-500 group-hover:scale-[1.01]"
                  />
                </Link>
              </div>
            )}
            <Link to={`/blog/${latestPost.slug}`} className="block">
              <h2 className="font-bold text-xl md:text-2xl text-ink-black font-serif mb-2 group-hover:text-ink-light transition-colors">
                {latestPost.title}
              </h2>
              <p className="text-lg text-ink-light font-light leading-relaxed">
                {latestPost.excerpt}
              </p>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Home;
