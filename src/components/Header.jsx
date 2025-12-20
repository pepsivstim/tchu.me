import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const location = useLocation();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                // Always show if at top or if menu is open
                if (window.scrollY === 0 || isMenuOpen) {
                    setIsVisible(true);
                    setLastScrollY(window.scrollY);
                    return;
                }

                if (window.scrollY > lastScrollY) { // if scroll down
                    setIsVisible(false);
                } else { // if scroll up
                    setIsVisible(true);
                }

                // Remember current page location to use in the next move
                setLastScrollY(window.scrollY);
            }
        };

        window.addEventListener('scroll', controlNavbar);

        // cleanup function
        return () => {
            window.removeEventListener('scroll', controlNavbar);
        };
    }, [lastScrollY, isMenuOpen]);


    // Lock body scroll removal - user requested dropdown

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 bg-paper-base transition-transform duration-300 ${isVisible || isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="w-full max-w-4xl mx-auto px-6 md:px-16 lg:px-8 py-3 lg:py-6 flex justify-between items-center relative border-b border-paper-border">
                <Link to="/" className="flex items-center gap-3 z-50 group" onClick={closeMenu}>
                    <img
                        src="/avatars/tim1.png"
                        alt="Timothy Chu"
                        className="h-10 w-10 md:h-12 md:w-12 rounded-md object-cover grayscale group-hover:grayscale-0 transition duration-300 shrink-0"
                    />
                    <span className="text-xl lg:text-2xl font-serif font-bold text-ink-black tracking-tight whitespace-nowrap">
                        tchu.me
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex gap-8">
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
                    className="lg:hidden z-50 text-ink-black focus:outline-none"
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
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`absolute top-full left-0 w-full bg-paper-base border-b border-paper-border shadow-sm grid grid-cols-2 py-4 transition-all duration-300 ease-in-out lg:hidden -z-10 ${isMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'}`}>
                <Link to="/blog" onClick={closeMenu} className="flex items-center justify-center py-3 text-lg font-medium text-ink-light hover:text-ink-black transition-colors border-r border-paper-border">
                    Blog
                </Link>
                <Link to="/photos" onClick={closeMenu} className="flex items-center justify-center py-3 text-lg font-medium text-ink-light hover:text-ink-black transition-colors">
                    Photos
                </Link>
            </div>
        </nav>
    );
}

export default Header;
