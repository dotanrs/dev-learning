export default {
  id: "statistics",
  title: "Statistics & Probability Theory",
  subchapters: [
    {
      id: "master-theorem",
      title: "The Master Theorem",
      body: `## Solving Divide-and-Conquer Recurrences

### First, what problem are we even solving?

A **divide-and-conquer** algorithm solves a problem by (1) splitting it into smaller subproblems, (2) solving each recursively, and (3) combining the results. Merge sort is the classic example: split the array in half, sort each half, merge them back.

To find the running time of such an algorithm we write a **recurrence relation** — an equation that expresses the cost on an input of size *n* in terms of the cost on smaller inputs. For merge sort:

> T(n) = 2·T(n/2) + n

Read it as: "sorting n items costs *two* recursive sorts of n/2 items, **plus** n work to merge them." The problem is that T appears on both sides — you can't just read the answer off. The **Master Theorem** is a plug-and-chug formula that solves this whole family of recurrences without unrolling them by hand.

### The general form and what each symbol means

> **T(n) = a · T(n / b) + f(n)**

| Symbol | Meaning | Merge sort |
|--------|---------|-----------|
| **T(n)** | total cost on input of size n (what we're solving for) | ? |
| **a ≥ 1** | how many subproblems each call spawns | 2 |
| **b > 1** | the factor by which input size shrinks per level | 2 (halved) |
| **f(n)** | work done *outside* the recursion — the divide + combine cost | n (the merge) |

### Where the answer comes from: the recursion tree

Picture the calls as a tree. The root does f(n) work and spawns *a* children on inputs of size n/b; each of those does f(n/b) work and spawns *a* more, and so on until the inputs are size 1.

- **Depth of the tree:** you divide by b each level until you reach size 1, which takes **log_b(n)** levels.
- **Leaves at the bottom:** each level multiplies the count by a, so after log_b(n) levels there are a^(log_b n) = **n^(log_b a)** leaves.

So the *total* work is a tug-of-war between the **combine work piling up near the root** (governed by f(n)) and the **work done by the huge number of leaves** (governed by n^(log_b a)). The Master Theorem is just: **whichever side grows faster wins.**

### The one comparison that decides everything

Compare your f(n) against the **watershed function** — the leaf count:

> n^(log_b a)

That exponent, log_b(a), *is* the growth rate of the number of leaves. The question is simply: is most of the work done at the **leaves** (recursion dominates), at the **root** (the combine step dominates), or **spread evenly** across all log_b(n) levels?

### The Three Cases

| Case | Condition | Result | Who dominates |
|------|-----------|--------|---------------|
| **1** | f(n) = O(n^(log_b a − ε)) for some ε > 0 | T(n) = **Θ(n^(log_b a))** | Leaves (recursion) |
| **2** | f(n) = Θ(n^(log_b a)) | T(n) = **Θ(n^(log_b a) · log n)** | Every level equally |
| **3** | f(n) = Ω(n^(log_b a + ε)) *and* regularity* | T(n) = **Θ(f(n))** | Root (combine step) |

\\* *Regularity condition for case 3:* a · f(n/b) ≤ c · f(n) for some c < 1 and large n. Nearly always holds for polynomial f.

### Worked Examples

**Merge sort:** T(n) = 2T(n/2) + Θ(n)
- a=2, b=2 → log₂ 2 = 1, watershed = n¹ = n
- f(n) = n = Θ(n¹) → **Case 2** → **T(n) = Θ(n log n)** ✓

**Binary search:** T(n) = 1·T(n/2) + Θ(1)
- a=1, b=2 → log₂ 1 = 0, watershed = n⁰ = 1
- f(n) = 1 = Θ(1) → **Case 2** → **T(n) = Θ(log n)** ✓

**Strassen's matrix multiply:** T(n) = 7T(n/2) + Θ(n²)
- a=7, b=2 → log₂ 7 ≈ 2.807, watershed = n^2.807
- f(n) = n² grows *slower* → **Case 1** → **T(n) = Θ(n^2.807)** ✓

**Naive divide over halves with linear-time-squared combine:** T(n) = 2T(n/2) + Θ(n²)
- watershed = n; f(n) = n² grows *faster* → **Case 3** → **T(n) = Θ(n²)**

### When the Master Theorem Fails

It only applies to this exact shape. It does **not** handle:
- Uneven splits like T(n) = T(n/3) + T(2n/3) + n → use the **Akra–Bazzi** method.
- Gaps between cases, e.g. f(n) = n log n with watershed n (polynomially *equal* but log-factor larger) — this falls in the crack between case 2 and case 3. (The extended master theorem: if f(n) = Θ(n^(log_b a) · logᵏ n) then T(n) = Θ(n^(log_b a) · log^(k+1) n).)
- Non-constant a or b, or subtractive recurrences like T(n) = T(n−1) + n.
`,
      quizTitle: "Recurrence puzzles",
      flashcards: [
        {
          front: "State the Master Theorem's general form and the key quantity you compare against.",
          back: `**T(n) = a·T(n/b) + f(n)** with a ≥ 1, b > 1. You compare f(n) against the watershed function **n^(log_b a)** — the growth rate of the number of leaves in the recursion tree.`
        },
        {
          front: "Which Master Theorem case applies to merge sort, and what is the result?",
          back: `T(n) = 2T(n/2) + Θ(n). Here log_b(a) = log₂ 2 = 1, so watershed = n. f(n) = n = Θ(n¹) → **Case 2** → **T(n) = Θ(n log n)**.`
        },
        {
          front: "In Master Theorem terms, when does the recursion cost (leaves) dominate vs the combine step (root)?",
          back: `**Leaves dominate (Case 1)** when f(n) grows polynomially *slower* than n^(log_b a) → T = Θ(n^(log_b a)). **Root dominates (Case 3)** when f(n) grows polynomially *faster* → T = Θ(f(n)). If they match (Case 2), every level contributes equally → extra log n factor.`
        },
        {
          front: "Name a recurrence the Master Theorem cannot solve and the tool that can.",
          back: `Uneven splits like **T(n) = T(n/3) + T(2n/3) + n** — the Master Theorem needs equal-sized subproblems. Use the **Akra–Bazzi method**, which generalizes it to unequal splits.`
        }
      ],
      quiz: [
        {
          question: "Solve T(n) = 4T(n/2) + n using the Master Theorem.",
          answer: `log_b(a) = log₂ 4 = 2, so the watershed is n². f(n) = n = O(n^(2−ε)) grows polynomially slower → **Case 1** → **T(n) = Θ(n²)**.`
        },
        {
          question: "Solve T(n) = 2T(n/2) + n².",
          options: ["Θ(n log n)", "Θ(n²)", "Θ(n² log n)", "Θ(n³)"],
          answer: 1,
          explanation: `Watershed = n^(log₂ 2) = n. f(n) = n² = Ω(n^(1+ε)) grows polynomially faster, and regularity holds → **Case 3** → T(n) = Θ(f(n)) = **Θ(n²)**. The top-level combine dominates.`
        },
        {
          question: "Why can't the Master Theorem directly solve T(n) = 2T(n/2) + n log n?",
          answer: `The watershed is n^(log₂ 2) = n. But f(n) = n log n is **not** polynomially larger than n — it exceeds n only by a logarithmic factor, not by nᵋ. So it falls in the **gap between Case 2 and Case 3**.

The extended master theorem handles it: with f(n) = Θ(n · log¹ n), the result is **T(n) = Θ(n · log² n)**.`
        }
      ]
    },
    {
      id: "distributions",
      title: "Common Probability Distributions",
      body: `## The Distributions You Actually Meet

A **distribution** describes how probability is spread over the possible values of a random variable. A handful cover most real modeling and interview questions.

### Notation first (so the formulas make sense)

Every symbol used below, defined once:

| Symbol | Read as | Meaning |
|--------|---------|---------|
| **X** | "the random variable" | the uncertain quantity (e.g. "number of heads") |
| **P(X = k)** | "probability that X equals k" | the chance the outcome is exactly k |
| **PMF** | probability *mass* function | P(X = k) for a **discrete** X (countable outcomes) |
| **PDF**, f(x) | probability *density* function | for a **continuous** X; area under it over a range gives the probability |
| **Mean / E[X]** | expected value | the long-run average outcome |
| **Variance / Var(X)** | — | how spread out the outcomes are; **σ² = Var(X)** |
| **σ** (sigma) | standard deviation | √Variance — spread in the same units as X |
| **μ** (mu) | the mean | same as E[X] |
| **p** | probability of success | for a single trial (0 ≤ p ≤ 1) |
| **λ** (lambda) | rate | average number of events per unit (Poisson/Exponential) |
| **n!** | "n factorial" | n × (n−1) × … × 1 |
| **C(n, k)** | "n choose k" | number of ways to pick k items from n = n! / (k!·(n−k)!) |
| **e** | Euler's number | ≈ 2.71828, the base of natural growth/decay |

With that vocabulary, each distribution below is just a rule for P(X = k) (discrete) or f(x) (continuous), plus its mean and variance.

### Discrete Distributions

**Bernoulli(p)** — a single yes/no trial (coin flip).
- Values: 1 with prob p, 0 with prob 1−p.
- Mean = **p**, Variance = **p(1−p)**.

**Binomial(n, p)** — number of successes in n independent Bernoulli trials.
- P(X = k) = C(n, k) · pᵏ · (1−p)^(n−k)
- Mean = **np**, Variance = **np(1−p)**.
- Example: number of heads in 10 flips.

**Geometric(p)** — number of trials until the *first* success.
- P(X = k) = (1−p)^(k−1) · p
- Mean = **1/p**, Variance = **(1−p)/p²**.
- **Memoryless:** past failures don't change future odds. Example: expected flips to get first heads = 1/(1/2) = 2.

**Poisson(λ)** — count of rare events in a fixed interval (arrivals, failures).
- P(X = k) = λᵏ · e^(−λ) / k!
- Mean = **λ**, Variance = **λ** (mean equals variance — a signature).
- Example: requests per second hitting a server.

### Continuous Distributions

**Uniform(a, b)** — every value in [a, b] equally likely.
- Mean = **(a + b)/2**, Variance = **(b − a)² / 12**.

**Normal / Gaussian(μ, σ²)** — the bell curve; the default model for aggregated noise.
- Symmetric around μ; spread controlled by σ.
- **68–95–99.7 rule:** ~68% of mass within 1σ of μ, ~95% within 2σ, ~99.7% within 3σ.
- Arises naturally from the Central Limit Theorem (next chapter).

**Exponential(λ)** — waiting time *between* Poisson events.
- pdf: f(x) = λ·e^(−λx) for x ≥ 0.
- Mean = **1/λ**, Variance = **1/λ²**.
- **Memoryless** (the only continuous distribution that is): P(X > s+t | X > s) = P(X > t). Models time-to-next-arrival.

### Cheat Sheet

| Distribution | Models | Mean | Variance |
|--------------|--------|------|----------|
| Bernoulli(p) | One trial | p | p(1−p) |
| Binomial(n,p) | k successes in n trials | np | np(1−p) |
| Geometric(p) | Trials until 1st success | 1/p | (1−p)/p² |
| Poisson(λ) | Events per interval | λ | λ |
| Uniform(a,b) | Equal over range | (a+b)/2 | (b−a)²/12 |
| Normal(μ,σ²) | Aggregated noise | μ | σ² |
| Exponential(λ) | Time between events | 1/λ | 1/λ² |

### Poisson ↔ Exponential duality

If events *arrive* as a Poisson process at rate λ (count per interval), then the *gaps between* arrivals are Exponential(λ). One counts events; the other times them. Both are the backbone of queueing theory and latency modeling.
`,
      quizTitle: "Distribution recall",
      flashcards: [
        {
          front: "What are the mean and variance of a Binomial(n, p), and why?",
          back: `Mean = **np**, Variance = **np(1−p)**. A Binomial is the sum of n independent Bernoulli(p) variables; by linearity, mean = n·p and (independence) variance = n·p(1−p).`
        },
        {
          front: "Which distributions are 'memoryless', and what does that mean?",
          back: `**Geometric** (discrete) and **Exponential** (continuous). Memoryless means the probability of waiting t more units doesn't depend on how long you've already waited: P(X > s+t | X > s) = P(X > t). A coin has no memory of prior flips.`
        },
        {
          front: "What is the signature property of the Poisson distribution?",
          back: `**Mean = Variance = λ.** It models the count of rare, independent events in a fixed interval (e.g. requests/sec), with P(X=k) = λᵏe^(−λ)/k!.`
        },
        {
          front: "State the 68–95–99.7 rule for the normal distribution.",
          back: `Approximately **68%** of the probability mass lies within **1σ** of the mean, **95%** within **2σ**, and **99.7%** within **3σ**. A value beyond 3σ is a ~0.3% event.`
        }
      ],
      quiz: [
        {
          question: "A server receives requests as a Poisson process averaging 3 per second. What is the expected time between consecutive requests?",
          options: ["3 seconds", "1/3 second", "1 second", "9 seconds"],
          answer: 1,
          explanation: `Inter-arrival times of a Poisson(λ) process are Exponential(λ) with mean 1/λ. Here λ = 3/sec, so expected gap = **1/3 second**.`
        },
        {
          question: "You flip a biased coin (P(heads) = 0.2) until the first heads. What is the expected number of flips?",
          answer: `This is Geometric(p) with p = 0.2. Expected trials = **1/p = 1/0.2 = 5 flips**.`
        },
        {
          question: "A test scores are Normal with μ = 100, σ = 15. Roughly what fraction of scores fall between 70 and 130?",
          answer: `70 and 130 are exactly μ ± 2σ (100 ± 30). By the 68–95–99.7 rule, about **95%** of scores fall in this range.`
        }
      ]
    },
    {
      id: "conditional-probability",
      title: "Conditional Probability",
      body: `## Probability, Once You Know Something

**Conditional probability** is the chance of an event **given that** another event has already happened. It's how you update your beliefs as evidence arrives.

### The definition

> **P(A | B) = P(A ∩ B) / P(B)**

Read "P(A | B)" as **"the probability of A *given* B."** In words: restrict the world to the cases where B happened, then ask what fraction of *those* also have A. The symbol **A ∩ B** ("A and B") is the event that *both* occur. (We require P(B) > 0 — you can't condition on something impossible.)

**Concrete example:** roll a fair die. Let A = "rolled a 2", B = "rolled an even number".
- P(A) = 1/6 on its own.
- But P(A | B) = P(rolled 2 *and* even) / P(even) = (1/6) / (1/2) = **1/3**. Knowing it's even shrinks the world to {2, 4, 6}, so a 2 is now 1-in-3.

### The multiplication rule (same equation, rearranged)

> **P(A ∩ B) = P(A | B) · P(B) = P(B | A) · P(A)**

Useful for chaining dependent events: P(draw two aces) = P(1st ace) · P(2nd ace | 1st ace) = (4/52) · (3/51).

### Independence

A and B are **independent** when knowing one tells you nothing about the other:

> **P(A | B) = P(A)**,  equivalently  **P(A ∩ B) = P(A) · P(B)**

Two coin flips are independent; drawing cards *without replacement* is not (the first draw changes the second's odds). **Don't confuse independent with mutually exclusive** — mutually exclusive events (can't both happen) are actually *highly dependent*: if one occurs, the other definitely didn't.

### Law of Total Probability

To find P(A) when it's easier to reason case-by-case, split the world into disjoint cases B₁, B₂, … that cover everything:

> **P(A) = P(A | B₁)·P(B₁) + P(A | B₂)·P(B₂) + …**

**Example:** two factories make bulbs. Factory 1 makes 60% (2% defective); Factory 2 makes 40% (5% defective). Overall defect rate = 0.02·0.6 + 0.05·0.4 = 0.012 + 0.020 = **3.2%**.

### Bayes' Theorem — flipping the condition

Often you know P(evidence | cause) but want P(cause | evidence). Bayes inverts it:

> **P(A | B) = P(B | A) · P(A) / P(B)**

and P(B) usually comes from the law of total probability. This is the heart of medical-test interpretation, spam filtering, and Bayesian inference — worked in full (with the base-rate trap) in the next chapter, *Key Theorems*.

### The mental model

Conditioning = **zooming into a slice of the sample space and renormalizing**. P(A | B) asks: "within the B-slice, how much is also A?" Everything else — the multiplication rule, independence, Bayes — is algebra on that one idea.
`,
      quizTitle: "Conditioning practice",
      flashcards: [
        {
          front: "Define P(A | B) and describe it in words.",
          back: `**P(A | B) = P(A ∩ B) / P(B)** — the probability of A *given* B. Restrict the world to cases where B occurred, then ask what fraction of those also have A. Requires P(B) > 0.`
        },
        {
          front: "What does it mean for events A and B to be independent?",
          back: `Knowing one gives no information about the other: **P(A | B) = P(A)**, equivalently **P(A ∩ B) = P(A)·P(B)**. Note this is *different* from mutually exclusive — mutually exclusive events are strongly dependent (if one happens the other can't).`
        },
        {
          front: "State the multiplication rule and give a use.",
          back: `**P(A ∩ B) = P(A | B)·P(B) = P(B | A)·P(A).** Chains dependent events, e.g. P(two aces in a row) = (4/52)·(3/51) — the second factor is conditioned on the first ace already being drawn.`
        },
        {
          front: "State the law of total probability.",
          back: `If B₁, B₂, … are disjoint cases covering the whole sample space, then **P(A) = Σ P(A | Bᵢ)·P(Bᵢ)**. It lets you compute an overall probability by weighting case-by-case conditional probabilities, and supplies the denominator P(B) in Bayes' theorem.`
        }
      ],
      quiz: [
        {
          question: "A family has two children. Given that at least one is a girl, what is the probability that both are girls? (Assume each child is independently a boy or girl with probability 1/2.)",
          options: ["1/2", "1/3", "1/4", "2/3"],
          answer: 1,
          explanation: `The equally-likely outcomes are {BB, BG, GB, GG}. Conditioning on "at least one girl" removes BB, leaving {BG, GB, GG} — three cases. Only GG has both girls, so P(both girls | at least one girl) = **1/3**. (A famous illustration that conditioning reshapes the sample space.)`
        },
        {
          question: "You draw 2 cards from a standard 52-card deck without replacement. What is P(both are hearts)?",
          answer: `Use the multiplication rule with dependence: P(1st heart) · P(2nd heart | 1st heart) = (13/52) · (12/51) = (1/4) · (12/51) = 12/204 = **1/17 ≈ 5.9%**.

Because we draw *without replacement*, the second probability is conditioned on the first heart already being gone (12 hearts left out of 51 cards).`
        },
        {
          question: "Two factories supply chips: A makes 70% (1% defective), B makes 30% (4% defective). What is the overall probability a random chip is defective?",
          answer: `Law of total probability: P(defective) = P(def | A)·P(A) + P(def | B)·P(B) = 0.01·0.70 + 0.04·0.30 = 0.007 + 0.012 = **0.019 = 1.9%**.`
        }
      ]
    },
    {
      id: "key-theorems",
      title: "Key Theorems & Inequalities",
      body: `## The Results That Make Statistics Work

### Law of Large Numbers (LLN)

> As the number of independent samples n → ∞, the **sample mean converges to the true mean μ**.

This is *why* averaging repeated measurements works and why casinos always win in the long run. It says nothing about *how fast* it converges — that's the CLT's job.

### Central Limit Theorem (CLT)

> The sum (or average) of many independent, identically distributed random variables is **approximately Normal**, *regardless of the original distribution's shape*.

If each Xᵢ has mean μ and variance σ², then for large n:

> sample mean X̄ ≈ Normal(μ, σ²/n)

- The **standard error** (std of the sample mean) is **σ / √n** — precision improves with the *square root* of sample size. To halve your error, you need **4×** the data.
- This is why the bell curve is everywhere: aggregate enough independent noise and you get a Gaussian.

### Bayes' Theorem

> **P(A | B) = P(B | A) · P(A) / P(B)**

It inverts conditional probabilities — turning "probability of evidence given hypothesis" into "probability of hypothesis given evidence." The engine behind spam filters, medical test interpretation, and Bayesian inference.

**Classic trap — the base rate:** A disease affects 1 in 1,000. A test is 99% accurate. You test positive. Odds you're actually sick?

> P(sick | +) = (0.99 × 0.001) / (0.99 × 0.001 + 0.01 × 0.999) ≈ **0.09 → only ~9%!**

The rare base rate (0.001) dominates: most positives are false positives. This is the **base-rate fallacy**.

### Concentration Inequalities

**Markov's inequality** (needs only non-negativity and the mean):

> P(X ≥ a) ≤ E[X] / a

**Chebyshev's inequality** (uses the variance — much tighter):

> P(|X − μ| ≥ k·σ) ≤ 1 / k²

E.g. at most 1/4 of any distribution's mass lies beyond 2σ from the mean, *whatever the distribution*. Chebyshev is how you prove the LLN.

### Expectation & Variance Rules

| Rule | Formula |
|------|---------|
| Linearity of expectation | E[X + Y] = E[X] + E[Y]  (always) |
| Scaling | E[aX + b] = a·E[X] + b |
| Variance definition | Var(X) = E[X²] − (E[X])² |
| Variance scaling | Var(aX + b) = a²·Var(X) |
| Variance of a sum (independent) | Var(X + Y) = Var(X) + Var(Y) |

Note the asymmetry: **expectation is always additive; variance is additive only under independence.**

### Correlation ≠ Causation

Correlation (Pearson's r ∈ [−1, 1]) measures *linear* association. A high r does not imply one causes the other — a lurking confounder or pure coincidence can produce it. Establishing causation needs controlled experiments or careful causal inference, not just a correlation coefficient.
`,
      quizTitle: "Theorems & inequalities",
      flashcards: [
        {
          front: "State the Central Limit Theorem and its practical consequence for sample size.",
          back: `The mean/sum of many iid variables is approximately **Normal(μ, σ²/n)** regardless of the original distribution. The standard error is **σ/√n**, so precision scales with √n — **halving error requires 4× the data.**`
        },
        {
          front: "What is Bayes' theorem, and what is the base-rate fallacy?",
          back: `**P(A|B) = P(B|A)·P(A)/P(B).** The base-rate fallacy is ignoring the prior P(A): even a 99%-accurate test for a rare (0.1%) disease yields mostly false positives, so a positive result may mean only ~9% chance of being sick.`
        },
        {
          front: "How do expectation and variance differ in how they combine over a sum?",
          back: `**E[X+Y] = E[X]+E[Y] always** (linearity, even if dependent). **Var(X+Y) = Var(X)+Var(Y) only if X, Y are independent.** Also Var(aX+b) = a²Var(X) — the constant b drops out and the scalar is squared.`
        },
        {
          front: "What does Chebyshev's inequality guarantee, and why is it useful?",
          back: `**P(|X−μ| ≥ kσ) ≤ 1/k²** for *any* distribution with finite variance. E.g. at most 25% of mass lies beyond 2σ. It's distribution-free, and it's the standard tool for proving the Law of Large Numbers.`
        }
      ],
      quiz: [
        {
          question: "You currently estimate a mean from 100 samples with standard error e. How many samples do you need to cut the standard error to e/3?",
          options: ["300", "900", "600", "10,000"],
          answer: 1,
          explanation: `Standard error = σ/√n. To divide it by 3, you must multiply √n by 3, i.e. multiply n by 3² = 9. So you need 9 × 100 = **900 samples**.`
        },
        {
          question: "A disease has prevalence 1%. A test has 90% sensitivity and 90% specificity. You test positive. Roughly what is P(disease | positive)?",
          answer: `Bayes: P(D|+) = (0.90 × 0.01) / (0.90 × 0.01 + 0.10 × 0.99) = 0.009 / (0.009 + 0.099) = 0.009 / 0.108 ≈ **8.3%**.

Despite a "90% accurate" test, a positive result means only ~8% chance of disease, because the 1% base rate is so low that false positives (from the 99% healthy) swamp true positives. **Base rates matter enormously.**`
        },
        {
          question: "X and Y are independent with Var(X) = 4 and Var(Y) = 9. What is Var(2X − Y)?",
          answer: `Var(2X − Y) = Var(2X) + Var(−Y) = 2²·Var(X) + (−1)²·Var(Y) = 4·4 + 1·9 = 16 + 9 = **25**.

Scalars square (2²=4, (−1)²=1), and variances of independent terms add — the minus sign doesn't subtract variance.`
        }
      ]
    }
  ]
}
