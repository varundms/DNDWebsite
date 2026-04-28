document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar & Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if(mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if(icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // 3. Highlight active nav link based on current page
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-links a');
    
    navItems.forEach(link => {
        // Simple logic for setting active page (works for index and subpages)
        if (link.getAttribute('href') !== '#' && currentPath.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        }
        // Handle root
        if(currentPath === '/' || currentPath === '' || currentPath.endsWith('index.html')) {
            if(link.getAttribute('href') === 'index.html' || link.getAttribute('href') === '/') {
                 link.classList.add('active');
            }
        }
    });

    // 4. Scroll Animations using Intersection Observer
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: stop observing once animated
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // 5. Number Counter Animation
    const counters = document.querySelectorAll('.counter');
    const counterOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60 fps
                
                const updateCount = () => {
                    const current = +counter.innerText;
                    if (current < target) {
                        counter.innerText = Math.ceil(current + increment);
                        setTimeout(updateCount, 16);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, counterOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // 6. Hero Slideshow
    const heroSlides = document.querySelectorAll('.hero-slide');
    const contentSlides = document.querySelectorAll('.hero-content-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    
    if(heroSlides.length > 0) {
        let currentSlide = 0;
        let slideInterval;
        const heroSliderWrapper = document.querySelector('.hero-slider');
        const contentSliderWrapper = document.querySelector('.hero-content-slider');

        const nextSlide = (index) => {
            dots[currentSlide].classList.remove('active');

            currentSlide = index !== undefined ? index : (currentSlide + 1) % heroSlides.length;

            dots[currentSlide].classList.add('active');

            // Explicitly update button text based on slide
            const ctaButton = document.getElementById('hero-cta-button');
            if (ctaButton) {
                if (currentSlide === 4) { // Slide 5
                    ctaButton.innerText = 'Join Our Team';
                    ctaButton.setAttribute('href', 'careers.html');
                } else {
                    ctaButton.innerText = 'Who We Are';
                    ctaButton.setAttribute('href', 'about.html');
                }
            }

            const offset = currentSlide * -20;
            if (heroSliderWrapper) heroSliderWrapper.style.transform = `translateX(${offset}%)`;
            if (contentSliderWrapper) contentSliderWrapper.style.transform = `translateX(${offset}%)`;
        };

        slideInterval = setInterval(() => nextSlide(), 5000);

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                nextSlide(idx);
                slideInterval = setInterval(() => nextSlide(), 5000);
            });
        });
    }
});
