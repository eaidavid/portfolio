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

<script>
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
</script>


// Initialize scroll progress indicator
addScrollProgressIndicator();
