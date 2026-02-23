# CLAUDE.md

## Project Overview

**Pointless Joy (아름답지만 무용한 것)** — a Next.js web application that transforms user reflections about "beautifully pointless things" into poetic visual cards. Built with a Korean aesthetic sensibility blending editorial minimalism with emotional warmth.

Current stage: **MVP** using localStorage for persistence and mock poetic transforms (no AI integration yet).

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5 (strict mode)
- **UI:** React 19
- **Styling:** Tailwind CSS 4 + CSS custom properties (design tokens in `globals.css`)
- **Animation:** Framer Motion 12
- **Theming:** next-themes 0.4.6
- **Fonts:** Noto Serif KR (`--font-serif`), Cormorant Garamond (`--font-display`) via `next/font`

## Commands

```bash
npm run dev       # Start dev server on port 3000
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint (eslint-config-next with core-web-vitals + TypeScript)
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout — fonts, metadata, lang="ko"
│   ├── page.tsx            # Landing page — hero, scroll animations, philosophical narrative
│   ├── globals.css         # Design system — CSS variables, textures, scrollbar, base styles
│   ├── favicon.ico
│   ├── write/
│   │   └── page.tsx        # Card creation form — multi-step input with validation
│   ├── archive/
│   │   └── page.tsx        # Card gallery — masonry grid, sorted by date
│   ├── card/
│   │   └── [id]/
│   │       └── page.tsx    # Individual card detail view (dynamic route)
│   └── api/
│       └── generate/
│           └── route.ts    # POST endpoint — mock poetic text generation
└── components/
    └── CardRenderer.tsx    # Shared card component — 3 visual types (postcard, card, typography)
```

## Architecture & Data Flow

### Routes

| Route | Type | Purpose |
|-------|------|---------|
| `/` | Client component | Landing page with scroll-driven storytelling |
| `/write` | Client component | Card creation form → calls `/api/generate` |
| `/archive` | Client component | Gallery of all created cards from localStorage |
| `/card/[id]` | Client component | Single card detail view from localStorage |
| `/api/generate` | API route (POST) | Generates card data with mock poetic transforms |

### Data Model

```typescript
type CardType = "postcard" | "card" | "typography";

interface CardData {
  id: string;            // UUID
  nickname?: string;     // Optional creator name
  answer: string;        // Original user input (max 500 chars)
  generatedText: string; // Poetic transformation of input
  cardType: CardType;
  colorTheme?: string;   // "cream" | "sage" | "sky" | "blush" | "lavender"
  createdAt: string;     // ISO 8601 timestamp
}
```

### Persistence

MVP uses **localStorage** — cards are stored as `card_<uuid>` keys. No backend database yet. The `/api/generate` endpoint returns card data; the client stores it in localStorage.

### API Endpoint

**POST `/api/generate`** accepts `{ answer, nickname?, cardType, colorTheme }` and returns a `CardData` object. Currently uses 5 hardcoded Korean poetic transform templates (randomly selected). Intended to be replaced with Claude API integration.

## Code Conventions

### Naming

- **Components/Types:** PascalCase (`CardRenderer`, `CardData`)
- **Variables/Functions:** camelCase (`generatedText`, `handleSubmit`)
- **Constants:** SCREAMING_SNAKE_CASE (`CARD_TYPE_LABELS`, `COLOR_OPTIONS`, `POETIC_TRANSFORMS`)
- Korean text is used for UI strings and content; English for technical identifiers

### Components

- All page components use `"use client"` directive (interactive/animated)
- Functional components with React hooks for state
- No global state management — local `useState` + localStorage
- Path alias: `@/*` maps to `./src/*`

### Styling

- **Primary:** Tailwind CSS utility classes
- **Design tokens:** CSS custom properties in `globals.css` (colors, fonts)
- **Dynamic values:** Inline styles for runtime-computed properties
- **Responsive:** Mobile-first with Tailwind breakpoints (`md:`, `lg:`)
- No CSS modules — all styling via Tailwind utilities + global CSS variables

### Design System (key CSS variables)

```
--bg: #FDFCFA          --text: #2C2824        --accent: #C4A882
--bg-warm: #F5F0EA     --text-light: #6B6057  --accent-deep: #8B7355
--bg-card: #EDE6DB     --text-faint: #A89D91  --line: #D4C9BA
```

Card colors: `--card-cream`, `--card-sage`, `--card-sky`, `--card-blush`, `--card-lavender`

### Animation

- Framer Motion variants for reusable animations (`fadeUp`, `lineReveal`)
- `whileInView` with `once: true` for scroll-triggered reveals
- Custom easing: `[0.25, 0.1, 0.25, 1]`
- Custom CSS keyframes: `floatSlow` (20-25s), `scrollPulse` (2s)

### Typography

- Serif-first: Noto Serif KR for body, Cormorant Garamond for display
- Base: 17px desktop / 16px mobile, line-height 2
- Favors light (300) and regular (400) weights
- Korean text uses `word-break: keep-all`

## CardRenderer Types

The `CardRenderer` component renders 3 distinct visual styles:

- **postcard** — 5:7 aspect ratio, gradient watercolor background, centered serif text, decorative lines
- **card** — 4:3 aspect ratio, solid pastel background, left-aligned bold text, minimalist
- **typography** — 1:1 aspect ratio, dark background, light centered text, text-as-art

## Important Notes

- The `public/` SVGs (file.svg, globe.svg, next.svg, vercel.svg, window.svg) are default create-next-app assets — not used by the application
- Build requires network access to fetch Google Fonts at build time
- No environment variables are currently required
- No test framework is configured yet
- The `.gitignore` excludes `CONVERSATION_BACKUP.md` and `.omc/` (internal project notes)
