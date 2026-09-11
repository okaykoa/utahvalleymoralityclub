# Morality Club Website — Design Spec

Date: 2026-09-11

## Concept

A website for "The Morality Club," styled as a mid-20th-century American
civic/fraternal club (in the vein of Elks lodges, Rotary chapters, or
church-basement morality societies) — BBQs, supper meetings, a roster of
officers, a recommended reading list, a periodic bulletin.

Underneath, it is a real venue for a small group of independent
philosophers/scholars (in the spirit of the Vienna Circle, the Metaphysical
Club, the Frankfurt School, or the historical Cambridge "Moral Sciences"
circles Wittgenstein and Russell moved through) who work independently and
gather periodically to critique and support each other's work.

The site does not structurally separate these two identities — there is no
"public site" vs. "members area." It is one seamless site that presents
itself sincerely as a club organized to celebrate and cultivate shared
morality. The subversion lives entirely in content, concentrated in one
feature: an annotated reading list, framed as wholesome moral-formation
recommendations, whose actual annotations are honest philosophy about the
irreducibility, murkiness, and contestedness of morality — quietly
undercutting the club's own stated premise. Members' real philosophical
publications surface through an in-voice club bulletin ("word from the
Corresponding Secretary").

## Goals

- Portfolio/publication showcase for a small existing group of independent
  scholars, wrapped entirely in period civic-club presentation.
- A genuinely well-curated annotated bibliography on ethics/metaethics as
  the site's centerpiece feature — the mechanism by which the "true nature"
  of the club shows through, without ever breaking the front-of-house tone.
- Ships as a static, low-maintenance site: content added as Markdown files,
  no backend, no database, no accounts.
- Functions as a **web artifact first** — it should read as if the club and
  its events are real, but no functionality (RSVP, join forms, auth) needs
  to actually work yet. Contact is a plain mailto/address block.

## Non-goals (for this iteration)

- No real RSVP/contact form backend.
- No CMS/admin panel — content is edited as files, in git.
- No scholarships section yet (explicitly deferred per user decision).
- No structural "members-only" area — everything one publicly-readable site.

## Site structure

Seven pages/sections, all top-level nav:

1. **Home** — hero with club seal/name, mission statement in civic-club
   language, quick links to the other sections.
2. **Our Charter** (About) — invented founding history + mission statement,
   written in period civic-org voice.
3. **Members** (Roster) — bios of the small existing group, presented as
   club officers (e.g. President, Corresponding Secretary, Sergeant-at-Arms),
   vintage oval-photo-frame treatment. Bios fold members' real philosophical
   work into wholesome civic framing rather than stating it directly.
4. **Events** — BBQs, supper meetings, brief talks, presented as a civic
   club bulletin listing ("Second Saturday Supper," "Founders Day Cookout").
   Descriptions may carry a light undertone but never break the front.
5. **Reading List** (annotated bibliography) — the core subversive feature.
   Framed as suggested reading for moral formation/good character;
   organized into a few categories (e.g. "For the Young Reader," "Further
   Study," "Classic Works"). Each entry's annotation is genuine philosophy
   on moral disagreement, anti-realism, moral luck, incommensurable values,
   the is-ought gap, etc. — the tension between stated purpose and actual
   content is the point, and it is never resolved with a wink.
6. **The Bulletin** (newsletter archive) — periodic dispatches in the same
   civic voice that report members' real publications/talks as club news
   ("We're proud to note Brother [X]'s recent essay was taken up at...").
   This is where the portfolio-showcase goal is actually satisfied.
7. **Join Us** — plain contact info (mailto/address block). No functional
   form.

## Content voice

Two registers, kept strictly separate, no formal tonal break between them:

- **Front-of-house** (Home, Charter, Members, Events, Join): sincere, warm,
  slightly formal mid-century civic-club prose. No irony markers.
- **Reading List annotations**: same warm civic voice on the surface: each
  entry still reads as a well-meaning club recommendation, but its content
  is honest, well-informed philosophy that undercuts the premise that
  "shared morality" is a settled, coherent thing.
- **The Bulletin**: same civic voice, reporting real member output as club
  news.

Seed content:

- Reading List: an initial set of ~10-15 real, well-chosen sources across
  2-3 categories, each with a genuinely written annotation — drafted as
  part of implementation, expandable later as markdown files.
- Members and Bulletin: scaffolded with placeholder entries/templates only.
  Real names, bios, and publication write-ups are supplied by the user
  afterward — not invented.

## Visual design direction

Full period pastiche — "scanned 1950s-60s civic club newsletter/charter,"
not a modern site with vintage garnish:

- **Palette**: warm cream/aged-paper background; deep maroon or forest
  green as primary ink color; mustard/gold as accent (seal/badge color).
  Restrained, letterpress-like — not saturated "retro" pastel.
- **Type**: serif for body text evoking typewriter/letterpress (old-style
  or slab serif); a condensed display serif/slab for headers; small caps
  for section labels. No modern sans-serif except minor utility use.
- **Emblem**: a central seal/crest for "Morality Club," in the style of a
  generic fraternal-order badge (e.g. torch, oak leaf, open book, clasped
  hands), reused as a letterhead mark across pages.
- **Texture**: subtle paper-grain/noise background, hairline rules between
  sections, faux-halftone/aged treatment on any imagery.
- **Layout**: a bounded content column, like a printed bulletin page, not a
  sprawling modern hero-and-grid layout — reinforces the "physical document
  scanned into a website" feel.
- Must remain legible/accessible (sufficient contrast) despite the aged
  palette.

## Technical approach

- **Static site generator: Eleventy (11ty).** Content lives as Markdown
  files organized into collections; shared Nunjucks/Liquid templates render
  them. Ships no client-side JS by default, which reinforces the pastiche
  (feels like it predates the JS-heavy web) and keeps the build simple.
- **Content model** (Markdown + frontmatter, one file per entry):
  - `src/reading-list/*.md` — frontmatter: `title`, `author`, `category`,
    `order`; body: the annotation.
  - `src/members/*.md` — frontmatter: `name`, `role` (club office title),
    `order`; body: bio.
  - `src/events/*.md` — frontmatter: `title`, `date`, `kind` (BBQ/talk/book
    club/etc.); body: description.
  - `src/bulletin/*.md` — frontmatter: `title`, `date`; body: dispatch
    text, linking out to the real publication/talk where relevant.
  - Static top-level pages (`home.njk`, `charter.njk`, `join.njk`) hold
    non-collection content directly.
- **No build-time data fetching, no client JS frameworks, no database.**
- **Hosting**: static output deploys to GitHub Pages or Netlify (either
  works with Eleventy's default `_site` output) — final choice and domain
  are the user's call at deploy time, not blocking for this spec.
- **Testing**: `eleventy` build must succeed with no errors; manual check
  that all nav links resolve and each collection page renders its entries;
  basic contrast check on the aged palette against WCAG AA for body text.

## Open items for the user (not blocking design, but needed before real content lands)

- Real names/bios/roles for the Members roster.
- Real publications/talks to write up in the Bulletin.
- Eventual hosting/domain choice.
