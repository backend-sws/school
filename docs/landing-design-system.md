# Landing Page Design System Guide

> **Scope**: This guide covers the landing page (`/`) only. Dashboard themes (`data-theme="royal"`, etc.) are a separate system.

---

## 1. Architecture — CSS Design Tokens

All landing page styling is driven by **CSS custom properties** scoped to `[data-landing-theme]` selectors in `app.css`.

```
app.css (CSS tokens) → [data-landing-theme] selector → var(--l-*) → Components
```

### Rules

- **Source of truth is CSS** — never define colors, fonts, or gradients in JS
- **No inline styles — EVER** — all styling via CSS classes
- **Components consume tokens via utility classes** like `.l-bg`, `.l-font-display`
- **JS only sets the `data-landing-theme` attribute** and holds banner config (structured data)

---

## 2. Token Naming Convention

All landing design tokens use the `--l-` prefix:

| Token | Purpose | Example |
|---|---|---|
| `--l-bg` | Page background | `#FAFBFF` |
| `--l-fg` | Primary text color | `#0F172A` |
| `--l-primary` | Buttons, CTAs, primary accent | `#4F46E5` |
| `--l-primary-soft` | Badge tints, card fills | `#EEF2FF` |
| `--l-accent` | Secondary accent, gradient endpoints | `#7C3AED` |
| `--l-muted` | Descriptions, captions | `#64748B` |
| `--l-surface` | Card backgrounds | `#FFFFFF` |
| `--l-border` | Dividers, card borders | `#E2E8F0` |
| `--l-gradient-hero` | Hero text gradient | `linear-gradient(...)` |
| `--l-gradient-cta` | CTA section bg gradient | `linear-gradient(...)` |
| `--l-gradient-card` | Card hover glow gradient | `linear-gradient(...)` |
| `--l-font-heading` | Heading font family | `'Plus Jakarta Sans'` |
| `--l-font-body` | Body text font family | `'Plus Jakarta Sans'` |
| `--l-font-display` | Display/hero headline font | `'Instrument Serif'` |
| `--l-motif-opacity` | Decorative motif opacity | `0.03` |

---

## 3. Utility Classes

Landing-specific CSS utility classes wrap the tokens:

```css
/* Colors */
.l-bg         { background-color: var(--l-bg); }
.l-fg         { color: var(--l-fg); }
.l-bg-primary { background-color: var(--l-primary); }
.l-bg-surface { background-color: var(--l-surface); }
.l-text-muted { color: var(--l-muted); }
.l-border     { border-color: var(--l-border); }

/* Fonts */
.l-font-heading { font-family: var(--l-font-heading); }
.l-font-body    { font-family: var(--l-font-body); }
.l-font-display { font-family: var(--l-font-display); }

/* Motifs */
.l-motif-ashoka    { /* Ashoka Chakra dot pattern */ }
.l-motif-rangoli   { /* Rangoli concentric curves */ }
.l-motif-mithila   { /* Madhubani fine-line borders */ }
/* ... etc */
```

---

## 4. Light & Dark Mode

Every theme block requires both light **and** dark variants:

```css
/* Light (default) */
[data-landing-theme='default'] {
    --l-bg: #FAFBFF;
    --l-primary: #4F46E5;
}

/* Dark override */
.dark [data-landing-theme='default'] {
    --l-bg: #030712;
    --l-primary: #818CF8;
}
```

The `.dark` class on `<html>` triggers the override. Components don't need to know — they just use `var(--l-bg)` and it resolves correctly.

---

## 5. Adding a New Seasonal Theme

**Step 1**: Add CSS token block in `app.css`:
```css
[data-landing-theme='diwali'] {
    --l-bg: #FFFBF0;
    --l-primary: #D4740A;
    --l-accent: #C62828;
    --l-motif-opacity: 0.04;
    /* ... all tokens ... */
}
.dark [data-landing-theme='diwali'] {
    --l-bg: #1A0A00;
    --l-primary: #FF9800;
    /* ... dark overrides ... */
}
```

**Step 2**: Add banner config in `constants/landing/themes.ts`:
```typescript
diwali: {
    text: '🪔 Happy Diwali! Celebrate with 25% off',
    className: 'l-banner-diwali',
    link: { label: 'Claim Offer →', href: '/pricing?coupon=DIWALI25' },
    dismissible: true,
},
```

**Step 3**: Add banner CSS class in `app.css`:
```css
.l-banner-diwali {
    background: linear-gradient(135deg, #FF6F00, #D4740A, #C62828);
    color: #FFFFFF;
}
```

**Step 4**: Set `LANDING_THEME=diwali` in `.env` (or pass via admin panel).

**That's it. Zero component code changes.**

---

## 6. India-Specific Decorative Motifs

### Available Motifs

| Motif | Art Form | Description |
|---|---|---|
| `ashoka-dots` | National Symbol | 24-spoke radial dot pattern (Ashoka Chakra) |
| `rangoli-curves` | Kolam / Rangoli | Concentric symmetric curved lines |
| `paisley-arcs` | Kashmir | Mango/paisley arc motifs |
| `lotus-grid` | National Flower | Lotus petal geometric grid |
| `mithila-lines` | Madhubani / Mithila | Fine-line borders with fish & flower motifs |
| `warli-dots` | Warli (Maharashtra) | Triangular human/nature figures in dots |
| `chikankari-net` | Lucknowi | Delicate floral mesh embroidery grid |
| `kalamkari-vines` | Andhra / Telangana | Flowing vine and leaf trail patterns |

### Placement Rules

> ⚠️ **Critical**: Decorative motifs must NEVER overlap text content.

- **Position**: `absolute` — corners or edges only
- **Pointer events**: `none` — never block interaction
- **Z-index**: `z-0` — content is always `z-10+`
- **Opacity**: `var(--l-motif-opacity)` — typically `0.02–0.06`
- **Usage**: Apply via CSS class — `.l-motif-ashoka`, `.l-motif-mithila`, etc.

```html
<!-- ✅ Correct — corner-positioned, low opacity, below content -->
<div class="absolute top-0 right-0 l-motif-ashoka pointer-events-none z-0" />
<div class="relative z-10">
    <!-- Actual content here -->
</div>

<!-- ❌ Wrong — full-width background overlapping text -->
<div class="absolute inset-0 l-motif-ashoka">
    <h1>This text is overlapped!</h1>
</div>
```

### Dynamic Motif Rotation

Motifs **auto-swap** on every visit — the page feels fresh without manual management.

**Resolver** (`lib/utils.ts` → `resolveLandingMotif()`):

```typescript
const MOTIF_POOL = [
    'ashoka-dots', 'rangoli-curves', 'paisley-arcs', 'lotus-grid',
    'mithila-lines', 'warli-dots', 'chikankari-net', 'kalamkari-vines',
] as const;

export function resolveLandingMotif(): string {
    const dayOfYear = getDayOfYear();            // Rotates daily
    const visitCount = getVisitCount();           // From localStorage
    const hourBucket = Math.floor(new Date().getHours() / 6); // 4 time slots
    const seed = dayOfYear + visitCount + hourBucket;
    return MOTIF_POOL[seed % MOTIF_POOL.length];
}
```

**Rotation factors:**

| Factor | Effect |
|---|---|
| Day of year | Different motif each day |
| Visit count | Changes on 1st, 2nd, 3rd visit same day (localStorage counter) |
| Time of day | 4 buckets: morning / afternoon / evening / night |

**How it works**: `main-landing.tsx` calls `resolveLandingMotif()` → sets class `l-motif-{result}` on the wrapper. Pure CSS class swap, no inline styles.

---

## 7. Global Spacing System

These tokens are in `:root` — usable across the entire app, not just landing:

```css
:root {
    --space-section: 7rem;       /* 112px — major section gaps */
    --space-section-sm: 5rem;    /* 80px — sub-section gaps */
    --space-content: 3rem;       /* 48px — content block spacing */
    --space-cards: 1.5rem;       /* 24px — card grid gaps */
    --max-w-hero: 1280px;        /* Hero max width */
    --max-w-content: 1120px;     /* Content section max width */
}
```

---

## 8. Font Stack

| Role | Font | Weights | Use Case |
|---|---|---|---|
| Heading | Plus Jakarta Sans | 600, 700, 800 | Section headers, card titles |
| Body | Plus Jakarta Sans | 400, 500 | Paragraphs, descriptions |
| Display | Instrument Serif | 400, italic | Hero headline only |
| Logo | Eczar | — | Keep existing brand identity |

---

## 9. Animation Effects (Magic UI / Aceternity UI Inspired)

| Effect | Section | Description |
|---|---|---|
| Animated Gradient Text | Hero | Key word cycles through gradient colors |
| Blur Fade | All | Scroll-triggered entrance: blur → sharp + fade up |
| Dot Pattern | Hero | Subtle dot grid bg with radial mask |
| Shimmer CTA | Hero | Primary button has animated shimmer sweep |
| Card Spotlight | Features | Cursor-following radial glow on hover |
| Border Beam | Features | Animated border on featured card |
| Marquee | Social Proof | Trust badges scroll horizontally |
| Number Ticker | Social Proof | Stats count up with spring physics |
| Neon Gradient Card | Pricing | Popular plan has animated gradient border |
| Shine Border | Pricing | Animated shine sweep on recommended plan |
| Sparkles Text | CTA | Headline has sparkle particles |
| Scroll Progress | Navbar | Top-of-page color progress bar |

---

## 10. Component Patterns — Do's & Don'ts

### ✅ Do

```tsx
// Use CSS classes for all landing styles
<section className="l-bg l-fg py-[var(--space-section)]">

// Use Each for iteration
<Each of={features} render={(f) => <FeatureCard key={f.id} {...f} />} />

// Motifs in corners only, below content
<div className="absolute bottom-0 left-0 l-motif-ashoka pointer-events-none z-0" />
<div className="relative z-10">{/* content */}</div>
```

### ❌ Don't

```tsx
// Never inline styles
<section style={{ background: 'var(--l-bg)' }}>

// Never hardcode colors
<button className="bg-[#4F46E5]">

// Never use .map() in JSX
{features.map(f => <Card key={f.id} />)}

// Never put motifs behind text
<div className="absolute inset-0 l-motif-ashoka">
    <h1>This will be overlapped!</h1>
</div>
```

---

## 11. File Organization

```
resources/
├── css/
│   └── app.css                        # Design tokens, utility classes, motif SVGs
├── js/
│   ├── constants/landing/
│   │   ├── themes.ts                  # Banner configs, theme list
│   │   ├── types.ts                   # LandingBannerConfig interface
│   │   ├── sections.ts                # Section composition config
│   │   └── navigation.ts             # Nav items
│   └── pages/Landing/
│       ├── components/
│       │   ├── Hero.tsx               # Uses .l-font-display, .l-bg-primary
│       │   ├── FeaturesSection.tsx     # Uses .l-motif-*, card spotlight
│       │   ├── SocialProofSection.tsx  # Uses marquee, number ticker
│       │   ├── PricingSection.tsx      # Uses neon gradient card
│       │   ├── FinalCTASection.tsx     # Uses cursor spotlight
│       │   └── shared/                # Reusable landing sub-components
│       └── main-landing.tsx           # Wraps in [data-landing-theme]
```
