/**
 * DVMReady - Beautiful Animations JavaScript
 * Powers premium animation effects
 */

(function() {
  'use strict';

  const CONFIG = {
    magneticStrength: 0.3,
    tiltStrength: 15,
    throttleDelay: 16,
    scrollThrottle: 10
  };

  // Utility functions
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function isTouchDevice() {
    return window.matchMedia('(pointer: coarse)').matches;
  }

  // ==========================================
  // SCROLL PROGRESS BAR
  // ==========================================
  function initScrollProgress() {
    if (prefersReducedMotion()) return;

    let progressBar = document.querySelector('.pc-scroll-progress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'pc-scroll-progress';
      document.body.appendChild(progressBar);
    }

    const updateProgress = throttle(() => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      progressBar.style.width = progress + '%';
    }, CONFIG.scrollThrottle);

    window.addEventListener('scroll', updateProgress, { passive: true });
  }

  // ==========================================
  // MAGNETIC BUTTONS
  // ==========================================
  function initMagneticButtons() {
    if (prefersReducedMotion() || isTouchDevice()) return;

    const buttons = document.querySelectorAll('.pc-btn-magnetic, .pc-btn');
    
    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * CONFIG.magneticStrength}px, ${y * CONFIG.magneticStrength}px)`;
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ==========================================
  // 3D CARD TILT EFFECT
  // ==========================================
  function initCardTilt() {
    if (prefersReducedMotion() || isTouchDevice()) return;

    const cards = document.querySelectorAll('.pc-home-tier-card, .pc-offering-card, .pc-value-item');
    
    cards.forEach(card => {
      card.classList.add('pc-card-3d');
      
      // Add shine element if not present
      if (!card.querySelector('.pc-card-3d__shine')) {
        const shine = document.createElement('div');
        shine.className = 'pc-card-3d__shine';
        card.appendChild(shine);
      }
      
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        const tiltX = (y - 0.5) * CONFIG.tiltStrength;
        const tiltY = (x - 0.5) * -CONFIG.tiltStrength;
        
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        
        // Update shine position
        const shine = card.querySelector('.pc-card-3d__shine');
        if (shine) {
          shine.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.2) 0%, transparent 60%)`;
        }
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ==========================================
  // TEXT REVEAL ANIMATION
  // ==========================================
  function initTextReveal() {
    if (prefersReducedMotion()) return;

    const headings = document.querySelectorAll('.pc-fork-title, .pc-about-hero__title, .pc-about-section__title');
    
    headings.forEach(heading => {
      if (heading.classList.contains('pc-text-reveal-initialized')) return;
      
      const text = heading.textContent;
      const words = text.split(' ');
      
      heading.innerHTML = words.map(word => 
        `<span class="pc-text-reveal__word" style="opacity: 0; display: inline-block;">${word}</span>`
      ).join(' ');
      
      heading.classList.add('pc-text-reveal', 'pc-text-reveal-initialized');
      
      // Animate on scroll into view
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const spans = entry.target.querySelectorAll('.pc-text-reveal__word');
            spans.forEach((span, i) => {
              setTimeout(() => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
                span.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
              }, i * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(heading);
    });
  }

  // ==========================================
  // RIPPLE EFFECT
  // ==========================================
  function initRippleEffect() {
    const buttons = document.querySelectorAll('.pc-btn, .pc-nav-link, .pc-mobile-nav-link');
    
    buttons.forEach(btn => {
      btn.classList.add('pc-ripple');
      
      btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.className = 'pc-ripple__effect';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  // ==========================================
  // CURSOR FOLLOWER
  // ==========================================
  function initCursorFollower() {
    if (prefersReducedMotion() || isTouchDevice()) return;

    const follower = document.createElement('div');
    follower.className = 'pc-cursor-follower';
    document.body.appendChild(follower);
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', throttle((e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, CONFIG.throttleDelay));
    
    // Smooth follow animation
    function animateFollower() {
      const dx = mouseX - followerX;
      const dy = mouseY - followerY;
      
      followerX += dx * 0.15;
      followerY += dy * 0.15;
      
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      
      requestAnimationFrame(animateFollower);
    }
    animateFollower();
    
    // Expand on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .pc-btn, input, textarea');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => follower.classList.add('pc-is-hovering'));
      el.addEventListener('mouseleave', () => follower.classList.remove('pc-is-hovering'));
    });
  }

  // ==========================================
  // STAGGERED GRID REVEAL
  // ==========================================
  function initStaggerReveal() {
    if (prefersReducedMotion()) return;

    const grids = document.querySelectorAll('.pc-offerings-grid, .pc-values-grid, .pc-about-stats');
    grids.forEach(grid => grid.classList.add('pc-stagger-grid'));
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('pc-is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    grids.forEach(grid => observer.observe(grid));
  }

  // ==========================================
  // PARALLAX FLOATING ELEMENTS
  // ==========================================
  function initParallaxFloat() {
    if (prefersReducedMotion() || isTouchDevice()) return;

    const floats = document.querySelectorAll('.pc-float-shape');
    
    document.addEventListener('mousemove', throttle((e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = (e.clientX - centerX) / centerX;
      const moveY = (e.clientY - centerY) / centerY;
      
      floats.forEach((float, index) => {
        const depth = (index + 1) * 5;
        const x = moveX * depth;
        const y = moveY * depth;
        float.style.transform = `translate(${x}px, ${y}px)`;
      });
    }, CONFIG.throttleDelay));
  }

  // ==========================================
  // COUNTER ANIMATION
  // ==========================================
  function initCounters() {
    if (prefersReducedMotion()) return;

    const counters = document.querySelectorAll('.pc-stat-item__number');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent;
          const match = text.match(/^([0-9]+)(.*)$/);
          
          if (match) {
            const target = parseInt(match[1], 10);
            const suffix = match[2];
            let current = 0;
            const duration = 2000;
            const step = target / (duration / 16);
            
            function update() {
              current += step;
              if (current < target) {
                el.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(update);
              } else {
                el.textContent = target + suffix;
              }
            }
            
            update();
          }
          
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
  }

  // ==========================================
  // TABS UNDERLINE ANIMATION
  // ==========================================
  function initTabsUnderline() {
    const tabContainers = document.querySelectorAll('.pc-tabs');
    
    tabContainers.forEach(container => {
      container.classList.add('pc-tabs-underline');
      const tabs = container.querySelectorAll('.pc-tab');
      
      function updateUnderline(activeTab) {
        const rect = activeTab.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        container.style.setProperty('--tab-left', (rect.left - containerRect.left) + 'px');
        container.style.setProperty('--tab-width', rect.width + 'px');
      }
      
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('pc-is-active'));
          tab.classList.add('pc-is-active');
          updateUnderline(tab);
        });
      });
      
      // Initialize with active tab
      const activeTab = container.querySelector('.pc-is-active');
      if (activeTab) updateUnderline(activeTab);
    });
  }

  // ==========================================
  // ACCORDION ANIMATION
  // ==========================================
  function initAccordions() {
    const triggers = document.querySelectorAll('.pc-accordion-trigger');
    
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        const content = trigger.nextElementSibling;
        
        trigger.setAttribute('aria-expanded', !isExpanded);
        content.classList.toggle('pc-is-open', !isExpanded);
      });
    });
  }

  // ==========================================
  // NAVIGATION SCROLL EFFECT
  // ==========================================
  function initNavScroll() {
    const nav = document.querySelector('.pc-portal-nav');
    if (!nav) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', throttle(() => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        nav.classList.add('pc-is-scrolled');
      } else {
        nav.classList.remove('pc-is-scrolled');
      }
      
      lastScroll = currentScroll;
    }, CONFIG.scrollThrottle), { passive: true });
  }

  // ==========================================
  // FLOATING PARTICLES
  // ==========================================
  function initFloatingParticles() {
    if (prefersReducedMotion() || isTouchDevice()) return;

    const container = document.querySelector('.pc-ambient-container') || document.body;
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'pc-particle-float';
      particle.style.cssText = `
        position: fixed;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: var(--pc-primary);
        border-radius: 50%;
        opacity: ${Math.random() * 0.3 + 0.1};
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 100}vh;
        pointer-events: none;
        z-index: -1;
        animation: float-particle ${Math.random() * 10 + 10}s linear infinite;
        animation-delay: -${Math.random() * 10}s;
      `;
      container.appendChild(particle);
    }
    
    // Add keyframes if not present
    if (!document.getElementById('particle-keyframes')) {
      const style = document.createElement('style');
      style.id = 'particle-keyframes';
      style.textContent = `
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ==========================================
  // HOVER IMAGE ZOOM
  // ==========================================
  function initImageZoom() {
    const images = document.querySelectorAll('.pc-home-tier-card, .pc-offering-card');
    images.forEach(img => img.classList.add('pc-img-zoom'));
  }

  // ==========================================
  // INITIALIZE ALL
  // ==========================================
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runInit);
    } else {
      runInit();
    }
  }

  function runInit() {
    initScrollProgress();
    initMagneticButtons();
    initCardTilt();
    initTextReveal();
    initRippleEffect();
    initCursorFollower();
    initStaggerReveal();
    initParallaxFloat();
    initCounters();
    initTabsUnderline();
    initAccordions();
    initNavScroll();
    initFloatingParticles();
    initImageZoom();
    
    console.log('✨ DVMReady: Beautiful animations initialized');
  }

  init();
})();
