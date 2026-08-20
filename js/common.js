/* ==========================================================================
   STACKLY AGRI — GLOBAL INTERACTIVE JAVASCRIPT & ADVANCED ANIMATIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavbar();
  initDrawer();
  initScrollReveal();
  initCounters();
  initHeroCanvas();
  initHeroCarousel();
  initGalleryTabs();
  initLiveTicker();
  init3DTilt();
  initCropCalculator();
});

/* 1. TOP SCROLL PROGRESS BAR */
function initScrollProgress() {
  let progress = document.getElementById('scrollProgress');
  if (!progress) {
    progress = document.createElement('div');
    progress.id = 'scrollProgress';
    document.body.appendChild(progress);
  }

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const currentScroll = (window.scrollY / totalHeight) * 100;
      progress.style.width = currentScroll + '%';
    }
  });
}

/* 2. NAVBAR SCROLL EFFECT */
function initNavbar() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

/* 3. MOBILE DRAWER CONTROLLER */
function initDrawer() {
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('drawer');
  const scrim = document.getElementById('scrim');
  if (!burger || !drawer || !scrim) return;

  function toggleMenu(open) {
    const isOpened = open !== undefined ? open : !drawer.classList.contains('open');
    burger.classList.toggle('open', isOpened);
    drawer.classList.toggle('open', isOpened);
    scrim.classList.toggle('open', isOpened);
    document.body.style.overflow = isOpened ? 'hidden' : '';
  }

  burger.addEventListener('click', () => toggleMenu());
  scrim.addEventListener('click', () => toggleMenu(false));

  const drawerLinks = drawer.querySelectorAll('a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });
}

/* 4. SCROLL REVEAL ANIMATIONS */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* 5. NUMBER COUNTER-UP ANIMATION */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-count'));
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 1800;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = (easedProgress * target).toFixed(target % 1 !== 0 ? 1 : 0);

    el.textContent = currentValue + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* 6. HERO CANVAS BIO-LUMINESCENT PARTICLE ANIMATION */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.5 + 1,
      dx: (Math.random() - 0.5) * 0.4,
      dy: -Math.random() * 0.6 - 0.2,
      alpha: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.4 ? '#34d399' : '#fbbf24'
    });
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;

      if (p.y < 0) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < 0 || p.x > width) p.x = Math.random() * width;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(loop);
  }

  loop();
}

/* 7. HERO ARTWORK CAROUSEL SWITCHER */
function initHeroCarousel() {
  const heroImg = document.getElementById('heroImg');
  const dotsNav = document.getElementById('heroCarouselDots');
  if (!heroImg || !dotsNav) return;

  const images = [
    'images/hero_11zon.webp',
    'images/global_11zon.webp',
    'images/tech_11zon.webp'
  ];

  let currentIndex = 0;
  dotsNav.innerHTML = '';

  images.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.className = `hero-dot ${idx === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => switchImage(idx));
    dotsNav.appendChild(dot);
  });

  function switchImage(index) {
    currentIndex = index;
    heroImg.style.opacity = '0.3';
    heroImg.style.transform = 'scale(0.96)';

    setTimeout(() => {
      heroImg.src = images[currentIndex];
      heroImg.style.opacity = '1';
      heroImg.style.transform = 'scale(1)';

      const dots = dotsNav.querySelectorAll('.hero-dot');
      dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    }, 250);
  }

  // Auto rotate every 5 seconds
  setInterval(() => {
    const nextIdx = (currentIndex + 1) % images.length;
    switchImage(nextIdx);
  }, 5000);
}

/* 8. INTERACTIVE TABBED AGRICULTURE GALLERY SHOWCASE */
function initGalleryTabs() {
  const tabs = document.querySelectorAll('.gallery-tab');
  const galImg = document.getElementById('galleryImg');
  const galTitle = document.getElementById('galleryTitle');
  const galDesc = document.getElementById('galleryDesc');

  if (!tabs.length || !galImg) return;

  const galleryData = [
    {
      img: 'images/tech_11zon.webp',
      title: 'Hydroponics & Soil Telemetry',
      desc: 'Wireless sensors monitor soil matrix potential, NPK values, and ambient air moisture 24/7 to adjust hydroponic micro-nutrients automatically.'
    },
    {
      img: 'images/global_11zon.webp',
      title: 'Refrigerated Fleet GPS Corridor',
      desc: 'Every container is linked to satellite telematics, maintaining exact temperature tolerance from rural farm gates to international ports.'
    },
    {
      img: 'images/hero_11zon.webp',
      title: 'Autonomous Tractor Scouting',
      desc: 'Laser-guided tractors and multispectral drones scan every crop row to detect early pest threats and calculate exact biomass index.'
    }
  ];

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      galImg.style.opacity = '0.2';
      galImg.style.transform = 'scale(0.97)';

      setTimeout(() => {
        const item = galleryData[index];
        galImg.src = item.img;
        if (galTitle) galTitle.textContent = item.title;
        if (galDesc) galDesc.textContent = item.desc;

        galImg.style.opacity = '1';
        galImg.style.transform = 'scale(1)';
      }, 250);
    });
  });
}

/* 9. LIVE AUTOMATED ACTIVITY TICKER WIDGET (BOTTOM LEFT) */
function initLiveTicker() {
  const updates = [
    '🚜 Autonomous Tractor #ST-402 finished fertilizing Field Sector B',
    '❄️ Reefer Container #AGRI-88210 temperature locked at 3.4°C',
    '🛰️ Satellite NDVI scan complete for Green Valley Orchards',
    '📦 Harvest #CROP-99412 cleared Grade A Quality Inspection',
    '💧 Hydroponic Bay #3 nutrient level automatically balanced'
  ];

  let tickerWidget = document.getElementById('liveTicker');
  if (!tickerWidget) {
    tickerWidget = document.createElement('div');
    tickerWidget.id = 'liveTicker';
    tickerWidget.className = 'live-ticker-widget';
    document.body.appendChild(tickerWidget);
  }

  let idx = 0;
  function updateTicker() {
    tickerWidget.style.opacity = '0';
    tickerWidget.style.transform = 'translateY(15px)';

    setTimeout(() => {
      tickerWidget.innerHTML = `
        <span class="live-dot"></span>
        <span>${updates[idx]}</span>
      `;
      tickerWidget.style.opacity = '1';
      tickerWidget.style.transform = 'translateY(0)';
      tickerWidget.style.transition = 'all 0.4s ease';

      idx = (idx + 1) % updates.length;
    }, 400);
  }

  updateTicker();
  setInterval(updateTicker, 6000);
}

/* 10. 3D CARD TILT ON MOUSE MOVE */
function init3DTilt() {
  const cards = document.querySelectorAll('.feat, .s-card, .p-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
  });
}

/* 11. CROP YIELD & ROI CALCULATOR */
function initCropCalculator() {
  const acresInput = document.getElementById('calcAcres');
  const lossInput = document.getElementById('calcLoss');
  const acresVal = document.getElementById('acresVal');
  const lossVal = document.getElementById('lossVal');
  const roiOut = document.getElementById('roiOutput');

  if (!acresInput || !lossInput || !roiOut) return;

  function calculate() {
    const acres = parseInt(acresInput.value) || 100;
    const loss = parseInt(lossInput.value) || 15;

    acresVal.textContent = acres + ' Acres';
    lossVal.textContent = loss + '%';

    const savedLoss = loss * 0.75;
    const estimatedSavings = Math.round(acres * 240 * (savedLoss / 10));

    roiOut.textContent = '$' + estimatedSavings.toLocaleString() + ' / yr';
  }

  acresInput.addEventListener('input', calculate);
  lossInput.addEventListener('input', calculate);
  calculate();
}

/* TOAST HELPER */
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.style.cssText = `
    background: rgba(9, 23, 18, 0.95);
    backdrop-filter: blur(12px);
    border: 1px solid ${type === 'success' ? '#10b981' : '#f59e0b'};
    color: #ffffff;
    padding: 0.9rem 1.4rem;
    border-radius: 9999px;
    font-size: 0.92rem;
    font-weight: 600;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    gap: 0.6rem;
    animation: toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  `;
  
  toast.innerHTML = `${type === 'success' ? '🌱' : '⚠️'} <span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
