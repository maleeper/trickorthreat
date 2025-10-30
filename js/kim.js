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
    y: 100,
    opacity: 0,
    rotationX: -90,
    stagger: 0.03,
    ease: "back.out(1.7)",
    delay: 0.2
});

// Glitch effect on title
function glitchTitle() {
    gsap.to(charElements, {
        x: () => gsap.utils.random(-2, 2),
        y: () => gsap.utils.random(-2, 2),
        duration: 0.1,
        stagger: 0.02,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
    });
}

// Trigger glitch randomly
setInterval(glitchTitle, 5000);

// Subtle floating animation
gsap.to(charElements, {
    y: -8,
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
    duration: 0.8,
    scale: 0,
    rotation: 360,
    opacity: 0,
    ease: "back.out(1.7)"
});

// Animate glassmorphic title container
gsap.from('.title-glass', {
    duration: 1.2,
    scale: 0.8,
    opacity: 0,
    delay: 0.3,
    ease: "back.out(1.7)"
});

// Animate subtitle
gsap.from('.hero-subtitle', {
    duration: 0.8,
    y: 50,
    opacity: 0,
    delay: 1,
    ease: "power3.out"
});

// Animate scroll indicator
gsap.from('.scroll-indicator', {
    duration: 0.8,
    opacity: 0,
    y: -20,
    delay: 1.3,
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

// Scanner section scroll animation with rotation
gsap.from('.scanner-container', {
    scrollTrigger: {
        trigger: '.scanner-section',
        start: 'top 70%',
        end: 'top 30%',
        toggleActions: 'play none none reverse'
    },
    duration: 1.2,
    y: 100,
    rotationX: -15,
    opacity: 0,
    ease: "back.out(1.7)"
});

// Feature cards scroll animation - stagger with 3D effect
gsap.from('.feature-card', {
    scrollTrigger: {
        trigger: '.features-section',
        start: 'top 70%',
        end: 'top 30%',
        toggleActions: 'play none none reverse'
    },
    duration: 1,
    y: 100,
    rotationY: -15,
    opacity: 0,
    stagger: 0.15,
    ease: "back.out(1.7)"
});

// Features title animation with scale
gsap.from('.features-title', {
    scrollTrigger: {
        trigger: '.features-section',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    },
    duration: 1,
    scale: 0.5,
    opacity: 0,
    ease: "back.out(1.7)"
});

// Features subtitle animation
gsap.from('.features-subtitle', {
    scrollTrigger: {
        trigger: '.features-section',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    },
    duration: 0.8,
    y: 30,
    opacity: 0,
    delay: 0.2,
    ease: "power3.out"
});

// 3D tilt effect on cards with mouse movement
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.5,
            ease: "power2.out"
        });
    });
});

// Parallax effect on hero content
window.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
    
    gsap.to('.title-glass', {
        x: moveX,
        y: moveY,
        duration: 0.5,
        ease: "power2.out"
    });
    
    gsap.to('.hero-subtitle', {
        x: moveX * 0.5,
        y: moveY * 0.5,
        duration: 0.7,
        ease: "power2.out"
    });
});

// Button click interaction with ripple
const scanBtn = document.getElementById('scanBtn');
scanBtn.addEventListener('click', function() {
    // Scale pulse
    gsap.to(scanBtn, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
    });
    
    // Rotation effect
    gsap.to(scanBtn, {
        rotation: 360,
        duration: 0.6,
        ease: "back.out(1.7)"
    });
    
    // Add your URL scanning logic here
    const url = document.getElementById('urlInput').value;
    if (url) {
        console.log('Scanning URL:', url);
        // Call your API here
        
        // Show loading state
        scanBtn.innerHTML = '<span>Scanning...</span>';
        
        // Animate button during scan
        gsap.to(scanBtn, {
            background: 'linear-gradient(135deg, #a855f7, #00ff88)',
            duration: 0.3
        });
        
        setTimeout(() => {
            scanBtn.innerHTML = '<span>Scan</span>';
            gsap.to(scanBtn, {
                background: 'linear-gradient(135deg, #ff6b35, #a855f7)',
                rotation: 0,
                duration: 0.3
            });
        }, 2000);
    }
});

// Input interactions with scale
const urlInput = document.getElementById('urlInput');
urlInput.addEventListener('focus', function() {
    gsap.to(urlInput, {
        scale: 1.02,
        borderColor: 'rgba(255, 69, 0, 0.8)',
        duration: 0.3,
        ease: "back.out(1.7)"
    });
});

urlInput.addEventListener('blur', function() {
    gsap.to(urlInput, {
        scale: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        duration: 0.3,
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

// Parallax effect on scroll for hero background
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const heroImg = document.querySelector('.hero-bg img');
            const grid = document.querySelector('.bg-grid');
            
            if (heroImg) {
                gsap.to(heroImg, {
                    y: scrolled * 0.5,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
            
            if (grid) {
                grid.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
            
            ticking = false;
        });
        ticking = true;
    }
});

// Scanner section hover effect
const scannerContainer = document.querySelector('.scanner-container');
if (scannerContainer) {
    scannerContainer.addEventListener('mouseenter', () => {
        gsap.to(scannerContainer, {
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    scannerContainer.addEventListener('mouseleave', () => {
        gsap.to(scannerContainer, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });
}