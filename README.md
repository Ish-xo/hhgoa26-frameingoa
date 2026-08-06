# 🌴 Hacker House Goa 2026 — #FrameInGoa

> **Official Shortlisting Task & Builder ID / PFP Overlay Generator**  
> *"LESS NOISE. MORE SIGNAL."*

![Hacker House Goa 2026 Header](https://img.shields.io/badge/HACKER_HOUSE_GOA-2026-003816?style=for-the-badge&labelColor=000000&color=E1FE00)
![Stage 1 Open Trials](https://img.shields.io/badge/STAGE_1-OPEN_TRIALS-003816?style=for-the-badge&labelColor=000000&color=E1FE00)
![Deadline](https://img.shields.io/badge/DEADLINE-AUG_13_2026_11:59PM-ff0055?style=for-the-badge&labelColor=000000)

---

## ⚡ Executive Overview

Welcome to the official **Hacker House Goa 2026 (#FrameInGoa)** team repository! 

This project is a high-performance, **zero-friction client-side web tool (browser-based website)** built to fulfill the **Stage 1 Open Trials Shortlisting Task** for Hacker House Goa 2026 (Oct 28 – 31, 2026 in Goa, India).

The website works directly in any browser (desktop & mobile) with zero installation required for end-users. Builders can upload their photo, automatically process any file format (JPG, PNG, native iPhone HEIC), auto-crop arbitrary aspect ratios, and instantaneously render branded event visual artifacts formatted for social sharing and profile customisation.

---

## 🎨 Visual Identity & Design System

The visual aesthetic strictly adheres to the official Hacker House Goa 2026 brand identity:

| Element | Hex / Specs | Preview / Description |
| :--- | :--- | :--- |
| **Primary Theme** | `#003816` | **Deep Cyber Green** — Core background & brand identity |
| **Accent / Highlight**| `#E1FE00` | **Electric Neon Yellow** — Badges, highlights, callouts |
| **Background / Contrast**| `#000000` / `#0D0D0D` | **Obsidian Black** — High contrast structural cards |
| **Typography** | `Inter`, `JetBrains Mono` | Clean sans-serif headings with high-tech monospace metadata |
| **Slogan** | *"LESS NOISE. MORE SIGNAL."* | Brand watermark embedded on all generated artifacts |

---

## 📐 Output Formats

The application powers two client-side rendering engines using HTML5 Canvas:

```
                  ┌─────────────────────────────────────────┐
                  │          USER PHOTO UPLOAD              │
                  │   (.jpg, .png, .heic via heic2any)      │
                  └────────────────────┬────────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
         ╔═══════════════════════╗             ╔═══════════════════════╗
         ║       FORMAT A        ║             ║       FORMAT B        ║
         ║   PFP Frame Overlay   ║             ║   Builder ID Badge    ║
         ╚═══════════════════════╝             ╚═══════════════════════╝
         • Circular & Square frames            • Event Dates (28-31 Oct)
         • X Profile optimized                 • Name, Role & Tech Stack
         • Preserves portrait focus            • Dynamic "Builder Class"
         • Branded border & badge              • Unique Serial & Batch ID
```

### 1. Format A: PFP Frame / Overlay
- **Purpose**: Ready-to-use X (Twitter) profile picture overlay.
- **Features**: Circular and square frame options, dynamic scaling, high-resolution canvas output (`1080x1080`).

### 2. Format B: Builder ID Card
- **Purpose**: Digital event credentials & builder passport.
- **Rendered Fields**:
  - **Header**: `HH GOA 2026` | `28 – 31 OCT 2026` | `GOA, INDIA`
  - **User Data**: Cropped Photo + Badge Stamp, Full Name, Primary Role, Tech Stack.
  - **Dynamic Generated Attributes**:
    - **Builder Class**: (e.g., *Pixel Pirate*, *Protocol Architect*, *Kernel Runner*)
    - **Batch Status**: `ALPHA // FIRST WAVE`
    - **Serial Badge**: `#034 / 247`
  - **Footer**: Embedded `#FrameInGoa` & *"LESS NOISE. MORE SIGNAL."* slogan.

---

## 🛠️ Architecture & Tech Stack

```
[ Architecture      ]   Vanilla HTML5 + Modern CSS3 + Native ES6 JavaScript
[ Styling Engine     ]   Custom CSS (Cyberpunk Dark Mode, Glassmorphism, CSS Variables)
[ Image Processing   ]   HTML5 Canvas API (Client-side GPU accelerated)
[ HEIC Support       ]   heic2any library (iPhone native HEIC image conversion)
[ Export Engine      ]   canvas.toDataURL() / toBlob() + Instant Download
[ Social Integration ]   Web Intent API (Direct pre-populated X Share window)
```

### Core Technical Directives
1. **Zero Friction**: 0 login walls, 0 registration steps, 0 backend API latency.
2. **Instant Native Crop**: Math-based center-crop canvas algorithm to handle landscape, portrait, and wide photos effortlessly.
3. **100% Client-Side Privacy**: Photos are processed entirely inside the user's browser canvas — no external image storage required.
4. **Single-Click Workflow**: A unified CTA button triggers an instant `.png` download **and** launches an X share intent window pre-configured with `#FrameInGoa`.

---

## 📁 Repository Structure Blueprint

```
hh-goa-2026-frame-generator/
├── README.md        # Comprehensive project blueprint & team documentation
├── index.html       # Web application DOM layout & UI structure
├── styles.css       # Custom design system (#003816 green, #E1FE00 neon yellow)
└── script.js        # HTML5 Canvas rendering engine, photo upload & X share intent
```

---

## 🚀 Quickstart for Team Members

### Prerequisites
- Any modern web browser (Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge).
- Optional: A lightweight HTTP server like VS Code Live Server or `npx serve`.

### Local Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/your-team/hh-goa-2026-frame-generator.git
cd hh-goa-2026-frame-generator

# 2. Open directly in your browser or run a local dev server
npx serve .
# OR simply open index.html directly in your web browser!
```

---

## 🎯 Selection Criteria & Submission Checklist

This submission is evaluated under **Stage 1 — Open Trials** of the Hacker House Goa 2026 Selection Process.

### 📋 Hard Submission Requirements

- [ ] **Functional Web App**: Client-side Next.js app rendering Format A & Format B graphics seamlessly.
- [ ] **HEIC iPhone Support**: Verified working upload for native Apple photos via `heic2any`.
- [ ] **Instant Download & Social Intent**: Direct high-res `.png` download + X Web Intent pre-filled with `#FrameInGoa`.
- [ ] **Official Submission Form**: Submitted via Google Form before **11:59 PM, 13th August 2026** ([Submission Form Link](https://forms.gle/jM5hTaGvsrfEfixPA)).
- [ ] **Team Member Verification (All-or-Nothing Rule)**: Every team member (1 to 3 members) must independently post their generated badge/PFP graphic on X using `#FrameInGoa`.

### 🛡️ Evaluation Signals Addressed
- **Proof of Building**: Shipped repo, clean code modularity, zero filler dependencies.
- **UI/UX Excellence**: Ultra-polished cyberpunk dark mode UI matching Hacker House Goa 2026 brand colors (`#003816`, `#E1FE00`).
- **Edge Case Rigor**: Handles weird aspect ratio crops, oversized files, and mobile safari rendering efficiently.

---

## 👥 Team & Credits

- **Event**: Hacker House Goa 2026 (Oct 28–31, 2026 | Goa, India)
- **Hashtag**: `#FrameInGoa`
- **Motto**: *"LESS NOISE. MORE SIGNAL."*

---
*Created for Hacker House Goa 2026 Shortlisting Task — Open Trials Stage 1.*
