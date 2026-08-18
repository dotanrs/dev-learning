# CLAUDE.md

Guidance for working in this repo (Spoken Japanese Crash Course — a Vite + React knowledge
base teaching conversational Japanese for travellers).

## Project layout

- `src/content/ch*.js` — all learning content. Each file exports a chapter:
  `{ id, title, subchapters: [{ id, title, body, quizTitle?, flashcards, quiz }] }`.
- `src/content/index.js` — imports every chapter into the `raw` array (order = display
  order) and builds the nav/paging `flatIndex`. **A new chapter must be added here** or
  it won't appear.
- `src/components/` — Sidebar, Home, ContentView, Flashcards, Quiz.
- `body` is Markdown rendered with `react-markdown` + `remark-gfm` (GFM tables, etc.).
  There is **no LaTeX/KaTeX** — write any math in Unicode (`≤`, `²`, `Θ`, `√`).
- Quiz items: an item with `options` is multiple-choice (`answer` = 0-based index,
  optional `explanation`); without `options` it's an open question (`answer` = string).
- Code fences inside `body` use `~~~` (not triple backticks), because `body` is itself a
  template literal delimited by backticks.

## Adding / editing content

1. Edit or create `src/content/chN-*.js`.
2. Register it in `src/content/index.js` (import + append to `raw`).
3. Update the stats line and chapter list in `README.md`.
4. Verify with `npm run build` before committing.

## Content conventions (Japanese course)

- **Spoken language only.** The course teaches communication, not writing — no kana or
  kanji drills. Japanese script appears only so learners can *recognise* signs and menus.
- **Every phrase gets romaji**, and usually the script + romaji + English, in that order.
  Tables (`| Japanese | Romaji | Meaning |`) are the standard format for phrase lists.
- **Long vowels are written out** in romaji (*biiru*, *arigatou*, *gozaimasu*) rather than
  with macrons — the course teaches vowel length as a meaning-bearing feature.
- `title` fields are **plain text** (Sidebar and pager render them without Markdown), so
  don't put `*emphasis*` in a chapter or subchapter title. Markdown is fine in `body`,
  flashcards, quiz questions, answers and explanations.

## Markdown gotcha: consecutive blockquote lines merge

`react-markdown` follows CommonMark: **two `>` lines with no blank line between them are
joined into one paragraph** separated by a space. So this:

~~~md
> ¬(P ∧ Q) = ¬P ∨ ¬Q
> ¬(P ∨ Q) = ¬P ∧ ¬Q
~~~

renders as one run-on line — `…¬P ∨ ¬Q ¬(P ∨ Q)…` — which looks like a syntax error
(e.g. a missing operator between two formulas).

**Fix:** separate the lines with a blank quote line (`>`) so each becomes its own
paragraph and renders on its own line:

~~~md
> ¬(P ∧ Q) = ¬P ∨ ¬Q
>
> ¬(P ∨ Q) = ¬P ∧ ¬Q
~~~

This applies to any multi-line formula/derivation block in a `body` string (chained
inequalities, quantifier laws, step-by-step proofs).
