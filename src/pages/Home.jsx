import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-paper-base text-ink-black">

      {/* Content Container - Minimalist Typography */}
      <div className="text-center max-w-3xl w-full z-10">
        <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6 tracking-tighter text-ink-black">
          tchu.blog
        </h1>
        <p className="text-xl md:text-2xl text-ink-light mb-12 font-light italic leading-relaxed">
          Proudly vibecoded
        </p>
        <div className="flex justify-center gap-8">
          <Link to="/blog" className="bg-ink-black text-paper-base px-10 py-3 rounded-md hover:bg-ink-light transition-all duration-300 shadow-sm font-medium text-lg cursor-pointer">
            Read Blog
          </Link>
          <Link to="/photos" className="bg-transparent border border-ink-black text-ink-black px-10 py-3 rounded-md hover:bg-ink-black hover:text-paper-base transition-all duration-300 shadow-sm font-medium text-lg cursor-pointer">
            Photos
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
