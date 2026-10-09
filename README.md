# phellipe.eti.br

Personal portfolio of **João Phellipe de Freitas Pinto** — senior software engineer
in Mossoró (RN), Brazil.

A bilingual, dark-themed static site: Portuguese at `/` and English at `/en/`, each a
real, indexable page (no client-side translation). Plain HTML, CSS and vanilla
JavaScript, published as-is by GitHub Pages; a tiny Node script generates both pages
from one source so they never drift apart.

## Editing workflow

Do **not** edit `index.html`, `en/index.html`, `video/index.html`,
`en/video/index.html`, `404.html`, `sitemap.xml` or `site.webmanifest` by hand — they are generated. Edit the sources and rebuild:

```bash
# 1. edit text / data (PT and EN side by side)  -> src/content.mjs
# 2. edit styles                                 -> styles.css
# 3. regenerate the static pages
node tools/build.mjs
```

`tools/build.mjs` needs only Node.js 18+ (no dependencies). It inlines `styles.css`
into every page, builds the JSON-LD (Person, ProfilePage, WebSite, ItemList;
WebPage, BreadcrumbList and VideoObject with one `Clip` per chapter on the video pages), turns the video captions (`assets/video/*.vtt`) into the on-page
transcript, writes the sitemap (with hreflang alternates), the web manifest and the
IndexNow key file, and prints anything still pending (placeholders, missing files).
Commit the generated files together with the sources.

### Video

The introduction videos live in `assets/video/`:

| file | purpose |
|---|---|
| `joao-phellipe-pt.mp4`, `joao-phellipe-en.mp4` | 16:9 web versions (H.264 + AAC, `+faststart`, ~12 MB max) |
| `poster-pt.jpg`, `poster-en.jpg` | 1280×720 posters (also the VideoObject thumbnails) |
| `joao-phellipe-pt.vtt`, `joao-phellipe-en.vtt` | WebVTT captions; the page transcript is generated from them |

After rendering a new video: drop the files above in place, fill `VIDEO.duration`
(ISO 8601, e.g. `PT1M39S`) and `VIDEO.uploadDate` (e.g. `2026-10-20T09:00:00-03:00`)
in `src/content.mjs`, and run `node tools/build.mjs`. Until a page's MP4 exists and
both values are filled, the build leaves that page's `VideoObject` and the MP4
download link out, so nothing invalid or broken is published. If you replace a
published video, give the file a new name (GitHub Pages caches for 10 minutes and
search engines keep the old URL).

The video lives on its own watch pages, `/video/` (pt-BR) and `/en/video/` (en): H1,
player, chapters (`?t=SECONDS` links, `VIDEO_PAGE.chapters` in `src/content.mjs`),
transcript, `VideoObject` and an entry with the Google video extension in the
sitemap. The home pages keep the embedded player and link to them. Adjust the
chapter times to the final render; the last `Clip` ends at `VIDEO.duration`.

## Local development

```bash
npx serve .            # or: python -m http.server 8000
```

Then open the printed URL (`/` and `/en/`). To check performance the way the site is
measured, run Lighthouse against the local server:

```bash
npx -y lighthouse@13.4.1 http://localhost:3000/ --output=html
npx -y lighthouse@13.4.1 http://localhost:3000/en/ --preset=desktop --output=html
```

## Structure

```
index.html          Portuguese page (generated)
en/index.html       English page (generated)
video/index.html    Portuguese video page (generated)
en/video/index.html English video page (generated)
404.html            Not-found page, noindex (generated)
src/content.mjs     ALL site content, PT + EN, structured data, video placeholders
tools/build.mjs     Generator (no dependencies)
styles.css          Single source of the CSS (inlined into the pages at build time)
script.js           Nav, scroll reveal, hero typing, video player (no i18n, no trackers)
assets/             Portrait (AVIF/WebP/JPEG), fonts, icons, social images, video
sitemap.xml         Home and video pages with hreflang alternates (generated)
robots.txt          Allow all + sitemap
site.webmanifest    PWA manifest (generated)
<key>.txt           IndexNow key (generated)
CNAME, .nojekyll    GitHub Pages settings
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

After each deploy, notify IndexNow (Bing, Yandex and others; Google does not use it):

```bash
curl -X POST https://api.indexnow.org/indexnow \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{"host":"phellipe.eti.br","key":"259bd19e10d2ef81c4bec002e163d031","keyLocation":"https://phellipe.eti.br/259bd19e10d2ef81c4bec002e163d031.txt","urlList":["https://phellipe.eti.br/","https://phellipe.eti.br/en/"]}'
```
