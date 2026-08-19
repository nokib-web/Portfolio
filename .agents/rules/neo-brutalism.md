# Neo-Brutalist Design System

A standardized set of principles, design tokens, component specifications, and behavioral rules for crafting authentic Neo-Brutalist user interfaces.

---

## 1. Core Principles: "Bold. Loud. Systematic. Usable."

1. **Thick Black Strokes**: Everything interactive and structural is defined by bold solid borders (2px to 4px `#000000`).
2. **Hard Geometric Elevation**: No soft blurry drop shadows. Use hard offset shadows (`box-shadow: 4px 4px 0px #000000` or `8px 8px 0px #000000`).
3. **High Contrast & Vibrant Accents**: Pair raw neutral backgrounds (paper beige, stark white, deep charcoal) with hyper-saturated accent blocks (Teal, Magenta, Yellow, Lime, Electric Blue).
4. **Squared / Minimal Radii**: Default to crisp 0px corners, or strict minimal radii (`2px` - `4px` max; pills only for badges/tags).
5. **Strict Grid & Hierarchy**: Heavy typography, high structural order, clear divider lines, and visible alignment.
6. **Explicit Focus & Hit Areas**: Interactive elements must have a minimum hit area of `44px × 44px` and obvious tactile states (pressed translation, inverted colors, or high-contrast focus rings).

---

## 2. Design Tokens

### Color Palette

| Token | Hex Value | Usage / Notes |
| :--- | :--- | :--- |
| **Black (Stroke & Text)** | `#000000` | Borders (2-4px), primary text, hard drop shadows |
| **White** | `#FFFFFF` | Card backgrounds, inputs, inverted text blocks |
| **Paper Beige** | `#F5F5DC` / `#FAF6EE` | Canvas / Page background for classic neo-brutalist warmth |
| **Accent Teal** | `#00C2CB` / `#00E5FF` | Primary action highlights, info badges, active tabs |
| **Accent Magenta** | `#FF00FF` / `#FF2A6D` | High-energy accents, highlights, error/destructive |
| **Accent Yellow** | `#FFD700` / `#FFE600` | Warning, eye-catcher cards, badges, key step states |
| **Accent Green** | `#2ED573` / `#00D26A` | Success states, active online indicators |
| **Accent Orange** | `#FFA502` / `#FF7675` | Warnings, secondary highlights |

### Elevation Tokens (Hard Shadows)

```css
/* Elevation 0: Flat / Inline */
--shadow-0: none;

/* Elevation 1: Standard Components / Buttons / Cards */
--shadow-1: 4px 4px 0px #000000;

/* Elevation 2: Prominent / Modals / Hover Elevate */
--shadow-2: 8px 8px 0px #000000;
--shadow-2-large: 12px 12px 0px #000000;
```

### Typography Scale

- **H1 (Giant Heading)**: `96px` / `clamp(48px, 8vw, 96px)` — Extra Bold / Black Display.
- **H2 (Large Heading)**: `64px` / `clamp(36px, 5vw, 64px)` — Bold.
- **H3 (Medium Heading)**: `48px` / `clamp(28px, 4vw, 48px)` — Bold.
- **H4 (Small Heading)**: `32px` — Bold.
- **Body**: `18px` (Line height: 1.5 - 1.6, high contrast, readable).
- **Caption / Mono Subtext**: `14px` — Monospace or uppercase bold.
- **Recommended Font Pairings**:
  - Headings: `Outfit`, `Space Grotesk`, `Syne`, `Archivo Black`, `Plus Jakarta Sans`
  - Body: `Inter`, `Space Grotesk`, `JetBrains Mono`

### Spacing Scale

Strict 4px/8px-based grid increments:
`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`, `96px`.

---

## 3. Component Guidelines

### Buttons

- **Borders**: `2px` or `3px` solid `#000000`.
- **Shadow**: `3px 3px 0px #000000` or `4px 4px 0px #000000`.
- **Interaction**:
  - **Hover**: Translate `-2px, -2px` with shadow expanded, or invert contrast.
  - **Active / Pressed**: Translate `+3px, +3px` with shadow reduced to `0px 0px 0px`.
- **Variants**:
  - *Filled Primary*: Vibrant accent background (Teal / Yellow / Magenta) + black text + 3px stroke.
  - *Outline Secondary*: White/transparent background + black text + 3px stroke + 4px shadow.
  - *Destructive*: Magenta / Crimson background + black text + 3px stroke.

### Form Inputs & Controls

- **Text Inputs**: `2px` solid black border, `14px - 18px` padding, white or light tint background. On focus: thick `3px` outline or sharp contrast shift.
- **Checkboxes & Radios**: Squared boxes with `2px-3px` solid black borders; thick custom checkmark `✓` or solid black fill when checked.
- **Toggles / Switches**: Chunky pill/rect container with `2px` black border and high-contrast ON/OFF indicator.

### Cards & Data Containers

- **Style**: Solid white or light accent background, `3px` solid black border, `6px - 8px` offset hard shadow.
- **Structure**: Bold header bar (optionally color-blocked with solid black separator line), structured content body, bottom action row.

### Tabs, Steps, & Pagination

- **Tabs**: Framed boxes with `2px` black borders. Active tab filled with accent color (`#00C2CB` or `#FFE600`) and elevated with top border/shadow.
- **Steps**: Numbered circular/squared badges with thick black borders connected by thick black lines (`3px`).
- **Pagination**: Block buttons `< PREV`, `1`, `2`, `3`, `NEXT >` in distinct black-bordered boxes.

### Feedback & System Alerts

- **Alert Banners**: High-saturation background (Green for Success, Yellow for Warning, Magenta for Error) + `2px-3px` solid black border + bold icon + black text.
- **Modals**: Deep `8px - 12px` hard drop shadow, thick black border, centered high-contrast confirmation buttons.
- **Progress Bars**: Thick `2px-3px` black border, solid neon fill with percentage badge.
- **Empty States**: Thick stroke line-art icon, dotted or solid black bordered box, clear call-to-action button.
