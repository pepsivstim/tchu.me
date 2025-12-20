import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ThemeToggle = () => {
    // State to hold the user's preference: 'light', 'dark', or 'system'
    const [mode, setMode] = useState(localStorage.getItem('theme') || 'system');
    const location = useLocation();

    // Only show toggle on blog posts (e.g. /blog/some-post), not on the list (/blog) or other pages
    const isBlogPost = location.pathname.startsWith('/blog/') && location.pathname !== '/blog';

    // State for managing open/close behavior replacing CSS group-hover
    const [isOpen, setIsOpen] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const applyTheme = () => {
            let targetTheme = mode;

            if (mode === 'system') {
                targetTheme = mediaQuery.matches ? 'dark' : 'light';
            }

            if (targetTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        applyTheme();

        // If in system mode, listen for OS changes
        const handleChange = () => {
            if (mode === 'system') applyTheme();
        };

        mediaQuery.addEventListener('change', handleChange);
        localStorage.setItem('theme', mode);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [mode]);

    // Manage interaction readiness delay
    useEffect(() => {
        let timeout;
        if (isOpen) {
            // Wait for transition to finish before enabling interactions
            timeout = setTimeout(() => {
                setIsReady(true);
            }, 200); // reduced from 500ms
        } else {
            setIsReady(false);
        }
        return () => clearTimeout(timeout);
    }, [isOpen]);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Logic to show/hide the toggle based on scroll position
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY === 0) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
                setIsOpen(false); // Close menu when scrolling
            }
        };

        // Check initial position
        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isBlogPost) return null;

    return (
        <div
            ref={wrapperRef}
            className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-12' /* Slide out to the right */
                }`}
            onPointerEnter={(e) => { if (e.pointerType === 'mouse') setIsOpen(true); }}
            onPointerLeave={(e) => { if (e.pointerType === 'mouse') setIsOpen(false); }}
            onClick={() => setIsOpen(!isOpen)} // Handle tap toggling
        >
            {/* The visible tab/hint - positioned on the Left of the drawer now */}
            <div
                className={`absolute right-0 top-1/2 -translate-y-1/2 bg-paper-base/90 backdrop-blur-sm border-y border-l border-paper-border rounded-l-md px-1.5 py-4 shadow-sm transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
            >
                <div className="w-1 h-8 bg-paper-border rounded-full" />
            </div>

            {/* The actual toggle content - translated Right off-screen by default */}
            <div
                className={`flex flex-col gap-2 p-2 bg-paper-base/90 backdrop-blur-sm border-y border-l border-paper-border rounded-l-lg shadow-sm transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className={`${isReady ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                    <button
                        onClick={(e) => { e.stopPropagation(); setMode('light'); setIsOpen(false); }}
                        className={`p-2 rounded-md transition-all duration-200 block w-full mb-2 ${mode === 'light'
                            ? 'bg-ink-black text-paper-base shadow-sm'
                            : 'text-ink-light hover:text-ink-black hover:bg-paper-border/50'
                            }`}
                        aria-label="Light Mode"
                        title="Light Mode"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setMode('system'); setIsOpen(false); }}
                        className={`p-2 rounded-md transition-all duration-200 block w-full mb-2 ${mode === 'system'
                            ? 'bg-ink-black text-paper-base shadow-sm'
                            : 'text-ink-light hover:text-ink-black hover:bg-paper-border/50'
                            }`}
                        aria-label="System Preference"
                        title="System Preference"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                            <line x1="8" y1="21" x2="16" y2="21"></line>
                            <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setMode('dark'); setIsOpen(false); }}
                        className={`p-2 rounded-md transition-all duration-200 block w-full ${mode === 'dark'
                            ? 'bg-ink-black text-paper-base shadow-sm'
                            : 'text-ink-light hover:text-ink-black hover:bg-paper-border/50'
                            }`}
                        aria-label="Dark Mode"
                        title="Dark Mode"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ThemeToggle;
