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

- `src/events/*.md` — frontmatter: `title`, `season` (`Spring`, `Summer`,
  `Fall`, or `Winter`), `order` (controls display order — the club's
  yearly round, ascending: Fall, Winter, Spring, Summer).
- `src/reading-list/*.md` — frontmatter: `title`, `author`, `category`
  (must be one of `For the Young Reader`, `Further Study`, or
  `Classic Works`), `order` (ascending within its category).
- `src/bulletin/*.md` — frontmatter: `title`, `date` (`YYYY-MM-DD`).
  Displayed most-recent-first.

The Bulletin content currently shipped is a placeholder — replace it
with real publication notes when ready.
