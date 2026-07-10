export default {
  id: "math",
  title: "Relevant Math",
  subchapters: [
    {
      id: "logarithms",
      title: "Logarithms & Exponentials",
      body: `## Logarithms — the Engineer's Ruler

A logarithm answers the question: **"To what power must the base be raised to get this number?"**

> log_b(x) = y  ⟺  b^y = x

The two show up everywhere in CS because *halving* (or doubling) a quantity repeatedly is one of the most common patterns in algorithms — binary search, balanced trees, divide-and-conquer.

### Why "how many times can I halve n?"

Start with n and halve until you reach 1:

~~~text
n → n/2 → n/4 → … → 1
~~~

After k halvings you have n / 2^k. Setting n / 2^k = 1 gives 2^k = n, so **k = log₂ n**. That single fact explains binary search, balanced-tree height, and the depth of most divide-and-conquer recursions.

### The Log Rules (memorize these)

| Rule | Formula |
|------|---------|
| Product | log(xy) = log x + log y |
| Quotient | log(x/y) = log x − log y |
| Power | log(xⁿ) = n·log x |
| Change of base | log_b(x) = log_c(x) / log_c(b) |
| Inverse | b^(log_b x) = x |
| Log of 1 | log_b(1) = 0 |

### Why the base doesn't matter in Big-O

Change of base says log₂ n = ln n / ln 2 = (1/ln 2)·ln n. Different bases differ only by a **constant factor** (1/ln 2 ≈ 1.4427). Big-O ignores constants, so:

> O(log₂ n) = O(log₁₀ n) = O(ln n) = **O(log n)**

That's why we write "O(log n)" with no base.

### Exponentials — the mirror image

Exponential growth b^n is the inverse of logarithmic growth. A logarithm grows painfully slowly; an exponential explodes.

| n | log₂ n | 2ⁿ |
|---|--------|-----|
| 8 | 3 | 256 |
| 16 | 4 | 65,536 |
| 32 | 5 | ~4.3 billion |
| 1,000,000 | ~20 | astronomically huge |

The key intuition: **log₂(1,000,000) ≈ 20**. Binary search over a million items takes only ~20 comparisons. That is the whole reason logarithmic algorithms feel like magic.

### Handy values

- log₂ 1000 ≈ 10  (since 2¹⁰ = 1024)
- log₂ 1,000,000 ≈ 20
- log₂ 1,000,000,000 ≈ 30
- ln x = log₂ x × 0.693,  log₂ x = ln x × 1.4427
`,
      quizTitle: "Logarithm riddles",
      flashcards: [
        {
          front: "Why do we write O(log n) without specifying a base?",
          back: `Change of base: log_b(n) = log_c(n) / log_c(b). Any two logarithms differ only by a **constant factor** (1/log_c(b)). Big-O discards constant factors, so all log bases collapse to a single class **O(log n)**.`
        },
        {
          front: "Roughly what is log₂ of one million?",
          back: `**≈ 20**, because 2²⁰ = 1,048,576 ≈ 10⁶. This is why binary search over a million elements needs only ~20 comparisons.`
        },
        {
          front: "Simplify log(a) + log(b) − log(c).",
          back: `**log(ab/c)** — the product rule turns addition into multiplication, and the quotient rule turns subtraction into division.`
        },
        {
          front: "How many times can you halve n before reaching 1, and why does it matter?",
          back: `**log₂ n** times (n/2^k = 1 ⟹ k = log₂ n). This is the reason divide-and-conquer recursions, balanced-tree heights, and binary search are all logarithmic.`
        }
      ],
      quiz: [
        {
          question: "A dataset has 1 billion (10⁹) sorted records. Roughly how many comparisons does binary search need in the worst case?",
          options: ["~9", "~30", "~1000", "~1,000,000"],
          answer: 1,
          explanation: `Binary search is O(log₂ n). log₂(10⁹) ≈ 30 (since 2³⁰ ≈ 1.07 × 10⁹). So about **30 comparisons** — the power of logarithmic search.`
        },
        {
          question: "Using log rules, simplify log₂(n⁴ / n) for a single n.",
          answer: `log₂(n⁴ / n) = log₂(n³) = **3·log₂ n**.

First apply the quotient rule (n⁴/n = n³), then the power rule (log(n³) = 3 log n).`
        },
        {
          question: "Why is an O(2ⁿ) algorithm considered intractable for even moderate n, while O(n²) is fine?",
          answer: `Exponential growth doubles the work every time n increases by 1. At n = 60, 2⁶⁰ ≈ 10¹⁸ operations — infeasible. Meanwhile n² at n = 60 is only 3,600.

**Polynomial (nᵏ) grows by a fixed factor per doubling of n; exponential (2ⁿ) squares.** That gap is the practical boundary between "solvable" and "hopeless".`
        }
      ]
    },
    {
      id: "tree-height",
      title: "Tree Heights: Why Balanced ⇒ log n, and Sorting ⇒ n log n",
      body: `## The Height of a Tree

This chapter untangles two facts that are easy to confuse:

1. A **balanced binary tree** with n nodes has height **Θ(log n)**.
2. **Comparison sorting** n elements takes **Θ(n log n)** — and the proof is *also* about tree height.

They're related: both come from counting how many leaves a binary tree of a given height can hold.

### Definitions

- **Height** = number of edges on the longest path from the root to a leaf. A single node has height 0.
- **Level i** of a binary tree holds at most 2ⁱ nodes (the root is level 0, its children level 1, and so on).

### Claim 1 — A binary tree of height h holds at most 2^(h+1) − 1 nodes

Sum the maximum nodes across all levels 0 through h:

> N ≤ 2⁰ + 2¹ + 2² + … + 2^h = 2^(h+1) − 1

(That's a geometric series — see the Summations chapter.) A **full** binary tree achieves this maximum.

### Claim 2 — Therefore any binary tree with n nodes has height ≥ log₂(n+1) − 1

Invert Claim 1. If n ≤ 2^(h+1) − 1, then:

> 2^(h+1) ≥ n + 1
> h + 1 ≥ log₂(n + 1)
> **h ≥ log₂(n + 1) − 1**

This is a *lower bound*: no binary tree can be shorter than ~log₂ n. It is impossible to pack n nodes into fewer than logarithmically many levels, because each level at most **doubles** the capacity.

### Claim 3 — A balanced tree achieves this bound: height = Θ(log n)

A balanced tree keeps every level full (or nearly full), so n ≈ 2^(h+1) − 1, giving **h = Θ(log n)**. Concretely, the minimum possible height of a binary tree with n nodes is:

> h_min = ⌈log₂(n + 1)⌉ − 1

| n nodes | Min height (balanced) | Max height (degenerate) |
|---------|----------------------|--------------------------|
| 7 | 2 | 6 |
| 15 | 3 | 14 |
| 1,023 | 9 | 1,022 |
| 10⁶ | ~20 | ~10⁶ |

A **degenerate** tree (each node has one child — effectively a linked list) has height n − 1. That's why unbalanced BSTs degrade to O(n) operations, and why AVL / red-black trees do rebalancing work to guarantee O(log n).

### So where does *n log n* come from?

Two different places, both tied to trees:

#### (a) The recursion tree of divide-and-conquer

Merge sort splits the array in half, recurses, and merges in linear time:

> T(n) = 2·T(n/2) + c·n

Draw the recursion as a tree. It has **log₂ n levels** (each level halves the subproblem size until size 1), and **each level does c·n total work** (the merges at one level touch all n elements combined).

~~~text
level 0:            [ n ]                  → c·n work
level 1:      [n/2]      [n/2]             → c·n work
level 2:   [n/4][n/4] [n/4][n/4]           → c·n work
  ...            (log₂ n levels)  ...
~~~

Total work = (work per level) × (number of levels) = **c·n × log₂ n = Θ(n log n)**.

#### (b) The comparison-sort lower bound (a beautiful tree-height proof)

*Every* comparison-based sort can be modeled as a **decision tree**: each internal node is one comparison ("is a[i] < a[j]?"), each branch is the yes/no answer, and each **leaf** is one final ordering of the input.

- To sort correctly, the tree must have a distinct leaf for every possible input permutation. There are **n!** permutations, so the tree needs **≥ n! leaves**.
- By Claim 1, a binary tree of height h has at most **2^h leaves**. So we need 2^h ≥ n!.
- Take log₂ of both sides: **h ≥ log₂(n!)**.
- By Stirling's approximation, log₂(n!) = Θ(n log n).

The height h *is* the worst-case number of comparisons. Therefore:

> **No comparison sort can beat Ω(n log n) comparisons.**

Merge sort and heapsort match it, so **Θ(n log n) is optimal** for comparison sorting. This is the precise, correct statement behind the loose phrase "sorting is n log n" — and notice both the lower bound *and* the divide-and-conquer upper bound are really theorems about how many leaves fit under a tree of a given height.
`,
      quizTitle: "Tree-height reasoning",
      flashcards: [
        {
          front: "Prove that a binary tree with n nodes has height ≥ log₂(n+1) − 1.",
          back: `A binary tree of height h has at most 2^(h+1) − 1 nodes (sum of 2⁰ + … + 2^h). So n ≤ 2^(h+1) − 1 ⟹ 2^(h+1) ≥ n+1 ⟹ h ≥ **log₂(n+1) − 1**. Each level at most doubles capacity, so you cannot pack n nodes into fewer than ~log₂ n levels.`
        },
        {
          front: "What is the height of a degenerate (unbalanced) BST with n nodes, and why does it matter?",
          back: `**n − 1** — every node has a single child, so it behaves like a linked list. Search/insert degrade from O(log n) to **O(n)**. This is why AVL and red-black trees rebalance to guarantee logarithmic height.`
        },
        {
          front: "Why is merge sort Θ(n log n)? Explain via the recursion tree.",
          back: `T(n) = 2T(n/2) + cn. The recursion tree has **log₂ n levels** (halving until size 1) and does **cn total work per level** (all merges at a level touch n elements combined). Total = cn × log₂ n = **Θ(n log n)**.`
        },
        {
          front: "Why can no comparison sort be faster than Ω(n log n)?",
          back: `Model the sort as a binary decision tree: each leaf is one output permutation, and there are n! permutations, so ≥ n! leaves. A tree of height h has ≤ 2^h leaves, so 2^h ≥ n! ⟹ h ≥ log₂(n!) = **Θ(n log n)**. The height is the worst-case comparison count, so Ω(n log n) is a hard floor.`
        }
      ],
      quiz: [
        {
          question: "A perfectly balanced binary tree has exactly 1,048,575 (= 2²⁰ − 1) nodes. What is its height?",
          options: ["10", "19", "20", "1,048,574"],
          answer: 1,
          explanation: `A full binary tree of height h has 2^(h+1) − 1 nodes. Set 2^(h+1) − 1 = 2²⁰ − 1 ⟹ h + 1 = 20 ⟹ **h = 19** (height counts edges, and the tree spans levels 0 through 19).`
        },
        {
          question: "Someone claims 'the height of a tree is n log n.' What is wrong with this, and what are the correct statements?",
          answer: `The height of a tree is **not** n log n. The correct facts:

- **Balanced** binary tree height = **Θ(log n)**.
- **Degenerate** tree height = **n − 1** = Θ(n).
- **n log n** is the cost of comparison **sorting**, and of divide-and-conquer recursions like merge sort — not a tree's height.

The confusion likely comes from the sorting lower-bound proof, which *uses* tree height (a decision tree with n! leaves must have height ≥ log₂(n!) = Θ(n log n)). So "n log n" is a *height* — but of the decision tree, whose height equals the number of comparisons, not of the data structure itself.`
        },
        {
          question: "Why does building a binary heap take O(n) time, even though it has n nodes each seemingly needing O(log n) to sift down?",
          answer: `The naive bound n × O(log n) = O(n log n) is loose. Most nodes are near the **bottom** of the tree, where sift-down is cheap. At height h there are ~n/2^(h+1) nodes, each costing O(h):

Total = Σ (n / 2^(h+1)) · h = n · Σ h/2^(h+1).

The series Σ h/2^h converges to a **constant** (= 2). So total work = **O(n)**. The heights form a geometric-weighted sum dominated by the cheap leaves, not the expensive root.`
        }
      ]
    },
    {
      id: "summations",
      title: "Summations & Series",
      body: `## Series That Show Up in Complexity Analysis

Whenever you analyze a loop, you're really evaluating a sum. Knowing a handful of closed forms lets you read complexity straight off the code.

### Arithmetic Series — the nested-loop sum

> 1 + 2 + 3 + … + n = **n(n + 1) / 2 = Θ(n²)**

This is *the* reason a triangular nested loop is O(n²):

~~~js
for (let i = 0; i < n; i++)
  for (let j = 0; j < i; j++)   // inner runs 0,1,2,…,n-1 times
    work();
~~~

Total iterations = 0 + 1 + … + (n−1) = n(n−1)/2 ≈ **n²/2 = Θ(n²)**. Half of a full n² grid — but Big-O drops the constant.

**Sum of squares:** 1² + 2² + … + n² = n(n+1)(2n+1) / 6 = **Θ(n³)**.

### Geometric Series — the divide-and-conquer sum

> 1 + 2 + 4 + … + 2^k = **2^(k+1) − 1 ≈ 2·(largest term)**

General ratio r ≠ 1:

> a + ar + ar² + … + ar^(k) = a · (r^(k+1) − 1) / (r − 1)

The crucial intuition: **a geometric series is dominated by its largest term** (when r > 1) or its *first* term (when r < 1). Two consequences:

- **Doubling array (amortized O(1) push):** total copy work across resizes = 1 + 2 + 4 + … + n ≈ 2n = **O(n)** for n pushes ⟹ O(1) each.
- **Recursion where work shrinks geometrically:** T(n) = T(n/2) + O(n) sums to n + n/2 + n/4 + … = **2n = O(n)** — the top level dominates, so it's *not* n log n.

Infinite geometric series with |r| < 1:

> a + ar + ar² + … = **a / (1 − r)**   (e.g. 1 + ½ + ¼ + … = 2)

### Harmonic Series — the "log" that sneaks in

> H_n = 1 + 1/2 + 1/3 + … + 1/n ≈ **ln n + γ = Θ(log n)**

(γ ≈ 0.577 is the Euler–Mascheroni constant.) The harmonic series grows like a logarithm. It appears in:

- **Quicksort average case:** the expected comparisons involve Σ 1/k, giving **O(n log n)**.
- **Building a hash table / coupon-collector problems.**

### Quick-Reference

| Series | Closed form | Growth |
|--------|-------------|--------|
| 1 + 2 + … + n | n(n+1)/2 | Θ(n²) |
| 1² + 2² + … + n² | n(n+1)(2n+1)/6 | Θ(n³) |
| 1 + 2 + 4 + … + 2^k | 2^(k+1) − 1 | Θ(2^k) |
| a + ar + … + ar^k (r≠1) | a(r^(k+1)−1)/(r−1) | Θ(largest term) |
| 1 + ½ + ¼ + … (infinite) | 2 | Θ(1) |
| 1 + 1/2 + … + 1/n | ≈ ln n | Θ(log n) |

### The one rule to remember

> **When terms grow or shrink geometrically, the sum is dominated by the single largest term (× a constant). When they grow arithmetically/polynomially, the sum is one degree higher than the terms.**
`,
      quizTitle: "Series & sums",
      flashcards: [
        {
          front: "What is 1 + 2 + 3 + … + n, and what complexity does a triangular nested loop have?",
          back: `**n(n+1)/2 = Θ(n²)**. A loop where the inner runs 0,1,…,n−1 times executes n(n−1)/2 ≈ n²/2 iterations total — hence **O(n²)** despite touching only half the n×n grid.`
        },
        {
          front: "Why does doubling a dynamic array give amortized O(1) pushes?",
          back: `The total copy work over resizes is a geometric series: 1 + 2 + 4 + … + n ≈ **2n = O(n)** for n pushes. Divided across n pushes ⟹ **O(1) amortized** each. A geometric series is dominated by its largest term (~2× it).`
        },
        {
          front: "What does the harmonic series H_n = 1 + 1/2 + … + 1/n grow like?",
          back: `**H_n ≈ ln n = Θ(log n)**. It shows up in the average-case analysis of quicksort and coupon-collector problems, quietly injecting a log factor.`
        },
        {
          front: "T(n) = T(n/2) + O(n). Is this O(n log n) or O(n)? Why?",
          back: `**O(n)**. The work forms a *shrinking* geometric series n + n/2 + n/4 + … = 2n. Only ONE subproblem recurses (not two), so the top level dominates — unlike merge sort's T(n)=2T(n/2)+O(n), which does full work at every level ⟹ O(n log n).`
        }
      ],
      quiz: [
        {
          question: "Evaluate the total number of inner-loop iterations:\n~~~js\nfor (let i = 1; i <= n; i++)\n  for (let j = 1; j <= i; j++)\n    work();\n~~~",
          answer: `The inner loop runs i times for each i, so total = 1 + 2 + … + n = **n(n+1)/2 = Θ(n²)**.`
        },
        {
          question: "What is 1 + 3 + 9 + 27 + … + 3^k (a geometric series with ratio 3)?",
          options: ["3^k", "(3^(k+1) − 1) / 2", "k · 3^k", "3^(k+1)"],
          answer: 1,
          explanation: `Geometric sum formula a(r^(k+1)−1)/(r−1) with a=1, r=3: (3^(k+1) − 1)/(3 − 1) = **(3^(k+1) − 1)/2**. Note it's ≈ 1.5 × the largest term 3^k — the sum is dominated by its final term.`
        },
        {
          question: "A recursion does O(n) work then makes ONE recursive call on half the input: T(n) = T(n/2) + cn. Solve it.",
          answer: `Unroll: cn + c(n/2) + c(n/4) + … = cn · (1 + ½ + ¼ + …) = cn · 2 = **Θ(n)**.

This is a shrinking geometric series dominated by its first (largest) term. Contrast with T(n) = **2**T(n/2) + cn, where two calls keep total work at cn *per level* across log n levels ⟹ Θ(n log n).`
        }
      ]
    },
    {
      id: "combinatorics-probability",
      title: "Combinatorics & Probability",
      body: `## Counting and Chance

Combinatorics tells you *how many* configurations exist — which directly gives brute-force complexity. Probability tells you the *expected* behavior of randomized algorithms.

### Permutations — order matters

The number of ways to arrange n distinct items:

> n! = n × (n−1) × … × 2 × 1

Arrangements of k items chosen from n (order matters):

> P(n, k) = n! / (n − k)!

**Why it matters:** generating all orderings of n items is O(n!) — the reason brute-force TSP and permutation search explode. There are n! leaves in the sorting decision tree (see Tree Heights).

### Combinations — order doesn't matter

Choosing k items from n where order is irrelevant ("n choose k"):

> C(n, k) = n! / (k! · (n − k)!)

Read aloud: "n choose k." Key identities:

- C(n, k) = C(n, n − k)  (choosing what to keep = choosing what to drop)
- C(n, 0) = C(n, n) = 1
- **Pascal's rule:** C(n, k) = C(n−1, k−1) + C(n−1, k)  ← the recurrence behind DP for combinations
- Sum of a row: C(n,0) + C(n,1) + … + C(n,n) = **2ⁿ** (total number of subsets)

### The Binomial Theorem

> (x + y)ⁿ = Σ_{k=0}^{n} C(n, k) · x^(n−k) · y^k

Setting x = y = 1 recovers Σ C(n,k) = 2ⁿ — every subset of an n-element set, which is why subset enumeration is **O(2ⁿ)**.

### Powers of 2 — the subset count

An n-element set has exactly **2ⁿ subsets** (each element is independently in or out). This is the size of the power set and the complexity of bitmask DP over n items.

### Probability essentials

- **Expected value:** E[X] = Σ (value × probability). For a fair die, E = (1+2+3+4+5+6)/6 = 3.5.
- **Linearity of expectation:** E[X + Y] = E[X] + E[Y], *always* — even when X and Y are dependent. This is the single most useful trick for analyzing randomized algorithms.
- **Independence:** P(A and B) = P(A) · P(B) when A, B are independent.

**Example — expected comparisons in randomized quicksort:** using linearity of expectation over indicator variables (does element i ever get compared to element j?), the expected total is Σ_{i<j} 2/(j−i+1), which sums via the harmonic series to **O(n log n)**.

### Stirling's Approximation — taming n!

> n! ≈ √(2πn) · (n / e)ⁿ,   so   **log₂(n!) = Θ(n log n)**

This is what turns the "≥ n! leaves" fact into the "≥ Θ(n log n) comparisons" sorting bound.

### Quick-Reference

| Quantity | Formula | Shows up as |
|----------|---------|-------------|
| Permutations of n | n! | O(n!) brute force |
| k-permutations | n!/(n−k)! | ordered selection |
| Combinations | n!/(k!(n−k)!) | "n choose k", DP |
| Subsets of n | 2ⁿ | bitmask DP, power set |
| log₂(n!) | Θ(n log n) | sorting lower bound |
| E[X] | Σ value·prob | randomized analysis |
`,
      quizTitle: "Counting & probability",
      flashcards: [
        {
          front: "How many subsets does a set of n elements have, and why?",
          back: `**2ⁿ**. Each element is independently either in or out of a subset — n binary choices ⟹ 2ⁿ combinations. This equals Σ C(n,k) over all k, and is why subset/bitmask enumeration is O(2ⁿ).`
        },
        {
          front: "State Pascal's rule and why it's useful in DP.",
          back: `**C(n, k) = C(n−1, k−1) + C(n−1, k)** — either the nth item is in your chosen set (choose k−1 from the rest) or it isn't (choose k from the rest). It's the recurrence that lets you build Pascal's triangle / binomial coefficients bottom-up in O(n·k).`
        },
        {
          front: "What is linearity of expectation and why is it so powerful?",
          back: `**E[X + Y] = E[X] + E[Y]**, which holds even when X and Y are *dependent*. It lets you break a complicated random total into simple indicator variables and add their probabilities — the core trick for analyzing randomized quicksort, hashing, and more, with no independence assumptions.`
        },
        {
          front: "Why is generating all permutations of n items O(n!)?",
          back: `There are exactly **n!** distinct orderings (n choices for the first slot, n−1 for the second, …). Any algorithm that lists them all must do at least n! units of work, which grows faster than any exponential 2ⁿ.`
        }
      ],
      quiz: [
        {
          question: "How many ways can you choose a 3-person committee from 10 people (order irrelevant)?",
          options: ["30", "120", "720", "1000"],
          answer: 1,
          explanation: `C(10, 3) = 10! / (3! · 7!) = (10 × 9 × 8) / (3 × 2 × 1) = 720 / 6 = **120**. Order doesn't matter, so we divide by 3! to remove duplicate orderings.`
        },
        {
          question: "A bitmask DP iterates over all subsets of n items, doing O(n) work per subset. What is the total complexity?",
          answer: `There are **2ⁿ** subsets, each costing O(n), so total = **O(n · 2ⁿ)**.

(If you also iterate over all *pairs* of subset/submask, it becomes the classic O(3ⁿ) sum-over-subsets, since each element is in-subset-and-in-submask, in-subset-only, or out — 3 choices.)`
        },
        {
          question: "You flip a fair coin until you get heads. What is the expected number of flips?",
          answer: `**2 flips.** This is a geometric distribution with p = 1/2; expected value = 1/p = 2.

Intuition via the series: E = Σ k · (1/2)^k = 2. Half the time you finish in 1 flip, a quarter of the time in 2, etc., and the weighted average converges to 2.`
        }
      ]
    }
  ]
}
