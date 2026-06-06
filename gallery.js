// Gallery Lightbox Functionality
let lightboxController = null;

function filenameToAltText(src) {
    const filename = src.split('/').pop().replace(/\.[^.]+$/, '');
    return filename
        .replace(/[-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function initPortfolioGallery(container, images) {
    if (!container) return;

    container.innerHTML = '';

    images.forEach((entry, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.index = String(index);

        const img = document.createElement('img');
        img.src = entry.src;
        img.alt = filenameToAltText(entry.src);
        img.style.objectPosition = `${entry.x}% center`;
        item.appendChild(img);
        container.appendChild(item);
    });

    setupLightbox(container);
}

function initProjectsGrid(container, images) {
    if (!container) return;

    container.innerHTML = '';

    images.forEach((entry, index) => {
        const card = document.createElement('div');
        card.className = `project-card gallery-item${index % 3 === 0 ? ' wide' : ''}`;
        card.dataset.index = String(index);

        const img = document.createElement('img');
        img.src = entry.src;
        img.alt = filenameToAltText(entry.src);
        img.className = 'project-card-img';
        img.style.objectPosition = `${entry.x}% center`;
        card.appendChild(img);

        container.appendChild(card);
    });

    setupLightbox(container);
}

function setupLightbox(container) {
    const galleryItems = container.querySelectorAll('.gallery-item');
    if (!galleryItems.length) return;

    let lightbox = document.getElementById('lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <span class="lightbox-prev">&#10094;</span>
            <span class="lightbox-next">&#10095;</span>
            <div class="lightbox-content">
                <img id="lightbox-image" src="" alt="Digital painting enlargement">
            </div>
        `;
        document.body.insertBefore(lightbox, document.body.firstChild);
    }

    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');

    let currentIndex = 0;
    const imageSources = Array.from(galleryItems).map((item) => item.querySelector('img').src);

    if (lightboxController) {
        document.removeEventListener('keydown', lightboxController.onKeyDown);
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            openLightbox();
        });
    });

    function openLightbox() {
        lightboxImage.src = imageSources[currentIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % imageSources.length;
        lightboxImage.src = imageSources[currentIndex];
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
        lightboxImage.src = imageSources[currentIndex];
    }

    function onKeyDown(e) {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNext();
        } else if (e.key === 'ArrowLeft') {
            showPrev();
        }
    }

    lightboxClose.onclick = closeLightbox;
    lightboxNext.onclick = showNext;
    lightboxPrev.onclick = showPrev;
    lightbox.onclick = (e) => {
        if (e.target === lightbox) closeLightbox();
    };

    lightboxController = { onKeyDown };
    document.addEventListener('keydown', onKeyDown);
}
