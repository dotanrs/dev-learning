export default {
  id: "leetcode",
  title: "LeetCode Patterns",
  subchapters: [
    {
      id: "arrays-hashing",
      title: "Arrays & Hashing",
      body: `## Pattern: trade space for time with a hash map

The single most common trick in easy/medium problems: a **hash map** (or set) turns an O(n²) "check every pair" scan into an O(n) single pass, because lookups and inserts are O(1).

**When to reach for it:** you're asked about existence, counts, complements, or grouping — "have I seen X before?", "does a pair sum to target?", "which items share a signature?" A hash structure remembers what you've processed so the inner loop disappears.

The trade-off is memory: a hash map costs O(n) space. When memory is tight, **sorting** is often the alternative (O(n log n) time, O(1) extra space).

Try the problems below — reveal the solution only after you've sketched your own.
`,
      quizTitle: "Problems — tap to reveal the solution",
      flashcards: [
        {
          front: "What is the go-to technique to turn an O(n²) pair-search into O(n)?",
          back: `A **hash map / set**. As you scan, store what you've seen (or each element's needed complement); an O(1) lookup replaces the inner loop. This is the core of Two Sum, Contains Duplicate, and many others.`
        },
        {
          front: "How do you canonicalize anagrams so they can be grouped?",
          back: `Use a **key that's identical for all anagrams** — either the letters sorted (\`"eat" → "aet"\`) or a 26-length letter-count signature. Group words in a hash map under that key.`
        },
        {
          front: "When would you prefer sorting over a hash map for a duplicate/pair problem?",
          back: `When **memory is the binding constraint**. A hash set is O(n) time / O(n) space; sorting then scanning is O(n log n) time but **O(1) extra space** (in place). Pick based on whether time or space matters more.`
        }
      ],
      quiz: [
        {
          question: `**Two Sum.** Given an integer array \`nums\` and an integer \`target\`, return the indices of the two numbers that add up to \`target\`. Exactly one valid pair exists; you may not use the same element twice.

**Required:** O(n) time. State your space complexity.`,
          answer: `**Approach:** one pass with a hash map from value → index. For each element, check whether its complement (\`target - nums[i]\`) is already in the map.

~~~js
function twoSum(nums, target) {
  const seen = new Map();           // value -> index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}
~~~

**Time O(n)** (single pass, O(1) map ops), **Space O(n)** (the map may hold up to n entries). The brute-force double loop is O(n²); the map removes the inner loop.`
        },
        {
          question: `**Contains Duplicate.** Return \`true\` if any value appears at least twice in \`nums\`, and \`false\` if every element is distinct.

**Required:** O(n) time and O(n) space.`,
          answer: `**Approach:** scan into a set; if an element is already present, you've found a duplicate.

~~~js
function containsDuplicate(nums) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}
~~~

**Time O(n), Space O(n).** (Space-constrained alternative: sort in place — O(n log n) time, O(1) extra — then check adjacent equal elements.)`
        },
        {
          question: `**Group Anagrams.** Given an array of strings, group together the ones that are anagrams of each other. Return the groups in any order.

**Required:** O(n·k log k) or better, where n = number of words and k = max word length.`,
          answer: `**Approach:** two anagrams share a canonical form. Use the **sorted letters** as a hash-map key (or a 26-length letter-count signature to avoid the sort).

~~~js
function groupAnagrams(strs) {
  const groups = new Map();
  for (const s of strs) {
    const key = s.split('').sort().join('');   // canonical form
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  return [...groups.values()];
}
~~~

**Time O(n·k log k)** (sorting each word), **Space O(n·k)**. Using a count-array key instead of sorting drops it to **O(n·k)**.`
        }
      ]
    },
    {
      id: "two-pointers-sliding-window",
      title: "Two Pointers & Sliding Window",
      body: `## Pattern: two indices moving through the data

When a problem involves a **sorted array** or **contiguous subarrays/substrings**, two moving indices often replace a nested loop.

- **Two pointers** — converge from both ends (palindromes, container problems) or fix one index and scan with another (sorted-array pair/triplet sums). Sorting first makes duplicate-skipping easy.
- **Sliding window** — for "longest/shortest **contiguous** subarray/substring satisfying a condition." Expand the window on the right; when it violates the constraint, shrink from the left. Because each pointer only moves forward, the whole scan is O(n).

The key insight both share: **each pointer advances monotonically and never resets**, so total work is linear even though there's an inner loop.
`,
      quizTitle: "Problems — tap to reveal the solution",
      flashcards: [
        {
          front: "When should you reach for the two-pointer pattern?",
          back: `When the array is **sorted** (or you can sort it) and you're searching for pairs/triplets meeting a sum/difference condition, or when converging from both ends (palindromes, container problems). It replaces an O(n²) double loop with a single O(n) sweep.`
        },
        {
          front: "What signals a sliding-window problem, and what's the invariant?",
          back: `Signals: "longest/shortest **contiguous** subarray/substring satisfying a condition." Invariant: expand the window on the right; when it violates the constraint, shrink from the left. Each pointer only moves forward ⟹ **O(n)** total.`
        },
        {
          front: "Why does sorting help in 3Sum beyond enabling two pointers?",
          back: `Sorting groups equal values together, so you can **skip duplicates** cheaply (compare to the previous element) to produce only unique triplets, and it lets you move l/r based on whether the sum is too small or too large.`
        }
      ],
      quiz: [
        {
          question: `**Valid Palindrome.** Given a string \`s\`, return \`true\` if it reads the same forwards and backwards, considering only alphanumeric characters and ignoring case.

**Required:** O(n) time and O(1) extra space (beyond any normalization).`,
          answer: `**Approach:** two pointers converging from both ends, comparing characters.

~~~js
function isPalindrome(s) {
  s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let l = 0, r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++; r--;
  }
  return true;
}
~~~

**Time O(n), Space O(1)** (to be strict, skip non-alphanumerics in place with the two pointers to avoid the O(n) cleaned copy).`
        },
        {
          question: `**3Sum.** Given an integer array \`nums\`, return all **unique** triplets \`[a, b, c]\` such that a + b + c = 0. The solution set must not contain duplicate triplets.

**Required:** better than O(n³) — aim for O(n²) time and O(1) extra space (excluding the output).`,
          answer: `**Approach:** sort, fix each element as an anchor, then two-pointer the remaining suffix. Sorting also lets you skip duplicates cheaply.

~~~js
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;   // skip dup anchors
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum < 0) l++;
      else if (sum > 0) r--;
      else {
        res.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) l++;   // skip dups
        while (l < r && nums[r] === nums[r - 1]) r--;
        l++; r--;
      }
    }
  }
  return res;
}
~~~

**Time O(n²)** (n anchors × O(n) two-pointer), **Space O(1)** extra.`
        },
        {
          question: `**Longest Substring Without Repeating Characters.** Given a string \`s\`, return the length of the longest substring that contains no repeated characters.

**Required:** O(n) time.`,
          answer: `**Approach:** sliding window with a map of each character's last index. Grow the window on the right; when you hit a character already inside the window, jump \`start\` past its previous occurrence.

~~~js
function lengthOfLongestSubstring(s) {
  const lastSeen = new Map();
  let start = 0, best = 0;
  for (let end = 0; end < s.length; end++) {
    const c = s[end];
    if (lastSeen.has(c) && lastSeen.get(c) >= start) {
      start = lastSeen.get(c) + 1;    // jump past the previous occurrence
    }
    lastSeen.set(c, end);
    best = Math.max(best, end - start + 1);
  }
  return best;
}
~~~

**Time O(n)** — \`end\` advances n times and \`start\` only moves forward (amortized), so it's linear, not nested. **Space O(min(n, alphabet)).**`
        }
      ]
    },
    {
      id: "binary-search",
      title: "Binary Search",
      body: `## Pattern: halve the search space each step → O(log n)

Binary search applies whenever the answer space is **monotonic** — a sorted array, or a predicate that flips from false to true exactly once. Each step discards half the space, giving O(log n).

Two forms:
- **On an array** — find a target (or a boundary) in sorted data.
- **On the answer** ("binary search the answer") — when the *answer itself* is monotonic (e.g. "the minimum speed that finishes in time"), search the range of possible answers using a feasibility check as the comparator.

Watch the invariants: keep the loop condition (\`lo <= hi\` vs \`lo < hi\`) consistent with how you move the bounds, and always move past \`mid\` to guarantee progress and avoid infinite loops.
`,
      quizTitle: "Problems — tap to reveal the solution",
      flashcards: [
        {
          front: "What property must hold to apply binary search?",
          back: `**Monotonicity**: the data is sorted, or there's a predicate that switches from false→true exactly once over the search range. Then you can discard half the space each step, giving O(log n).`
        },
        {
          front: "Why write mid as \`lo + ((hi - lo) >> 1)\` instead of \`(lo + hi) / 2\`?",
          back: `To avoid **integer overflow** when lo + hi exceeds the max safe integer (a real bug in fixed-width-int languages), and \`>> 1\` floors the division. It's the canonical, portable idiom.`
        },
        {
          front: "What is 'binary search on the answer'?",
          back: `When the *answer itself* is monotonic (e.g. "min speed that finishes in time"), binary-search over the range of possible answers, using a feasibility check as the comparator. Turns an O(range) scan into O(log range × check-cost). Example: Koko Eating Bananas.`
        }
      ],
      quiz: [
        {
          question: `**Binary Search.** Given a sorted array \`nums\` (ascending, distinct) and a \`target\`, return its index, or \`-1\` if absent.

**Required:** O(log n) time and O(1) space.`,
          answer: `**Approach:** maintain a \`[lo, hi]\` window; compare the midpoint and discard the half that can't contain the target.

~~~js
function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);   // floor, overflow-safe
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
~~~

**Time O(log n), Space O(1).** Always move to \`mid+1\`/\`mid-1\` so the window strictly shrinks.`
        },
        {
          question: `**Search in Rotated Sorted Array.** A sorted array of distinct values is rotated at an unknown pivot (e.g. \`[4,5,6,7,0,1,2]\`). Given \`target\`, return its index or \`-1\`.

**Required:** O(log n) time.`,
          answer: `**Key observation:** at any midpoint, **at least one half is still sorted**. Detect which (compare \`nums[lo]\` to \`nums[mid]\`), then check whether the target lies within that sorted half's range to decide where to recurse.

~~~js
function searchRotated(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {                 // left half sorted
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {                                     // right half sorted
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}
~~~

**Time O(log n), Space O(1).**`
        },
        {
          question: `**Koko Eating Bananas.** Koko eats from one pile at a time at \`k\` bananas/hour (finishing a pile early wastes the rest of that hour). Given \`piles\` and \`h\` hours, find the **minimum integer** \`k\` that lets her finish all piles within \`h\` hours.

**Required:** better than scanning every speed — aim for O(n log m), m = max pile.`,
          answer: `**Approach:** the answer is monotonic — if speed \`k\` works, every larger speed works too. Binary-search \`k\` over \`[1, max(pile)]\`, using hours-needed as the feasibility check.

~~~js
function minEatingSpeed(piles, h) {
  const hours = (k) => piles.reduce((sum, p) => sum + Math.ceil(p / k), 0);
  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (hours(mid) <= h) hi = mid;    // mid works, try slower
    else lo = mid + 1;                // too slow, speed up
  }
  return lo;
}
~~~

**Time O(n log m), Space O(1).** Bounds: speed ≥ 1, and max(pile)/hour is the fastest useful rate (one pile per hour).`
        }
      ]
    },
    {
      id: "linked-lists",
      title: "Linked Lists",
      body: `## Pattern: pointer manipulation & fast/slow runners

Linked-list problems test careful pointer bookkeeping. Two recurring tricks:

- **Dummy head** — a throwaway node placed before the real head so you always have a valid \`tail.next\` to write to. Eliminates special-casing the first node when building or merging lists.
- **Fast/slow pointers (Floyd)** — advance one pointer by 1 and another by 2. Meeting ⟹ cycle; the fast one reaching the end ⟹ no cycle. Also finds the midpoint and the cycle's start. Runs in O(1) space, the whole reason to prefer it over a visited-set.

The classic hazard when rewiring: **save \`next\` before you overwrite a \`.next\` pointer**, or you orphan the rest of the list.
`,
      quizTitle: "Problems — tap to reveal the solution",
      flashcards: [
        {
          front: "What is a 'dummy head' and why use it?",
          back: `A throwaway node placed *before* the real head so you always have a valid \`tail.next\` to write to. It removes special-case code for inserting/merging at the front — you just return \`dummy.next\` at the end.`
        },
        {
          front: "How does Floyd's cycle detection (tortoise & hare) work?",
          back: `Advance one pointer by 1 and another by 2 each step. If a cycle exists, the fast pointer laps the slow one and they **meet inside the loop**; if fast reaches null, there's no cycle. Runs in **O(n) time, O(1) space** — no visited-set needed.`
        },
        {
          front: "Reverse a linked list iteratively — the three-pointer dance?",
          back: `Keep \`prev\`, \`curr\`. Each step: save \`next = curr.next\`, point \`curr.next = prev\`, then advance \`prev = curr\` and \`curr = next\`. Return \`prev\` as the new head. O(n) time, O(1) space.`
        }
      ],
      quiz: [
        {
          question: `**Reverse Linked List.** Given the head of a singly linked list, reverse it and return the new head.

**Required:** O(n) time and O(1) space (iterative).`,
          answer: `**Approach:** walk the list flipping each \`next\` pointer, tracking \`prev\`. Save the next node *before* overwriting, or you lose the rest of the list.

~~~js
function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;   // save
    curr.next = prev;         // reverse
    prev = curr;              // advance
    curr = next;
  }
  return prev;                // new head
}
~~~

**Time O(n), Space O(1).**`
        },
        {
          question: `**Merge Two Sorted Lists.** Given the heads of two sorted linked lists, splice them into one sorted list and return its head.

**Required:** O(n + m) time and O(1) extra space.`,
          answer: `**Approach:** a **dummy head** avoids special-casing the first node; append the smaller front each step, then attach whatever remains.

~~~js
function mergeTwoLists(a, b) {
  const dummy = { next: null };
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; }
    else                { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a || b;         // attach the remaining tail
  return dummy.next;
}
~~~

**Time O(n + m), Space O(1).**`
        },
        {
          question: `**Linked List Cycle.** Given the head of a linked list, return \`true\` if it contains a cycle.

**Required:** O(n) time and O(1) space (a hash set would be O(n) space — do better).`,
          answer: `**Approach:** Floyd's tortoise and hare. Two pointers at different speeds must meet if a cycle exists.

~~~js
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;         // +1
    fast = fast.next.next;    // +2
    if (slow === fast) return true;
  }
  return false;
}
~~~

**Time O(n), Space O(1).** The O(1) space is the point — a visited-set solution is also O(n) time but costs O(n) memory.`
        }
      ]
    },
    {
      id: "trees",
      title: "Trees & Traversals",
      body: `## Pattern: recursion mirrors tree structure

Most tree problems are solved by recursion that follows the tree's shape: do something at the node, recurse left, recurse right.

- **DFS** (recursion / explicit stack) for depth- or path-oriented questions — max depth, path sum, validate BST. Space is O(h), the height.
- **BFS** (queue) for level-oriented questions — level-order, minimum depth, shortest unweighted path. Space is O(width).

A recurring trap: a node's validity may depend on **ancestors far above it**, not just its immediate children — so you often thread down accumulated context (like an allowed value range) rather than checking locally.
`,
      quizTitle: "Problems — tap to reveal the solution",
      flashcards: [
        {
          front: "DFS vs BFS on a tree — when do you use each?",
          back: `**DFS** (recursion / explicit stack) for depth/path questions (max depth, path sum, validate BST) — space O(h). **BFS** (queue) for level-by-level questions (level order, minimum depth, shortest unweighted path) — space O(width).`
        },
        {
          front: "What's the common mistake in validating a BST, and the fix?",
          back: `Only comparing a node to its immediate children. That misses violations deeper down (e.g. a small value in the far-right subtree). Fix: **pass a (min, max) allowed range** down the recursion, tightening it as you descend left (new max = node) or right (new min = node).`
        },
        {
          front: "Why is a tree recursion's space complexity O(h) rather than O(n)?",
          back: `The recursion stack only holds the nodes on the **current root-to-node path** at any moment, which is at most the height h. Balanced ⟹ O(log n); a degenerate/skewed tree ⟹ O(n).`
        }
      ],
      quiz: [
        {
          question: `**Maximum Depth of Binary Tree.** Given the root of a binary tree, return its maximum depth (number of nodes along the longest root-to-leaf path).

**Required:** O(n) time; state the space complexity.`,
          answer: `**Approach:** DFS — a node's depth is 1 + the max depth of its two subtrees.

~~~js
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
~~~

**Time O(n), Space O(h)** for the recursion stack — O(log n) if balanced, O(n) if skewed.`
        },
        {
          question: `**Validate Binary Search Tree.** Given the root of a binary tree, return \`true\` if it is a valid BST (every node greater than all nodes in its left subtree and less than all in its right subtree).

**Required:** O(n) time. Note the subtlety about non-local constraints.`,
          answer: `**Trap:** checking only \`left < node < right\` is **wrong** — a node deep in the right subtree could still violate an ancestor's bound. Carry the allowed \`(lo, hi)\` range down the recursion.

~~~js
function isValidBST(root, lo = -Infinity, hi = Infinity) {
  if (!root) return true;
  if (root.val <= lo || root.val >= hi) return false;
  return isValidBST(root.left, lo, root.val) &&
         isValidBST(root.right, root.val, hi);
}
~~~

**Time O(n), Space O(h).**`
        },
        {
          question: `**Binary Tree Level Order Traversal.** Given the root, return the node values grouped **by level**, top to bottom (a list of lists).

**Required:** O(n) time and O(n) space.`,
          answer: `**Approach:** BFS with a queue. Freeze the current level's size before the inner loop so each batch is exactly one level.

~~~js
function levelOrder(root) {
  if (!root) return [];
  const res = [], queue = [root];
  while (queue.length) {
    const level = [], size = queue.length;   // freeze the level boundary
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(level);
  }
  return res;
}
~~~

**Time O(n), Space O(n)** (the queue holds up to a full level). Capturing \`size\` up front is what keeps levels from blurring together.`
        }
      ]
    },
    {
      id: "graphs-dp",
      title: "Graphs & Dynamic Programming",
      body: `## Two of the highest-value patterns

**Graph traversal (DFS/BFS)** — model the problem as nodes and edges, then explore. Mark nodes visited to avoid revisiting. Common tasks: count connected components (flood fill), detect cycles, topological order, shortest unweighted path (BFS).

**Dynamic programming** — applies when a problem has **overlapping subproblems** (the same smaller problems recur) and **optimal substructure** (an optimal answer is built from optimal sub-answers). The recipe: define the state, write the recurrence, set base cases, then fill a table bottom-up (or memoize top-down). If the recurrence only needs the last few states, you can often drop the table to O(1) space.

Reveal each solution only after attempting it.
`,
      quizTitle: "Problems — tap to reveal the solution",
      flashcards: [
        {
          front: "How do you count connected components (e.g. islands) in a grid?",
          back: `Scan every cell; when you hit an unvisited target cell, increment the count and run a **DFS/BFS flood fill** that marks the entire component visited (e.g. overwrite '1'→'0'). Each cell is visited once ⟹ O(rows·cols).`
        },
        {
          front: "How do you detect a cycle in a directed graph with DFS?",
          back: `Use **three states** per node: unvisited, visiting (on the current DFS path), done. If DFS reaches a node currently in the *visiting* state, you've found a back-edge ⟹ **cycle**. This underlies Course Schedule and topological sort.`
        },
        {
          front: "What two properties must a problem have for dynamic programming to apply?",
          back: `**Overlapping subproblems** (the same smaller problems recur, so caching helps) and **optimal substructure** (an optimal solution is built from optimal solutions to subproblems). Then define state + recurrence + base case.`
        },
        {
          front: "Why is Climbing Stairs solvable in O(1) space?",
          back: `The recurrence ways(n) = ways(n−1) + ways(n−2) only needs the **last two values**, not the whole table. Keep two rolling variables and update them — no O(n) array required.`
        }
      ],
      quiz: [
        {
          question: `**Number of Islands.** Given an \`m × n\` grid of \`'1'\` (land) and \`'0'\` (water), return the number of islands (groups of land connected 4-directionally).

**Required:** O(m·n) time.`,
          answer: `**Approach:** scan the grid; each unvisited land cell starts a DFS flood fill that sinks the whole island (mark visited by overwriting to \`'0'\`).

~~~js
function numIslands(grid) {
  if (!grid.length) return 0;
  const rows = grid.length, cols = grid[0].length;
  let count = 0;
  const sink = (r, c) => {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] === '0') return;
    grid[r][c] = '0';                 // mark visited
    sink(r + 1, c); sink(r - 1, c);
    sink(r, c + 1); sink(r, c - 1);
  };
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (grid[r][c] === '1') { count++; sink(r, c); }
  return count;
}
~~~

**Time O(m·n)** (each cell visited once), **Space O(m·n)** worst-case recursion depth.`
        },
        {
          question: `**Course Schedule.** There are \`numCourses\` courses (0…n−1) and a list of prerequisite pairs \`[a, b]\` meaning b must precede a. Return \`true\` if you can finish all courses (i.e. the dependency graph has no cycle).

**Required:** O(V + E) time.`,
          answer: `**Approach:** cycle detection in a directed graph via DFS with three states — unvisited (0), visiting/on-path (1), done (2). Reaching a node in state 1 is a back-edge ⟹ cycle.

~~~js
function canFinish(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);
  for (const [course, pre] of prerequisites) adj[course].push(pre);
  const state = new Array(numCourses).fill(0);   // 0=unvisited,1=visiting,2=done
  const dfs = (node) => {
    if (state[node] === 1) return false;         // back-edge ⇒ cycle
    if (state[node] === 2) return true;
    state[node] = 1;
    for (const nxt of adj[node]) if (!dfs(nxt)) return false;
    state[node] = 2;
    return true;
  };
  for (let i = 0; i < numCourses; i++) if (!dfs(i)) return false;
  return true;
}
~~~

**Time O(V + E), Space O(V + E).** A plain visited boolean is *not* enough — it can't tell "on the current path" from "already safely explored."`
        },
        {
          question: `**Climbing Stairs.** You climb a staircase of \`n\` steps, taking 1 or 2 steps at a time. How many distinct ways can you reach the top?

**Required:** O(n) time and O(1) space.`,
          answer: `**Approach:** ways(n) = ways(n−1) + ways(n−2) — it's Fibonacci. Only the last two values are needed, so use two rolling variables.

~~~js
function climbStairs(n) {
  let a = 1, b = 1;                 // ways(0), ways(1)
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}
~~~

**Time O(n), Space O(1).**`
        },
        {
          question: `**Coin Change.** Given coin denominations \`coins\` and an integer \`amount\`, return the fewest coins needed to make \`amount\`, or \`-1\` if it can't be made. You have unlimited coins of each denomination.

**Required:** O(amount · #coins) time. (Why doesn't greedy work?)`,
          answer: `**Approach:** DP where \`dp[x]\` = min coins for amount \`x\`. For each sub-amount, try every coin. Greedy ("largest coin first") fails for denominations like [1,3,4] making 6 (greedy: 4+1+1 = 3 coins; optimal: 3+3 = 2), so you must consider all combinations.

~~~js
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let x = 1; x <= amount; x++)
    for (const c of coins)
      if (c <= x) dp[x] = Math.min(dp[x], dp[x - c] + 1);
  return dp[amount] === Infinity ? -1 : dp[amount];
}
~~~

**Time O(amount · #coins), Space O(amount).**`
        }
      ]
    }
  ]
}
