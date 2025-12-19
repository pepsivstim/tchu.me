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


    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
            setIsVisible(true); // Ensure header is visible when menu opens
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full z-50 bg-paper-base transition-transform duration-300 ${isVisible || isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="w-full max-w-4xl mx-auto px-6 md:px-16 lg:px-8 py-3 lg:py-6 flex justify-between items-center relative border-b border-paper-border">
                    <Link to="/" className="text-xl lg:text-2xl font-serif font-bold text-ink-black tracking-tight cursor-pointer z-50" onClick={closeMenu}>
                        tchu.me
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
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-paper-base flex flex-col items-center justify-center gap-10 transition-transform duration-300 ease-in-out lg:hidden z-40 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <Link to="/blog" onClick={closeMenu} className="text-2xl text-ink-black font-serif font-bold hover:text-ink-light transition-colors">
                    Blog
                </Link>
                <Link to="/photos" onClick={closeMenu} className="text-2xl text-ink-black font-serif font-bold hover:text-ink-light transition-colors">
                    Photos
                </Link>
            </div>
        </>
    );
}

export default Header;
