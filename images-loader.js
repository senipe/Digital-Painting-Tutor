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

    // Normalise each entry to { src, x } — supports plain strings and objects.
    // x is the horizontal anchor point (0 = left, 50 = centre, 100 = right).
    function normalise(entry) {
        if (typeof entry === 'string') return { src: entry, x: 50 };
        return { src: entry.src, x: entry.x ?? 50 };
    }

    const heroImages   = (manifest.hero    || []).map(normalise);
    const galleryImages = (manifest.gallery || []).map(normalise);


    if (typeof initHeroSlideshow === 'function' && heroImages.length) {
        initHeroSlideshow(heroImages);
    }

    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid && typeof initProjectsGrid === 'function') {
        initProjectsGrid(projectsGrid, galleryImages);
    }

    const portfolioGallery = document.getElementById('portfolio-gallery');
    if (portfolioGallery && typeof initPortfolioGallery === 'function') {
        initPortfolioGallery(portfolioGallery, galleryImages);
    }
});
