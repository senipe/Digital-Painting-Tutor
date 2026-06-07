// Hero Slideshow Background Manager
function initHeroSlideshow(slidesData) {
    const slideshowContainer = document.querySelector('.slideshow-container');
    const dotsContainer = document.getElementById('slideshow-dots');
    if (!slideshowContainer || !slidesData.length) return;

    let currentSlide = 0;
    let autoTimer = null;
    const slideInterval = 6000;

    slidesData.forEach((entry, index) => {
        const slide = document.createElement('div');
        slide.className = `slide${index === 0 ? ' active' : ''}`;
        slide.style.backgroundImage = `url('${entry.thumb || entry.src}')`;
        slide.style.backgroundPositionX = `${entry.x}%`;
        slideshowContainer.appendChild(slide);

        // Progressively load full-resolution image in the background
        if (entry.thumb && entry.thumb !== entry.src) {
            const img = new Image();
            img.onload = () => {
                slide.style.backgroundImage = `url('${entry.src}')`;
            };
            img.src = entry.src;
        }
    });

    const slides = slideshowContainer.querySelectorAll('.slide');

    if (dotsContainer) {
        slidesData.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `slideshow-dot${index === 0 ? ' active' : ''}`;
            dot.setAttribute('aria-label', `Show slide ${index + 1}`);
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetTimer();
            });
            dotsContainer.appendChild(dot);
        });
    }

    const dots = dotsContainer ? dotsContainer.querySelectorAll('.slideshow-dot') : [];

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        if (dots.length) dots[currentSlide].classList.remove('active');

        currentSlide = index;

        slides[currentSlide].classList.add('active');
        if (dots.length) dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    function resetTimer() {
        if (autoTimer) clearInterval(autoTimer);
        autoTimer = setInterval(nextSlide, slideInterval);
    }

    resetTimer();
}
