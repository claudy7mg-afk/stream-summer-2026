# Vary: STEAM Festival


## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## GitHub Pages

This project is configured for GitHub Pages with a relative Vite base path and a GitHub Actions workflow at `.github/workflows/deploy.yml`.

To publish it:

```bash
git init
git add .
git commit -m "Prepare GitHub Pages deployment"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

Then in GitHub:

1. Open `Settings > Pages`
2. Set `Source` to `GitHub Actions`
3. Push to `main` again if needed

Your site will be published automatically after the workflow completes.
