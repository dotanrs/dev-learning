export default {
  id: "operating-systems",
  title: "Operating Systems",
  subchapters: [
    {
      id: "threads-vs-processes",
      title: "Threads vs Processes",
      body: `## Threads vs Processes

A **process** is an independent program in execution. The OS gives each process its own isolated **address space**: code, heap, stack, and file descriptors. Isolation means one process cannot accidentally corrupt another.

A **thread** is a unit of execution that lives *inside* a process. All threads in the same process share the same address space (heap, globals, open files) but each has its own stack and register set.

## Address Space

~~~
Process A               Process B
┌─────────────┐         ┌─────────────┐
│  code/text  │         │  code/text  │
│  heap       │         │  heap       │
│  stack T1   │         │  stack T1   │
│  stack T2   │  (no    │             │
│  stack T3   │  shared │             │
│  open FDs   │  memory)│  open FDs   │
└─────────────┘         └─────────────┘
~~~

## Context Switch Cost

Switching between **threads** of the same process is cheaper: the OS only saves/restores registers and the stack pointer — the page table stays the same.

Switching between **processes** is more expensive: the OS must flush/reload the TLB and swap the entire page table, plus switch kernel accounting structures.

## Inter-Process Communication (IPC)

Because processes share nothing by default, they must use explicit IPC mechanisms:
- **Pipes / FIFOs** — byte-stream channel
- **Shared memory** (mmap/shmget) — fastest, but needs synchronisation
- **Sockets** — works across machines
- **Message queues**, **signals**

Threads communicate simply by reading/writing shared heap memory — fast but requires locks.

## When to Use Each

| Criterion | Threads | Processes |
|---|---|---|
| Isolation / fault containment | No | Yes |
| Startup cost | Low | Higher |
| Communication overhead | Low (shared memory) | Higher (IPC) |
| Parallelism on multi-core | Yes | Yes |
| Typical use | Web server worker pool, GPU pipeline | Chrome renderer tabs, microservices |

**Rule of thumb**: use threads when tasks are tightly coupled and share lots of data; use processes when you need fault isolation or security boundaries.`,
      flashcards: [
        {
          front: "What memory do threads in the same process share?",
          back: `Threads share the process's **heap**, **global/static variables**, and **open file descriptors**. Each thread has its own **stack** and **register set** (program counter, stack pointer, etc.).`
        },
        {
          front: "Why is a process context switch more expensive than a thread context switch?",
          back: `A process switch requires replacing the entire **page table** and flushing the **TLB** (Translation Lookaside Buffer), which invalidates cached virtual-to-physical address mappings. A thread switch within the same process reuses the same page table, so no TLB flush is needed.`
        },
        {
          front: "Name three IPC mechanisms available between processes.",
          back: `Common IPC mechanisms include:
1. **Pipes / FIFOs** — unidirectional byte streams
2. **Shared memory** (mmap / shmget) — fastest; needs explicit synchronisation
3. **Sockets** — bidirectional; works across hosts
4. **Message queues** — structured messages with ordering guarantees
5. **Signals** — lightweight notifications, limited data`
        }
      ],
      quiz: [
        {
          question: "Which of the following is NOT shared between threads of the same process?",
          options: ["Heap memory", "Global variables", "Stack", "Open file descriptors"],
          answer: 2,
          explanation: `Each thread has its own **stack** (local variables, return addresses, function call frames). The heap, globals, and file descriptor table are all shared among threads in the same process.`
        },
        {
          question: "A context switch between two threads of the same process is cheaper than between two processes primarily because:",
          options: [
            "Threads have smaller stacks",
            "The page table and TLB do not need to be replaced",
            "Threads run at higher CPU priority",
            "Processes require disk I/O to switch"
          ],
          answer: 1,
          explanation: `The expensive part of a process context switch is reloading the **page table** and flushing the **TLB**. Since threads share the same address space (same page table), neither step is needed, making the switch significantly cheaper.`
        },
        {
          question: "When would you choose processes over threads for a new server application feature?",
          options: [
            "When tasks need to share a large in-memory cache with low latency",
            "When you want to minimise startup overhead",
            "When tasks handle untrusted user data and a crash in one should not affect others",
            "When the tasks need to communicate frequently via shared data structures"
          ],
          answer: 2,
          explanation: `**Fault isolation** is the primary reason to choose processes. If one process crashes or is compromised, the OS prevents it from corrupting others. This is why browsers run each tab in a separate process and why microservice architectures use separate processes per service.`
        },
        {
          question: "Explain the difference between a process and a thread in terms of address space and OS resources.",
          answer: `A **process** is a self-contained execution environment with its own virtual address space, page table, heap, code segment, and file descriptor table. The OS treats it as the unit of resource ownership and isolation.

A **thread** is a lightweight unit of execution that lives inside a process. It shares the process's address space (heap, code, globals, FDs) with all other threads in that process, but maintains its own stack, program counter, and register set.

Key implications:
- Threads communicate via shared memory (fast, but need locks); processes must use IPC (pipes, sockets, shared memory with explicit setup).
- Thread creation/destruction is cheaper than process fork/exec.
- A crashing thread can corrupt the entire process; a crashing process is isolated from others.`
        }
      ]
    },
    {
      id: "locks",
      title: "Locks",
      body: `## Locks (Mutual Exclusion)

A **lock** (mutex) is a synchronisation primitive that ensures only one thread at a time executes a **critical section** — a piece of code that accesses shared mutable state.

~~~
Thread A              Thread B
lock(m)               ...waiting...
  read/modify shared  (blocked on lock)
unlock(m)     ──────▶ lock(m)
                        read/modify
                      unlock(m)
~~~

## Mutex

A **mutex** (mutual exclusion lock) is the most common type. When a thread calls \`lock()\` and the mutex is already held, the thread **blocks** (goes to sleep) and is woken up by the OS when the lock is released. This is efficient when the critical section is long or when many threads compete.

~~~c
pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;

pthread_mutex_lock(&m);
shared_counter++;          // critical section
pthread_mutex_unlock(&m);
~~~

## Spinlock

A **spinlock** keeps the thread actively looping ("spinning") on an atomic check until the lock becomes free. No OS involvement — no sleep/wake overhead.

~~~c
// conceptual busy-wait
while (atomic_test_and_set(&lock)) { /* spin */ }
// critical section
atomic_clear(&lock);
~~~

**Use spinlocks when**:
- The critical section is very short (a few instructions).
- The system has multiple cores (a spinning thread wastes CPU on a single-core machine).
- You cannot sleep — e.g., inside an interrupt handler.

**Use blocking mutexes when**:
- The critical section may take milliseconds or block on I/O.
- You have many threads competing (spinning wastes CPU).

## Contention

**Contention** occurs when multiple threads try to acquire the same lock simultaneously. High contention degrades performance and can cause threads to serialize unnecessarily. Strategies to reduce contention:
- **Fine-grained locking** — use multiple locks protecting smaller data subsets.
- **Lock-free / wait-free data structures** — use atomic CAS operations.
- **Read-write locks** — allow concurrent reads, exclusive writes.
- **Partitioning** — shard data so threads rarely share the same lock.

## Read-Write Lock

When reads vastly outnumber writes, a \`rwlock\` allows many concurrent readers but gives exclusive access to a single writer:

~~~
Multiple readers can hold a read lock simultaneously.
A writer must wait until all readers release, then gets exclusivity.
~~~`,
      flashcards: [
        {
          front: "What is a critical section?",
          back: `A **critical section** is a segment of code that accesses shared mutable state (e.g., a shared variable, data structure, or resource) and must not be executed by more than one thread at a time. It is protected by a lock: a thread acquires the lock before entering and releases it upon exit.`
        },
        {
          front: "When should you prefer a spinlock over a blocking mutex?",
          back: `Prefer a **spinlock** when:
1. The critical section is **very short** (a handful of instructions) — the cost of sleeping and waking the thread exceeds the spin time.
2. You are on a **multi-core** system — another core can run the lock holder while this one spins.
3. You **cannot sleep** — e.g., in an OS interrupt handler or non-preemptible kernel context.

Use a blocking **mutex** when the critical section may be long, involves I/O, or when many threads compete (to avoid wasting CPU cycles).`
        },
        {
          front: "What is lock contention and how can it be reduced?",
          back: `**Lock contention** is when multiple threads frequently compete for the same lock, causing threads to wait and reducing parallelism.

Reduction strategies:
- **Fine-grained locking** — split one big lock into many smaller locks (e.g., per-row DB locks).
- **Read-write locks** — allow concurrent readers.
- **Lock-free algorithms** — use atomic CAS operations instead.
- **Data partitioning / sharding** — different threads own different data subsets.`
        }
      ],
      quiz: [
        {
          question: "A spinlock is most appropriate in which scenario?",
          options: [
            "A critical section that may perform disk I/O",
            "A critical section consisting of a single integer increment on a multi-core system",
            "A web server request handler that holds the lock for up to 50 ms",
            "A single-core embedded system with many competing threads"
          ],
          answer: 1,
          explanation: `A spinlock is ideal when the critical section is **extremely short** (like a single integer increment) on a **multi-core** machine. The cost of the thread sleeping and being woken up by the OS would exceed the time spent spinning. Disk I/O or long operations make spinlocks wasteful; single-core systems waste CPU because the lock holder cannot run while another thread spins.`
        },
        {
          question: "What is the difference between a mutex and a read-write lock?",
          options: [
            "A mutex allows multiple readers; a read-write lock allows only one",
            "A mutex gives exclusive access to one thread; a read-write lock allows concurrent readers but exclusive writers",
            "A read-write lock is always faster than a mutex",
            "There is no difference; they are the same primitive"
          ],
          answer: 1,
          explanation: `A **mutex** gives exclusive access to exactly one thread at a time, regardless of whether that thread reads or writes. A **read-write lock** (rwlock) distinguishes read and write operations: multiple threads may hold a read lock concurrently, but a write lock is exclusive. This improves throughput in read-heavy workloads.`
        },
        {
          question: "What happens to a thread that calls lock() on an already-held blocking mutex?",
          options: [
            "It immediately returns an error code",
            "It spins in user space until the lock is free",
            "It is put to sleep by the OS and woken when the lock is released",
            "It acquires a second copy of the lock"
          ],
          answer: 2,
          explanation: `With a blocking mutex, the OS **suspends the calling thread** (moves it off the CPU run queue) and records it as waiting for that mutex. When the holder calls \`unlock()\`, the OS wakes one of the waiting threads (typically via a futex on Linux), which then re-tries acquiring the lock.`
        },
        {
          question: "Describe two techniques to reduce lock contention in a high-throughput system.",
          answer: `**1. Fine-grained locking**: Instead of one global lock protecting an entire data structure (e.g., a hash map), use one lock per bucket or shard. Threads operating on different parts of the data structure no longer block each other.

**2. Read-write locks**: If most operations are reads and writes are infrequent, a \`pthread_rwlock_t\` (or equivalent) lets many reader threads proceed in parallel. Only writers acquire an exclusive lock. This can dramatically improve throughput in read-heavy workloads like caches.

Other valid answers: lock-free data structures using atomic CAS, thread-local storage to avoid sharing, or designing algorithms to minimize shared state.`
        }
      ]
    },
    {
      id: "deadlocks",
      title: "Deadlocks",
      body: `## Deadlocks

A **deadlock** is a situation where two or more threads are permanently blocked, each waiting for a resource held by another.

~~~
Thread A: holds Lock 1, waits for Lock 2
Thread B: holds Lock 2, waits for Lock 1
          ──▶ neither can proceed
~~~

## The Four Coffman Conditions

All four must hold simultaneously for a deadlock to occur:

| # | Condition | Description |
|---|---|---|
| 1 | **Mutual Exclusion** | Resources cannot be shared; only one thread at a time |
| 2 | **Hold and Wait** | A thread holds at least one resource while waiting for another |
| 3 | **No Preemption** | Resources can only be released voluntarily by the holder |
| 4 | **Circular Wait** | A cycle exists in the resource-wait graph: T1→R1→T2→R2→T1 |

## Prevention

Eliminate at least one Coffman condition:
- **Break Circular Wait** (most practical): enforce a **global lock ordering**. Always acquire locks in the same order (e.g., by memory address or ID). If all threads lock L1 before L2, the cycle cannot form.
- **Break Hold and Wait**: acquire all locks atomically at the start, or release all held locks before requesting more.
- **Allow Preemption**: if a thread cannot acquire a resource, it releases all its held resources and retries.

## Avoidance — Banker's Algorithm

Avoidance requires knowing resource needs in advance. The **Banker's Algorithm** checks at each allocation request whether granting it could leave the system in an **unsafe state** (where no safe completion sequence exists). If unsafe, the request is denied until it becomes safe.

It is mainly theoretical — real systems rarely know maximum resource demands upfront.

## Detection and Recovery

Allow deadlocks to occur, then detect and recover:
- **Detection**: Periodically build a resource-allocation graph and search for cycles.
- **Recovery options**:
  - Kill one or more deadlocked processes.
  - Forcibly preempt resources from a victim thread (rollback).

## Lock Ordering in Practice

~~~c
// DEADLOCK RISK — inconsistent order
Thread A: lock(account_A); lock(account_B);
Thread B: lock(account_B); lock(account_A);  // reversed!

// SAFE — always lock lower ID first
void transfer(Account *src, Account *dst) {
    Account *first  = (src->id < dst->id) ? src : dst;
    Account *second = (src->id < dst->id) ? dst : src;
    lock(first->mutex);
    lock(second->mutex);
    // ... transfer ...
    unlock(second->mutex);
    unlock(first->mutex);
}
~~~`,
      flashcards: [
        {
          front: "What are the four Coffman conditions for deadlock?",
          back: `1. **Mutual Exclusion** — resources are non-shareable (only one holder at a time).
2. **Hold and Wait** — a thread holds a resource while waiting to acquire another.
3. **No Preemption** — resources are released only voluntarily by the holder.
4. **Circular Wait** — a circular chain of threads, each waiting for a resource held by the next.

All four must hold simultaneously for a deadlock to exist.`
        },
        {
          front: "How does lock ordering prevent deadlocks?",
          back: `**Lock ordering** (also called lock hierarchy) requires that all threads acquire multiple locks in a globally consistent order (e.g., always by ascending lock ID or memory address).

This breaks the **Circular Wait** Coffman condition: if every thread acquires L1 before L2, no thread holding L2 will ever wait for L1, so no cycle can form in the wait graph.`
        },
        {
          front: "What is the difference between deadlock prevention and deadlock avoidance?",
          back: `**Prevention**: Structurally eliminate at least one Coffman condition at design time (e.g., enforce global lock ordering). Simple and common in practice.

**Avoidance**: At runtime, before granting a resource request, check whether doing so could lead to an unsafe state (Banker's Algorithm). Requires knowing each process's maximum resource needs in advance — impractical in most real systems.`
        }
      ],
      quiz: [
        {
          question: "Which Coffman condition is most commonly broken in practice to prevent deadlocks?",
          options: [
            "Mutual Exclusion",
            "Hold and Wait",
            "No Preemption",
            "Circular Wait"
          ],
          answer: 3,
          explanation: `**Circular Wait** is the most practical condition to eliminate. It is broken by enforcing a **total ordering on lock acquisition** — all threads must acquire locks in the same global order. This is cheap to implement (compare lock IDs) and requires no runtime overhead. Breaking Mutual Exclusion is often impossible (resources genuinely can't be shared); breaking Hold and Wait or No Preemption usually requires complex rollback logic.`
        },
        {
          question: "Thread A holds mutex M1 and waits for M2. Thread B holds M2 and waits for M1. Which Coffman condition is violated that COULD be eliminated to prevent this deadlock?",
          options: [
            "Mutual Exclusion — make mutexes sharable",
            "Circular Wait — enforce lock acquisition order M1 before M2 for all threads",
            "No Preemption — mutexes are already preemptible",
            "Hold and Wait — threads never hold locks"
          ],
          answer: 1,
          explanation: `The scenario shows a classic **Circular Wait**: A→M2→B→M1→A. The simplest fix is to enforce that all threads must acquire M1 before M2. Thread B would then have to acquire M1 first, blocking until A releases it — preventing the cycle. Making mutexes sharable would break mutual exclusion and cause data races.`
        },
        {
          question: "The Banker's Algorithm is an example of deadlock:",
          options: ["Prevention", "Avoidance", "Detection", "Recovery"],
          answer: 1,
          explanation: `The **Banker's Algorithm** is a deadlock **avoidance** scheme. It checks at each resource allocation request whether granting it would leave the system in a **safe state** (a state from which all processes can eventually complete). If the resulting state would be unsafe, the request is deferred. This is avoidance — not prevention (which changes structure) and not detection (which finds existing deadlocks).`
        },
        {
          question: "Describe how you would implement deadlock-safe bank account transfers using lock ordering.",
          answer: `The classic approach is to always lock accounts in a **consistent global order** — for example, by ascending account ID — regardless of which is the source and which is the destination.

~~~c
void transfer(Account *src, Account *dst, int amount) {
    // Determine acquisition order by ID
    Account *first  = (src->id < dst->id) ? src : dst;
    Account *second = (src->id < dst->id) ? dst : src;

    lock(&first->mutex);
    lock(&second->mutex);

    src->balance -= amount;
    dst->balance += amount;

    unlock(&second->mutex);
    unlock(&first->mutex);
}
~~~

Why this works: if Thread A transfers from account 1→2 and Thread B transfers from account 2→1, both threads will attempt to lock account 1 first. One succeeds and proceeds; the other blocks. No circular wait can form, so deadlock is impossible. Locks are released in reverse acquisition order (LIFO) as a best practice.`
        }
      ]
    },
    {
      id: "scheduling",
      title: "Scheduling",
      body: `## CPU Scheduling

The **scheduler** decides which ready thread/process runs on the CPU next. Good scheduling maximises CPU utilisation, minimises latency, and ensures fairness.

## Preemptive vs Cooperative

- **Cooperative (non-preemptive)**: A process runs until it voluntarily yields (calls \`yield()\`, sleeps, or exits). Simple but a single runaway process starves others. (Classic Mac OS, early Windows.)
- **Preemptive**: The OS can interrupt a running process at any time via a **timer interrupt** and switch to another. Modern general-purpose OSes are preemptive.

## Common Algorithms

### FCFS — First Come, First Served
Simple queue. Long jobs block short ones (**convoy effect**). Non-preemptive.

### SJF — Shortest Job First
Schedule the job with the smallest expected burst time next. Optimal average waiting time, but requires knowing future burst lengths (or estimating via exponential averaging). Can starve long jobs.

### Round Robin (RR)
Each process gets a fixed **time quantum** (e.g., 10 ms). After the quantum expires, it is preempted and moved to the back of the ready queue. Fair; average response time depends on quantum size:
- Large quantum → behaves like FCFS.
- Small quantum → more context switches, higher overhead.

### Priority Scheduling
Each process has a priority; the highest-priority ready process runs. Can cause **starvation** of low-priority processes. Fix: **aging** — gradually raise priority of waiting processes.

### MLFQ — Multi-Level Feedback Queue
Several priority queues. New jobs start at the highest priority (short quantum). If they use their full quantum, they drop to a lower queue (longer quantum). CPU-bound jobs sink; interactive/I/O-bound jobs stay high. Used in real OSes (Linux CFS is conceptually similar).

~~~
Queue 0 (quantum 8ms)  ──▶ new/interactive jobs
Queue 1 (quantum 16ms) ──▶ medium jobs
Queue 2 (FCFS)         ──▶ long CPU-bound jobs
~~~

## Starvation

A process is **starved** when it never gets CPU time because higher-priority processes always preempt it. Mitigations:
- **Aging**: increase priority over time.
- **Lottery scheduling**: each process holds tickets; scheduler draws randomly — low-priority jobs get proportional CPU time.`,
      flashcards: [
        {
          front: "What is the convoy effect in FCFS scheduling?",
          back: `In **First-Come-First-Served** (FCFS) scheduling, a long CPU-bound job at the front of the queue blocks all shorter jobs behind it, even if they need only milliseconds. This is the **convoy effect** — many short processes wait behind one long process, inflating average waiting time. SJF and Round Robin avoid this problem.`
        },
        {
          front: "How does MLFQ scheduling balance interactivity and throughput?",
          back: `**Multi-Level Feedback Queue (MLFQ)** uses multiple queues with decreasing priority and increasing time quanta:

1. New processes start in the highest-priority queue (short quantum).
2. If a process uses its entire quantum (CPU-bound), it drops to a lower-priority queue with a longer quantum.
3. If a process yields before the quantum expires (I/O-bound / interactive), it stays at high priority.

This naturally promotes interactive tasks (which respond quickly) while gradually demoting long CPU-bound batch jobs.`
        },
        {
          front: "What is starvation and how is it fixed with aging?",
          back: `**Starvation** occurs when a low-priority process never receives CPU time because higher-priority processes are always ready to run.

**Aging** is the fix: the scheduler periodically boosts the priority of processes that have been waiting for a long time. Eventually the starved process's effective priority rises high enough to be scheduled.`
        }
      ],
      quiz: [
        {
          question: "Which scheduling algorithm produces the minimum average waiting time for a known set of jobs?",
          options: [
            "Round Robin with quantum = 1ms",
            "First Come, First Served",
            "Shortest Job First (non-preemptive)",
            "Priority scheduling"
          ],
          answer: 2,
          explanation: `**Shortest Job First (SJF)** is provably optimal for minimising average waiting time when burst times are known in advance. By always running the shortest remaining job first, it minimises the total time other jobs spend waiting. The downside is that burst times are rarely known; in practice, systems estimate them using exponential averaging of past behaviour.`
        },
        {
          question: "In Round Robin scheduling, what happens when the time quantum is set very small (e.g., 1 microsecond)?",
          options: [
            "All jobs finish faster due to more frequent scheduling",
            "Context switch overhead dominates, wasting CPU time",
            "Long jobs get priority over short jobs",
            "The scheduler degenerates into FCFS"
          ],
          answer: 1,
          explanation: `A very small quantum means the CPU spends most of its time **saving and restoring thread state** (context switching) rather than doing useful work. The overhead can dominate actual execution time. Conversely, a very large quantum makes RR behave like FCFS, losing responsiveness. A typical quantum is 10–100 ms, balancing context-switch cost and interactivity.`
        },
        {
          question: "A process has been waiting in the ready queue for a very long time and never gets scheduled. This is called:",
          options: ["Deadlock", "Thrashing", "Starvation", "Context switch overhead"],
          answer: 2,
          explanation: `This is **starvation** — a process is perpetually denied CPU time. It differs from deadlock (threads are blocked waiting for each other, not merely deprioritised) and thrashing (excessive paging). Starvation is commonly solved with **aging**: gradually increasing the priority of waiting processes so they eventually get scheduled.`
        },
        {
          question: "Explain the difference between preemptive and cooperative scheduling and give an example of each.",
          answer: `**Cooperative scheduling**: A process runs until it *voluntarily* yields control to the OS — by calling a yield/sleep/IO syscall or exiting. The OS cannot forcibly interrupt it. This is simple to implement (no timer interrupts needed) but fragile: a misbehaving or infinite-loop process can starve all others.
- Example: Original Mac OS (before OS X), early versions of Windows 3.x, many real-time microcontroller schedulers.

**Preemptive scheduling**: The OS configures a hardware timer to fire periodically. On each timer interrupt, the scheduler evaluates whether to switch to a different process. No process can monopolise the CPU indefinitely.
- Example: Linux, Windows NT/10/11, macOS (since OS X) — all modern general-purpose operating systems.

Most modern OSes also use preemptive scheduling with priority so that high-priority tasks (I/O drivers, interactive processes) can interrupt low-priority CPU-bound work.`
        }
      ]
    },
    {
      id: "virtual-memory",
      title: "Virtual Memory",
      body: `## Virtual Memory

**Virtual memory** is an abstraction that gives each process the illusion of having its own large, contiguous address space, independent of physical RAM.

## Virtual vs Physical Address

- A **virtual address** is what your program uses (e.g., pointer value \`0x7fff5abc\`). It lives in the process's address space.
- A **physical address** is the actual location in RAM chips.

The hardware **Memory Management Unit (MMU)** translates virtual → physical on every memory access.

~~~
Process A (virtual)          Physical RAM
  0x0000 ──────────────────▶  frame 42  (4 KB)
  0x1000 ──────────────────▶  frame 7   (4 KB)
  0x2000 ──────── page fault ▶ on disk (not loaded)

Process B (virtual)
  0x0000 ──────────────────▶  frame 91  (different frame!)
~~~

## Why Virtual Memory?

1. **Isolation**: Each process has its own address space; it cannot read/write another's memory.
2. **More memory than RAM**: Pages can be swapped to disk; the process can use more virtual memory than physical RAM.
3. **Simplified loading**: Every process can be compiled to start at address 0; the OS maps it to wherever physical memory is free.
4. **Shared libraries**: Multiple processes can map the same physical frames (e.g., \`libc\`) into their own virtual address spaces (read-only), saving RAM.
5. **Memory protection**: Pages can be marked read-only, no-execute, kernel-only — enforced by the MMU.

## The MMU and Address Translation

The MMU uses a **page table** (stored in RAM, pointed to by a CPU register like \`CR3\` on x86) to look up each virtual page number and find the physical frame. The **TLB** (Translation Lookaside Buffer) caches recent translations so most lookups cost ~1 cycle instead of traversing the page table in RAM.

## Protection

Each page table entry carries **permission bits**: read, write, execute, user/kernel. If a process tries to write to a read-only page (e.g., code segment), the MMU raises a **protection fault** and the OS delivers SIGSEGV to the process.`,
      flashcards: [
        {
          front: "What problem does virtual memory solve that physical-address-only systems cannot?",
          back: `Virtual memory solves several key problems:
1. **Isolation**: Processes cannot access each other's memory (each has its own address space).
2. **Overcommit**: A process's virtual address space can exceed physical RAM — pages are loaded on demand from disk.
3. **Relocation**: All programs can be compiled to the same base address (e.g., 0); the OS maps them to free physical frames.
4. **Sharing**: Multiple processes can share the same physical frames (e.g., libc) via separate virtual mappings, saving memory.`
        },
        {
          front: "What is the MMU and what does it do?",
          back: `The **Memory Management Unit (MMU)** is a hardware component (usually part of the CPU) that automatically translates every **virtual address** generated by the program into a **physical address** in RAM.

It uses the **page table** (set up by the OS in RAM) for translation. For performance, the MMU caches recent translations in the **TLB** (Translation Lookaside Buffer). If a page isn't in RAM, the MMU triggers a **page fault**, letting the OS load the page from disk.`
        },
        {
          front: "What is a memory protection fault and what causes it?",
          back: `A **protection fault** (segmentation fault / SIGSEGV) occurs when a process attempts a memory access that violates the **permission bits** in the page table entry:
- Writing to a **read-only** page (e.g., code segment, shared library)
- Reading from a **kernel-only** page in user mode
- Executing from a **no-execute (NX)** page

The MMU detects the violation and raises a hardware exception. The OS catches it, typically delivering SIGSEGV to the offending process and terminating it.`
        }
      ],
      quiz: [
        {
          question: "Two processes both have a pointer with virtual address 0x1000. What is true?",
          options: [
            "They point to the same physical memory location",
            "This is a memory error — two processes cannot share virtual addresses",
            "They likely point to different physical memory frames",
            "The OS will terminate one of the processes"
          ],
          answer: 2,
          explanation: `Virtual addresses are **per-process**. Each process has its own page table, so virtual address \`0x1000\` in Process A maps to a different physical frame than \`0x1000\` in Process B. This is the core isolation guarantee of virtual memory. (Exception: if both processes intentionally set up shared memory via mmap, the same virtual address could intentionally map to the same physical frame — but that requires explicit OS calls.)`,
        },
        {
          question: "The TLB (Translation Lookaside Buffer) is best described as:",
          options: [
            "A region of virtual memory reserved for the OS kernel",
            "A cache of recent virtual-to-physical address translations in the MMU",
            "A hardware register that stores the current process's base address",
            "A queue of pending page faults"
          ],
          answer: 1,
          explanation: `The **TLB** is a small, fast cache inside the MMU that stores recently used virtual-page-to-physical-frame mappings. Without the TLB, every memory access would require walking the page table in RAM (potentially several RAM accesses for multi-level page tables). The TLB makes translation nearly free for frequently accessed pages. On a context switch to a different process, the TLB is typically flushed (or tagged with an ASID) to prevent one process seeing another's translations.`
        },
        {
          question: "Virtual memory allows a process to use more memory than physical RAM because:",
          options: [
            "The OS compresses data in RAM",
            "Pages not currently needed can be stored on disk and loaded on demand",
            "Processes share all their memory with each other",
            "The CPU can address more bits than RAM has locations"
          ],
          answer: 1,
          explanation: `The OS can **evict** (swap out) pages that haven't been used recently from RAM to a swap file/partition on disk. The page table marks those pages as not present. When the process accesses such a page, a **page fault** fires, the OS loads the page back into a free frame, updates the page table, and resumes the process. This demand paging lets the combined virtual memory of all processes exceed physical RAM.`
        },
        {
          question: "Explain how virtual memory enables process isolation.",
          answer: `Each process has its own **page table**, which is the sole mapping between its virtual addresses and physical memory. The OS sets up the page table when the process is created and switches the MMU to use the process's page table on each context switch (by updating a privileged CPU register, e.g., \`CR3\` on x86).

Because each process has a *separate* page table:
- Process A's virtual address 0x1000 maps to frame X; Process B's 0x1000 maps to frame Y.
- There is no path for Process A to generate a virtual address that maps to any of Process B's frames (unless the OS explicitly sets up shared memory).

Additionally, page table entries carry **permission bits** (read/write/execute/user-kernel). The MMU enforces these on every access — a user-space process cannot read kernel memory even if it guesses the kernel's virtual address, because those pages are marked kernel-only.

If a process attempts an illegal access, the MMU raises a **protection fault**, the OS catches it, and typically delivers SIGSEGV, terminating the offending process without affecting others.`
        }
      ]
    },
    {
      id: "paging",
      title: "Paging",
      body: `## Paging

**Paging** is the mechanism that implements virtual memory. Virtual and physical address spaces are divided into fixed-size chunks:

- **Page**: fixed-size block in the virtual address space (typically 4 KB on x86-64).
- **Frame**: same-sized block in physical RAM.
- The **page table** maps page numbers → frame numbers.

## Address Translation

A virtual address is split into:

~~~
Virtual Address (64-bit, 4 KB pages):
  [ virtual page number (VPN) | page offset ]
                52 bits            12 bits
~~~

The MMU looks up VPN in the page table to get the **physical frame number (PFN)**, then appends the unchanged page offset:

~~~
Physical address = PFN * 4096 + page_offset
~~~

Modern x86-64 uses a 4-level (or 5-level) page table to keep per-process tables manageable.

## TLB

The **Translation Lookaside Buffer** caches (VPN → PFN) mappings. Most accesses hit the TLB (~1 cycle). A **TLB miss** triggers a page-table walk (~10–100 cycles, multiple RAM reads). A **TLB flush** on context switch is expensive on large working sets.

## Page Faults

When the MMU finds a page table entry marked **not present**, it triggers a **page fault** trap. The OS:
1. Checks if the access is legal (is the VPN in a valid VMA?).
2. If illegal → SIGSEGV.
3. If legal → allocates a frame, loads the page from disk/file, updates the page table, resumes the process.

## Page Replacement Algorithms

When RAM is full and a new page must be loaded, the OS must **evict** a frame. Goal: evict the page least likely to be needed soon.

| Algorithm | Description | Notes |
|---|---|---|
| **OPT** | Evict the page used furthest in the future | Optimal but requires future knowledge; theoretical |
| **LRU** | Evict the least recently used page | Good approximation of OPT; expensive exact impl |
| **Clock (Second-Chance)** | Circular buffer; pages get a "use" bit; on eviction sweep, clear use bit first, evict on second pass | Efficient LRU approximation used in Linux |
| **FIFO** | Evict oldest loaded page | Simple; suffers Belady's anomaly |

## Thrashing

**Thrashing** occurs when the system spends more time handling page faults than running processes — the working set of all processes exceeds available RAM. The OS continuously swaps pages in and out with no progress. Fix: reduce multiprogramming (run fewer processes) or add RAM.`,
      flashcards: [
        {
          front: "How is a virtual address split to perform paging address translation?",
          back: `A virtual address is split into two parts:
1. **Virtual Page Number (VPN)** — the high-order bits that index into the page table to find the physical frame number (PFN).
2. **Page Offset** — the low-order bits (e.g., 12 bits for 4 KB pages) that are copied unchanged to the physical address.

Physical address = PFN (from page table lookup) concatenated with the page offset.`
        },
        {
          front: "What happens when a page fault occurs?",
          back: `A **page fault** is triggered when the MMU finds a page table entry marked "not present". The OS:
1. Determines whether the access is **valid** (within an allocated virtual memory area).
2. If invalid → sends SIGSEGV to the process.
3. If valid → finds a free physical frame (evicting another page if necessary), loads the requested page from disk or a file, updates the page table entry to "present", and **resumes** the faulting instruction.

The process is unaware a fault occurred — it appears as a slight delay.`
        },
        {
          front: "What is thrashing and what causes it?",
          back: `**Thrashing** is when the OS spends the majority of its time swapping pages in and out of disk, leaving little time for actual computation.

Cause: the combined **working set** (set of pages actively used) of all running processes exceeds available physical RAM. Every time one process gets the pages it needs, another process's pages get evicted, triggering a fault when that process runs.

Fix: reduce the number of concurrent processes (swap out entire processes) or add more RAM.`
        }
      ],
      quiz: [
        {
          question: "Given 4 KB pages, what is the page offset for virtual address 0x5A3F?",
          options: ["0x5", "0xA3F", "0x5A", "0x3F"],
          answer: 1,
          explanation: `4 KB = 4096 = 2^12 bytes, so the page offset is the **lower 12 bits** of the address. 0x5A3F in binary: the lower 12 bits (3 hex digits) = **0xA3F**. The upper bits (0x5) form the virtual page number. Physical address = physical_frame_base + 0xA3F.`
        },
        {
          question: "The Clock (Second-Chance) page replacement algorithm approximates which other algorithm?",
          options: ["OPT (Optimal)", "FIFO", "LRU (Least Recently Used)", "Random replacement"],
          answer: 2,
          explanation: `The **Clock algorithm** is an efficient approximation of **LRU**. It maintains a circular list of pages, each with a "reference bit" set by hardware when the page is accessed. On eviction, the algorithm sweeps the clock hand: if the reference bit is set, it clears it (giving the page a "second chance") and moves on; if the bit is clear, it evicts that page. This approximates LRU without the high cost of tracking exact access order.`
        },
        {
          question: "Which of the following best describes Belady's anomaly?",
          options: [
            "Adding more RAM always reduces page faults",
            "With FIFO replacement, adding more frames can increase page faults",
            "LRU always performs better than OPT",
            "Thrashing only occurs with Round Robin scheduling"
          ],
          answer: 1,
          explanation: `**Belady's anomaly** is the counterintuitive result that with **FIFO** page replacement, allocating *more* physical frames can *increase* the number of page faults for certain reference strings. This anomaly does not affect LRU or Clock, which are **stack algorithms** (adding a frame always reduces or maintains fault rates). It is a theoretical curiosity that motivates using LRU-approximating algorithms.`
        },
        {
          question: "Describe what happens step-by-step when a process accesses a virtual address whose page is not in physical memory.",
          answer: `1. The CPU generates the virtual address and sends it to the MMU.
2. The MMU looks up the virtual page number in the TLB — **TLB miss**.
3. The MMU walks the page table (in RAM) for this process — the page table entry has the **present bit = 0**.
4. The MMU raises a **page fault** hardware exception and transfers control to the OS kernel's page fault handler.
5. The OS determines the faulting virtual address (from a register like \`CR2\` on x86).
6. The OS checks whether the address belongs to a valid **Virtual Memory Area (VMA)** for this process. If not → SIGSEGV.
7. If valid, the OS finds or evicts a **free physical frame** (running a page replacement algorithm if necessary).
8. The OS issues a disk I/O request to read the required page from the swap file or backing file.
9. While waiting for I/O, the OS may context-switch to another process.
10. When I/O completes, the OS updates the page table entry: inserts the physical frame number and sets present = 1.
11. The OS flushes the TLB entry and resumes the faulting instruction.
12. The instruction re-executes — this time the MMU finds the page present and the access succeeds.

The process experiences this as a pause (microseconds to milliseconds) but is otherwise unaware.`
        }
      ]
    },
    {
      id: "mmap",
      title: "mmap",
      body: `## mmap — Memory-Mapped Files

\`mmap()\` is a syscall that **maps a file (or anonymous memory) into the process's virtual address space**. After the call, the process can read/write the file simply by reading/writing memory — no explicit \`read()\`/\`write()\` calls needed.

~~~c
// Map a file into memory
int fd = open("data.bin", O_RDWR);
void *ptr = mmap(NULL, file_size, PROT_READ | PROT_WRITE,
                 MAP_SHARED, fd, 0);
// Now ptr[0..file_size-1] mirrors the file contents
memcpy(ptr + offset, new_data, len);  // writes to file (eventually)
munmap(ptr, file_size);
~~~

## File-Backed vs Anonymous

| Type | Backing | Use |
|---|---|---|
| **File-backed** | A file on disk | Load executables, shared libs, databases, large data files |
| **Anonymous** | Swap space (no file) | Process heap (\`malloc\`), thread stacks, IPC shared memory |

## Lazy Loading

The OS does **not** immediately read the entire file into RAM. It creates page table entries marked "not present." When the program touches a page for the first time, a **page fault** fires, and the OS loads that 4 KB page from disk. This is **demand paging** — only the accessed pages are loaded, making startup fast even for large files.

## Shared vs Private Mappings

- **MAP_SHARED**: Writes are visible to other processes that map the same file and are written back to disk.
- **MAP_PRIVATE**: Copy-on-write — the process gets its own private copy of modified pages; original file is unchanged.

## mmap vs read/write

| | mmap | read/write |
|---|---|---|
| Copy overhead | Zero-copy (page directly mapped) | Data copied kernel → user buffer |
| Random access | Efficient (OS caches at page level) | Requires lseek + read per access |
| Large files | Excellent — only accessed pages in RAM | Must read sequentially or manage manually |
| Small sequential | Slight overhead (page fault setup) | Efficient with buffered I/O |
| Simplicity | Pointer arithmetic | Explicit read/write calls |

## Common Use Cases

- **Executable loading**: The kernel mmaps ELF segments (code, data) of a binary. Code pages are file-backed, shared, read-only. BSS (zero-initialized data) is anonymous.
- **Shared libraries**: \`libc.so\` is mmapped once and its physical pages are shared across all processes.
- **Databases (e.g., SQLite, LMDB)**: Use mmap to access the database file as a byte array for zero-copy reads.
- **IPC**: Two processes can mmap the same file with MAP_SHARED to exchange data.`,
      flashcards: [
        {
          front: "What is the difference between MAP_SHARED and MAP_PRIVATE in mmap?",
          back: `**MAP_SHARED**: The mapping is shared with other processes mapping the same file. Writes by one process are visible to others and are eventually written back to the underlying file.

**MAP_PRIVATE**: The OS uses **copy-on-write (COW)**. The mapping initially shares pages with the file, but on the first write, the OS creates a private copy of that page for the process. The original file is not modified, and other processes do not see the changes.`
        },
        {
          front: "Why does mmap provide zero-copy access compared to read()?",
          back: `With \`read()\`, data travels: **disk → kernel page cache → user-space buffer** (one extra copy from kernel to user).

With \`mmap()\`, the kernel maps the **page cache pages directly into the process's address space**. The process accesses the same physical frames the kernel uses for caching, with no copy. This is particularly beneficial for large files or random access patterns where the copy overhead would be significant.`
        },
        {
          front: "How does mmap implement lazy loading?",
          back: `When \`mmap()\` is called, the OS only creates **page table entries marked "not present"** — no actual I/O occurs. When the process first accesses a page within the mapped range, the MMU triggers a **page fault**. The OS then reads that specific 4 KB page from disk into a physical frame, updates the page table, and resumes execution.

This means a 1 GB file can be mapped instantly; only the pages actually touched are loaded into RAM.`
        }
      ],
      quiz: [
        {
          question: "An application needs to randomly access small records scattered throughout a 10 GB database file. Which I/O approach is most efficient?",
          options: [
            "Sequential read() of the entire file into a buffer",
            "mmap() the file and access records as memory",
            "read() with a 1-byte buffer on every access",
            "write() the entire file to a temporary file first"
          ],
          answer: 1,
          explanation: `**mmap** is ideal for large files with random access. The OS's page cache handles caching at the 4 KB granularity — only the pages containing the accessed records are loaded. Sequential \`read()\` would waste I/O and memory reading irrelevant pages. \`read()\` with small buffers would incur syscall overhead on every access. mmap amortises the setup cost over many random accesses.`
        },
        {
          question: "What is copy-on-write (COW) in the context of MAP_PRIVATE?",
          options: [
            "The OS immediately copies the entire file into private memory",
            "Pages are shared with the file until the first write, when a private copy is made",
            "Writes are copied to the file on disk but not visible to other processes",
            "COW prevents any writes to the mapped region"
          ],
          answer: 1,
          explanation: `With **MAP_PRIVATE + COW**, initially all pages are shared with the file's pages in the page cache (read-only). When the process first **writes** to a page, the MMU triggers a protection fault. The OS then allocates a new physical frame, copies the original page content into it, marks the new page read-write, and updates the process's page table to point to the new frame. The original file page is unchanged and unaffected.`
        },
        {
          question: "When a process calls mmap() to map a 100 MB file, how much physical RAM is allocated immediately?",
          options: [
            "100 MB — the entire file is loaded",
            "4 KB — one page is pre-loaded",
            "None — pages are loaded on demand via page faults",
            "50 MB — half the file is loaded speculatively"
          ],
          answer: 2,
          explanation: `**Zero bytes** of the file are immediately loaded. \`mmap()\` only sets up virtual memory mappings (page table entries marked not present). Physical RAM is allocated **lazily** — only when the process actually accesses a page does a page fault fire and the OS load that page from disk. This makes \`mmap()\` very fast to set up even for very large files.`
        },
        {
          question: "Describe two use cases where mmap is preferable to read/write, and explain why.",
          answer: `**1. Large file random access (e.g., database engines)**:
A database like SQLite or LMDB maps the entire database file with \`mmap()\`. When it needs a record, it simply dereferences a pointer — the OS page cache handles caching, prefetching, and eviction transparently. Alternative: \`lseek()\` + \`read()\` per record incurs syscall overhead and an extra kernel→user copy on each read. mmap eliminates both: no repeated syscalls and zero-copy access to the kernel's page cache.

**2. Loading shared libraries and executables**:
The Linux kernel uses mmap to load ELF binary segments. The code segment is mapped file-backed, shared, and read-only — all processes using the same library share the *same physical pages* (only one copy in RAM for all 100 processes using libc). With \`read()\`, each process would need its own copy. Additionally, lazy loading means only the code paths actually executed are paged in.

**When read/write is better**: Small sequential files or streaming data where you process the file once end-to-end. mmap has setup overhead (page table entries, page faults) that exceeds the savings for small or short-lived files.`
        }
      ]
    },
    {
      id: "file-systems",
      title: "File Systems",
      body: `## File Systems

A **file system** organises data on persistent storage (disk, SSD) into files and directories, providing named, persistent storage with access control.

## Inodes

An **inode** (index node) is a data structure on disk storing metadata about a file:
- File size, permissions (mode), owner UID/GID
- Timestamps (created, modified, accessed)
- **Pointers to data blocks** on disk (direct, indirect, doubly-indirect)

An inode does **not** store the file name — names live in directory entries.

~~~
Directory entry: "config.txt" → inode #1842
Inode #1842: size=4096, mode=644, blocks=[block 500, block 501]
Block 500: first 4096 bytes of file content
Block 501: next 4096 bytes of file content
~~~

## Directories

A **directory** is itself a file whose content is a list of **(name → inode number)** pairs. Looking up \`/usr/bin/ls\`:
1. Start at root inode (always inode 2).
2. Read root directory entries, find "usr" → inode X.
3. Read inode X's directory entries, find "bin" → inode Y.
4. Read inode Y's directory entries, find "ls" → inode Z.
5. Read inode Z to get the file's data blocks.

## Hard Links vs Soft Links

| | Hard link | Soft (symbolic) link |
|---|---|---|
| Points to | inode directly | Another file path (a string) |
| Works after original deleted | Yes (inode refcount > 0) | No (dangling link) |
| Can cross filesystems | No | Yes |
| Implementation | Directory entry with same inode | Special file with path string |

## Journaling

Without journaling, a crash mid-write can leave the filesystem **inconsistent** (e.g., a directory entry points to an unallocated inode). **Journaling** filesystems (ext4, NTFS, HFS+) write a **journal entry** (describing the intended changes) before applying them to the main filesystem. On crash recovery, the OS replays or discards incomplete journal entries. This provides **crash consistency** at the cost of some write overhead.

## Page Cache

The OS keeps recently read/written file blocks in RAM (the **page cache**). This dramatically speeds up repeated reads — the same physical file pages used by mmap are the page cache. Writes are buffered (write-back) and flushed to disk later by a background process or on \`fsync()\`.`,
      flashcards: [
        {
          front: "What information does an inode store, and what does it NOT store?",
          back: `An **inode stores**:
- File size
- File type (regular, directory, symlink, etc.)
- Permissions (read/write/execute bits)
- Owner (UID, GID)
- Timestamps (atime, mtime, ctime)
- Reference count (number of hard links)
- Pointers to data blocks on disk

An inode does **NOT store** the file name. File names live in **directory entries**, which map name strings to inode numbers. This is why multiple hard links (different names) can point to the same inode.`
        },
        {
          front: "What is the difference between a hard link and a symbolic (soft) link?",
          back: `**Hard link**: A directory entry that points directly to an inode. Multiple directory entries can point to the same inode (reference counted). The file data is only deleted when the last hard link is removed (ref count = 0). Cannot span filesystems.

**Symbolic link (symlink)**: A special file whose content is a path string pointing to another file/directory. If the target is deleted, the symlink becomes a **dangling link**. Can cross filesystems and even point to directories.`
        },
        {
          front: "What is journaling in a file system and why is it needed?",
          back: `**Journaling** is a technique where the filesystem records intended changes in a sequential **journal (log)** before applying them to the main data structures on disk.

Why it's needed: Disk writes are not atomic. A crash mid-operation (e.g., during directory entry + inode update) can leave the filesystem in an **inconsistent state** (orphaned inodes, missing data). Without journaling, recovery requires a full filesystem scan (\`fsck\`), which can take hours on large disks.

With journaling, recovery simply replays or rolls back the last incomplete journal entry in seconds.`
        }
      ],
      quiz: [
        {
          question: "You delete a file by name but a running process still has it open. What happens to the file's data?",
          options: [
            "The data is immediately deleted from disk",
            "The data remains accessible to the open process until it closes the file",
            "The OS copies the data to a temp file",
            "The deletion fails until the process closes the file"
          ],
          answer: 1,
          explanation: `Deleting a filename only removes the **directory entry** and decrements the inode's reference count. As long as the file descriptor is open (which also increments the ref count), the inode and its data blocks remain allocated. The data is only freed when *both* the directory entry is removed *and* all file descriptors are closed — i.e., the total reference count (links + open FDs) reaches zero. This is how tools like log rotation work: replace the log file while the writing process continues with its open FD.`
        },
        {
          question: "Why can't hard links span different filesystems?",
          options: [
            "It would require too much disk space",
            "Inode numbers are only unique within a single filesystem",
            "The OS does not support multiple filesystems",
            "Hard links are deprecated in modern systems"
          ],
          answer: 1,
          explanation: `An inode number is a **filesystem-local identifier**. Inode 1842 on ext4 partition /dev/sda1 is a completely different inode from number 1842 on /dev/sdb1. A hard link is literally a directory entry containing an inode number — if it pointed across filesystems, the number would be ambiguous. Symbolic links avoid this problem because they store a **path string**, which is resolved by the OS through the global namespace at access time.`
        },
        {
          question: "What is the page cache and how does it affect file I/O performance?",
          options: [
            "A cache of CPU instructions to speed up context switches",
            "An in-RAM cache of recently accessed disk blocks, transparently speeding up reads and batching writes",
            "A reserved region of virtual memory for kernel use only",
            "A hardware buffer inside the disk controller"
          ],
          answer: 1,
          explanation: `The **page cache** is an OS-managed pool of physical memory frames holding recently read or written file blocks. When you \`read()\` a file, the OS checks the page cache first — if the block is cached (a cache hit), it is served from RAM with no disk I/O. Writes go to the page cache first (dirty pages) and are flushed to disk asynchronously, dramatically reducing write latency from the application's perspective. The same physical frames are used by mmap, making file-backed mmaps and buffered I/O share the same underlying cache.`
        },
        {
          question: "Explain how the OS resolves the path /home/alice/notes.txt to file data on disk.",
          answer: `Path resolution is done by the kernel via a process called **pathname lookup**:

1. Start at the **root inode** (inode 2, always the root of the filesystem).
2. Read root inode → get block pointers → read root directory data → find entry "home" → inode number N1.
3. Read inode N1 → read its directory data → find entry "alice" → inode number N2.
4. Read inode N2 → read its directory data → find entry "notes.txt" → inode number N3.
5. Read inode N3: this is the file's inode. It contains the file's size, permissions, and pointers to data blocks.
6. To read the file: follow the block pointers in inode N3 to the actual data blocks on disk.

For each directory lookup, the OS first checks the **dentry cache** (directory entry cache in RAM) to avoid repeated disk reads. The **page cache** may also have the directory blocks cached. In practice, traversal of warm (recently accessed) paths takes microseconds rather than milliseconds.`
        }
      ]
    },
    {
      id: "networking-basics",
      title: "Networking Basics",
      body: `## Networking Basics

Understanding networking from an OS perspective means knowing what the OS abstracts away for you, and what you are responsible for as an application developer.

## OSI Model vs TCP/IP Model

~~~
OSI Model           TCP/IP Model        Examples
7 Application  ─┐
6 Presentation  ├── Application         HTTP, DNS, TLS
5 Session      ─┘
4 Transport    ──── Transport           TCP, UDP
3 Network      ──── Internet            IP, ICMP
2 Data Link    ─┐
1 Physical     ─┴── Network Access      Ethernet, Wi-Fi, MAC
~~~

In practice, the **TCP/IP 4-layer model** is used. Each layer wraps the one above with its own header (encapsulation).

## Key Concepts

### IP (Internet Layer)
- **IP address**: logical address identifying a host on a network (IPv4: 32-bit; IPv6: 128-bit).
- IP is **connectionless and unreliable** — best-effort delivery, no ordering or retransmission.
- The OS routes outbound packets via a **routing table** to the correct network interface.

### MAC (Data Link Layer)
- **MAC address**: 48-bit hardware address burned into a network card. Used within a single local network segment (LAN).
- **ARP (Address Resolution Protocol)**: maps IP addresses to MAC addresses. The OS handles ARP automatically.

### TCP vs UDP (Transport Layer)
| | TCP | UDP |
|---|---|---|
| Connection | Yes (3-way handshake) | No |
| Reliability | Yes (ACK, retransmit) | No |
| Ordering | Yes | No |
| Speed | Slower (overhead) | Faster |
| Use case | HTTP, SSH, databases | DNS, video streaming, games |

### Ports
A **port** (0–65535) identifies a specific service/socket on a host. \`IP:port\` together is a **socket address**. Well-known ports: 80 (HTTP), 443 (HTTPS), 22 (SSH), 53 (DNS).

## Sockets

The **socket API** is the OS abstraction for network communication. A socket is a file descriptor (on Unix) representing one endpoint of a connection.

~~~c
// TCP server (simplified)
int fd = socket(AF_INET, SOCK_STREAM, 0);   // create socket
bind(fd, &addr, sizeof(addr));               // assign IP:port
listen(fd, backlog);                         // mark as server
int client = accept(fd, &client_addr, &len); // block until a client connects
read(client, buf, sizeof(buf));              // receive data
write(client, response, len);               // send response
close(client);
~~~

## What the OS Handles for You

- **TCP congestion control and flow control**: the OS (kernel TCP stack) adjusts the sending rate automatically.
- **Retransmission**: lost packets are retransmitted without application involvement.
- **IP fragmentation/reassembly**: large packets split to fit MTU, reassembled before delivery.
- **ARP and routing**: the OS kernel maintains ARP caches and routing tables.
- **Buffer management**: kernel send/receive buffers smooth out bursts.

As an application developer, you work at the **socket (transport) layer** — you send/receive byte streams (TCP) or datagrams (UDP) and the OS handles everything below.`,
      flashcards: [
        {
          front: "What is the difference between an IP address and a MAC address?",
          back: `**IP address**: A **logical, routable** address assigned by network configuration (DHCP or static). Used to route packets across the internet between networks. IPv4 is 32-bit (e.g., 192.168.1.1); IPv6 is 128-bit.

**MAC address**: A **physical hardware** address assigned to a network interface card (NIC) by the manufacturer. 48 bits (e.g., 00:1A:2B:3C:4D:5E). Used only within a single **local network segment** (LAN) — routers strip/replace MAC headers at each hop. ARP resolves IP → MAC within a LAN.`
        },
        {
          front: "What are TCP sockets and how do they differ from UDP sockets?",
          back: `Both are OS abstractions (file descriptors) for network endpoints, but:

**TCP socket** (\`SOCK_STREAM\`):
- Requires a 3-way handshake to establish a connection.
- Provides reliable, ordered, error-checked byte-stream delivery.
- OS handles retransmission, flow control, congestion control.
- Used for HTTP, SSH, databases.

**UDP socket** (\`SOCK_DGRAM\`):
- Connectionless — send datagrams directly, no handshake.
- No reliability or ordering guarantees; higher throughput, lower latency.
- Application is responsible for any reliability needed.
- Used for DNS, video calls, games, QUIC.`
        },
        {
          front: "What networking responsibilities does the OS kernel handle transparently?",
          back: `The OS kernel (network stack) handles:
1. **TCP reliability**: ACKs, retransmission of lost segments.
2. **Congestion control**: adjusting send rate (Reno, CUBIC, BBR).
3. **Flow control**: respecting the receiver's buffer capacity.
4. **IP fragmentation and reassembly**: splitting/rejoining packets too large for the MTU.
5. **ARP**: resolving IP addresses to MAC addresses on the local LAN.
6. **Routing**: selecting the network interface and next hop for outbound packets.
7. **Checksum verification**: verifying data integrity at the IP/TCP/UDP layers.`
        }
      ],
      quiz: [
        {
          question: "At which TCP/IP layer does the OS kernel handle retransmission of lost packets?",
          options: ["Application layer", "Transport layer (TCP)", "Internet layer (IP)", "Network Access layer"],
          answer: 1,
          explanation: `**TCP** (Transport layer) handles reliable delivery. When the sender does not receive an ACK within a timeout, the kernel's TCP stack **retransmits** the missing segment automatically. The application only calls \`send()\` and \`recv()\` — it never sees individual segment drops or retransmissions. This is why TCP is said to provide a reliable byte stream. IP (Internet layer) is explicitly **unreliable** — it does not retransmit.`
        },
        {
          question: "A web browser connects to a server at IP 93.184.216.34 on port 443. What does the port number identify?",
          options: [
            "The physical network interface on the server",
            "The specific service or socket endpoint — in this case, HTTPS",
            "The server's position in its data center rack",
            "The TCP sequence number for this connection"
          ],
          answer: 1,
          explanation: `A **port number** (0–65535) identifies a specific **service or socket** on a host. Port 443 is the well-known port for **HTTPS**. The OS uses the port to demultiplex incoming TCP segments to the correct listening socket (process). The combination \`IP:port\` uniquely identifies a socket endpoint; a TCP connection is identified by the 4-tuple (src IP, src port, dst IP, dst port).`
        },
        {
          question: "Why does ARP exist? What problem does it solve?",
          options: [
            "It translates domain names to IP addresses",
            "It translates IP addresses to MAC addresses within a local network",
            "It provides encryption for Ethernet frames",
            "It assigns IP addresses to new hosts on a network"
          ],
          answer: 1,
          explanation: `**ARP (Address Resolution Protocol)** solves the mismatch between the two addressing systems: IP addresses (logical, layer 3) and MAC addresses (physical, layer 2). Within a LAN, frames are delivered using MAC addresses, not IP addresses. When the OS needs to send a packet to an IP on the same subnet, it broadcasts an ARP request ("Who has 192.168.1.5? Tell 192.168.1.1") and the target responds with its MAC address. The OS caches this in the **ARP table**. DNS is a separate, higher-level protocol that maps hostnames to IPs.`
        },
        {
          question: "Describe the sequence of OS and network operations when a browser fetches https://example.com/.",
          answer: `1. **DNS resolution**: The browser calls \`getaddrinfo("example.com")\`. The OS (or stub resolver) queries a DNS server (UDP, port 53) → receives an IP address (e.g., 93.184.216.34).

2. **Routing / ARP**: The OS consults its routing table to find the outbound network interface. If the destination is not on the local subnet, it routes to the default gateway. ARP resolves the gateway's IP to a MAC address (if not cached).

3. **TCP handshake**: The OS kernel opens a TCP socket, sends a SYN to IP 93.184.216.34 port 443. The server responds SYN-ACK; the client completes with ACK. The connection is established.

4. **TLS handshake**: The application (browser / TLS library) performs a TLS handshake over the TCP connection, negotiating encryption and verifying the server certificate.

5. **HTTP request**: The browser sends \`GET / HTTP/1.1\` as encrypted TLS data. TCP breaks it into segments; IP adds routing headers; the NIC transmits Ethernet frames.

6. **Response**: The server sends back the HTTP response. TCP at the client reassembles segments in order; the OS delivers the byte stream to the browser via \`recv()\`.

7. **Rendering**: The browser parses the HTML and may make additional requests for CSS, JS, images — repeating steps 1–6 (often reusing the same TCP connection via HTTP keep-alive).

Throughout, the OS kernel handles TCP reliability, IP routing, ARP, and checksum verification invisibly.`
        }
      ]
    }
  ]
}
