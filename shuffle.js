/**
 * Shuffle Text Component (Vanilla JS + GSAP Implementation)
 * Replicates the React Bits Shuffle component functionality.
 */

function initShuffle(element, options = {}) {
  if (!element || !window.gsap) return;

  const defaults = {
    shuffleDirection: 'right', // 'right', 'left', 'up', 'down'
    duration: 0.35,
    ease: 'power3.out',
    shuffleTimes: 2,
    animationMode: 'evenodd', // 'evenodd' or 'random'
    stagger: 0.03,
    scrambleCharset: 'X01#$&%*+<>{}[]~',
    triggerOnHover: true
  };

  const config = { ...defaults, ...options };
  const originalText = element.dataset.text || element.textContent.trim();
  element.dataset.text = originalText;

  let isPlaying = false;

  function buildAndPlay() {
    if (isPlaying) return;
    isPlaying = true;

    // Clear content and ensure element is visible
    element.innerHTML = '';
    element.style.visibility = 'visible';

    const chars = originalText.split('');
    const strips = [];

    // Helper for random character selection
    const getRandomChar = () => {
      if (config.scrambleCharset) {
        return config.scrambleCharset.charAt(Math.floor(Math.random() * config.scrambleCharset.length));
      }
      return originalText.charAt(Math.floor(Math.random() * originalText.length));
    };

    chars.forEach((ch) => {
      if (ch === ' ') {
        const spaceSpan = document.createElement('span');
        spaceSpan.innerHTML = '&nbsp;';
        spaceSpan.style.display = 'inline-block';
        element.appendChild(spaceSpan);
        return;
      }

      // Create outer wrapper with overflow hidden
      const wrap = document.createElement('span');
      wrap.className = 'shuffle-char-wrapper';
      wrap.style.display = 'inline-block';
      wrap.style.overflow = 'hidden';
      wrap.style.verticalAlign = 'bottom';
      wrap.style.position = 'relative';

      // Inner strip containing target character + scrambled glyphs
      const inner = document.createElement('span');
      inner.className = 'shuffle-char-strip';
      inner.style.display = 'inline-block';
      inner.style.whiteSpace = (config.shuffleDirection === 'up' || config.shuffleDirection === 'down') ? 'normal' : 'nowrap';
      inner.style.willChange = 'transform';

      // Measure character bounding size
      const measureSpan = document.createElement('span');
      measureSpan.className = 'shuffle-char';
      measureSpan.style.visibility = 'hidden';
      measureSpan.style.position = 'absolute';
      measureSpan.textContent = ch;
      element.appendChild(measureSpan);

      const w = measureSpan.getBoundingClientRect().width || 24;
      const h = measureSpan.getBoundingClientRect().height || 36;
      element.removeChild(measureSpan);

      wrap.style.width = w + 'px';
      if (config.shuffleDirection === 'up' || config.shuffleDirection === 'down') {
        wrap.style.height = h + 'px';
      }

      const rolls = Math.max(1, Math.floor(config.shuffleTimes));

      // Create target character element
      const targetCharNode = document.createElement('span');
      targetCharNode.className = 'shuffle-char';
      targetCharNode.textContent = ch;
      targetCharNode.style.display = (config.shuffleDirection === 'up' || config.shuffleDirection === 'down') ? 'block' : 'inline-block';
      targetCharNode.style.width = w + 'px';
      targetCharNode.style.textAlign = 'center';

      // Build strip sequence based on direction
      if (config.shuffleDirection === 'right' || config.shuffleDirection === 'down') {
        inner.appendChild(targetCharNode);
        for (let i = 0; i < rolls; i++) {
          const scrambleNode = document.createElement('span');
          scrambleNode.className = 'shuffle-char';
          scrambleNode.textContent = getRandomChar();
          scrambleNode.style.display = (config.shuffleDirection === 'up' || config.shuffleDirection === 'down') ? 'block' : 'inline-block';
          scrambleNode.style.width = w + 'px';
          scrambleNode.style.textAlign = 'center';
          inner.appendChild(scrambleNode);
        }
      } else {
        for (let i = 0; i < rolls; i++) {
          const scrambleNode = document.createElement('span');
          scrambleNode.className = 'shuffle-char';
          scrambleNode.textContent = getRandomChar();
          scrambleNode.style.display = (config.shuffleDirection === 'up' || config.shuffleDirection === 'down') ? 'block' : 'inline-block';
          scrambleNode.style.width = w + 'px';
          scrambleNode.style.textAlign = 'center';
          inner.appendChild(scrambleNode);
        }
        inner.appendChild(targetCharNode);
      }

      wrap.appendChild(inner);
      element.appendChild(wrap);

      // Determine translation coordinates
      const steps = rolls;
      let startX = 0, finalX = 0, startY = 0, finalY = 0;

      if (config.shuffleDirection === 'right') {
        startX = -steps * w;
        finalX = 0;
      } else if (config.shuffleDirection === 'left') {
        startX = 0;
        finalX = -steps * w;
      } else if (config.shuffleDirection === 'down') {
        startY = -steps * h;
        finalY = 0;
      } else if (config.shuffleDirection === 'up') {
        startY = 0;
        finalY = -steps * h;
      }

      if (config.shuffleDirection === 'left' || config.shuffleDirection === 'right') {
        gsap.set(inner, { x: startX, y: 0 });
        inner.dataset.finalX = finalX;
      } else {
        gsap.set(inner, { y: startY, x: 0 });
        inner.dataset.finalY = finalY;
      }

      strips.push({ inner, isVertical: (config.shuffleDirection === 'up' || config.shuffleDirection === 'down') });
    });

    // Timeline Animation
    const tl = gsap.timeline({
      onComplete: () => {
        isPlaying = false;
      }
    });

    const isVert = (config.shuffleDirection === 'up' || config.shuffleDirection === 'down');

    if (config.animationMode === 'evenodd') {
      const odd = strips.filter((_, i) => i % 2 === 1);
      const even = strips.filter((_, i) => i % 2 === 0);

      const oddNodes = odd.map(s => s.inner);
      const evenNodes = even.map(s => s.inner);

      const oddTotal = config.duration + Math.max(0, odd.length - 1) * config.stagger;
      const evenStart = odd.length ? oddTotal * 0.6 : 0;

      if (oddNodes.length) {
        const vars = { duration: config.duration, ease: config.ease, stagger: config.stagger };
        if (isVert) vars.y = (i, t) => parseFloat(t.dataset.finalY || 0);
        else vars.x = (i, t) => parseFloat(t.dataset.finalX || 0);
        tl.to(oddNodes, vars, 0);
      }

      if (evenNodes.length) {
        const vars = { duration: config.duration, ease: config.ease, stagger: config.stagger };
        if (isVert) vars.y = (i, t) => parseFloat(t.dataset.finalY || 0);
        else vars.x = (i, t) => parseFloat(t.dataset.finalX || 0);
        tl.to(evenNodes, vars, evenStart);
      }
    } else {
      strips.forEach((s) => {
        const vars = { duration: config.duration, ease: config.ease };
        if (isVert) vars.y = parseFloat(s.inner.dataset.finalY || 0);
        else vars.x = parseFloat(s.inner.dataset.finalX || 0);
        tl.to(s.inner, vars, Math.random() * 0.1);
      });
    }
  }

  // Trigger initial play
  buildAndPlay();

  // Attach hover listener
  if (config.triggerOnHover) {
    element.addEventListener('mouseenter', buildAndPlay);
  }
}

// Auto-initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  const titleEl = document.querySelector('.shuffle-hero-title');
  const subEl = document.querySelector('.shuffle-hero-sub');

  if (titleEl) {
    initShuffle(titleEl, {
      shuffleDirection: 'right',
      duration: 0.35,
      animationMode: 'evenodd',
      shuffleTimes: 2,
      ease: 'power3.out',
      stagger: 0.03,
      triggerOnHover: true
    });
  }

  if (subEl) {
    initShuffle(subEl, {
      shuffleDirection: 'right',
      duration: 0.35,
      animationMode: 'evenodd',
      shuffleTimes: 2,
      ease: 'power3.out',
      stagger: 0.02,
      triggerOnHover: true
    });
  }
});
