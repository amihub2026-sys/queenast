// Replace these demo contact values before publishing.
const salonContact = {
  whatsapp: '919629990960',
  instagram: 'https://www.instagram.com/'
};
document.querySelectorAll('a[href*="wa.me/"]').forEach(link => {
  link.href = `https://wa.me/${salonContact.whatsapp}?text=${encodeURIComponent('Hi Queen Bee Aesthetic Studio, I would like to enquire about an appointment.')}`;
});
document.querySelectorAll('a[aria-label*="Instagram"]').forEach(link => { link.href = salonContact.instagram; });
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.classList.add('js-motion');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => { navLinks.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.13 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

let statsStarted = false;
const statsSection = document.querySelector('.stats-section');
const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !statsStarted) {
    statsStarted = true;
    document.querySelectorAll('[data-count]').forEach(counter => {
      const target = Number(counter.dataset.count);
      const duration = 1400;
      const started = performance.now();
      const update = (now) => {
        const progress = Math.min((now - started) / duration, 1);
        counter.textContent = Math.floor(progress * target).toLocaleString('en-IN');
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    });
  }
}, { threshold: .35 });
if (statsSection) statsObserver.observe(statsSection);

const reviews = [...document.querySelectorAll('.review')];
let currentReview = 0;
function showReview(index) {
  reviews.forEach((r, i) => r.classList.toggle('active', i === index));
}
function nextReview(){ currentReview = (currentReview + 1) % reviews.length; showReview(currentReview); }
function prevReview(){ currentReview = (currentReview - 1 + reviews.length) % reviews.length; showReview(currentReview); }
document.getElementById('reviewNext').addEventListener('click', nextReview);
document.getElementById('reviewPrev').addEventListener('click', prevReview);
setInterval(nextReview, 5000);

const dateField = document.getElementById('date');
const today = new Date();
const localISO = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
dateField.min = localISO;

const whatsappNumber = salonContact.whatsapp; // Replace with actual WhatsApp number including country code.
document.getElementById('appointmentForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const service = document.getElementById('service').value;
  const date = document.getElementById('date').value;
  const message = document.getElementById('message').value.trim();

  const text = `Hi Queen Bee Aesthetic Studio,\n\nI would like to book an appointment.\n\nName: ${name}\nPhone: ${phone}\nService: ${service}\nPreferred Date: ${date}\nMessage: ${message || '—'}`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
});

document.getElementById('year').textContent = new Date().getFullYear();

// Quick service selections lead into the same appointment form.
document.querySelectorAll('[data-service]').forEach(link => {
  link.addEventListener('click', () => { document.getElementById('service').value = link.dataset.service; });
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); navToggle.focus();
  }
});
// Hero slideshow: touch, keyboard, manual controls and reduced-motion support.
(() => {
  const carousel = document.querySelector('.hero-slider');
  const slides = [...document.querySelectorAll('.hero-slide')];
  const dots = [...document.querySelectorAll('.slider-dot')];
  const pause = document.getElementById('slidePause');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, timer, paused = motion.matches, hovered = false, startX = null;
  function schedule() {
    clearInterval(timer);
    if (!paused && !hovered && !document.hidden && !carousel.contains(document.activeElement)) timer = setInterval(() => show(index + 1), 6500);
  }
  function show(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
      slide.setAttribute('aria-hidden', String(i !== index));
      slide.inert = i !== index;
      dots[i].classList.toggle('active', i === index);
      dots[i].setAttribute('aria-current', String(i === index));
    });
  }
  function updatePause() {
    pause.textContent = paused ? '▷' : 'Ⅱ';
    pause.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
  }
  document.getElementById('slidePrev').addEventListener('click', () => { show(index - 1); schedule(); });
  document.getElementById('slideNext').addEventListener('click', () => { show(index + 1); schedule(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); schedule(); }));
  pause.addEventListener('click', () => { paused = !paused; updatePause(); schedule(); });
  carousel.addEventListener('mouseenter', () => { hovered = true; schedule(); });
  carousel.addEventListener('mouseleave', () => { hovered = false; schedule(); });
  carousel.addEventListener('focusin', schedule);
  carousel.addEventListener('focusout', () => setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); show(index + (event.key === 'ArrowRight' ? 1 : -1)); schedule();
    }
  });
  carousel.addEventListener('touchstart', event => { startX = event.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', event => {
    if (startX === null) return;
    const distance = event.changedTouches[0].clientX - startX;
    if (Math.abs(distance) > 60) { show(index + (distance < 0 ? 1 : -1)); schedule(); }
    startX = null;
  }, { passive: true });
  motion.addEventListener('change', event => { if (event.matches) { paused = true; updatePause(); schedule(); } });
  updatePause(); schedule();
})();
