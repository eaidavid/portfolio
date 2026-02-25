// DOM Elements
const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const langButtons = document.querySelectorAll('.lang-btn');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
const scrollIndicator = document.querySelector('.scroll-indicator');
const copyButtons = document.querySelectorAll('.copy-btn');
const contactForm = document.getElementById('contactForm');
const portfolioLinks = document.querySelectorAll('.portfolio-link');
const projectModal = document.getElementById('projectModal');
const modalClose = document.querySelector('.modal-close');
const currentYearElements = document.querySelectorAll('.current-year');

// Default settings
let currentLang = 'pt-BR';
let currentTheme = 'dark';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Set current year
  const currentYear = new Date().getFullYear();
  currentYearElements.forEach(el => {
    el.textContent = currentYear;
  });

  // Check saved preferences
  checkSavedPreferences();
  
  // Initialize animations
  initAnimations();
  
  // Initialize the app
  initApp();
  
  // Easter Egg - Console Message
  console.log(
    '%cHello fellow developer! 👋', 
    'font-size: 20px; font-weight: bold; color: #58a6ff;'
  );
  console.log(
    '%cYou found an easter egg! Feel free to explore the code.', 
    'font-size: 14px; color: #c9d1d9;'
  );
  console.log(
    '%cType %crevealSecret()%c to see something cool.',
    'font-size: 14px; color: #c9d1d9;',
    'font-size: 14px; color: #58a6ff; font-weight: bold;',
    'font-size: 14px; color: #c9d1d9;'
  );
  
  // Add Easter Egg function to window
  window.revealSecret = function() {
    console.log('%c✨ Congratulations! ✨', 'font-size: 24px; font-weight: bold; color: #58a6ff;');
    console.log('%cYou found the secret message!', 'font-size: 16px; color: #c9d1d9;');
    console.log('%cHere\'s a digital high five! 🖐️', 'font-size: 16px; color: #c9d1d9;');
    
    // Show a special toast
    showToast('🎉 Easter Egg Found!', 'You\'re a curious developer! I like that.', 'success');
    
    // Add a special effect to the page
    body.classList.add('gradient-animation');
    setTimeout(() => {
      body.classList.remove('gradient-animation');
    }, 3000);
  };
});

// Initialize app
function initApp() {
  // Event Listeners
  
  // Theme Toggle
  themeToggle.addEventListener('click', toggleTheme);
  
  // Language Toggle
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      changeLang(lang);
      
      // Update active state
      langButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Save preference
      localStorage.setItem('preferredLang', lang);
    });
  });
  
  // Mobile Menu Toggle
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    body.classList.toggle('menu-open');
  });
  
  // Navigation Links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetSelector = link.getAttribute('href');

      if (targetSelector && targetSelector.startsWith('#')) {
        const targetSection = document.querySelector(targetSelector);
        if (targetSection) {
          e.preventDefault();
          smoothScrollToSection(targetSection);
        }
      }

      // Close mobile menu if open
      if (mobileMenu.classList.contains('active')) {
        mobileMenuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        body.classList.remove('menu-open');
      }
      
      // Update active state
      navLinks.forEach(l => l.classList.remove('active'));
      document.querySelectorAll(`[href="${link.getAttribute('href')}"]`).forEach(l => {
        l.classList.add('active');
      });
    });
  });
  
  // Scroll Indicator
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        smoothScrollToSection(aboutSection);
      }
    });

    scrollIndicator.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          smoothScrollToSection(aboutSection);
        }
      }
    });
  }
  
  // Copy Buttons
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      copyToClipboard(textToCopy);
      
      // Update button text temporarily
      const originalText = btn.querySelector('span').textContent;
      btn.querySelector('span').textContent = translations[currentLang]['copied'];
      
      setTimeout(() => {
        btn.querySelector('span').textContent = originalText;
      }, 2000);
      
      // Show toast
      showToast(
        translations[currentLang]['success-title'], 
        translations[currentLang]['copied-message'],
        'success'
      );
    });
  });
  
  // Contact Form
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Normally we would send the form data to a server here
      // But for this demo, we'll just show a success message
      
      // Show toast
      showToast(
        translations[currentLang]['success-title'], 
        translations[currentLang]['form-success'],
        'success'
      );
      
      // Reset form
      contactForm.reset();
    });
  }
  
  // Portfolio Links
  portfolioLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const projectId = link.getAttribute('data-project');
      openProjectModal(projectId);
    });
  });
  
  // Modal Close
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      closeProjectModal();
    });
    
    // Close on click outside
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && projectModal.classList.contains('active')) {
        closeProjectModal();
      }
    });
  }
  
  // Scroll Event for Header
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Update active nav link based on scroll position
    updateActiveNavOnScroll();
  });
}

// Check saved preferences
function checkSavedPreferences() {
  // Check theme preference
  const savedTheme = localStorage.getItem('preferredTheme');
  if (savedTheme) {
    currentTheme = savedTheme;
    applyTheme(savedTheme);
  }
  
  // Check language preference
  const savedLang = localStorage.getItem('preferredLang');
  if (savedLang) {
    currentLang = savedLang;
    
    // Update active language button
    langButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-lang') === savedLang) {
        btn.classList.add('active');
      }
    });
    
    // Apply language
    applyTranslations(savedLang);
  }
}

// Theme Toggle
function toggleTheme() {
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  currentTheme = newTheme;
  
  // Save preference
  localStorage.setItem('preferredTheme', newTheme);
}

// Apply Theme
function applyTheme(theme) {
  if (theme === 'dark') {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
  } else {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
  }
}

// Change Language
function changeLang(lang) {
  currentLang = lang;
  applyTranslations(lang);
}

// Apply Translations
function applyTranslations(lang) {
  const elements = document.querySelectorAll('[data-key]');
  
  elements.forEach(element => {
    const key = element.getAttribute('data-key');
    if (translations[lang] && translations[lang][key]) {
      // Check if it's a placeholder or value
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (element.getAttribute('placeholder')) {
          element.setAttribute('placeholder', translations[lang][key]);
        } else {
          element.value = translations[lang][key];
        }
      } else {
        element.textContent = translations[lang][key];
      }
    }
  });
  
  // Update HTML lang attribute
  document.documentElement.lang = lang;
}

function smoothScrollToSection(sectionElement) {
  const header = document.querySelector('.header');
  const headerOffset = header ? header.offsetHeight : 80;
  const targetTop = sectionElement.getBoundingClientRect().top + window.scrollY - headerOffset - 8;

  window.scrollTo({
    top: Math.max(0, targetTop),
    behavior: 'smooth'
  });
}

// Copy to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    console.log('Copied to clipboard:', text);
  }).catch(err => {
    console.error('Could not copy text: ', err);
  });
}

// Show Toast
function showToast(title, message, type = 'success') {
  // Remove existing toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Create toast elements
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  // Toast content
  toast.innerHTML = `
    <div class="toast-icon">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
    </div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Add to document
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => {
    toast.classList.add('active');
  }, 10);
  
  // Close button functionality
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.classList.remove('active');
    setTimeout(() => {
      toast.remove();
    }, 300);
  });
  
  // Auto close after 4 seconds
  setTimeout(() => {
    toast.classList.remove('active');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

// Project Modal
function openProjectModal(projectId) {
  const modalBody = document.querySelector('.modal-body');
  
  let projectData = {
    'joana-fotografia': {
      title: translations[currentLang]['project1-title'],
      description: translations[currentLang]['project1-description'],
      fullDescription: `
        <p>Um site portfolio elegante e moderno para a fotógrafa Joana, especializada em fotografia de casamentos e eventos.</p>
        <p>O site apresenta galerias de imagens responsivas, depoimentos de clientes, formulário de contato e uma área para cotações.</p>
      `,
      image: 'assets/img/joana-fotografia.png',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS', 'Vercel']
    },
    'techhelp': {
      title: translations[currentLang]['project2-title'],
      description: translations[currentLang]['project2-description'],
      fullDescription: `
        <p>Landing page moderna para o projeto Snitap Patins, com foco em apresentação visual, responsividade e conversão.</p>
        <p>O layout foi construído para destacar produto, benefícios e CTA principal com navegação leve e uma experiência fluida em mobile.</p>
      `,
      image: 'assets/img/snitap.png',
      technologies: ['HTML', 'CSS', 'Responsive Layout', 'UI Motion']
    },
    'afiliadosBet': {
      title: translations[currentLang]['project3-title'],
      description: translations[currentLang]['project3-description'],
      fullDescription: `
        <p>Uma landing page moderna e responsiva para programa de afiliados de apostas, construída com React, TypeScript e Tailwind CSS.</p>
      `,
      image: 'assets/img/afiliadosBet.png',
      technologies: ['React', 'Tailwind', 'Vite', 'TypeScript', 'Javascript']
    }
  };
  
  // If translation exists for the current language, use it
  if (currentLang === 'en-US') {
    projectData['joana-fotografia'].fullDescription = `
      <p>An elegant and modern portfolio website for photographer Joana, specializing in wedding and event photography.</p>
      <p>The website features responsive image galleries, client testimonials, contact form, and a quote request area.</p>
    `;
    
    projectData['techhelp'].fullDescription = `
      <p>Modern landing page for the Snitap Skates project with a strong visual direction, responsive layout, and conversion-oriented structure.</p>
      <p>The page highlights the product, benefits, and primary CTA with lightweight navigation and a smooth mobile experience.</p>
    `;
    
    projectData['afiliadosBet'].fullDescription = `
      <p>A modern and responsive landing page for a betting affiliate program, built with React, TypeScript, and Tailwind CSS.</p>
      <p>Designed to communicate the offer clearly and guide users toward conversion with a clean, direct interface.</p>
    `;
  }
  
  const project = projectData[projectId];
  
  if (project) {
    // Populate modal
    modalBody.innerHTML = `
      <div class="modal-project">
        <div class="modal-project-image">
          <img src="${project.image}" alt="${project.title}" class="project-image">
        </div>
        <h3 class="modal-project-title">${project.title}</h3>
        <div class="modal-project-description">
          ${project.fullDescription}
        </div>
        <div class="modal-project-tech">
          <h4>${translations[currentLang]['technologies']}:</h4> <br>
          <div class="tech-tags">
            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>
        </div>
    
      </div>
    `;
    
    // Show modal
    projectModal.classList.add('active');
  }
}

function closeProjectModal() {
  projectModal.classList.remove('active');
}

// Update active nav link based on scroll position
function updateActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPosition = window.scrollY + 100;
  
  sections.forEach(section => {
    const sectionId = section.getAttribute('id');
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      // Remove active class from all nav links
      navLinks.forEach(link => link.classList.remove('active'));
      
      // Add active class to corresponding nav links
      document.querySelectorAll(`a[href="#${sectionId}"]`).forEach(link => {
        link.classList.add('active');
      });
    }
  });
}

// Some fun for developers - Konami Code Easter Egg
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiPosition = 0;

document.addEventListener('keydown', (e) => {
  const key = e.key;
  
  if (key === konamiCode[konamiPosition]) {
    konamiPosition++;
    
    if (konamiPosition === konamiCode.length) {
      // Konami Code completed
      activateKonamiCode();
      konamiPosition = 0;
    }
  } else {
    konamiPosition = 0;
  }
});

function activateKonamiCode() {
  console.log('%c⭐️ KONAMI CODE ACTIVATED! ⭐️', 'font-size: 24px; font-weight: bold; color: #58a6ff;');
  
  // Add a fun effect
  document.body.classList.add('konami-activated');
  
  // Show a special toast
  showToast('🎮 Konami Code!', 'You unlocked a special power! Try clicking on the skills section.', 'success');
  
  // Add a special effect to skills on hover
  const skillItems = document.querySelectorAll('.skill-item');
  skillItems.forEach(item => {
    item.classList.add('konami-skill');
    
    item.addEventListener('click', (e) => {
      if (document.body.classList.contains('konami-activated')) {
        e.preventDefault();
        
        // Create a floating emoji
        const emoji = document.createElement('div');
        emoji.className = 'floating-emoji';
        emoji.textContent = getRandomEmoji();
        emoji.style.left = `${e.clientX}px`;
        emoji.style.top = `${e.clientY}px`;
        
        document.body.appendChild(emoji);
        
        setTimeout(() => {
          emoji.remove();
        }, 2000);
      }
    });
  });
  
  // Remove effects after 30 seconds
  setTimeout(() => {
    document.body.classList.remove('konami-activated');
    skillItems.forEach(item => {
      item.classList.remove('konami-skill');
    });
  }, 30000);
}

function getRandomEmoji() {
  const emojis = ['✨', '🚀', '💻', '🔥', '⚡️', '🌈', '🎉', '🌟', '💫', '🧙‍♂️'];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

// Add styles for Konami code
const konamiStyle = document.createElement('style');
konamiStyle.textContent = `
  .konami-activated {
    animation: gradientAnimation 5s ease infinite;
  }
  
  .konami-skill {
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .konami-skill:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 0 15px var(--accent-primary);
  }
  
  .floating-emoji {
    position: fixed;
    font-size: 24px;
    pointer-events: none;
    animation: floatUp 2s ease-out forwards;
    z-index: 9999;
  }
  
  @keyframes floatUp {
    0% { transform: translate(0, 0) scale(1); opacity: 1; }
    100% { transform: translate(0, -100px) scale(2); opacity: 0; }
  }
`;

document.head.appendChild(konamiStyle);
