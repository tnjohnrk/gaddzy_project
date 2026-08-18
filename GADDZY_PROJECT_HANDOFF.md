# GADDZY Website — Complete Project Handoff Document

> **Purpose:** This document captures everything built and modified on the GADDZY website so far. Hand this to any AI or developer to get full context instantly.

---

## 1. Project Overview

**GADDZY** is a premium gadget re-commerce platform (India-focused) where users can sell old mobile phones, tablets, smartwatches, and laptops for instant cash with free doorstep pickup.

- **Type:** Static multi-page website (no build tools / no framework)
- **Tech Stack:** Vanilla HTML + CSS + JavaScript
- **Server:** Python HTTP server (`python -m http.server 8000`)
- **Local URL:** `http://localhost:8000/index.html`
- **Mobile LAN URL:** `http://192.168.29.249:8000/index.html`

---

## 2. File Structure

```
d:\Gaddzy-Price-Engine-Model\
│
├── index.html                          # Main landing page (~1311 lines)
├── privacy.html                        # Privacy policy (legal page)
├── returns.html                        # Returns policy (legal page)
├── shipping.html                       # Shipping policy (legal page)
├── terms.html                          # Terms & conditions (legal page)
├── README.md
│
├── data\
│   └── devices_db.json                 # Device database (brands, models, pricing data)
│
├── pages\
│   ├── brand.html                      # Step 1: Brand selection grid
│   ├── model.html                      # Step 2: Model selection grid
│   ├── varient.html                    # Step 3: Variant selection (storage/color)
│   └── price.html                      # Step 4: Condition quiz → final price quote
│
├── static\
│   ├── css\
│   │   ├── landing\
│   │   │   └── landing.css             # Main landing page styles (~4472 lines)
│   │   ├── style.css                   # Quote calculator pages styles
│   │   └── legal.css                   # Legal/policy pages styles
│   │
│   ├── js\
│   │   ├── landing\
│   │   │   └── landing.js              # Main landing page logic (~1379 lines)
│   │   ├── app.js                      # Brand/model page navigation logic
│   │   ├── engine.js                   # Price calculation engine
│   │   └── legal.js                    # Legal pages accordion/tab logic
│   │
│   └── images\
│       ├── All-Brand-Mobile-Image\     # Device product images (per brand folders)
│       ├── Brand-Logo\                 # Brand logo .avif files for marquee
│       ├── Deductions\                 # Condition/deduction icon images
│       ├── Gaddzy-Assets\              # Logo, favicon, branding assets
│       └── raw\                        # Consolidated loose root images (cleanup)
```

---

## 3. Design System & Visual Language

### CSS Variables (defined in `landing.css :root`)

| Token | Value | Usage |
|---|---|---|
| `--primary` | `#6A0088` | Main GADDZY purple |
| `--primary-hover` | `#52006A` | Darker purple on hover |
| `--primary-light` | `#7E0A9E` | Lighter purple for gradients |
| `--primary-soft` | `#F6EEFF` | Very light purple backgrounds |
| `--text-dark` | `#0F172A` | Primary heading/body text |
| `--text-muted` | `#475569` | Secondary/muted text |
| `--border-color` | `#E2E8F0` | Subtle borders |
| `--border-focus` | `#A855F7` | Focus ring purple |
| `--accent-green` | `#10B981` | Success indicators |
| `--accent-gold` | `#F59E0B` | Stars, ratings |
| `--radius-xl` | `24px` | Large card corners |
| `--radius-full` | `9999px` | Pill shapes |

### Typography
- **Primary font:** `Plus Jakarta Sans` (weights: 400–800)
- **Display font:** `Outfit` (weights: 500–800, used for section titles and hero headings)
- **Icon library:** Font Awesome 6.5.1

### Color Palette Summary
- **Backgrounds:** White (`#FFFFFF`)
- **Headers/Titles:** Dark navy (`#0F172A` or `#20042f`)
- **Accent/CTA:** GADDZY purple gradient (`#6A0088` → `#7E0A9E`)
- **Borders:** Soft gray (`#E2E8F0`), purple-tinted when active (`#6A0DAD`)

---

## 4. Landing Page Sections (index.html — top to bottom)

### 4.1 Page Loader (`#page-loader`)
- **Position:** First element inside `<body>`, above all content
- **Behavior:** Fixed full-screen white overlay with a CSS-only 3D flipping phone animation + pulsing "Loading GADDZY..." text
- **Dismissal:** `window.addEventListener('load')` fades out via `opacity: 0` → removes from DOM after 300ms
- **Also added to:** `brand.html`, `model.html`, `varient.html`, `price.html`

### 4.2 Header (`.top-header`)
- **Desktop:** Fixed top bar with logo, search bar (`.search-container`), location selector, profile dropdown, and hamburger toggle (hidden on desktop). Logo size increased by 200% (`height: 152px`) and aligned to the top to allow clean downward vertical overflow.
- **Mobile (≤768px):**
  - Single-row fixed header, height `56px`
  - Logo size increased by 200% (`height: 88px` / `80px` / `72px` depending on exact mobile width breakpoint) and perfectly vertically centered inside the mobile header, sharing the same vertical alignment center baseline as the hamburger button while keeping the header height unchanged.
  - Search bar hidden from header (`display: none`)
  - Location & profile controls hidden from header (moved to side drawer)
  - Hamburger menu toggle visible on the right, compact size (`36px` width/height)

### 4.3 Navigation (`.main-nav`)
- **Desktop:** Horizontal nav with dropdown mega-menus (Sell Phones, Compare Prices, Sell Gadgets)
- **Mobile:** Right-sliding side drawer (`right: -80%` → `right: 0`), covers 70% width (max `320px`), smooth cubic-bezier transition, blurred backdrop overlay
- **Mobile nav includes:** User controls section (`.mobile-nav-user-controls`) with location selector and profile avatar
- **Scroll lock:** Body gets `.nav-open` class when drawer is open to prevent background scrolling

### 4.4 Hero Section (`.hero-section`)
- **Layout:** Two-column grid (`hero-left` + `hero-bento`)
- **Hero Left:** Mobile search bar (mobile only) → H1 title (description paragraph `.hero-desc-text` is hidden on mobile via `display: none !important`)
- **Mobile Hero Search (`.mobile-hero-search`):**
  - Hidden on desktop (`display: none`)
  - Shown on mobile, centered and compact (`width: 90% !important; max-width: 320px !important; padding: 8px 14px !important; margin: 0 0 10px 0 !important;`)
  - Dynamic rotating placeholders ("Select your brand", "Search iPhone", "Search Samsung", "Search OnePlus", "Search Xiaomi") fading smoothly via `.ph-fade-out` class triggers in JS.
  - Pauses rotation automatically when focused or has user input to prevent distraction
  - Separate `#mobile-global-search-input` and `#mobile-search-dropdown-results` elements (dropdown matches search wrapper width constraint)
- **Hero Brand Search (`.hero-brand-search-wrapper`):**
  - Desktop-only searchable brand selector dropdown
  - Hidden on mobile (`display: none !important`)
  - Dynamically populates from `data/devices_db.json`

### 4.5 Hero Bento Device Cards (`.hero-bento`)
- **Desktop:** 2-column top row (Mobile Phones + Tablets) + 1 full-width bottom row (Smart Watches)
- **Each card (`.hbc`):** Contains a clip layer with purple SVG wave backdrop + device product image + text label + arrow
- **Mobile:**
  - Same 2+1 layout preserved (NOT stacked vertically)
  - Device images displaced diagonally toward bottom-right corner (`bottom: -22px; right: -22px` for phones/tablets, `-10px` for watches)
  - Purple SVG waves enlarged (`140px` for phones/tablets, `210px` for watches) for more visible curved backgrounds
  - Cards have `overflow: hidden` and tight constraints to prevent clipping

### 4.6 Testimonials Section (`#testimonials`)
- **Position:** Below the Top Selling Models marquee and above the Roadmap section
- **Content:** 3 customer review cards with 5-star ratings, review text, author name/avatar/city
- **Desktop:** 3-column horizontal grid layout
- **Mobile:** Stacked swipe deck (CSS absolute positioning with `.active`, `.prev`, `.next`, `.next-2` classes)
  - Touch gesture swipe (vertical + horizontal) handlers in `landing.js`
  - Indicator dots (`.testimonials-dots`) visible on mobile only
  - Container height: `310px`, card height: `255px`

### 4.7 Top Selling Models Brand Marquee (`.brand-marquee-section`)
- **Position:** Below the Hero section and above the Testimonials section
- **Content:** Infinite scrolling horizontal marquee of brand logo images
- **Behavior:** Duplicated track for seamless loop animation

### 4.8 Infinite Center-Focused Carousel (`.carousel-section`)
- Product model cards in a draggable/scrollable horizontal carousel
- Center card is highlighted/enlarged
- Desktop: drag + click navigation
- Mobile: touch swipe + autoplay
- Autoplay interval with user-interaction pause/resume logic
- CSS transitions at `0.26s` for snappy feel

### 4.9 How GADDZY Works — Roadmap (`.roadmap-section`)
- **Desktop:** Horizontal SVG curved path with 3 animated pin markers (Check Price → Schedule Pickup → Get Paid)
- **Mobile:**
  - Vertical layout, cards centered, step icons above cards
  - **Vertical connecting lines REMOVED** (`.mobile-background-line` and `.mobile-progress-line` set to `display: none`)
  - Card text colors set to high contrast: step numbers `#6A0DAD`, titles `#20042f`, descriptions `#4B5563`
  - Inactive cards have `opacity: 0.85` (not faded to 0.4 anymore)
  - Active card gets full opacity + purple border + elevated shadow
- **Animation:** Auto-cycles through steps 1→2→3 on a timer, with SVG path draw and traveler dot animation on desktop

### 4.10 Hot Deals (`.deals-section`)
- **Desktop:** 2-column grid, two gradient cards (purple/dark-purple) side by side
- **Mobile:** **Also 2-column grid** (`repeat(2, 1fr)` with `12px` gap) — cards sit side-by-side horizontally
  - Deal images are absolute-positioned bottom-right watermarks at 25% opacity to avoid text overlap
  - Card min-height: `240px`, deal title font: `0.92rem`

### 4.11 Why Us (`.why-section`)
- **Desktop:** Interactive expanding card slider with 5 feature cards (hover/click to expand)
- **Mobile:** Vertical stacked card deck
  - Active card at `scale(1)`, next at `scale(0.93) translateY(14px)`, next-2 at `scale(0.86) translateY(28px)`
  - Touch swipe (UP = next, DOWN = prev) with non-passive `touchmove` scroll lock
  - Purple gradient backgrounds on cards

### 4.12 Trust & Certification (`.cert-section`)
- Grid of certification/trust indicator cards

### 4.13 FAQ Section (`.faq-section`)
- Accordion-style expandable FAQ items

### 4.14 Footer (`.footer`)
- Multi-column footer with links, social icons, copyright
- Links to legal pages (`privacy.html`, `terms.html`, `shipping.html`, `returns.html`)

### 4.15 Mobile Bottom Navigation Bar (`.mobile-bottom-nav`)
- **Visibility:** Mobile only (≤768px), fixed at viewport bottom
- **Items:** Home | Sell | Profile (icons + labels)
- **Active state:** GADDZY purple highlight
- **Sell button:** Links to `pages/brand.html` (direct navigation to Brand Selection page)
- **Profile button:** Opens the hamburger side drawer
- **Safe area:** Respects iOS `env(safe-area-inset-bottom)`
- **Body offset:** `padding-bottom: calc(64px + env(safe-area-inset-bottom))`

### 4.16 Modals
- **Pincode Modal (`#pincode-modal`):** 6-digit pincode input for delivery availability check
- **Valuation Modal (`#valuation-modal`):** Shows estimated resale value with exchange bonus

---

## 5. Quote Calculator Flow (pages/)

```
brand.html → model.html → varient.html → price.html
```

1. **brand.html:** Loads brands from `data/devices_db.json`, displays searchable brand grid
2. **model.html:** Shows models for selected brand with series filters
3. **varient.html:** Shows storage/color variants for selected model
4. **price.html:** Multi-step condition quiz (warranty, screen, body, functional) → final price quote with breakdown

- **Shared CSS:** `static/css/style.css`
- **Logic:** `static/js/app.js` (navigation), `static/js/engine.js` (price calculation)
- **All pages have the flipping phone page loader**

---

## 6. JavaScript Architecture (landing.js)

### Key Initializers (all via `DOMContentLoaded`)

| Function/Block | Purpose |
|---|---|
| Search autocomplete setup | Wires up both desktop (`#global-search-input`) and mobile (`#mobile-global-search-input`) search bars with dropdown toggling |
| `toggleProfileMenu()` | Profile dropdown menu toggle |
| `openPincodeModal()` / `savePincode()` | Pincode modal with dual-sync to desktop + mobile location displays |
| `toggleMobileNav()` / `closeMobileNav()` | Hamburger side drawer open/close with scroll lock |
| Carousel initialization | Infinite center-focused carousel with clone management, drag, autoplay |
| Roadmap initialization | SVG path animation, step cycling, mobile line measurement (`updateMobileLines`) |
| Why Us slider | Expanding card slider + mobile vertical deck with touch swipe |
| `initHeroBrandSearch()` | Brand search dropdown with keyboard navigation, fetches from `devices_db.json` |
| `initMobileBottomNav()` | Bottom nav click handlers, profile trigger integration |
| `initTestimonialsSlider()` | Testimonials card deck with touch swipe (vertical + horizontal) + dot navigation |

---

## 7. Mobile Responsive Breakpoints

All mobile overrides are in `landing.css` inside `@media (max-width: 768px)` blocks.

### Key Mobile Layout Rules

| Element | Mobile Behavior |
|---|---|
| `.top-header` | Fixed, `height: 90px`, single row |
| `.header-content` | `padding: 0`, flex row |
| `.header-logo-img` | `height: 76px` |
| `.search-container` (header) | `display: none` |
| `.mobile-hero-search` | `display: block`, positioned above hero title |
| `.hero-brand-search-wrapper` | `display: none` |
| `.hero-grid` | Single column |
| `.hero-bento` | 2-col + 1-full-width layout preserved |
| `.testimonials-track` | Absolute-positioned card deck |
| `.deals-grid` | `repeat(2, 1fr)` side-by-side |
| `.mobile-bottom-nav` | Fixed bottom bar, 3 items |
| `body` | `padding-top: 90px`, `padding-bottom: calc(64px + safe-area)` |
| `.main-nav` | Right-sliding drawer |

---

## 8. Critical Rules for Future Work

### DO NOT Modify
- Backend / API endpoints
- `data/devices_db.json` structure
- Price calculation engine (`engine.js`)
- Authentication logic
- Routing between pages
- Desktop layout (unless specifically requested for responsiveness)

### Design Language MUST Be Preserved
- Use GADDZY purple (`#6A0DAD` / `#6A0088`), dark navy (`#20042f` / `#0F172A`), and white (`#FFFFFF`)
- Typography: `Plus Jakarta Sans` for body, `Outfit` for headings
- Rounded corners: use CSS variable `--radius-xl` (`24px`) for cards
- Shadows: subtle, never heavy
- No Tailwind, no frameworks — vanilla CSS only

### Mobile-Specific Gotchas
- Fixed header height changes require matching `body { padding-top }` updates
- Touch event listeners inside sliders MUST use `{ passive: false }` when calling `e.preventDefault()`
- The Why Us card deck and Testimonials slider both use absolute positioning with class-based state management — do NOT switch to scroll-based approaches
- Bottom nav safe-area padding uses `env(safe-area-inset-bottom)` for iOS compatibility
- All images must use `object-fit: contain` and stay within card boundaries — no clipping or overflow

---

## 9. How to Run

```bash
cd d:\Gaddzy-Price-Engine-Model
python -m http.server 8000
```

- **Desktop:** http://localhost:8000/index.html
- **Mobile (same Wi-Fi):** http://192.168.29.249:8000/index.html

---

## 10. Summary of All Changes Made

### CSS Changes (landing.css & style.css)
1. Fixed responsive header → single-row `56px` mobile bar, with 200% enlarged logo vertically centered.
2. Removed header search bar on mobile, added `mobile-hero-search` above hero text.
3. Mobile hero search bar with premium styling and auto-complete (focus outer shadow/glow completely removed for a flat, crisp appearance).
4. Side drawer slides from right with backdrop blur.
5. Bottom navigation bar (Home/Sell/Profile) with safe-area support.
6. User controls migrated inside hamburger drawer.
7. Hero bento cards: 2-col + full-width layout, vertical SVG wave gradients (light purple at top, medium in middle, deepest purple at bottom), diagonally-placed device images.
8. Roadmap: removed vertical connecting lines, increased card/text contrast.
9. Why Us: vertical card deck with scale/translate stacking.
10. Hot Deals: side-by-side 2-column grid on desktop, properly aligned text, badge, description, and CTA arrow buttons using stretch/space-between flex.
11. Testimonials: 3-column desktop grid → stacked swipe deck on mobile.
12. Page loader animation styles.
13. Spacing adjustments: desktop hero padding-top (`110px`) and mobile body padding-top (`72px`) to ensure the overflowing logo never covers content and there is no excessive space above the search bar.
14. Top Selling Models Marquee: brand logo sizes increased by 50% across all viewports with slightly widened item padding to prevent overlap. Spacing above the marquee title is set to `24px` and spacing below it (above logos) has been removed to bring the elements closer.

### HTML Changes
1. **index.html**:
   - Added page loader at top of `<body>`.
   - Added mobile hero search bar inside `.hero-left`.
   - Added mobile nav user controls inside `.main-nav`.
   - Added testimonials section between hero and marquee.
   - Added bottom navigation bar.
   - Sell button links to `pages/brand.html`.
2. **Global Layout Components**:
   - Created **[global-header.js](file:///d:/Gaddzy-Price-Engine-Model/static/js/global-header.js)**: Synchronously writes the shared premium header, profile dropdowns, side menu navigation drawer, location selection modal, and valuation popups to ensure one single source of truth for the header across all pages.
   - Created **[global-footer.js](file:///d:/Gaddzy-Price-Engine-Model/static/js/global-footer.js)**: Synchronously writes the mobile bottom navigation bar (`.mobile-bottom-nav`) across all pages dynamically, with automatic path prefixes (`../`) and active tab highlighting based on the URL.
   - Replaced duplicate header and footer markup in `index.html`, `privacy.html`, `terms.html`, `returns.html`, `shipping.html`, `pages/brand.html`, `pages/model.html`, `pages/varient.html`, and `pages/price.html` with synchronous layout script tags.
   - Linked `landing.css` in all calculator pages (`brand.html`, `model.html`, `varient.html`, `price.html`) to apply the global header, modal, and drawer styles.
   - Added layout padding clearances on `.main-content` in `style.css` (`90px` on desktop, `80px` on mobile) to prevent overlapping with the sticky global header and logo.
   - Refined mobile top header and bottom nav alignments: logo is absolutely centered horizontally and vertically inside the mobile header, the hamburger menu is perfectly aligned with the logo on the same vertical center line, and bottom navigation uses `box-sizing: border-box` to prevent horizontal gaps or clipping.

### JavaScript Changes (landing.js)
1. Dual search bar autocomplete initialization (desktop + mobile).
2. Testimonials slider with touch swipe + dot navigation.
3. Bottom nav click handlers with profile drawer trigger.
4. Why Us vertical swipe deck with scroll lock.
5. Pincode dual-sync for desktop + mobile location displays.

### File Organization
1. Moved loose root images to `static/images/raw/`.
