document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    const methodCards = document.querySelectorAll('.method-card');
    const projectCards = document.querySelectorAll('.project-card');
    const resourceCards = document.querySelectorAll('.resource-card');
    const navbar = document.querySelector('.navbar');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    methodCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            animateCard(card);
        }, index * 100);

        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.method-icon');
            if (icon) {
                icon.style.transition = 'transform 0.3s ease';
                icon.style.transform = 'scale(1.2) rotate(5deg)';
            }
        });

        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.method-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            animateCard(card);
        }, index * 150);

        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.project-icon');
            if (icon) {
                icon.style.transition = 'transform 0.3s ease';
                icon.style.transform = 'scale(1.15)';
            }
        });

        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.project-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });

    resourceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            animateCard(card);
        }, index * 100);

        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.resource-icon');
            if (icon) {
                icon.style.transition = 'transform 0.3s ease';
                icon.style.transform = 'scale(1.1)';
            }
        });

        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.resource-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        observer.observe(section);
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(15, 15, 35, 0.98)';
            navbar.style.backdropFilter = 'blur(30px)';
        } else {
            navbar.style.background = 'rgba(15, 15, 35, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        }

        if (window.scrollY > 200) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.transition = 'opacity 0.5s ease';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    });

    const nodes = document.querySelectorAll('.node');
    nodes.forEach((node, index) => {
        node.style.animationDelay = `${index * 0.15}s`;
    });

    const lines = document.querySelectorAll('.line');
    lines.forEach((line, index) => {
        line.style.animationDelay = `${index * 0.1}s`;
    });

    const heroTitle = document.querySelector('.hero-title');
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(-20px)';

    setTimeout(() => {
        heroTitle.style.transition = 'all 1s ease-out';
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
    }, 300);

    const heroSubtitle = document.querySelector('.hero-subtitle');
    heroSubtitle.style.opacity = '0';

    setTimeout(() => {
        heroSubtitle.style.transition = 'all 0.8s ease-out';
        heroSubtitle.style.opacity = '1';
    }, 500);

    const heroDescription = document.querySelector('.hero-description');
    heroDescription.style.opacity = '0';

    setTimeout(() => {
        heroDescription.style.transition = 'all 0.8s ease-out';
        heroDescription.style.opacity = '1';
    }, 700);

    const heroButtons = document.querySelector('.hero-buttons');
    heroButtons.style.opacity = '0';
    heroButtons.style.transform = 'translateY(10px)';

    setTimeout(() => {
        heroButtons.style.transition = 'all 0.8s ease-out';
        heroButtons.style.opacity = '1';
        heroButtons.style.transform = 'translateY(0)';
    }, 900);

    const heroVisual = document.querySelector('.hero-visual');
    heroVisual.style.opacity = '0';
    heroVisual.style.transform = 'translateX(30px)';

    setTimeout(() => {
        heroVisual.style.transition = 'all 1s ease-out';
        heroVisual.style.opacity = '1';
        heroVisual.style.transform = 'translateX(0)';
    }, 600);
});

function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function animateCard(card) {
    card.style.transition = 'all 0.6s ease-out';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
}