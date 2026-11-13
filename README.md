# pedrogarrido.dev

Personal portfolio website built with Astro.

## Tech Stack

- [Astro](https://astro.build/) - Static site generator
- Plain CSS with design tokens (`src/styles/global.css`) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Commands

| Command        | Action                                      |
| :------------- | :------------------------------------------ |
| `pnpm install` | Install dependencies                        |
| `pnpm dev`     | Start local dev server at `localhost:4321`  |
| `pnpm build`   | Build production site to `./dist/`          |
| `pnpm cv`      | Build and regenerate both downloadable CVs  |
| `pnpm preview` | Preview build locally before deploying      |

## Career profile and CVs

All career content for the English and Spanish site and CVs lives in
`src/data/profile.json`. Keep language-independent facts such as dates, URLs,
and technology lists in their shared fields, and edit localized `en`/`es`
values side by side.

After changing the profile or CV template, run `pnpm cv`. It builds the site,
prints `/en/cv/` and `/es/cv/` to the PDFs in `public/assets/cv/`, and updates
their source hash. The `prebuild` guard rejects `pnpm build` when committed PDFs
are stale.

## Deployment

This project is deployed to GitHub Pages using GitHub Actions. On every push to `main`, the site is automatically built and deployed.

### DNS Configuration for Custom Domain

To configure `pedrogarrido.dev` to point to GitHub Pages, add the following DNS records in your domain provider:

#### Option A: Apex domain only (pedrogarrido.dev)

Add these **A records** pointing to GitHub's IPs:

| Type | Name | Value           |
|------|------|-----------------|
| A    | @    | 185.199.108.153 |
| A    | @    | 185.199.109.153 |
| A    | @    | 185.199.110.153 |
| A    | @    | 185.199.111.153 |

#### Option B: With www subdomain (recommended)

Add the A records above, plus a **CNAME record** for www:

| Type  | Name | Value                    |
|-------|------|--------------------------|
| A     | @    | 185.199.108.153          |
| A     | @    | 185.199.109.153          |
| A     | @    | 185.199.110.153          |
| A     | @    | 185.199.111.153          |
| CNAME | www  | belcaik.github.io.       |

> Note: The trailing dot in `belcaik.github.io.` is required by some DNS providers.

#### IPv6 Support (optional)

Add these **AAAA records** for IPv6:

| Type | Name | Value                  |
|------|------|------------------------|
| AAAA | @    | 2606:50c0:8000::153    |
| AAAA | @    | 2606:50c0:8001::153    |
| AAAA | @    | 2606:50c0:8002::153    |
| AAAA | @    | 2606:50c0:8003::153    |

### GitHub Repository Settings

After configuring DNS:

1. Go to repository **Settings** > **Pages**
2. Under **Source**, select **GitHub Actions**
3. Under **Custom domain**, enter `pedrogarrido.dev`
4. Check **Enforce HTTPS** (wait for DNS propagation and certificate generation)

### Verify DNS Configuration

```bash
# Check A records
dig pedrogarrido.dev +short

# Check CNAME for www
dig www.pedrogarrido.dev +short

# Check HTTPS certificate (after propagation)
curl -I https://pedrogarrido.dev
```

DNS propagation can take up to 24-48 hours, but usually completes within minutes.
