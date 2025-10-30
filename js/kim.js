
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Split text animation for title - more subtle
        const title = document.getElementById('main-title');
        const chars = title.textContent.split('');
        title.innerHTML = chars.map(char => 
            `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');

        const charElements = document.querySelectorAll('.char');

        // Animate title characters on load - stagger up
        gsap.from(charElements, {
            duration: 0.8,
            y: 40,
            opacity: 0,
            stagger: 0.03,
            ease: "power3.out",
            delay: 0.2
        });

        // Subtle floating animation
        gsap.to(charElements, {
            y: -5,
            duration: 2.5,
            stagger: {
                each: 0.05,
                repeat: -1,
                yoyo: true
            },
            ease: "sine.inOut"
        });

        // Animate badge
        gsap.from('.hero-badge', {
            duration: 0.6,
            y: 20,
            opacity: 0,
            ease: "power3.out"
        });

        // Animate glassmorphic title container
        gsap.from('.title-glass', {
            duration: 1,
            scale: 0.9,
            opacity: 0,
            delay: 0.3,
            ease: "power3.out"
        });

        // Animate subtitle
        gsap.from('.hero-subtitle', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            delay: 1,
            ease: "power3.out"
        });

        // Animate scroll indicator
        gsap.from('.scroll-indicator', {
            duration: 0.8,
            opacity: 0,
            delay: 1.2,
            ease: "power3.out"
        });

        // Background gradient animation
        gsap.to('.bg-gradient', {
            opacity: 0.8,
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // Scanner section scroll animation
        gsap.from('.scanner-container', {
            scrollTrigger: {
                trigger: '.scanner-section',
                start: 'top 70%',
                end: 'top 30%',
                toggleActions: 'play none none reverse'
            },
            duration: 1,
            y: 60,
            opacity: 0,
            ease: "power3.out"
        });

        // Feature cards scroll animation - stagger
        gsap.from('.feature-card', {
            scrollTrigger: {
                trigger: '.features-section',
                start: 'top 70%',
                end: 'top 30%',
                toggleActions: 'play none none reverse'
            },
            duration: 0.8,
            y: 60,
            opacity: 0,
            stagger: 0.1,
            ease: "power3.out"
        });

        // Features title animation
        gsap.from('.features-title', {
            scrollTrigger: {
                trigger: '.features-section',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            duration: 0.8,
            y: 30,
            opacity: 0,
            ease: "power3.out"
        });

        // Features subtitle animation
        gsap.from('.features-subtitle', {
            scrollTrigger: {
                trigger: '.features-section',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            duration: 0.8,
            y: 20,
            opacity: 0,
            delay: 0.2,
            ease: "power3.out"
        });

        // Button click interaction
        const scanBtn = document.getElementById('scanBtn');
        scanBtn.addEventListener('click', function() {
            // Ripple effect
            gsap.to(scanBtn, {
                scale: 0.98,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
            
            // Add your URL scanning logic here
            const url = document.getElementById('urlInput').value;
            if (url) {
                console.log('Scanning URL:', url);
                // Call your API here
                
                // Show loading state (optional)
                scanBtn.innerHTML = '<span>Scanning...</span>';
                setTimeout(() => {
                    scanBtn.innerHTML = '<span>Scan</span>';
                }, 2000);
            }
        });

        // Input interactions
        const urlInput = document.getElementById('urlInput');
        urlInput.addEventListener('focus', function() {
            gsap.to(urlInput, {
                scale: 1.01,
                duration: 0.2,
                ease: "power2.out"
            });
        });

        urlInput.addEventListener('blur', function() {
            gsap.to(urlInput, {
                scale: 1,
                duration: 0.2,
                ease: "power2.out"
            });
        });

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Parallax effect on scroll for grid
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const grid = document.querySelector('.bg-grid');
            if (grid) {
                grid.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        });
