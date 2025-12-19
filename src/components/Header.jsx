import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-paper-base transition-all duration-300">
            <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-3 md:py-6 flex justify-between items-center relative border-b border-paper-border">
                <Link to="/" className="text-xl md:text-2xl font-serif font-bold text-ink-black tracking-tight cursor-pointer z-50" onClick={closeMenu}>
                    tchu.me
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-8">
                    <Link to="/blog" className={`${isActive('/blog') ? 'text-ink-black' : 'text-ink-light hover:text-ink-black'} font-medium transition duration-300 relative group`}>
                        Blog
                        <span className={`absolute bottom-0 left-0 h-0.5 bg-ink-black transition-all duration-300 ${isActive('/blog') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                    </Link>
                    <Link to="/photos" className={`${isActive('/photos') ? 'text-ink-black' : 'text-ink-light hover:text-ink-black'} font-medium transition duration-300 relative group`}>
                        Photos
                        <span className={`absolute bottom-0 left-0 h-0.5 bg-ink-black transition-all duration-300 ${isActive('/photos') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
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
