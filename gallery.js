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
        item.dataset.full = entry.src;
        item.dataset.thumb = entry.thumb || entry.src;

        const img = document.createElement('img');
        img.src = entry.thumb || entry.src;
        img.alt = filenameToAltText(entry.src);
        img.style.objectPosition = `${entry.x}% ${entry.y}%`;
        img.loading = 'lazy';
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
        card.dataset.full = entry.src;
        card.dataset.thumb = entry.thumb || entry.src;

        const img = document.createElement('img');
        img.src = entry.thumb || entry.src;
        img.alt = filenameToAltText(entry.src);
        img.className = 'project-card-img';
        img.style.objectPosition = `${entry.x}% ${entry.y}%`;
        img.loading = 'lazy';
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
    const itemsData = Array.from(galleryItems).map((item) => {
        const img = item.querySelector('img');
        return {
            thumb: item.dataset.thumb || (img ? img.src : ''),
            full: item.dataset.full || (img ? img.src : '')
        };
    });

    let currentLoadingImage = null;

    function loadImage(index) {
        const item = itemsData[index];
        if (!item) return;

        // Instantly load the thumbnail
        lightboxImage.src = item.thumb;

        // Cancel previous background load if active
        if (currentLoadingImage) {
            currentLoadingImage.onload = null;
            currentLoadingImage.onerror = null;
            currentLoadingImage = null;
        }

        // Load the full-resolution image in the background
        if (item.full && item.full !== item.thumb) {
            const tempImg = new Image();
            currentLoadingImage = tempImg;
            tempImg.onload = () => {
                if (currentLoadingImage === tempImg) {
                    lightboxImage.src = item.full;
                }
            };
            tempImg.src = item.full;
        }
    }

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
        loadImage(currentIndex);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        if (currentLoadingImage) {
            currentLoadingImage.onload = null;
            currentLoadingImage.onerror = null;
            currentLoadingImage = null;
        }
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % itemsData.length;
        loadImage(currentIndex);
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + itemsData.length) % itemsData.length;
        loadImage(currentIndex);
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
