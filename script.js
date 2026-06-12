// ================================
// MOBILE MENU TOGGLE
// ================================

const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });
}

// ================================
// SMOOTH SCROLL & HEADER HIDE/SHOW
// ================================

const navbar = document.querySelector('.navbar');
let lastScrollPos = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;

    // Add shadow to navbar on scroll
    if (scrollTop > 50) {
        navbar.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
    }

    lastScrollPos = scrollTop;
});

// ================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-fade, .feature-card, .course-card').forEach(el => {
    observer.observe(el);
});

// ================================
// COUNTER ANIMATION FOR STATS
// ================================

const animateCounter = (element, target, duration = 2000) => {
    const isPercentage = element.textContent.includes('%');
    const isPlus = element.textContent.includes('+');
    const startNumber = parseInt(element.textContent) || 0;
    let currentNumber = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= target) {
            currentNumber = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentNumber) + (isPercentage ? '%' : '') + (isPlus ? '+' : '');
    }, 16);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            const targetValue = parseInt(statNumber.textContent);
            if (targetValue > 0) {
                animateCounter(statNumber, targetValue);
            }
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(item => {
    statsObserver.observe(item);
});

// ================================
// FORM SUBMISSION
// ================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = {
            name: this.querySelector('input[type="text"]').value,
            email: this.querySelector('input[type="email"]').value,
            phone: this.querySelector('input[type="tel"]').value,
            message: this.querySelector('textarea').value,
            timestamp: new Date().toISOString()
        };

        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Invio in corso...';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            // Show success message
            alert('✓ Messaggio inviato con successo! Ti contatteremo al più presto.');

            // Reset form
            this.reset();

            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            console.log('Form Data:', data);
        }, 1500);
    });
}

// ================================
// BUTTON RIPPLE EFFECT
// ================================

document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        // Remove existing ripple if any
        const existingRipple = this.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }

        this.appendChild(ripple);
    });
});

// Add ripple styles dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ================================
// LAZY LOAD IMAGES
// ================================

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.opacity = '1';
            observer.unobserve(img);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('img').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    imageObserver.observe(img);
});

// ================================
// PARALLAX EFFECT
// ================================

window.addEventListener('scroll', () => {
    const parallaxElements = document.querySelectorAll('.hero-background');
    const scrollPos = window.scrollY;

    parallaxElements.forEach(element => {
        element.style.transform = `translateY(${scrollPos * 0.5}px)`;
    });
});

// ================================
// COURSE CARD CLICK HANDLERS
// ================================

document.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        // Add glow effect
        this.style.filter = 'drop-shadow(0 0 20px rgba(212, 165, 116, 0.4))';
    });

    card.addEventListener('mouseleave', function() {
        this.style.filter = 'drop-shadow(0 0 0px rgba(212, 165, 116, 0))';
    });

    const courseBtn = this.querySelector('.link-btn');
    if (courseBtn) {
        courseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const courseName = this.querySelector('h3').textContent;

            // Scroll to contact and set course name
            const contactSection = document.getElementById('contatti');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });

                // Focus on first input with course context
                setTimeout(() => {
                    const firstInput = contactForm.querySelector('input[type="text"]');
                    if (firstInput) {
                        firstInput.focus();
                        firstInput.value = `Interessato al: ${courseName}`;
                    }
                }, 500);
            }
        });
    }
});

// ================================
// ANIMATED COUNTER FOR LARGE NUMBERS
// ================================

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString('it-IT');

        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ================================
// KEYBOARD NAVIGATION
// ================================

document.addEventListener('keydown', (e) => {
    // Escape key to close mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    }

    // Tab navigation for accessibility
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ================================
// DYNAMIC YEAR IN FOOTER
// ================================

const yearElement = document.querySelector('.footer-bottom p');
if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.textContent = yearElement.textContent.replace(/\d{4}/, currentYear);
}

// ================================
// FEATURE CARD HOVER GLOW
// ================================

document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ================================
// SCROLL TO TOP BUTTON
// ================================

const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #d4a574, #a67c52);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 5px 15px rgba(212, 165, 116, 0.4);
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollTopBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
});

scrollTopBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
});

// ================================
// TEXT REVEAL ANIMATION
// ================================

const revealText = (text) => {
    const letters = text.split('');
    return letters
        .map(letter => `<span style="display:inline-block;opacity:0;animation:reveal 0.5s ease forwards;">${letter}</span>`)
        .join('');
};

// ================================
// PERFORMANCE: THROTTLE SCROLL EVENTS
// ================================

function throttle(fn, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            fn(...args);
            lastCall = now;
        }
    };
}

// ================================
// SECTION ACTIVE INDICATOR
// ================================

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

const updateActiveNav = throttle(() => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}, 100);

window.addEventListener('scroll', updateActiveNav);

// ================================
// FEATURE CARDS TILT EFFECT
// ================================

document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// ================================
// INITIALIZE ON DOM READY
// ================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Ministry of Beauty - Website Loaded');

    // Add animation classes to elements
    document.querySelectorAll('.feature-card, .course-card, .stat-item').forEach((el, index) => {
        el.classList.add('scroll-fade');
    });

    // Add active class to nav links for styling
    const style = document.createElement('style');
    style.textContent = `
        .nav-link.active {
            color: #d4a574;
        }

        .nav-link.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(style);
});

// ================================
// PREVENT FORM SUBMISSION WITH ENTER IN TEXTAREA
// ================================

const textarea = document.querySelector('textarea');
if (textarea) {
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            // Allow normal behavior in textarea
        }
    });
}

// ================================
// MOUSE CURSOR EFFECT (OPTIONAL)
// ================================

const cursor = document.createElement('div');
cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid #d4a574;
    border-radius: 50%;
    pointer-events: none;
    z-index: 10000;
    display: none;
`;
document.body.appendChild(cursor);

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.left = (mouseX - 10) + 'px';
    cursor.style.top = (mouseY - 10) + 'px';
    cursor.style.display = 'block';
});

document.addEventListener('mouseleave', () => {
    cursor.style.display = 'none';
});

// Hide cursor on buttons and links hover
document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.display = 'none';
    });

    el.addEventListener('mouseleave', () => {
        cursor.style.display = 'block';
    });
});

// ================================
// LOG SUCCESSFUL INITIALIZATION
// ================================

console.log('%c Ministry of Beauty', 'font-size: 20px; font-weight: bold; color: #d4a574;');
console.log('%c Advanced Marketing Homepage Loaded Successfully', 'color: #d4a574; font-size: 12px;');
