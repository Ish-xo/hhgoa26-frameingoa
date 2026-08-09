/**
 * Hacker House Goa 2026 — #FrameInGoa Engine
 * Native HTML5 Canvas Renderer & Event Handler
 */

function initApp() {
  // DOM Elements
  let canvas = document.getElementById('outputCanvas');
  let ctx = canvas.getContext('2d');

  const photoInput = document.getElementById('photoInput');
  const dropzone = document.getElementById('dropzone');
  const dropzonePrompt = document.getElementById('dropzonePrompt');
  const fileInfo = document.getElementById('fileInfo');
  const fileName = document.getElementById('fileName');
  const btnRemoveFile = document.getElementById('btnRemoveFile');

  const btnFormatB = document.getElementById('btnFormatB');
  const btnFormatA = document.getElementById('btnFormatA');
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

  // Procedural Noise Pattern Cache
  let noisePattern = null;

  // Preload logo for canvas rendering
  // Load via data URL so the canvas is NEVER tainted (prevents SecurityError on toDataURL/toBlob)
  const logoImg = new Image();
  (function loadLogoSafe() {
    fetch('assets/logo.svg')
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          logoImg.src = reader.result; // data: URL — no CORS, never tainted
          logoImg.onload = () => renderCanvas();
        };
        reader.readAsDataURL(blob);
      })
      .catch(() => {
        // If fetch fails, try direct load (may taint canvas, but download has fallback)
        logoImg.src = 'assets/logo.svg';
        logoImg.onload = () => renderCanvas();
      });
  })();

  // Preload background image as a data URL so the canvas is NEVER tainted.
  // This guarantees toDataURL() works in every browser, including file:// URLs.
  const bgImg = new Image();
  // Set crossOrigin so images served with CORS headers don't taint the canvas
  bgImg.crossOrigin = 'anonymous';
  (function loadBgSafe() {
    fetch('assets/id_bg.jpeg')
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          bgImg.src = reader.result; // data: URL — no CORS, never tainted
          bgImg.onload = () => renderCanvas();
        };
        reader.readAsDataURL(blob);
      })
      .catch(() => {
        // If fetch fails (e.g. strict file:// with no fetch support), fall back
        // to loading the image directly so the preview still shows the background.
        // crossOrigin='anonymous' prevents tainting when served with CORS headers.
        // If the canvas still gets tainted (e.g. file://), the download function
        // has a last-resort fallback that redraws without external images.
        bgImg.src = 'assets/id_bg.jpeg';
        bgImg.onload = () => renderCanvas();
      });
  })();

  // Application State
  const state = {
    format: 'formatB', // 'formatB' | 'formatA'
    uploadedImage: null,
    name: inputName.value || 'Nikhil K.',
    role: inputRole.value || 'Full-Stack Developer',
    skills: inputSkills.value || 'React, AI/ML, Web3',
    team: inputTeam.value || 'CodeNomads',
    title: inputTitle.value || 'Pixel Pirate',
    serialNumber: '#034 / 247',
    batchStatus: 'ALPHA // FIRST WAVE'
  };

  // Initial Render & Font Load Listener
  renderCanvas();
  if (document.fonts) {
    document.fonts.ready.then(() => renderCanvas());
  }

  // ----------------------------------------------------
  // EVENT LISTENERS
  // ----------------------------------------------------

  // Format Toggles
  btnFormatB.addEventListener('click', (e) => {
    e.preventDefault();
    setFormat('formatB');
  });

  btnFormatA.addEventListener('click', (e) => {
    e.preventDefault();
    setFormat('formatA');
  });

  function setFormat(newFormat) {
    state.format = newFormat;
    if (newFormat === 'formatB') {
      btnFormatB.classList.add('active');
      btnFormatA.classList.remove('active');
      if (idCardInputs) idCardInputs.classList.remove('hidden');
    } else {
      btnFormatA.classList.add('active');
      btnFormatB.classList.remove('active');
      if (idCardInputs) idCardInputs.classList.add('hidden');
    }
    renderCanvas();
  }

  // Inputs: live update on every keystroke
  inputName.addEventListener('input', (e) => {
    state.name = e.target.value || 'Nikhil K.';
    renderCanvas();
  });
  inputRole.addEventListener('input', (e) => {
    state.role = e.target.value || 'Full-Stack Developer';
    renderCanvas();
  });
  inputSkills.addEventListener('input', (e) => {
    state.skills = e.target.value || 'React, AI/ML, Web3';
    renderCanvas();
  });
  inputTeam.addEventListener('input', (e) => {
    state.team = e.target.value || 'CodeNomads';
    renderCanvas();
  });
  inputTitle.addEventListener('input', (e) => {
    state.title = e.target.value || 'Pixel Pirate';
    renderCanvas();
  });

  const presetTitles = [
    'Pixel Pirate',
    'Protocol Architect',
    'Prompt Alchemist',
    'Byte Bandit',
    'Jungle Coder',
    'Gas Optimizer'
  ];

  btnRandomTitle.addEventListener('click', (e) => {
    e.preventDefault();
    const randomIndex = Math.floor(Math.random() * presetTitles.length);
    const chosenTitle = presetTitles[randomIndex];
    inputTitle.value = chosenTitle;
    state.title = chosenTitle;

    // Trigger CSS click animation/feedback on the button
    btnRandomTitle.style.transform = 'scale(0.9)';
    setTimeout(() => { btnRandomTitle.style.transform = ''; }, 100);

    renderCanvas();
  });

  // Dropzone Click & Drag Event Handlers
  dropzone.addEventListener('click', () => photoInput.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--color-neon-yellow)';
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.style.borderColor = 'var(--color-border)';
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--color-border)';
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
    photoInput.value = '';
    dropzonePrompt.classList.remove('hidden');
    fileInfo.classList.add('hidden');
    renderCanvas();
  });

  // Export Buttons
  btnDownload.addEventListener('click', downloadCanvasImage);
  btnShareX.addEventListener('click', shareToXIntent);

  // ----------------------------------------------------
  // FILE HANDLING & HEIC CONVERSION
  // ----------------------------------------------------

  async function handleFile(file) {
    try {
      let imageBlob = file;

      // Check for iPhone HEIC/HEIF format
      const isHEIC = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
      if (isHEIC && typeof heic2any !== 'undefined') {
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.9
        });
        imageBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          openCropModal(img, file.name);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(imageBlob);

    } catch (err) {
      console.error('Error handling file:', err);
      alert('Could not process image file. Please try a standard JPG/PNG.');
    }
  }

  function openCropModal(img, filename) {
    // Remove existing modal if any
    const existing = document.getElementById('cropModal');
    if (existing) existing.remove();

    // Create modal
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = `
      <div id="cropModal" class="crop-modal">
        <div class="crop-modal-content">
          <div class="crop-modal-header">CROP PROFILE PHOTO</div>
          <div class="crop-viewport" id="cropViewport">
            <img id="cropImage" src="${img.src}" alt="Crop preview" />
          </div>
          <div class="crop-slider-container">
            <label class="form-label" style="font-size: 11px;">Zoom</label>
            <input type="range" id="cropZoomRange" min="1" max="3" step="0.01" value="1" class="crop-slider" />
          </div>
          <div class="crop-actions">
            <button type="button" id="btnCropReset" class="btn-crop-secondary">Reset</button>
            <button type="button" id="btnCropApply" class="btn-crop-primary">Apply Crop</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalDiv.firstElementChild);

    const modal = document.getElementById('cropModal');
    const viewport = document.getElementById('cropViewport');
    const cropImg = document.getElementById('cropImage');
    const zoomRange = document.getElementById('cropZoomRange');
    const btnReset = document.getElementById('btnCropReset');
    const btnApply = document.getElementById('btnCropApply');

    // Viewport dimensions (aspect ratio matching 460x400)
    const viewportW = 322;
    const viewportH = 280;

    // Image original dimensions
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;

    // Base dimensions to cover viewport
    const imgRatio = naturalW / naturalH;
    const viewportRatio = viewportW / viewportH;
    let baseW, baseH;

    if (imgRatio > viewportRatio) {
      baseH = viewportH;
      baseW = viewportH * imgRatio;
    } else {
      baseW = viewportW;
      baseH = viewportW / imgRatio;
    }

    // Zoom and position state
    let zoom = 1;
    let dX = (viewportW - baseW) / 2;
    let dY = (viewportH - baseH) / 2;

    function updateImageTransform() {
      const activeW = baseW * zoom;
      const activeH = baseH * zoom;
      cropImg.style.width = `${baseW}px`;
      cropImg.style.height = `${baseH}px`;
      cropImg.style.transform = `translate(${dX}px, ${dY}px) scale(${zoom})`;
    }

    function constrainOffsets() {
      const activeW = baseW * zoom;
      const activeH = baseH * zoom;
      
      if (activeW > viewportW) {
        if (dX > 0) dX = 0;
        if (dX < viewportW - activeW) dX = viewportW - activeW;
      } else {
        dX = (viewportW - activeW) / 2;
      }

      if (activeH > viewportH) {
        if (dY > 0) dY = 0;
        if (dY < viewportH - activeH) dY = viewportH - activeH;
      } else {
        dY = (viewportH - activeH) / 2;
      }
    }

    // Initialize position and style
    constrainOffsets();
    updateImageTransform();

    // Zoom listener
    zoomRange.addEventListener('input', (e) => {
      const newZoom = parseFloat(e.target.value);
      
      const viewCenterX = viewportW / 2;
      const viewCenterY = viewportH / 2;
      
      const imgCenterX = (viewCenterX - dX) / zoom;
      const imgCenterY = (viewCenterY - dY) / zoom;
      
      zoom = newZoom;
      
      dX = viewCenterX - imgCenterX * zoom;
      dY = viewCenterY - imgCenterY * zoom;
      
      constrainOffsets();
      updateImageTransform();
    });

    // Drag listeners
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialDX = 0;
    let initialDY = 0;

    function onStart(e) {
      isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      startX = clientX;
      startY = clientY;
      initialDX = dX;
      initialDY = dY;
      viewport.style.cursor = 'grabbing';
    }

    function onMove(e) {
      if (!isDragging) return;
      if (e.cancelable) e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - startX;
      const deltaY = clientY - startY;
      
      dX = initialDX + deltaX;
      dY = initialDY + deltaY;
      
      constrainOffsets();
      updateImageTransform();
    }

    function onEnd() {
      isDragging = false;
      viewport.style.cursor = 'move';
    }

    viewport.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    viewport.addEventListener('touchstart', onStart, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);

    // Reset button
    btnReset.addEventListener('click', () => {
      zoom = 1;
      zoomRange.value = 1;
      dX = (viewportW - baseW) / 2;
      dY = (viewportH - baseH) / 2;
      constrainOffsets();
      updateImageTransform();
    });

    // Apply Crop button
    btnApply.addEventListener('click', () => {
      const activeW = baseW * zoom;
      const activeH = baseH * zoom;
      
      const sx = (-dX / activeW) * naturalW;
      const sy = (-dY / activeH) * naturalH;
      const sw = (viewportW / activeW) * naturalW;
      const sh = (viewportH / activeH) * naturalH;

      const offscreen = document.createElement('canvas');
      offscreen.width = 920;  
      offscreen.height = 800;
      const oCtx = offscreen.getContext('2d');
      
      oCtx.drawImage(img, sx, sy, sw, sh, 0, 0, 920, 800);

      const croppedImg = new Image();
      croppedImg.onload = () => {
        state.uploadedImage = croppedImg;
        fileName.textContent = filename;
        dropzonePrompt.classList.add('hidden');
        fileInfo.classList.remove('hidden');
        renderCanvas();
        modal.remove();
        
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onEnd);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onEnd);
      };
      croppedImg.src = offscreen.toDataURL('image/jpeg', 0.95);
    });
  }

  // ----------------------------------------------------
  // CANVAS RENDERING ENGINE
  // ----------------------------------------------------


  function getNoisePattern() {
    if (noisePattern) return noisePattern;
    const noiseCanvas = document.createElement('canvas');
    const size = 128;
    noiseCanvas.width = size;
    noiseCanvas.height = size;
    const nCtx = noiseCanvas.getContext('2d');
    const imgData = nCtx.createImageData(size, size);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const val = Math.floor(Math.random() * 255);
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
      data[i + 3] = 255;
    }

    nCtx.putImageData(imgData, 0, 0);
    noisePattern = ctx.createPattern(noiseCanvas, 'repeat');
    return noisePattern;
  }

  function renderCanvas() {
    // Reset noise pattern cache when canvas is resized
    noisePattern = null;

    try {
      if (state.format === 'formatB') {
        canvas.width = 900;
        canvas.height = 1200;
        renderFormatB_IDCard();
      } else {
        canvas.width = 1080;
        canvas.height = 1080;
        renderFormatA_PFPOverlay();
      }
    } catch (err) {
      console.error('Canvas render error:', err);
      // Fallback: draw error message on canvas
      ctx.fillStyle = '#0E2418';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#F4D83A';
      ctx.font = '20px monospace';
      ctx.fillText('Render Error: ' + err.message, 40, 60);
    }
  }

  /**
   * Format B: Builder ID Card Renderer (Custom Built Template)
   */
  function renderFormatB_IDCard() {
    const w = 900;
    const h = 1200;
    const contentCenterX = 510;

    ctx.clearRect(0, 0, w, h);
    ctx.save();

    // 1. Draw Base Background (Theme image or fallback solid color + radial glow)
    if (bgImg.complete && bgImg.naturalWidth > 0) {
      ctx.drawImage(bgImg, 0, 0, w, h);
    } else {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      // Deep Emerald Spotlight Radial Glow behind the photo slot (centered at contentCenterX: 510, photoCenterY: 420)
      const spotlightGlow = ctx.createRadialGradient(contentCenterX, 420, 0, contentCenterX, 420, 450);
      spotlightGlow.addColorStop(0, 'rgba(8, 70, 32, 1)');       // High-intensity deep emerald spotlight
      spotlightGlow.addColorStop(0.4, 'rgba(4, 40, 18, 0.9)');    // Fades smoothly out to photo borders
      spotlightGlow.addColorStop(0.8, 'rgba(1, 10, 5, 0.95)');   // Transition to near black
      spotlightGlow.addColorStop(1, 'rgba(0, 0, 0, 1)');          // Pitch-black corners
      ctx.fillStyle = spotlightGlow;
      ctx.fillRect(0, 0, w, h);
    }

    // 3. Overlay: Subtle Noise (5% Opacity)
    const pat = getNoisePattern();
    if (pat) {
      ctx.save();
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = pat;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    // 4. Background Pattern: Step 2 PCB / Circuit Traces (Edge Perimeter Only)
    drawPCBCircuitLines(ctx, w, h);

    // 5. Step 3: Left Vertical Strip (Width: 120px)
    drawLeftVerticalStrip(ctx, w, h);

    // Reset text state (strip uses rotate + center align which can bleed)
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';


    // 7. Top Center Logo & Branding Block
    const logoX = 295;
    const logoY = 90;
    const logoSize = 75;

    // Draw procedural green glowing house-palm logo
    drawHousePalmLogo(ctx, logoX, logoY, logoSize);

    // Draw text: HACKER HOUSE
    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 32px "Space Grotesk", "Inter", sans-serif';
    ctx.fillText('HACKER', logoX + logoSize + 18, logoY + 34);
    ctx.fillText('HOUSE', logoX + logoSize + 18, logoY + 70);

    // Draw script 'GOA' next to 'HOUSE'
    ctx.save();
    ctx.translate(logoX + logoSize + 152, logoY + 68);
    ctx.rotate(-8 * Math.PI / 180);
    ctx.fillStyle = '#C8FF33';
    ctx.font = 'italic 900 34px "Space Grotesk", sans-serif';
    ctx.fillText('GOA', 0, 0);
    ctx.restore();

    // Draw tagline: BUILD • HACK • COLLABORATE (with small green palm tree icon)
    ctx.fillStyle = '#94A3B8';
    ctx.font = '800 12px "JetBrains Mono", monospace';
    const tagText = 'BUILD • HACK • COLLABORATE ';
    ctx.fillText(tagText, logoX + logoSize + 18, logoY + 98);
    const tagW = ctx.measureText(tagText).width;
    drawTinyPalmTree(ctx, logoX + logoSize + 18 + tagW, logoY + 86);
    ctx.restore();

    // 8. Goa Sticker (Top Right, Pink with yellow text, rotated -15 deg, custom green palm tree)
    ctx.save();
    ctx.translate(760, 125);
    ctx.rotate(-15 * Math.PI / 180);

    // Draw palm tree rising out of the top right of the sticker
    drawStickerPalmTree(ctx, 35, -45);

    // Draw Pink Sticker body
    ctx.fillStyle = '#FF2D7A';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = -2;
    ctx.shadowOffsetY = 4;
    const stickerW = 125;
    const stickerH = 54;
    drawRoundedRect(ctx, -stickerW / 2, -stickerH / 2, stickerW, stickerH, 27, true, false);

    // Draw sticker text: गोवा
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#E1FE00';
    ctx.font = '900 24px "Noto Sans Devanagari", "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('गोवा', 0, 2);
    ctx.restore();

    // Reset alignment/baseline states
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    // 7. Profile Image Container (Vertical Rectangle, 460x400, 20px radius, 3px solid #C8FF33, 15px glow)
    const photoW = 460;
    const photoH = 400;
    const photoX = contentCenterX - photoW / 2; // 280
    const photoY = 220;

    // Lime glow shadow + Border
    ctx.save();
    ctx.shadowColor = 'rgba(124, 255, 79, 0.4)';
    ctx.shadowBlur = 15;
    ctx.strokeStyle = '#C8FF33';
    ctx.lineWidth = 3;
    drawRoundedRect(ctx, photoX, photoY, photoW, photoH, 20, false, true);
    ctx.restore();

    // Render User Photo (Halftone B&W) or Cyber Empty State
    ctx.save();
    clipRoundedRect(ctx, photoX, photoY, photoW, photoH, 20);

    if (state.uploadedImage) {
      drawCenterCropImage(ctx, state.uploadedImage, photoX, photoY, photoW, photoH);
    } else {
      // Empty Photo Cyber State
      ctx.fillStyle = '#051209';
      ctx.fillRect(photoX, photoY, photoW, photoH);

      // Center Crosshair Target
      const cx = photoX + photoW / 2;
      const cy = photoY + photoH / 2;
      ctx.strokeStyle = 'rgba(124, 255, 79, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 30, cy); ctx.lineTo(cx + 30, cy);
      ctx.moveTo(cx, cy - 30); ctx.lineTo(cx, cy + 30);
      ctx.stroke();

      // Camera Outline Icon
      ctx.strokeStyle = '#C8FF33';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 20, cy - 25, 40, 26);
      ctx.beginPath();
      ctx.arc(cx, cy - 12, 7, 0, Math.PI * 2);
      ctx.stroke();

      // Prompt Text
      ctx.fillStyle = '#C8FF33';
      ctx.font = '800 13px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('[ + UPLOAD RECTANGLE PHOTO ]', cx, cy + 25);
    }
    ctx.restore();

    // 7b. Verified Badge overlapping the bottom center of the photo frame
    ctx.save();
    const badgeW = 96;
    const badgeH = 28;
    const badgeX = contentCenterX - badgeW / 2;
    const badgeY = 620 - badgeH / 2; // Centers it perfectly on the Y: 620 line
    
    // Draw bright pink pill shadow/glow
    ctx.shadowColor = 'rgba(255, 38, 117, 0.4)';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#FF2675';
    drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 14, true, false);
    
    // Text inside the pill
    ctx.fillStyle = '#F7F7F7';
    ctx.font = '900 12px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if ('letterSpacing' in ctx) {
      ctx.letterSpacing = '1px';
      ctx.fillText('VERIFIED', contentCenterX, 620);
      ctx.letterSpacing = '0px';
    } else {
      ctx.fillText('VERIFIED', contentCenterX, 620);
    }
    ctx.restore();

    // 7c. Dark glassmorphic metadata backing panel for text legibility
    ctx.save();
    const panelX = 150;
    const panelY = 642;
    const panelW = 720;
    const panelH = 518;
    const panelRadius = 24;

    // Semi-transparent dark emerald-black fill
    ctx.fillStyle = 'rgba(4, 15, 9, 0.88)';
    // Premium neon border
    ctx.strokeStyle = 'rgba(124, 255, 79, 0.3)';
    ctx.lineWidth = 2;
    
    // Draw the panel
    drawRoundedRect(ctx, panelX, panelY, panelW, panelH, panelRadius, true, true);
    ctx.restore();

    // 8. Title Section (JetBrains Mono, #C8FF33, letterSpacing 6px, below image with ample space)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#C8FF33';
    const titleText = state.title.toUpperCase();
    fillTextWithDynamicSize(ctx, titleText, contentCenterX, 690, 640, '900 24px "JetBrains Mono", monospace', 6);

    // 8b. Name Section (Space Grotesk, #FFE94A, below Title with clean space)
    ctx.fillStyle = '#FFE94A';
    fillTextWithDynamicSize(ctx, state.name, contentCenterX, 760, 640, '800 56px "Space Grotesk", "Inter", sans-serif', 0);

    // Role Subtitle (Brighter White, letterSpacing 4px, below Name with clean space)
    ctx.fillStyle = '#FFFFFF';
    const roleText = state.role.toUpperCase();
    fillTextWithDynamicSize(ctx, roleText, contentCenterX, 808, 640, '800 19px "JetBrains Mono", monospace', 4);

    // 9. Skills Section (React, AI/ML, WEB3 / transparent pills, border 1.5px #67FF5E, below Role with clean space)
    const skillList = state.skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    let skillFontSize = 16;
    let paddingX = 22;
    let pillGap = 14;
    let pillHeight = 48;
    
    function getPillsTotalWidth() {
      ctx.font = `900 ${skillFontSize}px "JetBrains Mono", monospace`;
      const widths = skillList.map(skill => {
        return ctx.measureText(skill.toUpperCase()).width + paddingX * 2;
      });
      return widths.reduce((sum, w) => sum + w, 0) + (skillList.length - 1) * pillGap;
    }

    while (getPillsTotalWidth() > 640 && skillFontSize > 10) {
      skillFontSize -= 1;
      paddingX = Math.max(10, paddingX - 1);
      pillGap = Math.max(6, pillGap - 1);
      pillHeight = Math.max(36, pillHeight - 2);
    }

    const pillMeasurements = skillList.map(skill => {
      ctx.font = `900 ${skillFontSize}px "JetBrains Mono", monospace`;
      const textW = ctx.measureText(skill.toUpperCase()).width;
      const pillW = textW + paddingX * 2;
      return { text: skill.toUpperCase(), width: pillW };
    });

    const totalPillsWidth = pillMeasurements.reduce((sum, p) => sum + p.width, 0) + (skillList.length - 1) * pillGap;
    let currentPillX = contentCenterX - totalPillsWidth / 2;
    const pillsY = 838;

    pillMeasurements.forEach(p => {
      ctx.strokeStyle = '#67FF5E';
      ctx.lineWidth = 1.5;
      drawRoundedRect(ctx, currentPillX, pillsY, p.width, pillHeight, 12, false, true);

      ctx.fillStyle = '#67FF5E';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `900 ${skillFontSize}px "JetBrains Mono", monospace`;
      ctx.fillText(p.text, currentPillX + p.width / 2, pillsY + pillHeight / 2);

      currentPillX += p.width + pillGap;
    });

    // 9b. Team Name Badge (Sleek pink badge with sharp borders, centered below skills pills)
    ctx.save();
    const teamText = 'TEAM: ' + state.team.toUpperCase();
    let teamFontSize = 22;
    
    ctx.font = `900 ${teamFontSize}px "JetBrains Mono", monospace`;
    if ('letterSpacing' in ctx) {
      ctx.letterSpacing = '1px';
    }
    
    let teamTextW = ctx.measureText(teamText).width;
    while (teamTextW + 40 > 640 && teamFontSize > 12) {
      teamFontSize -= 1;
      ctx.font = `900 ${teamFontSize}px "JetBrains Mono", monospace`;
      teamTextW = ctx.measureText(teamText).width;
    }

    const boxW = teamTextW + 40;
    const boxH = 46;
    const boxX = contentCenterX - boxW / 2;
    const boxY = 912;

    // Draw solid pink badge with SHARP borders (no curves)
    ctx.fillStyle = '#FF2675';
    ctx.fillRect(boxX, boxY, boxW, boxH);

    // Draw text inside
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(teamText, contentCenterX, boxY + boxH / 2);
    
    if ('letterSpacing' in ctx) {
      ctx.letterSpacing = '0px';
    }
    ctx.restore();

    // 10. Horizontal Divider Line (Shifted down to Y: 1000)
    ctx.strokeStyle = 'rgba(103, 255, 94, 0.25)'; // cyber green at 25% opacity
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(150, 1000);
    ctx.lineTo(860, 1000);
    ctx.stroke();

    // 11. Left Column: Serial Verification ID & Barcode
    const footerY = 1000;
    const col1X = 160;
    
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    
    ctx.fillStyle = '#67FF5E';
    ctx.font = '700 13px "JetBrains Mono", monospace';
    if ('letterSpacing' in ctx) {
      ctx.letterSpacing = '1px';
      ctx.fillText('SERIAL VERIFICATION ID', col1X, footerY + 50);
      ctx.letterSpacing = '0px';
    } else {
      ctx.fillText('SERIAL VERIFICATION ID', col1X, footerY + 50);
    }
    
    ctx.fillStyle = '#FFE94A';
    ctx.font = '900 24px "JetBrains Mono", monospace';
    ctx.fillText('#HHG-2026-0247', col1X, footerY + 85);

    // Procedural Barcode
    const barcodeX = col1X;
    const barcodeY = footerY + 102;
    const barcodeHeight = 32;
    const barcodePattern = [3, 2, 4, 1, 2, 3, 1, 4, 2, 2, 3, 1, 4, 1, 2, 4, 3, 1, 2, 3, 1, 4, 2, 1, 3, 2];
    ctx.fillStyle = '#FFE94A';
    let currentBarX = barcodeX;
    barcodePattern.forEach((w, idx) => {
      if (idx % 2 === 0) {
        ctx.fillRect(currentBarX, barcodeY, w * 1.5, barcodeHeight);
      }
      currentBarX += (w * 1.5) + 2;
    });

    // 12. Center Column: #FrameInGoa Branding
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 32px "Space Grotesk", sans-serif';
    ctx.fillText('#FrameInGoa', contentCenterX, footerY + 70);

    ctx.fillStyle = '#FFE94A';
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.fillText('hhgoa.com', contentCenterX, footerY + 100);

    // 13. Right Column: Yellow QR Code (size 110x110, transparent bg)
    const qrSize = 110;
    const qrX = 860 - qrSize;
    const qrY = footerY + 30;

    // Draw Mock QR details inside
    ctx.save();
    ctx.fillStyle = '#FFE94A'; // Yellow QR Modules

    const drawAnchor = (ax, ay) => {
      // Outer border (7x7 modules equivalent)
      ctx.fillRect(ax, ay, 28, 28);
      // Inner space
      ctx.fillStyle = '#000000'; // Match background
      ctx.fillRect(ax + 4, ay + 4, 20, 20);
      // Center dot
      ctx.fillStyle = '#FFE94A';
      ctx.fillRect(ax + 8, ay + 8, 12, 12);
    };

    drawAnchor(qrX + 8, qrY + 8);
    drawAnchor(qrX + qrSize - 36, qrY + 8);
    drawAnchor(qrX + 8, qrY + qrSize - 36);

    // Bottom-Right alignment marker
    ctx.fillRect(qrX + qrSize - 24, qrY + qrSize - 24, 12, 12);
    ctx.fillStyle = '#000000';
    ctx.fillRect(qrX + qrSize - 20, qrY + qrSize - 20, 4, 4);

    // Seeding deterministic pseudo-random values based on name
    let seed = 42;
    for (let i = 0; i < state.name.length; i++) {
      seed += state.name.charCodeAt(i);
    }
    const qrRandom = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    const moduleSize = 3;
    const startX = qrX + 6;
    const startY = qrY + 6;
    const endX = qrX + qrSize - 6;
    const endY = qrY + qrSize - 6;

    ctx.fillStyle = '#FFE94A';
    for (let px = startX; px < endX; px += moduleSize) {
      for (let py = startY; py < endY; py += moduleSize) {
        const inTopLeft = (px < qrX + 38 && py < qrY + 38);
        const inTopRight = (px > qrX + qrSize - 38 && py < qrY + 38);
        const inBottomLeft = (px < qrX + 38 && py > qrY + qrSize - 38);
        const inBottomRight = (px > qrX + qrSize - 32 && py > qrY + qrSize - 32);

        if (!inTopLeft && !inTopRight && !inBottomLeft && !inBottomRight) {
          if (qrRandom() > 0.5) {
            ctx.fillRect(px, py, moduleSize, moduleSize);
          }
        }
      }
    }
    ctx.restore();

    // Card outer border (visual glow border)
    ctx.strokeStyle = 'rgba(124, 255, 79, 0.15)';
    ctx.lineWidth = 3;
    const br = 28;
    ctx.beginPath();
    ctx.moveTo(br, 0);
    ctx.lineTo(w - br, 0);
    ctx.quadraticCurveTo(w, 0, w, br);
    ctx.lineTo(w, h - br);
    ctx.quadraticCurveTo(w, h, w - br, h);
    ctx.lineTo(br, h);
    ctx.quadraticCurveTo(0, h, 0, h - br);
    ctx.lineTo(0, br);
    ctx.quadraticCurveTo(0, 0, br, 0);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Format A: PFP Overlay Renderer
   */
  function renderFormatA_PFPOverlay() {
    // 1. Base Dark Fill
    ctx.fillStyle = '#050B07';
    ctx.fillRect(0, 0, 1080, 1080);

    // 2. Render Full Bleed User Photo or Cyber Empty State
    if (state.uploadedImage) {
      drawCenterCropImage(ctx, state.uploadedImage, 0, 0, 1080, 1080);
    } else {
      // Empty Photo Cyber State for Format A PFP Overlay
      ctx.save();
      ctx.fillStyle = '#07150C';
      ctx.fillRect(0, 0, 1080, 1080);

      // Subtle Grid Pattern
      ctx.strokeStyle = 'rgba(124, 255, 79, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 1080; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1080); ctx.stroke();
      }
      for (let y = 0; y < 1080; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1080, y); ctx.stroke();
      }

      // Center Prompt
      ctx.fillStyle = '#F4D83A';
      ctx.font = '900 32px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('[ + UPLOAD PHOTO FOR PFP OVERLAY ]', 1080 / 2, 1080 / 2);
      ctx.textAlign = 'left';
      ctx.restore();
    }

    // 3. Cyber Green Outer Border Frame
    ctx.strokeStyle = '#003816';
    ctx.lineWidth = 40;
    ctx.strokeRect(20, 20, 1040, 1040);

    // Neon Inner Accent Line
    ctx.strokeStyle = '#E1FE00';
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 40, 1000, 1000);

    // 4. Bottom #FrameInGoa Banner Pill
    const pillW = 600;
    const pillH = 90;
    const pillX = (1080 - pillW) / 2;
    const pillY = 920;

    ctx.fillStyle = '#003816';
    ctx.strokeStyle = '#E1FE00';
    ctx.lineWidth = 4;
    drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 45, true, true);

    ctx.fillStyle = '#E1FE00';
    ctx.font = '900 38px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('#FrameInGoa 🌴', 1080 / 2, pillY + 58);
    ctx.textAlign = 'left'; // Reset

    // 5. Top Right Badge Stamp
    ctx.fillStyle = '#E1FE00';
    drawRoundedRect(ctx, 760, 60, 260, 50, 8, true, false);
    ctx.fillStyle = '#000000';
    ctx.font = '900 18px "JetBrains Mono", monospace';
    ctx.fillText('HH GOA 2026', 820, 92);
  }

  // ----------------------------------------------------
  // UTILITY CANVAS MATH & EXPORT HELPERS
  // ----------------------------------------------------

  function createPlaceholderAvatar() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 400;
    tempCanvas.height = 400;
    const tCtx = tempCanvas.getContext('2d');

    tCtx.fillStyle = '#121E16';
    tCtx.fillRect(0, 0, 400, 400);

    tCtx.fillStyle = '#E1FE00';
    tCtx.font = '900 120px "Inter", sans-serif';
    tCtx.textAlign = 'center';
    tCtx.textBaseline = 'middle';
    tCtx.fillText('HH', 200, 200);

    const img = new Image();
    img.onload = () => {
      state.uploadedImage = img;
      renderCanvas();
    };
    img.src = tempCanvas.toDataURL();
  }

  function drawCenterCropImage(ctx, img, x, y, w, h) {
    const imgRatio = img.width / img.height;
    const targetRatio = w / h;

    let sourceX = 0, sourceY = 0, sourceW = img.width, sourceH = img.height;

    if (imgRatio > targetRatio) {
      sourceW = img.height * targetRatio;
      sourceX = (img.width - sourceW) / 2;
    } else {
      sourceH = img.width / targetRatio;
      sourceY = (img.height - sourceH) / 2;
    }

    ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, x, y, w, h);
  }

  function drawHalftoneImage(ctx, img, dx, dy, dw, dh) {
    // Create an offscreen canvas to perform pixel analysis
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = dw;
    tempCanvas.height = dh;
    const tempCtx = tempCanvas.getContext('2d');

    // Draw the image centered and cropped into the offscreen canvas
    drawCenterCropImage(tempCtx, img, 0, 0, dw, dh);

    // Fill output destination with pure white base
    ctx.fillStyle = '#F7F7F7';
    ctx.fillRect(dx, dy, dw, dh);

    // Get the image data
    let imgData;
    try {
      imgData = tempCtx.getImageData(0, 0, dw, dh);
    } catch (e) {
      // Fallback in case of CORS or other canvas security issues
      ctx.drawImage(img, dx, dy, dw, dh);
      return;
    }

    const data = imgData.data;
    const dotSpacing = 6;
    ctx.fillStyle = '#0E2418'; // Match background color for high-contrast B&W look

    for (let y = dotSpacing / 2; y < dh; y += dotSpacing) {
      for (let x = dotSpacing / 2; x < dw; x += dotSpacing) {
        let sumLuminance = 0;
        let count = 0;

        const startX = Math.max(0, Math.floor(x - dotSpacing / 2));
        const endX = Math.min(dw, Math.floor(x + dotSpacing / 2));
        const startY = Math.max(0, Math.floor(y - dotSpacing / 2));
        const endY = Math.min(dh, Math.floor(y + dotSpacing / 2));

        for (let sy = startY; sy < endY; sy++) {
          for (let sx = startX; sx < endX; sx++) {
            const idx = (sy * dw + sx) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            sumLuminance += lum;
            count++;
          }
        }

        const avgLuminance = count > 0 ? sumLuminance / count : 255;
        let intensity = 1 - (avgLuminance / 255);

        // Enhance contrast for halftone effect
        intensity = Math.pow(intensity, 1.5) * 1.3;
        intensity = Math.min(1, Math.max(0, intensity));

        if (intensity > 0.05) {
          const maxRadius = (dotSpacing * Math.sqrt(2)) / 2 * 0.9;
          const radius = intensity * maxRadius;
          ctx.beginPath();
          ctx.arc(dx + x, dy + y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  /**
   * Step 2: Procedural PCB / Circuit Lines Pattern (Edges Only)
   */
  function drawPCBCircuitLines(ctx, w, h) {
    ctx.save();

    // 1. Line style: Very thin (1px), #7CFF4F at 12% opacity
    ctx.strokeStyle = 'rgba(124, 255, 79, 0.12)';
    ctx.lineWidth = 1;

    // Traces strictly along perimeter edges, leaving center clean
    const traces = [
      // Top-Left Edge Trace
      {
        path: [
          { x: 30, y: 50 },
          { x: 200, y: 50 },
          { x: 240, y: 90 },
          { x: 240, y: 160 }
        ],
        nodes: [
          { x: 200, y: 50 },
          { x: 240, y: 160 }
        ]
      },
      // Top-Right Corner Trace
      {
        path: [
          { x: 620, y: 40 },
          { x: 800, y: 40 },
          { x: 840, y: 80 },
          { x: 840, y: 220 }
        ],
        nodes: [
          { x: 620, y: 40 },
          { x: 800, y: 40 },
          { x: 840, y: 220 }
        ]
      },
      // Top-Center Edge Accent
      {
        path: [
          { x: 340, y: 25 },
          { x: 560, y: 25 }
        ],
        nodes: [
          { x: 450, y: 25 }
        ]
      },
      // Right Mid-Edge Trace
      {
        path: [
          { x: 865, y: 280 },
          { x: 865, y: 480 },
          { x: 835, y: 510 },
          { x: 835, y: 640 }
        ],
        nodes: [
          { x: 865, y: 280 },
          { x: 835, y: 640 }
        ]
      },
      // Bottom-Right Edge Trace
      {
        path: [
          { x: 630, y: 750 },
          { x: 630, y: 980 },
          { x: 850, y: 980 },
          { x: 850, y: 1040 }
        ],
        nodes: [
          { x: 630, y: 750 },
          { x: 850, y: 1040 }
        ]
      },
      // Bottom-Center Edge Trace
      {
        path: [
          { x: 320, y: 1160 },
          { x: 580, y: 1160 },
          { x: 620, y: 1120 },
          { x: 740, y: 1120 }
        ],
        nodes: [
          { x: 320, y: 1160 },
          { x: 580, y: 1160 },
          { x: 740, y: 1120 }
        ]
      },
      // Bottom-Left Accent Trace
      {
        path: [
          { x: 130, y: 1040 },
          { x: 240, y: 1040 },
          { x: 280, y: 1080 },
          { x: 310, y: 1080 }
        ],
        nodes: [
          { x: 130, y: 1040 },
          { x: 240, y: 1040 },
          { x: 310, y: 1080 }
        ]
      },
      // Left Mid-Edge Trace
      {
        path: [
          { x: 35, y: 220 },
          { x: 35, y: 440 },
          { x: 65, y: 470 },
          { x: 65, y: 620 }
        ],
        nodes: [
          { x: 35, y: 220 },
          { x: 65, y: 620 }
        ]
      },
      // Left Lower Edge Trace
      {
        path: [
          { x: 45, y: 680 },
          { x: 45, y: 860 },
          { x: 75, y: 890 },
          { x: 75, y: 970 }
        ],
        nodes: [
          { x: 45, y: 680 },
          { x: 75, y: 970 }
        ]
      }
    ];

    // 2. Render Lines
    traces.forEach(t => {
      if (t.path.length > 1) {
        ctx.beginPath();
        ctx.moveTo(t.path[0].x, t.path[0].y);
        for (let i = 1; i < t.path.length; i++) {
          ctx.lineTo(t.path[i].x, t.path[i].y);
        }
        ctx.stroke();
      }
    });

    // 3. Render Glowing Node Dots
    traces.forEach(t => {
      t.nodes.forEach(node => {
        // Outer Glowing Halo
        ctx.save();
        ctx.shadowColor = '#7CFF4F';
        ctx.shadowBlur = 10;
        ctx.fillStyle = 'rgba(124, 255, 79, 0.3)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Inner Core Dot (4px)
        ctx.fillStyle = '#7CFF4F';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    ctx.restore();
  }

  /**
   * Step 3: Left Vertical Strip Renderer
   * Width: 120px
   * Main Vertical Text: HACKER HOUSE (#F4D83A, Bebas Neue / Anton, 8px letter spacing)
   * Small GOA Text near bottom
   */
  function drawLeftVerticalStrip(ctx, w, h) {
    ctx.save();

    const stripWidth = 120;

    // 1. Dark Strip Panel Background Fill (much lighter so the bg image shows through)
    ctx.fillStyle = 'rgba(4, 14, 9, 0.2)';
    ctx.fillRect(0, 0, stripWidth, h);

    // 2. Right Vertical Separator Border Line (Accent)
    ctx.strokeStyle = 'rgba(124, 255, 79, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(stripWidth, 0);
    ctx.lineTo(stripWidth, h);
    ctx.stroke();

    // Subtle Inner Accent Line
    ctx.strokeStyle = '#F4D83A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(stripWidth - 4, 0);
    ctx.lineTo(stripWidth - 4, h);
    ctx.stroke();

    // 3. Main Vertical Text: HACKER HOUSE (Stretched vertically)
    ctx.save();
    ctx.translate(72, 600);
    ctx.rotate(-Math.PI / 2); // Rotated vertically upwards

    ctx.fillStyle = '#F4D83A';
    ctx.font = '900 110px "Bebas Neue", "Anton", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if ('letterSpacing' in ctx) {
      ctx.letterSpacing = '40px';
      ctx.fillText('HACKER HOUSE', 0, 0);
    } else {
      drawTextWithSpacing(ctx, 'HACKER HOUSE', 0, 0, 40);
    }
    ctx.restore();

    ctx.restore();
  }

  function drawTextWithSpacing(ctx, text, x, y, letterSpacing) {
    const characters = text.split('');
    let totalWidth = 0;

    characters.forEach(char => {
      totalWidth += ctx.measureText(char).width + letterSpacing;
    });
    totalWidth -= letterSpacing;

    let currentX = x - totalWidth / 2;
    characters.forEach(char => {
      const charWidth = ctx.measureText(char).width;
      ctx.fillText(char, currentX + charWidth / 2, y);
      currentX += charWidth + letterSpacing;
    });
  }

  function fillTextWithDynamicSize(ctx, text, x, y, maxW, baseFont, letterSpacing = 0) {
    ctx.save();
    const sizeMatch = baseFont.match(/(\d+)px/);
    let fontSize = sizeMatch ? parseInt(sizeMatch[1]) : 16;
    
    let currentFont = baseFont;
    ctx.font = currentFont;
    
    function getWidth() {
      if (letterSpacing > 0) {
        const chars = text.split('');
        let w = 0;
        chars.forEach(c => {
          w += ctx.measureText(c).width + letterSpacing;
        });
        return w - letterSpacing;
      }
      return ctx.measureText(text).width;
    }

    while (getWidth() > maxW && fontSize > 12) {
      fontSize -= 1;
      currentFont = baseFont.replace(/\d+px/, `${fontSize}px`);
      ctx.font = currentFont;
    }

    if (letterSpacing > 0) {
      if ('letterSpacing' in ctx) {
        ctx.letterSpacing = `${letterSpacing}px`;
        ctx.fillText(text, x, y);
      } else {
        drawTextWithSpacing(ctx, text, x, y, letterSpacing);
      }
    } else {
      ctx.fillText(text, x, y);
    }
    
    ctx.restore();
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

  function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength - 1) + '…' : text;
  }

  function downloadCanvasImage() {
    showLoading('Saving Image...');

    // Small delay so the loading overlay renders before we block the thread
    setTimeout(() => {
      try {
        // Strategy: scale up the already-rendered onscreen canvas.
        // This avoids any re-render and is immune to tainted-canvas issues
        // caused by file:// protocol restrictions on cross-origin images.
        const hdScale = 3;
        const hdCanvas = document.createElement('canvas');
        const liveCanvas = document.getElementById('outputCanvas');
        hdCanvas.width  = liveCanvas.width  * hdScale;
        hdCanvas.height = liveCanvas.height * hdScale;
        const hdCtx = hdCanvas.getContext('2d');

        // Disable smoothing for crisp pixel output, then draw scaled
        hdCtx.imageSmoothingEnabled = true;
        hdCtx.imageSmoothingQuality = 'high';
        hdCtx.drawImage(liveCanvas, 0, 0, hdCanvas.width, hdCanvas.height);

        // Use toBlob() instead of toDataURL() — it's more reliable and
        // avoids the giant base64 string that can cause memory issues.
        hdCanvas.toBlob((blob) => {
          if (blob) {
            triggerDownload(blob, `HHGoa2026_${state.format}_HD.png`);
          } else {
            // toBlob returned null — canvas may be tainted
            console.warn('HD toBlob returned null, falling back to 1x download');
            tryDownloadLiveCanvas();
          }
          hideLoading();
        }, 'image/png', 1.0);

      } catch (hdErr) {
        console.warn('HD export failed, falling back to 1x download:', hdErr);
        // Fallback: try direct export from the live canvas
        tryDownloadLiveCanvas();
      }
    }, 80);
  }

  function tryDownloadLiveCanvas() {
    try {
      const liveCanvas = document.getElementById('outputCanvas');
      liveCanvas.toBlob((blob) => {
        if (blob) {
          triggerDownload(blob, `HHGoa2026_${state.format}.png`);
        } else {
          // Still null — canvas is tainted. Try last-resort: redraw without external images.
          console.warn('Direct toBlob returned null, using last-resort fallback');
          fallbackDownloadWithoutImages();
        }
        hideLoading();
      }, 'image/png', 1.0);
    } catch (fallbackErr) {
      console.error('Fallback download also failed:', fallbackErr);
      // Last resort: build a fresh canvas from scratch without any external images
      fallbackDownloadWithoutImages();
    }
  }

  /**
   * Last-resort download: re-render the design on a fresh canvas WITHOUT any
   * external images (logo, background) so the canvas can never be tainted.
   * This guarantees a download even on strict file:// URLs.
   */
  function fallbackDownloadWithoutImages() {
    try {
      const fallbackCanvas = document.createElement('canvas');
      const liveCanvas = document.getElementById('outputCanvas');
      fallbackCanvas.width = liveCanvas.width;
      fallbackCanvas.height = liveCanvas.height;
      const fCtx = fallbackCanvas.getContext('2d');

      // Re-render the current format onto the fresh canvas
      // (renderCanvas uses the global ctx, so save/restore around it)
      const originalCtx = ctx;
      // Temporarily redirect context
      ctx = fCtx;
      // Reset noise pattern so it re-creates on the new context
      noisePattern = null;
      renderCanvas();
      // Restore original context
      ctx = originalCtx;

      fallbackCanvas.toBlob((blob) => {
        if (blob) {
          triggerDownload(blob, `HHGoa2026_${state.format}_fallback.png`);
        } else {
          alert('Download blocked by browser security.\n\nOpen the page via a local server (e.g. "Live Server" VS Code extension) instead of a file:// URL to enable image exports.');
        }
        hideLoading();
      }, 'image/png', 1.0);
    } catch (err) {
      console.error('Last-resort fallback failed:', err);
      alert('Download blocked by browser security.\n\nOpen the page via a local server (e.g. "Live Server" VS Code extension) instead of a file:// URL to enable image exports.');
      hideLoading();
    }
  }

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    // Small delay before removal & revoke to ensure the click registers
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 200);
  }

  function shareToXIntent() {
    const shareText = encodeURIComponent(
      `Building for Hacker House Goa 2026! 🌴\nFormat: ${state.format === 'formatB' ? 'Builder ID Card' : 'PFP Overlay'}\nLess Noise. More Signal.\n\n#FrameInGoa @HackerHouseGoa`
    );
    const intentUrl = `https://twitter.com/intent/tweet?text=${shareText}`;
    window.open(intentUrl, '_blank');
  }

  function showLoading(text) {
    loadingText.textContent = text;
    loadingOverlay.classList.remove('hidden');
  }

  function hideLoading() {
    loadingOverlay.classList.add('hidden');
  }

  function drawHousePalmLogo(ctx, x, y, size) {
    ctx.save();
    ctx.strokeStyle = '#67FF5E';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Glow effect
    ctx.shadowColor = 'rgba(103, 255, 94, 0.6)';
    ctx.shadowBlur = 12;

    // Draw House
    ctx.beginPath();
    // Roof
    ctx.moveTo(x + size * 0.1, y + size * 0.45);
    ctx.lineTo(x + size * 0.5, y + size * 0.1);
    ctx.lineTo(x + size * 0.9, y + size * 0.45);

    // Left wall
    ctx.moveTo(x + size * 0.18, y + size * 0.45);
    ctx.lineTo(x + size * 0.18, y + size * 0.95);
    // Floor
    ctx.lineTo(x + size * 0.82, y + size * 0.95);
    // Right wall
    ctx.lineTo(x + size * 0.82, y + size * 0.45);
    ctx.stroke();

    // Draw Palm Tree inside
    ctx.strokeStyle = '#67FF5E';
    ctx.lineWidth = 2.5;

    // Trunk
    ctx.beginPath();
    ctx.moveTo(x + size * 0.54, y + size * 0.95);
    ctx.quadraticCurveTo(x + size * 0.53, y + size * 0.72, x + size * 0.48, y + size * 0.52);
    ctx.stroke();

    // Leaves (Fronds)
    const tx = x + size * 0.48;
    const ty = y + size * 0.52;

    ctx.beginPath();
    // Leaf 1: top-left
    ctx.moveTo(tx, ty);
    ctx.quadraticCurveTo(tx - 16, ty - 8, tx - 18, ty + 2);

    // Leaf 2: mid-left
    ctx.moveTo(tx, ty);
    ctx.quadraticCurveTo(tx - 18, ty + 4, tx - 14, ty + 12);

    // Leaf 3: top-right
    ctx.moveTo(tx, ty);
    ctx.quadraticCurveTo(tx + 16, ty - 8, tx + 18, ty + 2);

    // Leaf 4: mid-right
    ctx.moveTo(tx, ty);
    ctx.quadraticCurveTo(tx + 18, ty + 4, tx + 14, ty + 12);

    // Leaf 5: top-center
    ctx.moveTo(tx, ty);
    ctx.quadraticCurveTo(tx, ty - 16, tx - 4, ty - 13);
    ctx.stroke();

    // Tiny sand mound at the bottom
    ctx.beginPath();
    ctx.arc(x + size * 0.56, y + size * 0.95, 8, Math.PI, 0);
    ctx.stroke();

    ctx.restore();
  }

  function drawTinyPalmTree(ctx, x, y) {
    ctx.save();
    ctx.strokeStyle = '#C8FF33';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';

    // Trunk
    ctx.beginPath();
    ctx.moveTo(x + 5, y + 12);
    ctx.quadraticCurveTo(x + 5, y + 6, x + 3, y + 2);
    ctx.stroke();

    // Leaves
    ctx.beginPath();
    ctx.moveTo(x + 3, y + 2); ctx.quadraticCurveTo(x - 2, y + 1, x - 4, y + 5);
    ctx.moveTo(x + 3, y + 2); ctx.quadraticCurveTo(x + 2, y - 2, x + 1, y - 4);
    ctx.moveTo(x + 3, y + 2); ctx.quadraticCurveTo(x + 8, y + 1, x + 10, y + 5);
    ctx.stroke();
    ctx.restore();
  }

  function drawStickerPalmTree(ctx, x, y) {
    ctx.save();
    ctx.strokeStyle = '#67FF5E';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(103, 255, 94, 0.5)';
    ctx.shadowBlur = 8;

    // Trunk
    ctx.beginPath();
    ctx.moveTo(x, y + 35);
    ctx.quadraticCurveTo(x - 5, y + 15, x - 12, y);
    ctx.stroke();

    // Leaves
    const tx = x - 12;
    const ty = y;

    ctx.beginPath();
    // Left leaf
    ctx.moveTo(tx, ty);
    ctx.quadraticCurveTo(tx - 15, ty - 5, tx - 18, ty + 8);
    // Top-left leaf
    ctx.moveTo(tx, ty);
    ctx.quadraticCurveTo(tx - 10, ty - 15, tx - 2, ty - 18);
    // Top-right leaf
    ctx.moveTo(tx, ty);
    ctx.quadraticCurveTo(tx + 10, ty - 15, tx + 14, ty - 6);
    // Right leaf
    ctx.moveTo(tx, ty);
    ctx.quadraticCurveTo(tx + 15, ty - 2, tx + 12, ty + 12);
    ctx.stroke();

    ctx.restore();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
