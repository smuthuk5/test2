// script.js - lightweight carousel logic (replace existing script.js)

document.addEventListener('DOMContentLoaded', function () {
  const carousel = document.getElementById('carousel');
  if (!carousel) return;

  const viewport = carousel.querySelector('.viewport');
  const track = carousel.querySelector('.track');
  const slides = Array.from(carousel.querySelectorAll('.slide'));
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');

  // Configuration
  const INTERVAL_MS = 4500;
  let currentIndex = 0;
  let autoplayTimer = null;

  function updateTransform() {
    // Ensure slide width equals viewport width (one slide visible)
    const vw = viewport.getBoundingClientRect().width;
    track.style.transform = `translateX(${-currentIndex * vw}px)`;
  }

  function moveTo(idx) {
    if (slides.length === 0) return;
    currentIndex = Math.max(0, Math.min(idx, slides.length - 1));
    updateTransform();
  }

  function next() {
    moveTo((currentIndex + 1) % slides.length);
  }
  function prev() {
    moveTo((currentIndex - 1 + slides.length) % slides.length);
  }

  // Buttons
  if (nextBtn) {
    nextBtn.addEventListener('click', function () { next(); restartAuto(); });
    nextBtn.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); }});
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', function () { prev(); restartAuto(); });
    prevBtn.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); prev(); }});
  }

  // Autoplay
  function startAuto() {
    stopAuto();
    autoplayTimer = setInterval(next, INTERVAL_MS);
  }
  function stopAuto() {
    if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
  }
  function restartAuto() { stopAuto(); startAuto(); }

  // Pause on hover/focus for accessibility
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);
  carousel.addEventListener('focusin', stopAuto);
  carousel.addEventListener('focusout', startAuto);

  // Keyboard navigation for entire carousel
  carousel.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // Recompute on resize
  let resizeObserver = null;
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => updateTransform());
    resizeObserver.observe(viewport);
  } else {
    window.addEventListener('resize', updateTransform);
  }

  // Ensure first layout
  // If slides are empty, add a simple placeholder
  if (slides.length === 0) {
    const placeholder = document.createElement('div');
    placeholder.className = 'slide';
    placeholder.innerHTML = '<div class="product-card"><div class="prod-img" style="min-height:120px;background:#f1f5f9"></div><div class="prod-info"><h3>No products</h3><p>Please add product files.</p></div></div>';
    track.appendChild(placeholder);
  }

  // Initialize
  moveTo(0);
  startAuto();

  // Expose for debug or manual control
  window.__pulseCarousel = {
    moveTo,
    next,
    prev,
    startAuto,
    stopAuto,
    _getIndex: () => currentIndex
  };
});
