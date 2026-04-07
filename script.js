function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader && !loader.classList.contains('hidden')) {
    loader.classList.add('hidden');
  }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(hideLoader, 600);
} else {
  document.addEventListener('DOMContentLoaded', () => setTimeout(hideLoader, 600));
}

setTimeout(hideLoader, 3000);

const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

const observerOptions = { threshold: 0.05, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal, .img-reveal').forEach(el => observer.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const heroTitle = document.querySelector('.hero-title');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y < window.innerHeight) {
    heroTitle.style.transform = `translateY(${y * 0.15}px)`;
  }
}, { passive: true });

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCounter = document.getElementById('lightbox-counter');
let currentSpread = null;
let currentIndex = 0;

function getSpreadImages(spread) {
  return Array.from(spread.querySelectorAll('.spread-img img'));
}

function openLightbox(spread, index) {
  currentSpread = spread;
  currentIndex = index;
  const imgs = getSpreadImages(spread);
  lightboxImg.src = imgs[currentIndex].src;
  lightboxImg.alt = imgs[currentIndex].alt;
  lightboxCounter.textContent = (currentIndex + 1) + ' / ' + imgs.length;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  currentSpread = null;
}

function navigateLightbox(dir) {
  if (!currentSpread) return;
  const imgs = getSpreadImages(currentSpread);
  currentIndex = (currentIndex + dir + imgs.length) % imgs.length;

  lightboxImg.classList.add('lightbox-fade');
  setTimeout(() => {
    lightboxImg.src = imgs[currentIndex].src;
    lightboxImg.alt = imgs[currentIndex].alt;
    lightboxImg.classList.remove('lightbox-fade');
    lightboxCounter.textContent = (currentIndex + 1) + ' / ' + imgs.length;
  }, 200);
}

document.querySelectorAll('.spread .spread-img').forEach(cell => {
  cell.addEventListener('click', () => {
    const spread = cell.closest('.spread');
    const index = parseInt(cell.dataset.index, 10);
    openLightbox(spread, index);
  });
});

lightbox.querySelector('.lightbox-close').addEventListener('click', e => {
  e.stopPropagation();
  closeLightbox();
});
lightbox.addEventListener('click', e => {
  if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-img-wrap')) {
    closeLightbox();
  }
});

lightbox.querySelector('.lightbox-prev').addEventListener('click', e => {
  e.stopPropagation();
  navigateLightbox(-1);
});
lightbox.querySelector('.lightbox-next').addEventListener('click', e => {
  e.stopPropagation();
  navigateLightbox(1);
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});
