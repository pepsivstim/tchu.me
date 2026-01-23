import { Link } from 'react-router-dom';
import { useEffect } from 'react';

function NotFound() {
    useEffect(() => {
        document.title = 'Page Not Found | tchu.me';
    }, []);

    return (
        <div className="flex-grow flex flex-col items-center justify-center px-4 text-center">
            <h2 className="text-2xl font-serif text-ink-light mb-8 italic">
                Page Not Found
            </h2>
            <p className="text-lg text-ink-light mb-12 max-w-md mx-auto">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                className="px-8 py-3 bg-ink-black text-paper-base font-medium rounded-sm hover:bg-ink-light transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
                Go Home
            </Link>
        </div>
    );
}

export default NotFound;
