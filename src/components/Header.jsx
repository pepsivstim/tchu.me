import { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-paper-base/90 border-b border-paper-border transition-all duration-300">
            <div className="w-[95%] md:w-[60%] mx-auto px-4 md:px-8 py-6 flex justify-between items-center relative">
                <Link to="/" className="text-2xl font-serif font-bold text-ink-black tracking-tight cursor-pointer z-50" onClick={closeMenu}>
                    tchu.me
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-8">
                    <a href="#experience" className="text-ink-light hover:text-ink-black font-medium transition duration-300 relative group">
                        Experience
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-ink-black transition-all duration-300 group-hover:w-full"></span>
                    </a>
                    <Link to="/blog" className="text-ink-light hover:text-ink-black font-medium transition duration-300 relative group">
                        Blog
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-ink-black transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link to="/photos" className="text-ink-light hover:text-ink-black font-medium transition duration-300 relative group">
                        Photos
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-ink-black transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden z-50 text-ink-black focus:outline-none"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>

                {/* Mobile Menu Overlay */}
                <div className={`fixed inset-0 bg-paper-base flex flex-col items-center justify-center gap-10 transition-transform duration-300 ease-in-out md:hidden z-40 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <a href="#experience" onClick={closeMenu} className="text-2xl text-ink-black font-serif font-bold hover:text-ink-light transition-colors">
                        Experience
                    </a>
                    <Link to="/blog" onClick={closeMenu} className="text-2xl text-ink-black font-serif font-bold hover:text-ink-light transition-colors">
                        Blog
                    </Link>
                    <Link to="/photos" onClick={closeMenu} className="text-2xl text-ink-black font-serif font-bold hover:text-ink-light transition-colors">
                        Photos
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Header;
