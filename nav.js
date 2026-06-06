// Mobile Navigation and Scroll Effects
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 1. Navbar Scroll Effect (Glassmorphism toggle) and Hero Background Fade
    function checkScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Fade out hero background images on scroll down
        const slideshow = document.getElementById('hero-bg-slideshow');
        if (slideshow) {
            // Fully visible until 100px scroll, then fades out by 600px
            const fadeStart = 100;
            const fadeEnd = 600;
            const opacity = window.scrollY <= fadeStart
                ? 1
                : Math.max(0, 1 - (window.scrollY - fadeStart) / (fadeEnd - fadeStart));
            slideshow.style.opacity = opacity;
        }
    }

    // Run on startup to check initial scroll position
    checkScroll();
    window.addEventListener('scroll', checkScroll);

    // 2. Scroll Indicator Click Handler (Smooth Scroll to Work)
    const scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const nextSection = document.getElementById('featured-work');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // 3. Mobile Menu Toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});
