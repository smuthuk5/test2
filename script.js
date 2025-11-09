
document.addEventListener("DOMContentLoaded", () => {
  // older toggle buttons used to swap text; keep compatibility for other pages
  const buttons = document.querySelectorAll(".toggle");
  buttons.forEach(button => {
    button.addEventListener("click", (e) => {
      // stop propagation only for buttons so clicking elsewhere on the card follows the link
      e.stopPropagation();
      const display = button.nextElementSibling;
      // if price-display contains numeric spans, just toggle show class
      if (display && display.querySelector('.with-price')) {
        display.classList.toggle('show');
        button.textContent = display.classList.contains('show') ? 'Hide Price' : 'Show Price';
        return;
      }
      const withWarranty = button.getAttribute("data-with");
      const withoutWarranty = button.getAttribute("data-without");
      if (display.textContent.includes(withWarranty) || display.textContent.includes(withoutWarranty)) {
        display.textContent = "Click to view price";
      } else {
        display.textContent = `With Warranty: ${withWarranty} | Without: ${withoutWarranty}`;
      }
    });
  });
});


document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.product-card').forEach(card => {
    const base = parseInt(card.getAttribute('data-base') || 0, 10);
    const withoutEl = card.querySelector('.without-price');
    const withEl = card.querySelector('.with-price');
    if (!isNaN(base) && withoutEl && withEl) {
      const withPrice = Math.round(base * 1.4);
      withoutEl.textContent = base.toLocaleString('en-IN');
      withEl.textContent = withPrice.toLocaleString('en-IN');
    }
  });
});

// ensure product pages update warranty price if checkbox present

document.addEventListener('DOMContentLoaded', function(){
  var cb = document.getElementById('warrantyCheckbox');
  if(cb){
    // call update if function exists in page or emulate behavior
    var base = parseInt(cb.dataset.base || 16000, 10);
    var priceEl = document.getElementById('priceValue');
    var labelEl = document.getElementById('priceLabel');
    function applyUpdate(){
      var addon = Math.round(base * 0.4);
      if(cb.checked){
        priceEl.textContent = (base + addon).toLocaleString('en-IN');
        labelEl.textContent = 'Price (with warranty): ₹';
      } else {
        priceEl.textContent = base.toLocaleString('en-IN');
        labelEl.textContent = 'Price (without warranty): ₹';
      }
    }
    cb.addEventListener('change', applyUpdate);
    applyUpdate();
  }
});

// AUTO-FIX: Carousel resilience and accessibility
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const carousel = document.getElementById('carousel');
    if(!carousel) return;
    const track = carousel.querySelector('.track');
    const slides = carousel.querySelectorAll('.slide');
    // If no slides found, ensure at least a placeholder
    if(slides.length === 0){
      const placeholder = document.createElement('div');
      placeholder.className = 'slide';
      placeholder.innerHTML = '<div class="product-card card-placeholder"><div class="prod-img" style="min-height:120px;background:#eee;display:flex;align-items:center;justify-content:center">No items</div><div class="prod-info"><h3>No products</h3><p>Please check product data.</p></div></div>';
      track.appendChild(placeholder);
    }
    // Ensure first slide is visible by forcing transform to 0 on init
    try{
      track.style.transform = 'translateX(0px)';
    }catch(e){}
    // Add basic keyboard accessibility to carousel controls (if present)
    const prev = carousel.querySelector('.carousel-prev');
    const next = carousel.querySelector('.carousel-next');
    [prev,next].forEach(btn=>{
      if(btn){
        btn.setAttribute('tabindex','0');
        btn.addEventListener('keydown', function(e){
          if(e.key === 'Enter' || e.key === ' '){
            e.preventDefault();
            btn.click();
          }
        });
      }
    });

    // Add a small ARIA role to track for assistive tech
    track.setAttribute('role','list');

    // Make autoplay pause on focus to avoid motion for keyboard users
    const pauseBtn = document.getElementById('pause-btn');
    let autoplayTimer = null;
    function startAuto(){
      if(autoplayTimer) clearInterval(autoplayTimer);
      autoplayTimer = setInterval(()=> {
        // prefer using next button if available
        if(next) next.click();
      }, 4500);
      if(pauseBtn) pauseBtn.textContent = '⏸ Pause';
    }
    function stopAuto(){
      if(autoplayTimer) clearInterval(autoplayTimer);
      autoplayTimer = null;
      if(pauseBtn) pauseBtn.textContent = '▶ Play';
    }
    // start autoplay if it exists in original script logic
    startAuto();
    // Pause autoplay when a slide or control receives focus
    carousel.addEventListener('focusin', stopAuto);
    carousel.addEventListener('focusout', startAuto);
  });
})();



// AUTO-FIX: Dots and timing configuration + lightweight slider option
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const carousel = document.getElementById('carousel');
    if(!carousel) return;
    const track = carousel.querySelector('.track');
    const slides = Array.from(carousel.querySelectorAll('.slide'));
    const dotsContainer = carousel.querySelector('.dots');
    // Configurable timing (ms) - adjust as needed
    const CAROUSEL_INTERVAL = 4500; // change this value to speed up/slow down autoplay
    let currentIndex = 0;
    // Lightweight slider flag (if true, use this simple implementation)
    const USE_LIGHT_WEIGHT_SLIDER = true;

    function createDots(){
      if(!dotsContainer) return;
      dotsContainer.innerHTML = '';
      slides.forEach((s, i) =>{
        const btn = document.createElement('button');
        btn.className = 'dot-btn';
        btn.setAttribute('aria-label', 'Slide ' + (i+1));
        btn.setAttribute('data-index', i);
        btn.style.margin = '0 6px';
        btn.style.width = '10px';
        btn.style.height = '10px';
        btn.style.borderRadius = '50%';
        btn.style.border = 'none';
        btn.style.background = i===0 ? '#0b5fff' : '#ddd';
        btn.addEventListener('click', ()=> moveTo(i));
        dotsContainer.appendChild(btn);
      });
    }
    function updateDots(){
      if(!dotsContainer) return;
      Array.from(dotsContainer.children).forEach((b, i)=> b.style.background = (i===currentIndex? '#0b5fff':'#ddd'));
    }
    function moveTo(i){
      if(!track) return;
      currentIndex = Math.max(0, Math.min(i, slides.length-1));
      const slideWidth = carousel.getBoundingClientRect().width; // include gap
      track.style.transform = 'translateX(' + (-currentIndex * carousel.getBoundingClientRect().width) + 'px)';
      updateDots();
    }
    // autoplay handling
    let timer = null;
    function startAuto(){ if(timer) clearInterval(timer); timer = setInterval(()=> moveTo((currentIndex+1)%slides.length), CAROUSEL_INTERVAL); }
    function stopAuto(){ if(timer) clearInterval(timer); timer = null; }
    // init
    createDots();
    moveTo(0);
    startAuto();
    // pause on hover/focus for accessibility
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);
    carousel.addEventListener('focusin', stopAuto);
    carousel.addEventListener('focusout', startAuto);

    // Expose to window for debugging/change interval easily
    window.__pulseCarousel = { moveTo, startAuto, stopAuto, setInterval: (ms)=>{ if(ms>500) { stopAuto(); startAuto(); } } };
  });
})();

