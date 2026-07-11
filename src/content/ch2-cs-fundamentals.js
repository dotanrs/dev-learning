export default {
  id: "cs-fundamentals",
  title: "CS Fundamentals",
  subchapters: [
    {
      id: "calculating-complexity",
      title: "Calculating Time Complexity",
      body: `## Big-O Analysis

Big-O notation describes the **upper bound** on how an algorithm's resource usage grows as input size *n* increases — ignoring constant factors and lower-order terms.

### Core Rules

**Single loop → O(n)**
~~~js
for (let i = 0; i < n; i++) { doWork(); }
~~~

**Nested loops → multiply**
~~~js
for (let i = 0; i < n; i++)        // O(n)
  for (let j = 0; j < n; j++)      // × O(n)
    doWork();                        // → O(n²)
~~~

**Sequential blocks → add, then drop lower order**
~~~js
for (let i = 0; i < n; i++) {}    // O(n)
for (let i = 0; i < n*n; i++) {}  // O(n²)
// total: O(n + n²) = O(n²)
~~~

**Halving the input → O(log n)**
Any loop or recursion that divides the problem in half each step (binary search, balanced BST) runs in O(log n).

### Recursion & Recurrence Relations

Write the recurrence, then solve it — often with the **Master Theorem**:

> For T(n) = a·T(n/b) + f(n):
>
> - If f(n) = O(n^(log_b a − ε)) → T(n) = Θ(n^(log_b a))
>
> - If f(n) = Θ(n^(log_b a)) → T(n) = Θ(n^(log_b a) · log n)
>
> - If f(n) = Ω(n^(log_b a + ε)) → T(n) = Θ(f(n))

*Merge sort*: T(n) = 2T(n/2) + O(n) → a=2, b=2, log_b(a)=1, f(n)=n → case 2 → **O(n log n)**

### Amortized Analysis

Some operations are occasionally expensive but cheap *on average* over a sequence of calls. A dynamic array doubles when full: most pushes are O(1), occasional resize is O(n), but the **amortized** cost per push is still **O(1)** (potential/accounting method).

### Common Complexity Classes

| Class | Name | Example |
|-------|------|---------|
| O(1) | Constant | Hash table lookup |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Single scan |
| O(n log n) | Linearithmic | Merge sort |
| O(n²) | Quadratic | Bubble sort |
| O(2ⁿ) | Exponential | Subset enumeration |
| O(n!) | Factorial | Permutation generation |

### Best / Average / Worst

- **Best case (Ω)**: lower bound on all inputs — rarely useful alone.
- **Average case (Θ)**: expected over random inputs — realistic.
- **Worst case (O)**: upper bound — the safe guarantee interviews ask about.

### Space Complexity

Count **extra** memory beyond the input:
- In-place sort (heapsort) → O(1) auxiliary space
- Merge sort → O(n) auxiliary space
- Recursive DFS on a graph → O(V) call-stack space
- Hash map storing all elements → O(n)

### Quick-Reference Table

| Snippet | Time |
|---------|------|
| \`arr[i]\` | O(1) |
| Linear scan | O(n) |
| Binary search | O(log n) |
| Two nested loops over n | O(n²) |
| Merge sort | O(n log n) |
| Generating all subsets | O(2ⁿ) |
`,
      quizTitle: "Complexity riddles",
      flashcards: [
        {
          front: "What is the time complexity of binary search and why?",
          back: `**O(log n)** — each comparison eliminates half the remaining search space, so after k steps only n/2^k elements remain. When n/2^k = 1, k = log₂ n.`
        },
        {
          front: "What does amortized O(1) mean for dynamic array push?",
          back: `Individual pushes are O(1) until the array doubles (O(n) resize). Over n pushes the total work is O(n), so the *amortized* cost per push is O(n)/n = **O(1)**. No single push is O(1) in the worst case, but the average over the sequence is.`
        },
        {
          front: "State the Master Theorem case that applies to merge sort.",
          back: `T(n) = 2T(n/2) + O(n). Here a=2, b=2, so log_b(a) = log₂ 2 = 1. f(n) = O(n) = O(n^1) — this matches **case 2** (f(n) = Θ(n^(log_b a))). Result: **T(n) = Θ(n log n)**.`
        },
        {
          front: "Three nested loops each from 0 to n — what is the complexity?",
          back: `**O(n³)** — nested loops multiply: n × n × n = n³ iterations total.`
        }
      ],
      quiz: [
        {
          question: "What is the time complexity of this snippet?\n~~~js\nlet count = 0;\nfor (let i = 1; i < n; i *= 2) count++;\n~~~",
          answer: `**O(log n)**

The loop variable \`i\` doubles each iteration (i = 1, 2, 4, 8, …). The loop runs until i ≥ n, which takes log₂ n steps.`
        },
        {
          question: "What is the time and space complexity of this recursive function?\n~~~js\nfunction sum(arr, i = 0) {\n  if (i === arr.length) return 0;\n  return arr[i] + sum(arr, i + 1);\n}\n~~~",
          answer: `**Time: O(n)** — one call per element.

**Space: O(n)** — the call stack grows to depth n before unwinding (each frame is open simultaneously).`
        },
        {
          question: "What is the time complexity of the following nested loop?\n~~~js\nfor (let i = 0; i < n; i++)\n  for (let j = i; j < n; j++)\n    doWork();\n~~~",
          options: ["O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"],
          answer: 2,
          explanation: `The inner loop runs n−i times for each i. Total = n + (n−1) + … + 1 = n(n+1)/2 = **O(n²)**. Even though the inner loop starts at i (not 0), the triangular sum is still quadratic.`
        },
        {
          question: "You call a function that runs in O(n log n), then immediately call another that runs in O(n²). What is the combined complexity?",
          options: ["O(n log n)", "O(n² log n)", "O(n²)", "O(n³)"],
          answer: 2,
          explanation: `Sequential blocks **add**: O(n log n) + O(n²) = O(n² + n log n). Drop the lower-order term → **O(n²)**.`
        },
        {
          question: "What recurrence describes merge sort, and what does the Master Theorem give?",
          answer: `Recurrence: **T(n) = 2T(n/2) + O(n)**

- a = 2, b = 2, log_b(a) = 1
- f(n) = O(n) = Θ(n^1) → Master Theorem **case 2**
- Result: **T(n) = Θ(n log n)**`
        },
        {
          question: "An algorithm's worst-case is O(n²) but its average-case is O(n log n). Which should you quote in a system-design interview, and why?",
          answer: `Quote **both** with context. In practice the average case (O(n log n)) matters most for typical inputs — it predicts real-world performance. The worst case (O(n²)) is critical for adversarial inputs or hard latency guarantees (e.g., quicksort vs. merge sort for a public-facing sort endpoint). Always mention which case you're describing.`
        }
      ]
    },
    {
      id: "hash-tables",
      title: "Hash Tables",
      body: `## Hash Table Complexity

### Operation Complexities

| Operation | Average | Worst Case |
|-----------|---------|------------|
| Insert | O(1) | O(n) |
| Delete | O(1) | O(n) |
| Lookup | O(1) | O(n) |
| Iterate all keys | O(n) | O(n) |

### Why Worst Case is O(n)

A poor hash function (or adversarial input) can cause all n keys to map to the same bucket — every lookup then degenerates into a linear scan of that bucket's chain.

### Load Factor & Resizing

**Load factor α = n / m** (n = stored items, m = number of buckets).

When α exceeds a threshold (typically 0.75 in Java HashMap), the table **resizes** — allocates a new table of size 2m and rehashes all n keys. This single resize costs O(n), but it happens infrequently enough that the **amortized** cost per insert remains **O(1)**.

### Collision Resolution

- **Chaining**: each bucket holds a linked list of colliding entries. Lookup traverses the chain → worst O(n).
- **Open addressing** (linear probing, quadratic probing, double hashing): collisions probe sequentially through the table. Clustering can degrade performance; worst O(n).

### Gotcha

> Iterating over a hash map does **not** give keys in insertion or sorted order. If you need ordered iteration, use a sorted structure (e.g., a balanced BST / TreeMap) at O(log n) per operation.
`,
      quizTitle: "Complexity riddles",
      flashcards: [
        {
          front: "Hash table average vs worst-case lookup — what causes worst case?",
          back: `**Average: O(1)**, **Worst: O(n)**.

Worst case arises when all n keys hash to the same bucket (bad hash function or adversarial input), forcing a full linear scan of that bucket's chain.`
        },
        {
          front: "Why is inserting n items into a hash table O(n) total despite occasional O(n) resizes?",
          back: `Resizing doubles the table size each time. The k-th resize copies 2^k elements. Total copying work across all resizes: 1 + 2 + 4 + … + n/2 + n ≈ 2n = **O(n)** total, so **O(1) amortized** per insert.`
        }
      ],
      quiz: [
        {
          question: "What is the average-case time complexity of looking up a key in a hash table?",
          options: ["O(log n)", "O(1)", "O(n)", "O(n²)"],
          answer: 1,
          explanation: `With a good hash function and low load factor, the key hashes to a bucket in O(1) and no collision chain is traversed — **O(1) average**. Worst case is O(n) due to collisions.`
        },
        {
          question: "Why does increasing the load factor threshold (e.g., from 0.75 to 0.99) hurt lookup performance even if average case stays O(1)?",
          answer: `A higher load factor means more items per bucket on average, so collision chains grow longer. The **constant hidden inside O(1)** grows — lookups take more steps in practice even though the asymptotic class doesn't change. Space is saved, but latency increases.`
        },
        {
          question: "You insert n keys that all hash to bucket 0 (worst case). What is the complexity of looking up the last inserted key?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
          answer: 2,
          explanation: `All n keys are in one bucket chain. Finding the last one requires traversing all n−1 previous entries → **O(n)**.`
        },
        {
          question: "A hash table uses open addressing with linear probing and its load factor is 0.95. What problem does this cause?",
          answer: `**Primary clustering** — long consecutive runs of occupied slots form. An insertion or lookup must probe through the entire cluster before finding an empty slot. Expected probe length ≈ 1/(1−α)² → at α=0.95 that's ~200 probes per operation, making performance far worse than O(1) in practice, though still O(1) amortized with occasional resizing.`
        },
        {
          question: "How does a hash table differ from a hash set in terms of complexity?",
          answer: `They have **identical complexity** — O(1) average for insert/delete/lookup. A hash set stores only keys; a hash map stores key-value pairs. The extra value stored per entry doesn't change the asymptotic cost, only the constant memory factor.`
        }
      ]
    },
    {
      id: "trees",
      title: "Trees",
      body: `## Tree Complexity

### Binary Search Tree (BST)

| Operation | Balanced (AVL/RB) | Skewed (worst) |
|-----------|-------------------|----------------|
| Search | O(log n) | O(n) |
| Insert | O(log n) | O(n) |
| Delete | O(log n) | O(n) |
| Min/Max | O(log n) | O(n) |

**Balanced tree height h = O(log n)** — every operation traverses at most h levels.

**Skewed tree height h = O(n)** — inserting already-sorted data into a plain BST produces a linked list; every operation is O(n).

Self-balancing trees (AVL, Red-Black) maintain h = O(log n) by rotating after inserts/deletes — each rotation is O(1), so balance costs O(log n) per mutation.

### Tree Traversals

All standard traversals (in-order, pre-order, post-order, BFS level-order) visit every node exactly once → **O(n) time, O(h) space** (call stack / queue), where h is the tree height.

- In-order on BST → sorted output in O(n)
- Level-order BFS → O(n) queue space in worst case

### Height

- Perfect binary tree of n nodes: h = log₂(n+1) − 1 = O(log n)
- Completely unbalanced (linked list): h = n − 1 = O(n)

### Gotcha

> **Deleting from a BST** is the trickiest operation. The two-child case requires finding the in-order successor (min of right subtree) and replacing — this is still O(h), but easy to implement incorrectly. In self-balancing trees the rebalancing after deletion may require O(log n) rotations propagating up the tree.
`,
      quizTitle: "Complexity riddles",
      flashcards: [
        {
          front: "Why is a skewed BST O(n) for search?",
          back: `If you insert n already-sorted values into a plain BST, each new value becomes the right child of the previous maximum — the tree is a straight chain of height n−1. Search must traverse from root to leaf in the worst case: **O(n)**.`
        },
        {
          front: "What is the time and space complexity of an in-order BST traversal?",
          back: `**Time: O(n)** — every node is visited exactly once.

**Space: O(h)** — the call stack holds at most h frames, where h is the tree height. For a balanced tree h = O(log n); for a skewed tree h = O(n).`
        }
      ],
      quiz: [
        {
          question: "You insert the values [1, 2, 3, 4, 5] in order into a plain (non-self-balancing) BST. What is the height of the resulting tree and the complexity of searching for 5?",
          answer: `**Height: 4 (= n−1 = O(n))**. The tree degenerates into a right-skewed chain: 1→2→3→4→5. Searching for 5 traverses all 5 nodes → **O(n)**.

This is why sorted data is the adversarial input for plain BSTs — always use AVL or Red-Black trees if insertion order is unknown.`
        },
        {
          question: "What is the time complexity of finding the minimum value in a balanced BST?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          answer: 1,
          explanation: `In a BST the minimum is always the leftmost node. Traversing left from the root takes O(h) steps. For a balanced tree h = O(log n) → **O(log n)**. (It would be O(1) only if you cache a pointer to the minimum node.)`
        },
        {
          question: "How much extra space does a recursive in-order traversal use, and does it change between balanced and skewed trees?",
          answer: `**O(h)** extra space (call stack). For a **balanced tree** h = O(log n) — very efficient. For a **skewed tree** h = O(n) — the call stack grows to n frames and may cause a stack overflow for large n. An iterative traversal with an explicit stack has the same O(h) space but avoids stack-overflow risk.`
        },
        {
          question: "An AVL tree performs a rotation after an insert. What is the total complexity of the insert including rebalancing?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
          answer: 1,
          explanation: `Finding the insertion point is O(log n). Rebalancing propagates up the path from insert point to root — at most O(log n) nodes to check, and each rotation is O(1). Total: **O(log n)**.`
        },
        {
          question: "What is the space complexity of BFS level-order traversal on a balanced binary tree with n nodes?",
          answer: `**O(n)** in the worst case. The BFS queue holds one level at a time. The widest level of a perfect binary tree has n/2 nodes (the leaf level), so the queue can grow to **O(n)**. This contrasts with DFS which uses O(h) = O(log n) stack space on a balanced tree.`
        }
      ]
    },
    {
      id: "tries",
      title: "Tries",
      body: `## Trie Complexity

A **trie** (prefix tree) stores strings character by character. Each node represents one character; a path from root to a marked node spells a stored key.

### Operation Complexities

Let **L** = length of the key, **Σ** = alphabet size (e.g., 26 for lowercase English).

| Operation | Time | Space per node |
|-----------|------|----------------|
| Insert key | O(L) | O(Σ) per node |
| Search key | O(L) | — |
| Delete key | O(L) | — |
| Starts-with prefix | O(L) | — |
| List all keys | O(total chars stored) | — |

Operations are independent of n (number of stored keys) — only key length matters.

### Space Complexity

- **Array-of-children**: each node holds an array of Σ pointers → O(n · L · Σ) total space. Wastes memory when alphabet is large or trie is sparse.
- **HashMap-of-children**: each node holds a map of only the characters actually seen → O(n · L) space on average, but adds hash-map overhead per node.
- **Compressed trie (Patricia/Radix tree)**: merges single-child chains into edge labels → reduces node count significantly.

### When to Use

Tries outperform hash maps for:
- **Prefix search** (autocomplete) — walk the prefix in O(L), then enumerate subtree
- **Lexicographic sort** — in-order traversal yields sorted keys in O(n · L)
- **Longest common prefix** — a single traversal

### Gotcha

> The space cost of a trie is often **worse** than a hash table in practice. An array-of-children node for a 26-letter alphabet requires 26 pointers (≈ 200 bytes) even if only 1–2 children are used. Always consider a hash-map-of-children or compressed trie when memory is constrained.
`,
      quizTitle: "Complexity riddles",
      flashcards: [
        {
          front: "What is the time complexity of inserting a key of length L into a trie?",
          back: `**O(L)** — you traverse (or create) exactly L nodes, one per character. The number of keys already in the trie does not affect insertion time.`
        },
        {
          front: "Why can trie space be worse than a hash table?",
          back: `Each trie node with an array-of-children stores **Σ pointers** (e.g., 26 for lowercase letters) even if most children are absent. A trie storing n keys of average length L uses O(n · L · Σ) space. A hash table storing the same n keys uses O(n · L) space (just the strings themselves). For large Σ or sparse data, the trie's constant is much larger.`
        }
      ],
      quiz: [
        {
          question: "You store 1,000,000 English words (average length 8) in a trie with array-of-children nodes (Σ=26). Roughly how does its memory compare to a hash set storing the same words?",
          answer: `**Trie**: up to n·L·Σ = 1M × 8 × 26 ≈ 208M pointer slots. Each pointer is 8 bytes → ~1.6 GB worst case (many shared prefixes reduce this, but it's still large).

**Hash set**: stores ~1M strings × 8 bytes avg = ~8 MB for the strings plus hash table overhead.

Takeaway: for large Σ, **hash set wins on space**; use a hash-map-of-children trie or compressed (radix) trie to close the gap.`
        },
        {
          question: "What is the time complexity of finding all keys in a trie that share a given prefix of length L?",
          options: ["O(L)", "O(L + k)", "O(n)", "O(n · L)"],
          answer: 1,
          explanation: `First walk to the prefix node in **O(L)**. Then enumerate all k words in the subtree rooted there — each word costs O(its remaining length) to reconstruct, total O(k · avg_remaining). The combined complexity is **O(L + k·avg_remaining)**, simplified as **O(L + k)** when remaining lengths are bounded. Answer index 1 represents this O(L + k) form.`
        },
        {
          question: "Does searching for a key in a trie depend on the number of keys already stored?",
          answer: `**No.** Trie search is **O(L)** where L is the key length — it walks L nodes regardless of how many other keys are stored. This contrasts with a balanced BST where search is O(log n · comparison cost), and comparison cost for strings is O(L), giving O(L log n) total.`
        },
        {
          question: "What modification makes a trie support O(L) 'does any stored key start with this prefix?' queries efficiently?",
          answer: `A standard trie already supports this in **O(L)**: walk the trie following the prefix characters. If you reach the end of the prefix without a missing edge, at least one stored key shares that prefix. No modification needed — this is one of trie's native strengths over hash tables, which can't do prefix queries faster than O(n).`
        }
      ]
    },
    {
      id: "graphs",
      title: "Graphs",
      body: `## Graph Complexity

### Representation Complexities

Let **V** = vertices, **E** = edges.

| Operation | Adjacency List | Adjacency Matrix |
|-----------|---------------|-----------------|
| Space | O(V + E) | O(V²) |
| Add edge | O(1) | O(1) |
| Remove edge | O(degree) | O(1) |
| Check edge (u,v) | O(degree(u)) | O(1) |
| Get all neighbors of u | O(degree(u)) | O(V) |
| Iterate all edges | O(V + E) | O(V²) |

**Use adjacency list** for sparse graphs (E ≪ V²) — most real-world graphs (social networks, maps).
**Use adjacency matrix** for dense graphs (E ≈ V²) or when O(1) edge existence checks are critical.

### Traversal Complexities

Both BFS and DFS visit every vertex and every edge at most once:

| Algorithm | Time | Space |
|-----------|------|-------|
| BFS | O(V + E) | O(V) (queue) |
| DFS | O(V + E) | O(V) (stack / call stack) |

The O(V + E) cost comes from: O(V) to initialize, then each edge is examined at most twice (once from each endpoint in undirected graphs).

### Common Graph Algorithm Costs

| Algorithm | Time | Notes |
|-----------|------|-------|
| Dijkstra (binary heap) | O((V + E) log V) | Non-negative weights |
| Bellman-Ford | O(V · E) | Handles negative weights |
| Topological sort (DFS) | O(V + E) | DAGs only |
| Kruskal's MST | O(E log E) | Sort edges + union-find |
| Prim's MST (binary heap) | O((V + E) log V) | Similar to Dijkstra |

### Gotcha

> For **sparse graphs**, an adjacency matrix wastes O(V²) space and O(V) time per neighbor iteration even if a vertex has only 2 neighbors. A social graph with 1 billion users but ~100 friends each: adjacency matrix would need 10^18 cells — impossible. Adjacency list uses only O(V + E) = O(1.1 × 10⁹) space.
`,
      quizTitle: "Complexity riddles",
      flashcards: [
        {
          front: "Why is BFS time complexity O(V + E) and not O(V²)?",
          back: `BFS dequeues each vertex exactly once (O(V) total) and examines each edge exactly once — or twice for undirected graphs — (O(E) total). Total work = O(V + E). It would be O(V²) only if we used an adjacency matrix and scanned all V potential neighbors per vertex (O(V) × V vertices = O(V²)).`
        },
        {
          front: "Adjacency list vs matrix: which is better for 'does edge (u,v) exist?'",
          back: `**Adjacency matrix: O(1)** — direct lookup matrix[u][v].

**Adjacency list: O(degree(u))** — must scan u's neighbor list.

For edge-existence queries on dense graphs, the matrix wins. But the matrix costs O(V²) space vs O(V+E) for the list.`
        }
      ],
      quiz: [
        {
          question: "A graph has V=1000 vertices and E=2000 edges. You run DFS. What is the time complexity?",
          options: ["O(V²) = O(10⁶)", "O(V + E) = O(3000)", "O(E log V) ≈ O(22000)", "O(V · E)"],
          answer: 1,
          explanation: `DFS visits each vertex once and each edge once → **O(V + E) = O(1000 + 2000) = O(3000)**. This is a sparse graph (E ≪ V²=10⁶), so the adjacency list representation is efficient.`
        },
        {
          question: "What is the time complexity of finding all vertices reachable from a given source in an unweighted graph?",
          answer: `**O(V + E)** using BFS or DFS from the source. Each reachable vertex is visited once and each edge from it is examined once. Unreachable vertices are never visited. Total: proportional to the size of the subgraph reachable from source, bounded by O(V + E).`
        },
        {
          question: "Why does storing a complete (dense) graph as an adjacency list give no asymptotic advantage over a matrix?",
          answer: `In a complete graph E = V(V−1)/2 = O(V²). Adjacency list space: **O(V + E) = O(V²)**. Adjacency matrix space: **O(V²)**. They're the same asymptotically! The adjacency list loses its space advantage when the graph is dense. It also adds pointer overhead per edge, making the matrix often faster in practice for dense graphs.`
        },
        {
          question: "You run BFS on a graph stored as an adjacency matrix. What is the time complexity?",
          options: ["O(V + E)", "O(V²)", "O(E log V)", "O(V · E)"],
          answer: 1,
          explanation: `BFS dequeues each vertex once and scans **all V columns** of its row to find neighbors — even if the vertex has only 2 edges. Total: O(V) vertices × O(V) neighbor scan = **O(V²)**, regardless of actual edge count E.`
        },
        {
          question: "Topological sort using DFS on a DAG with V vertices and E edges — what is the time complexity, and why?",
          answer: `**O(V + E)** — DFS visits each vertex once (O(V)) and traverses each edge once (O(E)). Topological order is produced by appending each vertex to the result list when its DFS call returns (post-order). No additional work beyond the DFS traversal itself.`
        }
      ]
    },
    {
      id: "heaps",
      title: "Heaps",
      body: `## Heap Complexity

A **binary heap** is a complete binary tree stored in an array satisfying the heap property (parent ≤ children for min-heap).

### Operation Complexities

| Operation | Time | Notes |
|-----------|------|-------|
| Peek (min/max) | O(1) | Root element |
| Push (insert) | O(log n) | Sift up from leaf |
| Pop (extract min/max) | O(log n) | Replace root, sift down |
| Delete arbitrary element | O(log n) | Requires knowing index |
| Build heap from n elements | **O(n)** | Not O(n log n)! |
| Heapsort | O(n log n) | Build O(n) + n pops O(n log n) |

### Why Build-Heap is O(n), Not O(n log n)

Naively inserting n elements one-by-one costs O(n log n). But **Floyd's algorithm** (heapify from the bottom up) is O(n):

- Only leaves need 0 sifts.
- Nodes at height h need at most h sifts.
- Number of nodes at height h ≈ n/2^(h+1).
- Total work = Σ (n/2^(h+1)) × h ≈ n · Σ h/2^h = **O(n)** (the sum converges to 2).

### Heapsort

1. **Build heap**: O(n)
2. **Extract max n times**: each pop is O(log n) → O(n log n) total
3. **Overall**: O(n log n), in-place, O(1) auxiliary space

### Heap vs Priority Queue

A **priority queue** is the abstract data type; a binary heap is the standard implementation. All priority queue operations (push, pop, peek) map directly to O(log n) / O(1) heap operations.

### Gotcha

> Heaps do **not** support O(log n) arbitrary element lookup by value — you need to know the element's index. Languages like Java's PriorityQueue don't expose indices, making "decrease-key" (needed in Dijkstra) require a custom indexed heap or lazy deletion pattern (push a new entry, mark old as stale).
`,
      quizTitle: "Complexity riddles",
      flashcards: [
        {
          front: "Why is build-heap O(n) and not O(n log n)?",
          back: `Floyd's bottom-up heapify: most nodes are near the bottom and need very few sifts. The sum Σ_{h=0}^{log n} (n/2^(h+1)) × h telescopes to O(n). Inserting n elements one-by-one is O(n log n); building from an array bottom-up is **O(n)**.`
        },
        {
          front: "What is the time complexity of peek, push, and pop on a binary heap?",
          back: `- **Peek** (read min/max at root): **O(1)**
- **Push** (insert, sift up): **O(log n)**
- **Pop** (extract min/max, sift down): **O(log n)**`
        }
      ],
      quiz: [
        {
          question: "Why is peek O(1) on a min-heap but finding the maximum is O(n)?",
          answer: `In a min-heap the **minimum is always at the root** — O(1) direct access. The **maximum** has no guaranteed position: it could be any leaf node. Finding it requires scanning all leaf nodes → O(n/2) = **O(n)**.

(A max-heap has the opposite property — O(1) max, O(n) min.)`
        },
        {
          question: "You build a min-heap from an unsorted array of n elements. What method should you use, and what is its complexity?",
          options: ["Insert elements one by one — O(n log n)", "Floyd's bottom-up heapify — O(n)", "Merge sort then heapify — O(n log n)", "BFS traversal — O(n²)"],
          answer: 1,
          explanation: `**Floyd's bottom-up heapify** (call siftDown from the last internal node up to the root) runs in **O(n)** — provably better than one-by-one insertion. Most languages' priority queues accept a collection constructor that uses this method internally.`
        },
        {
          question: "What is the total complexity of heapsort on an array of n elements?",
          options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
          answer: 1,
          explanation: `**Build heap**: O(n). **Extract max n times**: each extraction is O(log n) → O(n log n) total. Combined: O(n) + O(n log n) = **O(n log n)**. Heapsort is in-place (O(1) auxiliary space), which distinguishes it from merge sort's O(n) space.`
        },
        {
          question: "Inserting n elements into a heap one at a time vs building with Floyd's algorithm — explain the difference in complexity.",
          answer: `**One-by-one insertion**: each push sifts up through O(log n) levels → n × O(log n) = **O(n log n)** total.

**Floyd's algorithm**: starts at the last internal node (index n/2) and calls siftDown upward. Most nodes are leaves (height 0) doing no work. The total sift work sums to O(n) because higher-height nodes are exponentially fewer. Result: **O(n)** — a factor of log n better.`
        },
        {
          question: "A k-ary heap (each node has k children instead of 2) — how do push and pop complexities change?",
          answer: `**Height** of a k-ary heap with n nodes: log_k(n) = O(log n / log k).

- **Push (sift up)**: O(log_k n) comparisons — slightly fewer levels.
- **Pop (sift down)**: must compare k children to find the min → O(k · log_k n) comparisons per pop.

For k=4: push is ~2× faster but pop is ~2× slower (more comparisons per level). The optimal k depends on the push/pop ratio in your workload. Total asymptotic class remains **O(log n)** for both.`
        }
      ]
    },
    {
      id: "union-find",
      title: "Union-Find",
      body: `## Union-Find (Disjoint Set Union) Complexity

Union-Find maintains a collection of disjoint sets and supports two operations: **find** (which set does element x belong to?) and **union** (merge the sets containing x and y).

### Operation Complexities

| Operation | Naive | Path Compression only | Union by Rank only | Both optimizations |
|-----------|-------|----------------------|-------------------|-------------------|
| Find | O(n) | O(log n) amortized | O(log n) | O(α(n)) amortized |
| Union | O(n) | O(log n) amortized | O(log n) | O(α(n)) amortized |
| n operations total | O(n²) | O(n log n) | O(n log n) | O(n · α(n)) |

**α(n)** is the inverse Ackermann function — it grows so slowly it is effectively constant (≤ 4 for any n that could exist in the universe). For practical purposes: **O(α(n)) ≈ O(1)**.

### Path Compression

After **find(x)** traces the path to the root, it **rewires** every node on that path to point directly to the root. Subsequent finds on the same elements are O(1).

~~~js
function find(x) {
  if (parent[x] !== x)
    parent[x] = find(parent[x]);  // path compression
  return parent[x];
}
~~~

### Union by Rank

Always attach the **shorter tree under the taller tree**. This bounds tree height at O(log n) without path compression alone.

~~~js
function union(x, y) {
  const rx = find(x), ry = find(y);
  if (rx === ry) return;
  if (rank[rx] < rank[ry]) [rx, ry] = [ry, rx];
  parent[ry] = rx;
  if (rank[rx] === rank[ry]) rank[rx]++;
}
~~~

### Why This Matters

Union-Find is the key data structure in:
- **Kruskal's MST** — O(E log E) sort + O(E · α(V)) union-find = O(E log E)
- **Connected components** in dynamic graphs
- **Cycle detection** in undirected graphs

### Gotcha

> Path compression changes the tree structure, so **rank** no longer reflects actual tree height after compression — it becomes an upper bound. That's fine for correctness (we only need it to decide which tree to attach under which), but the guarantee is "rank is an upper bound on height," not exact height.
`,
      quizTitle: "Complexity riddles",
      flashcards: [
        {
          front: "What does α(n) mean in Union-Find complexity, and why does it not matter in practice?",
          back: `**α(n)** is the inverse Ackermann function. It is the inverse of the Ackermann function A(k,k), which grows faster than any tower of exponentials. α(n) ≤ 4 for all n < 10^(10^(10^...)) (a power tower beyond physical reality). For any input you'll ever process, α(n) is a constant ≤ 4 — so O(α(n)) is effectively **O(1)** in practice.`
        },
        {
          front: "What are the two standard Union-Find optimizations and what does each one do?",
          back: `1. **Path compression** (in find): after finding the root, reattach every node on the path directly to the root. Flattens the tree, making future finds faster.

2. **Union by rank** (in union): always attach the smaller/shorter tree under the larger/taller one. Prevents the tree from growing tall in the first place.

Together they achieve O(α(n)) ≈ O(1) amortized per operation.`
        }
      ],
      quiz: [
        {
          question: "Without any optimizations, what is the worst-case time complexity of n Union-Find operations on n elements?",
          options: ["O(n · α(n))", "O(n log n)", "O(n²)", "O(n√n)"],
          answer: 2,
          explanation: `Naive Union-Find (no path compression, no union by rank) can build a chain of height n−1. Each find traverses the full chain → O(n) per operation. n operations → **O(n²)** total.`
        },
        {
          question: "After path compression, the parent pointers are updated. Does this break the correctness of union by rank?",
          answer: `**No** — correctness is preserved. After path compression, *rank* no longer equals actual tree height, but it remains a valid **upper bound** on height. Union by rank only requires that we attach the tree with smaller rank under the one with larger rank to prevent runaway height. Since rank is still a valid upper bound, the decision is still correct. The amortized analysis accounts for this and still yields O(α(n)).`
        },
        {
          question: "Kruskal's MST algorithm uses Union-Find. If the graph has V vertices and E edges, what is the total complexity?",
          answer: `1. **Sort edges**: O(E log E)
2. **Process each edge** (find + possibly union): E × O(α(V)) ≈ O(E · α(V))
3. **Total**: O(E log E + E · α(V)) = **O(E log E)**, since log E dominates α(V).

(Note: E ≤ V², so log E ≤ 2 log V — sometimes written O(E log V).)`
        },
        {
          question: "You have n elements and perform n find operations on the same element (the deepest node in a chain) without path compression. What is the total cost?",
          answer: `**O(n²)** total — each find traverses the entire chain of length up to n−1, costing O(n) per call. n calls × O(n) each = **O(n²)**.

With path compression, the **first** find costs O(n) and rewires everything to the root. Each of the remaining n−1 finds costs O(1). Total: O(n) + O(n) = **O(n)** amortized.`
        },
        {
          question: "Union by rank alone (no path compression) — what is the worst-case height of the tree after n unions?",
          options: ["O(1)", "O(log n)", "O(√n)", "O(n)"],
          answer: 1,
          explanation: `Union by rank ensures that a tree of rank k has at least 2^k nodes. Since the total nodes is n, the maximum rank (= height) is log₂ n. Therefore the tree height is bounded by **O(log n)**, and each find/union takes O(log n) worst case.`
        }
      ]
    }
  ]
}
