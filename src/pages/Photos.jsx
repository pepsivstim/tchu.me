import { useState, useEffect } from 'react';
import manifest from '../content/photos/manifest.json';

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

    // Helper to render a grid of photos
    const PhotoGrid = ({ photos }) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {photos.map((photo) => (
                <div
                    key={photo.name}
                    onClick={() => setSelectedPhoto(photo)}
                    className="relative group overflow-hidden rounded-sm shadow-sm hover:shadow-md transition-all duration-300 cursor-zoom-in"
                >
                    <img
                        src={photo.url}
                        alt={photo.caption || photo.name}
                        className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-500 ease-in-out block"
                    />
                    {photo.caption && (
                        <div className="absolute bottom-0 left-0 w-full bg-paper-base/90 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <p className="text-xs md:text-sm font-serif text-ink-black italic">{photo.caption}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-paper-base text-ink-black py-24">
            <div className="w-[60%] mx-auto px-8">
                {Object.keys(sections).length === 0 ? (
                    <div className="text-center text-ink-light italic">
                        No photos found. Add images to <code>src/content/photos</code>.
                    </div>
                ) : (
                    <div className="space-y-16">
                        {/* Render General first if exists */}
                        {sections['General'] && (
                            <div>
                                <PhotoGrid photos={sections['General']} />
                            </div>
                        )}

                        {/* Render other sections sorted alphabetically */}
                        {Object.keys(sections)
                            .filter(key => key !== 'General')
                            .sort()
                            .map(section => (
                                <div key={section}>
                                    <h2 className="text-2xl font-serif font-bold mb-6 text-ink-black border-b border-paper-border pb-2 inline-block">
                                        {section}
                                    </h2>
                                    <PhotoGrid photos={sections[section]} />
                                </div>
                            ))
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
                            <p className="mt-4 text-ink-black font-serif italic text-lg bg-paper-base/80 px-4 py-2 rounded-sm cursor-text">
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
