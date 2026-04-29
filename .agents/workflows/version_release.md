---
description: 게임 포트폴리오 SPA — Vite 빌드 및 GitHub Pages 배포 절차
---

## 📦 Game Portfolio SPA Release Procedure

> **This workflow** builds the Vite project and deploys to GitHub Pages via `gh-pages` branch.

---

### 1. Pre-release Checklist

Verify the following before releasing:

- [ ] All TypeScript errors resolved (`npm run build` completes without error)
- [ ] Routes tested in browser (/, /resume, /self-intro, /projects, /game-history, /records)
- [ ] IntroGate animation plays correctly on first visit
- [ ] Content markdown files are up-to-date
- [ ] No console errors in development mode

#### 🔑 Sensitive Data Check (MANDATORY)

Run the following and confirm **zero matches** before building:

```powershell
Select-String -Path src -Recurse -Pattern 'AIza[A-Za-z0-9_-]{35}' | Select-Object LineNumber, Line
```

- [ ] No hardcoded API keys in source files
- [ ] `.env` files are in `.gitignore`

---

### 2. Run the Build

// turbo
```powershell
npm run build
```

- Output: `dist/` directory
- Verify `dist/index.html` exists and `dist/assets/` contains bundled files

---

### 3. Verify the Build

```powershell
npm run preview
```

Open the preview URL and confirm:

- [ ] App loads successfully
- [ ] All routes work (React Router client-side navigation)
- [ ] No 404 on direct URL access (404.html fallback is in place)
- [ ] Content renders correctly from markdown files

---

### 4. Deploy to GitHub Pages

```powershell
npm run deploy
```

Or manually:

```powershell
git add dist -f
git commit -m "[release] vX.Y.Z"
git subtree push --prefix dist origin gh-pages
```

---

### 5. Update Version History

```
Update package.json version field (only when user explicitly requests)
Append entry to agentmanager/changelog.md
```

---

> **Note**: Always develop using `npm run dev`. The `dist/` folder is for deployment only — never edit files in `dist/` directly.
