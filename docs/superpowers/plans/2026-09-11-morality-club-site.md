# Morality Club Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Morality Club static website — a mid-20th-century civic-club pastiche that houses a real annotated ethics bibliography, member roster, events, and publication bulletin for a small group of independent philosophers.

**Architecture:** Eleventy (11ty) static site. Markdown content files (members, events, reading-list entries, bulletin dispatches) live in per-collection directories under `src/`, each with a directory data file that excludes them from direct page output (`permalink: false`) while making them available as Eleventy collections. Dedicated `.njk` listing pages render each collection through a shared base layout. No client-side JS, no backend, no database.

**Tech Stack:** Node.js, `@11ty/eleventy` v2, Nunjucks templates, Markdown content, plain CSS (no framework, no external font loading).

**Spec:** `docs/superpowers/specs/2026-09-11-morality-club-site-design.md`

## Global Constraints

- Site is a **web artifact first**: no functional forms, no RSVP/join backend — `Join Us` is a plain contact/address block.
- No structural separation between "public" and "member" content — one seamless site, all pages in top-level nav.
- Two content registers only, never mixed within a page: **front-of-house** (Home, Charter, Members, Events, Join — sincere period civic-club prose) and the **Reading List annotations**, which keep the same warm voice on the surface while their actual content is honest philosophy undercutting the premise that "shared morality" is settled or coherent. The Bulletin uses front-of-house voice to report real member output as club news.
- Visual direction: warm cream/aged-paper background, deep maroon or forest green as primary ink, mustard/gold accent; serif body type (typewriter/letterpress feel), condensed slab/display serif headers, small caps for section labels; a reused seal/crest emblem; subtle paper texture and hairline rules; content bounded to a single printed-bulletin-width column. No modern sans-serif, no saturated "retro" pastel palette.
- No scholarships section (explicitly deferred).
- Members and Bulletin content are scaffolds with clearly fictional placeholder entries — real names/bios/publications are supplied by the user later, not invented as if real.
- Reading List content must be genuine, accurately cited philosophy (real authors/works), with real annotations — this is not scaffolded placeholder content, it is real seed content.

---

## File Structure

```
package.json
.eleventy.js
.gitignore
README.md
src/
  _includes/
    layouts/
      base.njk
  css/
    style.css
  assets/
    seal.svg
  index.njk
  charter.njk
  members.njk
  members/
    members.json
    thaddeus-whitfield.md
    miriam-ostrander.md
    cornelius-vance.md
    agnes-delacroix-byrne.md
  events.njk
  events/
    events.json
    second-saturday-supper.md
    founders-day-cookout.md
    an-evening-on-duty-and-discord.md
    the-quiet-reading-circle.md
  reading-list.njk
  reading-list/
    reading-list.json
    mackie-ethics.md
    williams-moral-luck.md
    foot-double-effect.md
    wong-natural-moralities.md
    macintyre-after-virtue.md
    parfit-reasons-and-persons.md
    ross-right-and-good.md
    blackburn-ruling-passions.md
    rawls-political-liberalism.md
    hume-treatise.md
    nietzsche-genealogy.md
    sidgwick-methods.md
  bulletin.njk
  bulletin/
    bulletin.json
    spring-dispatch.md
    midsummer-dispatch.md
  join.njk
```

---

### Task 1: Project scaffold and Eleventy smoke test

**Files:**
- Create: `package.json`
- Create: `.eleventy.js`
- Create: `.gitignore`
- Create: `src/index.njk`

**Interfaces:**
- Produces: npm scripts `build` (`eleventy`) and `serve` (`eleventy --serve`); Eleventy config with `dir.input = "src"`, `dir.output = "_site"`, `dir.includes = "_includes"`. Later tasks add passthrough copies, filters, and collections to this same `.eleventy.js`.

- [ ] **Step 1: Write the failing build check**

Run: `test -f _site/index.html && echo FOUND || echo MISSING`
Expected: `MISSING` (no `_site` directory exists yet)

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "morality-club",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build": "eleventy",
    "serve": "eleventy --serve"
  },
  "devDependencies": {
    "@11ty/eleventy": "^2.0.1"
  }
}
```

- [ ] **Step 3: Install dependencies**

Run: `npm install`
Expected: installs `@11ty/eleventy` into `node_modules`, creates `package-lock.json`

- [ ] **Step 4: Create `.eleventy.js`**

```js
module.exports = function (eleventyConfig) {
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
```

- [ ] **Step 5: Create `.gitignore`**

```
node_modules/
_site/
```

- [ ] **Step 6: Create the minimal `src/index.njk`**

```njk
---
title: Home
---
<h1>The Morality Club</h1>
```

- [ ] **Step 7: Run the build check again to verify it passes**

Run: `npm run build && grep -q "The Morality Club" _site/index.html && echo PASS || echo FAIL`
Expected: `PASS`

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json .eleventy.js .gitignore src/index.njk
git commit -m "Scaffold Eleventy project with smoke-test home page"
```

---

### Task 2: Base layout, navigation, and vintage CSS foundation

**Files:**
- Create: `src/_includes/layouts/base.njk`
- Create: `src/css/style.css`
- Modify: `.eleventy.js` (add passthrough copy for `src/css`)
- Modify: `src/index.njk` (use the new layout)

**Interfaces:**
- Consumes: nothing from prior tasks beyond the Task 1 scaffold.
- Produces: layout `layouts/base.njk`, which every page in later tasks sets via frontmatter `layout: layouts/base.njk` and `title: <Page Title>`. Nav links target `/`, `/charter/`, `/members/`, `/events/`, `/reading-list/`, `/bulletin/`, `/join/` (routes created in later tasks). CSS classes produced for reuse: `.site-header`, `.seal`, `.content-column`, `.club-nav`.

- [ ] **Step 1: Write the failing check for the layout markup**

Run: `npm run build && grep -q "class=\"club-nav\"" _site/index.html && echo FOUND || echo MISSING`
Expected: `MISSING`

- [ ] **Step 2: Create `src/_includes/layouts/base.njk`**

```njk
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ title }} — The Morality Club</title>
  <link rel="stylesheet" href="/css/style.css">
  <link rel="icon" href="/assets/seal.svg">
</head>
<body>
  <header class="site-header">
    <img src="/assets/seal.svg" alt="Seal of the Morality Club" class="seal">
    <p class="masthead">The Morality Club</p>
    <p class="tagline">Chartered for the Cultivation of Good Character</p>
    <nav class="club-nav">
      <a href="/">Home</a>
      <a href="/charter/">Our Charter</a>
      <a href="/members/">Members</a>
      <a href="/events/">Events</a>
      <a href="/reading-list/">Reading List</a>
      <a href="/bulletin/">The Bulletin</a>
      <a href="/join/">Join Us</a>
    </nav>
  </header>
  <main class="content-column">
    {{ content | safe }}
  </main>
  <footer class="site-footer">
    <p>The Morality Club &mdash; Meeting Regularly Since Its Founding</p>
  </footer>
</body>
</html>
```

- [ ] **Step 3: Create `src/css/style.css`**

```css
:root {
  --paper: #f3ecd9;
  --ink: #3a2f22;
  --maroon: #6b1f22;
  --forest: #2f4030;
  --gold: #a9822f;
  --rule: #c9bb96;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background-color: var(--paper);
  background-image:
    repeating-linear-gradient(0deg, rgba(0,0,0,0.015) 0px, rgba(0,0,0,0.015) 1px, transparent 1px, transparent 3px);
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  line-height: 1.6;
}

.site-header {
  text-align: center;
  padding: 2.5rem 1rem 1.5rem;
  border-bottom: 3px double var(--maroon);
}

.seal {
  width: 84px;
  height: 84px;
}

.masthead {
  font-family: "Rockwell", "Courier New", serif;
  font-size: 2rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--maroon);
  margin: 0.5rem 0 0.1rem;
}

.tagline {
  font-variant: small-caps;
  letter-spacing: 0.05em;
  color: var(--forest);
  margin: 0 0 1.25rem;
}

.club-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem 1rem;
}

.club-nav a {
  color: var(--forest);
  text-decoration: none;
  font-variant: small-caps;
  letter-spacing: 0.03em;
  border-bottom: 1px solid transparent;
}

.club-nav a:hover,
.club-nav a:focus {
  border-bottom-color: var(--gold);
}

.content-column {
  max-width: 42rem;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 4rem;
}

.content-column h1 {
  font-family: "Rockwell", "Courier New", serif;
  color: var(--maroon);
  border-bottom: 1px solid var(--rule);
  padding-bottom: 0.4rem;
}

.content-column h2 {
  font-family: "Rockwell", "Courier New", serif;
  color: var(--forest);
  margin-top: 2.5rem;
}

.entry {
  padding: 1rem 0;
  border-top: 1px solid var(--rule);
}

.entry:first-of-type {
  border-top: none;
}

.entry-meta {
  font-variant: small-caps;
  color: var(--maroon);
  margin: 0 0 0.35rem;
}

.site-footer {
  text-align: center;
  font-size: 0.85rem;
  color: var(--forest);
  border-top: 1px solid var(--rule);
  padding: 1.5rem 1rem;
}
```

- [ ] **Step 4: Add passthrough copy for CSS in `.eleventy.js`**

```js
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
```

- [ ] **Step 5: Update `src/index.njk` to use the layout**

```njk
---
title: Home
layout: layouts/base.njk
---
<h1>The Morality Club</h1>
```

- [ ] **Step 6: Run the check again to verify it passes**

Run: `npm run build && grep -q "class=\"club-nav\"" _site/index.html && echo PASS || echo FAIL`
Expected: `PASS`

- [ ] **Step 7: Commit**

```bash
git add .eleventy.js src/_includes/layouts/base.njk src/css/style.css src/index.njk
git commit -m "Add base layout, navigation, and vintage CSS foundation"
```

---

### Task 3: Seal emblem asset

**Files:**
- Create: `src/assets/seal.svg`
- Modify: `.eleventy.js` (add passthrough copy for `src/assets`)

**Interfaces:**
- Consumes: layout already references `/assets/seal.svg` for both the header image and the favicon link (Task 2).
- Produces: `src/assets/seal.svg`, a reusable emblem referenced by every page through the base layout.

- [ ] **Step 1: Write the failing check**

Run: `test -f _site/assets/seal.svg && echo FOUND || echo MISSING`
Expected: `MISSING`

- [ ] **Step 2: Create `src/assets/seal.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="Seal of the Morality Club">
  <circle cx="50" cy="50" r="47" fill="#f3ecd9" stroke="#6b1f22" stroke-width="3"/>
  <circle cx="50" cy="50" r="39" fill="none" stroke="#a9822f" stroke-width="1.5"/>
  <path d="M50 26 L52 46 L72 48 L52 50 L50 70 L48 50 L28 48 L48 46 Z" fill="#2f4030"/>
  <text x="50" y="18" text-anchor="middle" font-family="Georgia, serif" font-size="7" fill="#6b1f22" letter-spacing="1">MORALITY</text>
  <text x="50" y="88" text-anchor="middle" font-family="Georgia, serif" font-size="7" fill="#6b1f22" letter-spacing="1">CLUB</text>
</svg>
```

- [ ] **Step 3: Add passthrough copy for assets in `.eleventy.js`**

```js
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/assets");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
```

- [ ] **Step 4: Run the check again to verify it passes**

Run: `npm run build && test -f _site/assets/seal.svg && echo PASS || echo FAIL`
Expected: `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/assets/seal.svg .eleventy.js
git commit -m "Add club seal emblem asset"
```

---

### Task 4: Home page

**Files:**
- Modify: `src/index.njk`

**Interfaces:**
- Consumes: `layouts/base.njk` (Task 2).
- Produces: none consumed by later tasks (Home links to routes created by later tasks, which is fine — those routes exist by the time the full site is checked in Task 11).

- [ ] **Step 1: Write the failing check**

Run: `npm run build && grep -q "gather neighbors of good will" _site/index.html && echo FOUND || echo MISSING`
Expected: `MISSING`

- [ ] **Step 2: Write the Home page content**

```njk
---
title: Home
layout: layouts/base.njk
---
<h1>Welcome</h1>
<p>The Morality Club exists to gather neighbors of good will who believe that
character is built, not born &mdash; over a shared table, in frank
conversation, and in the quiet discipline of reading well. We meet for
supper, we meet for talk, and we meet, twice a year, over open flame and
good company at the grill.</p>

<p>Membership is open to any person of steady habits and an honest mind who
is willing to be corrected by their neighbors and, in turn, to correct them
gently in return.</p>

<h2>Find Your Way Around</h2>
<ul>
  <li><a href="/charter/">Our Charter</a> &mdash; who we are and why we gather</li>
  <li><a href="/members/">Members</a> &mdash; the present roster of officers</li>
  <li><a href="/events/">Events</a> &mdash; suppers, cookouts, and evening talks</li>
  <li><a href="/reading-list/">Reading List</a> &mdash; recommended for moral formation</li>
  <li><a href="/bulletin/">The Bulletin</a> &mdash; news of the membership</li>
  <li><a href="/join/">Join Us</a> &mdash; how to get in touch</li>
</ul>
```

- [ ] **Step 3: Run the check again to verify it passes**

Run: `npm run build && grep -q "gather neighbors of good will" _site/index.html && echo PASS || echo FAIL`
Expected: `PASS`

- [ ] **Step 4: Commit**

```bash
git add src/index.njk
git commit -m "Write Home page content"
```

---

### Task 5: Our Charter page

**Files:**
- Create: `src/charter.njk`

**Interfaces:**
- Consumes: `layouts/base.njk` (Task 2).

- [ ] **Step 1: Write the failing check**

Run: `npm run build && grep -q "Whereas" _site/charter/index.html && echo FOUND || echo MISSING`
Expected: `MISSING` (file does not exist yet)

- [ ] **Step 2: Write `src/charter.njk`**

```njk
---
title: Our Charter
layout: layouts/base.njk
---
<h1>Our Charter</h1>
<p><em>Adopted at the founding meeting, and read aloud at the opening of
every Founders Day Cookout since.</em></p>

<p>Whereas good character is not inherited but practiced; and whereas a
person of good will benefits from the correction, encouragement, and
company of their neighbors; and whereas the table and the porch have,
since time out of mind, been where such correction is best delivered
&mdash; we the undersigned do hereby charter the Morality Club, for the
following purposes:</p>

<ul>
  <li>To gather regularly, in fellowship, for the discussion of right
  conduct and the sharing of a meal;</li>
  <li>To recommend to one another books and essays suited to the
  cultivation of good character;</li>
  <li>To hold suppers, cookouts, and brief evening talks open to members
  and their neighbors alike;</li>
  <li>To support one another's work and correspondence, as colleagues in
  a common project, however independently pursued;</li>
  <li>And to conduct all of the above with good humor, plain food, and an
  honest mind.</li>
</ul>

<p>So chartered, and so continued.</p>
```

- [ ] **Step 3: Run the check again to verify it passes**

Run: `npm run build && grep -q "Whereas" _site/charter/index.html && echo PASS || echo FAIL`
Expected: `PASS`

- [ ] **Step 4: Commit**

```bash
git add src/charter.njk
git commit -m "Add Our Charter page"
```

---

### Task 6: Members collection and Roster page

**Files:**
- Create: `src/members/members.json`
- Create: `src/members/thaddeus-whitfield.md`
- Create: `src/members/miriam-ostrander.md`
- Create: `src/members/cornelius-vance.md`
- Create: `src/members/agnes-delacroix-byrne.md`
- Create: `src/members.njk`
- Modify: `.eleventy.js` (add `members` collection)

**Interfaces:**
- Consumes: `layouts/base.njk` (Task 2).
- Produces: collection `collections.members`, where each item's `data` has `name` (string), `role` (string), `order` (number), sorted ascending by `order`; `item.templateContent` holds the rendered bio HTML. Later tasks (Events, Reading List, Bulletin) follow this same collection shape.

- [ ] **Step 1: Write the failing check**

Run: `npm run build && grep -q "Founding President" _site/members/index.html && echo FOUND || echo MISSING`
Expected: `MISSING`

- [ ] **Step 2: Create the directory data file `src/members/members.json`**

```json
{
  "permalink": false
}
```

- [ ] **Step 3: Create the four member content files**

`src/members/thaddeus-whitfield.md`:
```markdown
---
name: Thaddeus P. Whitfield
role: Founding President
order: 1
---
Presided over the club's charter meeting and has kept its spirit ever
since. Known around town for a steady hand at the grill and a longstanding
correspondence with several university philosophy departments, the subject
of which remains, by all accounts, a private matter between the President
and the postman.
```

`src/members/miriam-ostrander.md`:
```markdown
---
name: Miriam Ostrander
role: Corresponding Secretary
order: 2
---
Handles the club's letters and, by extension, most of its reading
recommendations. A patient correspondent and a careful reader, she is
rarely without a book she insists is "not what it looks like at first."
```

`src/members/cornelius-vance.md`:
```markdown
---
name: Cornelius Vance
role: Sergeant-at-Arms
order: 3
---
Keeps order at meetings and the coals lit at cookouts, in roughly equal
measure. Given to long silences followed by short, unanswerable questions.
```

`src/members/agnes-delacroix-byrne.md`:
```markdown
---
name: Agnes Delacroix-Byrne
role: Recording Secretary
order: 4
---
Keeps the minutes and, unofficially, the club's memory. Holds strong views
on how a disagreement ought to be written down, which is to say: fully,
and without smoothing it over.
```

- [ ] **Step 4: Add the `members` collection in `.eleventy.js`**

```js
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addCollection("members", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/members/*.md")
      .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
```

- [ ] **Step 5: Create `src/members.njk`**

```njk
---
title: Members
layout: layouts/base.njk
---
<h1>Members</h1>
<p>The present officers and membership of the Morality Club.</p>

{% for member in collections.members %}
<div class="entry">
  <p class="entry-meta">{{ member.data.role }}</p>
  <h2>{{ member.data.name }}</h2>
  {{ member.templateContent | safe }}
</div>
{% endfor %}
```

- [ ] **Step 6: Run the check again to verify it passes**

Run: `npm run build && grep -q "Founding President" _site/members/index.html && echo PASS || echo FAIL`
Expected: `PASS`

- [ ] **Step 7: Commit**

```bash
git add src/members/ src/members.njk .eleventy.js
git commit -m "Add members collection and Roster page"
```

---

### Task 7: Events collection and Events page

**Files:**
- Create: `src/events/events.json`
- Create: `src/events/second-saturday-supper.md`
- Create: `src/events/founders-day-cookout.md`
- Create: `src/events/an-evening-on-duty-and-discord.md`
- Create: `src/events/the-quiet-reading-circle.md`
- Create: `src/events.njk`
- Modify: `.eleventy.js` (add `events` collection)

**Interfaces:**
- Consumes: `layouts/base.njk` (Task 2). Same collection shape pattern as Task 6.
- Produces: collection `collections.events`, `data` has `title`, `date` (string, `YYYY-MM-DD`), `kind` (one of `bbq`, `talk`, `book-club`), sorted ascending by `date`.

- [ ] **Step 1: Write the failing check**

Run: `npm run build && grep -q "Second Saturday Supper" _site/events/index.html && echo FOUND || echo MISSING`
Expected: `MISSING`

- [ ] **Step 2: Create the directory data file `src/events/events.json`**

```json
{
  "permalink": false
}
```

- [ ] **Step 3: Create the four event content files**

`src/events/second-saturday-supper.md`:
```markdown
---
title: Second Saturday Supper
date: 2026-10-10
kind: bbq
---
A standing monthly potluck, open to members and neighbors. Bring a dish,
bring a question you've been turning over, and expect to be asked to
defend both.
```

`src/events/founders-day-cookout.md`:
```markdown
---
title: Founders Day Cookout
date: 2026-06-14
kind: bbq
---
Our largest gathering of the year, held on the anniversary of the club's
charter. The Charter is read aloud, the grill runs all afternoon, and new
members are welcomed into the roster.
```

`src/events/an-evening-on-duty-and-discord.md`:
```markdown
---
title: "An Evening on: Duty and Discord"
date: 2026-11-05
kind: talk
---
A brief talk and open discussion, held after supper, on what a person owes
their neighbor when the two of them cannot agree on what is owed. Light
refreshments follow.
```

`src/events/the-quiet-reading-circle.md`:
```markdown
---
title: The Quiet Reading Circle
date: 2026-09-27
kind: book-club
---
A small, informal gathering to discuss whatever's currently making the
rounds on the Reading List. No agenda beyond the book and the coffee pot.
```

- [ ] **Step 4: Add the `events` collection in `.eleventy.js`**

```js
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addCollection("members", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/members/*.md")
      .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
  );

  eleventyConfig.addCollection("events", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/events/*.md")
      .sort((a, b) => new Date(a.data.date) - new Date(b.data.date))
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
```

- [ ] **Step 5: Create `src/events.njk`**

```njk
---
title: Events
layout: layouts/base.njk
---
<h1>Events</h1>
<p>Suppers, cookouts, talks, and reading circles, open to members and
neighbors alike.</p>

{% for event in collections.events %}
<div class="entry">
  <p class="entry-meta">{{ event.data.date }}</p>
  <h2>{{ event.data.title }}</h2>
  {{ event.templateContent | safe }}
</div>
{% endfor %}
```

- [ ] **Step 6: Run the check again to verify it passes**

Run: `npm run build && grep -q "Second Saturday Supper" _site/events/index.html && echo PASS || echo FAIL`
Expected: `PASS`

- [ ] **Step 7: Commit**

```bash
git add src/events/ src/events.njk .eleventy.js
git commit -m "Add events collection and Events page"
```

---

### Task 8: Reading List collection and Reading List page

**Files:**
- Create: `src/reading-list/reading-list.json`
- Create: 12 files under `src/reading-list/` (listed below)
- Create: `src/reading-list.njk`
- Modify: `.eleventy.js` (add `readingList` collection and `byCategory` filter)

**Interfaces:**
- Consumes: `layouts/base.njk` (Task 2).
- Produces: collection `collections.readingList`, `data` has `title`, `author`, `category` (one of `For the Young Reader`, `Further Study`, `Classic Works`), `order` (number, unique within category), sorted ascending by `order`. Filter `byCategory(items, category)` returns items where `item.data.category === category`.

- [ ] **Step 1: Write the failing check**

Run: `npm run build && grep -q "Inventing Right and Wrong" _site/reading-list/index.html && echo FOUND || echo MISSING`
Expected: `MISSING`

- [ ] **Step 2: Create the directory data file `src/reading-list/reading-list.json`**

```json
{
  "permalink": false
}
```

- [ ] **Step 3: Create the four "For the Young Reader" entries**

`src/reading-list/mackie-ethics.md`:
```markdown
---
title: "Ethics: Inventing Right and Wrong"
author: J.L. Mackie (1977)
category: For the Young Reader
order: 1
---
Many of our members return to this one first. Mackie writes with the
plainspoken confidence of a good neighbor explaining how things really
are &mdash; and what he concludes is that when we call a thing right or
wrong, we are not describing the world so much as expressing a very old,
very human habit of feeling. His "argument from queerness" asks what kind
of fact a moral fact would have to be, and invites us to notice how little
sense that fact makes once examined closely. A bracing start for anyone
who assumed good character rests on solid ground.
```

`src/reading-list/williams-moral-luck.md`:
```markdown
---
title: "Moral Luck"
author: Bernard Williams (1981)
category: For the Young Reader
order: 2
---
A short essay with a long afterlife. Williams asks why we hold a reckless
driver who happens to hit a child more responsible than an equally
reckless driver who happens not to &mdash; when the only difference
between them was luck. We recommend it to new members not for the answer
it gives, since it hardly gives one, but for how cleanly it shows that our
sense of who deserves blame is not entirely up to us, or to them.
```

`src/reading-list/foot-double-effect.md`:
```markdown
---
title: "The Problem of Abortion and the Doctrine of Double Effect"
author: Philippa Foot (1967)
category: For the Young Reader
order: 3
---
The essay that gave the world the trolley and its five unlucky passengers.
Foot did not intend a parlor game; she intended to show that our
firmest intuitions about killing and letting die pull in different
directions depending on how a case is framed, and that no single rule
we've yet proposed satisfies all of them at once. Bring it to a supper
discussion at your own risk &mdash; it rarely ends where it starts.
```

`src/reading-list/wong-natural-moralities.md`:
```markdown
---
title: "Natural Moralities: A Defense of Pluralistic Relativism"
author: David Wong (2006)
category: For the Young Reader
order: 4
---
Wong takes seriously something most of us notice and few of us like to
say aloud: that different communities, each reasoning carefully and in
good faith, arrive at genuinely different moral outlooks, none of them
obviously mistaken. He does not conclude that anything goes &mdash; only
that "the" moral truth may have more than one true shape. Recommended for
members who find themselves certain, and would benefit from a little
productive doubt.
```

- [ ] **Step 4: Create the five "Further Study" entries**

`src/reading-list/macintyre-after-virtue.md`:
```markdown
---
title: "After Virtue"
author: Alasdair MacIntyre (1981)
category: Further Study
order: 1
---
MacIntyre's contention is that the moral language we inherited has
outlived the shared way of life that once made it make sense &mdash; that
we go on using words like "good" and "duty" as if we agreed on their
meaning, when in fact we are, each of us, working from fragments of older
and incompatible systems. A sobering companion to any club whose charter
speaks, as ours does, of character "built, not born."
```

`src/reading-list/parfit-reasons-and-persons.md`:
```markdown
---
title: "Reasons and Persons"
author: Derek Parfit (1984)
category: Further Study
order: 2
---
Dense, and worth the density. Parfit spent a career hoping that careful
enough reasoning would bring moral theories that look opposed &mdash;
consequentialist, Kantian, contractualist &mdash; into agreement on the
cases that matter. Read alongside his later "On What Matters," the
honest conclusion of the project is that convergence remains an aspiration
rather than an achievement, however far the reasoning is pushed.
```

`src/reading-list/ross-right-and-good.md`:
```markdown
---
title: "The Right and the Good"
author: W.D. Ross (1930)
category: Further Study
order: 3
---
Ross proposed that we owe several duties at once &mdash; fidelity,
reparation, gratitude, justice, and more &mdash; each genuinely binding,
with no formula to rank them when they conflict, only the considered
judgment of the person facing the case. Members sometimes ask for the
formula anyway. Ross's quiet answer is that there isn't one, and that
this is simply what moral life is like.
```

`src/reading-list/blackburn-ruling-passions.md`:
```markdown
---
title: "Ruling Passions: A Theory of Practical Reasoning"
author: Simon Blackburn (1998)
category: Further Study
order: 4
---
Blackburn argues, gently and with real wit, that our moral convictions are
best understood as refined and disciplined feeling rather than perception
of some further fact "out there." He calls the result quasi-realism: we
go on talking and arguing as though morality were a matter of fact,
because that talk is useful and even necessary, while the ground beneath
it is our own sentiment, sharpened by reason.
```

`src/reading-list/rawls-political-liberalism.md`:
```markdown
---
title: "Political Liberalism"
author: John Rawls (1993)
category: Further Study
order: 5
---
Late Rawls, wrestling with a question his earlier work had mostly set
aside: why do reasonable people, reasoning carefully and in good faith,
keep landing in different places on matters of justice and the good?
His answer &mdash; the "burdens of judgment" &mdash; is offered not as a
flaw to be corrected but as a permanent feature of thinking people living
together. We find it good company for a club built on shared supper and
unshared conclusions.
```

- [ ] **Step 5: Create the three "Classic Works" entries**

`src/reading-list/hume-treatise.md`:
```markdown
---
title: "A Treatise of Human Nature, Book III: Of Morals"
author: David Hume (1740)
category: Classic Works
order: 1
---
The origin of a problem that has never been tidily solved: Hume noticed
that writers slide, almost without announcing it, from statements of what
is to claims about what ought to be, as though the second followed from
the first. It doesn't, not by logic alone. Members who arrive certain that
their sense of right and wrong is simply read off the facts of the world
are warmly encouraged to start here.
```

`src/reading-list/nietzsche-genealogy.md`:
```markdown
---
title: "On the Genealogy of Morals"
author: Friedrich Nietzsche (1887)
category: Classic Works
order: 2
---
Nietzsche traces our moral vocabulary &mdash; good, evil, guilt, duty
&mdash; not to timeless truth but to history: to the resentments,
reversals, and power struggles of particular peoples at particular times.
Uncomfortable reading for an organization that opens every meeting with a
Charter written as though its values simply are the good. We read it
anyway, and recommend our members do too.
```

`src/reading-list/sidgwick-methods.md`:
```markdown
---
title: "The Methods of Ethics"
author: Henry Sidgwick (1874)
category: Classic Works
order: 3
---
Perhaps the most honest book on this list. Sidgwick worked for decades to
reconcile the claims of self-interest with the claims of the general good,
using the most careful reasoning available to him, and arrived at what he
called the "dualism of practical reason": two standards, both apparently
rational, that reason itself cannot rank against one another. He did not
paper over the failure. Neither should we.
```

- [ ] **Step 6: Add the `readingList` collection and `byCategory` filter in `.eleventy.js`**

```js
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addFilter("byCategory", (items, category) =>
    items.filter((item) => item.data.category === category)
  );

  eleventyConfig.addCollection("members", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/members/*.md")
      .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
  );

  eleventyConfig.addCollection("events", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/events/*.md")
      .sort((a, b) => new Date(a.data.date) - new Date(b.data.date))
  );

  eleventyConfig.addCollection("readingList", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/reading-list/*.md")
      .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
```

- [ ] **Step 7: Create `src/reading-list.njk`**

```njk
---
title: Reading List
layout: layouts/base.njk
---
<h1>Reading List</h1>
<p>Recommended by the membership for the cultivation of good character.</p>

{% set categories = ["For the Young Reader", "Further Study", "Classic Works"] %}
{% for category in categories %}
<h2>{{ category }}</h2>
{% for entry in collections.readingList | byCategory(category) %}
<div class="entry">
  <p class="entry-meta">{{ entry.data.author }}</p>
  <h3>{{ entry.data.title }}</h3>
  {{ entry.templateContent | safe }}
</div>
{% endfor %}
{% endfor %}
```

- [ ] **Step 8: Run the check again to verify it passes**

Run: `npm run build && grep -q "Inventing Right and Wrong" _site/reading-list/index.html && echo PASS || echo FAIL`
Expected: `PASS`

- [ ] **Step 9: Verify all three categories render**

Run: `npm run build && grep -c "class=\"entry\"" _site/reading-list/index.html`
Expected: `12`

- [ ] **Step 10: Commit**

```bash
git add src/reading-list/ src/reading-list.njk .eleventy.js
git commit -m "Add reading list collection with seed bibliography and page"
```

---

### Task 9: Bulletin collection and Bulletin page

**Files:**
- Create: `src/bulletin/bulletin.json`
- Create: `src/bulletin/spring-dispatch.md`
- Create: `src/bulletin/midsummer-dispatch.md`
- Create: `src/bulletin.njk`
- Modify: `.eleventy.js` (add `bulletin` collection)

**Interfaces:**
- Consumes: `layouts/base.njk` (Task 2).
- Produces: collection `collections.bulletin`, `data` has `title`, `date` (string, `YYYY-MM-DD`), sorted **descending** by `date` (most recent first).

- [ ] **Step 1: Write the failing check**

Run: `npm run build && grep -q "Corresponding Secretary" _site/bulletin/index.html && echo FOUND || echo MISSING`
Expected: `MISSING`

- [ ] **Step 2: Create the directory data file `src/bulletin/bulletin.json`**

```json
{
  "permalink": false
}
```

- [ ] **Step 3: Create the two bulletin content files**

`src/bulletin/midsummer-dispatch.md`:
```markdown
---
title: Midsummer Dispatch
date: 2026-07-20
---
Word from the Corresponding Secretary: we're proud to note that one of our
own has a paper on the difficulty of moral disagreement forthcoming this
autumn. Details, and a proper toast, at the next Second Saturday Supper.
In the meantime, the Reading List has grown by two entries &mdash; see
above.
```

`src/bulletin/spring-dispatch.md`:
```markdown
---
title: Spring Dispatch
date: 2026-04-02
---
Word from the Corresponding Secretary: the Quiet Reading Circle has taken
up Ross this season, and by all reports it has produced more disagreement
than consensus &mdash; which the Secretary considers a sign of a book well
chosen. Members are reminded that the Founders Day Cookout is coming in
June; volunteers for the grill should write in.
```

- [ ] **Step 4: Add the `bulletin` collection in `.eleventy.js`**

```js
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addFilter("byCategory", (items, category) =>
    items.filter((item) => item.data.category === category)
  );

  eleventyConfig.addCollection("members", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/members/*.md")
      .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
  );

  eleventyConfig.addCollection("events", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/events/*.md")
      .sort((a, b) => new Date(a.data.date) - new Date(b.data.date))
  );

  eleventyConfig.addCollection("readingList", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/reading-list/*.md")
      .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
  );

  eleventyConfig.addCollection("bulletin", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/bulletin/*.md")
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date))
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
```

- [ ] **Step 5: Create `src/bulletin.njk`**

```njk
---
title: The Bulletin
layout: layouts/base.njk
---
<h1>The Bulletin</h1>
<p>News of the membership, most recent first.</p>

{% for dispatch in collections.bulletin %}
<div class="entry">
  <p class="entry-meta">{{ dispatch.data.date }}</p>
  <h2>{{ dispatch.data.title }}</h2>
  {{ dispatch.templateContent | safe }}
</div>
{% endfor %}
```

- [ ] **Step 6: Run the check again to verify it passes**

Run: `npm run build && grep -q "Corresponding Secretary" _site/bulletin/index.html && echo PASS || echo FAIL`
Expected: `PASS`

- [ ] **Step 7: Verify descending date order**

Run: `npm run build && grep -o "Midsummer Dispatch\|Spring Dispatch" _site/bulletin/index.html | head -2`
Expected:
```
Midsummer Dispatch
Spring Dispatch
```

- [ ] **Step 8: Commit**

```bash
git add src/bulletin/ src/bulletin.njk .eleventy.js
git commit -m "Add bulletin collection and Bulletin page"
```

---

### Task 10: Join Us page

**Files:**
- Create: `src/join.njk`

**Interfaces:**
- Consumes: `layouts/base.njk` (Task 2).

- [ ] **Step 1: Write the failing check**

Run: `npm run build && grep -q "write to us" _site/join/index.html && echo FOUND || echo MISSING`
Expected: `MISSING`

- [ ] **Step 2: Write `src/join.njk`**

```njk
---
title: Join Us
layout: layouts/base.njk
---
<h1>Join Us</h1>
<p>New members are welcome, provided they're willing to bring a dish to
their first supper and a question to their first talk.</p>

<p>To ask after membership, write to us:</p>

<p>
  The Morality Club<br>
  c/o The Corresponding Secretary<br>
  <a href="mailto:secretary@moralityclub.example">secretary@moralityclub.example</a>
</p>
```

- [ ] **Step 3: Run the check again to verify it passes**

Run: `npm run build && grep -q "write to us" _site/join/index.html && echo PASS || echo FAIL`
Expected: `PASS`

- [ ] **Step 4: Commit**

```bash
git add src/join.njk
git commit -m "Add Join Us page"
```

---

### Task 11: Full-site integration check and README

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: all routes produced by Tasks 1–10.

- [ ] **Step 1: Run a full clean build**

Run: `rm -rf _site && npm run build`
Expected: exits with no errors, `_site/` is regenerated

- [ ] **Step 2: Verify every nav target resolves to a real file**

Run:
```bash
for path in index charter/index members/index events/index reading-list/index bulletin/index join/index; do
  test -f "_site/$path.html" && echo "OK: $path" || echo "MISSING: $path"
done
```
Expected: all seven lines print `OK: ...`

- [ ] **Step 3: Verify the seal and CSS are copied**

Run: `test -f _site/assets/seal.svg && test -f _site/css/style.css && echo PASS || echo FAIL`
Expected: `PASS`

- [ ] **Step 4: Write `README.md`**

```markdown
# The Morality Club

A static site for the Morality Club, built with Eleventy.

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
- `src/reading-list/*.md` — frontmatter: `title`, `author`, `category`
  (must be one of `For the Young Reader`, `Further Study`, or
  `Classic Works`), `order` (ascending within its category).
- `src/bulletin/*.md` — frontmatter: `title`, `date` (`YYYY-MM-DD`).
  Displayed most-recent-first.

The Members and Bulletin content currently shipped are placeholders —
replace them with real names, bios, and publication notes when ready.
```

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "Add README and complete full-site integration check"
```

---

## Self-Review Notes

- **Spec coverage:** all seven pages (Home, Charter, Members, Events,
  Reading List, Bulletin, Join Us) have tasks; visual direction is covered
  in Task 2/3; content voice split (front-of-house vs. Reading List) is
  reflected in the actual page copy written in Tasks 4–10; the
  "web artifact first" constraint is satisfied by Join Us having no form,
  only a mailto link; Scholarships is correctly omitted.
- **Placeholder scan:** no `TBD`/`TODO` strings; Members and Bulletin
  entries are clearly fictional stand-in content (per spec, meant to be
  replaced by the user) but are fully written out, not blank.
- **Type/interface consistency:** all four collections follow the same
  shape (`collections.<name>`, sorted, rendered via `item.templateContent`
  in a matching `.njk` listing page); the `byCategory` filter used in Task
  8 is defined in that same task's `.eleventy.js` change.
