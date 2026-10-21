# SoriArchive

Static website for SoriArchive, a digital archive of Korean labor songs and regional dialects. Built for GitHub Pages.

## Publish on GitHub Pages
1. Upload everything in this folder to the root of a GitHub repository. Keep `index.html` at the top level.
2. In the repository, go to **Settings → Pages**. Set **Source** to *Deploy from a branch*, choose `main` and `/ (root)`, then save.
3. The site goes live in a minute or two. Pages use clean URLs (`/about/`, `/sounds/`, `/news/`, `/partnerships/`, `/contact/`), and unknown addresses show `404.html`.

## Contact form
The form sends through FormSubmit to bubble.youthimpact@gmail.com. The first time someone submits it on the live site, FormSubmit emails that address an activation link. Click it once, and all later messages arrive normally.

## Editing content
- **Sounds:** `assets/data.js`. To refresh it from a new Bubble export, run `python3 tools/build_data.py path/to/export.csv`.
- **News and partners:** `assets/content.js`. Add one entry per article or partner. News is sorted by date automatically.
- **Images:** `assets/img/`.
- **Styles:** `assets/style.css`. **Behavior and header/menu:** `assets/site.js`.
