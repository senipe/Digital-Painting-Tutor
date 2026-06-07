// Loads image lists from images-manifest.js and populates page sections.
document.addEventListener('DOMContentLoaded', async function () {
    let manifest = window.IMAGES_MANIFEST;

    if (!manifest) {
        try {
            const response = await fetch('images-manifest.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            manifest = await response.json();
        } catch (error) {
            console.warn('Could not load image manifest. Run: .\\scripts\\generate-manifest.ps1', error);
            return;
        }
    }

    // Normalise each entry to { src, x, y } — supports plain strings and objects.
    // x is the horizontal anchor point (0 = left, 50 = centre, 100 = right).
    // y is the vertical anchor point (0 = top, 50 = centre, 100 = bottom).
    function normalise(entry) {
        if (typeof entry === 'string') return { src: entry, x: 50, y: 50 };
        return {
            ...entry,
            x: entry.x ?? 50,
            y: entry.y ?? 50
        };
    }

    const heroImages   = (manifest.hero    || []).map(normalise);
    const galleryImages = (manifest.gallery || []).map(normalise);


    if (typeof initHeroSlideshow === 'function' && heroImages.length) {
        initHeroSlideshow(heroImages);
    }

    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid && typeof initProjectsGrid === 'function') {
        const isMobile = window.innerWidth <= 768;
        const filteredImages = galleryImages.filter(img => {
            if (isMobile) {
                return img.showOnMobileHome !== false;
            } else {
                return img.showOnPcHome !== false && img.showOnDesktopHome !== false;
            }
        });
        initProjectsGrid(projectsGrid, filteredImages);
    }

    const portfolioGallery = document.getElementById('portfolio-gallery');
    if (portfolioGallery && typeof initPortfolioGallery === 'function') {
        initPortfolioGallery(portfolioGallery, galleryImages);
    }
});
