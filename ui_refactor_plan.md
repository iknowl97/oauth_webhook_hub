# UI Overhaul Plan: Modern & Comfortable

The goal is to replace the "basic" developer UI with a polished, professional, and "comfortable" interface using a Shadcn-inspired design system with Tailwind CSS.

## 1. Design Fundamentals

- **Theme**: Refined Dark Mode (Zinc/Slate palette) with high contrast text and subtle borders.
- **Typography**: Inter (already set) with optimized weights and tracking.
- **Micro-interactions**: Hover states for all interactive elements, smooth transitions.

## 2. Component Architecture (`src/components/ui`)

We will implement "dumb" accessible components following Headless UI / Shadcn patterns manually to avoid CLI interactivity issues.

- `Button`: Variants (default, outline, ghost, destructive)
- `Input` / `Label`: Clean form controls
- `Card`: Unified container for content
- `Badge`: Status indicators
- `Table`: Clean data usage
- `Dialog` (Modal): Smooth fade/zoom animations

## 3. Layout Restructuring (`src/components/Layout.jsx`)

- **Modern Sidebar**: Collapsible, distinct sections, active state indicators with glow/bar.
- **Global Header**: Breadcrumbs, Page Title, Action area.
- **Content Area**: Max-width constraints for readability (e.g., `max-w-6xl`), better padding.

## 4. Page Redesigns

- **Dashboard**:
  - Hero section welcoming the user.
  - "Quick Actions" row.
  - Metrics cards with trend indicators (simulated or real).
- **Providers**:
  - Grid layout with "Provider Cards".
  - Visual icons for provider types (OAuth2 vs OIDC).
- **Webhooks**:
  - "Master-Detail" interaction improvement.
  - List item status dots (green/gray).
  - Copy-paste friendly Code blocks for endpoints.
