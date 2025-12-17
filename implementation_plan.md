# 🎨 UI Redesign Implementation Plan: "Floating Glass"

**Goal**: Refactor the existing application to match the `Docs/DESIGN_GUIDELINES.md` standard ("webhook.cool" style).

## User Review Required

> [!IMPORTANT]
> This is a major visual overhaul. The app will shift from a full-screen dashboard to a centralized "Floating Mac Window" design. This affects `Layout.jsx` and all main page containers.

## Proposed Changes

### 1. Global Layout (`frontend/src/components/Layout.jsx`)

- **Move to Floating Container**:
  - Remove full-screen `min-h-screen` background.
  - Wrap the entire app (`Sidebar` + `Main`) in a `div.fixed.inset-0.flex.items-center.justify-center` with the LCH Radial Gradient background.
  - Create the **App Card**: A `div` with `w-[95vw] h-[90vh] max-w-[1600px] rounded-[32px] overflow-hidden` + `shadow-2xl`.
- **Glass Sidebar**:
  - Update sidebar to be semi-transparent with `backdrop-blur-xl`.
  - Remove solid border-right, use subtle white/10 border.

### 2. Dashboard / Home (`frontend/src/pages/Dashboard.jsx`)

- **Empty State Redesign**:
  - Replace current text-heavy intro with a clean, centered call-to-action.
  - Use the "Traffic Light" dots (top-left) purely for aesthetic matching if desirable, or map to actual controls.

### 3. Modals & Dialogs (All Pages)

- **Glass Modals**:
  - Update `DialogContent` (Shadcn) to use `bg-black/80` + `backdrop-blur-md` instead of solid colors.
  - Increase border radius to `rounded-2xl`.

### 4. Typography & Colors

- **Global CSS (`index.css`)**:
  - Enforce `Inter` font family.
  - Update `:root` variables to match the extracted LCH colors for backgrounds.

## Verification Plan

### Manual Layout Check

1.  **Open Localhost**: Verify the app "floats" in the center.
2.  **Resize Window**: Ensure responsiveness (on mobile, it should likely revert to full screen or adapt gracefully).
3.  **Check Blur**: Verify sidebar elements blur the content behind them (if overlapping) or just the background.
