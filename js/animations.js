if (false) {
// Animation Utilities
const animationObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        animationObserver.unobserve(entry.target);
      }
    });
  },
  {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  }
);

// Initialize Animations
function initAnimations() {
  // Hero Section Animations
  setupHeroAnimations();
  
  // Sections Animations
  setupSectionAnimations();
  
  // Skill Items Animation
  setupSkillsAnimation();
  
  // Portfolio Items Animation
  setupPortfolioAnimation();
}

// Hero Section Animations
function setupHeroAnimations() {
  // Hero Name Typing Effect
  const heroName = document.querySelector('.hero-name');
  if (heroName) {
    heroName.classList.add('fade-in');
  }
  
  // Hero elements staggered animation
  const heroElements = [
    document.querySelector('.greeting'),
    document.querySelector('.hero-title'),
    document.querySelector('.hero-description'),
    document.querySelector('.hero-cta')
  ];
  
  heroElements.forEach((element, index) => {
    if (element) {
      element.style.opacity = '0';
      setTimeout(() => {
        element.style.opacity = '1';
        element.classList.add('slide-up');
      }, 300 + (index * 200));
    }
  });
  
  // Profile image animation
  const profileImage = document.querySelector('.profile-image-container');
  if (profileImage) {
    profileImage.style.opacity = '0';
    setTimeout(() => {
      profileImage.style.opacity = '1';
      profileImage.classList.add('slide-in-right');
    }, 800);
  }
}

// Section Animations
function setupSectionAnimations() {
  // Animate section headers
  const sectionHeaders = document.querySelectorAll('.section-header');
  sectionHeaders.forEach((header) => {
    animationObserver.observe(header);
    header.classList.add('slide-up');
  });
  
  // Animate about section
  const aboutImage = document.querySelector('.about-image');
  const aboutText = document.querySelector('.about-text');
  const aboutElements = [aboutImage, aboutText];
  
  aboutElements.forEach((element) => {
    if (element) {
      animationObserver.observe(element);
      element.classList.add(element === aboutImage ? 'slide-in-left' : 'slide-in-right');
    }
  });
  
  // Animate contact section
  const contactInfo = document.querySelector('.contact-info');
  const contactForm = document.querySelector('.contact-form-container');
  const contactElements = [contactInfo, contactForm];
  
  contactElements.forEach((element) => {
    if (element) {
      animationObserver.observe(element);
      element.classList.add(element === contactInfo ? 'slide-in-left' : 'slide-in-right');
    }
  });
}

// Skills Animation
function setupSkillsAnimation() {
  const skillCategories = document.querySelectorAll('.skills-category');
  
  skillCategories.forEach((category, index) => {
    if (category) {
      animationObserver.observe(category);
      category.classList.add('scale-in');
      category.style.animationDelay = `${index * 0.2}s`;
    }
  });
  
  // Add staggered animation to skill items
  const skillItems = document.querySelectorAll('.skill-item');
  skillItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    item.style.transitionDelay = `${0.1 + (index * 0.05)}s`;
  });
  
  // Create a new observer for skill items
  const skillsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.skill-item');
          items.forEach((item) => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
          skillsObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2
    }
  );
  
  // Observe each skills grid
  const skillsGrids = document.querySelectorAll('.skills-grid');
  skillsGrids.forEach((grid) => {
    skillsObserver.observe(grid);
  });
}

// Portfolio Animation
function setupPortfolioAnimation() {
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  portfolioItems.forEach((item, index) => {
    animationObserver.observe(item);
    item.classList.add('scale-in');
    item.style.animationDelay = `${index * 0.2}s`;
  });
}

// Scroll Animation - Add floating effect to certain elements
function setupFloatingElements() {
  const elements = [
    document.querySelector('.deco-circle'),
    document.querySelector('.deco-square'),
    document.querySelector('.code-snippet')
  ];
  
  elements.forEach((element) => {
    if (element) {
      element.classList.add('floating');
    }
  });
}

// Parallax Effect on Scroll
function setupParallaxEffect() {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Parallax for background elements
    const codeBackground = document.querySelector('.code-background');
    if (codeBackground) {
      codeBackground.style.transform = `translateY(${scrollY * 0.05}px)`;
    }
    
    // Parallax for decoration elements
    const decoElements = document.querySelectorAll('.deco-circle, .deco-square, .deco-line');
    decoElements.forEach((element) => {
      if (element) {
        element.style.transform = `translateY(${scrollY * 0.03}px)`;
      }
    });
  });
}

// Run additional animations
setupFloatingElements();
setupParallaxEffect();

// Add custom cursor trail effect (developer easter egg)
function setupCursorTrail() {
  const cursorTrail = document.createElement('div');
  cursorTrail.className = 'cursor-trail';
  document.body.appendChild(cursorTrail);
  
  // Add cursor trail styles
  const trailStyle = document.createElement('style');
  trailStyle.textContent = `
    .cursor-trail {
      position: fixed;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--accent-primary);
      pointer-events: none;
      opacity: 0;
      z-index: 9999;
      box-shadow: 0 0 10px 2px var(--accent-primary);
      transform: translate(-50%, -50%);
      transition: opacity 0.2s ease;
    }
    
    .cursor-trail.active {
      opacity: 0.6;
      transition: transform 0.05s linear, opacity 0.2s ease;
    }
    
    .trail-particle {
      position: fixed;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: var(--accent-primary);
      pointer-events: none;
      opacity: 0.5;
      z-index: 9998;
      animation: fadeOut 1s forwards;
    }
    
    @keyframes fadeOut {
      0% { opacity: 0.5; transform: scale(1); }
      100% { opacity: 0; transform: scale(0); }
    }
  `;
  document.head.appendChild(trailStyle);
  
  // Enable trail only when specific key is pressed
  let trailEnabled = false;
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Alt') {
      trailEnabled = true;
      cursorTrail.classList.add('active');
    }
  });
  
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Alt') {
      trailEnabled = false;
      cursorTrail.classList.remove('active');
    }
  });
  
  document.addEventListener('mousemove', (e) => {
    cursorTrail.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    
    if (trailEnabled) {
      // Create particle
      const particle = document.createElement('div');
      particle.className = 'trail-particle';
      particle.style.left = `${e.clientX}px`;
      particle.style.top = `${e.clientY}px`;
      document.body.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        particle.remove();
      }, 1000);
    }
  });
}

// Initialize cursor trail
setupCursorTrail();

// Add hover glow effect to buttons
function setupButtonEffects() {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach((button) => {
    button.classList.add('glow-effect');
  });
}

// Initialize button effects
setupButtonEffects();

// Add an enhanced scroll effect for the skills section
function enhanceSkillsOnScroll() {
  const skillsSection = document.getElementById('skills');
  
  if (skillsSection) {
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const skillItems = entry.target.querySelectorAll('.skill-item');
            
            skillItems.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('pulse');
                
                // Remove pulse after animation
                setTimeout(() => {
                  item.classList.remove('pulse');
                }, 1000);
              }, index * 100);
            });
            
            skillObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.7
      }
    );
    
    skillObserver.observe(skillsSection);
  }
}

// Initialize enhanced skills effect
enhanceSkillsOnScroll();

// Add scroll progress indicator
function addScrollProgressIndicator() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  
  const progressStyle = document.createElement('style');
  progressStyle.textContent = `
    .scroll-progress {
      position: fixed;
      top: 0;
      left: 0;
      width: 0;
      height: 3px;
      background-color: var(--accent-primary);
      z-index: 1000;
      transition: width 0.1s linear;
    }
  `;
  document.head.appendChild(progressStyle);
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    
    progressBar.style.width = `${scrollPercentage}%`;
  });
}


  const trail = document.getElementById('cursor-trail');

  window.addEventListener('mousemove', (e) => {
    const particle = document.createElement('div');
    particle.className = 'cursor-particle';
    particle.style.left = `${e.clientX}px`;
    particle.style.top = `${e.clientY}px`;

    trail.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 800); // Mesmo tempo da animação
  });



// Initialize scroll progress indicator
addScrollProgressIndicator();
}

let animationsInitialized = false;
let revealObserver = null;

function initAnimations() {
  if (animationsInitialized) return;
  animationsInitialized = true;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  setupHeroIntro(reducedMotion);
  setupRevealOnScroll(reducedMotion);
  setupScrollProgress();
  setupAmbientParallax(reducedMotion);
  setupHeroTilt(reducedMotion);
}

function setupHeroIntro(reducedMotion) {
  const sequence = [
    ['.hero-badge', 'reveal-up', 0],
    ['.greeting', 'reveal-up', 70],
    ['.hero-name', 'reveal-up', 120],
    ['.hero-title', 'reveal-up', 190],
    ['.hero-description', 'reveal-up', 260],
    ['.hero-cta', 'reveal-up', 330],
    ['.hero-metrics', 'reveal-up', 400],
    ['.hero-image', 'reveal-scale', 200],
    ['.scroll-indicator', 'reveal-up', 520]
  ];

  sequence.forEach(([selector, variantClass, delay]) => {
    const element = document.querySelector(selector);
    if (!element) return;

    element.classList.add(variantClass, 'hero-intro-item');
    element.style.setProperty('--reveal-delay', `${delay}ms`);

    if (reducedMotion) {
      element.classList.add('animated');
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        element.classList.add('animated');
      });
    });
  });
}

function setupRevealOnScroll(reducedMotion) {
  const groups = [
    { selector: '.section-header', variant: 'reveal-up', stagger: 80 },
    { selector: '.about-image', variant: 'reveal-left', stagger: 0 },
    { selector: '.about-text', variant: 'reveal-right', stagger: 0 },
    { selector: '.skills-category', variant: 'reveal-scale', stagger: 90 },
    { selector: '.portfolio-item', variant: 'reveal-up', stagger: 90 },
    { selector: '.contact-item', variant: 'reveal-up', stagger: 70 },
    { selector: '.contact-cta-panel', variant: 'reveal-right', stagger: 0 },
    { selector: '.footer-content > *', variant: 'reveal-up', stagger: 60 }
  ];

  const revealTargets = [];

  groups.forEach(({ selector, variant, stagger }) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      if (element.classList.contains('hero-intro-item')) return;

      element.classList.add(variant);
      element.style.setProperty('--reveal-delay', `${index * stagger}ms`);
      revealTargets.push(element);
    });
  });

  if (!revealTargets.length) return;

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(element => element.classList.add('animated'));
    return;
  }

  revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('animated');
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    }
  );

  revealTargets.forEach(target => revealObserver.observe(target));
}

function setupScrollProgress() {
  if (document.querySelector('.scroll-progress')) return;

  if (!document.getElementById('scroll-progress-style')) {
    const style = document.createElement('style');
    style.id = 'scroll-progress-style';
    style.textContent = `
      .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        transform-origin: 0 50%;
        transform: scaleX(0);
        background: linear-gradient(90deg, rgba(18,191,116,0.85), rgba(32,228,141,1));
        box-shadow: 0 0 18px rgba(32,228,141,0.42);
        z-index: 1200;
        opacity: 0;
        transition: opacity 160ms ease;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
  }

  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progressBar);

  let ticking = false;

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? Math.min(1, Math.max(0, scrollTop / scrollHeight)) : 0;

    progressBar.style.transform = `scaleX(${progress})`;
    progressBar.style.opacity = scrollTop > 12 ? '1' : '0';
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateProgress);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateProgress();
}

function setupAmbientParallax(reducedMotion) {
  if (reducedMotion) return;

  const codeBackground = document.querySelector('.code-background');
  const gradientOverlay = document.querySelector('.gradient-overlay');
  const heroSection = document.querySelector('.hero-section');
  const heroPanel = document.querySelector('.hero-content');
  const scrollIndicator = document.querySelector('.scroll-indicator');

  if (!codeBackground && !gradientOverlay && !heroPanel) return;

  let currentY = window.scrollY || 0;
  let ticking = false;

  const apply = () => {
    const heroHeight = heroSection ? heroSection.offsetHeight || 1 : 1;
    const heroRatio = heroSection ? Math.max(0, 1 - currentY / heroHeight) : 0;

    if (codeBackground) {
      codeBackground.style.transform = `translate3d(0, ${Math.round(currentY * 0.04)}px, 0)`;
    }

    if (gradientOverlay) {
      gradientOverlay.style.transform = `translate3d(0, ${Math.round(currentY * 0.015)}px, 0) scale(1.015)`;
    }

    if (heroPanel) {
      heroPanel.style.boxShadow = `
        inset 0 1px 0 rgba(255,255,255,0.04),
        0 ${Math.round(18 + heroRatio * 18)}px ${Math.round(48 + heroRatio * 26)}px rgba(0,0,0,0.28),
        0 0 0 1px rgba(32,228,141,${(0.03 + heroRatio * 0.03).toFixed(3)})
      `;
    }

    if (scrollIndicator) {
      scrollIndicator.style.opacity = currentY > 90 ? '0.5' : '1';
    }

    ticking = false;
  };

  const onScroll = () => {
    currentY = window.scrollY || 0;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(apply);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  apply();
}

function setupHeroTilt(reducedMotion) {
  if (reducedMotion) return;

  const heroImageArea = document.querySelector('.hero-image');
  const imageCard = document.querySelector('.profile-image-container');
  if (!heroImageArea || !imageCard) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let rafId = 0;

  const render = () => {
    currentX += (targetX - currentX) * 0.14;
    currentY += (targetY - currentY) * 0.14;

    imageCard.style.transform = `rotateX(${currentY.toFixed(2)}deg) rotateY(${currentX.toFixed(2)}deg) translateZ(0)`;

    if (Math.abs(targetX - currentX) > 0.03 || Math.abs(targetY - currentY) > 0.03) {
      rafId = requestAnimationFrame(render);
      return;
    }

    rafId = 0;
  };

  const queueRender = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(render);
  };

  heroImageArea.addEventListener('pointermove', event => {
    const rect = heroImageArea.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    targetX = px * 8;
    targetY = py * -8;
    queueRender();
  });

  heroImageArea.addEventListener('pointerleave', () => {
    targetX = 0;
    targetY = 0;
    queueRender();
  });
}

window.initAnimations = initAnimations;
