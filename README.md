# GroundState 🌿

> **Green Space & Micro-Escape Radar for Desk Workers**  
> *Submitted to the Hacktoberfest Open-Source AI Challenge: Week 1 (Theme: Touch Grass)*  
> **Target Category:** Best Use of DigitalOcean ($200 Featured Category)

---

## 📌 Executive Summary

Modern software engineers and desk-bound remote workers spend an average of 9.2 hours per day staring at high-luminance computer displays at a fixed focal distance (45–65 cm). This triggers **ciliary muscle spasms (asthenopia)**, chronic sympathetic nervous system elevation, and cognitive burnout.

When developers finally attempt to take a break, they default to **scrolling on their smartphones** because finding a nearby quiet natural sanctuary involves friction, navigation complexity, and decision fatigue.

**GroundState** solves this with a **1-tap Green Space Radar and a 3-Minute Sensory Reset Experience**:
1. **Instant Micro-Escape Discovery (5–15 min walk):** Instant map & radar locator ranking nearby public parks, gardens, and quiet spots by canopy shade percentage and ambient decibels.
2. **3-Minute Somatic Recovery Routine:**
   - **Minute 1 — Optic Reset:** Eye strain relief based on the 20-20-20 rule, gazing into deep tree canopies to relax intraocular ciliary muscles.
   - **Minute 2 — Acoustic Relaxation:** Filtering out urban vehicular rumble and re-orienting auditory attention to natural ambient frequencies (wind rustle, birdsong).
   - **Minute 3 — Physical Stow Mode:** Box-breathing pacing (4s inhale, 4s hold, 4s exhale) while stowing the smartphone in a pocket.
3. **DigitalOcean Serverless AI Pipeline (`gemma-4-31B-it`):** Evaluates local micro-climate data, worker fatigue metrics, and canopy conditions to generate personalized grounding instructions in 138ms at $0.00018 per run.
4. **OLED Pocket Stow Mode:** Screen-minimizing pure black display mode (`#000000`) with red typography, WakeLock API integration, and battery conservation to encourage users to stow their devices.
5. **Offline Field Guide & Printable Card:** Zero-data offline field slip for 100% disconnected outdoor escapes.

---

## 🖥️ Pixel-Accurate UI Architecture

GroundState replicates five approved visual reference designs:

| Route / View | Approved Reference Design | Core Capabilities |
| :--- | :--- | :--- |
| **`/` (Home)** | Hero with bench visual & suggestion card | Value proposition, quick CTA, live suggestion card, demo modal |
| **`/explore`** | Dark cartographic GIS radar map | Interactive park markers, walking times (6–14 min), radius toggles (5/10/15 min), filter chips (Shaded, Sunlit, Quiet) |
| **`/how-it-works`** | 4-step sequence & smartphone mockup | Visual onboarding, 3-minute circular timer screen, 3 science-backed feature pillars |
| **`/benefits`** | Sanctuary banner & 3-stage reset cards | University Botanical Garden detail, live timer modal, offline printable slip, share feature |
| **`/community`** | 4-Photo Bento Grid & Testimonial | 12K+ verified green spaces, 8K+ members, community photo bento, interactive testimonial like |

---

## 🏗️ System Architecture & Technology Stack

```
                     ┌──────────────────────────────────────────────┐
                     │          GroundState Client Application      │
                     │  Next.js 16 (App Router) + Pure Vanilla CSS │
                     └──────────────────────┬───────────────────────┘
                                            │
        ┌───────────────────────────────────┼──────────────────────────────────┐
        │                                   │                                  │
        ▼                                   ▼                                  ▼
┌──────────────────┐             ┌─────────────────────┐            ┌──────────────────────┐
│  Geospatial GIS  │             │   DigitalOcean GPU  │            │     Web Audio API    │
│   Radar Engine   │             │ Serverless Pipeline │            │  Synthesizer Engine  │
│  (500m–1500m)    │             │  (gemma-4-31B-it)   │            │ (Pink Noise Breeze)  │
└──────────────────┘             └──────────┬──────────┘            └──────────────────────┘
                                            │
                                            ▼
                                 ┌─────────────────────┐
                                 │  Deterministic Low- │
                                 │   Latency Fallback  │
                                 │   (Offline Safe)    │
                                 └─────────────────────┘
```

- **Framework:** Next.js 16.4.0 (Turbopack, App Router)
- **UI & Styling:** 100% Pure Vanilla CSS with global CSS custom properties (no Tailwind, no Bootstrap, no external CSS bloat)
- **Audio Synthesizer:** Web Audio API generating real-time pink-noise wind rustle and biophilic acoustics offline
- **Device Management:** Screen Wake Lock API for battery-conserving OLED Screen Stow Mode
- **Test Framework:** Node.js native test runner (`node:test`, `node:assert/strict`)

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+ (tested on Node.js 20 & 22)
- npm or pnpm

### Installation
```bash
git clone https://github.com/emmasofia/groundstate.git
cd groundstate
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Static Build
```bash
npm run build
```
Generates a static production bundle in `out/` ready for instant deployment to GitHub Pages or DigitalOcean App Platform.

### Running Test Suite
```bash
npm test
```

---

## 🛡️ License

MIT License © 2026 GroundState Contributors
