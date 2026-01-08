import { useState, useEffect, useRef } from 'react';
import photosManifest from '../content/photos_manifest.json';

const IMAGE_ROOT = 'https://images.tchu.me/';

const ImageWithLoader = ({ photo, onClick }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef();

    useEffect(() => {
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
    }, []);

    const onPhotoClick = (e) => {
        e.stopPropagation();
        onClick(photo);
    };

    const imageUrl = `${IMAGE_ROOT}cdn-cgi/image/w=800,f=auto/${photo.name}`;

    return (
        <div
            ref={imgRef}
            className={`relative break-inside-avoid group cursor-pointer overflow-hidden rounded-sm bg-gray-100 ${isLoaded ? 'opacity-100' : 'opacity-0'
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
                <div className="absolute bottom-0 left-0 w-full p-3 bg-paper-base/95 backdrop-blur-sm border-t border-paper-border transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
                    <p className="text-ink-black font-serif italic text-lg text-center leading-tight">
                        {photo.caption}
                    </p>
                </div>
            )}
        </div>
    );
};


function Photos() {
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    useEffect(() => {
        document.title = 'Photos | tchu.me';
    }, []);

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
        <div className="min-h-screen bg-paper-base pt-20 md:pt-[88px] lg:pt-28 pb-12">

            <div className="w-full max-w-4xl mx-auto px-6 md:px-16 lg:px-8 space-y-16">
                {photosManifest.map((section) => {
                    // Split for masonry
                    const leftCol = section.images.filter((_, i) => i % 2 === 0);
                    const rightCol = section.images.filter((_, i) => i % 2 !== 0);

                    return (
                        <div key={section.section} className="space-y-6">
                            <div className="border-b border-paper-border pb-4">
                                <h2 className="text-3xl font-serif font-bold text-ink-black tracking-tight">{section.section}</h2>
                                {section.description && (
                                    <p className="text-ink-light text-lg mt-1 font-light italic">{section.description}</p>
                                )}
                            </div>

                            {/* Mobile View (Single Column) */}
                            <div className="flex flex-col gap-4 md:hidden">
                                {section.images.map((photo) => (
                                    <ImageWithLoader
                                        key={photo.name}
                                        photo={photo}
                                        onClick={() => handlePhotoClick(photo)}
                                    />
                                ))}
                            </div>

                            {/* Desktop View (2-Column Masonry) */}
                            <div className="hidden md:flex flex-row gap-8 items-start">
                                <div className="flex flex-col gap-8 w-1/2">
                                    {leftCol.map((photo) => (
                                        <ImageWithLoader
                                            key={photo.name}
                                            photo={photo}
                                            onClick={() => handlePhotoClick(photo)}
                                        />
                                    ))}
                                </div>
                                <div className="flex flex-col gap-8 w-1/2">
                                    {rightCol.map((photo) => (
                                        <ImageWithLoader
                                            key={photo.name}
                                            photo={photo}
                                            onClick={() => handlePhotoClick(photo)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

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
