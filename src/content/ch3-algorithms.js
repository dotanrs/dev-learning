export default {
  id: "algorithms",
  title: "Algorithms",
  subchapters: [
    {
      id: "sorting",
      title: "Sorting",
      body: `## Sorting Algorithms

Sorting is the process of arranging elements in a defined order. Choosing the right algorithm depends on input size, memory constraints, stability needs, and whether the data is nearly sorted.

### Key Algorithms

| Algorithm | Best | Average | Worst | Space | Stable | In-Place |
|-----------|------|---------|-------|-------|--------|----------|
| Quicksort | O(n log n) | O(n log n) | O(n²) | O(log n) | No | Yes |
| Mergesort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes | No |
| Heapsort | O(n log n) | O(n log n) | O(n log n) | O(1) | No | Yes |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes | Yes |

### When Each Wins
- **Quicksort**: Best average-case in practice due to cache locality; use with random pivot or median-of-three.
- **Mergesort**: Prefer when stability matters or for linked lists; guaranteed O(n log n).
- **Heapsort**: When O(1) extra space is required and stability is not needed.
- **Insertion Sort**: Best for small arrays (n < ~20) or nearly-sorted data; used as a subroutine in Timsort.

### Why Comparison Sort is Ω(n log n)
Any comparison-based sort must distinguish among n! permutations. A binary decision tree needs at least log₂(n!) ≈ n log n leaves, so Ω(n log n) comparisons are required in the worst case.

### Linear Sorts (Non-Comparison)
- **Counting Sort**: O(n + k) where k is the value range. Works for small integer keys.
- **Radix Sort**: O(d · (n + k)) sorting digit-by-digit. Works for fixed-width integers/strings.

~~~js
// Quicksort (in-place)
function quicksort(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return;
  const pivot = partition(arr, lo, hi);
  quicksort(arr, lo, pivot - 1);
  quicksort(arr, pivot + 1, hi);
}

function partition(arr, lo, hi) {
  const pivotVal = arr[hi];
  let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    if (arr[j] <= pivotVal) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
  return i + 1;
}

// Mergesort
function mergesort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergesort(arr.slice(0, mid));
  const right = mergesort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    result.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  return result.concat(left.slice(i), right.slice(j));
}
~~~`,
      flashcards: [
        {
          front: "Why is Ω(n log n) a lower bound for comparison-based sorting?",
          back: `Any comparison sort can be modeled as a binary decision tree. To distinguish all n! permutations, the tree needs at least n! leaves, requiring height ≥ log₂(n!) ≈ n log n. Therefore at least Ω(n log n) comparisons are needed in the worst case.`
        },
        {
          front: "When should you choose mergesort over quicksort?",
          back: `Choose mergesort when:
- **Stability** is required (equal elements must preserve original order)
- Sorting **linked lists** (no random access needed)
- You need **guaranteed O(n log n)** worst-case (quicksort degrades to O(n²) on bad pivots)
- **External sorting** (data too large for RAM)`
        },
        {
          front: "What makes counting sort and radix sort faster than O(n log n)?",
          back: `They are **non-comparison** sorts — they don't compare elements against each other. Instead they exploit the structure of keys:
- **Counting sort**: counts occurrences, O(n + k) for k distinct values
- **Radix sort**: sorts digit by digit, O(d(n + k))

They bypass the Ω(n log n) lower bound because that bound only applies to comparison-based algorithms.`
        }
      ],
      quiz: [
        {
          question: "Which sorting algorithm guarantees O(n log n) worst-case time with O(1) extra space?",
          options: ["Quicksort", "Mergesort", "Heapsort", "Timsort"],
          answer: 2,
          explanation: `**Heapsort** achieves O(n log n) in all cases (best/average/worst) and sorts in-place using O(1) extra space. Quicksort has O(n²) worst case; mergesort needs O(n) extra space; Timsort is O(n log n) but uses O(n) space.`
        },
        {
          question: "What is the worst-case time complexity of quicksort, and when does it occur?",
          options: [
            "O(n log n) — when the array is random",
            "O(n²) — when the pivot is always the smallest or largest element",
            "O(n²) — when the array is already sorted and pivot is always the median",
            "O(n log n) — when the array is sorted in reverse"
          ],
          answer: 1,
          explanation: `Quicksort degrades to **O(n²)** when the pivot selection consistently produces maximally unbalanced partitions — e.g., always picking the minimum or maximum element (as happens with a naive last-element pivot on an already-sorted array). This results in n recursive calls each doing O(n) work.`
        },
        {
          question: "Which sorting algorithm is most efficient for a nearly-sorted array of 15 elements?",
          options: ["Quicksort", "Mergesort", "Heapsort", "Insertion Sort"],
          answer: 3,
          explanation: `**Insertion sort** runs in O(n) time on nearly-sorted arrays (few inversions) and has very low constant factors for small n. This is why Timsort uses insertion sort for small runs. For n=15, the overhead of divide-and-conquer algorithms is not worth it.`
        },
        {
          question: "Explain why mergesort is preferred over quicksort for sorting linked lists.",
          answer: `Mergesort is preferred for linked lists because:

1. **No random access needed**: Mergesort only requires sequential traversal; linked lists have O(n) random access, making quicksort's partition step expensive.
2. **Natural splitting**: Finding the midpoint of a linked list takes O(n) but is done once per level, keeping the overall complexity O(n log n).
3. **Stability**: Mergesort is stable, preserving the relative order of equal elements.
4. **No auxiliary space overhead**: Mergesort on linked lists can be done in-place by relinking nodes rather than copying to arrays.

Quicksort's main advantage (cache-friendly contiguous memory access) disappears with linked lists, making mergesort the clear winner.`
        },
        {
          question: "For counting sort to be efficient, what constraint must the input satisfy?",
          options: [
            "Elements must be floating-point numbers",
            "The value range k must be O(n) or small relative to n",
            "The array must already be partially sorted",
            "Elements must be unique"
          ],
          answer: 1,
          explanation: `Counting sort allocates an array of size k (the value range). Its time complexity is O(n + k). If k >> n (e.g., sorting 100 integers in range [0, 10^9]), the algorithm is dominated by O(k), making it far worse than O(n log n) comparison sorts. It is only efficient when k = O(n).`
        }
      ]
    },
    {
      id: "graph-algorithms",
      title: "Graph Algorithms",
      body: `## Graph Algorithms

Graphs model relationships between entities. Two fundamental traversals — BFS and DFS — underpin most graph algorithms.

### BFS (Breadth-First Search)
Explores neighbors layer by layer using a **queue**. Time: O(V + E).

**Uses**:
- Shortest path in **unweighted** graphs
- Level-order traversal
- Finding connected components
- Bipartite check

### DFS (Depth-First Search)
Explores as deep as possible before backtracking using a **stack** (or recursion). Time: O(V + E).

**Uses**:
- Cycle detection
- Topological sort
- Strongly connected components (Tarjan/Kosaraju)
- Pathfinding / maze solving

### Connected Components
Use BFS/DFS: for each unvisited node, launch a traversal. Each traversal discovers one component. For **Union-Find (DSU)**, merge edges in O(α(n)) amortized.

### Cycle Detection
- **Undirected**: During DFS, if you reach a visited node that is not the parent, a cycle exists.
- **Directed**: Track nodes in the current DFS call stack (gray nodes). A back edge to a gray node = cycle.

### Minimum Spanning Tree (MST)
An MST connects all V vertices with V-1 edges at minimum total weight.

| Algorithm | Complexity | Best For |
|-----------|-----------|----------|
| **Kruskal** | O(E log E) | Sparse graphs |
| **Prim** | O(E log V) with heap | Dense graphs |

- **Kruskal**: Sort edges, add edge if it doesn't form a cycle (use DSU).
- **Prim**: Greedily grow the MST from a start node, always picking the cheapest edge crossing the cut.

### Bipartite Check
A graph is bipartite iff it has **no odd-length cycles**. Use BFS/DFS with 2-coloring: color a node, color its neighbors the opposite color — if you ever need to color a node with its own color, it's not bipartite.

~~~js
// BFS shortest path (unweighted)
function bfs(graph, start) {
  const dist = new Map([[start, 0]]);
  const queue = [start];
  while (queue.length) {
    const node = queue.shift();
    for (const neighbor of graph[node] || []) {
      if (!dist.has(neighbor)) {
        dist.set(neighbor, dist.get(node) + 1);
        queue.push(neighbor);
      }
    }
  }
  return dist;
}

// DFS cycle detection (directed graph)
function hasCycle(graph, n) {
  const color = new Array(n).fill(0); // 0=white, 1=gray, 2=black
  function dfs(u) {
    color[u] = 1;
    for (const v of graph[u] || []) {
      if (color[v] === 1) return true; // back edge
      if (color[v] === 0 && dfs(v)) return true;
    }
    color[u] = 2;
    return false;
  }
  for (let i = 0; i < n; i++) {
    if (color[i] === 0 && dfs(i)) return true;
  }
  return false;
}
~~~`,
      flashcards: [
        {
          front: "What is the key difference in what BFS vs DFS is useful for in graphs?",
          back: `**BFS** (queue-based):
- Finds **shortest paths** in unweighted graphs
- Good for level-by-level exploration
- Bipartite checking

**DFS** (stack/recursion):
- Finds **cycles**, **topological order**, SCCs
- Better for exploring all paths or full connectivity
- Uses less memory when the tree is wide (BFS queue can be huge)`
        },
        {
          front: "How do Kruskal's and Prim's algorithms both compute the MST?",
          back: `Both are **greedy** and exploit the **cut property** (the minimum-weight edge crossing any cut belongs to some MST).

**Kruskal's**: Sort all edges by weight, add each edge if it doesn't create a cycle (checked via DSU). Global view — processes edges independently.

**Prim's**: Grow a single tree. At each step, add the cheapest edge that connects a tree node to a non-tree node. Local view — uses a min-heap. Better for dense graphs.`
        },
        {
          front: "How do you detect a cycle in a directed graph using DFS?",
          back: `Use **3-color marking**:
- **White (0)**: not visited
- **Gray (1)**: currently in the DFS call stack
- **Black (2)**: fully processed

During DFS, if you encounter a **gray node**, you have found a **back edge** — which means there is a cycle. A black node is safe (all its descendants are processed with no cycles found).`
        }
      ],
      quiz: [
        {
          question: "BFS finds the shortest path in an unweighted graph. Why doesn't it work for weighted graphs?",
          options: [
            "BFS uses too much memory for weighted graphs",
            "BFS treats all edges as equal weight, ignoring actual weights",
            "BFS cannot visit all nodes in a weighted graph",
            "BFS only works on directed graphs"
          ],
          answer: 1,
          explanation: `BFS minimizes the **number of edges** (hops), assuming each edge has weight 1. In a weighted graph, a path with fewer edges may have higher total weight. For example, a direct edge with weight 100 loses to two edges with weights 1 and 2. Dijkstra's algorithm handles weighted graphs by using a priority queue ordered by cumulative distance.`
        },
        {
          question: "What data structure does Kruskal's MST algorithm use to efficiently detect cycles?",
          options: ["Min-heap", "Adjacency matrix", "Disjoint Set Union (Union-Find)", "BFS queue"],
          answer: 2,
          explanation: `Kruskal's uses **Disjoint Set Union (DSU / Union-Find)** to check if two endpoints of an edge belong to the same component. If they do, adding the edge would create a cycle. DSU supports find and union operations in near O(1) amortized time with path compression and union by rank.`
        },
        {
          question: "A graph is bipartite if and only if it contains no odd-length cycles. How would you verify bipartiteness in O(V + E)?",
          answer: `Use **BFS or DFS with 2-coloring**:

~~~js
function isBipartite(graph, n) {
  const color = new Array(n).fill(-1);
  for (let start = 0; start < n; start++) {
    if (color[start] !== -1) continue;
    color[start] = 0;
    const queue = [start];
    while (queue.length) {
      const u = queue.shift();
      for (const v of graph[u] || []) {
        if (color[v] === -1) {
          color[v] = 1 - color[u]; // opposite color
          queue.push(v);
        } else if (color[v] === color[u]) {
          return false; // same color = odd cycle
        }
      }
    }
  }
  return true;
}
~~~

Time: O(V + E) — each node and edge is visited once.`
        },
        {
          question: "In DFS-based cycle detection for undirected graphs, why do you need to track the parent node?",
          options: [
            "To reconstruct the cycle path",
            "To avoid falsely flagging the edge you came from as a back edge",
            "To count the number of cycles",
            "To handle disconnected graphs"
          ],
          answer: 1,
          explanation: `In an undirected graph, every edge (u, v) appears as both u→v and v→u. When DFS visits v from u, it sees u as a neighbor of v — but that's the same edge, not a back edge. Without tracking the parent, you'd falsely report a cycle. You only report a cycle if you reach a visited node that is **not the direct parent**.`
        }
      ]
    },
    {
      id: "topological-sort",
      title: "Topological Sort",
      body: `## Topological Sort

A **topological ordering** of a directed graph is a linear ordering of vertices such that for every directed edge u → v, u comes before v. Only possible on **Directed Acyclic Graphs (DAGs)**.

### Why It Requires a DAG
If the graph has a cycle, there is no valid ordering — each node in the cycle depends on another node in the cycle, creating a circular dependency.

### Algorithm 1: Kahn's Algorithm (BFS-based)
1. Compute **in-degree** of every vertex.
2. Enqueue all vertices with in-degree 0.
3. While the queue is non-empty:
   - Dequeue a vertex u, add to result.
   - For each neighbor v of u, decrement in-degree of v. If in-degree of v becomes 0, enqueue v.
4. If result contains fewer than V vertices → cycle detected.

Time: O(V + E)

### Algorithm 2: DFS-based
1. Run DFS. After fully exploring all descendants of a node, **push it to a stack**.
2. The stack's reverse (pop order) is the topological order.

Time: O(V + E)

### Key Uses
- **Build systems**: compile files in dependency order
- **Package managers**: install packages before dependents
- **Task scheduling**: tasks with prerequisites
- **Course prerequisites**: determine valid course registration order

~~~js
// Kahn's Algorithm
function topoSort(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  const inDegree = new Array(n).fill(0);
  for (const [u, v] of edges) {
    adj[u].push(v);
    inDegree[v]++;
  }
  const queue = [];
  for (let i = 0; i < n; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }
  const result = [];
  while (queue.length) {
    const u = queue.shift();
    result.push(u);
    for (const v of adj[u]) {
      inDegree[v]--;
      if (inDegree[v] === 0) queue.push(v);
    }
  }
  if (result.length !== n) return null; // cycle detected
  return result;
}
~~~`,
      flashcards: [
        {
          front: "How does Kahn's algorithm detect a cycle during topological sort?",
          back: `If the graph has a cycle, the nodes in the cycle will never have their in-degree reach 0 (each waits for another in the cycle). So Kahn's algorithm will finish processing fewer than V nodes. **If result.length < V, a cycle exists.**`
        },
        {
          front: "What is the difference between Kahn's and DFS-based topological sort?",
          back: `**Kahn's (BFS)**:
- Uses in-degree counts and a queue
- Naturally detects cycles (result.length < V)
- Processes in BFS order — more intuitive for dependency resolution
- Easy to find all valid orderings

**DFS-based**:
- Pushes node to stack after recursing all neighbors
- Requires separate cycle detection (gray node coloring)
- Slightly more concise code

Both are O(V + E). Kahn's is generally preferred for explicit cycle detection.`
        },
        {
          front: "What real-world problem does topological sort solve?",
          back: `Topological sort solves **dependency ordering** problems:
- **Build systems** (Make, Gradle): compile A before B if B depends on A
- **Package managers** (npm, pip): install dependencies before the package
- **Course scheduling**: take prerequisites before advanced courses
- **Task scheduling**: order tasks with precedence constraints
- **Spreadsheet evaluation**: evaluate cells in dependency order`
        }
      ],
      quiz: [
        {
          question: "Which of the following is NOT a valid use case for topological sort?",
          options: [
            "Determining compilation order for source files",
            "Finding the shortest path in a weighted graph",
            "Resolving package installation order",
            "Scheduling tasks with prerequisite constraints"
          ],
          answer: 1,
          explanation: `**Shortest path** is not a topological sort use case — that's Dijkstra's or Bellman-Ford. Topological sort addresses **ordering with dependencies** (build systems, package managers, task scheduling). Note: topological sort CAN be used for shortest/longest path in a DAG, but finding shortest paths in general weighted graphs is a different problem.`
        },
        {
          question: "A DAG has 5 nodes and 4 edges. Kahn's algorithm processes only 3 nodes before the queue becomes empty. What does this indicate?",
          options: [
            "The graph is disconnected",
            "The graph contains a cycle",
            "The algorithm has a bug",
            "Two nodes have equal in-degree"
          ],
          answer: 1,
          explanation: `In Kahn's algorithm, if the result contains fewer than V nodes, it means some nodes never had their in-degree reach 0. This happens when those nodes are part of a **cycle** — each node in the cycle is waiting for a predecessor that is also waiting. However, 5 nodes with 4 edges can still form a cycle (e.g., a triangle plus two extra nodes).`
        },
        {
          question: "In the DFS-based topological sort, when exactly is a node added to the result?",
          options: [
            "When the node is first visited",
            "When all of the node's descendants have been fully explored",
            "When the node has no outgoing edges",
            "When the node's in-degree becomes zero"
          ],
          answer: 1,
          explanation: `In DFS topological sort, a node is pushed to the stack (added to result in reverse) **after all its descendants have been fully explored** (post-order). This ensures every node u appears before nodes it points to: when u is added, all nodes reachable from u are already on the stack below it.`
        },
        {
          question: "Describe how you would find the longest path in a DAG efficiently.",
          answer: `Use **topological sort + dynamic programming** in O(V + E):

1. Compute a topological ordering of the DAG.
2. Initialize dist[source] = 0, dist[all others] = -∞.
3. Process nodes in topological order. For each node u, for each edge u → v with weight w:
   - dist[v] = max(dist[v], dist[u] + w)
4. The answer is max(dist[v]) over all v.

~~~js
function longestPath(n, edges, source) {
  // Step 1: topological sort (Kahn's)
  const order = topoSort(n, edges);
  const dist = new Array(n).fill(-Infinity);
  dist[source] = 0;
  // Step 2: relax edges in topological order
  const adj = buildAdj(edges); // {u: [[v, w], ...]}
  for (const u of order) {
    if (dist[u] === -Infinity) continue;
    for (const [v, w] of adj[u] || []) {
      dist[v] = Math.max(dist[v], dist[u] + w);
    }
  }
  return Math.max(...dist);
}
~~~

This works in DAGs only — a general graph with cycles could have infinite-length paths.`
        }
      ]
    },
    {
      id: "dijkstra",
      title: "Dijkstra's Algorithm",
      body: `## Dijkstra's Algorithm

Dijkstra's algorithm finds the **single-source shortest paths** to all vertices in a graph with **non-negative edge weights**.

### Core Idea
Greedily settle the unvisited vertex with the smallest known distance from the source. Once settled, a vertex's distance is final (no shorter path can exist — because all weights are non-negative).

### Algorithm
1. Initialize dist[source] = 0, dist[all others] = ∞.
2. Push (0, source) into a min-heap.
3. While heap is non-empty:
   - Pop (d, u) with minimum distance.
   - If d > dist[u], skip (stale entry).
   - For each neighbor v of u with edge weight w:
     - If dist[u] + w < dist[v], update dist[v] and push (dist[v], v).
4. Return dist[].

### Complexity
- With a **binary min-heap**: O((V + E) log V)
- With a **Fibonacci heap**: O(E + V log V) — theoretically better for dense graphs but complex

### Why No Negative Edges?
With negative edges, a settled vertex's distance might later be reduced by a path through a not-yet-visited vertex. The greedy invariant breaks. Use **Bellman-Ford** instead for graphs with negative edges.

### Comparison

| Algorithm | Weights | Complexity | Notes |
|-----------|---------|-----------|-------|
| BFS | Unweighted | O(V + E) | Hop count only |
| Dijkstra | Non-negative | O((V+E) log V) | Greedy, single source |
| Bellman-Ford | Any (detect neg cycles) | O(VE) | Dynamic, slower |
| A* | Non-negative | O(E log V) guided | Uses heuristic, goal-directed |

### A* vs Dijkstra
A* adds a **heuristic h(v)** (estimated cost to goal) to prioritize exploration toward the target. When h(v) = 0, A* reduces to Dijkstra. A* is faster in practice for point-to-point shortest paths when a good heuristic is available.

~~~js
function dijkstra(graph, source, n) {
  // graph: Map<node, Array<[neighbor, weight]>>
  const dist = new Array(n).fill(Infinity);
  dist[source] = 0;
  // min-heap: [distance, node]
  const heap = new MinHeap();
  heap.push([0, source]);

  while (!heap.isEmpty()) {
    const [d, u] = heap.pop();
    if (d > dist[u]) continue; // stale
    for (const [v, w] of graph.get(u) || []) {
      const newDist = dist[u] + w;
      if (newDist < dist[v]) {
        dist[v] = newDist;
        heap.push([newDist, v]);
      }
    }
  }
  return dist;
}
~~~`,
      flashcards: [
        {
          front: "Why does Dijkstra's algorithm fail with negative edge weights?",
          back: `Dijkstra's relies on the **greedy invariant**: once a vertex is settled (popped from the heap), its distance is final. This holds only if all edge weights are non-negative — because no future path through unvisited nodes could reduce the distance.

With a negative edge, a later-discovered path could undercut an already-settled distance. Example: dist[u]=5 is settled, but there's a path source→v→u with weights 10 and -6 = total 4 < 5. Dijkstra misses this.

Use **Bellman-Ford** (relaxes all edges V-1 times) for graphs with negative edges.`
        },
        {
          front: "What is the time complexity of Dijkstra with a binary min-heap and why?",
          back: `**O((V + E) log V)**

- Each vertex is pushed/popped from the heap at most once in the optimal case: O(V log V)
- Each edge relaxation may push to the heap: O(E log V)
- Total: O((V + E) log V)

With a Fibonacci heap, decrease-key is O(1) amortized, giving O(E + V log V) — better for dense graphs (E >> V) but rarely used in practice due to high constants.`
        },
        {
          front: "What is the key difference between Dijkstra and A*?",
          back: `**Dijkstra** explores in order of actual cost from source — it finds optimal paths to ALL vertices.

**A*** adds a **heuristic h(v)** estimating remaining cost to the goal. It prioritizes nodes by f(v) = g(v) + h(v), where g(v) is the actual cost from source. This guides exploration toward the goal, skipping many irrelevant nodes.

Requirements for A* correctness: h must be **admissible** (never overestimates) and **consistent** (h(u) ≤ w(u,v) + h(v)).

A* is Dijkstra with h(v) = 0 as a special case.`
        }
      ],
      quiz: [
        {
          question: "What is the correct time complexity of Dijkstra's algorithm using a binary min-heap?",
          options: ["O(V²)", "O(E log V)", "O((V + E) log V)", "O(VE)"],
          answer: 2,
          explanation: `With a binary min-heap: each of the V vertices is extracted once (O(V log V)), and each of the E edges may trigger a heap push (O(E log V)). Combined: **O((V + E) log V)**. Note O(E log V) alone is the edge-processing cost but ignores vertex extractions. For sparse graphs E ≈ V, this simplifies to O(V log V).`
        },
        {
          question: "When would you use Bellman-Ford instead of Dijkstra?",
          options: [
            "When the graph is very large",
            "When the graph contains negative edge weights",
            "When you need shortest paths to only one destination",
            "When the graph is undirected"
          ],
          answer: 1,
          explanation: `**Bellman-Ford** handles **negative edge weights** by relaxing all edges V-1 times. It also detects **negative-weight cycles** (if a V-th relaxation still improves a distance, a negative cycle exists). The cost is O(VE), much slower than Dijkstra's O((V+E) log V), but necessary when negative edges are present (e.g., financial arbitrage modeling).`
        },
        {
          question: "In Dijkstra's implementation with a heap, why do we check 'if d > dist[u]: continue'?",
          options: [
            "To skip vertices with no outgoing edges",
            "To discard stale heap entries for vertices already settled with a shorter distance",
            "To handle disconnected graph components",
            "To prevent integer overflow"
          ],
          answer: 1,
          explanation: `In a lazy Dijkstra implementation, we don't delete-and-reinsert heap entries — we just push a new entry. This means a vertex can appear multiple times in the heap. When we pop (d, u), if d > dist[u], it means we already found a shorter path to u and processed it. This entry is **stale** — we skip it to avoid redundant processing.`
        },
        {
          question: "Explain when A* is preferable to Dijkstra and what makes a heuristic 'admissible'.",
          answer: `**When to use A***:
A* is preferable for **point-to-point shortest path** (single source to single destination) when a good heuristic is available. Examples: GPS navigation (Euclidean distance heuristic), game pathfinding.

Dijkstra explores all vertices up to the destination's distance, while A* uses the heuristic to bias exploration toward the goal, often examining far fewer nodes.

**Admissible heuristic**:
A heuristic h(v) is admissible if it **never overestimates** the true cost to the goal:
\`h(v) ≤ actual_cost(v, goal)\` for all v.

Example: Euclidean distance is admissible for road networks (straight-line ≤ actual road distance).

If h overestimates, A* may return a suboptimal path. If h = 0 everywhere, A* degenerates to Dijkstra (still correct, not faster).

A stronger condition is **consistency** (monotonicity): h(u) ≤ w(u,v) + h(v), which implies admissibility and guarantees each node is processed at most once.`
        },
        {
          question: "You run Dijkstra from node 0 on a graph with edges: 0→1 (w=4), 0→2 (w=1), 2→1 (w=2). What is the shortest distance from 0 to 1?",
          options: ["4", "3", "2", "1"],
          answer: 1,
          explanation: `Direct path 0→1 has cost **4**. Alternative: 0→2 (cost 1) → 1 (cost 2) = total **3**. Dijkstra will find dist[2]=1 first, then relax the 2→1 edge to get dist[1]=3, which is less than the direct 4. Final answer: **3**.`
        }
      ]
    },
    {
      id: "dynamic-programming",
      title: "Dynamic Programming",
      body: `## Dynamic Programming

Dynamic Programming (DP) solves problems by breaking them into overlapping subproblems and storing solutions to avoid redundant computation. It applies when two conditions hold:

### Prerequisites
1. **Optimal Substructure**: The optimal solution to the problem contains optimal solutions to subproblems.
2. **Overlapping Subproblems**: The same subproblems are solved multiple times (unlike divide-and-conquer where subproblems are independent).

### Approaches

**Top-Down (Memoization)**:
- Write the recursive solution, cache results.
- Natural to reason about, only computes needed subproblems.
- Risk: deep recursion → stack overflow.

**Bottom-Up (Tabulation)**:
- Fill a table iteratively from base cases up.
- Better space control (can often compress to 1D).
- No recursion overhead.

### How to Design a DP Solution
1. **Define the state**: What does dp[i] or dp[i][j] represent?
2. **Write the recurrence**: How does dp[i] depend on smaller states?
3. **Identify base cases**.
4. **Determine the answer**: Which state holds the final result?

### Classic Examples

**0/1 Knapsack** — dp[i][w] = max value using first i items with capacity w.
Recurrence: dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])
Time: O(nW), Space: O(nW) → O(W) with rolling array.

**Longest Increasing Subsequence (LIS)** — dp[i] = length of LIS ending at index i.
Recurrence: dp[i] = 1 + max(dp[j]) for all j < i where arr[j] < arr[i].
Time: O(n²) naive; O(n log n) with patience sorting.

**Edit Distance** — dp[i][j] = min edits to convert s1[0..i] to s2[0..j].
Recurrence: if s1[i]==s2[j]: dp[i][j]=dp[i-1][j-1], else dp[i][j]=1+min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).

~~~js
// LIS - O(n^2)
function lis(arr) {
  const n = arr.length;
  const dp = new Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[j] < arr[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  return Math.max(...dp);
}

// Edit Distance - O(mn)
function editDistance(s1, s2) {
  const m = s1.length, n = s2.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0)
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i-1] === s2[j-1]) dp[i][j] = dp[i-1][j-1];
      else dp[i][j] = 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }
  return dp[m][n];
}
~~~`,
      flashcards: [
        {
          front: "What are the two necessary conditions for Dynamic Programming to apply?",
          back: `1. **Optimal Substructure**: The optimal solution contains optimal solutions to subproblems. You can build up the global optimum from locally optimal decisions.

2. **Overlapping Subproblems**: The same subproblems recur multiple times. Without this, plain recursion or divide-and-conquer is sufficient — DP's caching provides no benefit.

Both must hold. For example, the shortest path problem has optimal substructure, and Fibonacci has overlapping subproblems. DP works when both are present.`
        },
        {
          front: "What is the difference between memoization and tabulation?",
          back: `**Memoization (top-down)**:
- Write recursive solution, cache results in a map/array
- Only computes subproblems that are actually needed
- More natural to derive from the recursive definition
- Risk of stack overflow for deep recursion

**Tabulation (bottom-up)**:
- Iteratively fill a table starting from base cases
- Computes all subproblems in a fixed order
- Better cache performance, no recursion overhead
- Easier to optimize space (rolling arrays)

Both have the same asymptotic complexity for the same problem.`
        },
        {
          front: "How do you reduce the space complexity of the 0/1 Knapsack DP from O(nW) to O(W)?",
          back: `Use a **1D rolling array**. The 2D recurrence dp[i][w] only depends on dp[i-1][...], so we can reuse a single array if we iterate weights in **reverse order**:

~~~js
function knapsack(weights, values, W) {
  const dp = new Array(W + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    for (let w = W; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }
  return dp[W];
}
~~~

Iterating w from W down to weights[i] ensures we use dp[w - weights[i]] from the **previous** item's row, not the current one.`
        }
      ],
      quiz: [
        {
          question: "Which problem does NOT exhibit optimal substructure suitable for DP?",
          options: [
            "Shortest path in a weighted DAG",
            "Longest increasing subsequence",
            "Longest path in a general graph with cycles",
            "Edit distance between two strings"
          ],
          answer: 2,
          explanation: `The **longest path in a general graph with cycles** does NOT have optimal substructure in the DP sense — cycles create infinite paths, and subpaths of the longest path are not necessarily the longest paths between their endpoints (the longest path between two intermediate nodes might exit the chosen path and re-enter). DP on graphs only works cleanly for DAGs.`
        },
        {
          question: "The naive recursive Fibonacci has exponential time complexity. What is the complexity after memoization?",
          options: ["O(n²)", "O(n log n)", "O(n)", "O(2^n)"],
          answer: 2,
          explanation: `With memoization, each Fibonacci value fib(k) is computed exactly **once** and cached. There are n distinct subproblems (fib(0) through fib(n)), each taking O(1) to compute given its dependencies. Total: **O(n)** time and O(n) space (for the cache). Without memoization, the recursion tree has exponential branching: O(2^n).`
        },
        {
          question: "In the edit distance problem, what does dp[i][j] represent?",
          options: [
            "The number of characters matched up to position i and j",
            "The minimum number of operations to convert s1[0..i-1] to s2[0..j-1]",
            "Whether s1[0..i] equals s2[0..j]",
            "The longest common subsequence length up to i and j"
          ],
          answer: 1,
          explanation: `dp[i][j] = **minimum edit distance** (insertions, deletions, substitutions) to transform the first i characters of s1 into the first j characters of s2. Base cases: dp[0][j]=j (insert j chars), dp[i][0]=i (delete i chars). The recurrence handles match (dp[i-1][j-1]), substitution (1+dp[i-1][j-1]), insertion (1+dp[i][j-1]), and deletion (1+dp[i-1][j]).`
        },
        {
          question: "Explain the difference between the 0/1 Knapsack and the Unbounded Knapsack problems and how the DP changes.",
          answer: `**0/1 Knapsack**: Each item can be taken **at most once**.
- dp[i][w] = max value using items 1..i with capacity w
- Transition: dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt[i]] + val[i])
- When using rolling 1D array: iterate w **from W down to wt[i]** (prevents using item i twice)

**Unbounded Knapsack**: Each item can be taken **any number of times**.
- dp[w] = max value achievable with capacity w
- Transition: dp[w] = max over all items i: dp[w-wt[i]] + val[i]
- When using rolling 1D array: iterate w **from wt[i] up to W** (allows reusing item i)

Key insight: the direction of iteration in the 1D optimization determines whether an item is used once (reverse) or multiple times (forward).

~~~js
// Unbounded Knapsack
function unboundedKnapsack(weights, values, W) {
  const dp = new Array(W + 1).fill(0);
  for (let w = 1; w <= W; w++) {
    for (let i = 0; i < weights.length; i++) {
      if (weights[i] <= w) {
        dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
      }
    }
  }
  return dp[W];
}
~~~`
        },
        {
          question: "What is the O(n log n) approach to computing the Longest Increasing Subsequence?",
          options: [
            "Use a segment tree to query maximum dp values in O(log n)",
            "Use binary search on a maintained list of LIS tail elements (patience sorting)",
            "Sort the array and compute LCS with the original",
            "Use divide and conquer to split the array at midpoints"
          ],
          answer: 1,
          explanation: `The O(n log n) LIS algorithm maintains a list \`tails\` where tails[i] is the **smallest tail element** of all increasing subsequences of length i+1. For each element x, binary search for the leftmost position in tails where tails[pos] >= x and replace tails[pos] with x (or append if x is larger than all). The length of tails at the end is the LIS length. This is the **patience sorting** technique.`
        }
      ]
    },
    {
      id: "greedy-algorithms",
      title: "Greedy Algorithms",
      body: `## Greedy Algorithms

A greedy algorithm makes the **locally optimal choice** at each step, hoping to reach the global optimum. Unlike DP, it never reconsiders past decisions.

### When Does Greedy Work?
Greedy is correct when the problem has:
1. **Greedy choice property**: A globally optimal solution can be constructed by making locally optimal (greedy) choices.
2. **Optimal substructure**: After a greedy choice, the remaining subproblem has an optimal substructure.

**Proof techniques**:
- **Exchange argument**: Show that any solution can be transformed into the greedy solution without getting worse.
- **Matroid theory**: Problems over matroids (e.g., MST) always have correct greedy solutions.

### Classic Examples

**Interval Scheduling (Activity Selection)**:
Goal: Select the maximum number of non-overlapping intervals.
Greedy: Sort by **end time**, greedily pick each interval that starts after the previous one ends.
Time: O(n log n). This is optimal by exchange argument.

**Huffman Coding**:
Goal: Assign variable-length binary codes to minimize total encoding length.
Greedy: Repeatedly merge the two lowest-frequency nodes. Uses a min-heap.
Time: O(n log n). Produces provably optimal prefix-free code.

**Dijkstra / Prim / Kruskal** are all greedy algorithms that work due to underlying matroid/cut properties.

### Greedy vs DP

| | Greedy | DP |
|--|--------|-----|
| Decisions | Make one, move on | Consider all options |
| Reconsideration | Never | Implicitly via table |
| Speed | Usually faster | Polynomial (may be slower) |
| When correct | With greedy-choice property | With optimal substructure + overlapping subproblems |
| Example | Interval scheduling | 0/1 Knapsack |

**Fractional Knapsack** → Greedy works (take highest value/weight ratio items first).
**0/1 Knapsack** → Greedy fails; need DP.

~~~js
// Interval Scheduling - maximize non-overlapping intervals
function intervalScheduling(intervals) {
  // Sort by end time
  intervals.sort((a, b) => a[1] - b[1]);
  let count = 0;
  let lastEnd = -Infinity;
  for (const [start, end] of intervals) {
    if (start >= lastEnd) {
      count++;
      lastEnd = end;
    }
  }
  return count;
}

// Fractional Knapsack
function fractionalKnapsack(items, W) {
  // items: [{weight, value}]
  items.sort((a, b) => (b.value / b.weight) - (a.value / a.weight));
  let totalValue = 0, remaining = W;
  for (const item of items) {
    if (remaining <= 0) break;
    const take = Math.min(item.weight, remaining);
    totalValue += take * (item.value / item.weight);
    remaining -= take;
  }
  return totalValue;
}
~~~`,
      flashcards: [
        {
          front: "What is the 'exchange argument' used to prove greedy algorithms correct?",
          back: `The exchange argument proves greedy correctness by showing you can transform any optimal solution into the greedy solution without increasing cost:

1. Take an arbitrary optimal solution OPT.
2. Find the first point where OPT differs from the greedy solution.
3. Show you can **swap** OPT's choice with the greedy choice without worsening the solution.
4. Repeat until OPT equals the greedy solution.

This proves the greedy solution is at least as good as any optimal solution, hence optimal itself.

Example: In interval scheduling, if OPT picks interval A (ends at time 5) and greedy picks B (ends at time 3), swapping A for B can only give more room for future intervals.`
        },
        {
          front: "Why does greedy work for fractional knapsack but not 0/1 knapsack?",
          back: `**Fractional knapsack**: You can take any fraction of an item. The greedy choice — always take the item with the highest value/weight ratio — is optimal because you can fill remaining capacity with fractions. No "future regret" about taking too much of one item.

**0/1 Knapsack**: Items are all-or-nothing. Taking the highest ratio item now might leave an awkward remaining capacity that lower-ratio items can't fill well. The local optimum doesn't guarantee the global optimum.

Example: Capacity=10, items [(weight=9, value=9), (weight=5, value=6), (weight=5, value=6)].
Greedy takes item 1 (ratio 1.0), gets 9.
DP takes items 2+3, gets 12. Greedy fails.`
        },
        {
          front: "What sorting criterion does interval scheduling use, and why not sort by start time?",
          back: `**Sort by end time** (earliest deadline first).

Sorting by end time is correct because picking the interval that finishes earliest **leaves the most room** for future intervals. This can be proven by exchange argument.

Sorting by start time fails: an interval starting earliest might span the entire timeline, blocking all others.

Sorting by duration fails: a short interval might start late and block many shorter intervals that start earlier.

Sorting by end time is the unique criterion that works.`
        }
      ],
      quiz: [
        {
          question: "You need to schedule the maximum number of non-overlapping meetings. What is the correct greedy strategy?",
          options: [
            "Sort meetings by start time, pick the earliest starting non-overlapping meeting",
            "Sort meetings by duration, pick the shortest non-overlapping meeting",
            "Sort meetings by end time, pick the earliest ending non-overlapping meeting",
            "Sort meetings by start time and pick the latest starting non-overlapping meeting"
          ],
          answer: 2,
          explanation: `**Sort by end time and pick the earliest ending non-overlapping interval.** This greedy choice is provably optimal via exchange argument: by always finishing as early as possible, we maximize the time available for remaining meetings. Sorting by start time or duration does not yield an optimal solution in all cases.`
        },
        {
          question: "Huffman coding builds an optimal prefix-free code. What data structure drives the algorithm?",
          options: ["Stack", "Queue", "Min-heap (priority queue)", "Balanced BST"],
          answer: 2,
          explanation: `Huffman coding uses a **min-heap** (priority queue) to repeatedly extract the two nodes with the smallest frequency and merge them into a new internal node with combined frequency. The merged node is re-inserted. After n-1 merges, the root of the Huffman tree is the result. Min-heap extraction is O(log n), and we do O(n) merges: total O(n log n).`
        },
        {
          question: "Which of the following problems cannot be solved optimally with a greedy algorithm?",
          options: [
            "Finding the MST of a weighted graph",
            "Activity selection (maximize non-overlapping intervals)",
            "0/1 Knapsack",
            "Huffman encoding"
          ],
          answer: 2,
          explanation: `**0/1 Knapsack** requires DP. The greedy approach (take highest value/weight ratio first) fails because items are indivisible — taking a high-ratio item may leave capacity that no combination of remaining items can fill optimally. MST (Kruskal/Prim), activity selection, and Huffman coding all have provably correct greedy solutions.`
        },
        {
          question: "Describe a scenario where greedy gives a suboptimal answer and explain why DP is needed.",
          answer: `**Example: Coin Change Problem**

Given coins [1, 3, 4] and target amount 6:
- Greedy (largest coin first): picks 4, then 1, then 1 → 3 coins
- Optimal: picks 3, then 3 → **2 coins**

Greedy fails because choosing the largest coin locally does not lead to the globally minimum number of coins. The problem lacks the greedy-choice property for arbitrary coin denominations.

**DP solution**:
~~~js
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
~~~

DP works because the problem has **optimal substructure** (minimum coins for amount i uses minimum coins for amount i-coin) and **overlapping subproblems** (same sub-amounts computed repeatedly).`
        }
      ]
    },
    {
      id: "recursion-vs-iteration",
      title: "Recursion vs Iteration",
      body: `## Recursion vs Iteration

Recursion and iteration are two approaches to repetitive computation. Every recursive algorithm can be converted to an iterative one (and vice versa), but each has distinct tradeoffs.

### Recursion
A function calls itself with a smaller input. The call stack implicitly maintains state.

**Strengths**:
- Naturally expresses tree/graph traversal, divide-and-conquer, backtracking
- Code is often cleaner and closer to the mathematical definition
- No explicit stack management

**Weaknesses**:
- **Stack overflow** for deep recursion (default stack ~1MB; ~10k–100k frames)
- Function call overhead (frame allocation, register save/restore)
- Harder to analyze space usage

### Call Stack
Each recursive call creates a **stack frame** containing local variables, parameters, and the return address. Deep recursion (e.g., recursing on a linked list of 10^6 nodes) overflows the stack.

### Tail Recursion
A recursive call is **tail-recursive** if it is the last operation before returning — no computation happens after the recursive call returns. Many compilers/runtimes optimize this to reuse the current frame (TCO — tail call optimization). JavaScript engines generally do NOT perform TCO in practice.

~~~js
// Not tail-recursive (multiplies after return)
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // multiply AFTER call returns
}

// Tail-recursive (accumulator pattern)
function factorialTail(n, acc = 1) {
  if (n <= 1) return acc;
  return factorialTail(n - 1, n * acc); // call IS the last action
}
~~~

### Converting Recursion to Iteration
Use an **explicit stack** to simulate the call stack:

~~~js
// Recursive DFS
function dfsRecursive(graph, start, visited = new Set()) {
  visited.add(start);
  for (const neighbor of graph[start] || []) {
    if (!visited.has(neighbor)) dfsRecursive(graph, neighbor, visited);
  }
}

// Iterative DFS with explicit stack
function dfsIterative(graph, start) {
  const visited = new Set();
  const stack = [start];
  while (stack.length) {
    const node = stack.pop();
    if (visited.has(node)) continue;
    visited.add(node);
    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) stack.push(neighbor);
    }
  }
}
~~~

### When to Prefer Each

| Use Recursion | Use Iteration |
|--------------|--------------|
| Tree/graph traversal (small–medium) | Deep traversal (risk of overflow) |
| Backtracking | Performance-critical loops |
| Divide-and-conquer (mergesort) | Tail-recursive patterns (accumulator loops) |
| Naturally recursive structure | When stack space is constrained |`,
      flashcards: [
        {
          front: "What is tail recursion and why does it matter?",
          back: `**Tail recursion**: A recursive call where the recursive call is the **last action** of the function — the return value of the recursive call is directly returned with no further computation.

**Why it matters**: Tail-call optimization (TCO) allows the compiler/runtime to reuse the current stack frame instead of creating a new one. This converts recursion into a loop in O(1) space instead of O(n) stack space.

**Caveat**: Most JavaScript engines do not implement TCO (except Safari's JavaScriptCore). In practice, convert tail recursion to an explicit loop if stack depth is a concern.`
        },
        {
          front: "How do you convert a recursive DFS into an iterative one?",
          back: `Replace the **implicit call stack** with an **explicit stack** data structure:

1. Push the initial node onto the stack.
2. While the stack is non-empty:
   a. Pop the top node.
   b. If already visited, skip.
   c. Mark as visited and process.
   d. Push all unvisited neighbors onto the stack.

Key difference from BFS: BFS uses a **queue** (FIFO), DFS uses a **stack** (LIFO). Both use the same explicit data structure pattern to avoid recursion.`
        },
        {
          front: "What causes a stack overflow in recursive programs and how can you prevent it?",
          back: `**Cause**: Each recursive call creates a new stack frame. The call stack has a fixed size (~1–8 MB). Deeply recursive calls (e.g., recursing on a 10^6 element array) exhaust the stack.

**Prevention strategies**:
1. **Convert to iteration** with an explicit stack (heap-allocated, much larger)
2. **Increase stack size** (language/OS-specific, not always possible)
3. **Use tail recursion** (with TCO-supporting runtimes)
4. **Trampolining**: instead of calling recursively, return a thunk (function) and call it in a loop
5. **Memoize with iteration (bottom-up DP)** instead of top-down memoization`
        }
      ],
      quiz: [
        {
          question: "Which of the following is a tail-recursive function?",
          options: [
            "function sum(n) { return n + sum(n-1); }",
            "function sum(n, acc=0) { if (n===0) return acc; return sum(n-1, acc+n); }",
            "function fib(n) { return fib(n-1) + fib(n-2); }",
            "function pow(b, e) { return b * pow(b, e-1); }"
          ],
          answer: 1,
          explanation: `Option B is tail-recursive: the recursive call \`sum(n-1, acc+n)\` is the **last operation** — nothing is computed after it returns. Option A computes \`n + ...\` after the call returns. Option C and D both compute something (+ or *) using the recursive return value. The key marker is: if the return value is **directly** the recursive call with no pending operation, it's tail-recursive.`
        },
        {
          question: "What is the main runtime risk of using recursion for very deep call stacks in JavaScript?",
          options: [
            "Memory leak from closures",
            "Stack overflow (RangeError: Maximum call stack size exceeded)",
            "Infinite loop due to missing base case",
            "Garbage collection pauses"
          ],
          answer: 1,
          explanation: `Deep recursion causes **stack overflow** — in JavaScript this throws a \`RangeError: Maximum call stack size exceeded\`. The default call stack can hold roughly 10,000–15,000 frames in V8. For algorithms that recurse on large inputs (e.g., DFS on a path-shaped graph of 100,000 nodes), this is a real problem. The fix is to convert to iterative with an explicit stack.`
        },
        {
          question: "Why is iterative BFS always preferred over recursive BFS?",
          options: [
            "Recursive BFS has worse time complexity",
            "BFS explores level by level and requires a queue; recursion naturally uses a stack, making recursive BFS awkward and deep",
            "BFS cannot be implemented recursively",
            "Iterative BFS uses less memory in all cases"
          ],
          answer: 1,
          explanation: `BFS naturally requires a **queue** (FIFO) for level-by-level exploration. Recursion uses the **call stack** (LIFO), which mirrors DFS behavior. Implementing BFS recursively would require manually passing the queue between calls and is unnatural. Iterative BFS with an explicit queue is the idiomatic, clean approach.`
        },
        {
          question: "Convert this recursive function to an iterative one using an explicit stack.",
          answer: `Original recursive function (tree postorder traversal):

~~~js
function postorder(node, result = []) {
  if (!node) return result;
  postorder(node.left, result);
  postorder(node.right, result);
  result.push(node.val);
  return result;
}
~~~

Iterative version with explicit stack:

~~~js
function postorderIterative(root) {
  if (!root) return [];
  const result = [];
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    result.unshift(node.val); // prepend (reverse of preorder)
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }
  return result;
}
~~~

**Strategy**: Postorder (left, right, root) is the reverse of a modified preorder (root, right, left). Push root, right, left — process root first and prepend to result. This avoids the complexity of tracking which children have been visited.

For a true iterative postorder, you can also use a two-stack approach or track a \`prev\` pointer to know when to visit the current node.`
        },
        {
          question: "What is 'trampolining' and when would you use it?",
          options: [
            "A technique to parallelize recursive calls",
            "A way to convert recursive calls into returned functions and execute them in a loop, avoiding stack growth",
            "A memoization technique that caches recursive results",
            "An optimization that inlines recursive calls"
          ],
          answer: 1,
          explanation: `**Trampolining** is a technique that enables recursion without stack growth in languages without TCO:

Instead of calling a function recursively, return a **thunk** (a zero-argument function). A trampoline loop repeatedly calls the returned thunk until a final value is returned:

~~~js
function trampoline(fn) {
  return function(...args) {
    let result = fn(...args);
    while (typeof result === 'function') result = result();
    return result;
  };
}

const factorial = trampoline(function f(n, acc = 1) {
  if (n <= 1) return acc;
  return () => f(n - 1, n * acc); // return thunk instead of calling
});
~~~

Useful in JavaScript where TCO is not reliable, and you need deep tail-recursive computations without stack overflow.`
        }
      ]
    }
  ]
}
