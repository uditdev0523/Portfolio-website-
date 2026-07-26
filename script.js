/* ==========================================================================
   PORTFOLIO INTERACTIVE SCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. PARTICLE CANVAS ENGINE
  initParticleCanvas();

  // 2. TYPING ANIMATION ENGINE
  initTypingEffect();

  // 3. THEME ACCENT SWITCHER
  initThemePicker();

  // 4. NAVBAR & SCROLL SPY
  initNavigation();

  // 5. STATS COUNTER ANIMATION
  initStatsCounter();

  // 6. ABOUT TABS
  initAboutTabs();

  // 7. SKILL & PROJECT FILTERS
  initFilters();

  // 8. 3D TILT EFFECT ON CARDS
  init3DTilt();

  // 9. PROJECT QUICK VIEW MODAL
  initProjectModal();

  // 10. CONTACT FORM VALIDATION & TOAST
  initContactForm();

  // 11. UTILITY LISTENERS (CV Download, Year, Email Copy)
  initUtilityListeners();
});

/* --------------------------------------------------------------------------
   1. PARTICLE CANVAS ENGINE
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 18), 70);

  let mouse = {
    x: null,
    y: null,
    radius: 140
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.size = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse attraction
      if (mouse.x != null && mouse.y != null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= Math.cos(angle) * force * 2;
          this.y -= Math.sin(angle) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const alpha = 1 - (dist / 120);
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha * 0.15})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      particles[a].update();
      particles[a].draw();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   2. TYPING ANIMATION ENGINE
   -------------------------------------------------------------------------- */
function initTypingEffect() {
  const target = document.getElementById('typing-text');
  if (!target) return;

  const roles = [
    "Full-Stack Web Developer",
    "AI & Cloud Engineer",
    "UI/UX Micro-Interactions Pro",
    "Open Source Contributor"
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeSpeed = 90;
  const deleteSpeed = 50;
  const delayEnd = 2000;

  function type() {
    const currentRole = roles[roleIdx];

    if (!isDeleting) {
      target.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;

      if (charIdx === currentRole.length) {
        isDeleting = true;
        setTimeout(type, delayEnd);
        return;
      }
    } else {
      target.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;

      if (charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }

    setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   3. THEME ACCENT SWITCHER
   -------------------------------------------------------------------------- */
function initThemePicker() {
  const toggleBtn = document.getElementById('accent-toggle-btn');
  const dropdown = document.getElementById('accent-dropdown');
  const accentBtns = document.querySelectorAll('.accent-opt');

  if (!toggleBtn || !dropdown) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    dropdown.classList.remove('show');
  });

  // Restore saved theme
  const savedAccent = localStorage.getItem('portfolio-accent') || 'cyan';
  setAccent(savedAccent);

  accentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.getAttribute('data-color');
      setAccent(color);
      localStorage.setItem('portfolio-accent', color);
    });
  });

  function setAccent(color) {
    document.documentElement.setAttribute('data-accent', color);
    accentBtns.forEach(b => {
      if (b.getAttribute('data-color') === color) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   4. NAVBAR & SCROLL SPY
   -------------------------------------------------------------------------- */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  // Sticky Navbar background
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll Spy & Fade in animations
    spyScroll();
    handleFadeIn();
  });

  // Mobile Menu Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  function spyScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const sectionHeight = sec.offsetHeight;
      const sectionTop = sec.offsetTop - 120;
      const sectionId = sec.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  function handleFadeIn() {
    const fadeElems = document.querySelectorAll('.fade-in');
    fadeElems.forEach(elem => {
      const elemTop = elem.getBoundingClientRect().top;
      if (elemTop < window.innerHeight - 80) {
        elem.classList.add('visible');
      }
    });
  }

  // Initial call
  handleFadeIn();
}

/* --------------------------------------------------------------------------
   5. STATS COUNTER ANIMATION
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const statNums = document.querySelectorAll('.stat-num');
  let started = false;

  window.addEventListener('scroll', () => {
    const heroSec = document.getElementById('hero');
    if (!heroSec) return;

    const top = heroSec.getBoundingClientRect().top;
    if (top > -200 && !started) {
      started = true;
      statNums.forEach(num => {
        const target = +num.getAttribute('data-target');
        let count = 0;
        const increment = Math.ceil(target / 40);

        const timer = setInterval(() => {
          count += increment;
          if (count >= target) {
            num.textContent = target + (target === 100 ? '%' : '+');
            clearInterval(timer);
          } else {
            num.textContent = count;
          }
        }, 30);
      });
    }
  });
}

/* --------------------------------------------------------------------------
   6. ABOUT TABS
   -------------------------------------------------------------------------- */
function initAboutTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(targetTab)?.classList.add('active');
    });
  });
}

/* --------------------------------------------------------------------------
   7. SKILL & PROJECT FILTERS
   -------------------------------------------------------------------------- */
function initFilters() {
  // Skill Filters
  const skillBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Project Filters
  const projBtns = document.querySelectorAll('.proj-filter-btn');
  const projCards = document.querySelectorAll('.project-card');

  projBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-proj-filter');

      projCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. 3D TILT EFFECT ON CARDS
   -------------------------------------------------------------------------- */
function init3DTilt() {
  const tiltElems = document.querySelectorAll('.tilt-element');

  tiltElems.forEach(elem => {
    elem.addEventListener('mousemove', (e) => {
      const rect = elem.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      elem.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    elem.addEventListener('mouseleave', () => {
      elem.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* --------------------------------------------------------------------------
   9. PROJECT QUICK VIEW MODAL
   -------------------------------------------------------------------------- */
function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const quickViewBtns = document.querySelectorAll('.quick-view-btn');

  if (!modal || !modalBody) return;

  const projectDetails = {
    'proj-1': {
      title: 'NexusAI - Next-Gen AI Workspace',
      category: 'Full-Stack SaaS Platform',
      tech: ['React.js', 'Node.js', 'Express', 'OpenAI API', 'MongoDB', 'Tailwind CSS'],
      description: 'NexusAI is a full-featured AI platform designed for productivity teams. It provides dynamic code generation, intelligent document summarization, voice-to-text transcription, and team workspace management.',
      features: [
        'Real-time streaming response render using WebSockets.',
        'OAuth 2.0 user authentication and role-based access control.',
        'Stripe billing integration with monthly subscription tiers.',
        'High-performance MongoDB vector store for semantic document search.'
      ],
      demoUrl: 'https://github.com',
      repoUrl: 'https://github.com'
    },
    'proj-2': {
      title: 'AuraStore - 3D E-Commerce Platform',
      category: 'Interactive Web Application',
      tech: ['Three.js', 'JavaScript', 'CSS3', 'Node.js', 'Stripe API'],
      description: 'AuraStore revolutionizes digital shopping by offering interactive 3D WebGL models for luxury merchandise, allowing customers to inspect materials, rotate items 360°, and customize colors in real-time.',
      features: [
        'Smooth 60fps 3D canvas rendering using Three.js.',
        'Dynamic texture swapping and lighting environment controls.',
        'Integrated shopping cart state management.',
        'Mobile touch-optimized camera orbital controls.'
      ],
      demoUrl: 'https://github.com',
      repoUrl: 'https://github.com'
    },
    'proj-3': {
      title: 'DevPulse - Telemetry & Performance Hub',
      category: 'Full-Stack Analytics',
      tech: ['TypeScript', 'Express.js', 'PostgreSQL', 'Chart.js', 'Docker'],
      description: 'DevPulse is a real-time dashboard monitoring developer productivity, repository commit activity, build pipeline statuses, and API latency metrics.',
      features: [
        'Live streaming dashboard powered by Chart.js & WebSockets.',
        'PostgreSQL automated time-series telemetry aggregation.',
        'Customizable metric widget layouts.',
        'Alerting hooks for Slack and Discord webhooks.'
      ],
      demoUrl: 'https://github.com',
      repoUrl: 'https://github.com'
    },
    'proj-4': {
      title: 'InAmigos Foundation Web Platform',
      category: 'NGO & Community Portal',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive UI', 'FormSpree'],
      description: 'A non-profit foundation portal built to raise social campaign awareness, streamline volunteer applications, display event galleries, and process donation drives.',
      features: [
        'Mobile-first responsive architecture.',
        'Interactive campaign progress meters and volunteer counter.',
        'Social media sharing integrations.',
        'Fast page loading speed with optimized semantic HTML.'
      ],
      demoUrl: 'https://github.com',
      repoUrl: 'https://github.com'
    }
  };

  quickViewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projId = btn.getAttribute('data-proj');
      const data = projectDetails[projId];
      if (!data) return;

      modalBody.innerHTML = `
        <span class="tag mb-2">${data.category}</span>
        <h2 style="font-size: 1.8rem; margin: 0.5rem 0 1rem;">${data.title}</h2>
        <p style="margin-bottom: 1.5rem; color: var(--text-muted);">${data.description}</p>
        
        <h4 style="margin-bottom: 0.8rem; color: var(--accent-color);">Key Features:</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem;">
          ${data.features.map(f => `<li><i class="fa-solid fa-check text-accent" style="margin-right: 0.5rem;"></i>${f}</li>`).join('')}
        </ul>

        <h4 style="margin-bottom: 0.8rem; color: var(--accent-color);">Technologies Used:</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
          ${data.tech.map(t => `<span class="tag" style="background: rgba(255,255,255,0.06); color: var(--text-main);">${t}</span>`).join('')}
        </div>

        <div style="display: flex; gap: 1rem;">
          <a href="${data.demoUrl}" target="_blank" class="btn btn-primary btn-sm"><i class="fa-solid fa-external-link"></i> Live Demo</a>
          <a href="${data.repoUrl}" target="_blank" class="btn btn-outline btn-sm"><i class="fa-brands fa-github"></i> GitHub Source</a>
        </div>
      `;

      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  };

  modalClose?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', closeModal);
}

/* --------------------------------------------------------------------------
   10. CONTACT FORM VALIDATION & TOAST
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      setError(nameInput, true);
      isValid = false;
    } else {
      setError(nameInput, false);
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      setError(emailInput, true);
      isValid = false;
    } else {
      setError(emailInput, false);
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      setError(subjectInput, true);
      isValid = false;
    } else {
      setError(subjectInput, false);
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      setError(messageInput, true);
      isValid = false;
    } else {
      setError(messageInput, false);
    }

    if (isValid) {
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...`;

      setTimeout(() => {
        showToast('Message sent successfully! Udit will get back to you shortly.', 'success');
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 1500);
    }
  });

  function setError(inputElem, isError) {
    const parent = inputElem.closest('.form-group');
    if (isError) {
      parent.classList.add('error');
    } else {
      parent.classList.remove('error');
    }
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fa-solid fa-circle-check text-accent" style="font-size: 1.2rem;"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* --------------------------------------------------------------------------
   11. UTILITY LISTENERS
   -------------------------------------------------------------------------- */
function initUtilityListeners() {
  // Set Footer Year
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }

  // Download CV Button Handler
  const downloadCvBtn = document.getElementById('download-cv-btn');
  downloadCvBtn?.addEventListener('click', () => {
    showToast('Preparing CV download package...', 'info');
    setTimeout(() => {
      showToast('CV downloaded successfully!', 'success');
    }, 1200);
  });

  // Copy Email Button
  const copyEmailBtn = document.querySelector('.copy-email-btn');
  copyEmailBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    navigator.clipboard.writeText('udit.singh@example.com').then(() => {
      showToast('Email address copied to clipboard!', 'success');
    });
  });
}
