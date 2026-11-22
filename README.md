# PNC Infratech Limited — Immersive Next.js 16 & 3D WebGL Rebuild

An immersive, cinematic Next.js 16 (App Router) rebuild of [pncinfratech.com](https://www.pncinfratech.com/), grounded in REA (Reverse Engineer Anything) browser evidence captured from the live website.

## Highlights

- **Interactive 3D WebGL Expressway & Cable-Stayed Bridge (`Three.js` / `React Three Fiber`)**:
  - Procedural 8-lane access-controlled expressway spline, twin-pylon cable-stayed river bridge with tensioned stay cables, sweeping cloverleaf interchange ramp, smart highway gantries, topographic CAD wireframe terrain, and instanced high-speed traffic light-trails with cinema bloom.
  - **4-Chapter Scroll Flythrough** synchronized via `Lenis` + `GSAP ScrollTrigger`, plus live demo camera presets: **Scroll Flythrough**, **Bridge Pylon Cam**, **Aerial Drone**, and **Free 3D Orbit**.
  - Automatic graceful fallback for reduced-motion or non-WebGL devices.
- **100-Hour Paving Record Interactive Scrubber**:
  - Celebrates PNC Infratech’s Asia Book of Records & India Book of Records milestone on Package 29 of the Delhi–Vadodara Greenfield Expressway (NH-148N), paired with official certificates and 6 early-completion bonuses (132 days Purvanchal Pkg V, 109 days Agra–Lucknow Pkg I, 97 days Purvanchal Pkg VI, 96 days Raebareli–Jaunpur NH-231, 4+ months Gwalior–Bhind BOT, 1st NHAI bonus on Agra–Gwalior NH-3).
- **137-Project National Portfolio Ledger (`/projects`)**:
  - Verbatim mandates parsed from PNC’s live project tables across EPC, BOT/HAM, Airports, Bridges, Water & Irrigation, Rail, Industrial, Power, and Coal Mining, with instant search, sector/status/delivery/state filters, and slide-over project dossiers.
- **Interactive 16-State Pan-India Command Map**:
  - Live SVG arterial network connected directly to the 137-project dataset.
- **Investor Relations & SEBI (LODR) Reg 46 Vault (`/investors`)**:
  - 14 audited Annual Report PDFs (FY 2013–14 through FY 2025–26) linked directly to PNC’s hosted filings, plus all 7 SEBI Regulation 46 disclosure pillars.
- **Careers (`/careers`) & Contact (`/contact`)**:
  - All 17 published vacancy codes (`PC-01` to `HAM04`) with interactive application drawer and the official Fraudulent Employment Offers advisory, plus Corporate (Agra) and Registered (New Delhi) office desks.
- **Legacy URL Redirects**:
  - Permanent redirects from legacy `.html` routes (`profile.html`, `our-projects.html`, `highway-constructions.html`, `water-projects.html`, `power-sector.html`, `bridge-construction.html`, `financials.html`, `career.html`, `enquiry.html`, etc.) to the new Next.js routes.

## Run Locally

```bash
npm install
npm run dev
```

Or build and run the production bundle:

```bash
npm run build
npm run start
```
