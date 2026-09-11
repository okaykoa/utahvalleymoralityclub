# The Utah Valley Morality Club

A static site for the Utah Valley Morality Club, built with Eleventy.

## Development

```bash
npm install
npm run serve   # local dev server with live reload
npm run build    # production build to _site/
```

## Adding content

Each of these is a directory of Markdown files, one file per entry. Add a
new file to add a new entry — no other code changes are needed.

- `src/members/*.md` — frontmatter: `name`, `role`, `order` (controls
  display order, ascending).
- `src/events/*.md` — frontmatter: `title`, `date` (`YYYY-MM-DD`), `kind`.
  Displayed oldest-first.
- `src/reading-list/*.md` — frontmatter: `title`, `author`, `category`
  (must be one of `For the Young Reader`, `Further Study`, or
  `Classic Works`), `order` (ascending within its category).
- `src/bulletin/*.md` — frontmatter: `title`, `date` (`YYYY-MM-DD`).
  Displayed most-recent-first.

The Members and Bulletin content currently shipped are placeholders —
replace them with real names, bios, and publication notes when ready.
