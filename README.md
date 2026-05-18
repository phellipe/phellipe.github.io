# phellipe.eti.br

Personal portfolio of **João Phellipe de Freitas Pinto** — Senior Software Engineer.

A single-page, bilingual (PT/EN), dark-themed static site. No build step — just HTML,
CSS and vanilla JavaScript.

## Local development

Serve the folder with any static file server:

```bash
npx serve .
# or
python -m http.server 8000
```

Then open the printed URL.

## Structure

```
index.html        Single page — all sections, PT content + SEO metadata
styles.css        Design system + all styles + responsive + print
script.js         Language toggle (PT/EN) + interactions
assets/           Avatar, self-hosted fonts, favicons, OG image
site.webmanifest  PWA manifest
CNAME             Custom domain for GitHub Pages
```

## Deployment — GitHub Pages

Published with GitHub Pages from the `main` branch (root) of the `phellipe.github.io`
repository, on the custom domain `phellipe.eti.br`.

1. Push the repository to `phellipe.github.io` on GitHub.
2. **Settings → Pages →** Source: *Deploy from a branch* → `main` / `/ (root)`.
3. The `CNAME` file applies the custom domain automatically. Enable **Enforce HTTPS**.
4. Configure DNS for `phellipe.eti.br`:

| Type  | Host | Value               |
|-------|------|---------------------|
| A     | @    | 185.199.108.153     |
| A     | @    | 185.199.109.153     |
| A     | @    | 185.199.110.153     |
| A     | @    | 185.199.111.153     |
| AAAA  | @    | 2606:50c0:8000::153 |
| AAAA  | @    | 2606:50c0:8001::153 |
| AAAA  | @    | 2606:50c0:8002::153 |
| AAAA  | @    | 2606:50c0:8003::153 |
| CNAME | www  | phellipe.github.io. |

DNS propagation can take a few hours.
