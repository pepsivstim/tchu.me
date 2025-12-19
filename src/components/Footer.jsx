import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-paper-base text-ink-black pb-3 md:pb-8 mt-auto">
            <div className="w-full max-w-4xl mx-auto px-4 md:px-8 flex flex-row justify-center min-[320px]:justify-between items-center gap-2 md:gap-0 border-t border-paper-border pt-3 md:pt-8">
                <Link to="/" className="text-lg text-ink-light font-light hover:text-ink-black transition-colors">
                    © 2025 Timothy Chu
                </Link>
                <div className="hidden min-[320px]:flex gap-4 items-center">
                    <a href="https://www.linkedin.com/in/timchu2002/" target="_blank" rel="noopener noreferrer" className="text-ink-light hover:text-ink-black transition-colors" aria-label="LinkedIn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect x="2" y="9" width="4" height="12"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                    </a>
                    <a href="https://www.youtube.com/@pepsivstim" target="_blank" rel="noopener noreferrer" className="text-ink-light hover:text-ink-black transition-colors" aria-label="YouTube">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                        </svg>
                    </a>
                    <a href="https://www.instagram.com/pepsivstim" target="_blank" rel="noopener noreferrer" className="text-ink-light hover:text-ink-black transition-colors" aria-label="Instagram">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
