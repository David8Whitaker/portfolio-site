# davidwhitaker.netlify.app — portfolio site

Static single-page portfolio. Flagship: **Thaigether** (consumer app) · second: **TalatSuite** ops suite.

## Structure
- `index.html` — everything (inline CSS/JS, single-file tradition)
- `demo.html` — TalatSuite demo · `TalatSuite.apk` — its binary
- `assets/thaigether/` — brand + real product screenshots
- `site.webmanifest`, `sitemap.xml`, `robots.txt`, `og-image.jpg`

## Deploy
Netlify site ID `3e825074-86f9-431a-9c0e-bea813785024`:
```
npx netlify-cli deploy --prod --dir=. --site=3e825074-86f9-431a-9c0e-bea813785024 --auth $NETLIFY_TOKEN
```
