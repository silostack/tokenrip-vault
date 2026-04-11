# Design System

How to use Tokenrip's design tokens and patterns when building new frontend components. Tokens are defined in `apps/frontend/src/app/globals.css` and registered with Tailwind v4 for use as utility classes.

## Quick Reference

```tsx
// Status feedback
<Check className="text-status-success" />
<span className="bg-status-warning/10 text-status-warning">Stale</span>

// Surfaces and text (available but not yet widely adopted)
<div className="bg-surface-1 text-text-secondary">Card content</div>

// Signal accent
<button className="border-signal text-signal">Action</button>
```

---

## Colors

### Neutrals

The existing `foreground/*` opacity pattern (`text-foreground/60`, `bg-foreground/10`, etc.) is the primary system for neutral colors throughout the codebase. Continue using it — it works well and is deeply established.

The named surface/text tokens below are available for cases where you want semantic meaning rather than opacity math:

| Tailwind Class | Light | Dark | When to use |
|---|---|---|---|
| `bg-surface-0` | `#fafafa` | `#09090b` | Page background (same as `bg-background`) |
| `bg-surface-1` | `#f4f4f5` | `#111113` | Raised surfaces, cards, panels |
| `bg-surface-2` | `#e4e4e7` | `#1a1a1f` | Inset areas, wells, active states |
| `bg-surface-3` | `#d4d4d8` | `#27272f` | Borders, dividers (as bg) |
| `text-text-primary` | `#18181b` | `#ededef` | Headings, high-emphasis text |
| `text-text-secondary` | `#52525b` | `#a1a1a8` | Body text, descriptions |
| `text-text-tertiary` | `#a1a1aa` | `#63636e` | Muted labels, timestamps |
| `text-text-ghost` | `#d4d4d8` | `#3f3f47` | Placeholders, disabled text |

### Signal (Cyan Accent)

The brand accent. Use for interactive elements, focus states, and active indicators.

| Tailwind Class | Value | Usage |
|---|---|---|
| `text-signal` / `bg-signal` | `#22d3ee` | Links, focus rings, active indicators |
| `bg-signal-muted` | `#22d3ee` at 15% | Hover backgrounds, subtle highlights |
| `text-signal-strong` | `#06b6d4` | Pressed states, high-emphasis |

### Status

Mode-adaptive — darker shades in light mode, brighter in dark. No `dark:` variant needed.

| Tailwind Class | Light | Dark | Usage |
|---|---|---|---|
| `text-status-success` | `#16a34a` | `#4ade80` | Confirmations, checkmarks, resolved |
| `text-status-warning` | `#d97706` | `#fbbf24` | Stale versions, caution badges |
| `text-status-error` | `#f87171` | `#f87171` | Failures, destructive actions |
| `text-status-info` | = signal | = signal | Informational highlights |

**With opacity for backgrounds:**

```tsx
// Badge pattern — background at 10% opacity, text at full
<span className="bg-status-warning/10 text-status-warning">Warning</span>
<span className="bg-status-success/10 text-status-success">Resolved</span>
<span className="bg-status-error/10 text-status-error">Failed</span>
```

**When to use status vs hardcoded Tailwind colors:**

| Scenario | Use |
|---|---|
| UI feedback (copied, saved, error) | `text-status-success`, `text-status-error` |
| Status badges (resolved, stale, failed) | `bg-status-*/10 text-status-*` |
| Syntax highlighting (JSON viewer, code) | Keep hardcoded (`text-purple-700`, `text-cyan-400`, etc.) |
| Markdown content colors | Keep CSS variables (`--md-link-color`, etc.) |

---

## Typography

Three tiers. Match the tier to the context.

| Tier | Font | Tailwind | Where |
|---|---|---|---|
| **Chrome** | Geist Mono | `font-mono` | Wordmark, asset titles, labels, navigation, toolbar text |
| **Body** | Geist | `font-sans` (default) | UI body text, descriptions, form inputs, dialog copy |
| **Content** | Newsreader | Applied via `.markdown-body` CSS | Markdown viewer paragraphs, list items |

**Rule of thumb:** If it's part of the UI frame, use `font-mono`. If users are reading it as content, let the serif handle it.

### Size Scale

Use Tailwind's built-in scale. The common mappings:

| Role | Class | Example |
|---|---|---|
| Hero heading | `text-4xl font-bold tracking-tight` | Landing page title |
| Asset title | `text-xl font-bold font-mono` | Share page header |
| Section heading | `text-sm font-semibold` | Panel headers |
| Body | `text-sm` | Default UI text |
| Caption | `text-xs` | Timestamps, version labels, metadata |
| Micro | `text-[10px]` or `text-[11px]` | Badge text, notification counts |

---

## Spacing

4px base grid. Use Tailwind's spacing scale (which is already 4px-based): `p-1` = 4px, `p-2` = 8px, `p-3` = 12px, `p-4` = 16px, etc.

**Common patterns from existing components:**

| Context | Padding | Gap |
|---|---|---|
| Page section | `px-6 py-4` | `gap-4` or `gap-6` |
| Panel header | `px-4 py-3` | `gap-2` |
| Toolbar | `px-2 py-1.5` | `gap-2` or `gap-1` |
| Badge | `px-1.5 py-0.5` or `px-2 py-0.5` | — |
| Inline elements | `gap-1` or `gap-2` | — |

---

## Borders & Shadows

**Borders:** Always `border border-foreground/10`. This is the standard across the entire UI.

```tsx
// Standard bordered container
<div className="border border-foreground/10 bg-background">...</div>

// Bottom divider
<div className="border-b border-foreground/10">...</div>
```

**Shadows:** Use sparingly. The existing codebase uses:

| Class | Where |
|---|---|
| `shadow-lg` | Floating toolbar pill, dropdown menus |
| `shadow-sm` | Landing page mockup card |

For new floating elements, prefer `shadow-lg backdrop-blur-md` (the frosted glass pattern used by the toolbar).

---

## Interactive Patterns

### Buttons

Two styles in the codebase:

```tsx
// Ghost button (default — most toolbar/UI buttons)
<button className="flex items-center justify-center rounded-full
  transition-colors hover:bg-foreground/10
  active:scale-95 active:bg-foreground/15">
  <Icon size={18} className="text-foreground/70" />
</button>

// Filled button (primary CTA — e.g. send button)
<button className="bg-foreground text-background rounded-full">
  <ArrowUp size={16} />
</button>
```

### Touch Targets

All interactive elements use `min-h-[44px] min-w-[44px]` for accessible tap targets. Always include this on toolbar-style buttons.

### Hover & Focus

```tsx
// Standard hover
className="transition-colors hover:bg-foreground/10"

// Text hover
className="text-foreground/50 transition-colors hover:text-foreground/80"

// Active/pressed
className="active:scale-95 active:bg-foreground/15"
```

### Frosted Glass (Floating Elements)

```tsx
// Floating toolbar/panel
<div className="border border-foreground/10 bg-foreground/10
  backdrop-blur-md shadow-lg">
  ...
</div>
```

---

## Icons

**Library:** Lucide React (`lucide-react`)

| Context | Size | Stroke |
|---|---|---|
| Toolbar buttons | `size={18}` | default (2) |
| Inline/small | `size={14}` or `size={16}` | default |
| Empty states | `size={18}` with `strokeWidth={1.5}` | lighter feel |
| Decorative/large | `size={32}` with `strokeWidth={1.5}` | lighter feel |

Icon color follows the element: `text-foreground/70` for default, `text-foreground/40` for muted, `text-foreground` for active/selected.

---

## Component Patterns

### Badges

```tsx
// Status badge
<span className="rounded-full bg-status-success/10 px-2 py-0.5
  text-[10px] font-medium text-status-success">
  Resolved
</span>

// Neutral badge
<span className="rounded-full bg-foreground/10 px-2.5 py-0.5
  text-xs font-medium text-foreground/80">
  html
</span>
```

### Panels & Sheets

```tsx
// Side panel (desktop: sidebar, mobile: bottom sheet)
<div className={`
  fixed z-50 bg-background border-foreground/10 flex flex-col
  md:right-0 md:top-0 md:h-full md:w-[380px] md:border-l
  max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:h-[80vh]
  max-md:rounded-t-2xl max-md:border-t
`}>
```

### Empty States

```tsx
<div className="flex h-full flex-col items-center justify-center">
  <div className="flex h-11 w-11 items-center justify-center
    rounded-full bg-foreground/5">
    <MessageSquare size={18} className="text-foreground/15" />
  </div>
  <p className="mt-3 text-sm font-medium text-foreground/30">
    No messages yet
  </p>
  <p className="mt-1 text-[11px] text-foreground/20">
    Messages will appear here
  </p>
</div>
```

### Loading States

```tsx
// Pulsing circle placeholder
<div className="h-8 w-8 animate-pulse rounded-full bg-foreground/5" />
```

---

## Animation

Keep it subtle and fast.

| Context | Duration | Easing |
|---|---|---|
| Hover/focus transitions | `transition-colors` (150ms default) | ease |
| Panel open/close | `duration-200` | `ease-out` |
| Content entry | 300-400ms | `ease-out` |
| Micro-interaction (press) | instant (`active:scale-95`) | — |

Custom animations are defined in `globals.css` for specific components (404 glitch, thread message entry, markdown fade-in). Prefer Tailwind transition utilities for new work.

---

## Dark Mode

Theme is toggled via a `dark` class on `<html>`. The Jotai `themeAtom` manages state and persists to `localStorage`.

**Rules:**
- All new components must work in both modes
- Use `foreground/*` opacity for colors that auto-adapt (most cases)
- Use `dark:` variants only when light and dark need genuinely different values
- Status tokens (`text-status-*`) already adapt — no `dark:` needed
- Test both modes before shipping

---

## Checklist for New Components

1. Uses `border-foreground/10` for borders (not hardcoded colors)
2. Uses `text-foreground/*` opacity for neutral text (not `text-gray-*`)
3. Uses `text-status-*` for success/warning/error feedback
4. Touch targets are at least 44x44px for interactive elements
5. Has `transition-colors` on hover states
6. Works in both light and dark mode
7. Uses `font-mono` for chrome text, default `font-sans` for body
8. Icons are from Lucide at 18px (toolbar) or 16px (inline)
