import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ThemeToggle = () => {
    // State to hold the user's preference: 'light', 'dark', or 'system'
    const [mode, setMode] = useState(localStorage.getItem('theme') || 'system');
    const location = useLocation();

    // Only show toggle on blog posts (e.g. /blog/some-post), not on the list (/blog) or other pages
    const isBlogPost = location.pathname.startsWith('/blog/') && location.pathname !== '/blog';

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

    // Logic to show/hide the toggle based on scroll position
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY === 0) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
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
            className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 group transition-transform duration-500 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-12' /* Slide out to the right */
                }`}
        >
            {/* The visible tab/hint - positioned on the Left of the drawer now */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-paper-base/90 backdrop-blur-sm border-y border-l border-paper-border rounded-l-md px-1.5 py-4 shadow-sm group-hover:opacity-0 transition-opacity duration-300">
                <div className="w-1 h-8 bg-paper-border rounded-full" />
            </div>

            {/* The actual toggle content - translated Right off-screen by default */}
            <div className="flex flex-col gap-2 p-2 bg-paper-base/90 backdrop-blur-sm border-y border-l border-paper-border rounded-l-lg shadow-sm translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out">
                <button
                    onClick={() => setMode('light')}
                    className={`p-2 rounded-md transition-all duration-200 ${mode === 'light'
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
                    onClick={() => setMode('system')}
                    className={`p-2 rounded-md transition-all duration-200 ${mode === 'system'
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
                    onClick={() => setMode('dark')}
                    className={`p-2 rounded-md transition-all duration-200 ${mode === 'dark'
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
    );
};

export default ThemeToggle;
