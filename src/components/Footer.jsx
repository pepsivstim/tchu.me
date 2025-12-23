import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

function Footer() {
    const iconsRef = useRef(null);
    const [showFish, setShowFish] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!iconsRef.current) return;

            const rect = iconsRef.current.getBoundingClientRect();
            const padding = 10; // Detection threshold

            // Check if cursor is within the container + padding
            const inX = e.clientX >= (rect.left - padding) && e.clientX <= (rect.right + padding);
            const inY = e.clientY >= (rect.top - padding) && e.clientY <= (rect.bottom + padding);

            setShowFish(inX && inY);
        };

        // Only add listener on devices that likely have a cursor (mouse)
        if (window.matchMedia('(pointer: fine)').matches) {
            document.addEventListener('mousemove', handleMouseMove);
        } else {
            // keep it simple for mobile: could show on active touch, or remain hidden.
            // keeping hidden aligns with "cursor" logic implies desktop easter egg.
            document.addEventListener('mousemove', handleMouseMove);
        }

        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <footer className="bg-paper-base text-ink-black pb-3 lg:pb-8 mt-auto">
            <div className="w-full max-w-4xl mx-auto px-6 md:px-16 lg:px-8 flex flex-row justify-center min-[320px]:justify-between items-center gap-2 lg:gap-0 border-t border-paper-border pt-3 lg:pt-8">
                <Link to="/" className="text-lg text-ink-light font-light hover:text-ink-black transition-colors">
                    © 2025 Timothy Chu
                </Link>
                <div ref={iconsRef} className="hidden min-[320px]:flex gap-4 items-center">
                    <a
                        href="https://www.jetpunk.com/users/pepsivstim"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center justify-center text-ink-light hover:text-ink-black transition-all duration-300 ${showFish ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                        aria-label="Fish"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {/* Simple Outline: Flat Tail -> Body Top -> Nose -> Body Bottom -> Flat Tail */}
                            <path d="M1 4 L6 8 C 9 1 20 1 23 12 C 20 23 9 23 6 16 L 1 20 Z" />
                            {/* Eye */}
                            <circle cx="18" cy="11" r="1.5" />
                        </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/timchu2002/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center text-ink-light hover:text-ink-black transition-colors" aria-label="LinkedIn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect x="2" y="9" width="4" height="12"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                    </a>
                    <a href="https://www.youtube.com/@pepsivstim" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center text-ink-light hover:text-ink-black transition-colors" aria-label="YouTube">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                        </svg>
                    </a>
                    <a href="https://www.instagram.com/pepsivstim" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center text-ink-light hover:text-ink-black transition-colors" aria-label="Instagram">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
