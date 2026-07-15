# rajashree.agrawal

Personal portfolio site for Rajashree Rakesh Agrawal — a single, self-contained
`index.html` (inline CSS/JS, images embedded as data URIs, fonts from Google
Fonts CDN).

## Hosting (GitHub Pages)

The site is deployed with GitHub Pages. Two ways to turn it on:

- **GitHub Actions (included):** the workflow at
  `.github/workflows/deploy-pages.yml` publishes the repo root on every push to
  `main`. In **Settings → Pages → Build and deployment → Source**, choose
  **GitHub Actions**.
- **Deploy from a branch:** in **Settings → Pages → Source**, choose **Deploy
  from a branch**, pick the branch and `/ (root)`.

Because the GitHub account is `rajashreeagrawal97`, the published URLs are:

- Project site (this repo): `https://rajashreeagrawal97.github.io/rajashree.agrawal/`
- User site (if the site lives in a repo named `rajashreeagrawal97.github.io`):
  `https://rajashreeagrawal97.github.io/`

`.nojekyll` is present so Pages serves the files as-is without a Jekyll build.
