# 🗾 Spoken Japanese Crash Course

A fast, navigable React knowledge base for learning **spoken** Japanese as a visitor —
enough to explain basic things, order food, get around and ask for help. **No writing
system**: everything is taught in romaji, with kana/kanji shown alongside only so you can
recognise signs and menus.

Nothing needs to be read in order: use the sidebar (with live filter) or the home grid to
jump anywhere.

## Run it

```bash
npm install
npm run dev     # start the dev server (prints a localhost URL)
```

Then open the printed URL (e.g. http://localhost:5173).

Other scripts:

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build
```

## Deploy (GitHub Pages)

Pushing to `main` builds the site and publishes it to GitHub Pages via
`.github/workflows/deploy.yml`. One-time setup: in the repo, go to
**Settings → Pages → Build and deployment → Source** and select
**GitHub Actions**.

The site is served from the project subpath, so the production build sets
Vite's `base` to `/dev-learning/` (see `vite.config.js`); local dev/preview
stay at the root path. Routing uses `HashRouter`, so deep links and refreshes
work on Pages without extra 404 handling.

## What's inside

7 chapters · 23 topics · 130 flashcards · 70 self-test questions.

1. **Sounds & Survival Kit** — the mora/beat system, the five vowels, vowel length as
   meaning (*biiru* vs *biru*), pitch accent, devoiced vowels; the 20 phrases that cover a
   whole trip; politeness registers and why *-masu* form is the one to learn
2. **How a Sentence Is Built** — subject–object–verb order, dropping the subject, avoiding
   *anata*; the ten core particles (*wa, ga, o, ni, de, no, to, mo, kara, made*), *wa* vs
   *ga*, *ni* vs *de*; asking questions with *ka* and question words; ko-so-a-do
   (*kore/sore/are*) and existence with *arimasu/imasu*
3. **How Words Are Built** — the three vocabulary layers (native, Sino-Japanese, borrowed),
   suffixes and prefixes that build word families, compounds and sequential voicing, *suru*
   as a verb-maker; i-adjectives vs na-adjectives; the three verb groups
4. **Tenses & Verb Forms That Matter** — two tenses only (there is no future), the four
   polite endings, *-te imasu* for ongoing actions and resulting states; the te-form and its
   uses (requests, permission, chaining, prohibition); *-tai* (want), potential (can),
   *-mashou* / *-masen ka* (let's / shall we)
5. **Numbers, Counting & Time** — numbers and the *man* (10,000) grouping, money and payment
   phrases; counters and the universal *tsu* escape hatch; clock time, days, months and the
   irregular days of the month
6. **Tourist Situations, Line by Line** — eating out (the full scripted visit, dietary
   needs, convenience-store questions), shopping and tax-free, trains/taxis/directions,
   hotels, illness and emergencies
7. **Quirks of the Language** — what Japanese leaves out (articles, plurals, agreement,
   subjects, "you"); *aizuchi* listening noises, hedging and *chotto* as a refusal, *ne*/*yo*;
   traps for English speakers (false-friend katakana, *hai* ≠ yes, *daijoubu desu*)

### Features

- **Non-linear navigation** — collapsible sidebar, searchable topic filter, home grid, and
  prev/next paging.
- **🃏 Flashcards** — click to reveal the answer.
- **🧠 Test-yourself** — multiple-choice (instant right/wrong feedback + explanation) and
  open questions (reveal the worked answer).

## Structure

```
src/
  App.jsx                 # routing + layout
  components/             # Sidebar, Home, ContentView, Flashcards, Quiz
  content/
    index.js              # aggregates chapters + builds nav/paging index
    ch1-sounds-and-survival.js … ch7-quirks.js   # all content lives here
```

To edit or add content, open the relevant `content/ch*.js` file — each exports a
chapter object of `{ id, title, subchapters: [{ id, title, body, flashcards, quiz }] }`.
`body` is Markdown; quiz items with `options` are multiple-choice (`answer` is
the 0-based index), otherwise they're open questions (`answer` is a string).
