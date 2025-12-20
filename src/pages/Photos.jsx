import { useState, useEffect, useRef } from 'react';
import manifest from '../content/photos/manifest.json';
import sectionsOrder from '../content/photos/sections.json';

// Component to handle individual image loading
const ImageWithLoader = ({ photo, onClick }) => {
    const [visuals, setVisuals] = useState({ grayscale: 1, scale: 1 });
    const containerRef = useRef(null);
    const rafRef = useRef(null);
    const isHoveredRef = useRef(false);

    useEffect(() => {
        let isVisible = false;

        const updateVisuals = () => {
            if (!containerRef.current) return;

            // If hovered, force max states immediately
            if (isHoveredRef.current) {
                setVisuals({ grayscale: 0, scale: 1.1 });
                if (isVisible) {
                    rafRef.current = requestAnimationFrame(updateVisuals);
                }
                return;
            }

            const rect = containerRef.current.getBoundingClientRect();
            const elementCenter = rect.top + rect.height / 2;
            const viewportCenter = window.innerHeight / 2;
            const distance = Math.abs(elementCenter - viewportCenter);

            // 20% band means +/- 10% from center is the "safe zone"
            const safeZoneRadius = window.innerHeight * 0.1;
            // Gradient fades out over the next 400px
            const fadeDistance = 400;

            let progress = 1; // 1 = far/gray/small, 0 = close/color/big

            if (distance <= safeZoneRadius) {
                progress = 0;
            } else {
                progress = Math.min((distance - safeZoneRadius) / fadeDistance, 1);
            }

            setVisuals({
                grayscale: progress,
                scale: 1.0 + (1 - progress) * 0.01
            });

            if (isVisible) {
                rafRef.current = requestAnimationFrame(updateVisuals);
            }
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
                if (isVisible) {
                    rafRef.current = requestAnimationFrame(updateVisuals);
                } else {
                    if (rafRef.current) {
                        cancelAnimationFrame(rafRef.current);
                    }
                }
            },
            {
                rootMargin: '100px 0px 100px 0px', // Pre-load slightly before viewport
                threshold: 0
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            onClick={() => onClick(photo)}
            onMouseEnter={() => { isHoveredRef.current = true; }}
            onMouseLeave={() => { isHoveredRef.current = false; }}
            className="relative group overflow-hidden rounded-sm shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out cursor-zoom-in bg-paper-border/20 aspect-[3/2]"
            style={{
                transform: `scale(${visuals.scale})`,
                transition: 'transform 75ms linear'
            }}
        >
            <img
                src={photo.url}
                alt={photo.caption || photo.name}
                className="w-full h-full object-cover block transition-[filter] duration-75 ease-linear"
                style={{ filter: `grayscale(${visuals.grayscale}) brightness(1)` }}
                loading="lazy"
            />
            {photo.caption && (
                <div className="absolute bottom-0 left-0 w-full bg-paper-base/90 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-xs md:text-sm font-sans font-medium text-ink-black tracking-wide">{photo.caption}</p>
                </div>
            )}
        </div>
    );
};

// Helper to render a grid of photos
const PhotoGrid = ({ photos, onPhotoClick }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {photos.map((photo) => (
            <ImageWithLoader key={photo.name} photo={photo} onClick={onPhotoClick} />
        ))}
    </div>
);

function Photos() {
    // Structure: { "Uncategorized": [photos], "Travel": [photos], ... }
    const [sections, setSections] = useState({});
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    useEffect(() => {
        const loadPhotos = async () => {
            // Glob recursive to find nested images
            const modules = import.meta.glob('../content/photos/**/*.{jpg,jpeg,png,webp}', { query: '?url', import: 'default' });

            const loadedPhotos = await Promise.all(
                Object.entries(modules).map(async ([path, loader]) => {
                    const url = await loader();
                    const filename = path.split('/').pop();

                    // Determine section from path
                    // path examples: 
                    // "../content/photos/Travel/img.jpg" -> relative: "Travel/img.jpg"
                    // "../content/photos/img.jpg" -> relative: "img.jpg"

                    const relativePath = path.replace('../content/photos/', '');
                    const folderParts = relativePath.split('/');

                    // If split length is 1, it's just filename -> General
                    // If > 1, the first part is the section name
                    const section = folderParts.length > 1 ? folderParts[0] : 'General';

                    // Find caption from manifest
                    const photoData = manifest.find(item => item.file === filename);
                    const caption = photoData ? photoData.caption : null;

                    return { name: filename, url, caption, section };
                })
            );

            // Group by section
            const grouped = loadedPhotos.reduce((acc, photo) => {
                if (!acc[photo.section]) {
                    acc[photo.section] = [];
                }
                acc[photo.section].push(photo);
                return acc;
            }, {});

            setSections(grouped);
        };

        loadPhotos();
    }, []);

    return (
        <div className="flex-grow bg-paper-base text-ink-black pt-28 pb-8">
            <div className="w-full max-w-4xl mx-auto px-6 md:px-16 lg:px-8">
                {Object.keys(sections).length !== 0 && (
                    <div className="space-y-16">
                        {/* Render General first if exists */}
                        {sections['General'] && (
                            <div>
                                <PhotoGrid photos={sections['General']} onPhotoClick={setSelectedPhoto} />
                            </div>
                        )}

                        {/* Render other sections sorted by custom order, then alphabetically */}
                        {Object.keys(sections)
                            .filter(key => key !== 'General')
                            .sort((a, b) => {
                                const indexA = sectionsOrder.findIndex(s => s.id === a);
                                const indexB = sectionsOrder.findIndex(s => s.id === b);

                                // If both are in the list, sort by index
                                if (indexA !== -1 && indexB !== -1) {
                                    return indexA - indexB;
                                }

                                // If only A is in the list, it comes first
                                if (indexA !== -1) return -1;
                                // If only B is in the list, it comes first
                                if (indexB !== -1) return 1;

                                // If neither is in the list, sort alphabetically
                                return a.localeCompare(b);
                            })
                            .map(section => {
                                const sectionMeta = sectionsOrder.find(s => s.id === section);
                                return (
                                    <div key={section}>
                                        <h2 className="text-2xl font-serif font-bold mb-2 text-ink-black border-b border-paper-border inline-block">
                                            {section}
                                        </h2>
                                        {sectionMeta?.description && (
                                            <p className="text-ink-light font-sans text-sm md:text-base mb-6 w-full leading-relaxed">
                                                {sectionMeta.description}
                                            </p>
                                        )}
                                        <div className={sectionMeta?.description ? "" : "mt-6"}>
                                            <PhotoGrid photos={sections[section]} onPhotoClick={setSelectedPhoto} />
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-paper-base/95 backdrop-blur-sm cursor-zoom-out"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <div
                        className="relative flex flex-col items-center justify-center max-w-7xl max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedPhoto.url}
                            alt={selectedPhoto.caption || selectedPhoto.name}
                            className="max-h-[85vh] w-auto object-contain shadow-2xl rounded-sm cursor-default"
                        />
                        {selectedPhoto.caption && (
                            <p className="mt-4 text-ink-black font-sans font-medium text-lg bg-paper-base/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/40 shadow-sm cursor-text tracking-wide">
                                {selectedPhoto.caption}
                            </p>
                        )}
                        <button
                            onClick={() => setSelectedPhoto(null)}
                            className="absolute -top-12 right-0 text-ink-black hover:text-ink-light transition-colors"
                            aria-label="Close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Photos;
