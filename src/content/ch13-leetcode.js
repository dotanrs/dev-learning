export default {
  id: "leetcode",
  title: "LeetCode Patterns",
  subchapters: [
    {
      id: "arrays-hashing",
      title: "Arrays & Hashing",
      body: `## Pattern: trade space for time with a hash map

The single most common trick in easy/medium problems: a hash map (or set) turns an O(n²) "check every pair" scan into an O(n) single pass, because lookups are O(1).

### Two Sum

> Given an array \`nums\` and a target, return indices of the two numbers that add up to target.

Store each number's complement as you go — when you see a number whose complement you've already stored, you're done.

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

**Time O(n), Space O(n).** The brute force is two nested loops = O(n²); the map removes the inner loop.

### Contains Duplicate

> Return true if any value appears at least twice.

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

**Time O(n), Space O(n).**

### Group Anagrams

> Group words that are anagrams of each other.

Key insight: two words are anagrams iff their **sorted letters** (or letter-count signature) match — use that as the map key.

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

**Time O(n·k log k)** (n words, k = max length, sorting each), **Space O(n·k).** A counting-array key gets it to O(n·k).
`,
      quizTitle: "Arrays & hashing",
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
          front: "Two Sum: time and space complexity of the hash-map solution?",
          back: `**Time O(n)** (single pass, O(1) map lookups) and **Space O(n)** (the map may hold up to n entries). Beats the O(n²) brute-force double loop.`
        }
      ],
      quiz: [
        {
          question: "Why does the hash-map Two Sum use O(n) space, and when might that be a problem?",
          answer: `The map can store up to n (value → index) entries in the worst case (no early match), so space is **O(n)**.

It's a problem when memory is tight or the input is huge/streamed. Alternative: **sort + two pointers** gives O(n log n) time but O(1) extra space — a classic time/space trade-off. (Sorting loses the original indices, though, so you'd track them separately.)`
        },
        {
          question: "You need to detect a duplicate in an array. Compare the hash-set approach with sorting.",
          options: [
            "Hash set: O(n) time / O(n) space; Sort: O(n log n) time / O(1) space",
            "Both are O(n) time",
            "Sorting is always faster",
            "Hash set is O(n²)"
          ],
          answer: 0,
          explanation: `**Hash set**: one pass, O(n) time but O(n) space. **Sort then scan neighbors**: O(n log n) time but O(1) extra space (if sorting in place). Pick based on whether time or memory is the binding constraint.`
        }
      ]
    },
    {
      id: "two-pointers-sliding-window",
      title: "Two Pointers & Sliding Window",
      body: `## Pattern: two indices moving through the data

When a problem involves **contiguous subarrays/substrings** or a **sorted array**, you can often avoid nested loops by moving two pointers.

### Two Pointers — Valid Palindrome

> Check if a string is a palindrome, ignoring non-alphanumerics and case.

Converge from both ends:

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

**Time O(n), Space O(1)** (ignoring the cleaned copy).

### Two Pointers on a sorted array — 3Sum

> Find all unique triplets that sum to 0.

Sort, fix one element, then two-pointer the rest. Sorting also makes duplicate-skipping easy.

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

**Time O(n²)** (n anchors × O(n) two-pointer), **Space O(1)** extra.

### Sliding Window — Longest Substring Without Repeating Characters

> Length of the longest substring with all distinct characters.

Grow the window on the right; when a duplicate appears, shrink from the left until it's gone.

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

**Time O(n), Space O(min(n, alphabet)).** Each index is visited once by \`end\`; \`start\` only moves forward.
`,
      quizTitle: "Two pointers & windows",
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
          question: "In the sliding-window 'longest substring without repeating characters', why is the total time O(n) and not O(n²) even though there's an inner shrink step?",
          answer: `Because the two pointers each move **monotonically forward** and never reset. \`end\` advances n times; \`start\` also advances at most n times *in total* across the whole run (it never goes backward). So the combined work is O(n) + O(n) = **O(n)** — amortized, not per-iteration nested.`
        },
        {
          question: "What is the time complexity of the two-pointer 3Sum, and where does it come from?",
          options: ["O(n)", "O(n log n)", "O(n²)", "O(n³)"],
          answer: 2,
          explanation: `Sorting is O(n log n), then for each of the n anchor elements we run an O(n) two-pointer scan → O(n²), which dominates. So the total is **O(n²)** — a big win over the O(n³) brute-force triple loop.`
        }
      ]
    },
    {
      id: "binary-search",
      title: "Binary Search",
      body: `## Pattern: halve the search space each step → O(log n)

Applicable whenever the answer space is **monotonic** — sorted arrays, or a predicate that flips from false to true exactly once ("binary search on the answer").

### Classic Binary Search

~~~js
function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);   // avoids overflow; = floor((lo+hi)/2)
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
~~~

**Time O(log n), Space O(1).** Watch the invariants: \`lo <= hi\`, and always move past mid (\`mid+1\`/\`mid-1\`) or you risk an infinite loop.

### Search in Rotated Sorted Array

> A sorted array is rotated at an unknown pivot. Find target in O(log n).

At each step, **one half is always sorted** — figure out which, then decide whether target lies in it.

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

**Time O(log n), Space O(1).**

### Binary Search on the Answer — Koko Eating Bananas

> Koko eats \`k\` bananas/hour from one pile at a time. Find the minimum \`k\` to finish all piles within \`h\` hours.

The answer is monotonic: if speed k works, so does any speed > k. Binary-search k over [1, max(pile)].

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

**Time O(n log m)** where m = max pile size, **Space O(1).**
`,
      quizTitle: "Binary search",
      flashcards: [
        {
          front: "What property must hold to apply binary search?",
          back: `**Monotonicity**: the data is sorted, or there's a predicate that switches from false→true exactly once over the search range. Then you can discard half the space each step, giving O(log n).`
        },
        {
          front: "Why write mid as \`lo + ((hi - lo) >> 1)\` instead of \`(lo + hi) / 2\`?",
          back: `To avoid **integer overflow** when lo + hi exceeds the max safe integer (a real bug in languages with fixed-width ints), and \`>> 1\` floors the division. In JS overflow is less likely but it's the canonical, portable idiom.`
        },
        {
          front: "What is 'binary search on the answer'?",
          back: `When the *answer itself* is monotonic (e.g. "min speed that finishes in time"), binary-search over the range of possible answers, using a feasibility check as the comparator. Turns an O(range) scan into O(log range × check-cost). Example: Koko Eating Bananas.`
        }
      ],
      quiz: [
        {
          question: "In 'Search in Rotated Sorted Array', what key observation makes O(log n) possible?",
          answer: `At every midpoint, **at least one half (left or right of mid) is still fully sorted**. You detect which by comparing nums[lo] to nums[mid]. Then you check whether the target falls within that sorted half's range: if so, recurse there, otherwise recurse the other half. Each step still halves the space → **O(log n)**.`
        },
        {
          question: "For Koko Eating Bananas, what are the low and high bounds of the binary search on k?",
          options: [
            "lo = 0, hi = number of piles",
            "lo = 1, hi = max pile size",
            "lo = 1, hi = total bananas",
            "lo = min pile, hi = h"
          ],
          answer: 1,
          explanation: `Speed must be at least **1** (lo). The most she'd ever need is **max(pile)** per hour — at that speed every pile takes exactly one hour, which is the fastest useful rate (hi). Searching [1, max pile] and checking feasibility gives O(n log m).`
        }
      ]
    },
    {
      id: "linked-lists",
      title: "Linked Lists",
      body: `## Pattern: pointer manipulation & fast/slow runners

Linked-list problems test careful pointer bookkeeping. Two recurring tricks: a **dummy head** node to simplify edge cases, and **fast/slow pointers** for cycle/midpoint detection.

### Reverse a Linked List

Iteratively flip each \`next\` pointer, tracking prev.

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

**Time O(n), Space O(1).**

### Merge Two Sorted Lists

A **dummy head** avoids special-casing the first node.

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

**Time O(n + m), Space O(1).**

### Detect a Cycle — Floyd's Tortoise and Hare

Two pointers, one moving twice as fast. If there's a cycle, they must eventually meet.

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

**Time O(n), Space O(1).** The O(1) space is the whole point — a hash-set of visited nodes also works but costs O(n) memory.
`,
      quizTitle: "Linked lists",
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
          question: "Why is Floyd's algorithm preferred over a hash set for cycle detection?",
          answer: `Both are O(n) time, but Floyd's uses **O(1) space** (just two pointers) versus **O(n) space** for a set of visited nodes. When memory matters, the two-pointer approach wins. It also extends elegantly to *finding the cycle's start* (reset one pointer to head and advance both by 1 until they meet).`
        },
        {
          question: "When reversing a linked list, what happens if you forget to save \`curr.next\` before reassigning it?",
          answer: `You **lose the rest of the list**. Setting \`curr.next = prev\` overwrites the only reference to the remaining nodes; without first saving \`next = curr.next\`, you can't advance and the tail is orphaned. The temporary \`next\` variable is essential.`
        }
      ]
    },
    {
      id: "trees",
      title: "Trees & Traversals",
      body: `## Pattern: recursion mirrors tree structure

Most tree problems are solved by recursion that follows the tree's shape: do something at the node, recurse left, recurse right. Choose **DFS** (recursion/stack) for depth-oriented questions and **BFS** (queue) for level-oriented ones.

### Maximum Depth (DFS)

~~~js
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
~~~

**Time O(n), Space O(h)** (recursion stack, h = height; O(log n) balanced, O(n) skewed).

### Invert a Binary Tree

~~~js
function invertTree(root) {
  if (!root) return null;
  [root.left, root.right] = [invertTree(root.right), invertTree(root.left)];
  return root;
}
~~~

**Time O(n), Space O(h).**

### Validate a BST

> Every node must be greater than all nodes in its left subtree and less than all in its right subtree.

The trap: checking only \`node.left < node < node.right\` is **wrong** — you must carry down the allowed (min, max) range.

~~~js
function isValidBST(root, lo = -Infinity, hi = Infinity) {
  if (!root) return true;
  if (root.val <= lo || root.val >= hi) return false;
  return isValidBST(root.left, lo, root.val) &&
         isValidBST(root.right, root.val, hi);
}
~~~

**Time O(n), Space O(h).**

### Level-Order Traversal (BFS)

Process nodes level by level with a queue.

~~~js
function levelOrder(root) {
  if (!root) return [];
  const res = [], queue = [root];
  while (queue.length) {
    const level = [], size = queue.length;
    for (let i = 0; i < size; i++) {          // fix the level boundary
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

**Time O(n), Space O(n)** (queue holds up to a full level).
`,
      quizTitle: "Trees",
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
          question: "In BFS level-order traversal, why record \`size = queue.length\` before the inner loop?",
          answer: `It **freezes the count of nodes in the current level** before you start enqueuing their children. Iterating exactly \`size\` times drains one full level while the children (the next level) accumulate behind them, so each \`res\` entry is exactly one level. Without it, the loop would blur levels together.`
        },
        {
          question: "What is the worst-case space of a recursive DFS on a binary tree, and when does it occur?",
          options: ["O(1) always", "O(log n) always", "O(h) — up to O(n) for a skewed tree", "O(n²)"],
          answer: 2,
          explanation: `DFS space is the recursion-stack depth = tree height **h**. A balanced tree gives O(log n), but a completely skewed tree (each node has one child, like a linked list) gives height n−1 → **O(n)**.`
        }
      ]
    },
    {
      id: "graphs-dp",
      title: "Graphs & Dynamic Programming",
      body: `## Two of the highest-value patterns

### Graph traversal — Number of Islands (DFS flood fill)

> Count connected groups of '1's in a grid.

Scan the grid; each unvisited land cell starts a DFS that sinks the whole island.

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

**Time O(rows·cols), Space O(rows·cols)** worst-case recursion depth.

### Topological / cycle detection — Course Schedule

> Given prerequisites, can you finish all courses? (Detect a cycle in a directed graph.)

DFS with three states: unvisited, in-progress (on the current path), done. Hitting an in-progress node = cycle.

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

**Time O(V + E), Space O(V + E).**

## Dynamic Programming — solve subproblems once, reuse

DP applies when a problem has **overlapping subproblems** and **optimal substructure**. Define a state, a recurrence, and base cases.

### Climbing Stairs (1D DP)

> Ways to climb n stairs taking 1 or 2 steps. This is Fibonacci: ways(n) = ways(n−1) + ways(n−2).

~~~js
function climbStairs(n) {
  let a = 1, b = 1;                 // ways(0), ways(1)
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}
~~~

**Time O(n), Space O(1).**

### Coin Change (unbounded knapsack)

> Fewest coins to make \`amount\`, or −1 if impossible.

\`dp[x]\` = min coins for amount x. Try every coin for every sub-amount.

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

**Time O(amount·coins), Space O(amount).**
`,
      quizTitle: "Graphs & DP",
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
          question: "In Course Schedule, why isn't a simple 'visited' boolean enough — why do we need three states?",
          answer: `A plain visited flag can't distinguish a node **still on the current recursion path** (which signals a cycle) from one **already fully explored on a different path** (which is fine — it's a shared dependency, not a loop).

The three states — unvisited / visiting / done — let DFS detect a **back-edge** (reaching a *visiting* node) as a cycle, while treating *done* nodes as safe reuse. Two states would either miss cycles or falsely report them.`
        },
        {
          question: "Coin Change with coins [1,3,4] for amount 6 — what's the minimum, and what does greedy get wrong?",
          answer: `**Minimum is 2** coins: 3 + 3 = 6.

A greedy "largest coin first" approach takes 4, then 1, then 1 = **3 coins** — suboptimal. Coin Change lacks the greedy-choice property for arbitrary denominations, so you need DP to consider all combinations: dp[6] = min over coins of dp[6−c]+1 = min(dp[5], dp[3], dp[2]) + 1 = dp[3]+1 = 2.`
        },
        {
          question: "What is the time complexity of Number of Islands on an m×n grid?",
          options: ["O(m + n)", "O(m·n)", "O((m·n)²)", "O(m·n·log(m·n))"],
          answer: 1,
          explanation: `Every cell is examined by the outer scan and visited by the flood-fill **at most once** (it's marked as it's sunk). So total work is proportional to the number of cells = **O(m·n)**.`
        }
      ]
    }
  ]
}
