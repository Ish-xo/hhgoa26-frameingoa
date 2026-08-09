import base64

with open('assets/id_bg.jpeg', 'rb') as f:
    bg_b64 = base64.b64encode(f.read()).decode('utf-8')

with open('assets/apply.png', 'rb') as f:
    photo_b64 = base64.b64encode(f.read()).decode('utf-8')

html_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HH Goa '26 - Custom Builder ID Generator</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;900&family=Cabinet+Grotesk:wght@800;900&family=Noto+Sans+Devanagari:wght@700;900&display=swap');
    
    body {{
      font-family: 'Space Grotesk', sans-serif;
      background-color: #f3f5f2;
      color: #0b3c2d;
    }}
    .font-heading {{ font-family: 'Cabinet Grotesk', sans-serif; }}
    .bg-hh-green {{ background-color: #0b3c2d; }}
    .text-hh-green {{ color: #0b3c2d; }}
    .bg-hh-yellow {{ background-color: #f2f542; }}
    .text-hh-yellow {{ color: #f2f542; }}
    .bg-hh-pink {{ background-color: #ff007f; }}
    .text-hh-pink {{ color: #ff007f; }}
    .border-hh-green {{ border-color: #0b3c2d; }}
    
    .stroke-light {{
      text-shadow: 
        -1px -1px 0 #ffffff,  
         1px -1px 0 #ffffff,
        -1px  1px 0 #ffffff,
         1px  1px 0 #ffffff,
         0px  1px 3px rgba(255, 255, 255, 0.9);
    }}
    .stroke-light-sm {{
      text-shadow: 
        -0.5px -0.5px 0 #ffffff,  
         0.5px -0.5px 0 #ffffff,
        -0.5px  0.5px 0 #ffffff,
         0.5px  0.5px 0 #ffffff;
    }}
  </style>
</head>
<body class="min-h-screen p-4 md:p-8 flex items-center justify-center relative">

  <div class="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start relative z-10">
    
    <!-- CONTROLS FORM -->
    <div class="bg-white/95 backdrop-blur-md border-2 border-hh-green rounded-2xl p-6 shadow-[6px_6px_0px_0px_#0b3c2d]">
      <div class="flex items-center justify-between mb-4 border-b-2 border-hh-green pb-3">
        <h1 class="text-xl font-black font-heading uppercase text-hh-green">Card Generator</h1>
        <span class="bg-hh-yellow text-hh-green text-xs font-bold px-2 py-1 rounded border border-hh-green shadow-[1px_1px_0px_0px_#0b3c2d]">1:1 Square Mode</span>
      </div>

      <form class="space-y-3" onsubmit="return false;">
        <div>
          <label class="block text-xs font-bold uppercase mb-1 text-hh-green">Builder Photo</label>
          <input type="file" id="photoInput" accept="image/*" class="w-full text-xs text-hh-green file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-2 file:border-hh-green file:bg-hh-yellow file:font-bold cursor-pointer border rounded-lg p-1 bg-white" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase mb-1 text-hh-green">Builder Name</label>
          <input type="text" id="inputName" value="Ish Chaniyara" class="w-full px-3 py-1.5 border-2 border-hh-green rounded-lg text-sm font-bold bg-white" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase mb-1 text-hh-green">Role</label>
          <input type="text" id="inputRole" value="Fullstack Engineer" class="w-full px-3 py-1.5 border-2 border-hh-green rounded-lg text-sm font-bold bg-white" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase mb-1 text-hh-green">Title</label>
          <input type="text" id="inputTitle" value="Systems Architect & Hacker" class="w-full px-3 py-1.5 border-2 border-hh-green rounded-lg text-sm font-bold bg-white" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase mb-1 text-hh-green">Team Name</label>
          <input type="text" id="inputTeam" value="Project S.H.I.E.L.D" class="w-full px-3 py-1.5 border-2 border-hh-green rounded-lg text-sm font-bold bg-white" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase mb-1 text-hh-green">Skills (Comma-separated)</label>
          <input type="text" id="inputSkills" value="Flutter, Next.js, Node.js, PostgreSQL" class="w-full px-3 py-1.5 border-2 border-hh-green rounded-lg text-sm font-bold bg-white" />
        </div>

        <div class="pt-3 grid grid-cols-2 gap-3">
          <button type="button" onclick="downloadIDCard(event)" class="py-2.5 bg-hh-yellow text-hh-green font-black uppercase text-xs border-2 border-hh-green rounded-xl shadow-[3px_3px_0px_0px_#0b3c2d] hover:translate-y-0.5 transition-all cursor-pointer">Download PNG</button>
          <button type="button" onclick="shareToX()" class="py-2.5 bg-black text-white font-black uppercase text-xs border-2 border-hh-green rounded-xl shadow-[3px_3px_0px_0px_#0b3c2d] hover:translate-y-0.5 transition-all cursor-pointer">Share on 𝕏</button>
        </div>
      </form>
    </div>

    <!-- CARD DESIGN DISPLAY WITH FULLY VISIBLE GOA BEACH ILLUSTRATION -->
    <div class="flex justify-center w-full">
      <div id="idCardWrapper" class="p-8 rounded-3xl border-4 border-hh-green relative shadow-[10px_10px_0px_0px_#0b3c2d] overflow-hidden z-10 bg-gray-100">
        
        <!-- ID CARD CONTAINER (3:4 ratio) -->
        <div id="idCard" class="w-[360px] min-h-[480px] bg-white border-4 border-hh-green rounded-2xl p-5 shadow-[8px_8px_0px_0px_rgba(11,60,45,0.8)] relative z-10 overflow-hidden flex flex-col justify-between">
          
          <!-- Local Background Image Element inside #idCard -->
          <img id="cardBg" src="data:image/jpeg;base64,{bg_b64}" alt="" class="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none" />

          <!-- Card Content Wrapper (Editorial Typography over artwork) -->
          <div class="relative z-10 flex flex-col h-full justify-between space-y-3">
            
            <!-- Top Header Band -->
            <div class="bg-hh-green text-white -mx-5 -mt-5 p-3.5 border-b-4 border-hh-green flex items-center justify-between shadow-sm">
              <div>
                <div class="text-[10px] font-bold text-hh-yellow tracking-widest leading-none">OFFICIAL BUILDER PASS</div>
                <div class="font-heading font-black text-xl tracking-tight leading-none mt-1">HACKER HOUSE</div>
              </div>
              <div class="bg-hh-pink text-hh-yellow font-black px-2.5 py-0.5 rounded border-2 border-white text-base font-heading rotate-3 shadow-[1px_1px_0px_0px_#0b3c2d]">
                गोवा
              </div>
            </div>

            <!-- Participant Main Block: Photo (Left) + Editorial Info (Right) -->
            <div class="grid grid-cols-12 gap-3 items-center">
              
              <!-- 1:1 Aspect Ratio Photo Frame -->
              <div class="col-span-5 relative">
                <div class="w-full aspect-square bg-gray-100 border-2 border-hh-green rounded-xl overflow-hidden relative shadow-[3px_3px_0px_0px_#0b3c2d]">
                  <img id="cardPhoto" src="data:image/png;base64,{photo_b64}" alt="Builder profile" class="w-full h-full object-cover" style="object-fit: cover; width: 100%; height: 100%;" />
                </div>
                <span class="absolute -bottom-2 -right-1 bg-hh-yellow text-hh-green border border-hh-green text-[7px] font-black px-1 rounded uppercase shadow-[1px_1px_0px_0px_#0b3c2d]">
                  1:1 SPEC
                </span>
              </div>

              <!-- Right Column Metadata (Clean Typography over background, NO boxes!) -->
              <div class="col-span-7 space-y-2 pl-0.5">
                <div>
                  <span class="text-[8px] font-bold uppercase text-hh-green/80 block tracking-wider stroke-light-sm">BUILDER NAME</span>
                  <p id="cardName" class="font-heading font-black text-base text-hh-green leading-tight stroke-light">Ish Chaniyara</p>
                </div>

                <div>
                  <span class="text-[8px] font-bold uppercase text-hh-green/80 block tracking-wider stroke-light-sm">ROLE</span>
                  <p id="cardRole" class="font-bold text-xs text-hh-pink leading-tight stroke-light">Fullstack Engineer</p>
                </div>

                <div>
                  <span class="text-[8px] font-bold uppercase text-hh-green/80 block tracking-wider stroke-light-sm">BUILDER TITLE</span>
                  <p id="cardTitle" class="font-semibold text-[10px] text-hh-green leading-tight stroke-light">Systems Architect & Hacker</p>
                </div>
              </div>
            </div>

            <!-- Team Block with Underline Divider (No Large Background Panel) -->
            <div class="pt-1 pb-1.5 border-b-2 border-hh-green/40 flex items-center justify-between">
              <div>
                <span class="text-[8px] font-bold uppercase text-hh-green/80 block tracking-wider stroke-light-sm">TEAM</span>
                <p id="cardTeam" class="font-black text-xs text-hh-green stroke-light">Project S.H.I.E.L.D</p>
              </div>
              <span class="text-[9px] font-black bg-hh-green text-hh-yellow px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#0b3c2d]">OCT 28-31</span>
            </div>

            <!-- Tech Stack / Skills Pills -->
            <div>
              <span class="text-[8px] font-bold uppercase text-hh-green/80 block mb-1 tracking-wider stroke-light-sm">TECH STACK / SKILLS</span>
              <div id="cardSkills" class="flex flex-wrap gap-1"></div>
            </div>

            <!-- Footer with Hashtag & Barcode (No Panels) -->
            <div class="border-t border-dashed border-hh-green/40 pt-2 flex items-center justify-between">
              <div class="flex flex-col">
                <span class="text-[11px] font-black text-hh-pink stroke-light-sm">#FrameInGoa</span>
                <span class="text-[8px] font-bold text-hh-green stroke-light-sm">GOA, INDIA • 2026</span>
              </div>
              <!-- Barcode Graphic Accent -->
              <div class="flex items-center gap-0.5 h-4 opacity-90">
                <div class="w-0.5 h-full bg-hh-green"></div>
                <div class="w-1 h-full bg-hh-green"></div>
                <div class="w-0.5 h-full bg-hh-green"></div>
                <div class="w-1.5 h-full bg-hh-green"></div>
                <div class="w-0.5 h-full bg-hh-green"></div>
                <div class="w-1 h-full bg-hh-green"></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>

  <script>
    const bindText = (inputId, cardId) => {{
      const input = document.getElementById(inputId);
      const card = document.getElementById(cardId);
      if (input && card) {{
        input.addEventListener('input', () => {{ card.textContent = input.value || '—'; }});
      }}
    }};

    bindText('inputName', 'cardName');
    bindText('inputRole', 'cardRole');
    bindText('inputTitle', 'cardTitle');
    bindText('inputTeam', 'cardTeam');

    const inputSkills = document.getElementById('inputSkills');
    const cardSkills = document.getElementById('cardSkills');

    const updateSkills = () => {{
      if (!cardSkills || !inputSkills) return;
      cardSkills.innerHTML = '';
      const tags = inputSkills.value.split(',').map(s => s.trim()).filter(Boolean);
      tags.forEach(tag => {{
        const pill = document.createElement('span');
        pill.className = 'bg-white border border-hh-green text-hh-green font-bold text-[8px] px-1.5 py-0.5 rounded shadow-[1px_1px_0px_0px_#0b3c2d]';
        pill.textContent = tag;
        cardSkills.appendChild(pill);
      }});
    }};

    if (inputSkills) {{
      inputSkills.addEventListener('input', updateSkills);
      updateSkills();
    }}

    const photoInput = document.getElementById('photoInput');
    if (photoInput) {{
      photoInput.addEventListener('change', (e) => {{
        const file = e.target.files[0];
        if (file) {{
          const objectURL = URL.createObjectURL(file);
          const cardPhoto = document.getElementById('cardPhoto');
          if (cardPhoto) {{
            cardPhoto.src = objectURL;
          }}
        }}
      }});
    }}

    async function waitForImages(container) {{
      const images = [...container.querySelectorAll('img')];
      await Promise.all(
        images.map(img => {{
          if (img.complete && img.naturalWidth > 0) {{
            return Promise.resolve();
          }}
          return new Promise(resolve => {{
            img.onload = resolve;
            img.onerror = resolve;
          }});
        }})
      );
    }}

    function formatCanvasTo900x1200(srcCanvas) {{
      if (srcCanvas.width === 900 && srcCanvas.height === 1200) {{
        return srcCanvas;
      }}
      const targetCanvas = document.createElement('canvas');
      targetCanvas.width = 900;
      targetCanvas.height = 1200;
      const ctx = targetCanvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(srcCanvas, 0, 0, 900, 1200);
      return targetCanvas;
    }}

    async function generateCanvas2DFallback(cardElement) {{
      const canvas = document.createElement('canvas');
      canvas.width = 900;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');

      const bgImg = document.getElementById('cardBg');
      if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {{
        ctx.drawImage(bgImg, 0, 0, 900, 1200);
      }} else {{
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 900, 1200);
      }}

      // Top Header Band
      ctx.fillStyle = '#0b3c2d';
      ctx.fillRect(0, 0, 900, 140);

      ctx.fillStyle = '#f2f542';
      ctx.font = 'bold 20px "Space Grotesk", sans-serif';
      ctx.fillText('OFFICIAL BUILDER PASS', 40, 45);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 48px "Cabinet Grotesk", "Space Grotesk", sans-serif';
      ctx.fillText('HACKER HOUSE', 40, 105);

      // Goa badge
      ctx.save();
      ctx.translate(760, 70);
      ctx.rotate((3 * Math.PI) / 180);
      ctx.fillStyle = '#ff007f';
      ctx.fillRect(-55, -25, 110, 50);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.strokeRect(-55, -25, 110, 50);
      ctx.fillStyle = '#f2f542';
      ctx.font = '900 32px "Cabinet Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('गोवा', 0, 0);
      ctx.restore();

      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';

      // Photo Frame
      const photoSize = 320;
      const photoX = 40;
      const photoY = 180;

      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(photoX, photoY, photoSize, photoSize);
      ctx.strokeStyle = '#0b3c2d';
      ctx.lineWidth = 5;
      ctx.strokeRect(photoX, photoY, photoSize, photoSize);

      const cardPhoto = document.getElementById('cardPhoto');
      if (cardPhoto && cardPhoto.complete && cardPhoto.naturalWidth > 0) {{
        const imgAspect = cardPhoto.naturalWidth / cardPhoto.naturalHeight;
        let sx = 0, sy = 0, sw = cardPhoto.naturalWidth, sh = cardPhoto.naturalHeight;
        if (imgAspect > 1) {{
          sw = cardPhoto.naturalHeight;
          sx = (cardPhoto.naturalWidth - sw) / 2;
        }} else {{
          sh = cardPhoto.naturalWidth;
          sy = (cardPhoto.naturalHeight - sh) / 2;
        }}
        ctx.drawImage(cardPhoto, sx, sy, sw, sh, photoX, photoY, photoSize, photoSize);
      }}

      // 1:1 SPEC Badge
      ctx.fillStyle = '#f2f542';
      ctx.fillRect(photoX + photoSize - 90, photoY + photoSize - 26, 95, 30);
      ctx.strokeStyle = '#0b3c2d';
      ctx.lineWidth = 2;
      ctx.strokeRect(photoX + photoSize - 90, photoY + photoSize - 26, 95, 30);
      ctx.fillStyle = '#0b3c2d';
      ctx.font = '900 14px "Space Grotesk", sans-serif';
      ctx.fillText('1:1 SPEC', photoX + photoSize - 80, photoY + photoSize - 6);

      // Helper for outlined text
      const drawOutlinedText = (text, x, y, font, fillStyle, strokeStyle = '#ffffff', lineWidth = 4) => {{
        ctx.font = font;
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.lineJoin = 'round';
        ctx.strokeText(text, x, y);
        ctx.fillStyle = fillStyle;
        ctx.fillText(text, x, y);
      }};

      const nameVal = document.getElementById('inputName')?.value || 'Ish Chaniyara';
      const roleVal = document.getElementById('inputRole')?.value || 'Fullstack Engineer';
      const titleVal = document.getElementById('inputTitle')?.value || 'Systems Architect & Hacker';
      const teamVal = document.getElementById('inputTeam')?.value || 'Project S.H.I.E.L.D';

      const metaX = 400;

      // BUILDER NAME
      drawOutlinedText('BUILDER NAME', metaX, 215, 'bold 16px "Space Grotesk", sans-serif', '#0b3c2d', '#ffffff', 3);
      drawOutlinedText(nameVal, metaX, 260, '900 38px "Cabinet Grotesk", "Space Grotesk", sans-serif', '#0b3c2d', '#ffffff', 5);

      // ROLE
      drawOutlinedText('ROLE', metaX, 310, 'bold 16px "Space Grotesk", sans-serif', '#0b3c2d', '#ffffff', 3);
      drawOutlinedText(roleVal, metaX, 350, 'bold 26px "Space Grotesk", sans-serif', '#ff007f', '#ffffff', 4);

      // BUILDER TITLE
      drawOutlinedText('BUILDER TITLE', metaX, 400, 'bold 16px "Space Grotesk", sans-serif', '#0b3c2d', '#ffffff', 3);
      drawOutlinedText(titleVal, metaX, 440, '600 22px "Space Grotesk", sans-serif', '#0b3c2d', '#ffffff', 4);

      // TEAM SECTION
      drawOutlinedText('TEAM', 40, 560, 'bold 16px "Space Grotesk", sans-serif', '#0b3c2d', '#ffffff', 3);
      drawOutlinedText(teamVal, 40, 605, '900 32px "Space Grotesk", sans-serif', '#0b3c2d', '#ffffff', 5);

      // Date Badge
      ctx.fillStyle = '#0b3c2d';
      ctx.fillRect(700, 565, 160, 45);
      ctx.strokeStyle = '#0b3c2d';
      ctx.lineWidth = 2;
      ctx.strokeRect(700, 565, 160, 45);
      ctx.fillStyle = '#f2f542';
      ctx.font = '900 20px "Space Grotesk", sans-serif';
      ctx.fillText('OCT 28-31', 725, 595);

      // Divider Line
      ctx.strokeStyle = 'rgba(11, 60, 45, 0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(40, 630);
      ctx.lineTo(860, 630);
      ctx.stroke();

      // TECH STACK / SKILLS
      drawOutlinedText('TECH STACK / SKILLS', 40, 670, 'bold 16px "Space Grotesk", sans-serif', '#0b3c2d', '#ffffff', 3);

      const skillsInput = document.getElementById('inputSkills')?.value || '';
      const skills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
      let skillX = 40;
      let skillY = 690;

      skills.forEach(skill => {{
        ctx.font = 'bold 20px "Space Grotesk", sans-serif';
        const textMetrics = ctx.measureText(skill);
        const pillWidth = textMetrics.width + 28;
        const pillHeight = 40;

        if (skillX + pillWidth > 860) {{
          skillX = 40;
          skillY += 50;
        }}

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(skillX, skillY, pillWidth, pillHeight);
        ctx.strokeStyle = '#0b3c2d';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(skillX, skillY, pillWidth, pillHeight);

        ctx.fillStyle = '#0b3c2d';
        ctx.fillText(skill, skillX + 14, skillY + 26);

        skillX += pillWidth + 12;
      }});

      // FOOTER
      ctx.setLineDash([10, 8]);
      ctx.strokeStyle = 'rgba(11, 60, 45, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(40, 1080);
      ctx.lineTo(860, 1080);
      ctx.stroke();
      ctx.setLineDash([]);

      drawOutlinedText('#FrameInGoa', 40, 1125, '900 32px "Space Grotesk", sans-serif', '#ff007f', '#ffffff', 4);
      drawOutlinedText('GOA, INDIA • 2026', 40, 1160, 'bold 20px "Space Grotesk", sans-serif', '#0b3c2d', '#ffffff', 4);

      const barX = 760;
      const barY = 1100;
      const barWidths = [3, 8, 3, 12, 3, 8];
      let curBarX = barX;
      ctx.fillStyle = '#0b3c2d';
      for (let i = 0; i < barWidths.length; i++) {{
        ctx.fillRect(curBarX, barY, barWidths[i], 40);
        curBarX += barWidths[i] + 4;
      }}

      return canvas;
    }}

    async function downloadIDCard(evt) {{
      const btn = evt ? (evt.currentTarget || evt.target) : null;
      if (btn) {{
        btn.textContent = 'Generating...';
        btn.disabled = true;
      }}

      try {{
        const card = document.getElementById('idCard');
        if (!card) throw new Error('ID card element not found');

        // Step 5: Wait for all images and fonts
        await waitForImages(card);

        if (document.fonts && document.fonts.ready) {{
          await document.fonts.ready;
        }}

        // Step 6: Validate image sources before export
        const images = [...card.querySelectorAll('img')];
        images.forEach(img => {{
          console.log(
            'Export image:',
            img.src,
            img.complete,
            img.naturalWidth,
            img.naturalHeight
          );
        }});

        const nameVal = (document.getElementById('inputName')?.value || 'HHGoa_Builder').trim();
        const fileName = `HHGoa_ID_${{nameVal.replace(/\\s+/g, '_')}}.png`;

        let exportCanvas;

        try {{
          // Step 7: html2canvas configuration
          const canvas = await html2canvas(card, {{
            scale: 3,
            useCORS: false,
            allowTaint: false,
            backgroundColor: '#ffffff',
            logging: false,
            foreignObjectRendering: false
          }});

          exportCanvas = formatCanvasTo900x1200(canvas);
        }} catch (h2cError) {{
          console.error('html2canvas failed, switching to Canvas 2D fallback:', h2cError);
          exportCanvas = await generateCanvas2DFallback(card);
        }}

        // Step 8: Export using toBlob
        let blob;
        try {{
          blob = await new Promise((resolve, reject) => {{
            exportCanvas.toBlob(
              b => {{
                if (b) resolve(b);
                else reject(new Error('Canvas PNG generation failed.'));
              }},
              'image/png',
              1.0
            );
          }});
        }} catch (blobErr) {{
          console.error('Canvas toBlob failed, using 2D fallback:', blobErr);
          const fallbackCanvas = await generateCanvas2DFallback(card);
          blob = await new Promise((resolve, reject) => {{
            fallbackCanvas.toBlob(
              b => b ? resolve(b) : reject(new Error('Fallback canvas generation failed.')),
              'image/png',
              1.0
            );
          }});
        }}

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => {{
          URL.revokeObjectURL(url);
        }}, 1000);

      }} catch (err) {{
        console.error('Download error:', err);
      }} finally {{
        if (btn) {{
          btn.textContent = 'Download PNG';
          btn.disabled = false;
        }}
      }}
    }}

    function shareToX() {{
      const text = encodeURIComponent("Just created my official HH Goa 2026 Builder ID Card! See you at the residency. 🌴⚡️\\n\\n#FrameInGoa @247pmstudio");
      window.open(`https://twitter.com/intent/tweet?text=${{text}}`, '_blank');
    }}
  </script>
</body>
</html>
'''

with open('design.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print('Updated design.html successfully!')
