/* Portfolio static-integrity check (zero dependencies — runs in CI on every push).
   Offline by design: Vercel deploys AFTER the push, so CI asserts the repo itself —
   every page exists, every relative asset ref resolves to a committed file, the
   APK + demo payloads look sane, every page declares a favicon, and no dead
   github.io (Pages) links linger. Live byte/render proofs run post-deploy from
   ~/qa-portfolio/verify.mjs instead. */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
let pass = 0, fail = 0;
const ok = (c, name, extra = '') => { c ? pass++ : fail++; console.log(`${c ? 'PASS' : 'FAIL'} ${name} ${extra}`); };

const pages = ['index.html', 'talat.html', 'demo.html', '404.html'];
const html = {};
for (const p of pages) {
  const fp = join(ROOT, p);
  const exists = existsSync(fp);
  ok(exists, `page exists: ${p}`);
  html[p] = exists ? readFileSync(fp, 'utf8') : '';
}
// every relative asset ref must resolve to a committed file
const refs = new Set();
for (const t of Object.values(html)) {
  for (const m of t.matchAll(/((?:src|href|content|poster)=["'])([^"']+)/g)) {
    const u = m[2];
    if (u.startsWith('/') && !u.startsWith('//')) refs.add(u.slice(1).split('#')[0]);
    else if (/^(assets|downloads)\//.test(u) || /^[\w-]+\.(html|apk|jpg|png|xml|txt|webmanifest)$/.test(u)) refs.add(u.split('#')[0]);
  }
}
let broken = 0;
for (const r of [...refs].sort()) {
  if (!existsSync(join(ROOT, r))) { broken++; console.log(`  broken ref: ${r}`); }
}
ok(broken === 0, 'all relative refs resolve', `${refs.size} refs`);
// payload sanity (exact byte claims are verified post-deploy by qa-portfolio)
const apk = join(ROOT, 'TalatSuite-v7.1.apk');
ok(existsSync(apk) && statSync(apk).size > 400_000, 'APK present + sane size', existsSync(apk) ? `${statSync(apk).size}B` : 'missing');
ok(statSync(join(ROOT, 'demo.html')).size > 500_000, 'demo.html not truncated', `${statSync(join(ROOT, 'demo.html')).size}B`);
// every page declares a favicon (regression: talat.html once 404'd /favicon.ico)
for (const p of pages) ok(html[p].includes('rel="icon"'), `favicon declared: ${p}`);
// no dead links to the retired GitHub Pages copy / retired hosts
for (const p of pages) ok(!html[p].includes('github.io'), `no github.io refs: ${p}`);
// sitemap same-origin entries must exist
const sm = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8');
let smBad = 0;
for (const m of sm.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const u = new URL(m[1]);
  if (u.hostname === 'davidwhitaker.vercel.app') {
    const f = u.pathname === '/' ? 'index.html' : u.pathname.slice(1);
    if (!existsSync(join(ROOT, f))) { smBad++; console.log(`  sitemap target missing: ${f}`); }
  }
}
ok(smBad === 0, 'sitemap targets exist');
ok(existsSync(join(ROOT, 'robots.txt')), 'robots.txt exists');

console.log(`\nSTATIC: ${pass} pass · ${fail} fail`);
process.exit(fail ? 1 : 0);
