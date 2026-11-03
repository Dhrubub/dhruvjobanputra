# Deploying the site

The site is hosted on **Cloudflare Workers** (static assets) as a Worker named `portfolio`, served at
`dhruvjobanputra.com` and `www.dhruvjobanputra.com`. The `pinboard` branch of this repo is what's live.

Cloudflare account: `dhruvjobanputra8@gmail.com` · Dashboard: https://dash.cloudflare.com → Workers & Pages → `portfolio`

## Everyday flow (automatic deploys)

Cloudflare watches the `pinboard` branch on GitHub. Every push builds and deploys the site.

```bash
git checkout pinboard
# edit files
git add -A
git commit -m "Describe the change"
git push
```

About a minute later the change is live. Watch progress under **Workers & Pages → portfolio → Deployments**.
If the build fails, the deployment entry shows the log.

Pushes to any other branch (e.g. `main`) do **not** affect the live site.

## Manual deploy (from your laptop)

Use this if the automatic build is broken, or you want to ship without pushing first.

```bash
git checkout pinboard
npm ci                 # install deps (first time, or after package.json changes)
npm run build          # outputs to dist/
npx wrangler deploy    # uploads dist/ to the portfolio Worker
```

One-time setup: `npx wrangler login` and approve in the browser (log in as the account above).

`wrangler deploy` reads `wrangler.jsonc`, which declares the asset directory, SPA routing, and the two custom domains.
Don't hand-edit DNS for the domains; the Worker owns those records.

## Preview locally

```bash
npm run dev                        # dev server with hot reload (http://localhost:5173)
npm run build && npm run preview   # serve the production build
```

## Common edits

| Change | Where |
|---|---|
| Text, links, timeline, skills, projects | `src/data/content.ts` |
| Résumé PDF | Replace the single PDF in `src/assets/resume/`. The `/resume` route opens whichever PDF is in that folder, so keep exactly one. |
| Photos / images | `src/assets/` |
| Page title, meta tags, favicon | `index.html` |
| Sitemap | `public/sitemap.xml` |

## Rolling back

Dashboard: **portfolio → Deployments → ⋯ on an older version → Rollback**.
Or from the terminal: `npx wrangler rollback`.

## Switching the live site to a different branch

When the new design on `main` is ready:

1. Make sure `main` has its own `wrangler.jsonc` with the same `name: "portfolio"` and `routes`.
2. Dashboard: **portfolio → Settings → Build → Branch control**, change the production branch to `main`.

`pinboard` stays deployable from its branch for as long as you keep it.

## Troubleshooting

- **Site shows old content after a deploy** → hard refresh (`Cmd+Shift+R`). Assets are content-hashed, so a stale `index.html` is the only thing that caches.
- **Build fails on Cloudflare but works locally** → check the Node version in the build log; set `NODE_VERSION` under Settings → Build → Variables if needed.
- **`wrangler deploy` says "not authenticated"** → run `npx wrangler login` again.
- **Custom domain error on deploy** → a conflicting DNS record exists for the hostname. Delete it in the Cloudflare DNS tab and redeploy.
