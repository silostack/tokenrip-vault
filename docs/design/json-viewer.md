# JSON Viewer Design

## Problem

Tokenrip has no way to render JSON content with interactive exploration. Agents frequently produce JSON output (configs, API responses, structured data) that users need to browse, understand, and copy sections from.

## Solution

Add `json` as a new content type with a custom interactive viewer that supports collapsing/expanding nodes and selecting sections to copy.

## Interaction Model

### Two Tap Zones Per Node

Each line in the JSON tree has two distinct tap targets:

1. **Collapse arrow** (gutter, object/array nodes only) — `▶`/`▼` toggle. Tapping collapses or expands the node's children. Minimum 44x44px tap target for mobile.
2. **Content area** (rest of the line) — tapping cycles through progressive highlight states for that node.

### Progressive Highlight Cycle

Tapping a node's content area cycles through three states:

1. **No highlight** → highlight **value only** (for objects/arrays, includes all nested children)
2. **Value highlighted** → highlight **key + value**
3. **Key+value highlighted** → clear highlight

Only one node can be highlighted at a time. Tapping a different node replaces the current selection.

### Copy Button

When any selection is active, a clipboard icon (Lucide) appears right-aligned on the first line of the highlighted region:

- 16x16 icon in a 28x28 tappable circle
- Tap copies pretty-printed JSON to clipboard
- Icon changes to checkmark for ~1.5s, then reverts (same pattern as AssetToolbar)
- **Value-only** selection copies just the value as valid JSON
- **Key+value** selection copies `"key": value` (useful for pasting into configs)

## Visual Design

### Highlight Styling

- Background: soft blue wash — `rgba(59, 130, 246, 0.1)` light / `rgba(59, 130, 246, 0.15)` dark
- Left border: 2px solid blue accent on highlighted lines (vertical scope indicator)
- Two visual states match the two highlight depths (value-only vs key+value)

### Tree Rendering

- Monospace font (Geist Mono, already loaded)
- Indentation: 2 spaces per level
- Syntax coloring: keys, strings, numbers, booleans, null each get a distinct color following the existing theme variables
- Collapsed nodes show: `▶ "key": { ... }` with a count like `{ 3 keys }` or `[ 5 items ]`

## Component Architecture

### Custom Recursive Components (no library)

Off-the-shelf JSON viewers (react-json-view-lite, etc.) have opinionated interaction models that conflict with our tap-cycle behavior. A custom implementation gives full control over tap targets, highlight state, and mobile interactions.

- `JsonViewer` — top-level wrapper. Parses JSON string, manages state, handles malformed JSON (falls back to `PlainTextViewer`).
- `JsonNode` — recursive component. Renders a single key-value pair. For object/array values, renders collapse arrow and recurses into children.

### State (local to JsonViewer, no Jotai needed)

- **Collapsed set**: `Set<string>` of dot-notation paths (e.g. `root.database.credentials`)
- **Selection**: `{ path: string, depth: 'value' | 'key+value' } | null`

All nodes start expanded.

## Backend & CLI Changes

### Backend

- `Asset.ts`: Add `JSON = 'json'` to `AssetType` enum
- `asset.service.ts`: Add `json: 'application/json'` to `CONTENT_MIME_TYPES`
- `asset.controller.ts`: Add `'json'` to valid content types in create endpoint

No migration needed — type is a string column.

### CLI

- `publish.ts`: Add `'json'` to `VALID_TYPES`
- `cli.ts`: Add `json` to content types help text

### Frontend

- `AssetViewer.tsx`: Add `case 'json'` → `JsonViewer`
- New file: `src/components/viewers/JsonViewer.tsx`
- New file: `src/components/viewers/json/JsonNode.tsx`

## Mobile Considerations

- No hover effects anywhere — all interactions are tap-based
- Collapse arrows have 44x44px minimum tap targets (padded)
- Copy button is a tappable circle, not a tiny icon
- Progressive highlight cycle uses simple taps, no long-press or gestures
- Works identically on desktop (click = tap)
