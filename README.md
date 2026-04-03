# Reflexive Property Interactive

React (JSX) SPA for the reflexive property of equality. Curriculum, placement, and standards: [Standards.md](Standards.md).

**Live site:** [https://content-interactives.github.io/reflexive_property/](https://content-interactives.github.io/reflexive_property/)

---

## Stack

| Layer | Notes |
|--------|--------|
| Build | Vite 6, `@vitejs/plugin-react` |
| UI | React 19 |
| Styling | Tailwind CSS 3 |
| Icons | `lucide-react` |
| Deploy | `gh-pages -d dist` (`predeploy` → `vite build`) |

---

## Layout

```
vite.config.js          # base: '/reflexive_property/'
src/
  main.jsx → App.jsx → components/ReflexiveProperty.jsx
  components/ui/...
```

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview `dist/` |
| `npm run lint` | ESLint |
| `npm run deploy` | Build + publish to GitHub Pages |

---

## Configuration

`base` in `vite.config.js` must match the GitHub Pages project path (`/reflexive_property/`).
