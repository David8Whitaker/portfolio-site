# davidwhitaker.vercel.app — portfolio site

Static single-page portfolio. Flagship: **Thaigether** (consumer app) · second: **TalatSuite** ops suite.

## Structure
- `index.html` — everything (inline CSS/JS, single-file tradition)
- `talat.html` — Thai market-owner pitch page (QRs, demo logins, FAQ)
- `demo.html` — TalatSuite demo · `TalatSuite-v7.0.apk` — its binary
- `assets/thaigether/` — brand + real product screenshots
- `site.webmanifest`, `sitemap.xml`, `robots.txt`, `og-image.jpg`

## Deploy
Vercel project `davidwhitaker` → https://davidwhitaker.vercel.app (static, no build step).
Git auto-deploys from `main`. Manual deploy if ever needed:
```
export VERCEL_TOKEN='<paste, use once, delete>'
npx -y vercel deploy --prod --yes
```
Retired Sep 2026: Netlify (`davidwhitaker.netlify.app`, site `3e825074-86f9-431a-9c0e-bea813785024`)
— free build credits (300/mo) kept expiring and freezing the live site.
