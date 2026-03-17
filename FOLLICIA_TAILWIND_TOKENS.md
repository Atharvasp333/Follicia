# Follicia Brand Tokens - Tailwind v4 Format

## For use in `@theme` directive in globals.css

```css
@theme {
  /* ═══════════════════════════════════════════════════════
     FOLLICIA BRAND COLORS
  ═══════════════════════════════════════════════════════ */
  
  /* Primary - Deep Forest Teal */
  --color-brand-teal: #0D3B44;
  --color-brand-teal-mid: #1A5568;
  --color-brand-teal-light: #2A7A8A;

  /* Secondary - Goldenrod */
  --color-brand-gold: #D4AF37;
  --color-brand-gold-light: #E8CC6A;

  /* Accent - Seafoam */
  --color-brand-seafoam: #2A9D8F;
  --color-brand-seafoam-light: #4DBCB0;

  /* Backgrounds */
  --color-brand-cream: #F4F7F5;
  --color-brand-white: #FFFFFF;
  --color-off-white: #FAFCFB;

  /* Neutrals */
  --color-light-gray: #E8EDEB;
  --color-border-gray: #D5E0DC;
  --color-mid-gray: #9AABA5;
  --color-dark-text: #1C2B28;
  --color-body-text: #4A6B63;

  /* Special */
  --color-shop-now: #E2F33E;

  /* ═══════════════════════════════════════════════════════
     TYPOGRAPHY
  ═══════════════════════════════════════════════════════ */
  
  --font-display: var(--font-playfair), "Playfair Display", Georgia, serif;
  --font-body: var(--font-montserrat), "Montserrat", system-ui, sans-serif;
  --font-sans: var(--font-inter), "Inter", system-ui, sans-serif;

  /* ═══════════════════════════════════════════════════════
     BORDER RADIUS
  ═══════════════════════════════════════════════════════ */
  
  --radius-sm: 0.375rem;    /* 6px */
  --radius-md: 0.5rem;      /* 8px */
  --radius-lg: 0.75rem;     /* 12px */
  --radius-xl: 1rem;        /* 16px */
  --radius-2xl: 1.25rem;    /* 20px - Product Cards */
  --radius-3xl: 1.5rem;     /* 24px - Modals */
  --radius-full: 9999px;    /* Buttons */

  /* ═══════════════════════════════════════════════════════
     SHADOWS
  ═══════════════════════════════════════════════════════ */
  
  --shadow-card: 0 2px 12px rgba(13,59,68,0.05);
  --shadow-card-hover: 0 16px 40px rgba(13,59,68,0.12);
  --shadow-modal: 0 32px 80px rgba(0,0,0,0.18);
  --shadow-glass: 0 8px 32px rgba(13, 59, 68, 0.08);
  --shadow-cta: 0 32px 80px rgba(13,59,68,0.2);
}
```

## JavaScript/TypeScript Constants

```typescript
// Use this in your components for inline styles
export const FOLLICIA_TOKENS = {
  colors: {
    teal: "#0D3B44",
    tealMid: "#1A5568",
    seafoam: "#2A9D8F",
    seafoamLight: "#4DBCB0",
    gold: "#D4AF37",
    goldLight: "#E8CC6A",
    cream: "#F4F7F5",
    offWhite: "#FAFCFB",
    lightGray: "#E8EDEB",
    borderGray: "#D5E0DC",
    midGray: "#9AABA5",
    darkText: "#1C2B28",
    bodyText: "#4A6B63",
    shopNow: "#E2F33E",
  },
  
  fonts: {
    display: "'Playfair Display', Georgia, serif",
    body: "'Montserrat', system-ui, sans-serif",
    sans: "'Inter', system-ui, sans-serif",
  },
  
  letterSpacing: {
    logo: "0.22em",
    sectionLabel: "0.2em",
    badge: "0.06em",
    button: "0.1em",
  },
  
  radius: {
    card: "1.25rem",
    modal: "1.5rem",
    button: "9999px",
  },
  
  easing: [0.22, 1, 0.36, 1] as [number, number, number, number],
} as const;
```

## Component Patterns

### Button Styles

```tsx
// Primary Teal Button
<button className="btn-teal">
  {/* or inline: */}
  style={{
    background: "#0D3B44",
    color: "white",
    borderRadius: "9999px",
    padding: "0.75rem 2rem",
    fontWeight: 600,
    transition: "all 0.25s ease",
  }}
</button>

// Gold Gradient Button
<button className="btn-gold">
  {/* or inline: */}
  style={{
    background: "linear-gradient(135deg, #D4AF37, #E8CC6A)",
    color: "#0D3B44",
    borderRadius: "9999px",
    padding: "0.75rem 2rem",
    fontWeight: 700,
  }}
</button>

// Shop Now Button (Hero CTA)
<button style={{
  background: "#E2F33E",
  color: "#0D0D0D",
  borderRadius: "0",
  padding: "1rem 2rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
}}>
  Shop Now
</button>
```

### Badge Styles

```tsx
// Seafoam Badge (Scalp Care)
<span className="badge-seafoam">
  {/* or inline: */}
  style={{
    background: "rgba(42, 157, 143, 0.12)",
    border: "1px solid rgba(42, 157, 143, 0.3)",
    color: "#2A9D8F",
    borderRadius: "9999px",
    padding: "3px 10px",
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  }}
</span>

// Gold Badge (Premium)
<span className="badge-gold">
  {/* Similar pattern with gold colors */}
</span>

// Bestseller Badge
<span style={{
  background: "linear-gradient(135deg, #D4AF37, #E8CC6A)",
  color: "#0D3B44",
  borderRadius: "9999px",
  padding: "3px 10px",
  fontSize: "0.58rem",
  fontWeight: 700,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
}}>
  Bestseller
</span>
```

### Card Styles

```tsx
// Product Card
<div className="product-card">
  {/* or inline: */}
  style={{
    background: "white",
    borderRadius: "1.25rem",
    border: "1px solid #E8EDEB",
    boxShadow: "0 2px 12px rgba(13,59,68,0.05)",
    transition: "all 0.3s ease",
  }}
  // Hover state adds:
  // transform: "translateY(-6px)",
  // boxShadow: "0 20px 48px rgba(13, 59, 68, 0.12)"
</div>

// Glass Card
<div className="glass-card">
  {/* or inline: */}
  style={{
    background: "rgba(244, 247, 245, 0.82)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(42, 157, 143, 0.18)",
    borderRadius: "1.25rem",
    boxShadow: "0 8px 32px rgba(13, 59, 68, 0.08)",
  }}
</div>
```

### Typography Patterns

```tsx
// Section Label
<p className="section-label">
  {/* or inline: */}
  style={{
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#2A9D8F",
  }}
</p>

// Hero Heading
<h1 style={{
  fontFamily: "'Playfair Display', serif",
  fontWeight: 800,
  fontSize: "clamp(2rem, 4vw, 3rem)",
  color: "#0D3B44",
  lineHeight: 1.15,
}}>
  Your Heading
</h1>

// Body Text
<p style={{
  fontFamily: "'Inter', sans-serif",
  fontSize: "0.95rem",
  color: "#4A6B63",
  lineHeight: 1.7,
}}>
  Your content
</p>
```

## Category-Specific Colors

```typescript
const CATEGORY_COLORS = {
  "Scalp Care": {
    accent: "#2A9D8F",
    bg: "rgba(42,157,143,0.06)",
  },
  "Treatments": {
    accent: "#D4AF37",
    bg: "rgba(212,175,55,0.06)",
  },
  "Conditioning": {
    accent: "#4DBCB0",
    bg: "rgba(77,188,176,0.06)",
  },
  "Cleansing": {
    accent: "#0D3B44",
    bg: "rgba(13,59,68,0.05)",
  },
};
```

## Animation Patterns

```tsx
// Framer Motion Variants
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: i * 0.1, 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1] 
    },
  }),
};

// Hover Animation
<motion.div
  whileHover={{ y: -6 }}
  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
>
  {/* Content */}
</motion.div>
```

## Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 540px) { }

/* Tablet */
@media (max-width: 767px) { }

/* Desktop */
@media (max-width: 1023px) { }

/* Wide */
@media (min-width: 1280px) { }
```

## Key Design Principles

1. **Typography Hierarchy**
   - Headers: Playfair Display (serif, elegant)
   - UI/Buttons: Montserrat (sans-serif, modern)
   - Body: Inter (sans-serif, readable)

2. **Border Radius**
   - Product Cards: 1.25rem (20px)
   - Modals: 1.5rem (24px)
   - Buttons: 9999px (fully rounded)
   - Exception: Shop Now button uses 0 (sharp corners)

3. **Shadows & Depth**
   - Cards: Subtle 5% opacity shadows
   - Hover: Increase to 12% opacity + translateY
   - Modals: Heavy 18% opacity for prominence

4. **Glass Morphism**
   - Background: 82% opacity
   - Backdrop blur: 20px
   - Border: 18% opacity seafoam

5. **Animation**
   - Custom easing: [0.22, 1, 0.36, 1]
   - Hover lifts: -2px (buttons) or -6px (cards)
   - Duration: 0.25s (fast) to 0.7s (slow)

6. **Color Usage**
   - Teal (#0D3B44): Primary brand, headers, dark sections
   - Gold (#D4AF37): Premium features, badges, secondary CTAs
   - Seafoam (#2A9D8F): Interactive elements, scalp care
   - Shop Now (#E2F33E): Hero CTA only
