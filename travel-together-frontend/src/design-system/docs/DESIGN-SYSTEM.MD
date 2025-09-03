---

# TravelTogether Design System (v0.1)

*Last updated: 2025-09-02*

---

## 🎯 Purpose

Establish a lightweight design system for **TravelTogether** that ensures consistency, accessibility, and responsiveness across all UI elements. This doc covers **tokens → primitives → patterns → practices**.

---

## 0. Repo Structure

```
/src
  /design-system
    /tokens
      tailwind.config.extend.ts
    /primitives
      ResponsiveButton.tsx
      IconButton.tsx
      Card.tsx
      Modal.tsx
      FormField.tsx
      Tag.tsx
      AvatarStack.tsx
    /patterns
      ActionBar.tsx
      Toolbar.tsx
      DataList.tsx
    /docs
      DESIGN-SYSTEM.md
/tests
  /ui
    ResponsiveButton.test.tsx
.storybook (optional, for visual regression)
```

---

## 1. Tokens

Tokens are your **single source of truth** (colors, radii, spacing, shadows, typography). They live in Tailwind config so every component stays aligned.

Example excerpt:

```ts
// tailwind.config.extend.ts
export const themeExtend = {
  colors: {
    brand: { 500: '#3b82f6', 600: '#2563eb' },
    accent: { 500: '#fb7185' }
  },
  borderRadius: { xl: '0.75rem', '2xl': '1rem' },
  boxShadow: { soft: '0 8px 24px rgba(2,6,23,0.06)' },
};
```

---

## 2. Primitives (Lego Bricks)

Reusable building blocks, with accessibility baked in.

* **ResponsiveButton** → Icon always visible; text hidden on mobile (`hidden md:inline`).
* **IconButton** → Icon-only with tooltip + aria-label.
* **Card** → Standard container with header/body.
* **Modal** → Accessible dialog with focus trap.
* **FormField** → Consistent label, hint, error messages.
* **Tag** → Small rounded label.
* **AvatarStack** → Overlapping avatars (trip members).

---

## 3. Patterns (Composed Bricks)

Pre-assembled layouts for recurring use.

* **ActionBar** → Trip actions (Export, Edit, Delete). Automatically responsive.
* **Toolbar** → Filters + primary action (e.g., Add Activity).
* **DataList** → Trip info hub (Wi-Fi, flights, rooms) with copy buttons.

---

## 4. Visual Regression Testing

**Problem:** UI bugs often sneak in when styles change (padding, fonts, colors).
**Solution:** Take baseline screenshots of components → compare them on each build.

Tools:

* **Storybook + Chromatic**
* **Playwright screenshot testing**

If something changes visually (intentionally or not), you see a diff. This prevents “oops” style regressions across pages.

---

## 5. Accessibility Defaults

* All icon-only buttons have `aria-label` + `title`.
* Buttons maintain ≥44px touch size.
* Use `focus-visible` rings with sufficient contrast.
* Modals trap focus and close on overlay/Escape.

---

## 6. Future v0.2 Ideas

These upgrades further polish the experience:

* **EmptyState** → Friendly placeholder when no data.
  *Ex: “No activities yet. Add your first idea!” + button.*

* **Toast** → Temporary corner notifications.
  *Ex: “Wi-Fi password copied.”*

* **SegmentedControl** → Pill toggle for related filters.
  *Ex: “All | Voted | Mine” in Activities.*

* **Container Queries** → Adjust layout based on container width, not screen.
  *Ex: ActionBar shows text if wide enough, even on tablets.*

* **Design Tokens Docs** → Auto-generate a reference page showing colors, typography, radii, shadows.

---

## 7. Testing & QA

Example Jest/RTL test:

```tsx
test('ResponsiveButton has aria-label', () => {
  render(<ResponsiveButton icon={Download} label="Export" />);
  expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
});
```

**Visual regression tests** can be layered on via Storybook stories.

---

## 8. Change Management

* Version this system separately (start at `0.1.0`).
* Breaking changes to primitives require a bump and PR discussion.
* Keep a `/CHANGELOG.md` inside `/design-system/docs`.

---

## 9. Rollout Plan

1. Add Tailwind token extension.
2. Implement primitives.
3. Replace Trip Details buttons with `ActionBar`.
4. Replace Trip Info with `DataList`.
5. Run tests + visual checks.
6. Document before/after in PR.

---

## 10. References

* [React Docs](https://react.dev)
* [Tailwind Docs](https://tailwindcss.com/docs)
* [Storybook](https://storybook.js.org/) for component previews
* [Chromatic](https://www.chromatic.com/) for visual regression testing
