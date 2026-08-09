/**
 * Hacker House Goa 2026 — #FrameInGoa Engine
 * Team ProofLabs
 * Direct Interactive Canvas Renderer (Format A: Circular PFP, Format B: Builder ID, Format C: X Banner)
 */

function initApp() {
  const canvas = document.getElementById('outputCanvas');
  const ctx = canvas.getContext('2d');
  const canvasWrapper = document.getElementById('canvasWrapper');
  const canvasHint = document.getElementById('canvasHint');

  const photoInput = document.getElementById('photoInput');
  const dropzone = document.getElementById('dropzone');
  const dropzonePrompt = document.getElementById('dropzonePrompt');
  const fileInfo = document.getElementById('fileInfo');
  const fileName = document.getElementById('fileName');
  const btnRemoveFile = document.getElementById('btnRemoveFile');

  const photoAdjustGroup = document.getElementById('photoAdjust');
  const photoZoomSlider = document.getElementById('photoZoom');
  const btnResetPhoto = document.getElementById('btnResetPhoto');

  const btnFormatB = document.getElementById('btnFormatB');
  const btnFormatA = document.getElementById('btnFormatA');
  const btnFormatC = document.getElementById('btnFormatC');
  const idCardInputs = document.getElementById('idCardInputs');

  const inputName = document.getElementById('inputName');
  const inputRole = document.getElementById('inputRole');
  const inputSkills = document.getElementById('inputSkills');
  const inputTeam = document.getElementById('inputTeam');
  const inputTitle = document.getElementById('inputTitle');
  const btnRandomTitle = document.getElementById('btnRandomTitle');

  const btnDownload = document.getElementById('btnDownload');
  const btnShareX = document.getElementById('btnShareX');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const loadingText = document.getElementById('loadingText');

  let noisePattern = null;

  // Preload Logo
  const logoImg = new Image();
  (function loadLogoSafe() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'assets/logo.svg');
    xhr.responseType = 'blob';
    xhr.onload = function() {
      const reader = new FileReader();
      reader.onloadend = () => { logoImg.src = reader.result; logoImg.onload = () => renderCanvas(); };
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = function() { logoImg.src = 'assets/logo.svg'; logoImg.onload = () => renderCanvas(); };
    xhr.send();
  })();

  // Preload Background Image (bg.jpeg)
  const bgImg = new Image();
  (function loadBgSafe() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'assets/bg.jpeg');
    xhr.responseType = 'blob';
    xhr.onload = function() {
      const reader = new FileReader();
      reader.onloadend = () => { bgImg.src = reader.result; bgImg.onload = () => renderCanvas(); };
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = function() { bgImg.src = 'assets/bg.jpeg'; bgImg.onload = () => renderCanvas(); };
    xhr.send();
  })();


  // Application State
  const state = {
    format: 'formatB', // 'formatB' | 'formatA' | 'formatC'
    uploadedImage: null,
    zoom: 1.0,
    panX: 0,
    panY: 0,
    name: 'Ish Praful Chaniyara',
    role: 'AI Engineer',
    skills: 'React, AI/ML, Flutter',
    team: 'ProofLabs',
    title: 'Edge Case Wrangler',
    serialNumber: '#HHG-2026-' + String(Math.floor(Math.random() * 9000) + 1000),
    batchStatus: 'ALPHA // FIRST WAVE',
    pfpBorderThickness: 10,
    pfpBorderPadding: 16
  };

  // Sync state values with inputs on load
  if (inputName) inputName.value = state.name;
  if (inputRole) inputRole.value = state.role;
  if (inputSkills) inputSkills.value = state.skills;
  if (inputTeam) inputTeam.value = state.team;
  if (inputTitle) inputTitle.value = state.title;

  const presetTitles = [
    'Pixel Pirate', 'Protocol Architect', 'Prompt Alchemist', 'Byte Bandit',
    'Jungle Coder', 'Gas Optimizer', 'Merge Conflict Mystic', 'Async Custodian',
    'Salt-Crusted Tinkerer', 'Stack Overflow Sage', 'Terminal Wizard', 'Kernel Runner',
    'Ship It Shaman', 'Cache Whisperer', 'Zero Day Dreamer', 'Refactor Ronin',
    'Deadline Defier', 'Debug Yogi', 'Edge Case Wrangler', 'Goa Growth Hacker'
  ];

  // Initial Render
  renderCanvas();
  if (document.fonts) {
    document.fonts.ready.then(() => renderCanvas());
  }

  // Initialize Title Animation
  const heroTitle = document.querySelector('.stroke-hero-title');
  if (typeof initStrokeText === 'function' && heroTitle) {
    initStrokeText(heroTitle, {
      text: 'HACKER HOUSE GOA',
      strokeColor: '#FFE800',
      fillColor: '#FFE800',
      strokeWidth: 2,
      drawDuration: 1.6,
      fillDelay: 0.2,
      stagger: 0.05,
      ease: 'power2.out',
      trigger: 'loop'
    });
  }

  // FORMAT SWITCHING
  [btnFormatB, btnFormatA, btnFormatC].forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const newFormat = btn.id === 'btnFormatB' ? 'formatB' : (btn.id === 'btnFormatA' ? 'formatA' : 'formatC');
      setFormat(newFormat);
    });
  });

  const pfpInputs = document.getElementById('pfpInputs');
  const pfpThicknessInput = document.getElementById('pfpBorderThickness');
  const pfpPaddingInput = document.getElementById('pfpBorderPadding');

  function setFormat(newFormat) {
    state.format = newFormat;

    [btnFormatB, btnFormatA, btnFormatC].forEach(b => b.classList.remove('active'));
    if (newFormat === 'formatB') {
      btnFormatB.classList.add('active');
    } else if (newFormat === 'formatA') {
      btnFormatA.classList.add('active');
    } else {
      btnFormatC.classList.add('active');
    }

    if (newFormat === 'formatA') {
      if (idCardInputs) idCardInputs.classList.add('hidden');
      if (pfpInputs) pfpInputs.classList.remove('hidden');
    } else {
      if (idCardInputs) idCardInputs.classList.remove('hidden');
      if (pfpInputs) pfpInputs.classList.add('hidden');
    }

    if (canvasWrapper) canvasWrapper.dataset.format = newFormat;
    renderCanvas();
  }

  // LIVE INPUT HANDLERS
  inputName.addEventListener('input', (e) => { state.name = e.target.value; renderCanvas(); });
  inputRole.addEventListener('input', (e) => { state.role = e.target.value; renderCanvas(); });
  inputSkills.addEventListener('input', (e) => { state.skills = e.target.value; renderCanvas(); });
  inputTeam.addEventListener('input', (e) => { state.team = e.target.value; renderCanvas(); });
  inputTitle.addEventListener('input', (e) => { state.title = e.target.value; renderCanvas(); });

  if (pfpThicknessInput) pfpThicknessInput.addEventListener('input', (e) => { state.pfpBorderThickness = parseInt(e.target.value, 10); renderCanvas(); });
  if (pfpPaddingInput) pfpPaddingInput.addEventListener('input', (e) => { state.pfpBorderPadding = parseInt(e.target.value, 10); renderCanvas(); });

  btnRandomTitle.addEventListener('click', (e) => {
    e.preventDefault();
    const chosenTitle = presetTitles[Math.floor(Math.random() * presetTitles.length)];
    inputTitle.value = chosenTitle;
    state.title = chosenTitle;
    renderCanvas();
  });

  // PHOTO UPLOAD & HEIC CONVERSION
  dropzone.addEventListener('click', (e) => {
    if (e.target !== btnRemoveFile) photoInput.click();
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--color-neon-yellow)';
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.style.borderColor = '';
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = '';
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  photoInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  });

  btnRemoveFile.addEventListener('click', (e) => {
    e.stopPropagation();
    state.uploadedImage = null;
    state.zoom = 1.0;
    state.panX = 0;
    state.panY = 0;
    photoInput.value = '';
    dropzonePrompt.classList.remove('hidden');
    fileInfo.classList.add('hidden');
    photoAdjustGroup.classList.add('hidden');
    canvasHint.classList.add('hidden');
    canvasWrapper.removeAttribute('data-has-photo');
    renderCanvas();
  });

  async function handleFile(file) {
    try {
      showLoading('Processing image...');
      let imageBlob = file;

      const isHEIC = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
      if (isHEIC && typeof heic2any !== 'undefined') {
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.92
        });
        imageBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          state.uploadedImage = img;
          state.zoom = 1.0;
          state.panX = 0;
          state.panY = 0;
          photoZoomSlider.value = 1.0;

          fileName.textContent = file.name;
          dropzonePrompt.classList.add('hidden');
          fileInfo.classList.remove('hidden');
          photoAdjustGroup.classList.remove('hidden');
          canvasHint.classList.remove('hidden');
          canvasWrapper.dataset.hasPhoto = 'true';

          hideLoading();
          renderCanvas();
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(imageBlob);
    } catch (err) {
      console.error('File load error:', err);
      alert('Could not process image file. Please try a standard JPG/PNG.');
      hideLoading();
    }
  }

  // INTERACTIVE PHOTO ZOOM & PAN ON CANVAS / SLIDER
  photoZoomSlider.addEventListener('input', (e) => {
    state.zoom = parseFloat(e.target.value);
    renderCanvas();
  });

  btnResetPhoto.addEventListener('click', () => {
    state.zoom = 1.0;
    state.panX = 0;
    state.panY = 0;
    photoZoomSlider.value = 1.0;
    renderCanvas();
  });

  function isHoveringPhotoArea(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    if (state.format === 'formatB') {
      return x >= 60 && x <= 60 + 360 && y >= 380 && y <= 380 + 480;
    } else if (state.format === 'formatA') {
      const cx = 540, cy = 540, r = 400;
      const dx = x - cx;
      const dy = y - cy;
      return (dx * dx + dy * dy) <= (r * r);
    } else if (state.format === 'formatC') {
      return x >= 60 && x <= 60 + 240 && y >= 40 && y <= 40 + 320;
    }
    return false;
  }

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialPanX = 0;
  let initialPanY = 0;

  canvasWrapper.addEventListener('mousedown', (e) => {
    if (!state.uploadedImage) return;
    if (!isHoveringPhotoArea(e.clientX, e.clientY)) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialPanX = state.panX;
    initialPanY = state.panY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging || !state.uploadedImage) return;
    const dx = (e.clientX - startX) * (canvas.width / canvasWrapper.clientWidth);
    const dy = (e.clientY - startY) * (canvas.height / canvasWrapper.clientHeight);
    state.panX = initialPanX + dx;
    state.panY = initialPanY + dy;
    renderCanvas();
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  canvasWrapper.addEventListener('touchstart', (e) => {
    if (!state.uploadedImage || e.touches.length !== 1) return;
    if (!isHoveringPhotoArea(e.touches[0].clientX, e.touches[0].clientY)) return;
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    initialPanX = state.panX;
    initialPanY = state.panY;
  }, { passive: true });

  canvasWrapper.addEventListener('touchmove', (e) => {
    if (!isDragging || !state.uploadedImage || e.touches.length !== 1) return;
    const dx = (e.touches[0].clientX - startX) * (canvas.width / canvasWrapper.clientWidth);
    const dy = (e.touches[0].clientY - startY) * (canvas.height / canvasWrapper.clientHeight);
    state.panX = initialPanX + dx;
    state.panY = initialPanY + dy;
    renderCanvas();
  }, { passive: true });

  canvasWrapper.addEventListener('touchend', () => { isDragging = false; });

  canvasWrapper.addEventListener('wheel', (e) => {
    if (!state.uploadedImage) return;
    if (!isHoveringPhotoArea(e.clientX, e.clientY)) return;
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
    let newZoom = Math.min(Math.max(1.0, state.zoom + zoomDelta), 3.0);
    state.zoom = newZoom;
    photoZoomSlider.value = newZoom;
    renderCanvas();
  }, { passive: false });

  // EXPORT ACTIONS
  btnDownload.addEventListener('click', downloadCanvasImage);
  btnShareX.addEventListener('click', shareToXIntent);

  // RENDER ENGINE
  function renderCanvas() {
    noisePattern = null;
    try {
      if (state.format === 'formatB') {
        canvas.width = 900;
        canvas.height = 1600;
        renderFormatB_IDCard();
      } else if (state.format === 'formatA') {
        canvas.width = 1080;
        canvas.height = 1080;
        renderFormatA_PFPOverlay();
      } else {
        canvas.width = 1500;
        canvas.height = 500;
        renderFormatC_Banner();
      }
    } catch (err) {
      console.error('Canvas render error:', err);
    }
  }

  /**
   * Helper function to fit text dynamic font size inside specified max width
   */
  function drawAutoFittedText(ctx, text, x, y, maxWidth, baseFontSize, fontFamily, color) {
    if (!text) return;
    let fontSize = baseFontSize;
    ctx.font = `900 ${fontSize}px ${fontFamily}`;

    while (ctx.measureText(text).width > maxWidth && fontSize > 16) {
      fontSize -= 1;
      ctx.font = `900 ${fontSize}px ${fontFamily}`;
    }

    let textToDraw = text;
    if (ctx.measureText(textToDraw).width > maxWidth) {
      while (ctx.measureText(textToDraw + '...').width > maxWidth && textToDraw.length > 0) {
        textToDraw = textToDraw.slice(0, -1);
      }
      textToDraw += '...';
    }

    ctx.fillStyle = color;
    ctx.fillText(textToDraw, x, y);
  }

  /**
   * FORMAT B: BUILDER ID CARD
   */
  function renderFormatB_IDCard() {
    const w = 900;
    const h = 1600;

    ctx.clearRect(0, 0, w, h);
    ctx.save();

    // 1. Draw Base Background (Beach Theme image)
    if (bgImg.complete && bgImg.naturalWidth > 0) {
      const imgRatio = bgImg.naturalWidth / bgImg.naturalHeight;
      const canvasRatio = w / h;
      let drawW = w;
      let drawH = h;
      let drawX = 0;
      let drawY = 0;

      if (imgRatio > canvasRatio) {
        drawW = h * imgRatio;
        drawX = (w - drawW) / 2;
      } else {
        drawH = w / imgRatio;
        drawY = (h - drawH) / 2;
      }
      ctx.drawImage(bgImg, drawX, drawY, drawW, drawH);
    } else {
      ctx.fillStyle = '#0B3C2D';
      ctx.fillRect(0, 0, w, h);
    }

    // 2. Top Header
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    ctx.fillStyle = '#F2F542';
    ctx.font = '900 24px "Cabinet Grotesk", "Space Grotesk", sans-serif';
    ctx.fillText('HACKER HOUSE', 60, 90);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 76px "Cabinet Grotesk", "Space Grotesk", sans-serif';
    ctx.fillText('GOA 2026', 58, 120);

    // 3. Pink Goa Sticker
    ctx.save();
    ctx.translate(w - 140, 120);
    ctx.rotate(6 * Math.PI / 180);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;

    ctx.fillStyle = '#FF007F';
    drawRoundedRect(ctx, -70, -35, 140, 70, 20, true, false);

    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#F2F542';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 38px "Noto Sans Devanagari", sans-serif';
    ctx.fillText('गोवा', 0, 4);
    ctx.restore();

    // 4. Photo Frame
    const photoX = 60;
    const photoY = 380;
    const photoW = 360;
    const photoH = 480;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#FFFFFF';
    drawRoundedRect(ctx, photoX, photoY, photoW, photoH, 30, true, false);
    ctx.restore();

    ctx.save();
    clipRoundedRect(ctx, photoX + 6, photoY + 6, photoW - 12, photoH - 12, 24);
    if (state.uploadedImage) {
      drawInteractiveImage(ctx, state.uploadedImage, photoX + 6, photoY + 6, photoW - 12, photoH - 12, state.zoom, state.panX, state.panY);
    } else {
      ctx.fillStyle = '#F2F542';
      ctx.fillRect(photoX + 6, photoY + 6, photoW - 12, photoH - 12);
      ctx.fillStyle = '#0B3C2D';
      ctx.font = '900 24px "Cabinet Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('UPLOAD PHOTO', photoX + photoW / 2, photoY + photoH / 2);
    }
    ctx.restore();

    // 3:4 Tag
    ctx.fillStyle = '#F2F542';
    drawRoundedRect(ctx, photoX + photoW - 70, photoY + photoH - 45, 60, 35, 8, true, false);
    ctx.fillStyle = '#0B3C2D';
    ctx.font = '900 18px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('3:4', photoX + photoW - 40, photoY + photoH - 27);

    // 5. Info Cards
    const cardX = 440;
    const cardW = 400;
    const cardH = 135;
    const maxTextWidth = cardW - 50;

    const drawInfoCard = (y, label, value, valueColor) => {
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      drawRoundedRect(ctx, cardX, y, cardW, cardH, 24, true, false);
      ctx.restore();

      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#6B7280';
      ctx.font = '800 16px "Space Grotesk", sans-serif';
      ctx.fillText(label, cardX + 25, y + 42);

      drawAutoFittedText(ctx, value, cardX + 25, y + 95, maxTextWidth, 36, '"Cabinet Grotesk", "Space Grotesk", sans-serif', valueColor);
    };

    drawInfoCard(380, 'BUILDER NAME', state.name, '#0B3C2D');
    drawInfoCard(545, 'ROLE / STACK', state.role, '#FF007F');
    drawInfoCard(710, 'BUILDER TITLE', state.title, '#0B3C2D');

    // 6. Yellow Squad / Team Bar
    const teamY = 910;
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = '#F2F542';
    drawRoundedRect(ctx, 60, teamY, 780, 150, 30, true, false);
    ctx.restore();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#0B3C2D';
    ctx.font = '800 18px "Space Grotesk", sans-serif';
    ctx.fillText('SQUAD / TEAM', 100, teamY + 50);

    if (state.team) {
      drawAutoFittedText(ctx, state.team, 98, teamY + 115, 500, 52, '"Cabinet Grotesk", "Space Grotesk", sans-serif', '#0B3C2D');
    }

    // Date Pill
    ctx.fillStyle = '#0B3C2D';
    drawRoundedRect(ctx, 640, teamY + 45, 170, 60, 20, true, false);
    ctx.fillStyle = '#F2F542';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 22px "Space Grotesk", sans-serif';
    ctx.fillText('OCT 28-31', 725, teamY + 76);

    // 7. White Tech Stack Bar
    const stackY = 1090;
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    drawRoundedRect(ctx, 60, stackY, 780, 150, 30, true, false);
    ctx.restore();

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#6B7280';
    ctx.font = '800 16px "Space Grotesk", sans-serif';
    ctx.fillText('TECH STACK', 100, stackY + 45);

    const skillList = state.skills ? state.skills.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
    let currentPillX = 100;
    const pillY = stackY + 65;
    const pillH = 50;

    skillList.forEach(skill => {
      ctx.font = '800 20px "Space Grotesk", sans-serif';
      const textW = ctx.measureText(skill).width;
      const pillW = textW + 40;

      if (currentPillX + pillW > 820) return;

      ctx.fillStyle = '#0B3C2D';
      drawRoundedRect(ctx, currentPillX, pillY, pillW, pillH, 16, true, false);

      ctx.fillStyle = '#F2F542';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(skill, currentPillX + pillW / 2, pillY + pillH / 2);

      currentPillX += pillW + 15;
    });

    // 8. Pink Torn Paper Footer
    const footerY = 1380;

    ctx.fillStyle = '#FF007F';
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, footerY);

    const segments = 40;
    const segW = w / segments;
    for (let i = 0; i <= segments; i++) {
      const x = i * segW;
      const randY = footerY - 10 + (Math.sin(i * 13.5) * 12) + (Math.cos(i * 7.1) * 8);
      ctx.lineTo(x, randY);
    }
    ctx.lineTo(w, footerY);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    // Footer Text
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 42px "Cabinet Grotesk", "Space Grotesk", sans-serif';
    ctx.fillText('#FrameInGoa', 60, 1490);

    ctx.font = '700 20px "Space Grotesk", sans-serif';
    ctx.fillText('GOA, INDIA • 2026', 64, 1530);

    // Footer QR Code
    const qrSize = 140;
    const qrX = w - qrSize - 60;
    const qrY = 1410;

    ctx.fillStyle = '#FFFFFF';
    drawRoundedRect(ctx, qrX, qrY, qrSize, qrSize, 24, true, false);

    ctx.save();
    ctx.fillStyle = '#0B3C2D';
    const drawAnchor = (ax, ay) => {
      ctx.fillRect(ax, ay, 24, 24);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(ax + 4, ay + 4, 16, 16);
      ctx.fillStyle = '#0B3C2D';
      ctx.fillRect(ax + 8, ay + 8, 8, 8);
    };

    drawAnchor(qrX + 15, qrY + 15);
    drawAnchor(qrX + qrSize - 39, qrY + 15);
    drawAnchor(qrX + 15, qrY + qrSize - 39);

    let seed = 42;
    for (let i = 0; i < state.name.length; i++) { seed += state.name.charCodeAt(i); }
    const qrRandom = () => { const x = Math.sin(seed++) * 10000; return x - Math.floor(x); };

    const moduleSize = 4;
    for (let px = qrX + 15; px < qrX + qrSize - 15; px += moduleSize) {
      for (let py = qrY + 15; py < qrY + qrSize - 15; py += moduleSize) {
        const inTopLeft = (px < qrX + 45 && py < qrY + 45);
        const inTopRight = (px > qrX + qrSize - 45 && py < qrY + 45);
        const inBottomLeft = (px < qrX + 45 && py > qrY + qrSize - 45);

        if (!inTopLeft && !inTopRight && !inBottomLeft) {
          if (qrRandom() > 0.5) {
            ctx.fillRect(px, py, moduleSize, moduleSize);
          }
        }
      }
    }
    ctx.restore();

    ctx.restore();
  }

  /**
   * FORMAT A: CIRCULAR PFP OVERLAY
   */
  function renderFormatA_PFPOverlay() {
    const w = 1080;
    const h = 1080;
    const cx = w / 2;
    const cy = h / 2;
    const r = 400;

    ctx.clearRect(0, 0, w, h);
    ctx.save();

    // Background
    if (bgImg.complete && bgImg.naturalWidth > 0) {
      const imgRatio = bgImg.naturalWidth / bgImg.naturalHeight;
      const canvasRatio = w / h;
      let drawW = w;
      let drawH = h;
      let drawX = 0;
      let drawY = 0;

      if (imgRatio > canvasRatio) {
        drawW = h * imgRatio;
        drawX = (w - drawW) / 2;
      } else {
        drawH = w / imgRatio;
        drawY = (h - drawH) / 2;
      }
      ctx.drawImage(bgImg, drawX, drawY, drawW, drawH);
    } else {
      ctx.fillStyle = '#0B3C2D';
      ctx.fillRect(0, 0, w, h);
    }

    // Rings
    const thick = state.pfpBorderThickness || 10;
    const pad = state.pfpBorderPadding || 16;

    ctx.strokeStyle = '#FF007F';
    ctx.lineWidth = thick * 1.4;
    ctx.beginPath(); ctx.arc(cx, cy, r + pad + (thick * 0.4), 0, Math.PI * 2); ctx.stroke();

    ctx.strokeStyle = '#F2F542';
    ctx.lineWidth = thick;
    ctx.beginPath(); ctx.arc(cx, cy, r + pad - (thick * 0.8), 0, Math.PI * 2); ctx.stroke();

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = thick * 0.6;
    ctx.beginPath(); ctx.arc(cx, cy, r + pad - (thick * 1.8), 0, Math.PI * 2); ctx.stroke();

    // Photo
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    if (state.uploadedImage) {
      drawInteractiveImage(ctx, state.uploadedImage, cx - r, cy - r, r * 2, r * 2, state.zoom, state.panX, state.panY);
    } else {
      ctx.fillStyle = '#051A0D';
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      ctx.fillStyle = '#E1FE00';
      ctx.font = '900 30px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('[ + UPLOAD PHOTO ]', cx, cy);
    }
    ctx.restore();

    ctx.restore();
  }

  /**
   * FORMAT C: X / TWITTER BANNER
   */
  function renderFormatC_Banner() {
    const w = 1500;
    const h = 500;

    ctx.clearRect(0, 0, w, h);
    ctx.save();

    // Background
    if (bgImg.complete && bgImg.naturalWidth > 0) {
      const imgRatio = bgImg.naturalWidth / bgImg.naturalHeight;
      const canvasRatio = w / h;
      let drawW = w;
      let drawH = h;
      let drawX = 0;
      let drawY = 0;

      if (imgRatio > canvasRatio) {
        drawW = h * imgRatio;
        drawX = (w - drawW) / 2;
      } else {
        drawH = w / imgRatio;
        drawY = (h - drawH) / 2;
      }
      ctx.drawImage(bgImg, drawX, drawY, drawW, drawH);
    } else {
      ctx.fillStyle = '#0B3C2D';
      ctx.fillRect(0, 0, w, h);
    }

    // Torn Paper Footer
    const footerY = 400;

    ctx.fillStyle = '#FF007F';
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, footerY);

    const segments = 60;
    const segW = w / segments;
    for (let i = 0; i <= segments; i++) {
      const x = i * segW;
      const randY = footerY - 5 + (Math.sin(i * 18.5) * 8) + (Math.cos(i * 9.1) * 6);
      ctx.lineTo(x, randY);
    }
    ctx.lineTo(w, footerY);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    // Footer Text
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 36px "Cabinet Grotesk", "Space Grotesk", sans-serif';
    ctx.fillText('#FrameInGoa', 60, 455);

    ctx.font = '700 18px "Space Grotesk", sans-serif';
    ctx.fillText('GOA, INDIA • 2026', 330, 458);

    // QR Code
    const qrSize = 80;
    const qrX = w - qrSize - 60;
    const qrY = 410;

    ctx.fillStyle = '#FFFFFF';
    drawRoundedRect(ctx, qrX, qrY, qrSize, qrSize, 12, true, false);

    ctx.save();
    ctx.fillStyle = '#0B3C2D';
    const drawAnchor = (ax, ay) => {
      ctx.fillRect(ax, ay, 12, 12);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(ax + 2, ay + 2, 8, 8);
      ctx.fillStyle = '#0B3C2D';
      ctx.fillRect(ax + 4, ay + 4, 4, 4);
    };

    drawAnchor(qrX + 8, qrY + 8);
    drawAnchor(qrX + qrSize - 20, qrY + 8);
    drawAnchor(qrX + 8, qrY + qrSize - 20);

    let seed = 42;
    if (state.name) { for (let i = 0; i < state.name.length; i++) { seed += state.name.charCodeAt(i); } }
    const qrRandom = () => { const x = Math.sin(seed++) * 10000; return x - Math.floor(x); };

    const moduleSize = 4;
    for (let px = qrX + 8; px < qrX + qrSize - 8; px += moduleSize) {
      for (let py = qrY + 8; py < qrY + qrSize - 8; py += moduleSize) {
        const inTopLeft = (px < qrX + 24 && py < qrY + 24);
        const inTopRight = (px > qrX + qrSize - 24 && py < qrY + 24);
        const inBottomLeft = (px < qrX + 24 && py > qrY + qrSize - 24);

        if (!inTopLeft && !inTopRight && !inBottomLeft) {
          if (qrRandom() > 0.5) {
            ctx.fillRect(px, py, moduleSize, moduleSize);
          }
        }
      }
    }
    ctx.restore();

    // Photo Frame
    const photoX = 60;
    const photoY = 40;
    const photoW = 240;
    const photoH = 320;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#FFFFFF';
    drawRoundedRect(ctx, photoX, photoY, photoW, photoH, 20, true, false);
    ctx.restore();

    ctx.save();
    clipRoundedRect(ctx, photoX + 6, photoY + 6, photoW - 12, photoH - 12, 16);
    if (state.uploadedImage) {
      drawInteractiveImage(ctx, state.uploadedImage, photoX + 6, photoY + 6, photoW - 12, photoH - 12, state.zoom, state.panX, state.panY);
    } else {
      ctx.fillStyle = '#F2F542';
      ctx.fillRect(photoX + 6, photoY + 6, photoW - 12, photoH - 12);
      ctx.fillStyle = '#0B3C2D';
      ctx.font = '900 20px "Cabinet Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PHOTO', photoX + photoW / 2, photoY + photoH / 2);
    }
    ctx.restore();

    // Middle Left Cards
    const cardX = 330;
    const cardW = 380;
    const cardH = 92;
    const maxTextWidth = cardW - 40;

    const drawInfoCard = (y, label, value, valueColor) => {
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      drawRoundedRect(ctx, cardX, y, cardW, cardH, 16, true, false);
      ctx.restore();

      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#6B7280';
      ctx.font = '800 12px "Space Grotesk", sans-serif';
      ctx.fillText(label, cardX + 20, y + 30);

      drawAutoFittedText(ctx, value, cardX + 20, y + 68, maxTextWidth, 28, '"Cabinet Grotesk", "Space Grotesk", sans-serif', valueColor);
    };

    drawInfoCard(40, 'BUILDER NAME', state.name, '#0B3C2D');
    drawInfoCard(154, 'ROLE / STACK', state.role, '#FF007F');
    drawInfoCard(268, 'BUILDER TITLE', state.title, '#0B3C2D');

    // Middle Right: Team & Stack
    const rightX = 740;
    const rightW = 600;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = '#F2F542';
    drawRoundedRect(ctx, rightX, 40, rightW, 110, 20, true, false);
    ctx.restore();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#0B3C2D';
    ctx.font = '800 14px "Space Grotesk", sans-serif';
    ctx.fillText('SQUAD / TEAM', rightX + 25, 75);

    if (state.team) {
      drawAutoFittedText(ctx, state.team, rightX + 23, 125, 380, 36, '"Cabinet Grotesk", "Space Grotesk", sans-serif', '#0B3C2D');
    }

    // Date Pill
    ctx.fillStyle = '#0B3C2D';
    drawRoundedRect(ctx, rightX + rightW - 160, 65, 135, 45, 16, true, false);
    ctx.fillStyle = '#F2F542';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 16px "Space Grotesk", sans-serif';
    ctx.fillText('OCT 28-31', rightX + rightW - 92, 88);

    // Tech Stack Bar
    const stackY = 175;
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    drawRoundedRect(ctx, rightX, stackY, rightW, 185, 20, true, false);
    ctx.restore();

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#6B7280';
    ctx.font = '800 14px "Space Grotesk", sans-serif';
    ctx.fillText('TECH STACK', rightX + 25, stackY + 35);

    const skillList = state.skills ? state.skills.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
    let currentPillX = rightX + 25;
    let currentPillY = stackY + 55;
    const pillH = 40;

    skillList.forEach(skill => {
      ctx.font = '800 16px "Space Grotesk", sans-serif';
      const textW = ctx.measureText(skill).width;
      const pillW = textW + 30;

      if (currentPillX + pillW > rightX + rightW - 25) {
        currentPillX = rightX + 25;
        currentPillY += pillH + 12;
      }

      if (currentPillY + pillH > stackY + 175) return;

      ctx.fillStyle = '#0B3C2D';
      drawRoundedRect(ctx, currentPillX, currentPillY, pillW, pillH, 12, true, false);

      ctx.fillStyle = '#F2F542';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(skill, currentPillX + pillW / 2, currentPillY + pillH / 2);

      currentPillX += pillW + 12;
    });

    // Sticker
    ctx.save();
    ctx.translate(w - 70, 70);
    ctx.rotate(15 * Math.PI / 180);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;

    ctx.fillStyle = '#FF007F';
    drawRoundedRect(ctx, -50, -25, 100, 50, 16, true, false);

    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#F2F542';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 24px "Noto Sans Devanagari", sans-serif';
    ctx.fillText('गोवा', 0, 2);
    ctx.restore();

    ctx.restore();
  }

  // DRAW UTILITIES
  function drawInteractiveImage(ctx, img, targetX, targetY, targetW, targetH, zoom, panX, panY) {
    const imgRatio = img.width / img.height;
    const targetRatio = targetW / targetH;

    let baseW, baseH;
    if (imgRatio > targetRatio) {
      baseH = targetH;
      baseW = targetH * imgRatio;
    } else {
      baseW = targetW;
      baseH = targetW / imgRatio;
    }

    const scaledW = baseW * zoom * 1.02;
    const scaledH = baseH * zoom * 1.02;

    const drawX = targetX + (targetW - scaledW) / 2 + panX;
    const drawY = targetY + (targetH - scaledH) / 2 + panY;

    ctx.drawImage(img, drawX, drawY, scaledW, scaledH);
  }

  function drawRoundedRect(ctx, x, y, width, height, radius, fill = true, stroke = true) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  function clipRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.clip();
  }

  function downloadCanvasImage() {
    showLoading('Saving High-Res PNG...');
    setTimeout(() => {
      try {
        // Render into a fresh offscreen canvas to avoid SecurityError on tainted canvas
        const offscreen = document.createElement('canvas');
        const formatLabel = state.format === 'formatB' ? 'IDCard' : state.format === 'formatA' ? 'PFP' : 'Banner';
        if (state.format === 'formatB') { offscreen.width = 900;  offscreen.height = 1600; }
        else if (state.format === 'formatA') { offscreen.width = 1080; offscreen.height = 1080; }
        else { offscreen.width = 1500; offscreen.height = 500; }

        const offCtx = offscreen.getContext('2d');
        // Swap context temporarily and render
        const origCtx = canvas.getContext('2d');
        const origW = canvas.width;
        const origH = canvas.height;

        // Set canvas to offscreen dimensions and render
        canvas.width = offscreen.width;
        canvas.height = offscreen.height;
        renderCanvas();

        // Copy rendered content to offscreen
        offCtx.drawImage(canvas, 0, 0);

        // Restore original canvas size and re-render for display
        canvas.width = origW;
        canvas.height = origH;
        renderCanvas();

        offscreen.toBlob((blob) => {
          if (blob) triggerDownload(blob, `HHGoa2026_${formatLabel}.png`);
          hideLoading();
        }, 'image/png', 1.0);
      } catch (err) {
        console.error('Download error:', err);
        // Fallback: try direct toDataURL on live canvas
        try {
          const liveCanvas = document.getElementById('outputCanvas');
          const dataURL = liveCanvas.toDataURL('image/png');
          const link = document.createElement('a');
          const formatLabel = state.format === 'formatB' ? 'IDCard' : state.format === 'formatA' ? 'PFP' : 'Banner';
          link.download = `HHGoa2026_${formatLabel}.png`;
          link.href = dataURL;
          link.click();
        } catch (e2) {
          alert('Download failed. Please open the app via a local server (e.g. Live Server) instead of file://');
        }
        hideLoading();
      }
    }, 100);
  }

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 200);
  }

  function shareToXIntent() {
    const formatName = state.format === 'formatB' ? 'Builder ID Card' : state.format === 'formatA' ? 'PFP Overlay' : 'X Banner';
    const nameTag = state.name ? ` by ${state.name}` : '';
    const shareText = encodeURIComponent(
      `Just generated my HH Goa 2026 ${formatName}${nameTag} 🌴\nBuilding with Team ProofLabs!\n\n#FrameInGoa #HackerHouseGoa\nhhgoa.com`
    );
    window.open(`https://twitter.com/intent/tweet?text=${shareText}`, '_blank');
  }

  function showLoading(text) {
    if (loadingText) loadingText.textContent = text;
    if (loadingOverlay) loadingOverlay.classList.remove('hidden');
  }

  function hideLoading() {
    if (loadingOverlay) loadingOverlay.classList.add('hidden');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}