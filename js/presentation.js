document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.getElementById('viewport');
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('progressDots');
  const counter = document.getElementById('slideCounter');
  const hint = document.querySelector('.hint');

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

  // Step-based transition: opacity steps with scale shrink
  function stepTransition(fromSlide, toSlide, direction) {
    if (transitioning) return;
    transitioning = true;

    const steps = [1, 0.8, 0.6, 0.4, 0.2, 0];
    const scaleSteps = [1, 0.985, 0.97, 0.955, 0.94, 0.925];
    const stepDuration = 120;
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

        // Fade in
        let inStep = steps.length - 1;
        const fadeIn = setInterval(() => {
          if (inStep < 0) {
            clearInterval(fadeIn);
            toSlide.style.opacity = 1;
            viewport.style.transform = 'scale(1)';
            transitioning = false;
            return;
          }
          toSlide.style.opacity = steps[inStep];
          viewport.style.transform = `scale(${scaleSteps[inStep]})`;
          inStep--;
        }, stepDuration);

        return;
      }
      fromSlide.style.opacity = steps[step];
      viewport.style.transform = `scale(${scaleSteps[step]})`;
      step++;
    }, stepDuration);
  }

  function goTo(index) {
    if (index < 0 || index >= TOTAL || index === current || transitioning) return;
    const from = slides[current];
    const to = slides[current];
    current = index;
    stepTransition(from, slides[current], index > current ? 1 : -1);
    updateUI();
  }

  function next() {
    if (current < TOTAL - 1) {
      goTo(current + 1);
    } else {
      // Last slide: restart or go to quiz
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
