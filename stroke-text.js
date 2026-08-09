/**
 * StrokeText Component (Vanilla JS + GSAP + SVG Implementation)
 * Replicates the React Bits StrokeText component functionality.
 */

function initStrokeText(container, options = {}) {
  if (!container || !window.gsap) return;

  const defaults = {
    text: 'HACKER HOUSE GOA',
    strokeColor: '#FFE800',
    fillColor: '#FFE800',
    strokeWidth: 2,
    drawDuration: 1.6,
    fillDelay: 0.2,
    stagger: 0.05,
    ease: 'power2.out',
    trigger: 'mount', // 'mount', 'hover', 'scroll', 'loop'
    fillMode: 'wipe', // 'wipe', 'fade', 'none'
    fontSize: 110,
    fontWeight: 900,
    letterSpacing: -2,
    fontFamily: "'JetBrains Mono', monospace",
    reverse: false,
    className: '',
    style: {}
  };

  const config = { ...defaults, ...options };
  const rawId = Math.random().toString(36).substring(2, 9);
  const wipeId = `stroke-text-wipe-${rawId}`;

  // Clear existing content
  container.innerHTML = '';
  container.className = `stroke-text ${config.trigger === 'hover' ? 'stroke-text--hover' : ''} ${config.className}`.trim();
  
  if (config.style) {
    Object.assign(container.style, config.style);
  }

  const characters = Array.from(String(config.text ?? ''));
  const dash = Math.max(config.fontSize * 7, 200);

  // Create SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'stroke-text__svg');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('aria-hidden', 'true');

  let wipeRect = null;

  if (config.fillMode === 'wipe') {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    clipPath.setAttribute('id', wipeId);
    clipPath.setAttribute('clipPathUnits', 'userSpaceOnUse');

    wipeRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    wipeRect.setAttribute('x', '0');
    wipeRect.setAttribute('y', '0');
    wipeRect.setAttribute('width', '0');
    wipeRect.setAttribute('height', '0');

    clipPath.appendChild(wipeRect);
    defs.appendChild(clipPath);
    svg.appendChild(defs);
  }

  const fontStyleStr = `font-family: ${config.fontFamily}; font-size: ${config.fontSize}px; font-weight: ${config.fontWeight}; letter-spacing: ${config.letterSpacing}px;`;

  // Stroke Text Element
  const strokeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  strokeText.setAttribute('class', 'stroke-text__stroke');
  strokeText.setAttribute('x', '0');
  strokeText.setAttribute('y', '0');
  strokeText.setAttribute('fill', 'none');
  strokeText.setAttribute('stroke', config.strokeColor);
  strokeText.setAttribute('stroke-width', config.strokeWidth);
  strokeText.setAttribute('stroke-linejoin', 'round');
  strokeText.setAttribute('stroke-linecap', 'round');
  strokeText.setAttribute('style', fontStyleStr);

  characters.forEach((char) => {
    const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    tspan.setAttribute('data-stroke-char', '');
    tspan.textContent = char;
    strokeText.appendChild(tspan);
  });

  svg.appendChild(strokeText);

  // Fill Text Element
  const fillText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  fillText.setAttribute('class', 'stroke-text__fill');
  fillText.setAttribute('x', '0');
  fillText.setAttribute('y', '0');
  fillText.setAttribute('fill', config.fillColor);
  fillText.setAttribute('stroke', 'none');
  fillText.setAttribute('style', fontStyleStr);

  if (config.fillMode === 'wipe') {
    fillText.setAttribute('clip-path', `url(#${wipeId})`);
  }

  characters.forEach((char) => {
    const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    tspan.setAttribute('data-fill-char', '');
    tspan.textContent = char;
    fillText.appendChild(tspan);
  });

  svg.appendChild(fillText);
  container.appendChild(svg);

  // Measurement and Bounding Box calculation
  let box = null;

  const measure = () => {
    try {
      const bbox = strokeText.getBBox();
      if (!bbox || !bbox.width) return;

      const pad = Math.max(Number(config.strokeWidth) || 1, config.fontSize * 0.1);
      box = {
        x: bbox.x - pad,
        y: bbox.y - pad,
        width: bbox.width + pad * 2,
        height: bbox.height + pad * 2
      };

      svg.setAttribute('viewBox', `${box.x} ${box.y} ${box.width} ${box.height}`);
      container.style.setProperty('--stroke-text-height', `${Math.round(box.height)}px`);

      if (wipeRect) {
        wipeRect.setAttribute('x', box.x);
        wipeRect.setAttribute('y', box.y);
        wipeRect.setAttribute('height', box.height);
      }

      setupAnimation();
    } catch (e) {
      console.warn('StrokeText measurement failed:', e);
    }
  };

  let timeline = null;

  const setupAnimation = () => {
    if (!box) return;

    const strokes = gsap.utils.toArray(container.querySelectorAll('[data-stroke-char]'));
    const fills = gsap.utils.toArray(container.querySelectorAll('[data-fill-char]'));
    const wipe = wipeRect;

    if (!strokes.length) return;

    const fillEnabled = config.fillMode !== 'none';
    const useWipe = fillEnabled && config.fillMode === 'wipe';
    const fillDuration = Math.max(0.4, config.drawDuration * 0.5);
    const staggerConfig = config.reverse ? { each: config.stagger, from: 'end' } : config.stagger;
    const targets = [...strokes, ...fills, wipe].filter(Boolean);

    const setStart = () => {
      gsap.killTweensOf(targets);
      gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: dash });
      gsap.set(fills, { opacity: useWipe ? 1 : 0 });
      if (wipe) gsap.set(wipe, { attr: { width: 0 } });
    };

    const setEnd = () => {
      gsap.killTweensOf(targets);
      gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: 0 });
      gsap.set(fills, { opacity: fillEnabled ? 1 : 0 });
      if (wipe) gsap.set(wipe, { attr: { width: fillEnabled ? box.width : 0 } });
    };

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setEnd();
      return;
    }

    const build = () => {
      setStart();
      const tl = gsap.timeline({
        paused: true,
        repeat: config.trigger === 'loop' ? -1 : 0,
        repeatDelay: config.trigger === 'loop' ? 0.9 : 0,
        defaults: { overwrite: 'auto' }
      });

      tl.to(strokes, { strokeDashoffset: 0, duration: config.drawDuration, ease: config.ease, stagger: staggerConfig }, 0);

      if (useWipe && wipe) {
        tl.to(
          wipe,
          { attr: { width: box.width }, duration: fillDuration, ease: 'power2.inOut' },
          config.drawDuration + config.fillDelay
        );
      } else if (fillEnabled) {
        tl.to(
          fills,
          { opacity: 1, duration: fillDuration, ease: 'power2.out', stagger: staggerConfig },
          config.drawDuration + config.fillDelay
        );
      }

      return tl;
    };

    if (timeline) timeline.kill();

    if (config.trigger === 'hover') {
      setEnd();
      const play = () => {
        timeline?.kill();
        timeline = build();
        timeline.play(0);
      };
      container.addEventListener('pointerenter', play);
      container.addEventListener('mouseenter', play);
    } else {
      timeline = build();
      timeline.play(0);
      if (config.triggerOnHover) {
        container.style.cursor = 'pointer';
        const play = () => {
          timeline?.kill();
          timeline = build();
          timeline.play(0);
        };
        container.addEventListener('pointerenter', play);
        container.addEventListener('mouseenter', play);
      }
    }
  };

  // Initial measure after fonts load
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(measure).catch(measure);
  } else {
    setTimeout(measure, 100);
  }
}

// Auto-initialize when target element exists
function initAllStrokeText() {
  const strokeHeroEl = document.querySelector('.stroke-hero-title');
  if (strokeHeroEl) {
    initStrokeText(strokeHeroEl, {
      text: 'HACKER HOUSE GOA',
      strokeColor: '#FFE800',
      fillColor: '#FFE800',
      strokeWidth: 2,
      drawDuration: 1.6,
      fillDelay: 0.2,
      stagger: 0.05,
      ease: 'power2.out',
      trigger: 'mount',
      fillMode: 'wipe',
      fontSize: 100,
      fontWeight: 900,
      letterSpacing: -2,
      fontFamily: "'JetBrains Mono', monospace",
      triggerOnHover: true
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllStrokeText);
} else {
  initAllStrokeText();
}
