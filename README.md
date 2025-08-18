# Notification Center (Kadoa skin)

- Install: `npm i`
- Dev: `npm run dev` → open http://localhost:5173/notifications
- Build: `npm run build` then `npm run preview`
- Test: `npm run test`

This standalone React app mirrors the visual language of Kadoa. Switch skin/theme in Settings → Appearance.

Keyboard: `/` focuses search; `R` refresh. More to come.

## Kadoa Skin notes
- Uses orange accent for primary actions and unread dots, with subtle bordered cards and soft shadows.
- Subtle geometric background applied to the page wrapper with class `kd-bg` (light/dark variants).
- Dark mode: add `class="dark"` on the root (html/body) or use the in-app toggle.
- Visual overhaul only; all routes, logic and tests remain unchanged.
