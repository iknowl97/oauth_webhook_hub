# 🎨 UI Redesign Implementation Plan: "Floating Glass"

**Goal**: Refactor the existing application to match the `Docs/DESIGN_GUIDELINES.md` standard ("webhook.cool" style).

## User Review Required

> [!IMPORTANT]
> This is a major visual overhaul. The app will shift from a full-screen dashboard to a centralized "Floating Mac Window" design.

## Proposed Changes

### 1. Global Styles & Variables

#### [MODIFY] [index.css](file:///c:/Users/gioam/Desktop/oauth_webhook_hub/frontend/src/index.css)

- **Key Implementation Points**:
  - Define new **LCH Color Variables** for the background gradient.
  - Set `body` background to the radial gradient `lch(94 0 0) -> lch(83 0 0)`.
  - Enforce `font-family: 'Inter', sans-serif` globally.
  - Remove any legacy `@layer base` defaults that conflict with the floating design.

### 2. Main Layout Architecture

#### [MODIFY] [Layout.jsx](file:///c:/Users/gioam/Desktop/oauth_webhook_hub/frontend/src/components/Layout.jsx)

- **Key Implementation Points**:
  - **Outer Wrapper**: `fixed inset-0 flex items-center justify-center p-4` to center the app.
  - **App Container**:
    - `w-full max-w-[1600px] h-[90vh]` (Responsive: `h-full` on mobile).
    - `rounded-[32px] overflow-hidden shadow-2xl bg-background/50 backdrop-blur-sm` (Glass base).
    - `border border-white/20` (Subtle rim).
  - **Sidebar**:
    - Change from `w-64 border-r` to standard width but with `bg-transparent`.
    - Content will rely on the parent App Container's background.

### 3. Component Overrides (Glassmorphism)

#### [MODIFY] [dialog.jsx](file:///c:/Users/gioam/Desktop/oauth_webhook_hub/frontend/src/components/ui/dialog.jsx)

#### [MODIFY] [sheet.jsx](file:///c:/Users/gioam/Desktop/oauth_webhook_hub/frontend/src/components/ui/sheet.jsx)

- **Key Implementation Points**:
  - **Overlays**: Increase blur to `backdrop-blur-md`.
  - **Content**: Change `bg-background` to `bg-black/80` (or `bg-white/80` in light mode) with `backdrop-blur-xl`.
  - **Borders**: Ensure borders are `border-white/10`.

### 4. Dashboard (First Impression)

#### [MODIFY] [Dashboard.jsx](file:///c:/Users/gioam/Desktop/oauth_webhook_hub/frontend/src/pages/Dashboard.jsx)

- **Key Implementation Points**:
  - Remove the "Welcome" card.
  - Implement the "Empty State" design: A centered, clean graphic or text explaining "Waiting for requests..."
  - Ensure the route fits seamlessly into the new `Layout` main content area (which should be distinct from the sidebar).

## Verification Plan

### Manual Layout Check

1.  **Desktop View**: Confirm the app is a floating rounded card, not full-screen.
2.  **Mobile View**: Confirm it gracefully falls back to full width/height or maintains a card look if space permits.
3.  **Visuals**: Check that the background is a smooth gradient and not solid gray.
