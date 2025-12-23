# Nexxoid static site (multi-page)

Pages:
- index.html
- services.html
- work.html
- pricing.html
- contact.html (includes scope builder + mailto)
- privacy.html
- 404.html

## Edit the essentials
- Contact email: `info@nexoid.dev` (see footer script and contact page mailto)
- Canonical domain: `nexxoid.com` (set in page <head>)
- Prices: `pricing.html` (packages + add-ons)

## Fonts
This build loads Inter + Space Grotesk from Google Fonts for the premium look.  
If you want *zero external calls*, remove the Google Fonts `<link>` tags from each page and keep system fonts.

## Local run
Open `index.html` directly, or serve it:

```bash
python -m http.server 8080
```

Then open http://localhost:8080

## DigitalOcean hosting (simple)
Option A: App Platform (Static Site)
- Create a GitHub repo with this folder
- App Platform → Create App → Static site → choose repo
- Build command: none
- Output directory: `/`

Option B: Droplet + Nginx
- Copy files to `/var/www/nexxoid`
- Nginx root: `/var/www/nexxoid`
- Add a 404 rule for `404.html`

## Notes
- “Testimonials” are labeled placeholders — replace with real ones ASAP.
- “Work” case studies are samples — swap in real projects later.
