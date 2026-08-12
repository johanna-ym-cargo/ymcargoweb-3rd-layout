# YM Cargo Transport Corp. - Responsive Layout Templates

Five self-contained HTML/CSS page templates built from the real content and
brand assets of [ymcargo.ph](https://ymcargo.ph), redesigned as a reusable,
mobile-first layout system. No build step, no framework. Plain HTML5 +
vanilla CSS/JS, so any page of the site can be assembled from these
templates.

## Pages / layout templates

| File | Template archetype | Reused for |
|---|---|---|
| `index.html` | **Marketing Home**, hero, animated stats, service showcase, news teaser, logo cloud, awards, sustainability | Landing / campaign pages |
| `about.html` | **Content / Story page**, compact hero, alternating text-image sections, profile grid, value grid, directory grid | About, Sustainability, any narrative page |
| `services.html` | **Catalog / detail page**, tag cloud, sticky anchor sub-nav, alternating detail sections with feature sub-cards, CTA banner | Services, Industries, Equipment |
| `news.html` | **Article grid**, hero, responsive card grid with date badges, pagination | Blog, Press, Announcements |
| `careers.html` | **Listing + form**, searchable/filterable accordion listing, culture statement, two-column contact panel | Careers, Branch locator, RFQ |

All five share the same `<header>` (top contact/social bar + sticky nav with
mobile drawer) and `<footer>` (offices grid, affiliated companies, verse,
legal line) markup, so adding a sixth page is a matter of copying the
head/header/footer block from any existing page and dropping a new
`<main>` built from the component classes in `assets/css/style.css`.

## Structure

```
├─ index.html / about.html / services.html / news.html / careers.html
├─ assets/
│  ├─ css/
│  │  ├─ fonts.css     → @font-face scaffold for the Dubai typeface
│  │  └─ style.css     → design tokens + every shared component
│  ├─ js/
│  │  └─ main.js       → nav drawer, back-to-top, scroll reveal, counters,
│  │                      subnav highlighting, job filter, demo form handler
│  ├─ fonts/            → drop licensed Dubai font files here (see below)
│  └─ img/               → real brand imagery pulled from ymcargo.ph,
│                           resized/optimized for the web
└─ README.md
```

## Typography: Dubai font family

Dubai (Government of Dubai / Microsoft) is the primary typeface and is
bundled at weights 300/400/500/700. The licensed source files live at
`assets/fonts/dubai/Dubai-*.ttf`; each was converted to the smaller
`.woff2` format (`assets/fonts/Dubai-*.woff2`) that `assets/css/fonts.css`
loads first, falling back to the original `.ttf` if a browser can't parse
it. Every heading and paragraph on the site (`--font-brand` in
`style.css`) picks it up automatically, no per-page setup needed. If the
font files are ever removed, the stack falls back to `Segoe UI` / `Tahoma`,
which are metrically close, so there's no layout shift.

## Brand colors

Deliberately just two colors, primary navy and white, with no accent hues,
exposed as CSS custom properties in `style.css`:

- `--ym-navy` `#020277`, primary brand navy (nav, headings, buttons, links, all accents)
- `--ym-navy-deep` `#000495`, a darker tint of the same navy, not a second hue (footer, date badges)
- `--ym-white` `#ffffff`

Neutral grays (`--ym-gray-*`) are used only for card backgrounds, borders,
and muted body text. They're structural, not part of the accent palette.

## Responsive behavior

Mobile-first CSS with fluid type (`clamp()`), a light custom grid system,
and breakpoints at `640px`, `760-860px`, `900-991px`, and `1080px+`. The
nav collapses into a full-height slide-in drawer under `992px`; the
services sub-nav becomes a horizontally-scrollable strip on small screens.
Verified against mobile (~375px), tablet (~768px), and desktop (1280px+)
widths.

## Content sourcing

Copy, imagery, office addresses, team names/titles, accreditation logos,
and the company history/founding story are pulled from the live
ymcargo.ph pages (Home, About, Services, News, Careers) as of August 2026.
The Careers job listings are clearly labeled as **sample** data. Wire up
a real ATS/job feed before shipping.

## Opening the site

No server required. Open `index.html` directly in a browser, or serve
the folder with any static file server for clean relative-path behavior.
