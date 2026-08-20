document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.getElementById('viewport');
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('progressDots');
  const counter = document.getElementById('slideCounter');
  const hint = document.querySelector('.hint');

  // Create dither overlay
  const ditherOverlay = document.createElement('canvas');
  ditherOverlay.id = 'ditherOverlay';
  ditherOverlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    pointer-events: none; z-index: 100; opacity: 0; mix-blend-mode: multiply;
  `;
  document.body.appendChild(ditherOverlay);

  function generateDitherPattern(w, h) {
    ditherOverlay.width = w;
    ditherOverlay.height = h;
    const ctx = ditherOverlay.getContext('2d');
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;

    // Bayer 8x8 matrix
    const bayer = [
      [0,32,8,40,2,34,10,42],
      [48,16,56,24,50,18,58,26],
      [12,44,4,36,14,46,6,38],
      [60,28,52,20,62,30,54,22],
      [3,35,11,43,1,33,9,41],
      [51,19,59,27,49,17,57,25],
      [15,47,7,39,13,45,5,37],
      [63,31,55,23,61,29,53,21]
    ];

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const threshold = bayer[y % 8][x % 8] / 64;
        // Dither between black and the accent color (#89b4fa = 137,180,250)
        const dithered = threshold < 0.5 ? 0 : 1;
        data[i]     = dithered ? 20 : 0;   // R
        data[i + 1] = dithered ? 25 : 0;   // G
        data[i + 2] = dithered ? 40 : 0;   // B
        data[i + 3] = 255;                  // A
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  generateDitherPattern(192, 108);

  const TOTAL = slides.length;
  let current = 0;
  let transitioning = false;

  // Create progress dots
  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dotsContainer.appendChild(dot);
  }
  const dots = dotsContainer.querySelectorAll('.dot');

  function updateUI() {
    counter.textContent = `${current + 1} / ${TOTAL}`;
    dots.forEach((d, i) => {
      d.className = 'dot';
      if (i === current) d.classList.add('active');
      else if (i < current) d.classList.add('done');
    });
    hint.textContent = current === TOTAL - 1 ? 'ENTER PARA REINICIAR' : 'ESPACIO / CLICK PARA CONTINUAR';
  }

  // Pronounced step-based transition with dither
  function stepTransition(fromSlide, toSlide, direction) {
    if (transitioning) return;
    transitioning = true;

    const steps = [1, 0.82, 0.64, 0.46, 0.28, 0.14, 0];
    const scaleSteps = [1, 0.975, 0.95, 0.925, 0.90, 0.875, 0.85];
    const ditherOpacity = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9];
    const stepDuration = 160;
    let step = 0;

    // Fade out
    const fadeOut = setInterval(() => {
      if (step >= steps.length) {
        clearInterval(fadeOut);
        fromSlide.classList.remove('active');
        fromSlide.style.opacity = 0;

        // Show new slide at 0
        toSlide.classList.add('active');
        toSlide.style.opacity = 0;
        viewport.style.transform = `scale(${scaleSteps[scaleSteps.length - 1]})`;
        ditherOverlay.style.opacity = ditherOpacity[ditherOpacity.length - 1];

        // Fade in
        let inStep = steps.length - 1;
        const fadeIn = setInterval(() => {
          if (inStep < 0) {
            clearInterval(fadeIn);
            toSlide.style.opacity = 1;
            viewport.style.transform = 'scale(1)';
            ditherOverlay.style.opacity = 0;
            transitioning = false;
            return;
          }
          toSlide.style.opacity = steps[inStep];
          viewport.style.transform = `scale(${scaleSteps[inStep]})`;
          ditherOverlay.style.opacity = ditherOpacity[inStep];
          inStep--;
        }, stepDuration);

        return;
      }
      fromSlide.style.opacity = steps[step];
      viewport.style.transform = `scale(${scaleSteps[step]})`;
      ditherOverlay.style.opacity = ditherOpacity[step];
      step++;
    }, stepDuration);
  }

  function goTo(index) {
    if (index < 0 || index >= TOTAL || index === current || transitioning) return;
    const from = slides[current];
    current = index;
    stepTransition(from, slides[current], index > current ? 1 : -1);
    updateUI();
  }

  function next() {
    if (current < TOTAL - 1) {
      goTo(current + 1);
    } else {
      current = 0;
      stepTransition(slides[TOTAL - 1], slides[0], 1);
      updateUI();
    }
  }

  function prev() {
    if (current > 0) {
      goTo(current - 1);
    }
  }

  // Controls
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    } else if (e.key === 'r' || e.key === 'R') {
      current = 0;
      slides.forEach(s => { s.classList.remove('active'); s.style.opacity = 0; });
      slides[0].classList.add('active');
      slides[0].style.opacity = 1;
      viewport.style.transform = 'scale(1)';
      ditherOverlay.style.opacity = 0;
      updateUI();
    }
  });

  viewport.addEventListener('click', (e) => {
    if (e.target.closest('.closing-btn')) return;
    next();
  });

  // Touch support
  let touchStartX = 0;
  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  });
  viewport.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) {
      diff < 0 ? next() : prev();
    } else {
      next();
    }
  });

  // Init
  slides[0].classList.add('active');
  slides[0].style.opacity = 1;
  updateUI();
});
