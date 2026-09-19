# rajashree.agrawal.github.io

Personal portfolio site for Rajashree Rakesh Agrawal — a single, self-contained
`index.html` (inline CSS/JS, images embedded as data URIs, fonts from Google
Fonts CDN).

The Quick Mental Maths project is a standalone `mental-maths.html` page linked
from the portfolio's Projects section.

Word Finder (Bookends) is available at `word-finder.html`, adapted from the supplied
JSX game. Its styles, game logic, and original word list are in `assets/word-finder*`.
The bundled list works offline; additional words are checked using the Free
Dictionary API and remembered for the current session. Both games link back to
the portfolio.

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
