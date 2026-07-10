export default {
  id: "data-structures",
  title: "Data Structures",
  subchapters: [
    {
      id: "arrays-strings",
      title: "Arrays and Strings",
      body: `Arrays store elements in contiguous memory; strings are typically immutable arrays of characters.

| Operation | Array | Notes |
|-----------|-------|-------|
| Access    | O(1)  | By index |
| Search    | O(n)  | Linear scan |
| Insert/Delete (end) | O(1) amortized | Append |
| Insert/Delete (middle) | O(n) | Shift elements |

Strings in most languages are **immutable** — concatenation in a loop is O(n²); use a buffer/array and join at the end.`,
      quizTitle: "Brain teasers",
      flashcards: [
        {
          front: "Time complexity of inserting at the beginning of an array?",
          back: `**O(n)** — every existing element must shift one position to the right.`
        },
        {
          front: "Why is string concatenation in a loop O(n²)?",
          back: `Each concatenation creates a new string and copies all previous characters. After k iterations you've copied 1+2+…+k = O(k²) characters total.`
        },
        {
          front: "When should you prefer a char array over a string?",
          back: `When doing many in-place modifications — strings are immutable in Java/Python/JS, so each change allocates a new string. A char array lets you mutate in O(1) per character.`
        }
      ],
      quiz: [
        {
          question: "What is the time complexity of accessing the last element of a dynamic array (e.g. Python list) after appending n elements?",
          options: [
            "O(1)",
            "O(log n)",
            "O(n)",
            "O(n²)"
          ],
          answer: 0,
          explanation: `Array access by index is always **O(1)** regardless of position. The last element is simply at index n-1 in memory.`
        },
        {
          question: "You need to reverse a string in-place. What is the best approach and its time complexity?",
          answer: `Use two pointers — one at the start, one at the end — and swap characters moving inward until they meet.

~~~python
def reverse(s):
    s = list(s)
    l, r = 0, len(s) - 1
    while l < r:
        s[l], s[r] = s[r], s[l]
        l += 1; r -= 1
    return ''.join(s)
~~~

**Time:** O(n) — each element is visited once.
**Space:** O(1) extra (if truly in-place on a char array); O(n) if you must convert a string to a list first.`
        },
        {
          question: "Given an array of n integers, how do you find all pairs that sum to a target T — what is the optimal time complexity?",
          options: [
            "O(n²) with nested loops",
            "O(n log n) with sorting + two pointers",
            "O(n) with a hash set",
            "Both B and C achieve O(n) but B uses less space"
          ],
          answer: 2,
          explanation: `A hash set gives **O(n)** time and O(n) space: for each element x, check if T-x is already in the set.
Sorting + two pointers is **O(n log n)** time, O(1) extra space — better when memory is tight but not faster asymptotically.`
        },
        {
          question: "You build a result string by doing: result = '' followed by result += char in a loop of n iterations in Python. What is the total time complexity and why is it a problem?",
          answer: `**O(n²)** total time. Python strings are immutable, so each += creates a brand-new string and copies all previous characters into it.

After k iterations you've copied 1 + 2 + … + k ≈ k²/2 characters — quadratic growth.

**Fix:** collect characters in a list and call \`''.join(chars)\` at the end — O(n) total.`
        },
        {
          question: "What does it mean for a dynamic array to have O(1) amortized append?",
          answer: `When the backing array is full, it doubles in capacity and copies all elements — that copy costs O(n). But this doubling happens rarely.

Over n appends: total copies = n/2 + n/4 + … + 1 < n. So the *average* cost per append is O(1). This is "amortized O(1)" — individual operations may spike but the average over all operations is constant.`
        },
        {
          question: "Which operation is NOT O(1) on a standard array?",
          options: [
            "Reading element at index i",
            "Writing element at index i",
            "Removing the element at index 0",
            "Reading the length"
          ],
          answer: 2,
          explanation: `Removing from index 0 requires shifting all n-1 remaining elements left — that is **O(n)**. Read, write, and length are all O(1).`
        }
      ]
    },
    {
      id: "hash-maps-sets",
      title: "Hash Maps and Sets",
      body: `A hash map stores key-value pairs; a hash set stores unique keys. Both use a hash function to map keys to buckets.

| Operation | Average | Worst |
|-----------|---------|-------|
| Insert    | O(1)    | O(n)  |
| Delete    | O(1)    | O(n)  |
| Lookup    | O(1)    | O(n)  |

Worst case occurs with many hash collisions (rare with a good hash function). **Use hash maps** to trade space for time — turning O(n) lookups into O(1).`,
      quizTitle: "Brain teasers",
      flashcards: [
        {
          front: "Average vs worst-case lookup in a hash map?",
          back: `**Average O(1)**, worst case **O(n)** due to hash collisions causing all keys to land in the same bucket.`
        },
        {
          front: "When would you use a hash set over a hash map?",
          back: `When you only need to track *existence* (membership), not associated values. E.g., detecting duplicates, visited nodes in a graph, or complement lookups in two-sum.`
        },
        {
          front: "What makes a good hash function?",
          back: `It should distribute keys **uniformly** across buckets (minimizing collisions), be **deterministic**, and run in O(1). Poor distributions degrade performance to O(n).`
        }
      ],
      quiz: [
        {
          question: "What is the classic O(n) solution for 'Two Sum' (find two indices that add to target)?",
          answer: `Use a hash map storing {\`value: index\`} as you iterate. For each element x, check if \`target - x\` is already in the map.

~~~python
def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        complement = target - x
        if complement in seen:
            return [seen[complement], i]
        seen[x] = i
~~~

**One pass, O(n) time, O(n) space.**`
        },
        {
          question: "Why might a hash map degrade to O(n) per operation in the worst case?",
          options: [
            "The array backing the map is full",
            "All keys hash to the same bucket (hash collision)",
            "The map exceeds its load factor",
            "The keys are not integers"
          ],
          answer: 1,
          explanation: `When all keys collide into one bucket, lookup must scan a linked list of length n — giving **O(n)**. A good hash function and rehashing strategy keep this rare. Exceeding the load factor triggers a rehash (expensive but keeps future ops O(1)).`
        },
        {
          question: "You have an array of strings. Find all groups of anagrams. What is the optimal approach?",
          answer: `Sort each string's characters to get a canonical key, then group by that key in a hash map.

~~~python
from collections import defaultdict
def group_anagrams(words):
    groups = defaultdict(list)
    for w in words:
        groups[tuple(sorted(w))].append(w)
    return list(groups.values())
~~~

**Time:** O(n · k log k) where k is max word length (sorting each word).
**Space:** O(n·k) for the map.`
        },
        {
          question: "Given a hash map with a load factor of 0.75, what happens when it is exceeded?",
          options: [
            "Lookups start returning None",
            "The map throws an overflow error",
            "The map rehashes into a larger backing array",
            "Old entries are evicted"
          ],
          answer: 2,
          explanation: `When entries / buckets > 0.75, the map typically doubles its bucket array and **rehashes** all existing entries. This is O(n) but amortized over many insertions it keeps the average insert at O(1).`
        },
        {
          question: "Can you use a mutable list as a hash map key in Python? Why or why not?",
          answer: `**No.** Python requires hash map keys to be **hashable** (immutable). Lists are mutable and not hashable — Python will raise a \`TypeError\`.

Use a **tuple** instead: tuples are immutable and hashable.

~~~python
d = {}
d[[1,2]] = "x"   # TypeError: unhashable type: 'list'
d[(1,2)] = "x"   # OK
~~~`
        },
        {
          question: "What is the space complexity of storing a hash map with n entries?",
          options: [
            "O(1)",
            "O(log n)",
            "O(n)",
            "O(n²)"
          ],
          answer: 2,
          explanation: `Each entry (key + value) is stored, so space grows linearly: **O(n)**. The backing array may be larger than n but by at most a constant factor (load factor), so it is still O(n).`
        }
      ]
    },
    {
      id: "trees-graphs",
      title: "Trees and Graphs",
      body: `A **tree** is a connected acyclic graph. A **binary tree** has at most 2 children per node. A **BST** keeps left < root < right.

| Operation (BST, balanced) | Time |
|---------------------------|------|
| Search / Insert / Delete  | O(log n) |
| Search / Insert / Delete (unbalanced) | O(n) |
| Traversal (any) | O(n) |

Graphs: V vertices, E edges. Represented as adjacency list (O(V+E) space) or matrix (O(V²) space).`,
      quizTitle: "Brain teasers",
      flashcards: [
        {
          front: "BST search: balanced vs unbalanced worst case?",
          back: `**Balanced:** O(log n) — height is log n.
**Unbalanced (degenerate/linked list):** O(n) — height is n.`
        },
        {
          front: "Adjacency list vs adjacency matrix — when to use each?",
          back: `**List:** O(V+E) space, good for sparse graphs. Most real-world graphs.
**Matrix:** O(V²) space, O(1) edge lookup, good for dense graphs or when you need fast edge existence checks.`
        },
        {
          front: "What is the height of a perfectly balanced binary tree with n nodes?",
          back: `**O(log n)** — each level doubles the number of nodes, so log₂(n) levels are needed to hold n nodes.`
        }
      ],
      quiz: [
        {
          question: "What is the difference between a Binary Tree and a Binary Search Tree?",
          answer: `A **Binary Tree** is any tree where each node has at most 2 children — no ordering constraint.

A **Binary Search Tree (BST)** adds an ordering invariant: for every node, all values in its **left subtree < node value < right subtree**. This enables O(log n) search on a balanced BST instead of O(n).`
        },
        {
          question: "In a BST, what is the in-order traversal sequence?",
          options: [
            "Random order",
            "Sorted ascending order",
            "Sorted descending order",
            "Level by level"
          ],
          answer: 1,
          explanation: `In-order traversal visits left → root → right. Because BST enforces left < root < right, this yields elements in **sorted ascending order** — a useful property for problems requiring sorted output.`
        },
        {
          question: "How would you detect a cycle in a directed graph?",
          answer: `Use **DFS with a 'recursion stack' (gray/white/black coloring)**:
- White = unvisited, Gray = in current DFS path, Black = fully processed.
- If DFS reaches a **gray** node, you found a back edge — cycle detected.

~~~python
def has_cycle(graph):
    color = {}
    def dfs(u):
        color[u] = 'gray'
        for v in graph.get(u, []):
            if color.get(v) == 'gray': return True
            if color.get(v) != 'black' and dfs(v): return True
        color[u] = 'black'
        return False
    return any(dfs(u) for u in graph if u not in color)
~~~`
        },
        {
          question: "A binary tree has n nodes. What is the maximum and minimum possible height?",
          answer: `**Minimum height (balanced):** O(log n) — each level is fully packed, so about log₂(n) levels.

**Maximum height (degenerate):** O(n) — a tree where every node has only one child is essentially a linked list of length n.

This is why balancing (AVL, Red-Black) matters: it guarantees O(log n) height.`
        },
        {
          question: "Given a sorted array, construct a height-balanced BST. What is the key insight?",
          answer: `Always pick the **middle element** of the current range as the root. This ensures left and right subtrees have equal (±1) sizes.

~~~python
def sorted_array_to_bst(nums):
    if not nums: return None
    mid = len(nums) // 2
    node = TreeNode(nums[mid])
    node.left  = sorted_array_to_bst(nums[:mid])
    node.right = sorted_array_to_bst(nums[mid+1:])
    return node
~~~

**Time:** O(n) — each element visited once.`
        },
        {
          question: "How many edges does a tree with n nodes have?",
          options: [
            "n",
            "n - 1",
            "n + 1",
            "2n"
          ],
          answer: 1,
          explanation: `A tree with n nodes always has exactly **n - 1 edges**. This follows from the definition: a tree is a connected acyclic graph, and adding any edge would create a cycle.`
        }
      ]
    },
    {
      id: "bfs-dfs",
      title: "BFS / DFS",
      body: `Both BFS and DFS explore all nodes/edges of a graph: **O(V + E)** time and space.

| | BFS | DFS |
|--|-----|-----|
| Data structure | Queue | Stack (or recursion) |
| Finds shortest path? | Yes (unweighted) | No |
| Memory | O(max width) | O(max depth) |
| Best for | Shortest path, level order | Cycle detection, topological sort, connected components |

BFS explores layer by layer; DFS dives deep before backtracking.`,
      quizTitle: "Brain teasers",
      flashcards: [
        {
          front: "BFS vs DFS for shortest path in an unweighted graph?",
          back: `**BFS** guarantees shortest path in an unweighted graph because it explores nodes level by level (by distance). DFS may find a path but not the shortest one.`
        },
        {
          front: "What data structure underlies BFS vs DFS?",
          back: `**BFS** uses a **queue** (FIFO) — process neighbors before going deeper.
**DFS** uses a **stack** (LIFO) — or the call stack via recursion.`
        },
        {
          front: "When can DFS cause a stack overflow?",
          back: `On very deep or degenerate graphs (e.g. a linked-list-shaped tree with n=10⁶ nodes), recursive DFS will create n stack frames and hit the system recursion limit. Solution: use an explicit stack with iteration.`
        }
      ],
      quiz: [
        {
          question: "You want to find the shortest path between two nodes in an unweighted graph. Which algorithm should you use and why?",
          answer: `**BFS.** It explores nodes in order of their distance (number of edges) from the source. The first time BFS reaches the destination, it has taken the fewest hops — this is provably the shortest path.

DFS does not guarantee shortest path because it may take a long detour before finding the destination.`
        },
        {
          question: "What is the time complexity of BFS/DFS on a graph represented as an adjacency list?",
          options: [
            "O(V)",
            "O(E)",
            "O(V + E)",
            "O(V · E)"
          ],
          answer: 2,
          explanation: `Each vertex is enqueued/visited once — O(V). Each edge is examined once (or twice for undirected) — O(E). Total: **O(V + E)**. For an adjacency matrix representation it would be O(V²) because checking all neighbours takes O(V) per vertex.`
        },
        {
          question: "In a DFS of an undirected graph, what is a 'back edge' and what does it indicate?",
          answer: `A **back edge** connects a node to one of its ancestors in the DFS tree (i.e., a node already on the current recursion stack).

In an **undirected** graph, any non-tree edge is a back edge and indicates a **cycle**.
In a **directed** graph, a back edge also indicates a cycle; cross edges and forward edges do not.`
        },
        {
          question: "How do you find all connected components in an undirected graph using DFS?",
          answer: `Iterate over all vertices. For each unvisited vertex, run DFS — all vertices reachable from it form one connected component. Increment a counter for each new DFS call from an unvisited node.

~~~python
def count_components(n, edges):
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v); graph[v].append(u)
    visited = set()
    count = 0
    def dfs(u):
        visited.add(u)
        for v in graph[u]:
            if v not in visited: dfs(v)
    for u in range(n):
        if u not in visited:
            dfs(u); count += 1
    return count
~~~`
        },
        {
          question: "What is topological sort and which traversal is it based on?",
          options: [
            "Ordering nodes by value; uses BFS",
            "Linear ordering of nodes so all edges go forward; uses DFS",
            "Ordering nodes by degree; uses BFS",
            "Finding the shortest path; uses Dijkstra"
          ],
          answer: 1,
          explanation: `Topological sort produces a linear ordering of vertices such that for every directed edge u→v, u comes before v. It is only possible for **DAGs** (no cycles). The standard algorithm uses **DFS**: after fully exploring a node (all descendants done), push it to a stack. The stack reversed gives topological order.`
        },
        {
          question: "BFS on a tree vs BFS on a general graph — what extra bookkeeping is needed for a graph?",
          answer: `For a **tree**, every node is visited exactly once (no cycles), so no extra bookkeeping is needed.

For a **general graph**, you must track a **visited set** to avoid revisiting nodes and getting into infinite loops (due to cycles or back edges).

~~~python
from collections import deque
def bfs(start, graph):
    visited = {start}
    queue = deque([start])
    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
~~~`
        }
      ]
    },
    {
      id: "binary-search",
      title: "Binary Search",
      body: `Binary search finds a target in a **sorted** structure by halving the search space each step.

| Scenario | Time | Space |
|----------|------|-------|
| Search sorted array | O(log n) | O(1) |
| Search answer space | O(log(range) · cost) | O(1) |

Template: maintain \`lo\`, \`hi\`, compute \`mid = (lo + hi) // 2\`, move boundary based on condition. Off-by-one errors are the #1 bug — be precise about invariants.`,
      quizTitle: "Brain teasers",
      flashcards: [
        {
          front: "Why is mid = (lo + hi) // 2 potentially unsafe in some languages?",
          back: `In languages with fixed-size integers (C, Java), lo + hi can **overflow** if both are large. Safe alternative: \`mid = lo + (hi - lo) // 2\`. In Python integers are arbitrary precision, so no overflow.`
        },
        {
          front: "What does 'binary search on answer' mean?",
          back: `Instead of searching an array, you binary search over the **answer space** (e.g. 1 to 10⁹). For each candidate answer mid, you check feasibility in O(n). Total: O(n log(range)) — often much faster than brute force.`
        },
        {
          front: "Precondition for binary search?",
          back: `The search space must be **monotone** — i.e., once the condition becomes true (or false), it stays that way. For arrays this means sorted order; for answer-space problems it means a monotone predicate.`
        }
      ],
      quiz: [
        {
          question: "What is the time complexity of binary search, and why?",
          options: [
            "O(n) — you may check every element",
            "O(log n) — search space halves each step",
            "O(n log n) — like merge sort",
            "O(1) — constant time lookup"
          ],
          answer: 1,
          explanation: `Each iteration eliminates half the remaining candidates. Starting with n elements: after 1 step n/2, after 2 steps n/4, … after k steps n/2^k = 1 → k = log₂(n). So **O(log n)** comparisons total.`
        },
        {
          question: "You must find the leftmost position where a value could be inserted to keep an array sorted (lower bound). How does your binary search differ from a standard one?",
          answer: `Standard binary search returns any match. For **lower bound** (leftmost insert position):
- When \`nums[mid] == target\`, don't stop — move \`hi = mid\` to keep searching left.
- The loop ends with \`lo == hi\` pointing to the leftmost valid position.

~~~python
def lower_bound(nums, target):
    lo, hi = 0, len(nums)
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid       # include mid, shrink right
    return lo
~~~`
        },
        {
          question: "Give an example where binary search on the answer space is useful.",
          answer: `**Example: 'Koko Eating Bananas'** — find the minimum eating speed k such that Koko can eat all piles within h hours.

- Answer space: 1 ≤ k ≤ max(piles)
- Predicate: \`can_finish(k)\` = sum of ceil(pile/k) ≤ h (monotone: if k works, k+1 also works)
- Binary search the minimum k where predicate is True

**Time:** O(n · log(max_pile)) vs O(n · max_pile) brute force.

Other examples: Capacity to Ship Packages, Split Array Largest Sum, Minimum Days to Make m Bouquets.`
        },
        {
          question: "Binary search on a rotated sorted array (e.g. [4,5,6,1,2,3]) — how do you decide which half to search?",
          answer: `One half is always normally sorted. Check which half is sorted by comparing nums[lo] and nums[mid]:

- If \`nums[lo] <= nums[mid]\`, the **left half** is sorted.
  - If target is in [nums[lo], nums[mid]), search left; else search right.
- Otherwise, the **right half** is sorted.
  - If target is in (nums[mid], nums[hi]], search right; else search left.

This maintains O(log n) by always eliminating half the array.`
        },
        {
          question: "What is the bug in this binary search: while (lo <= hi) { mid = (lo+hi)/2; if arr[mid] == target return mid; if arr[mid] < target lo = mid; else hi = mid; }?",
          options: [
            "No bug — this is correct",
            "Infinite loop when lo + 1 == hi",
            "mid is computed incorrectly",
            "The condition should be lo < hi"
          ],
          answer: 1,
          explanation: `When \`lo + 1 == hi\`, \`mid = lo\`. If \`arr[mid] < target\`, we set \`lo = mid = lo\` — no progress, **infinite loop**. The fix: \`lo = mid + 1\` (not \`mid\`) so the boundary always advances.`
        },
        {
          question: "How many comparisons does binary search need to find a target in a sorted array of 1,000,000 elements?",
          answer: `At most **ceil(log₂(1,000,000)) = 20 comparisons**.

log₂(10⁶) ≈ 19.93, so 20 steps suffice. This is why binary search is so powerful — a million elements reduced to ~20 comparisons.`
        }
      ]
    },
    {
      id: "dynamic-programming",
      title: "Dynamic Programming",
      body: `DP solves problems by breaking them into overlapping subproblems and storing results to avoid recomputation.

**Two approaches:**
- **Top-down (memoization):** recursion + cache
- **Bottom-up (tabulation):** fill a DP table iteratively

**Key question:** can the problem be expressed as \`dp[i] = f(dp[j], j < i)\`?

Time: typically O(n²) or O(n·m); Space: O(n) to O(n·m). Space can often be reduced by only keeping the last row/column.`,
      quizTitle: "Brain teasers",
      flashcards: [
        {
          front: "What two properties must a problem have for DP to apply?",
          back: `1. **Optimal substructure** — the optimal solution contains optimal solutions to subproblems.
2. **Overlapping subproblems** — the same subproblems are solved multiple times (memoization pays off).`
        },
        {
          front: "Top-down vs bottom-up DP — which uses more stack space?",
          back: `**Top-down (memoization)** uses O(depth) call stack space for recursion — risks stack overflow on deep problems.
**Bottom-up (tabulation)** uses O(1) extra stack space (iterative loops), generally safer for large inputs.`
        },
        {
          front: "How do you reduce DP space from O(n²) to O(n) in a 2D table?",
          back: `If \`dp[i][j]\` only depends on the **previous row** \`dp[i-1][...]\`, keep only two rows (or one with careful iteration order). E.g. in Longest Common Subsequence you can use a single rolling array.`
        }
      ],
      quiz: [
        {
          question: "What is the time complexity of naive recursive Fibonacci vs memoized Fibonacci?",
          options: [
            "Both O(n)",
            "Naive O(2^n), memoized O(n)",
            "Naive O(n²), memoized O(n)",
            "Both O(2^n)"
          ],
          answer: 1,
          explanation: `Naive recursion recomputes subproblems: fib(n) branches into fib(n-1) and fib(n-2), forming a binary tree of height n → **O(2^n)** calls. Memoization stores each result, so each of the n unique subproblems is computed exactly once → **O(n)**.`
        },
        {
          question: "The 0/1 Knapsack problem has n items and capacity W. What is the DP time and space complexity?",
          answer: `**Time:** O(n · W) — fill a table of n rows × W+1 columns, O(1) per cell.

**Space:** O(n · W) naive; reducible to **O(W)** by using a 1D array and iterating weights in **reverse** (to avoid using the same item twice):

~~~python
dp = [0] * (W + 1)
for weight, value in items:
    for w in range(W, weight - 1, -1):  # reverse!
        dp[w] = max(dp[w], dp[w - weight] + value)
~~~

Reverse iteration is a classic gotcha — forward iteration would allow each item to be picked multiple times.`
        },
        {
          question: "You're asked to solve Longest Increasing Subsequence (LIS). What are the two DP approaches and their complexities?",
          answer: `**Approach 1 — O(n²) DP:**
\`dp[i]\` = length of LIS ending at index i.
\`dp[i] = max(dp[j] + 1) for all j < i where nums[j] < nums[i]\`

**Approach 2 — O(n log n) with patience sorting:**
Maintain a \`tails\` array where \`tails[i]\` is the smallest tail of all increasing subsequences of length i+1. Use binary search to find the insertion point.

The O(n log n) approach is a classic example of combining DP insight with binary search.`
        },
        {
          question: "Why does the coin change problem (min coins to make amount) use bottom-up DP instead of greedy?",
          answer: `**Greedy fails** for arbitrary coin denominations. Example: coins = [1, 3, 4], amount = 6.
- Greedy (largest first): 4 + 1 + 1 = 3 coins.
- Optimal: 3 + 3 = **2 coins**.

Greedy only works when the coin system is canonical (e.g. US coins). DP explores all subproblems:

~~~python
dp = [float('inf')] * (amount + 1)
dp[0] = 0
for a in range(1, amount + 1):
    for c in coins:
        if c <= a:
            dp[a] = min(dp[a], dp[a - c] + 1)
~~~

**Time:** O(amount · len(coins)), **Space:** O(amount).`
        },
        {
          question: "What is 'optimal substructure' and give a classic example where it does NOT hold?",
          answer: `**Optimal substructure:** the globally optimal solution can be constructed from optimal solutions to subproblems.

**Example where it fails: Longest Path in a general graph.**
The longest path from A to D might go A→B→C→D. But the longest path from A to C is NOT necessarily A→B→C — the overall optimal path may reuse vertices, so we can't decompose it cleanly.

This is why DP works for shortest path (Bellman-Ford) but not longest path in a cyclic graph (NP-hard).`
        },
        {
          question: "In the Edit Distance problem (Levenshtein), what does dp[i][j] represent and what is the recurrence?",
          answer: `\`dp[i][j]\` = minimum edit operations (insert, delete, replace) to convert \`word1[:i]\` to \`word2[:j]\`.

**Recurrence:**
- If \`word1[i-1] == word2[j-1]\`: \`dp[i][j] = dp[i-1][j-1]\` (no operation)
- Else: \`dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])\`
  - \`dp[i-1][j]\` = delete from word1
  - \`dp[i][j-1]\` = insert into word1
  - \`dp[i-1][j-1]\` = replace

**Time:** O(m·n), **Space:** O(m·n), reducible to O(min(m,n)).`
        }
      ]
    },
    {
      id: "heaps",
      title: "Heaps",
      body: `A heap is a complete binary tree satisfying the heap property: **min-heap** has the smallest element at root; **max-heap** has the largest.

| Operation | Time |
|-----------|------|
| Insert (push) | O(log n) |
| Remove min/max (pop) | O(log n) |
| Peek min/max | O(1) |
| Build heap from n elements | O(n) |

Use a heap when you repeatedly need the min or max element — e.g. priority queues, k-th largest, merge k sorted lists.`,
      quizTitle: "Brain teasers",
      flashcards: [
        {
          front: "Why is building a heap O(n) not O(n log n)?",
          back: `Heapify starts from the bottom — most nodes are near leaves and require very little sifting. The total work sums to O(n) by the geometric series argument, even though each sift is O(log n) in the worst case.`
        },
        {
          front: "How do you simulate a max-heap in Python (which only provides min-heap)?",
          back: `**Negate values:** push -x instead of x. The smallest negative number corresponds to the largest original value. When popping, negate the result: \`-heapq.heappop(h)\`.`
        },
        {
          front: "When should you use a heap over sorting?",
          back: `Use a heap when you need the **k smallest/largest** elements from a stream or large array without sorting everything — O(n log k) vs O(n log n). Also when elements arrive dynamically (stream), sorting isn't an option.`
        }
      ],
      quiz: [
        {
          question: "You need the k largest elements from an array of n elements. What is the optimal approach?",
          answer: `**Use a min-heap of size k:**
1. Push the first k elements.
2. For each remaining element x, if x > heap[0] (current min), pop and push x.
3. The heap contains the k largest.

**Time:** O(n log k) — much better than O(n log n) sorting when k << n.

~~~python
import heapq
def k_largest(nums, k):
    return heapq.nlargest(k, nums)  # internally uses a heap of size k
~~~`
        },
        {
          question: "A heap is stored as an array. For a node at index i, what are the indices of its children and parent?",
          options: [
            "Children: 2i, 2i+1; Parent: i//2 (1-indexed)",
            "Children: 2i+1, 2i+2; Parent: (i-1)//2 (0-indexed)",
            "Children: i+1, i+2; Parent: i-1",
            "Both A and B are correct for their respective indexing"
          ],
          answer: 3,
          explanation: `Both are correct depending on indexing convention:
- **1-indexed:** children at 2i and 2i+1, parent at i//2.
- **0-indexed:** children at 2i+1 and 2i+2, parent at (i-1)//2.
Python's \`heapq\` uses **0-indexed**.`
        },
        {
          question: "How would you find the median of a data stream efficiently?",
          answer: `Use **two heaps**:
- A **max-heap** for the lower half of numbers.
- A **min-heap** for the upper half.

Keep them balanced (sizes differ by at most 1). The median is either the top of the larger heap, or the average of both tops.

**Each insert:** O(log n). **Each median query:** O(1).

This is the classic "Find Median from Data Stream" (LeetCode 295).`
        },
        {
          question: "What is the time complexity of heap sort?",
          options: [
            "O(n) for build + O(n) for sort = O(n)",
            "O(n) for build + O(n log n) for sort = O(n log n)",
            "O(n log n) + O(n log n) = O(n log n)",
            "O(n²) in the worst case"
          ],
          answer: 1,
          explanation: `Build heap: **O(n)**. Then pop n elements, each requiring O(log n) sift-down: **O(n log n)**. Total: **O(n log n)**. Heap sort is in-place and worst-case O(n log n) — unlike quicksort which degrades to O(n²).`
        },
        {
          question: "Given k sorted arrays each of size n, how do you merge them into one sorted array efficiently using a heap?",
          answer: `Push the **first element of each array** (with its array index and element index) into a min-heap. Repeatedly pop the minimum, add it to the result, and push the next element from the same array.

**Time:** O(nk · log k) — nk total elements, each push/pop is O(log k).
**Space:** O(k) for the heap.

This is optimal; you must look at all nk elements and the heap keeps the merge O(log k) per element instead of O(k).`
        }
      ]
    },
    {
      id: "intervals",
      title: "Intervals",
      body: `Interval problems involve ranges [start, end]. The standard technique is to **sort by start time**, then sweep through.

| Problem | Approach | Time |
|---------|----------|------|
| Merge overlapping | Sort + scan | O(n log n) |
| Insert interval | Binary search + merge | O(n) |
| Meeting rooms (overlap?) | Sort, scan | O(n log n) |
| Min meeting rooms needed | Sort starts & ends separately | O(n log n) |

Two intervals [a,b] and [c,d] overlap if a ≤ d and c ≤ b.`,
      quizTitle: "Brain teasers",
      flashcards: [
        {
          front: "When do two intervals [a,b] and [c,d] overlap?",
          back: `They overlap when **a ≤ d AND c ≤ b** — i.e., each interval starts before the other ends. They do NOT overlap if b < c or d < a.`
        },
        {
          front: "After sorting intervals by start, how do you merge them?",
          back: `Track the current merged interval. For each new interval: if it overlaps the current (new.start ≤ current.end), extend current.end = max(current.end, new.end). Otherwise, push current to result and start a new one.`
        },
        {
          front: "Minimum meeting rooms needed — what is the key insight?",
          back: `**Sort starts and ends separately.** Use two pointers — one for starts, one for ends. Each time a meeting starts before the earliest ending, a new room is needed. When a meeting ends before the next starts, a room is freed. Track the max simultaneous rooms.`
        }
      ],
      quiz: [
        {
          question: "You have a list of intervals. After merging all overlapping ones, how many intervals remain from [[1,3],[2,6],[8,10],[15,18]]?",
          options: [
            "4",
            "3",
            "2",
            "1"
          ],
          answer: 1,
          explanation: `[1,3] and [2,6] overlap → merge to [1,6]. [8,10] doesn't overlap [1,6]. [15,18] doesn't overlap [8,10]. Result: **[[1,6],[8,10],[15,18]]** — 3 intervals.`
        },
        {
          question: "How do you insert a new interval into a sorted non-overlapping list and merge if needed?",
          answer: `Scan three phases:
1. Add all intervals that end before the new one starts (no overlap, new.start > interval.end).
2. Merge all intervals that overlap with the new one (interval.start ≤ new.end): expand new interval.
3. Add all remaining intervals (they start after new one ends).

~~~python
def insert(intervals, new):
    res = []
    for i, iv in enumerate(intervals):
        if new[1] < iv[0]:          # new ends before iv starts
            res.append(new)
            return res + intervals[i:]
        elif new[0] > iv[1]:        # new starts after iv ends
            res.append(iv)
        else:                       # overlap — merge
            new = [min(new[0], iv[0]), max(new[1], iv[1])]
    res.append(new)
    return res
~~~

**Time:** O(n), **Space:** O(n).`
        },
        {
          question: "What is the minimum number of meeting rooms needed for meetings [[0,30],[5,10],[15,20]]?",
          answer: `**2 rooms.**

- At time 0: meeting 1 starts → 1 room.
- At time 5: meeting 2 starts, meeting 1 still running → 2 rooms.
- At time 10: meeting 2 ends → 1 room.
- At time 15: meeting 3 starts, meeting 1 still running → 2 rooms.
- At time 20: meeting 3 ends → 1 room.
- At time 30: meeting 1 ends → 0 rooms.

Max simultaneous = **2**.`
        },
        {
          question: "What is the significance of sorting by start time in interval problems?",
          options: [
            "It allows binary search for any interval",
            "It ensures we can detect overlaps by comparing adjacent intervals only",
            "It minimizes the number of merges",
            "It's required by the problem statement"
          ],
          answer: 1,
          explanation: `Once sorted by start time, any interval that could potentially overlap with interval i must come **after** it in sorted order. This means we only need to compare each interval against the one we last processed — a single scan suffices instead of O(n²) pairwise comparisons.`
        },
        {
          question: "Given n intervals, what is a smart way to tell if any two overlap — without checking all O(n²) pairs?",
          answer: `Sort intervals by start time (O(n log n)), then scan linearly: check if intervals[i].start < intervals[i-1].end.

If any adjacent pair overlaps after sorting, there is an overlap. Since sorted order means i+1 has the smallest possible start among remaining intervals, if i+1 doesn't overlap with i, it can't overlap with any earlier interval either.

**Time:** O(n log n) for sorting + O(n) scan = **O(n log n)** total.`
        }
      ]
    },
    {
      id: "sliding-window",
      title: "Sliding Window",
      body: `The sliding window technique maintains a contiguous subarray (window) and expands/shrinks it to find an optimal range.

- **Fixed-size window:** slide a window of size k across the array.
- **Variable-size window:** expand right pointer, shrink left pointer when a constraint is violated.

| Pattern | Time | Space |
|---------|------|-------|
| Fixed window | O(n) | O(1) |
| Variable window | O(n) | O(k) for freq map |

Key insight: instead of recomputing the window from scratch, update incrementally as the window slides.`,
      quizTitle: "Brain teasers",
      flashcards: [
        {
          front: "When should you use sliding window vs two pointers?",
          back: `**Sliding window:** subarray/substring problems — you maintain a window with a freq map or sum, shrinking when a constraint is violated.
**Two pointers:** pair-finding problems on sorted arrays, or pointer-from-each-end patterns (palindrome check, container with most water).`
        },
        {
          front: "What is the time complexity of the variable sliding window?",
          back: `**O(n)** — the right pointer advances n times and the left pointer advances at most n times total (it never moves backward), so at most 2n iterations.`
        },
        {
          front: "Classic sliding window problems?",
          back: `- Longest substring without repeating characters
- Minimum window substring
- Max sum subarray of size k
- Longest subarray with at most k distinct characters
- Permutation in string`
        }
      ],
      quiz: [
        {
          question: "Find the maximum sum of any subarray of size k. What is the sliding window approach?",
          answer: `Compute the sum of the first k elements. Then slide: add the next element, subtract the element leaving the window.

~~~python
def max_sum_k(nums, k):
    window_sum = sum(nums[:k])
    best = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        best = max(best, window_sum)
    return best
~~~

**Time:** O(n) vs O(nk) brute force. The key is the incremental update.`
        },
        {
          question: "In the 'Longest Substring Without Repeating Characters' problem, why is the left pointer never moved backward?",
          options: [
            "It is a constraint of the problem",
            "Moving it backward would include a duplicate again",
            "The left pointer only needs to catch up to where duplicates occur, and it never needs to go back",
            "Both B and C"
          ],
          answer: 3,
          explanation: `Moving left backward would re-include a character we just excluded to fix a duplicate — defeating the purpose. Also, since right moves forward monotonically, any valid window ending at an earlier right pointer is a subset of what we've already seen. The amortized O(n) proof relies on left only moving forward.`
        },
        {
          question: "What is the 'at most k distinct characters' sliding window pattern?",
          answer: `Expand right; when the window has > k distinct characters, shrink from the left until it's valid again.

~~~python
from collections import defaultdict
def longest_k_distinct(s, k):
    freq = defaultdict(int)
    l = best = 0
    for r, c in enumerate(s):
        freq[c] += 1
        while len(freq) > k:
            freq[s[l]] -= 1
            if freq[s[l]] == 0: del freq[s[l]]
            l += 1
        best = max(best, r - l + 1)
    return best
~~~

**Time:** O(n) — both pointers move at most n steps total.`
        },
        {
          question: "You want the smallest subarray with sum >= target. What type of window and why?",
          answer: `**Variable-size window** (shrinking from left).

Expand right to grow the sum until it meets the target, then shrink from left while the sum stays >= target, recording the window size each time.

~~~python
def min_subarray_len(target, nums):
    l = total = 0
    best = float('inf')
    for r in range(len(nums)):
        total += nums[r]
        while total >= target:
            best = min(best, r - l + 1)
            total -= nums[l]; l += 1
    return best if best != float('inf') else 0
~~~

**Time:** O(n). Works because all values are positive (sum is monotone as window grows).`
        },
        {
          question: "The sliding window technique requires the array values to satisfy what property for sum-based problems?",
          options: [
            "All values must be sorted",
            "All values must be positive (or non-negative)",
            "All values must be integers",
            "The array must be of even length"
          ],
          answer: 1,
          explanation: `For sum-based variable windows, you need **non-negative values** so that adding an element never decreases the sum (monotone). If negative values exist, adding more elements could decrease the sum, making the shrink-while-valid logic incorrect. For negative values, use Kadane's algorithm or prefix sums instead.`
        }
      ]
    },
    {
      id: "two-pointers",
      title: "Two Pointers",
      body: `Two pointers uses two indices moving through a structure, often toward each other or at different speeds.

**Patterns:**
- **Opposite ends:** start l=0, r=n-1, move inward (sorted array pair sum, palindrome check).
- **Fast/slow:** two pointers at different speeds, often to detect cycles or find midpoints.
- **Partition:** in-place partitioning (Dutch National Flag, quicksort pivot).

| Use case | Time | Space |
|----------|------|-------|
| Pair sum in sorted array | O(n) | O(1) |
| Cycle detection | O(n) | O(1) |
| Remove duplicates in-place | O(n) | O(1) |`,
      quizTitle: "Brain teasers",
      flashcards: [
        {
          front: "Floyd's cycle detection: what do the two pointers do?",
          back: `**Slow pointer** moves 1 step per iteration; **fast pointer** moves 2 steps. If a cycle exists, fast will eventually lap slow and they will meet inside the cycle. If no cycle, fast reaches null.`
        },
        {
          front: "Two pointers for pair sum requires what precondition?",
          back: `The array must be **sorted**. With l at the start and r at the end: if sum < target, move l right (increase sum); if sum > target, move r left (decrease sum).`
        },
        {
          front: "How do you find the middle of a linked list with two pointers?",
          back: `Use slow (1 step) and fast (2 steps) pointers from the head. When fast reaches the end (or null), slow is at the middle. This avoids needing to know the length first.`
        }
      ],
      quiz: [
        {
          question: "How do you detect a cycle in a linked list using two pointers? Why does it work?",
          answer: `**Floyd's Cycle Detection (tortoise and hare):**
- Slow pointer advances 1 node per step.
- Fast pointer advances 2 nodes per step.
- If there is a cycle, fast will eventually catch up to slow (they meet inside the cycle).
- If no cycle, fast reaches null.

**Why it works:** relative speed of fast to slow is 1 node per step. In a cycle of length c, fast gains on slow by 1 per step, so they meet within c steps after entering the cycle.

**Time:** O(n), **Space:** O(1).`
        },
        {
          question: "Given a sorted array and a target sum T, find if any two elements sum to T. What is the two-pointer solution?",
          options: [
            "Use a hash set — O(n) time and space",
            "Use l=0, r=n-1; if sum < T move l right; if sum > T move r left — O(n) time O(1) space",
            "Sort then binary search for T-x for each x — O(n log n)",
            "Only works with O(n²) brute force"
          ],
          answer: 1,
          explanation: `With a sorted array, start l=0 and r=n-1. If nums[l]+nums[r] == T, found. If < T, increment l to increase sum. If > T, decrement r to decrease sum. Each step eliminates at least one element → **O(n) time, O(1) space**. The hash set approach is also O(n) but uses O(n) extra space.`
        },
        {
          question: "Using two pointers, remove duplicates from a sorted array in-place. What is the pattern?",
          answer: `Use a **slow writer pointer** (tracks where to write) and a **fast reader pointer** (scans ahead).

~~~python
def remove_duplicates(nums):
    if not nums: return 0
    slow = 0
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]
    return slow + 1
~~~

**Key pattern:** fast scans everything; slow only advances when a new unique value is found. **O(n) time, O(1) space.**`
        },
        {
          question: "After Floyd's algorithm detects a cycle (slow and fast meet), how do you find the START of the cycle?",
          answer: `Reset one pointer to the **head**; keep the other at the meeting point. Advance both one step at a time — they will meet exactly at the **cycle start**.

**Why:** Let F = distance from head to cycle start, C = cycle length, k = steps into cycle where they first meet. It can be shown that k ≡ F (mod C). So moving one pointer from head and one from the meeting point at the same speed, they arrive at the cycle start simultaneously.`
        },
        {
          question: "Three Sum problem: given an array, find all triplets summing to 0. What is the optimal approach using two pointers?",
          answer: `**Sort** the array. Iterate with index i (fixing nums[i]). For each i, use two pointers l=i+1, r=n-1 to find pairs summing to -nums[i].

~~~python
def three_sum(nums):
    nums.sort(); res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i-1]: continue  # skip dups
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s == 0:
                res.append([nums[i], nums[l], nums[r]])
                while l < r and nums[l] == nums[l+1]: l += 1
                while l < r and nums[r] == nums[r-1]: r -= 1
                l += 1; r -= 1
            elif s < 0: l += 1
            else: r -= 1
    return res
~~~

**Time:** O(n²), **Space:** O(1) extra.`
        },
        {
          question: "Container with Most Water: given n vertical lines, find the two lines holding the most water. Why does the greedy two-pointer approach work?",
          answer: `Start with l=0 and r=n-1 (widest possible container). Water = min(height[l], height[r]) * (r - l).

**Move the pointer with the smaller height inward.** Why? Moving the taller pointer can never increase the water (width decreases, height bounded by the shorter side). Only moving the shorter pointer can potentially find a taller wall that more than compensates for the reduced width.

This greedy is provably correct — it explores the only candidate that could improve the result at each step.

**Time:** O(n).`
        }
      ]
    }
  ]
}
