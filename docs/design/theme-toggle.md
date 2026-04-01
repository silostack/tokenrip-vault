# Light/Dark Mode Toggle

## Summary

Add a light/dark mode toggle to the frontend header. Persists the user's choice to localStorage. Defaults to OS preference on first visit.

## State Management

New Jotai atom (`themeAtom`) initializes by:

1. Checking `localStorage.getItem('theme')` for a saved preference
2. Falling back to `window.matchMedia('(prefers-color-scheme: dark)')`

On change, the atom writes to localStorage and toggles the `dark` class on `<html>`.

## UI

Sun/moon icon button in the header, right-aligned opposite the logo. Uses `lucide-react` icons (already a dependency):

- Dark mode active: shows `Sun` icon (click to switch to light)
- Light mode active: shows `Moon` icon (click to switch to dark)

## CSS

No changes needed. `globals.css` already defines `:root` (light) and `.dark` (dark) color variables.

Remove hardcoded `className="dark"` from `<html>` in `__root.tsx` — the atom controls it.

## SSR

Atom initialization (localStorage, matchMedia) is client-only. Default to dark during SSR. Inject a small inline script in `<head>` to set the `dark` class before first paint, avoiding flash of wrong theme.

## Files

| File | Change |
|---|---|
| `src/_jotai/theme/theme.atoms.ts` | New atom with localStorage + OS detection |
| `src/components/ThemeToggle.tsx` | Icon button component |
| `src/app/__root.tsx` | Add ThemeToggle to header, remove hardcoded `dark` class, add anti-flash script |
| `src/app/globals.css` | No changes needed |
