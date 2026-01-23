import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import photosManifest from '../content/photos_manifest.json';
import { slugify } from '../utils/slugify';
import NotFound from './NotFound';

const IMAGE_ROOT = 'https://images.tchu.me/';

const ImageWithLoader = ({ photo, onClick, canLoad = true }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef();

    useEffect(() => {
        if (!canLoad) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            });
        });

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, [canLoad]);

    const onPhotoClick = (e) => {
        e.stopPropagation();
        onClick(photo);
    };

    const imageUrl = `${IMAGE_ROOT}cdn-cgi/image/w=800,f=auto/${photo.name}`;

    return (
        <div
            ref={imgRef}
            className={`relative break-inside-avoid mb-4 md:mb-8 w-full group cursor-pointer overflow-hidden rounded-sm bg-gray-100 ${isLoaded ? 'opacity-100' : 'opacity-0'
                } transition-[transform,opacity,box-shadow] duration-300 ease-out hover:scale-[1.05] hover:z-10 hover:shadow-xl transform-gpu backface-hidden`}
            onClick={(e) => {
                if (window.innerWidth >= 768 && window.innerHeight >= 600) {
                    onPhotoClick(e);
                }
            }}
        >
            {!isLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
            {isInView && (
                <img
                    src={imageUrl}
                    alt={photo.caption || photo.name}
                    loading="lazy"
                    onLoad={() => setIsLoaded(true)}
                    className="w-full h-auto object-cover"
                />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

            {photo.caption && (
                <div className="absolute bottom-0 left-0 w-full p-3 bg-black/80 backdrop-blur-sm border-t border-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
                    <p className="text-white font-serif text-lg text-center leading-tight">
                        {photo.caption}
                    </p>
                </div>
            )}
        </div>
    );
};


const PhotoSection = ({ section, onPhotoClick, isSingleSection = false }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        if (!contentRef.current) return;

        const checkOverflow = () => {
            if (contentRef.current) {
                // Check if scrollHeight exceeds our max height threshold (500px)
                setIsOverflowing(contentRef.current.scrollHeight > 500);
            }
        };

        const observer = new ResizeObserver(checkOverflow);
        observer.observe(contentRef.current);

        // Initial check
        checkOverflow();

        return () => observer.disconnect();
    }, [section.images]); // Re-run if images change (unlikely/static)

    const shouldShowPreview = isOverflowing && !isExpanded && !isSingleSection;

    return (
        <div className="space-y-6">
            <div className="border-b border-paper-border pb-4">
                <h2 className="text-3xl font-serif font-bold text-ink-black tracking-tight">{section.section}</h2>
                {section.description && (
                    <p className="text-ink-light text-lg mt-1 font-light italic">{section.description}</p>
                )}
            </div>

            <div
                ref={contentRef}
                className={`relative ${shouldShowPreview ? 'max-h-[500px] overflow-hidden' : ''}`}
            >
                {/* Unified CSS Columns View */}
                <div className="columns-1 md:columns-2 gap-4 md:gap-8">
                    {section.images.map((photo, index) => (
                        <ImageWithLoader
                            key={photo.name}
                            photo={photo}
                            onClick={() => onPhotoClick(photo)}
                            canLoad={isExpanded || isSingleSection || index < 6}
                        />
                    ))}
                </div>

                {/* Gradient Overlay & Expand Button - Only show if overflowing and collapsed */}
                {shouldShowPreview && (
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-paper-base to-transparent flex items-end justify-center pb-0 z-10">
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="group flex flex-col items-center gap-2 p-4 hover:opacity-80 transition-opacity focus:outline-none"
                            aria-label="Expand section"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-ink-black animate-bounce">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};



function Photos() {
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const { location } = useParams();

    // Filter sections based on url param
    const displayedSections = location
        ? photosManifest.filter(section => slugify(section.section) === location)
        : photosManifest;

    useEffect(() => {
        if (location && displayedSections.length > 0) {
            document.title = `${displayedSections[0].section} | Photos | tchu.me`;
        } else {
            document.title = 'Photos | tchu.me';
        }
    }, [location, displayedSections]);

    // Handle body scroll locking when lightbox is open
    useEffect(() => {
        if (selectedPhoto) {
            document.body.style.overflow = 'hidden';
            if (window.innerWidth >= 768) {
                document.body.style.paddingRight = '15px'; // Prevent layout shift from scrollbar
            }
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        };
    }, [selectedPhoto]);

    const handlePhotoClick = (photo) => {
        setSelectedPhoto(photo);
    };

    const closeLightbox = () => {
        setSelectedPhoto(null);
    };

    return (
        <div className="flex-grow flex flex-col bg-paper-base pt-20 md:pt-[88px] lg:pt-28 pb-12">

            {displayedSections.length > 0 ? (
                <div className="w-full max-w-4xl mx-auto px-6 md:px-16 lg:px-8 space-y-16">
                    {displayedSections.map((section) => (
                        <PhotoSection
                            key={section.section}
                            section={section}
                            onPhotoClick={handlePhotoClick}
                            isSingleSection={!!location}
                        />
                    ))}
                </div>
            ) : (
                <NotFound />
            )}

            {/* Lightbox */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-8 md:p-12 bg-paper-base/95 backdrop-blur-sm cursor-zoom-out"
                    onClick={closeLightbox}
                >
                    <div
                        className="relative flex flex-col items-center justify-center max-w-[95vw] w-full max-h-full"
                    >
                        <img
                            src={`${IMAGE_ROOT}${selectedPhoto.name}`}
                            alt={selectedPhoto.caption || selectedPhoto.name}
                            className="w-auto h-auto min-h-0 object-contain shadow-2xl rounded-sm cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {selectedPhoto.caption && (
                            <p
                                className={`mt-4 text-ink-light font-serif italic text-lg bg-paper-base px-6 py-3 rounded-2xl border border-white/40 shadow-sm cursor-text tracking-wide ${selectedPhoto.caption.length > 200 ? 'max-h-[30vh] overflow-y-auto' : ''}`}
                                style={selectedPhoto.caption.length > 200 ? { scrollbarWidth: 'thin' } : {}}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {selectedPhoto.caption}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Photos;
