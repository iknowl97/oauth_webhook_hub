# 🎨 Design Guidelines: The "Cool" Standard

**Inspiration**: [webhook.cool](https://webhook.cool)
**Philosophy**: "Floating Glass & Soft Minimalism"

These guidelines define the mandatory visual and interactive standards for the OAuth & Webhook Hub. The goal is to create a tool that feels like a native, premium macOS application living in the web browser.

---

## 1. Visual Architecture

### The Floating Container

The application should not fill the entire viewport with solid content. Instead, it must "float".

- **Container**: A central, large rounded card that holds the entire app interface.
- **Background**: The `body` background must be a sophisticated, smooth gradient (never a flat color).
  - _Standard_: Radial Gradient LCH `lch(94 0 0)` (Center) → `lch(83 0 0)` (Edges).
- **Effect**: The app container should cast a soft, diffuse shadow to create depth.

### Glassmorphism

Use transparency and blur to create hierarchy without solid walls.

- **Sidebar**: Semi-transparent background (`bg-background/80`) with `backdrop-filter: blur(20px)`.
- **Modals/Overlays**: High blur values to decouple them from the content below.
- **Borders**: Extremely subtle (`border-black/5` or `border-white/10`), just enough to define edges.

---

## 2. Color System

### Palette

We use a **LCH-based** color space for perception-uniformity.

| Context            | Color Description                                | Tail/CSS                           |
| :----------------- | :----------------------------------------------- | :--------------------------------- |
| **Canvas**         | Deep, rich gradient or dynamic mesh              | `radial-gradient(...)`             |
| **App Surface**    | Solid or semi-translucent off-white              | `bg-card`                          |
| **Primary Text**   | Deep Black with reduced opacity                  | `text-foreground` (`opacity: 0.9`) |
| **Secondary Text** | Medium Grey                                      | `text-muted-foreground`            |
| **Accents**        | Use sparingly. Distinct colors for HTTP Methods: |                                    |
| `GET`              | 🔵 Blue                                          | `bg-blue-500`                      |
| `POST`             | 🟢 Green                                         | `bg-green-500`                     |
| `DELETE`           | 🔴 Red                                           | `bg-red-500`                       |
| `PUT/PATCH`        | 🟠 Orange                                        | `bg-orange-500`                    |

---

## 3. Typography

- **Family**: `Inter` (Sans-Serif).
- **Weights**:
  - **Headings**: Bold (`700`) or ExtraBold (`800`) for visual anchors.
  - **Body**: Regular (`400`) for readability.
  - **Metadata**: Light (`300`) or Medium (`500`) for headers/timestamps.
- **Monospace**: use `JetBrains Mono` or `Fira Code` for payloads and tokens.

---

## 4. Interaction Design

### "Alive" Interface

- **Real-time**: Lists (like Webhooks) must animate new items in (slide-down/fade-in).
- **Selection**: Changing a selection in the sidebar must instantly update the main view (no loading spinners if possible).
- **Hover**: Actions (Delete, Edit, Copy) should act as "Ghosts" – invisible until hovered.

### Corner Radii

- **App Container**: `rounded-3xl` (24px+).
- **Buttons/Cards**: `rounded-xl` (12px-16px).
- Avoid sharp `rounded-none` or small `rounded-sm`.

---

## 5. Layout Patterns

### Use the "Mac Window" Metaphor

- **Sidebar (Left)**: Navigation, Lists, branding.
- **Main (Right)**: Detail views, forms, data inspection.
- **Controls**: Place global actions (Theme toggle, Settings) in consistent "Traffic Light" positions (top-left/right).

---

## 🔍 Checklist for New Features

1. [ ] Is it inside the floating container?
2. [ ] Does it use the correct LCH/Tailwind colors?
3. [ ] Are borders subtle and translucent?
4. [ ] Did you animate the entry?
5. [ ] Is the font `Inter`?
