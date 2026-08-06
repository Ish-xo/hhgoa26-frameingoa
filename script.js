/**
 * Hacker House Goa 2026 — #FrameInGoa Engine
 * Native HTML5 Canvas Renderer & Event Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const canvas = document.getElementById('outputCanvas');
  const ctx = canvas.getContext('2d');
  
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
  const inputStack = document.getElementById('inputStack');
  const selectClass = document.getElementById('selectClass');
  
  const btnDownload = document.getElementById('btnDownload');
  const btnShareX = document.getElementById('btnShareX');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const loadingText = document.getElementById('loadingText');

  // Application State
  const state = {
    format: 'formatB', // 'formatB' | 'formatA'
    uploadedImage: null,
    name: inputName.value.toUpperCase() || 'BUILDER NAME',
    role: inputRole.value || 'Builder',
    stack: inputStack.value || 'Full-Stack',
    builderClass: selectClass.value || 'Pixel Pirate',
    serialNumber: '#034 / 247',
    batchStatus: 'ALPHA // FIRST WAVE'
  };

  // Default Placeholder Avatar Image
  createPlaceholderAvatar();

  // Initial Render
  renderCanvas();

  // ----------------------------------------------------
  // EVENT LISTENERS
  // ----------------------------------------------------

  // Format Toggles
  btnFormatB.addEventListener('click', () => setFormat('formatB'));
  btnFormatA.addEventListener('click', () => setFormat('formatA'));

  function setFormat(newFormat) {
    state.format = newFormat;
    if (newFormat === 'formatB') {
      btnFormatB.classList.add('active');
      btnFormatA.classList.remove('active');
      idCardInputs.classList.remove('hidden');
    } else {
      btnFormatA.classList.add('active');
      btnFormatB.classList.remove('active');
      idCardInputs.classList.add('hidden');
    }
    renderCanvas();
  }

  // Inputs Change Handlers
  inputName.addEventListener('input', (e) => {
    state.name = e.target.value.toUpperCase() || 'BUILDER NAME';
    renderCanvas();
  });

  inputRole.addEventListener('input', (e) => {
    state.role = e.target.value || 'Builder';
    renderCanvas();
  });

  inputStack.addEventListener('input', (e) => {
    state.stack = e.target.value || 'Full-Stack';
    renderCanvas();
  });

  selectClass.addEventListener('change', (e) => {
    state.builderClass = e.target.value;
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
    createPlaceholderAvatar();
    renderCanvas();
  });

  // Export Buttons
  btnDownload.addEventListener('click', downloadCanvasImage);
  btnShareX.addEventListener('click', shareToXIntent);

  // ----------------------------------------------------
  // FILE HANDLING & HEIC CONVERSION
  // ----------------------------------------------------

  async function handleFile(file) {
    showLoading('Processing file...');
    try {
      let imageBlob = file;

      // Check for iPhone HEIC/HEIF format
      const isHEIC = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
      if (isHEIC && typeof heic2any !== 'undefined') {
        showLoading('Converting iPhone HEIC format...');
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
          state.uploadedImage = img;
          fileName.textContent = file.name;
          dropzonePrompt.classList.add('hidden');
          fileInfo.classList.remove('hidden');
          hideLoading();
          renderCanvas();
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(imageBlob);

    } catch (err) {
      console.error('Error handling file:', err);
      alert('Could not process image file. Please try a standard JPG/PNG.');
      hideLoading();
    }
  }

  // ----------------------------------------------------
  // CANVAS RENDERING ENGINE
  // ----------------------------------------------------

  function renderCanvas() {
    // Canvas is 1080x1080 for crisp output
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (state.format === 'formatB') {
      renderFormatB_IDCard();
    } else {
      renderFormatA_PFPOverlay();
    }
  }

  /**
   * Format B: Builder ID Card Renderer
   */
  function renderFormatB_IDCard() {
    // 1. Background Fill (Cyber Green Gradient)
    const bgGradient = ctx.createLinearGradient(0, 0, 1080, 1080);
    bgGradient.addColorStop(0, '#001F0C');
    bgGradient.addColorStop(1, '#003816');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1080, 1080);

    // Subtle background pattern lines
    ctx.strokeStyle = 'rgba(225, 254, 0, 0.04)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 1080; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 1080);
      ctx.stroke();
    }

    // 2. Outer Card Frame
    ctx.fillStyle = '#09120B';
    ctx.strokeStyle = '#E1FE00';
    ctx.lineWidth = 6;
    drawRoundedRect(ctx, 60, 60, 960, 960, 24, true, true);

    // 3. Card Header Banner
    ctx.fillStyle = '#003816';
    drawRoundedRect(ctx, 90, 90, 900, 100, 12, true, false);

    ctx.fillStyle = '#E1FE00';
    ctx.font = '800 32px "JetBrains Mono", monospace';
    ctx.fillText('HACKER HOUSE GOA 2026', 120, 152);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '700 20px "JetBrains Mono", monospace';
    ctx.fillText('28 – 31 OCT 2026 | GOA, INDIA', 560, 152);

    // 4. Photo Container Box
    const photoX = 120;
    const photoY = 230;
    const photoW = 380;
    const photoH = 380;

    ctx.strokeStyle = '#1B2E21';
    ctx.lineWidth = 4;
    drawRoundedRect(ctx, photoX, photoY, photoW, photoH, 16, false, true);

    // Render User Photo with Center Crop
    if (state.uploadedImage) {
      ctx.save();
      clipRoundedRect(ctx, photoX, photoY, photoW, photoH, 16);
      drawCenterCropImage(ctx, state.uploadedImage, photoX, photoY, photoW, photoH);
      ctx.restore();
    }

    // Badge Stamp over photo
    ctx.fillStyle = '#E1FE00';
    drawRoundedRect(ctx, photoX + 20, photoY + 20, 140, 36, 6, true, false);
    ctx.fillStyle = '#000000';
    ctx.font = '800 16px "JetBrains Mono", monospace';
    ctx.fillText('VERIFIED', photoX + 44, photoY + 44);

    // 5. Right Column — User Data Fields
    const infoX = 540;
    let currentY = 260;

    // Builder Name
    ctx.fillStyle = '#94A3B8';
    ctx.font = '700 16px "JetBrains Mono", monospace';
    ctx.fillText('BUILDER NAME', infoX, currentY);

    currentY += 40;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 38px "Inter", sans-serif';
    ctx.fillText(truncateText(state.name, 18), infoX, currentY);

    // Role & Stack
    currentY += 70;
    ctx.fillStyle = '#94A3B8';
    ctx.font = '700 16px "JetBrains Mono", monospace';
    ctx.fillText('ROLE / TECH STACK', infoX, currentY);

    currentY += 36;
    ctx.fillStyle = '#E1FE00';
    ctx.font = '800 24px "Inter", sans-serif';
    ctx.fillText(`${state.role} • ${state.stack}`, infoX, currentY);

    // Builder Class / Title Badge
    currentY += 70;
    ctx.fillStyle = '#94A3B8';
    ctx.font = '700 16px "JetBrains Mono", monospace';
    ctx.fillText('BUILDER CLASS', infoX, currentY);

    currentY += 24;
    ctx.fillStyle = '#003816';
    ctx.strokeStyle = '#E1FE00';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, infoX, currentY, 380, 50, 8, true, true);

    ctx.fillStyle = '#E1FE00';
    ctx.font = '800 20px "JetBrains Mono", monospace';
    ctx.fillText(state.builderClass, infoX + 20, currentY + 32);

    // Serial & Batch Info
    currentY += 100;
    ctx.fillStyle = '#94A3B8';
    ctx.font = '700 14px "JetBrains Mono", monospace';
    ctx.fillText(`SERIAL: ${state.serialNumber}`, infoX, currentY);
    ctx.fillText(`STATUS: ${state.batchStatus}`, infoX, currentY + 24);

    // 6. Footer Divider & Branding
    ctx.strokeStyle = '#1B2E21';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(120, 880);
    ctx.lineTo(960, 880);
    ctx.stroke();

    // Footer Text
    ctx.fillStyle = '#E1FE00';
    ctx.font = '900 36px "JetBrains Mono", monospace';
    ctx.fillText('#FrameInGoa', 120, 935);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '800 20px "JetBrains Mono", monospace';
    ctx.fillText('LESS NOISE. MORE SIGNAL.', 630, 935);
  }

  /**
   * Format A: PFP Overlay Renderer
   */
  function renderFormatA_PFPOverlay() {
    // 1. Base Dark Fill
    ctx.fillStyle = '#050B07';
    ctx.fillRect(0, 0, 1080, 1080);

    // 2. Render Full Bleed User Photo (Center Cropped)
    if (state.uploadedImage) {
      drawCenterCropImage(ctx, state.uploadedImage, 0, 0, 1080, 1080);
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
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `HHGoa2026_${state.format}_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
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
});
