# ⚡ Engineer Crash Course

A fast, navigable React knowledge base for sharpening software-engineering
fundamentals — built for interview prep and quick refreshers. Nothing needs to
be read in order: use the sidebar (with live filter) or the home grid to jump
anywhere.

## Run it

```bash
npm install     # already done
npm run dev     # start the dev server (prints a localhost URL)
```

Then open the printed URL (e.g. http://localhost:5173).

Other scripts:

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build
```

## What's inside

9 chapters · 74 topics · 267 flashcards · 292 self-test questions.

1. **Data Structures** — arrays, hash maps, trees/graphs, BFS/DFS, binary search, DP, heaps, intervals, sliding window, two pointers (brain-teaser focused)
2. **CS Fundamentals** — how to calculate time complexity + complexity riddles (hash tables, trees, tries, graphs, heaps, union-find)
3. **Algorithms** — sorting, graph algorithms, topological sort, Dijkstra, DP, greedy, recursion vs iteration
4. **System Design** — URL shortener, chat, metrics, distributed cache, job scheduler, file storage, recommendations, event pipeline (with "how to manage it" flashcards)
5. **Operating Systems** — threads vs processes, locks, deadlocks, scheduling, virtual memory, paging, mmap, file systems, networking basics
6. **Concurrency** — mutexes, semaphores, condition variables, producer-consumer, thread pools, lock-free, atomics, memory ordering (with code)
7. **Networking** — TCP/UDP, HTTP/2, HTTP/3, TLS, DNS, connection lifecycle, keep-alive, load balancing (FAQ style)
8. **Python** — GIL, asyncio, generators, decorators, context managers, typing, dataclasses, GC, multiprocessing
9. **Low-Level & Systems at Scale** — GPUs, CUDA, AI infra, HPC, autonomous vehicles, networking/Mellanox, distributed AI training, data-center software

### Features

- **Non-linear navigation** — collapsible sidebar, searchable topic filter, home grid, and prev/next paging.
- **🃏 Flashcards** — click to reveal the answer.
- **🧠 Test-yourself** — multiple-choice (instant right/wrong feedback + explanation) and open brain-teasers (reveal the worked answer).

## Structure

```
src/
  App.jsx                 # routing + layout
  components/             # Sidebar, Home, ContentView, Flashcards, Quiz
  content/
    index.js              # aggregates chapters + builds nav/paging index
    ch1-data-structures.js … ch9-low-level.js   # all content lives here
```

To edit or add content, open the relevant `content/ch*.js` file — each exports a
chapter object of `{ id, title, subchapters: [{ id, title, body, flashcards, quiz }] }`.
`body` is Markdown; quiz items with `options` are multiple-choice (`answer` is
the 0-based index), otherwise they're open questions (`answer` is a string).
