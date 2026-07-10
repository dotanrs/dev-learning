export default {
  id: "concurrency",
  title: "Concurrency",
  subchapters: [
    {
      id: "mutexes",
      title: "Mutexes",
      body: `## Mutual Exclusion with Mutexes

A **mutex** (mutual exclusion lock) ensures that only one thread can hold the lock at a time. Any other thread that tries to acquire the lock will block until the holder releases it.

### Why you need a mutex

Without a mutex, two threads updating a shared counter can interleave:

~~~c
// Thread 1: reads counter (0), Thread 2: reads counter (0),
// Thread 1: writes 1, Thread 2: writes 1 → final value: 1 (not 2!)
int counter = 0; // data race, undefined behaviour in C/C++
~~~

### Basic lock / unlock in C (pthreads)

~~~c
#include <pthread.h>
#include <stdio.h>

pthread_mutex_t mu = PTHREAD_MUTEX_INITIALIZER;
int counter = 0;

void *increment(void *arg) {
    for (int i = 0; i < 100000; i++) {
        pthread_mutex_lock(&mu);
        counter++;
        pthread_mutex_unlock(&mu);
    }
    return NULL;
}

int main() {
    pthread_t t1, t2;
    pthread_create(&t1, NULL, increment, NULL);
    pthread_create(&t2, NULL, increment, NULL);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    printf("counter = %d\\n", counter); // always 200000
    pthread_mutex_destroy(&mu);
}
~~~

### RAII-style locking (C++)

In C++, \`std::lock_guard\` automatically releases the mutex when it goes out of scope — even if an exception is thrown.

~~~cpp
#include <mutex>
#include <thread>

std::mutex mu;
int counter = 0;

void increment() {
    for (int i = 0; i < 100000; i++) {
        std::lock_guard<std::mutex> lock(mu); // acquired here
        counter++;
    } // lock released automatically here
}
~~~

### Python context-manager style

~~~python
import threading

mu = threading.Lock()
counter = 0

def increment():
    global counter
    for _ in range(100_000):
        with mu:          # acquires on entry, releases on exit
            counter += 1
~~~

### Reentrant (recursive) mutex

A regular mutex **deadlocks** if the same thread tries to lock it twice. A **reentrant mutex** allows the same thread to acquire it multiple times (it tracks a count).

~~~python
import threading

rlock = threading.RLock()

def outer():
    with rlock:
        inner()   # safe — same thread re-acquires

def inner():
    with rlock:   # would deadlock with a plain Lock
        print("inside inner")
~~~

Use a reentrant mutex when a function that holds a lock may call another function that also tries to acquire the same lock.`,
      flashcards: [
        {
          front: "What is a mutex and what problem does it solve?",
          back: `A mutex (mutual exclusion lock) ensures only one thread executes a **critical section** at a time, preventing data races on shared mutable state. Threads that cannot acquire the lock block until the holder releases it.`
        },
        {
          front: "What is RAII locking and why is it preferred?",
          back: `RAII (Resource Acquisition Is Initialization) ties the mutex lifetime to a stack object. In C++ \`std::lock_guard\` acquires the mutex in its constructor and releases it in its destructor — guaranteeing release even when exceptions are thrown, and eliminating forgotten-unlock bugs.`
        },
        {
          front: "When do you need a reentrant (recursive) mutex?",
          back: `When the **same thread** may attempt to acquire the lock more than once before releasing it (e.g., a locked function calls another function that also locks). A plain mutex would deadlock; a reentrant mutex tracks a recursion count and only truly unlocks when the count reaches zero.`
        }
      ],
      quiz: [
        {
          question: "What happens if a thread tries to lock a non-reentrant mutex it already holds?",
          options: [
            "It acquires the lock a second time and increments a counter",
            "It deadlocks, blocking forever",
            "It throws an exception and continues",
            "It succeeds silently and the lock count stays at 1"
          ],
          answer: 1,
          explanation: `A non-reentrant mutex has no concept of ownership depth. The thread's own lock attempt sees the mutex as "taken" and blocks — but since the only thread that could release it is the same blocked thread, it waits forever: a **deadlock**.`
        },
        {
          question: "Which C++ RAII type allows you to temporarily release a mutex mid-scope?",
          options: [
            "std::lock_guard",
            "std::scoped_lock",
            "std::unique_lock",
            "std::shared_lock"
          ],
          answer: 2,
          explanation: `\`std::unique_lock\` is movable and provides \`lock()\` / \`unlock()\` methods so you can release and re-acquire mid-scope. \`std::lock_guard\` is simpler but cannot be unlocked early. \`std::scoped_lock\` handles multiple mutexes atomically to avoid deadlock.`
        },
        {
          question: "Why is 'lock granularity' important for performance?",
          options: [
            "Coarser locks are always faster because there are fewer lock operations",
            "Finer-grained locks allow more threads to make progress concurrently, but add overhead per lock",
            "Lock granularity has no effect on throughput",
            "Finer-grained locks always outperform coarser ones"
          ],
          answer: 1,
          explanation: `Coarser locks serialize more work, reducing parallelism. Finer-grained locks allow threads to work in parallel on different data, increasing throughput — but every extra mutex adds acquisition overhead and increases the risk of deadlock if multiple locks must be held simultaneously.`
        },
        {
          question: "Describe the difference between a spinlock and a blocking mutex.",
          answer: `A **spinlock** busy-waits in a tight loop checking whether the lock is free (burns CPU cycles but avoids a context switch). A **blocking mutex** puts the waiting thread to sleep via the OS scheduler (saves CPU but pays the cost of a context switch). Spinlocks win for **very short critical sections** on multi-core machines; blocking mutexes win when contention is high or hold times are long.`
        }
      ]
    },
    {
      id: "semaphores",
      title: "Semaphores",
      body: `## Semaphores

A **semaphore** is a synchronization primitive that maintains an integer counter. Two atomic operations control it:

- **acquire / wait / P** — decrements the counter; if it would go below zero the thread blocks.
- **release / signal / V** — increments the counter; wakes one blocked thread if any.

### Binary semaphore vs counting semaphore

| Type | Initial value | Use case |
|---|---|---|
| Binary | 1 | Mutual exclusion (similar to a mutex) |
| Counting | N | Limit concurrent access to N resources |

### Python example — bounded resource pool

Imagine a database connection pool that allows at most 3 simultaneous connections.

~~~python
import threading
import time
import random

MAX_CONNECTIONS = 3
pool_semaphore = threading.Semaphore(MAX_CONNECTIONS)

def use_connection(worker_id):
    print(f"Worker {worker_id} waiting for connection...")
    pool_semaphore.acquire()          # blocks if 3 connections already in use
    try:
        print(f"Worker {worker_id} got connection")
        time.sleep(random.uniform(0.5, 1.5))  # simulate DB work
    finally:
        pool_semaphore.release()      # always return the connection
        print(f"Worker {worker_id} released connection")

threads = [threading.Thread(target=use_connection, args=(i,)) for i in range(8)]
for t in threads:
    t.start()
for t in threads:
    t.join()
~~~

At most 3 workers are active at once; the rest queue up.

### C POSIX semaphore example

~~~c
#include <semaphore.h>
#include <pthread.h>
#include <stdio.h>

sem_t sem;

void *worker(void *arg) {
    int id = *(int *)arg;
    sem_wait(&sem);           // acquire
    printf("Worker %d in critical section\\n", id);
    sem_post(&sem);           // release
    return NULL;
}

int main() {
    sem_init(&sem, 0, 3);     // counting semaphore, initial value 3
    pthread_t threads[8];
    int ids[8];
    for (int i = 0; i < 8; i++) {
        ids[i] = i;
        pthread_create(&threads[i], NULL, worker, &ids[i]);
    }
    for (int i = 0; i < 8; i++) pthread_join(threads[i], NULL);
    sem_destroy(&sem);
}
~~~

### Semaphore vs Mutex

A key difference: a semaphore can be **signaled by a different thread** than the one that waited. A mutex must be released by the thread that acquired it. This makes semaphores useful for **signaling** between threads (e.g., producer signals consumer that data is ready).`,
      flashcards: [
        {
          front: "What are the two atomic operations on a semaphore?",
          back: `**acquire (wait/P)**: decrement the counter; block if it would go below 0.
**release (signal/V)**: increment the counter; wake a blocked thread if any.

The counter represents the number of available "permits."`
        },
        {
          front: "How does a counting semaphore differ from a binary semaphore?",
          back: `A **binary semaphore** has initial value 1 and behaves like a mutex (0 = locked, 1 = unlocked). A **counting semaphore** has initial value N and allows up to N threads to hold permits simultaneously — useful for rate-limiting access to a pool of N identical resources.`
        },
        {
          front: "Why can a semaphore be used for signaling but a mutex typically cannot?",
          back: `A semaphore's \`release\` can be called by **any thread**, including one that never called \`acquire\`. This lets a producer thread signal a consumer thread. A mutex is owned by the thread that locked it — calling \`unlock\` from a different thread is undefined behaviour (or an error) in most implementations.`
        }
      ],
      quiz: [
        {
          question: "A semaphore is initialized to 0. Thread A calls acquire(). What happens?",
          options: [
            "Thread A proceeds immediately because 0 means unlocked",
            "Thread A blocks because the counter would go below 0",
            "Thread A gets an error and returns -1",
            "The semaphore resets to 1 and Thread A proceeds"
          ],
          answer: 1,
          explanation: `With an initial value of 0, the first \`acquire\` would decrement to -1 which is not allowed — so Thread A blocks. This is the classic pattern for a **signal semaphore**: Thread B calls \`release()\` (setting it to 1) to wake Thread A. It is used to synchronize the order of operations between threads.`
        },
        {
          question: "What is the maximum number of threads that can hold a semaphore initialized to 5 simultaneously?",
          options: ["1", "5", "Unlimited", "It depends on the OS scheduler"],
          answer: 1,
          explanation: `The counter starts at 5. Each \`acquire\` decrements it by 1. When it reaches 0, subsequent callers block. So exactly 5 threads can hold permits at the same time — the 6th will block until one of the first 5 calls \`release\`.`
        },
        {
          question: "Which scenario is a semaphore better suited for than a mutex?",
          options: [
            "Protecting a single shared variable from concurrent writes",
            "Ensuring the same thread doesn't enter a critical section twice",
            "Limiting concurrent access to a pool of 10 database connections",
            "Implementing recursive locking"
          ],
          answer: 2,
          explanation: `A counting semaphore initialized to 10 naturally expresses "allow at most 10 concurrent users." A mutex only allows 1. Recursive locking requires a reentrant mutex. The semaphore doesn't track which thread holds it, so it's not appropriate for ownership-based mutual exclusion of a single resource.`
        },
        {
          question: "Explain the 'semaphore as signal' pattern with a producer-consumer example.",
          answer: `Initialize a semaphore to **0**. The consumer calls \`acquire()\` — it blocks because there is no item yet. The producer places an item in a shared slot and calls \`release()\` — the semaphore rises to 1, waking the consumer. The consumer proceeds to read the item. This decouples production from consumption: the semaphore tracks how many items are available, and \`release\` can be called by a completely different thread than the one waiting.`
        }
      ]
    },
    {
      id: "condition-variables",
      title: "Condition Variables",
      body: `## Condition Variables

A **condition variable** allows threads to efficiently wait until a particular condition becomes true. It is always used together with a mutex.

Core operations:
- **wait(cv, mutex)** — atomically releases the mutex and suspends the thread; re-acquires the mutex before returning.
- **notify_one / signal** — wakes one waiting thread.
- **notify_all / broadcast** — wakes all waiting threads.

### Why always use a while-loop predicate

~~~cpp
// WRONG — if-statement predicate
std::unique_lock<std::mutex> lock(mu);
if (queue.empty()) {           // checked once
    cv.wait(lock);             // could wake spuriously!
}
process(queue.front());        // queue might still be empty — UB
~~~

~~~cpp
// CORRECT — while-loop predicate
std::unique_lock<std::mutex> lock(mu);
while (queue.empty()) {        // re-check after every wakeup
    cv.wait(lock);
}
process(queue.front());        // guaranteed non-empty
~~~

**Spurious wakeups**: POSIX allows \`wait\` to return even when \`notify\` was never called (implementation detail of certain OS schedulers). The while-loop handles this safely.

### Full example — bounded queue with condvars (C++)

~~~cpp
#include <condition_variable>
#include <mutex>
#include <queue>
#include <thread>
#include <iostream>

std::mutex mu;
std::condition_variable cv_not_empty, cv_not_full;
std::queue<int> buf;
const int MAX = 5;

void producer() {
    for (int i = 0; i < 20; i++) {
        std::unique_lock<std::mutex> lock(mu);
        cv_not_full.wait(lock, [] { return (int)buf.size() < MAX; });
        buf.push(i);
        std::cout << "Produced " << i << "\\n";
        cv_not_empty.notify_one();
    }
}

void consumer() {
    for (int i = 0; i < 20; i++) {
        std::unique_lock<std::mutex> lock(mu);
        cv_not_empty.wait(lock, [] { return !buf.empty(); });
        int v = buf.front(); buf.pop();
        std::cout << "Consumed " << v << "\\n";
        cv_not_full.notify_one();
    }
}

int main() {
    std::thread p(producer), c(consumer);
    p.join(); c.join();
}
~~~

The lambda passed to \`wait\` is syntactic sugar for the while-loop pattern.

### Lost wakeup

A **lost wakeup** occurs when \`notify\` is called **before** the consumer reaches \`wait\`:

~~~
// Thread A (consumer):          // Thread B (producer):
check condition (false)          produce item
                                 notify()   ← happens here, before wait
wait()  ← sleeps forever
~~~

**Prevention**: always hold the mutex when checking the condition and calling \`notify\`. With the mutex held, the producer cannot notify between the consumer's check and its sleep — because both require the mutex.`,
      flashcards: [
        {
          front: "Why must condition variable wait always be in a while-loop, not an if-statement?",
          back: `Two reasons:
1. **Spurious wakeups** — POSIX allows \`wait\` to return without a corresponding \`notify\`. A while-loop re-checks and goes back to sleep if the condition is still false.
2. **Stolen wakeup** — another thread may acquire the mutex and consume the resource between the \`notify\` and the awakened thread re-acquiring the mutex. The while-loop detects this.`
        },
        {
          front: "What is a lost wakeup and how do you prevent it?",
          back: `A **lost wakeup** happens when the producer calls \`notify\` **before** the consumer calls \`wait\`, so the signal is missed and the consumer sleeps forever.

Prevention: **always hold the mutex when modifying the condition and calling \`notify\`**. The consumer also holds the mutex when checking the condition. This guarantees the producer cannot notify between the consumer's check and its sleep.`
        },
        {
          front: "What does condition variable wait() do atomically?",
          back: `\`wait(lock)\` performs two steps **atomically**: (1) releases the mutex, and (2) suspends the calling thread. This atomicity is essential — if they were separate steps, a producer could sneak in between the unlock and the sleep, calling \`notify\` before the consumer is waiting (lost wakeup).`
        }
      ],
      quiz: [
        {
          question: "A thread wakes from cv.wait() but the predicate is still false. What should it do?",
          options: [
            "Proceed anyway since the OS guarantees the predicate is true",
            "Abort the program — this indicates a bug",
            "Go back to sleep by looping back to the while condition",
            "Release the mutex and try acquiring it again"
          ],
          answer: 2,
          explanation: `This is the spurious wakeup scenario. The correct response is to re-check the predicate in the while-loop condition. If still false, \`cv.wait()\` is called again, atomically releasing the mutex and sleeping. The loop handles both spurious wakeups and stolen wakeups transparently.`
        },
        {
          question: "When should you use notify_all() instead of notify_one()?",
          options: [
            "When you want to wake the highest-priority thread",
            "When multiple threads may each be waiting on different conditions protected by the same cv",
            "notify_all is always preferred for correctness",
            "When the condition variable is shared across processes"
          ],
          answer: 1,
          explanation: `Use \`notify_all\` when multiple waiters check **different predicates** on the same condition variable. \`notify_one\` might wake a thread whose predicate is still false, leaving threads with true predicates sleeping. \`notify_all\` wakes everyone; each re-checks and either proceeds or sleeps again. When all waiters share the same predicate (e.g., a queue is non-empty), \`notify_one\` is more efficient.`
        },
        {
          question: "What is the role of the mutex in condition variable usage?",
          options: [
            "It is optional — condition variables can be used without a mutex",
            "It protects the shared state (predicate) and ensures wait/notify atomicity",
            "It prevents the OS from issuing spurious wakeups",
            "It is only needed when using notify_all"
          ],
          answer: 1,
          explanation: `The mutex serves two purposes: (1) it protects the shared data that forms the condition (e.g., the queue), preventing races on that data; (2) it is atomically released inside \`wait\`, ensuring no notify can arrive between the predicate check and the sleep. Without the mutex, the lost-wakeup race condition is unavoidable.`
        },
        {
          question: "Explain the difference between notify_one and notify_all in a thread pool scenario.",
          answer: `In a thread pool where N worker threads all wait on a single condition variable for new tasks:

- **notify_one**: wake exactly one worker — correct and efficient when exactly one new task was added.
- **notify_all**: wake all workers — useful when multiple tasks were batched, or when a shutdown signal should reach every thread. Each woken worker re-checks the predicate; those that find no work return to sleep.

Using \`notify_all\` for a single task causes a **thundering herd**: all workers wake, compete for the mutex, one gets the task, and the rest go back to sleep — wasted context switches.`
        }
      ]
    },
    {
      id: "producer-consumer",
      title: "Producer-Consumer",
      body: `## Producer-Consumer Problem

The **producer-consumer** (bounded buffer) problem is a classic concurrency pattern:

- **Producers** generate data and place it in a shared buffer.
- **Consumers** take data from the buffer and process it.
- The buffer has a fixed capacity — producers must wait when full, consumers must wait when empty.

### Solution using mutex + two condition variables

~~~python
import threading
from collections import deque

class BoundedBuffer:
    def __init__(self, capacity):
        self.capacity = capacity
        self.buffer = deque()
        self.mutex = threading.Lock()
        self.not_full = threading.Condition(self.mutex)
        self.not_empty = threading.Condition(self.mutex)

    def put(self, item):
        with self.not_full:
            while len(self.buffer) == self.capacity:
                self.not_full.wait()       # release lock, sleep
            self.buffer.append(item)
            self.not_empty.notify()        # wake a consumer

    def get(self):
        with self.not_empty:
            while len(self.buffer) == 0:
                self.not_empty.wait()      # release lock, sleep
            item = self.buffer.popleft()
            self.not_full.notify()         # wake a producer
            return item
~~~

### Using it with multiple producers and consumers

~~~python
import time, random

buf = BoundedBuffer(capacity=5)

def producer(pid):
    for i in range(10):
        item = f"P{pid}-item{i}"
        buf.put(item)
        print(f"[Producer {pid}] put {item}, size={len(buf.buffer)}")
        time.sleep(random.uniform(0.0, 0.1))

def consumer(cid):
    for _ in range(5):
        item = buf.get()
        print(f"[Consumer {cid}] got {item}")
        time.sleep(random.uniform(0.05, 0.15))

threads = []
for i in range(2):
    threads.append(threading.Thread(target=producer, args=(i,)))
for i in range(4):
    threads.append(threading.Thread(target=consumer, args=(i,)))

for t in threads:
    t.start()
for t in threads:
    t.join()
~~~

### Solution using semaphores (Go)

~~~go
package main

import (
    "fmt"
    "sync"
    "time"
)

const CAP = 5

var (
    buffer   = make([]int, 0, CAP)
    mu       sync.Mutex
    slots    = make(chan struct{}, CAP) // counts empty slots
    items    = make(chan struct{}, CAP) // counts available items
)

func init() {
    for i := 0; i < CAP; i++ {
        slots <- struct{}{} // pre-fill with CAP empty slots
    }
}

func produce(id, val int) {
    <-slots               // acquire an empty slot
    mu.Lock()
    buffer = append(buffer, val)
    fmt.Printf("Producer %d: put %d\\n", id, val)
    mu.Unlock()
    items <- struct{}{} // signal an item is available
}

func consume(id int) {
    <-items              // wait for an item
    mu.Lock()
    val := buffer[0]
    buffer = buffer[1:]
    fmt.Printf("Consumer %d: got %d\\n", id, val)
    mu.Unlock()
    slots <- struct{}{} // signal a slot is free
}

func main() {
    var wg sync.WaitGroup
    for i := 0; i < 10; i++ {
        wg.Add(1)
        go func(i int) { defer wg.Done(); produce(i, i*10) }(i)
    }
    time.Sleep(10 * time.Millisecond)
    for i := 0; i < 10; i++ {
        wg.Add(1)
        go func(i int) { defer wg.Done(); consume(i) }(i)
    }
    wg.Wait()
}
~~~

### Invariants to maintain

1. Buffer size is always in \`[0, capacity]\`.
2. Producers only insert when \`size < capacity\`.
3. Consumers only remove when \`size > 0\`.
4. All buffer accesses are protected by the mutex.`,
      flashcards: [
        {
          front: "Why are TWO condition variables used in a bounded buffer (not_full and not_empty)?",
          back: `Using separate condition variables lets producers wait on the right condition (**not_full**) and consumers wait on the right condition (**not_empty**). With a single condvar you would have to \`notify_all\` to avoid waking the wrong type — e.g., a consumer notifying could wake another consumer instead of a blocked producer. Two condvars let each \`notify_one\` target exactly the right set of waiters.`
        },
        {
          front: "What happens if the producer does not hold the mutex while calling notify?",
          back: `A **lost wakeup** race becomes possible: the consumer checks the predicate (buffer is empty), is about to call \`wait\`, but the producer inserts an item and calls \`notify\` before the consumer is actually waiting. The consumer then sleeps even though data is available. Holding the mutex ensures the consumer is either already waiting (and will receive the notify) or hasn't checked the predicate yet (and will see the item without sleeping).`
        },
        {
          front: "How does the semaphore-based producer-consumer work with 'slots' and 'items'?",
          back: `Two semaphores track the state of the bounded buffer:
- **slots** (initial = capacity): represents empty slots. Producers \`acquire\` a slot before inserting; consumers \`release\` a slot after removing.
- **items** (initial = 0): represents filled slots. Producers \`release\` an item after inserting; consumers \`acquire\` an item before removing.

This ensures producers block when full and consumers block when empty, without explicit while-loop predicates.`
        }
      ],
      quiz: [
        {
          question: "In the mutex+condvar bounded buffer, why must the buffer size check be in a while-loop inside put()?",
          options: [
            "Because Python's GIL makes condition variables unreliable",
            "To handle spurious wakeups and stolen slots from other producers",
            "Because the mutex might not be held when wait() returns",
            "To avoid busy-waiting"
          ],
          answer: 1,
          explanation: `Two producers may both wake from \`not_full.wait()\`. Only one can re-acquire the mutex first, insert an item, and fill the last slot. The second producer then acquires the mutex and must re-check the size — the buffer is now full again. Without the while-loop it would insert anyway, overflowing the buffer.`
        },
        {
          question: "Which notify should the consumer call after removing an item?",
          options: [
            "not_empty.notify() — to tell another consumer there might be more",
            "not_full.notify() — to tell a blocked producer a slot opened up",
            "Both not_empty and not_full",
            "No notification is needed after consuming"
          ],
          answer: 1,
          explanation: `Removing an item from a full buffer opens a slot. Any producer that was blocked because the buffer was at capacity can now proceed. So the consumer should signal \`not_full\`. Signaling \`not_empty\` would wake another consumer when there might be nothing to consume.`
        },
        {
          question: "What is the risk if a producer inserts without holding the mutex?",
          options: [
            "The condition variable will fail to wake consumers",
            "Two producers may write to the same buffer position simultaneously, corrupting data",
            "The buffer capacity check will always return false",
            "The consumer will never be notified"
          ],
          answer: 1,
          explanation: `Without the mutex, two producers can both observe \`size < capacity\`, both append items, and exceed the buffer's capacity — or corrupt the internal data structure (e.g., Python's \`deque\` is not thread-safe at the Python level if multiple threads run C extensions concurrently without the GIL being released in a cooperative manner). The mutex serializes buffer modifications.`
        },
        {
          question: "Describe how to handle a 'poison pill' shutdown in a producer-consumer system.",
          answer: `A **poison pill** is a sentinel value (e.g., \`None\` or a special \`STOP\` object) that a producer inserts into the buffer when work is done. Each consumer, upon receiving the poison pill, knows to exit — and before exiting, it re-inserts the pill so the next consumer also receives it (or N pills are inserted for N consumers).

This avoids interrupt-based shutdown (which can corrupt in-flight work) and ensures consumers drain the buffer before exiting. The key invariant: the pill is only inserted **after** all real items, so consumers process everything first.`
        }
      ]
    },
    {
      id: "thread-pools",
      title: "Thread Pools",
      body: `## Thread Pools

Creating and destroying threads for each task is expensive (stack allocation, kernel context). A **thread pool** creates a fixed set of worker threads at startup that pull tasks from a shared work queue.

### Benefits
- Amortizes thread creation cost across many tasks.
- Bounds the number of concurrent threads (avoids thrashing).
- Provides backpressure via a bounded work queue.

### Simple thread pool in Python

~~~python
import threading
from queue import Queue   # thread-safe bounded queue

class ThreadPool:
    def __init__(self, num_workers):
        self.queue = Queue()
        self.workers = []
        for _ in range(num_workers):
            t = threading.Thread(target=self._worker, daemon=True)
            t.start()
            self.workers.append(t)

    def _worker(self):
        while True:
            fn, args, kwargs = self.queue.get()
            if fn is None:        # poison pill — shut down
                self.queue.task_done()
                return
            try:
                fn(*args, **kwargs)
            finally:
                self.queue.task_done()

    def submit(self, fn, *args, **kwargs):
        self.queue.put((fn, args, kwargs))

    def shutdown(self):
        for _ in self.workers:
            self.queue.put((None, (), {}))   # one pill per worker
        for t in self.workers:
            t.join()

# Usage
import time

pool = ThreadPool(num_workers=4)

def task(n):
    time.sleep(0.1)
    print(f"Task {n} done by {threading.current_thread().name}")

for i in range(16):
    pool.submit(task, i)

pool.shutdown()
~~~

### Thread pool in Java (ExecutorService)

~~~java
import java.util.concurrent.*;

public class PoolExample {
    public static void main(String[] args) throws InterruptedException {
        ExecutorService pool = Executors.newFixedThreadPool(4);

        for (int i = 0; i < 16; i++) {
            final int taskId = i;
            pool.submit(() -> {
                System.out.printf("Task %d on %s%n",
                    taskId, Thread.currentThread().getName());
            });
        }

        pool.shutdown();
        pool.awaitTermination(10, TimeUnit.SECONDS);
    }
}
~~~

### Pool sizing heuristics

**CPU-bound tasks** (number crunching, image processing):
~~~
num_threads ≈ number_of_CPU_cores
~~~
More threads just cause context-switch overhead with no parallelism gain.

**I/O-bound tasks** (network, disk, database calls):
~~~
num_threads ≈ number_of_CPU_cores * (1 + wait_time / service_time)
~~~
While one thread waits for I/O, others can use the CPU. A typical rule of thumb is 2–10× the core count, profiled for your workload.

**Work-stealing** pools (e.g., Java's \`ForkJoinPool\`) give each thread its own deque and allow idle threads to steal tasks from the back of busy threads' queues, improving cache locality and load balance for divide-and-conquer workloads.`,
      flashcards: [
        {
          front: "Why is a thread pool more efficient than creating a new thread per task?",
          back: `Thread creation involves: (1) allocating a stack (typically 1–8 MB), (2) a kernel \`clone\`/\`CreateThread\` syscall, (3) scheduler registration. For short-lived tasks these costs dwarf the task itself. A pool pays the creation cost once at startup and reuses threads across thousands of tasks.`
        },
        {
          front: "How do you size a thread pool for CPU-bound vs I/O-bound work?",
          back: `**CPU-bound**: set threads ≈ number of CPU cores. Adding more threads doesn't help — the CPU is the bottleneck and extra threads only add context-switch overhead.

**I/O-bound**: set threads ≈ cores × (1 + wait/service ratio). Threads block on I/O, so more threads keep the CPU busy while others wait. Profile to find the sweet spot — too many threads wastes memory and scheduler overhead.`
        },
        {
          front: "What is work-stealing in a thread pool?",
          back: `In a work-stealing pool, each thread has its **own local deque** of tasks. When a thread's deque is empty, it **steals** tasks from the back of another thread's deque. Benefits: (1) threads with more tasks are not blocked by slow threads, (2) recently created sub-tasks (pushed to front) are executed on the same thread for cache locality. Java's \`ForkJoinPool\` uses this model.`
        }
      ],
      quiz: [
        {
          question: "A server handles 1000 concurrent HTTP requests each spending 95% of their time waiting on a database. How should you size the thread pool?",
          options: [
            "Set it to the number of CPU cores (e.g., 8)",
            "Set it to 1000 to match the request count",
            "Set it significantly higher than the core count (e.g., 50-200), profiled for the DB latency",
            "Use a single thread since the database is the bottleneck"
          ],
          answer: 2,
          explanation: `With 95% wait time (wait/service = 19), Little's Law and the I/O formula suggest threads ≈ cores × 20. With 8 cores that's ~160 threads. The exact number depends on DB connection pool size, latency distribution, and memory. Setting it to 1000 (one per request) wastes stack memory; setting it to 8 starves the CPU since threads are almost always waiting.`
        },
        {
          question: "What happens when you submit a task to a thread pool with a bounded queue that is full?",
          options: [
            "The task is silently dropped",
            "The submitting thread blocks until a slot opens",
            "The pool automatically creates a new thread",
            "Depends on the pool's rejection policy"
          ],
          answer: 3,
          explanation: `Java's \`ThreadPoolExecutor\` supports four rejection policies: AbortPolicy (throw exception), CallerRunsPolicy (run in the caller's thread), DiscardPolicy (silently drop), DiscardOldestPolicy (drop oldest task and retry). Python's \`Queue\` blocks by default when full. The right policy is application-specific.`
        },
        {
          question: "Why should thread pool worker threads usually be daemon threads?",
          options: [
            "Daemon threads have higher scheduling priority",
            "The JVM/Python process will not wait for daemon threads to finish on exit",
            "Daemon threads bypass the GIL in Python",
            "Non-daemon worker threads cannot be interrupted"
          ],
          answer: 1,
          explanation: `A daemon thread does not prevent the process from exiting. If workers are non-daemon and the main thread finishes without calling \`shutdown()\`, the process hangs waiting for workers to exit naturally. Making workers daemon threads means the process exits cleanly when the main thread is done — though tasks in flight will be abandoned, so explicit shutdown is still preferred.`
        },
        {
          question: "Describe the lifecycle of a task submitted to a fixed thread pool.",
          answer: `1. **Submit**: the task is placed on the shared work queue (blocked if queue is full).
2. **Dequeue**: an idle worker thread dequeues the task.
3. **Execute**: the worker calls the task function.
4. **Complete**: the worker marks the task done and immediately dequeues the next task (no thread destruction).
5. **Idle**: if the queue is empty the worker blocks on the queue's condition variable, consuming no CPU.

The thread is never destroyed between tasks — it loops back to step 2. This is the key efficiency: no per-task thread creation/destruction overhead.`
        }
      ]
    },
    {
      id: "lock-free",
      title: "Lock-Free Concepts",
      body: `## Lock-Free Programming

**Lock-free** algorithms guarantee that at least one thread makes progress in a finite number of steps — even if other threads are arbitrarily delayed or preempted. No thread can block another from making progress (unlike mutex-based code where a preempted lock-holder blocks everyone).

### The Compare-And-Swap (CAS) loop

CAS is the building block of lock-free algorithms:

~~~c
// Pseudo-code: atomic compare-and-swap
bool CAS(int *addr, int expected, int new_val) {
    // atomically:
    if (*addr == expected) {
        *addr = new_val;
        return true;
    }
    return false;
}
~~~

**Lock-free counter increment** using a CAS loop:

~~~c
#include <stdatomic.h>
#include <stdio.h>

atomic_int counter = 0;

void increment() {
    int old, new_val;
    do {
        old = atomic_load(&counter);
        new_val = old + 1;
    } while (!atomic_compare_exchange_weak(&counter, &old, new_val));
    // retry if another thread changed counter between load and CAS
}
~~~

The loop retries until the CAS succeeds — meaning no other thread modified the value in between.

### ABA Problem

CAS only checks the *value*, not the *identity* or *version*. If a value changes from A → B → A, a CAS that expected A will spuriously succeed even though the state has changed.

~~~
// Thread 1: reads counter = 10, sleeps
// Thread 2: increments counter to 11, then back to 10
// Thread 1: CAS(counter, 10, 11) succeeds — but state has changed!
~~~

**Solutions**:
- **Tagged pointer / version counter**: append a monotonically increasing version tag to the value. CAS checks both value and tag. ABA from 10v1 → 11v2 → 10v3 is detected because version differs.
- **Hazard pointers** / epoch-based reclamation for lock-free data structures.

### Lock-free vs Wait-free

| Term | Guarantee |
|---|---|
| **Blocking** | A delayed thread can prevent all others from progressing |
| **Lock-free** | At least one thread makes progress in finite steps |
| **Wait-free** | Every thread makes progress in finite steps (strongest) |

Wait-free is harder to implement; lock-free is the practical sweet spot.

### When lock-free helps vs hurts

**Helps**:
- High-contention counters, statistics aggregation.
- Single-producer / single-consumer ring buffers.
- Avoiding priority inversion (a high-priority thread blocked by a low-priority lock-holder).

**Hurts**:
- Complex multi-step operations (hard to make atomic without locks).
- High retry rates under heavy contention (CAS loops spin, wasting CPU).
- Code complexity: lock-free code is extremely hard to reason about correctly.`,
      flashcards: [
        {
          front: "What is a CAS loop and why does it retry?",
          back: `A **compare-and-swap loop** reads a shared value, computes a new value, then atomically swaps only if the shared value is still what was read. If another thread changed it in between, the CAS fails and the loop retries with a fresh read.

It retries because the computed \`new_val\` was based on an outdated snapshot — a stale update would silently lose the other thread's change.`
        },
        {
          front: "What is the ABA problem?",
          back: `ABA occurs when a location changes A → B → A between a CAS thread's read and its swap. The CAS sees the expected value A and succeeds — but the state has changed and been restored, which the algorithm cannot detect.

Fix: add a **version counter** (tagged pointer) so A-v1 → B-v2 → A-v3 is distinguishable. The CAS checks both value and version.`
        },
        {
          front: "What is the difference between lock-free and wait-free?",
          back: `**Lock-free**: the system as a whole makes progress — at least one thread completes an operation in finite steps. Individual threads may starve (loop indefinitely in a CAS retry loop under extreme contention).

**Wait-free**: every individual thread completes its operation in a bounded number of steps regardless of other threads' behavior. Stronger guarantee, harder to implement.`
        }
      ],
      quiz: [
        {
          question: "A CAS(addr, expected=5, new=6) is called. The current value is 5. What does it return and what is the new value?",
          options: [
            "Returns false, value stays 5",
            "Returns true, value becomes 6",
            "Returns true, value stays 5",
            "Returns false, value becomes 6"
          ],
          answer: 1,
          explanation: `CAS atomically checks: if *addr == expected (5 == 5), set *addr = new (6) and return true. The swap succeeds. If *addr had been any other value, CAS would return false and leave the value unchanged.`
        },
        {
          question: "Why does the ABA problem not affect a simple lock-free counter that only increments?",
          options: [
            "Because counters use wait-free algorithms, not CAS",
            "Because an increment counter only ever increases, so A→B→A cannot happen",
            "Because the OS prevents the ABA sequence for integers",
            "Because CAS checks the memory address, not just the value"
          ],
          answer: 1,
          explanation: `For a monotonically increasing counter, once the value moves from A to B (B > A), it can never return to A. The A→B→A scenario requires the value to be decremented back to A, which never happens in a pure increment workload. ABA is most dangerous in pointer-based lock-free data structures where nodes are freed and reallocated at the same address.`
        },
        {
          question: "Under what condition does a CAS-based lock-free algorithm degrade in performance?",
          options: [
            "When the CPU has many cores",
            "When threads rarely access the same location",
            "Under high contention — many threads CAS the same location, causing repeated retries",
            "When the critical section is longer than 1 microsecond"
          ],
          answer: 2,
          explanation: `Under high contention, many threads read the same value, compute their new value, and race to CAS. Only one succeeds per round; all others retry. With N threads, the expected number of retries is O(N) per successful operation. A mutex that queues threads can outperform a CAS loop when contention is high, because queued threads don't burn CPU spinning.`
        },
        {
          question: "Explain why lock-free code doesn't eliminate all concurrency hazards.",
          answer: `Lock-free code eliminates **deadlock** (no locks to hold) and **priority inversion** (no lock-holder to preempt). However it introduces its own hazards:

1. **ABA problem**: value identity vs value equality — described above.
2. **Memory reclamation**: in lock-free data structures, a thread may dereference a pointer to memory another thread just freed. Requires epoch-based reclamation or hazard pointers.
3. **Memory ordering**: CAS operations need the right memory ordering (acquire/release) to be visible correctly across cores — a bug here causes subtle, non-deterministic failures.
4. **Livelock**: threads can spin indefinitely retrying CAS if contention is perfectly symmetric.
5. **Complexity**: lock-free code is extremely hard to reason about, test, and maintain.`
        }
      ]
    },
    {
      id: "atomic-operations",
      title: "Atomic Operations",
      body: `## Atomic Operations

An **atomic operation** is one that completes entirely without any observable intermediate state — no other thread can see a partial result. On modern CPUs, aligned reads/writes of word-size types are often naturally atomic, but **read-modify-write** sequences (load + compute + store) are not.

### Why plain increment is not atomic

~~~c
counter++;  // compiles to: LOAD counter → reg; ADD reg, 1; STORE reg → counter
            // another thread can interleave between any of these three steps
~~~

### Atomic read-modify-write in C (C11 atomics)

~~~c
#include <stdatomic.h>
#include <stdio.h>
#include <pthread.h>

atomic_int counter = 0;

void *worker(void *arg) {
    for (int i = 0; i < 100000; i++) {
        atomic_fetch_add_explicit(&counter, 1, memory_order_relaxed);
        // fetch_add: atomically loads, adds 1, stores, returns OLD value
    }
    return NULL;
}

int main() {
    pthread_t t1, t2;
    pthread_create(&t1, NULL, worker, NULL);
    pthread_create(&t2, NULL, worker, NULL);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    printf("counter = %d\\n", atomic_load(&counter)); // always 200000
}
~~~

### compare_exchange — the CAS primitive

~~~c
atomic_int val = 10;

int expected = 10;
int desired  = 20;

// Atomically: if val == expected → val = desired, return true
//             else               → expected = val,  return false
bool ok = atomic_compare_exchange_strong(&val, &expected, desired);
// ok == true, val == 20
~~~

\`compare_exchange_weak\` may spuriously fail (returns false even when expected == val). Use it in CAS loops — it allows the compiler to generate more efficient code on some architectures (e.g., ARM's LL/SC instructions). Use \`compare_exchange_strong\` for one-shot tests.

### C++ std::atomic example

~~~cpp
#include <atomic>
#include <thread>
#include <vector>
#include <iostream>

std::atomic<int> counter{0};

void increment(int n) {
    for (int i = 0; i < n; i++) {
        counter.fetch_add(1, std::memory_order_relaxed);
    }
}

int main() {
    std::vector<std::thread> threads;
    for (int i = 0; i < 8; i++)
        threads.emplace_back(increment, 100000);
    for (auto &t : threads)
        t.join();
    std::cout << counter << "\\n"; // always 800000
}
~~~

### Java AtomicInteger

~~~java
import java.util.concurrent.atomic.AtomicInteger;

AtomicInteger counter = new AtomicInteger(0);

// fetch and add
int prev = counter.getAndIncrement();

// compare and set
boolean ok = counter.compareAndSet(expected, newValue);
~~~

### Common atomic operations

| Operation | Description |
|---|---|
| load / store | Atomic read or write |
| fetch_add | Add and return old value |
| fetch_sub | Subtract and return old value |
| exchange | Store new value and return old |
| compare_exchange | CAS — conditional swap |`,
      flashcards: [
        {
          front: "Why is counter++ not atomic even on a 64-bit CPU?",
          back: `\`counter++\` compiles to three distinct machine instructions: **LOAD** (read from memory to register), **ADD** (increment register), **STORE** (write register back to memory). Another thread can interrupt between any two of these steps, reading a stale value or overwriting the updated value. Atomicity requires all three to appear as a single indivisible step.`
        },
        {
          front: "What is the difference between compare_exchange_weak and compare_exchange_strong?",
          back: `Both perform CAS, but \`compare_exchange_weak\` may **spuriously fail** (return false even when the value equals expected) due to the underlying LL/SC hardware primitive on ARM/POWER. Use **weak** in a retry loop (the spurious failure is just an extra iteration, and the compiler can emit more efficient code). Use **strong** for a one-shot test where you cannot retry (e.g., if-statement, not a loop).`
        },
        {
          front: "What does fetch_add return?",
          back: `\`fetch_add(n)\` atomically adds \`n\` to the atomic variable and returns the **old value** (before the addition). This is useful when you need both the update and the previous value atomically — e.g., claiming a slot index in a lock-free queue.`
        }
      ],
      quiz: [
        {
          question: "Two threads both call fetch_add(1) on an atomic counter starting at 0. What are the possible final values?",
          options: ["0 or 1", "1", "2", "1 or 2"],
          answer: 2,
          explanation: `Each \`fetch_add\` is atomic — it cannot be interleaved with another \`fetch_add\`. The operations serialize in some order: either Thread 1 then Thread 2, or Thread 2 then Thread 1. Both orderings yield a final value of 2. Unlike non-atomic \`counter++\`, \`fetch_add\` can never lose an update.`
        },
        {
          question: "When should you use atomic operations instead of a mutex?",
          options: [
            "Always — atomics are strictly faster than mutexes",
            "For simple single-variable read-modify-write operations with no need to protect multi-step invariants",
            "When the critical section involves more than 3 variables",
            "Only on single-core machines"
          ],
          answer: 1,
          explanation: `Atomics shine for single-variable updates: counters, flags, sequence numbers. They become insufficient when you need to maintain invariants across **multiple variables** atomically (e.g., updating both a size field and a pointer together) — that requires a mutex. Atomics are not always faster: on high-contention hot variables, lock-based queuing can outperform spinning CAS loops.`
        },
        {
          question: "What is a 'torn read' and why do atomics prevent it?",
          options: [
            "A read that returns a value between two valid states",
            "A read where the thread reads the high 32 bits written by one store and the low 32 bits from another",
            "A read that triggers a page fault",
            "A read from a freed memory location"
          ],
          answer: 1,
          explanation: `On a 32-bit bus, a 64-bit write is not necessarily atomic — the CPU might write the high and low words separately. Another thread could read between these two partial writes, seeing half of the old value and half of the new value. \`std::atomic<uint64_t>\` guarantees the read sees either entirely the old value or entirely the new value — never a mixture.`
        },
        {
          question: "Write a lock-free stack push using compare_exchange_weak in C++.",
          answer: `~~~cpp
struct Node { int val; Node *next; };
std::atomic<Node*> head{nullptr};

void push(int val) {
    Node *node = new Node{val, nullptr};
    node->next = head.load(std::memory_order_relaxed);
    // CAS loop: swing head from old_head to new node
    while (!head.compare_exchange_weak(
               node->next,          // expected (updated on failure)
               node,                // desired
               std::memory_order_release,
               std::memory_order_relaxed)) {
        // node->next is automatically updated to current head on failure
    }
}
~~~
On failure, \`compare_exchange_weak\` writes the current \`head\` into \`node->next\`, so the loop retries with the fresh value — no separate reload needed.`
        }
      ]
    },
    {
      id: "memory-ordering",
      title: "Memory Ordering",
      body: `## Memory Ordering

Modern CPUs and compilers **reorder instructions** for performance — as long as the reordering is invisible to a single thread. In a multi-threaded program this can cause one thread to observe another thread's stores in a different order than they were written.

### Why reordering happens

~~~c
// Thread 1:           // Thread 2 (observing):
data = 42;            while (!ready) {}   // spins
ready = 1;            assert(data == 42); // can FAIL without barriers!
~~~

The CPU or compiler may reorder Thread 1's stores so \`ready = 1\` becomes visible before \`data = 42\`.

### Memory fences / barriers

A **fence** forces all memory operations before it to complete before any after it (from other threads' perspective).

~~~c
#include <stdatomic.h>

int data = 0;
atomic_int ready = 0;

// Thread 1 (producer):
data = 42;
atomic_thread_fence(memory_order_release); // all prior stores visible before...
atomic_store_explicit(&ready, 1, memory_order_relaxed);

// Thread 2 (consumer):
while (atomic_load_explicit(&ready, memory_order_relaxed) == 0) {}
atomic_thread_fence(memory_order_acquire); // ...all subsequent loads see them
assert(data == 42); // now safe
~~~

### C++ memory ordering levels (from weakest to strongest)

| Ordering | Description |
|---|---|
| \`memory_order_relaxed\` | No ordering guarantees — only atomicity of the operation itself |
| \`memory_order_acquire\` | No reads/writes in this thread can move before this load |
| \`memory_order_release\` | No reads/writes in this thread can move after this store |
| \`memory_order_acq_rel\` | Acquire + release for read-modify-write ops |
| \`memory_order_seq_cst\` | Total sequential consistency — strongest, default for std::atomic |

### Acquire-Release pairing

~~~cpp
#include <atomic>
#include <thread>
#include <cassert>

std::atomic<int> flag{0};
int payload = 0;

void producer() {
    payload = 99;                                  // plain write
    flag.store(1, std::memory_order_release);      // RELEASE: payload visible
}

void consumer() {
    while (flag.load(std::memory_order_acquire) == 0) {}  // ACQUIRE: sees payload
    assert(payload == 99);  // guaranteed
}

int main() {
    std::thread p(producer), c(consumer);
    p.join(); c.join();
}
~~~

The **release** on the store "publishes" all preceding writes. The **acquire** on the load "subscribes" to all writes that happened before that release. Together they establish a **happens-before** relationship.

### Happens-before

If operation A **happens-before** operation B, then B is guaranteed to observe all effects of A.

Established by:
- Thread creation (\`spawn\` happens-before any operation in the new thread).
- \`release\` store on variable X happens-before an \`acquire\` load of X that observes the stored value.
- Mutex unlock happens-before the next mutex lock.

### Data race = undefined behaviour

A **data race** occurs when two threads access the same non-atomic variable concurrently and at least one access is a write. In C++ this is **undefined behaviour** — the compiler is free to assume it never happens and may produce completely wrong code.

~~~cpp
int x = 0;           // NOT atomic
// Thread 1: x = 1; // data race!
// Thread 2: int y = x; // UB — x must be atomic or protected by a mutex
~~~

### Practical advice

- For counters and flags with no ordering requirement: \`memory_order_relaxed\`.
- For publish/subscribe patterns (producer sets data, consumer reads): \`release\` store + \`acquire\` load.
- When in doubt: \`memory_order_seq_cst\` (default) — correct but may be slower on ARM/POWER.`,
      flashcards: [
        {
          front: "What is a memory fence (barrier) and why is it needed?",
          back: `A memory fence is a CPU/compiler instruction that prevents reordering of memory operations across it. Without fences, CPUs may execute stores/loads out of program order for performance. In multi-threaded code, this can cause one thread to observe another thread's writes in the wrong order, breaking invariants even without data races on the flagging variable.`
        },
        {
          front: "What is the acquire-release pairing and what does it guarantee?",
          back: `An **acquire load** and a **release store** on the same atomic variable create a **happens-before** relationship: all memory writes performed by the releasing thread before the \`release\` store are guaranteed to be visible to the acquiring thread after its \`acquire\` load sees the stored value. This is the core mechanism for safely publishing data between threads.`
        },
        {
          front: "What is a data race in C++ and why is it undefined behaviour?",
          back: `A data race occurs when two threads concurrently access the same non-atomic object and at least one access is a write, with no synchronization between them. In C++, this is **undefined behaviour** — not just a potential bug. The compiler assumes races never happen and may reorder, hoist, or eliminate accesses in ways that produce completely wrong results.`
        }
      ],
      quiz: [
        {
          question: "What memory ordering should you use for a simple hit counter that doesn't need to synchronize other data?",
          options: [
            "memory_order_seq_cst — always use the strongest for safety",
            "memory_order_relaxed — only atomicity matters, no ordering needed",
            "memory_order_acquire — to prevent stale reads",
            "memory_order_release — to flush the counter to other cores"
          ],
          answer: 1,
          explanation: `A hit counter only needs the increment to be atomic — we don't care about the exact order in which increments from different threads are observed. \`memory_order_relaxed\` provides atomicity without any cross-thread ordering guarantees, avoiding the fence overhead of stronger orderings. If you later read the counter to make a decision based on other shared state, you need a stronger ordering at that read site.`
        },
        {
          question: "Thread A writes data then does a release store to flag. Thread B does an acquire load of flag and sees the stored value. Which statement is true?",
          options: [
            "Thread B is guaranteed to see Thread A's write to data",
            "Thread B may or may not see the write to data",
            "Thread B sees data only if it uses seq_cst",
            "Thread B needs its own release store to see Thread A's data"
          ],
          answer: 0,
          explanation: `The **release** store on flag creates a synchronizes-with relationship when Thread B's **acquire** load observes that value. This establishes happens-before: Thread A's write to \`data\` happened-before the release store, which happened-before Thread B's acquire load, which happened-before Thread B's read of \`data\`. Thread B is guaranteed to see \`data\`'s updated value.`
        },
        {
          question: "What is 'sequential consistency' (seq_cst) and when is it important?",
          options: [
            "It guarantees all threads execute in the same order as they were created",
            "It provides a single total order of all atomic operations across all threads",
            "It prevents any reordering within a single thread",
            "It ensures all threads finish before main() returns"
          ],
          answer: 1,
          explanation: `\`memory_order_seq_cst\` establishes a **single total modification order** visible to all threads. Without it, different threads may observe atomic operations in different orders (consistent with their own causal relationships but not globally total). Seq_cst is needed when correctness depends on all threads agreeing on a global interleaving — such as Dekker's algorithm or Peterson's mutual exclusion. On x86, seq_cst is cheap; on ARM/POWER it requires expensive memory barrier instructions.`
        },
        {
          question: "Explain how happens-before prevents data races without using a mutex.",
          answer: `**Happens-before** is a formal ordering relationship: if A happens-before B, B observes all effects of A. You can establish it without a mutex using:

1. **Release/acquire atomics**: store to an atomic with \`release\` ordering happens-before a load of that same atomic with \`acquire\` ordering that sees the stored value. Any plain writes before the release are visible after the acquire.

2. **Thread creation**: the spawning thread happens-before the first instruction of the new thread — so initializing shared state before spawning is safe without synchronization.

Example: write \`data\`, then \`flag.store(1, release)\`. Another thread that observes \`flag.load(acquire) == 1\` has a happens-before relationship with the first thread's write to \`data\` and is safe to read it. No mutex needed — but you must use the correct memory ordering or the guarantee evaporates.`
        }
      ]
    }
  ]
}
