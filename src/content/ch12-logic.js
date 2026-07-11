export default {
  id: "logic",
  title: "Logic & Foundational Theorems",
  subchapters: [
    {
      id: "logic-basics",
      title: "Propositional & Predicate Logic",
      body: `## The Grammar of Rigorous Reasoning

Before the famous theorems, the toolkit every proof (and every conditional in your code) rests on.

### Propositional Logic — connectives

A **proposition** is a statement that is either true or false. Connectives combine them:

| Symbol | Name | True when |
|--------|------|-----------|
| ¬P | NOT | P is false |
| P ∧ Q | AND (conjunction) | both true |
| P ∨ Q | OR (disjunction) | at least one true |
| P → Q | IMPLIES | false only when P true, Q false |
| P ↔ Q | IFF (biconditional) | P and Q have the same value |

### The implication is the tricky one

**P → Q** is false in exactly *one* case: P true and Q false. In particular, a false premise makes the implication **vacuously true** ("if the moon is cheese, then 2+2=5" is a *true* statement). Three forms you must not confuse:

- **Contrapositive** of P → Q is **¬Q → ¬P** — *logically equivalent* (always safe to swap).
- **Converse** is Q → P — **not** equivalent.
- **Inverse** is ¬P → ¬Q — **not** equivalent (it's the contrapositive of the converse).

### De Morgan's Laws

> ¬(P ∧ Q) = ¬P ∨ ¬Q
>
> ¬(P ∨ Q) = ¬P ∧ ¬Q

Negation flips AND ↔ OR. This is exactly how you simplify boolean conditions in code: \`!(a && b)\` becomes \`!a || !b\`.

### Predicate Logic — quantifiers

Predicates add variables and quantifiers to talk about whole domains:

- **∀x P(x)** — "for all x, P holds" (universal).
- **∃x P(x)** — "there exists an x where P holds" (existential).

**Negating quantifiers flips them** (a De Morgan for quantifiers):

> ¬(∀x P(x)) ≡ ∃x ¬P(x)
>
> ¬(∃x P(x)) ≡ ∀x ¬P(x)

"Not everyone passed" = "someone failed." **Order matters:** ∀x ∃y (everyone has *some* y) is weaker than ∃y ∀x (one y works for *everyone*).

### Proof Techniques

- **Direct:** assume P, derive Q.
- **Contrapositive:** prove ¬Q → ¬P instead of P → Q.
- **Contradiction:** assume the negation, derive an absurdity (used for √2 irrational, infinitude of primes, the Halting problem).
- **Induction:** prove base case, then P(n) → P(n+1). The workhorse for anything indexed by ℕ.
- **Pigeonhole principle:** n+1 items in n boxes ⇒ some box holds ≥ 2. Deceptively powerful for existence proofs.
`,
      quizTitle: "Logic fundamentals",
      flashcards: [
        {
          front: "What is the contrapositive of 'P → Q', and why does it matter?",
          back: `The contrapositive is **¬Q → ¬P**, and it is **logically equivalent** to P → Q. This lets you prove a statement by assuming the conclusion is false and deriving that the premise must be false — often easier than a direct proof. (The *converse* Q → P and *inverse* ¬P → ¬Q are NOT equivalent.)`
        },
        {
          front: "State De Morgan's laws.",
          back: `**¬(P ∧ Q) = ¬P ∨ ¬Q** and **¬(P ∨ Q) = ¬P ∧ ¬Q.** Negating a conjunction/disjunction flips it to the other and negates each part — the same rule that rewrites \`!(a && b)\` as \`!a || !b\`.`
        },
        {
          front: "How do you negate ∀x P(x) and ∃x P(x)?",
          back: `**¬(∀x P(x)) ≡ ∃x ¬P(x)** and **¬(∃x P(x)) ≡ ∀x ¬P(x).** Negation swaps the quantifier and negates the predicate: "not all are P" = "some is not P."`
        },
        {
          front: "State the pigeonhole principle and give a use.",
          back: `If n+1 items go into n boxes, at least one box has ≥ 2 items. Example: among any 13 people, two share a birth month (12 months). It's a simple but powerful tool for existence proofs.`
        }
      ],
      quiz: [
        {
          question: "Which of these is logically equivalent to 'If it rains, the ground is wet'?",
          options: [
            "If the ground is wet, it rained",
            "If the ground is not wet, it did not rain",
            "If it does not rain, the ground is not wet",
            "The ground is wet and it rained"
          ],
          answer: 1,
          explanation: `The statement is P → Q (rain → wet). Only the **contrapositive** ¬Q → ¬P ("not wet → didn't rain") is equivalent. Option 0 is the converse and option 2 is the inverse — neither is equivalent.`
        },
        {
          question: "Simplify ¬(A ∨ (B ∧ C)) using De Morgan's laws.",
          answer: `¬(A ∨ (B ∧ C)) = ¬A ∧ ¬(B ∧ C) = **¬A ∧ (¬B ∨ ¬C)**.

First split the outer OR (becomes AND of negations), then apply De Morgan again to ¬(B ∧ C) → (¬B ∨ ¬C).`
        },
        {
          question: "Explain the difference between ∀x ∃y Loves(x, y) and ∃y ∀x Loves(x, y).",
          answer: `**∀x ∃y Loves(x,y)**: everyone loves *someone* — but each person may love a different someone.

**∃y ∀x Loves(x,y)**: there is *one* specific y whom *everyone* loves (a universally beloved person).

The second is strictly stronger and implies the first, but not vice versa. **Swapping ∀ and ∃ changes the meaning** — order of quantifiers is not free.`
        }
      ]
    },
    {
      id: "godel-incompleteness",
      title: "Gödel's Incompleteness Theorems",
      body: `## The Limits of Formal Proof

In 1931 Kurt Gödel shattered the dream (Hilbert's program) of reducing all mathematics to a complete, mechanically-checkable set of axioms. His two theorems are among the most profound results in all of logic.

### Setup: what is a formal system?

A formal system has axioms and inference rules, so that "provable" is a purely mechanical, checkable property. We care about systems that are:
- **Consistent** — cannot prove both S and ¬S (otherwise it proves *everything*).
- **Effectively axiomatized** — an algorithm can list the axioms / check a proof.
- **Strong enough** — can express basic arithmetic (Peano arithmetic, ZFC, etc.).

### First Incompleteness Theorem

> **Any consistent, effectively axiomatized formal system strong enough to express arithmetic contains true statements that it cannot prove.**

Such a system is **incomplete**: there exist sentences G such that neither G nor ¬G is provable, yet G is true (in the standard model).

**The idea (self-reference via Gödel numbering):** Gödel encoded statements *about* the system as numbers *inside* the system. He then constructed a sentence G that effectively says:

> "This statement is not provable in this system."

If the system could prove G, then G would be provable — but G says it isn't → contradiction. If it could prove ¬G, the system proves a false statement → inconsistent. So if the system is consistent, G is **true but unprovable**. It's the rigorous cousin of the liar paradox ("this sentence is false"), made safe by targeting *provability* instead of *truth*.

### Second Incompleteness Theorem

> **No such system can prove its own consistency** (unless it is actually inconsistent).

The statement "this system is consistent" is itself one of the true-but-unprovable sentences. You cannot bootstrap trust in a system from *within* it — you must appeal to a stronger system, which in turn cannot prove *its* own consistency.

### What it does NOT mean

- ❌ "Math is broken / arbitrary." Incompleteness is about *provability within one fixed system*, not about truth being meaningless.
- ❌ "Nothing can be proven." Almost everything you use is perfectly provable; incompleteness bites only at carefully constructed self-referential edges.
- ❌ "Humans can do what machines can't." A common overreach — Gödel's result applies to *formal systems*, and the true-but-unprovable G is only known true relative to a stronger meta-system.

### Why engineers should care

It's the logical sibling of **undecidability** (next chapter): both use self-reference/diagonalization to show hard limits. Gödel bounds what *proof* can reach; Turing bounds what *computation* can reach. They are two faces of the same 1930s revolution.
`,
      quizTitle: "Incompleteness",
      flashcards: [
        {
          front: "State Gödel's First Incompleteness Theorem in one sentence.",
          back: `Any **consistent**, effectively axiomatized formal system **strong enough to express arithmetic** contains statements that are **true but cannot be proven within the system** — it is necessarily incomplete.`
        },
        {
          front: "What does Gödel's Second Incompleteness Theorem add?",
          back: `Such a system **cannot prove its own consistency** (unless it's actually inconsistent). The sentence "this system is consistent" is itself unprovable from within — you'd need a stronger external system.`
        },
        {
          front: "What self-referential sentence powers the First Incompleteness Theorem?",
          back: `A sentence G that encodes **"G is not provable in this system."** Via Gödel numbering (statements coded as numbers inside arithmetic), the system can talk about its own proofs. If G were provable it'd be false; so if the system is consistent, G is true but unprovable.`
        },
        {
          front: "Name one common misinterpretation of Gödel's theorems.",
          back: `That "math is broken" or "nothing can be proven." In reality incompleteness only affects specially-constructed self-referential statements within a *single* fixed system; the vast bulk of mathematics remains perfectly provable.`
        }
      ],
      quiz: [
        {
          question: "Which conditions must a formal system satisfy for Gödel's First Incompleteness Theorem to apply?",
          options: [
            "It must be inconsistent and finite",
            "Consistent, effectively axiomatized, and able to express arithmetic",
            "It must contain the real numbers",
            "It must be provably complete"
          ],
          answer: 1,
          explanation: `The theorem targets systems that are **consistent, effectively axiomatized** (proofs are mechanically checkable), and **strong enough to encode arithmetic**. Weaker systems (e.g. pure propositional logic) can be both complete and consistent.`
        },
        {
          question: "Why can't a consistent system of arithmetic prove its own consistency?",
          answer: `By the Second Incompleteness Theorem, the statement "I am consistent" (Con(S)) is one of the true-but-unprovable Gödel sentences.

Intuitively: if a system *could* prove its own consistency, that proof plus Gödel's construction would let it derive a contradiction, making it inconsistent. So a consistent system's consistency can only be established from a **stronger external system** — and that one can't prove its own either.`
        },
        {
          question: "How is Gödel's incompleteness related to Turing's halting problem?",
          answer: `Both are **self-reference / diagonalization** results proving hard limits. Gödel builds a statement asserting its own unprovability; Turing builds a program whose behavior contradicts any supposed halting-decider.

Gödel limits what **formal proof** can establish; Turing limits what **computation** can decide. In fact the halting problem gives an alternative, computational proof of incompleteness — they are two views of the same underlying phenomenon.`
        }
      ]
    },
    {
      id: "computability-undecidability",
      title: "Computability & Undecidability",
      body: `## What Computers Provably Cannot Do

Some problems have no algorithm — not "no fast algorithm," but **no algorithm at all**, ever, on any hardware.

### The Halting Problem (Turing, 1936)

> **There is no algorithm that, given any program P and input x, always correctly decides whether P(x) halts or runs forever.**

**Proof sketch (diagonalization).** Suppose a decider \`Halts(P, x)\` exists. Build:

~~~text
function Paradox(P):
    if Halts(P, P):   # does P halt when given its own code?
        loop forever
    else:
        halt
~~~

Now ask: does \`Paradox(Paradox)\` halt?
- If it **halts**, then Halts(Paradox, Paradox) was true → but then Paradox *loops forever*. Contradiction.
- If it **loops**, then Halts said false → but then Paradox *halts*. Contradiction.

Either way we get a contradiction, so \`Halts\` cannot exist. ∎

### Rice's Theorem — the sweeping generalization

> **Every non-trivial *semantic* property of a program's behavior is undecidable.**

"Semantic" = about *what the program computes* (its input/output behavior), not its syntax. "Non-trivial" = true for some programs, false for others. So there is no general algorithm to decide "does this program ever output 42?", "does it compute the identity function?", "is it free of infinite loops?" — all undecidable.

(Contrast: *syntactic* properties like "does the source contain a \`while\` loop?" are decidable — you just read the text.)

### The Church–Turing Thesis

> Anything **effectively computable** can be computed by a Turing machine.

This is a *thesis*, not a theorem — it defines what "computable" means. Turing machines, lambda calculus, general recursive functions, and every general-purpose programming language are all **Turing-complete** and compute exactly the same class of functions. It's why "which language" never changes *what* is computable, only how conveniently.

### Reductions — spreading undecidability

To prove a new problem Q is undecidable, **reduce** a known-undecidable problem (like Halting) to it: show that a decider for Q would let you build a decider for Halting. Since none exists for Halting, none can exist for Q. Reduction is the fundamental tool for both undecidability and NP-completeness.

### The landscape of hardness

| Level | Meaning | Example |
|-------|---------|---------|
| Decidable, efficient | Poly-time algorithm | Sorting, shortest path |
| Decidable, intractable | Solvable but exponential (likely) | NP-hard problems (TSP) |
| **Undecidable** | *No* algorithm exists | Halting problem, Rice's theorem |
`,
      quizTitle: "Undecidability",
      flashcards: [
        {
          front: "State the halting problem and its status.",
          back: `No algorithm can, for *every* program P and input x, correctly decide whether P(x) halts. It is **undecidable** — proven by Turing (1936) via diagonalization/self-reference. Not "slow," but provably impossible.`
        },
        {
          front: "What is Rice's theorem?",
          back: `**Every non-trivial semantic property of program behavior is undecidable.** If a property depends on *what* a program computes (not its syntax) and holds for some programs but not all, no algorithm can decide it in general — e.g. "does it ever output 0?", "does it always halt?"`
        },
        {
          front: "What does the Church–Turing thesis claim?",
          back: `Everything **effectively computable** can be computed by a Turing machine. It equates the intuitive notion of "algorithm" with Turing-computability; all Turing-complete models (lambda calculus, real languages) compute the same class of functions.`
        },
        {
          front: "How do you prove a new problem is undecidable?",
          back: `By **reduction**: show that a hypothetical decider for your problem Q could be used to build a decider for a known-undecidable problem (e.g. the halting problem). Since the halting decider can't exist, neither can Q's.`
        }
      ],
      quiz: [
        {
          question: "The halting problem is best described as:",
          options: [
            "Solvable but requires exponential time",
            "Solvable only on quantum computers",
            "Undecidable — no algorithm can solve it for all inputs",
            "Solvable with enough memory"
          ],
          answer: 2,
          explanation: `The halting problem is **undecidable**: Turing proved no algorithm can decide it for all program/input pairs. This is a fundamental limit of computation, not a resource (time/memory/hardware) limitation.`
        },
        {
          question: "In the halting-problem proof, why does Paradox(Paradox) yield a contradiction?",
          answer: `Paradox(P) halts exactly when Halts(P,P) says P does *not* halt, and loops when it says P *does* halt. Feeding Paradox its own code:

- If Paradox(Paradox) **halts** → Halts reported "does not halt" → but it just halted. Contradiction.
- If it **loops** → Halts reported "halts" → but it's looping. Contradiction.

The self-reference makes any answer wrong, so the decider Halts cannot exist. ∎`
        },
        {
          question: "Is 'does this program contain the string \\'goto\\'?' decidable? Contrast with 'does this program ever reach a goto at runtime?'",
          answer: `**"Contains the string 'goto'" is decidable** — it's a *syntactic* property; just scan the source text.

**"Ever reaches a goto at runtime" is undecidable** — it's a *semantic* property about execution behavior, and by Rice's theorem (it's non-trivial), no general algorithm can decide it. The line between the two is syntax vs. behavior.`
        }
      ]
    },
    {
      id: "other-famous-theorems",
      title: "Other Famous Theorems",
      body: `## A Tour of Landmark Results

### Cantor's Theorem — not all infinities are equal

> **The set of real numbers is uncountable** — there are strictly more reals than natural numbers.

**Diagonal argument:** suppose you could list all reals in [0,1] as r₁, r₂, r₃, …. Build a new number d whose k-th digit differs from the k-th digit of rₖ. Then d differs from every rₙ in at least one place, so it's missing from the list → contradiction. No enumeration of the reals is possible.

More generally, **|P(S)| > |S|** for any set S (the power set is always strictly bigger). Infinity comes in different *sizes* (cardinalities: ℵ₀, ℵ₁, …).

### Russell's Paradox — why naive set theory breaks

> Let R = the set of all sets that **do not contain themselves**. Does R contain itself?

- If R ∈ R, then by definition R ∉ R.
- If R ∉ R, then by definition R ∈ R.

Contradiction either way. This broke Frege's foundations and forced the axiomatic set theory (ZFC) we use today, where "the set of all sets" isn't allowed. Same self-reference flavor as Gödel and the halting problem.

### Gödel's Completeness Theorem (the *other* Gödel theorem)

> In **first-order logic**, every logically valid formula is provable, and every consistent theory has a model.

Don't confuse it with incompleteness! **Completeness** (1929) says first-order logic's proof system captures all valid *first-order* inferences. **Incompleteness** (1931) says a specific *theory* (arithmetic) can't prove all *true arithmetic statements*. The gap: arithmetic truth needs more than first-order provability.

### P vs NP — the million-dollar question

- **P** = problems solvable in polynomial time.
- **NP** = problems whose solutions can be *verified* in polynomial time.
- **P = NP?** asks: if you can quickly *check* a solution, can you always quickly *find* one? Widely believed **P ≠ NP**, but unproven — one of the seven Millennium Prize Problems.

**Cook–Levin theorem:** **SAT** (boolean satisfiability) is **NP-complete** — every NP problem reduces to it. So SAT is a "hardest" problem in NP: a polynomial algorithm for SAT would collapse P = NP. Thousands of problems (TSP, graph coloring, knapsack) are NP-complete by reduction from SAT.

### Compactness Theorem

> A set of first-order sentences has a model **iff every finite subset has a model.**

A powerful tool: it lets you conclude the existence of infinite structures from finite consistency, and underpins much of model theory (and gives non-standard models of arithmetic).

### The through-line

Cantor, Russell, Gödel, and Turing all wield **self-reference and diagonalization** to expose limits — of counting, of set formation, of provability, and of computation. Recognizing that single pattern unlocks all four.
`,
      quizTitle: "Landmark theorems",
      flashcards: [
        {
          front: "What does Cantor's diagonal argument prove?",
          back: `That the reals are **uncountable** — strictly more numerous than the naturals. Any proposed list of all reals in [0,1] can be diagonalized to construct a real missing from the list. Generally, |P(S)| > |S|, so there are infinitely many sizes of infinity.`
        },
        {
          front: "State Russell's paradox and its consequence.",
          back: `"Does the set of all sets that don't contain themselves contain itself?" — both yes and no lead to contradiction. It broke naive set theory and motivated **axiomatic set theory (ZFC)**, which forbids such unrestricted set formation.`
        },
        {
          front: "Distinguish Gödel's Completeness theorem from his Incompleteness theorem.",
          back: `**Completeness (1929):** first-order logic's proof rules can derive *every* logically valid formula. **Incompleteness (1931):** any consistent arithmetic theory has *true statements it can't prove*. They're consistent: incompleteness is about a theory's axioms not pinning down all arithmetic truths, not about the logic's inference rules.`
        },
        {
          front: "What is the Cook–Levin theorem and why does it matter?",
          back: `**SAT (boolean satisfiability) is NP-complete** — every problem in NP reduces to it in polynomial time. It established the first NP-complete problem, so a poly-time SAT solver would prove **P = NP**. Thousands of problems are shown NP-complete by reduction from SAT.`
        }
      ],
      quiz: [
        {
          question: "What is the essential idea of Cantor's diagonal argument?",
          answer: `Assume the reals in [0,1] can be listed r₁, r₂, r₃, …. Construct a new number d by making its k-th decimal digit **differ** from the k-th digit of rₖ (for every k). Then d disagrees with every listed number in at least one digit, so d is not in the list — yet d is a real in [0,1].

The assumed complete list is therefore impossible, proving the reals are **uncountable**.`
        },
        {
          question: "P vs NP: which statement is correct?",
          options: [
            "NP problems are those with no solution",
            "NP problems have polynomial-time verifiable solutions; whether they're also polynomial-time solvable is open",
            "P = NP has been proven true",
            "All NP problems are undecidable"
          ],
          answer: 1,
          explanation: `NP = problems whose candidate solutions can be **verified** in polynomial time. Whether every such problem can also be **solved** in polynomial time (P = NP) is famously **open** (believed false). NP problems are decidable — this is about efficiency, not computability.`
        },
        {
          question: "A colleague says 'Gödel proved you can't prove anything in math.' Correct them.",
          answer: `That's a misstatement. Gödel's **Incompleteness** theorem says a *specific kind of system* (consistent, effectively axiomatized, expressing arithmetic) has *some* true statements it cannot prove — and cannot prove its own consistency.

It does **not** say nothing is provable; the overwhelming majority of mathematics is provable. In fact Gödel's *other* result, the **Completeness** theorem, shows first-order logic proves every valid formula. The limitation is narrow and self-referential, not a blanket "nothing can be proven."`
        }
      ]
    }
  ]
}
