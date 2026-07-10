export default {
  id: "python",
  title: "Python",
  subchapters: [
    {
      id: "gil",
      title: "The GIL (Global Interpreter Lock)",
      body: `## The Global Interpreter Lock (GIL)

The GIL is a mutex inside CPython that allows only **one thread to execute Python bytecode at a time**, even on multi-core machines.

### Why does it exist?
CPython manages memory via **reference counting**. Every Python object has a \`ob_refcnt\` field. Incrementing/decrementing that counter from multiple threads simultaneously would cause race conditions and use-after-free bugs. Rather than fine-grained locking per object, CPython uses one coarse lock — the GIL — to keep reference counting safe.

### Effect on CPU-bound threads
CPU-bound threads that do nothing but crunch numbers compete for the GIL. Only one runs at a time, so **4 CPU-bound threads on a 4-core machine run no faster** (often slower due to contention) than 1 thread.

~~~python
import threading, time

def count_up(n):
    x = 0
    while x < n:
        x += 1

# Two CPU-bound threads — still limited to 1 core
t1 = threading.Thread(target=count_up, args=(50_000_000,))
t2 = threading.Thread(target=count_up, args=(50_000_000,))
start = time.perf_counter()
t1.start(); t2.start()
t1.join(); t2.join()
print(f"elapsed: {time.perf_counter() - start:.2f}s")
# Roughly the same as running sequentially
~~~

### Effect on IO-bound threads
When a thread performs a blocking IO call (network, disk, sleep), it **releases the GIL** so other threads can run. Threading is effective for IO-bound workloads.

~~~python
import threading, urllib.request

urls = [
    "https://httpbin.org/delay/1",
    "https://httpbin.org/delay/1",
    "https://httpbin.org/delay/1",
]

def fetch(url):
    urllib.request.urlopen(url)
    print(f"done: {url}")

threads = [threading.Thread(target=fetch, args=(u,)) for u in urls]
for t in threads: t.start()
for t in threads: t.join()
# All 3 requests overlap — total ~1s instead of ~3s
~~~

### Workarounds
| Approach | Notes |
|---|---|
| \`multiprocessing\` | Separate processes, each has its own GIL |
| C extensions (NumPy, etc.) | Can release the GIL inside C code |
| \`concurrent.futures.ProcessPoolExecutor\` | High-level multiprocessing API |
| Free-threaded CPython 3.13+ | Experimental build (\`--disable-gil\`), no GIL |
`,
      flashcards: [
        {
          front: "What is the GIL and why does CPython have one?",
          back: `The **Global Interpreter Lock** is a mutex that allows only one thread to run Python bytecode at a time. CPython uses **reference counting** for memory management; without the GIL, concurrent ref-count updates would cause data races and memory corruption.`
        },
        {
          front: "Does the GIL hurt IO-bound or CPU-bound threads more?",
          back: `**CPU-bound** threads are hurt the most — they never voluntarily release the GIL, so true parallelism is impossible. IO-bound threads release the GIL during blocking calls, so threading still provides concurrency for IO workloads.`
        },
        {
          front: "Name two ways to achieve true CPU parallelism in Python.",
          back: `1. **\`multiprocessing\`** — spawns separate OS processes, each with its own GIL and interpreter.
2. **C extensions** (e.g. NumPy, Cython) — can release the GIL inside native code.
3. *(Future)* **Free-threaded CPython 3.13+** — experimental build with the GIL disabled.`
        }
      ],
      quiz: [
        {
          question: "Which workload benefits LEAST from Python's threading module due to the GIL?",
          options: [
            "Downloading files from the internet",
            "Reading many files from disk",
            "Performing matrix multiplication in pure Python",
            "Waiting for database query responses"
          ],
          answer: 2,
          explanation: `**Matrix multiplication in pure Python** is CPU-bound — threads constantly compete for the GIL and never yield it voluntarily, so no parallelism is achieved. All other options involve IO, which releases the GIL.`
        },
        {
          question: "What happens to the GIL when a Python thread makes a blocking socket read?",
          options: [
            "The GIL is acquired and held until data arrives",
            "The GIL is released so other threads can run",
            "The thread is killed and restarted",
            "A new GIL is created for that thread"
          ],
          answer: 1,
          explanation: `CPython releases the GIL before entering a blocking IO syscall and re-acquires it when the call returns. This allows other Python threads to run while one thread is waiting for IO.`
        },
        {
          question: "Why does CPython use reference counting instead of a tracing GC alone?",
          options: [
            "Reference counting is more accurate for cyclic structures",
            "It provides deterministic, immediate object cleanup",
            "It requires no extra memory per object",
            "It is faster than mark-and-sweep for all cases"
          ],
          answer: 1,
          explanation: `Reference counting provides **deterministic cleanup** — an object is freed the moment its count reaches zero, making resource release (files, sockets) predictable. CPython adds a cyclic GC on top to handle reference cycles that refcounting alone cannot collect.`
        },
        {
          question: "How does the free-threaded Python 3.13 build (--disable-gil) differ from standard CPython?",
          options: [
            "It uses green threads instead of OS threads",
            "It removes the GIL, allowing true parallel bytecode execution",
            "It disables the garbage collector",
            "It replaces reference counting with a tracing GC"
          ],
          answer: 1,
          explanation: `The experimental free-threaded build compiles CPython without the GIL, enabling multiple OS threads to execute Python bytecode in parallel. It uses fine-grained locking and biased reference counting to keep thread safety without a single global lock.`
        }
      ]
    },
    {
      id: "asyncio",
      title: "asyncio",
      body: `## asyncio — Asynchronous IO in Python

\`asyncio\` is Python's standard library for writing **concurrent, single-threaded IO-bound code** using an event loop and coroutines.

### How it works
- A single **event loop** runs on one thread.
- **Coroutines** are functions defined with \`async def\`. They are not run until awaited.
- The \`await\` keyword suspends the current coroutine and yields control back to the event loop, which can then run another coroutine.
- No OS threads or processes — concurrency comes from cooperative multitasking.

~~~python
import asyncio

async def fetch_data(name: str, delay: float) -> str:
    print(f"{name}: starting")
    await asyncio.sleep(delay)   # releases event loop during sleep
    print(f"{name}: done")
    return f"{name} result"

async def main():
    # Run two coroutines concurrently
    results = await asyncio.gather(
        fetch_data("A", 1.0),
        fetch_data("B", 0.5),
    )
    print(results)

asyncio.run(main())
# Output order: A starting, B starting, B done, A done
# Total time ~1s, not 1.5s
~~~

### Tasks
\`asyncio.create_task()\` wraps a coroutine and schedules it to run soon, without waiting for it immediately.

~~~python
async def main():
    task1 = asyncio.create_task(fetch_data("X", 2.0))
    task2 = asyncio.create_task(fetch_data("Y", 1.0))
    # Do something else here while tasks run...
    r1 = await task1
    r2 = await task2
    print(r1, r2)
~~~

### When asyncio helps
- Network clients/servers (HTTP, WebSocket, DB queries)
- Scraping many URLs concurrently
- Microservices, chat servers

### Common pitfalls
- **Blocking calls inside async functions** stall the entire event loop:
~~~python
import time

async def bad():
    time.sleep(2)        # BLOCKS the event loop — nothing else runs
    await asyncio.sleep(2)  # CORRECT — yields control
~~~
- Forgetting \`await\` creates a coroutine object but never runs it.
- CPU-bound work inside asyncio still runs on one core — use \`loop.run_in_executor\` or \`ProcessPoolExecutor\`.
`,
      flashcards: [
        {
          front: "What is the asyncio event loop?",
          back: `A single-threaded loop that drives coroutines. It picks a ready coroutine, runs it until an \`await\` point, suspends it, and switches to the next ready one. All IO waiting happens asynchronously via OS mechanisms (epoll/kqueue).`
        },
        {
          front: "What is the difference between asyncio.gather and asyncio.create_task?",
          back: `- **\`asyncio.gather(*coros)\`** — schedules all coroutines concurrently and awaits all results at once.
- **\`asyncio.create_task(coro)\`** — schedules a single coroutine as a background Task immediately; you await it later (or not at all). \`gather\` is built on top of tasks.`
        },
        {
          front: "Why does calling time.sleep() inside an async function break asyncio?",
          back: `\`time.sleep()\` is a **blocking** OS call that stalls the whole thread — the event loop cannot run any other coroutine during the sleep. Always use \`await asyncio.sleep()\` which suspends only the current coroutine and lets the event loop continue.`
        }
      ],
      quiz: [
        {
          question: "What does the `await` keyword do inside an async function?",
          options: [
            "It blocks the OS thread until the awaitable completes",
            "It suspends the current coroutine and returns control to the event loop",
            "It spawns a new thread for the awaitable",
            "It schedules the awaitable to run after the current function returns"
          ],
          answer: 1,
          explanation: `\`await\` **suspends** the current coroutine at that point, returning control to the event loop. The event loop can then run other coroutines. When the awaited value is ready, the suspended coroutine is resumed.`
        },
        {
          question: "Which of the following is NOT a good use case for asyncio?",
          options: [
            "A web server handling many simultaneous HTTP connections",
            "Fetching 1000 URLs concurrently",
            "Computing prime numbers using multiple CPU cores",
            "A chat application with many idle WebSocket connections"
          ],
          answer: 2,
          explanation: `asyncio is designed for **IO-bound** concurrency. CPU-bound work like computing primes runs on a single core in asyncio and blocks the event loop. Use \`multiprocessing\` or \`ProcessPoolExecutor\` for CPU-bound parallelism.`
        },
        {
          question: "What does asyncio.run(main()) do?",
          options: [
            "Runs main() in a new thread",
            "Creates an event loop, runs the main() coroutine until completion, then closes the loop",
            "Schedules main() to run after the current event loop iteration",
            "Runs main() in a subprocess"
          ],
          answer: 1,
          explanation: `\`asyncio.run()\` is the standard entry point for asyncio programs. It creates a new event loop, runs the passed coroutine to completion, then closes the loop and cleans up resources.`
        },
        {
          question: "If two tasks are created with create_task and both start immediately, how many OS threads are used?",
          options: [
            "Two — one per task",
            "One — the event loop thread",
            "As many as CPU cores",
            "It depends on the OS"
          ],
          answer: 1,
          explanation: `asyncio is **single-threaded**. All tasks run on the same OS thread, interleaved by the event loop at \`await\` points. No new threads are created for tasks.`
        }
      ]
    },
    {
      id: "generators",
      title: "Generators",
      body: `## Generators

Generators are functions that **yield values one at a time**, pausing execution between yields. They enable lazy evaluation and efficient memory use for large sequences.

### The yield keyword
When Python calls a generator function, it returns a **generator object** without executing the body. Each \`next()\` call resumes execution until the next \`yield\`.

~~~python
def count_up_to(n):
    i = 0
    while i < n:
        yield i      # pause here, send i to caller
        i += 1       # resume here on next next()

gen = count_up_to(5)
print(next(gen))  # 0
print(next(gen))  # 1
for val in gen:
    print(val)    # 2, 3, 4
~~~

### Memory efficiency
A generator never materializes the whole sequence in memory.

~~~python
# List comprehension: loads 10 million ints into RAM
big_list = [x * x for x in range(10_000_000)]

# Generator expression: computes one value at a time
big_gen = (x * x for x in range(10_000_000))

import sys
print(sys.getsizeof(big_list))  # ~80 MB
print(sys.getsizeof(big_gen))   # ~200 bytes
~~~

### yield from
Delegates to a sub-generator, forwarding values and allowing two-way communication.

~~~python
def flatten(nested):
    for item in nested:
        if isinstance(item, list):
            yield from flatten(item)   # recurse via sub-generator
        else:
            yield item

print(list(flatten([1, [2, [3, 4]], 5])))  # [1, 2, 3, 4, 5]
~~~

### send() — two-way communication
Generators can receive values from the caller via \`send()\`, enabling coroutine-style patterns.

~~~python
def accumulator():
    total = 0
    while True:
        value = yield total   # yield current total, receive new value
        if value is None:
            break
        total += value

acc = accumulator()
next(acc)          # prime the generator (advance to first yield)
print(acc.send(10))  # 10
print(acc.send(20))  # 30
print(acc.send(5))   # 35
~~~
`,
      flashcards: [
        {
          front: "What is the difference between a generator function and a regular function?",
          back: `A regular function runs to completion and returns one value. A generator function contains \`yield\` and returns a **generator object** immediately without running the body. Each \`next()\` call runs until the next \`yield\`, pausing execution and preserving local state.`
        },
        {
          front: "Why are generators memory-efficient compared to lists?",
          back: `Generators produce values **lazily** — one at a time on demand — so they never need to hold the entire sequence in memory simultaneously. A generator expression over 10 million items uses ~200 bytes; the equivalent list uses tens of megabytes.`
        },
        {
          front: "What does `yield from subgen` do?",
          back: `It delegates iteration to \`subgen\`, forwarding each yielded value to the outer caller and passing \`send()\` / \`throw()\` calls into the sub-generator. It simplifies recursive generators and is the foundation of Python's pre-asyncio coroutine system.`
        }
      ],
      quiz: [
        {
          question: "What is returned when you call a generator function?",
          options: [
            "The first yielded value",
            "None",
            "A generator object (iterator)",
            "A list of all yielded values"
          ],
          answer: 2,
          explanation: `Calling a generator function returns a **generator object** immediately, without executing any of the function body. The body runs only when you call \`next()\` on the object.`
        },
        {
          question: "What does `next()` raise when a generator is exhausted?",
          options: [
            "ValueError",
            "GeneratorExit",
            "StopIteration",
            "IndexError"
          ],
          answer: 2,
          explanation: `When a generator function's body finishes (or reaches a bare \`return\`), it raises \`StopIteration\`. The \`for\` loop catches this automatically to know when to stop iterating.`
        },
        {
          question: "Before calling gen.send(value), what must you do?",
          options: [
            "Call gen.reset()",
            "Call next(gen) to advance to the first yield",
            "Nothing — send() works immediately",
            "Call gen.start()"
          ],
          answer: 1,
          explanation: `You must **prime** the generator by calling \`next(gen)\` (or \`gen.send(None)\`) first. This advances execution to the first \`yield\` expression, which is where \`send()\` delivers its value.`
        },
        {
          question: "Which is more memory-efficient for summing squares of 1 million numbers?",
          options: [
            "[x**2 for x in range(1_000_000)] — list comprehension",
            "sum(x**2 for x in range(1_000_000)) — generator expression",
            "Both use the same memory",
            "It depends on Python version"
          ],
          answer: 1,
          explanation: `The generator expression inside \`sum()\` produces one value at a time and never stores the full sequence. The list comprehension builds a list of 1 million integers in RAM (~8 MB) before summing.`
        }
      ]
    },
    {
      id: "decorators",
      title: "Decorators",
      body: `## Decorators

A decorator is a **callable that takes a function and returns a replacement function**. Decorators work because Python treats functions as first-class objects.

### Functions as objects
~~~python
def greet(name):
    return f"Hello, {name}"

say_hi = greet          # assign function to a variable
print(say_hi("Alice"))  # Hello, Alice

def apply(func, arg):
    return func(arg)

print(apply(greet, "Bob"))  # Hello, Bob
~~~

### Basic decorator
~~~python
import time

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.perf_counter() - start:.4f}s")
        return result
    return wrapper

@timer
def slow_add(a, b):
    time.sleep(0.1)
    return a + b

slow_add(1, 2)   # slow_add took 0.1001s
~~~

\`@timer\` is syntactic sugar for \`slow_add = timer(slow_add)\`.

### functools.wraps — preserving metadata
Without \`@wraps\`, the wrapper hides the original function's name and docstring.

~~~python
from functools import wraps

def timer(func):
    @wraps(func)          # copies __name__, __doc__, etc. from func
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.perf_counter() - start:.4f}s")
        return result
    return wrapper
~~~

### Decorators with arguments
Add another layer of wrapping to accept parameters.

~~~python
from functools import wraps

def retry(times=3):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(times):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == times - 1:
                        raise
                    print(f"Attempt {attempt+1} failed: {e}")
        return wrapper
    return decorator

@retry(times=3)
def unstable_request():
    import random
    if random.random() < 0.7:
        raise ConnectionError("timeout")
    return "ok"
~~~

### Common uses
- **Logging / timing** (as above)
- **Authentication checks** (\`@login_required\` in Django)
- **Caching** (\`@functools.lru_cache\`)
- **Rate limiting**
- **Input validation / schema enforcement**
`,
      flashcards: [
        {
          front: "What is a decorator in Python?",
          back: `A decorator is a callable (usually a function) that takes a function as input and returns a new function — typically a wrapper. \`@decorator\` before a \`def\` is syntactic sugar for \`func = decorator(func)\`.`
        },
        {
          front: "Why should you use @functools.wraps on a wrapper function?",
          back: `Without \`@wraps\`, the wrapper replaces the original function's \`__name__\`, \`__doc__\`, \`__module__\`, etc. with the wrapper's own. \`@wraps(original_func)\` copies all that metadata onto the wrapper, so debugging, introspection, and tools like Sphinx see the correct function identity.`
        },
        {
          front: "How do you write a decorator that accepts arguments?",
          back: `Add an outer factory function that receives the arguments and returns the actual decorator:
~~~python
def repeat(n):          # factory — called at decoration time
    def decorator(func):  # actual decorator
        @wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(n):
                func(*args, **kwargs)
        return wrapper
    return decorator

@repeat(3)
def hello(): print("hi")
~~~`
        }
      ],
      quiz: [
        {
          question: "What does @my_decorator above a function definition do?",
          options: [
            "Calls my_decorator() immediately with no arguments",
            "Replaces the function with my_decorator(function)",
            "Adds my_decorator to the function's __decorators__ list",
            "Wraps my_decorator around the function's return value"
          ],
          answer: 1,
          explanation: `\`@my_decorator\` is exactly equivalent to writing \`func = my_decorator(func)\` after the function definition. Python passes the decorated function to \`my_decorator\` and replaces the name binding with whatever \`my_decorator\` returns.`
        },
        {
          question: "What problem does functools.lru_cache solve?",
          options: [
            "It retries failed function calls automatically",
            "It memoizes function results, caching outputs for previously seen inputs",
            "It logs all function calls to a file",
            "It enforces type annotations at runtime"
          ],
          answer: 1,
          explanation: `\`@functools.lru_cache\` is a **memoization** decorator. It caches the return value for each unique set of arguments. Subsequent calls with the same arguments return the cached result without re-executing the function body.`
        },
        {
          question: "Without @functools.wraps, what undesirable side-effect occurs?",
          options: [
            "The wrapper raises TypeError when called",
            "The original function is not called",
            "func.__name__ and func.__doc__ show the wrapper's metadata instead of the original's",
            "The decorator only works once"
          ],
          answer: 2,
          explanation: `The wrapper function is a different object with its own name and docstring. Without \`@wraps\`, introspection (\`help()\`, logging, tracebacks) shows the wrapper's metadata, making debugging harder.`
        },
        {
          question: "How many nested function layers does a decorator-with-arguments require?",
          options: [
            "1 (just the decorator)",
            "2 (decorator + wrapper)",
            "3 (factory + decorator + wrapper)",
            "4 or more"
          ],
          answer: 2,
          explanation: `You need three levels: (1) the **factory** that accepts the arguments and is called at decoration time, (2) the **decorator** it returns that accepts the function, and (3) the **wrapper** that replaces the original function at call time.`
        }
      ]
    },
    {
      id: "context-managers",
      title: "Context Managers",
      body: `## Context Managers

A context manager defines setup and teardown logic for a block of code via the \`with\` statement, guaranteeing cleanup even if an exception occurs.

### The with statement
~~~python
# Without context manager — easy to forget close()
f = open("data.txt")
data = f.read()
f.close()   # skipped if read() raises!

# With context manager — close() called automatically
with open("data.txt") as f:
    data = f.read()
# f.close() called here, even on exception
~~~

### The protocol: __enter__ and __exit__
Any object implementing \`__enter__\` and \`__exit__\` is a context manager.

~~~python
class Timer:
    def __enter__(self):
        import time
        self._start = time.perf_counter()
        return self           # bound to 'as' variable

    def __exit__(self, exc_type, exc_val, exc_tb):
        import time
        self.elapsed = time.perf_counter() - self._start
        print(f"Elapsed: {self.elapsed:.4f}s")
        return False          # False = do not suppress exceptions

with Timer() as t:
    sum(range(10_000_000))

print(t.elapsed)
~~~

\`__exit__\` receives exception info (\`exc_type\`, \`exc_val\`, \`exc_tb\`). Returning \`True\` suppresses the exception; \`False\` (or \`None\`) re-raises it.

### contextlib.contextmanager — generator-based shortcut
~~~python
from contextlib import contextmanager

@contextmanager
def managed_resource(name):
    print(f"acquiring {name}")
    resource = {"name": name}
    try:
        yield resource          # everything up to yield is __enter__
    finally:
        print(f"releasing {name}")  # always runs — acts as __exit__

with managed_resource("db_conn") as r:
    print(f"using {r['name']}")
# acquiring db_conn
# using db_conn
# releasing db_conn
~~~

### Common uses
- File handles, network sockets, database connections
- Thread locks (\`with threading.Lock():\`)
- Temporary directory/file (\`with tempfile.TemporaryDirectory():\`)
- Database transactions (\`with db.transaction():\`)
- Mocking in tests (\`with unittest.mock.patch(...):\`)
`,
      flashcards: [
        {
          front: "What two methods define the context manager protocol?",
          back: `**\`__enter__(self)\`** — called when entering the \`with\` block; its return value is bound to the \`as\` variable.

**\`__exit__(self, exc_type, exc_val, exc_tb)\`** — called when leaving the block (normally or via exception). Return \`True\` to suppress the exception, \`False\`/\`None\` to propagate it.`
        },
        {
          front: "How does contextlib.contextmanager work?",
          back: `It wraps a generator function as a context manager. Code **before** \`yield\` runs as \`__enter__\`; the yielded value becomes the \`as\` variable. Code **after** \`yield\` (usually in a \`finally\` block) runs as \`__exit__\`, guaranteeing cleanup.`
        },
        {
          front: "What is the key advantage of using `with` over try/finally for resource cleanup?",
          back: `\`with\` is more concise and less error-prone. The cleanup logic lives in one place (the context manager class/function) rather than duplicated at every call site. It is impossible to forget cleanup because \`__exit__\` is always called, even if an exception occurs.`
        }
      ],
      quiz: [
        {
          question: "What happens if an exception is raised inside a `with` block?",
          options: [
            "__exit__ is skipped to avoid masking the error",
            "__exit__ is called with the exception info before the exception propagates",
            "The with block silently swallows the exception",
            "Python retries the with block once"
          ],
          answer: 1,
          explanation: `\`__exit__\` is **always** called, even when an exception occurs. The exception type, value, and traceback are passed as arguments. \`__exit__\` can suppress the exception by returning \`True\` or let it propagate by returning \`False\`.`
        },
        {
          question: "In __exit__(self, exc_type, exc_val, exc_tb), what does returning True do?",
          options: [
            "Re-raises the exception",
            "Suppresses the exception — the with block exits normally",
            "Logs the exception to stderr",
            "Converts the exception to a warning"
          ],
          answer: 1,
          explanation: `Returning \`True\` from \`__exit__\` **suppresses** the exception. Execution continues after the \`with\` block as if nothing happened. This is intentional only in rare cases (e.g., a context manager designed to catch specific errors).`
        },
        {
          question: "Which module provides the @contextmanager decorator?",
          options: [
            "functools",
            "contextlib",
            "collections",
            "itertools"
          ],
          answer: 1,
          explanation: `\`@contextmanager\` is in the **\`contextlib\`** standard library module. It converts a generator function (with exactly one \`yield\`) into a context manager without writing a class with \`__enter__\`/\`__exit__\`.`
        },
        {
          question: "What is the return value of __enter__ used for?",
          options: [
            "It determines whether exceptions are suppressed",
            "It is bound to the variable in the `as` clause",
            "It is passed as the first argument to __exit__",
            "It sets the timeout for the with block"
          ],
          answer: 1,
          explanation: `Whatever \`__enter__\` returns is bound to the name after \`as\` in the \`with\` statement. For example, \`open()\` returns the file object from \`__enter__\`, making it available as \`f\` in \`with open(...) as f:\`.`
        }
      ]
    },
    {
      id: "typing",
      title: "Typing",
      body: `## Typing and Type Hints

Python's \`typing\` module (PEP 484+) allows annotating variables, parameters, and return types. Annotations are **not enforced at runtime** by default — they are metadata for static analysis tools like \`mypy\` and IDE checkers.

### Basic annotations
~~~python
def greet(name: str, times: int = 1) -> str:
    return (f"Hello, {name}! " * times).strip()

age: int = 30
names: list[str] = ["Alice", "Bob"]   # Python 3.9+ built-in generics
~~~

### Optional and Union
~~~python
from typing import Optional, Union

def find_user(user_id: int) -> Optional[str]:   # str | None
    users = {1: "Alice", 2: "Bob"}
    return users.get(user_id)        # returns str or None

# Python 3.10+ union syntax
def process(value: int | str) -> str:
    return str(value)
~~~

### Generics with TypeVar
~~~python
from typing import TypeVar, Generic

T = TypeVar("T")

def first(items: list[T]) -> T:
    return items[0]

class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        return self._items.pop()

s: Stack[int] = Stack()
s.push(42)
~~~

### Protocol — structural subtyping (duck typing)
~~~python
from typing import Protocol

class Drawable(Protocol):
    def draw(self) -> None: ...

class Circle:
    def draw(self) -> None:
        print("drawing circle")

class Square:
    def draw(self) -> None:
        print("drawing square")

def render(shape: Drawable) -> None:
    shape.draw()

render(Circle())   # works — Circle satisfies Drawable structurally
render(Square())   # works — no explicit inheritance needed
~~~

### Runtime behavior
Type hints are stored in \`__annotations__\` but do nothing at runtime unless you use a library like \`pydantic\` or call \`typing.get_type_hints()\`.

~~~python
def add(a: int, b: int) -> int:
    return a + b

add("hello", "world")  # runs fine — no runtime enforcement
print(add.__annotations__)  # {'a': <class 'int'>, 'b': <class 'int'>, 'return': <class 'int'>}
~~~
`,
      flashcards: [
        {
          front: "Are Python type hints enforced at runtime?",
          back: `**No.** Type hints are stored as metadata in \`__annotations__\` but Python ignores them during execution. They are used by static analysis tools (\`mypy\`, \`pyright\`), IDEs, and documentation generators. Libraries like \`pydantic\` opt in to runtime enforcement.`
        },
        {
          front: "What is the difference between Optional[X] and Union[X, None]?",
          back: `They are exactly equivalent — \`Optional[X]\` is shorthand for \`Union[X, None]\`. Both mean the value is either of type \`X\` or \`None\`. In Python 3.10+, \`X | None\` is the preferred syntax.`
        },
        {
          front: "What is a Protocol and how does it differ from ABC?",
          back: `A \`Protocol\` defines an interface via **structural subtyping** (duck typing) — any class with the required methods satisfies it without explicitly inheriting from the Protocol. An \`ABC\` (Abstract Base Class) uses **nominal subtyping** — classes must explicitly subclass the ABC to satisfy it.`
        }
      ],
      quiz: [
        {
          question: "What does Optional[str] mean in a type annotation?",
          options: [
            "The argument is optional and has a default value",
            "The value is either a str or None",
            "The value is a str with no constraints",
            "The annotation is optional and can be omitted"
          ],
          answer: 1,
          explanation: `\`Optional[str]\` is identical to \`Union[str, None]\`. It means the value can be a \`str\` instance **or** \`None\`. It says nothing about whether the function parameter has a default value.`
        },
        {
          question: "What is TypeVar used for?",
          options: [
            "Creating runtime-enforced constraints on variable types",
            "Defining type variables for generic functions and classes",
            "Aliasing complex types to shorter names",
            "Declaring class-level variables"
          ],
          answer: 1,
          explanation: `\`TypeVar\` creates a placeholder type that can be substituted with any concrete type, enabling **generics**. When you annotate \`def first(items: list[T]) -> T\`, the type checker infers that if you pass \`list[int]\`, the return is \`int\`.`
        },
        {
          question: "Which tool performs static type checking of Python type annotations?",
          options: [
            "pylint",
            "black",
            "mypy",
            "pytest"
          ],
          answer: 2,
          explanation: `**mypy** is the canonical static type checker for Python. It reads type annotations and reports type errors without running the code. \`pyright\` (used by VS Code Pylance) is a modern alternative.`
        },
        {
          question: "A class that implements all methods of a Protocol but does not inherit from it — does it satisfy the Protocol?",
          options: [
            "No — explicit inheritance is required",
            "Yes — Protocol uses structural subtyping",
            "Only if it is registered with Protocol.register()",
            "Only at runtime, not statically"
          ],
          answer: 1,
          explanation: `\`typing.Protocol\` uses **structural subtyping**. Any class with the correct methods and attributes satisfies the Protocol, regardless of its inheritance hierarchy. This formalizes Python's duck typing for static checkers.`
        }
      ]
    },
    {
      id: "dataclasses",
      title: "Dataclasses",
      body: `## Dataclasses

The \`@dataclass\` decorator (Python 3.7+) auto-generates boilerplate methods (\`__init__\`, \`__repr__\`, \`__eq__\`) from class variable annotations.

### Basic usage
~~~python
from dataclasses import dataclass, field

@dataclass
class Point:
    x: float
    y: float
    label: str = "origin"   # default value

p = Point(1.0, 2.0)
print(p)              # Point(x=1.0, y=2.0, label='origin')
print(p == Point(1.0, 2.0))  # True — __eq__ compares fields
~~~

### Mutable defaults — use field(default_factory=...)
Mutable defaults (lists, dicts) must use \`field(default_factory=...)\` to avoid sharing state across instances.

~~~python
@dataclass
class Inventory:
    items: list[str] = field(default_factory=list)
    metadata: dict = field(default_factory=dict)

a = Inventory()
b = Inventory()
a.items.append("sword")
print(b.items)   # [] — separate list, not shared
~~~

### __post_init__ — custom initialization logic
~~~python
@dataclass
class Circle:
    radius: float

    def __post_init__(self):
        if self.radius <= 0:
            raise ValueError(f"radius must be positive, got {self.radius}")

    @property
    def area(self) -> float:
        import math
        return math.pi * self.radius ** 2
~~~

### frozen=True — immutable dataclass (hashable)
~~~python
@dataclass(frozen=True)
class Color:
    r: int
    g: int
    b: int

red = Color(255, 0, 0)
# red.r = 100  # raises FrozenInstanceError
colors = {red, Color(0, 255, 0)}  # hashable — can use in sets/dicts
~~~

### Comparison with alternatives
| | \`@dataclass\` | \`namedtuple\` | Pydantic \`BaseModel\` |
|---|---|---|---|
| Mutable | yes (default) | no | yes |
| Validation | manual (\`__post_init__\`) | none | automatic |
| Serialization | manual | manual | built-in |
| Performance | fast | fast | slightly slower |
| Python version | 3.7+ | all | external dep |
`,
      flashcards: [
        {
          front: "What methods does @dataclass auto-generate?",
          back: `By default: \`__init__\` (from annotated fields), \`__repr__\`, and \`__eq__\`. With additional flags: \`__hash__\` (frozen=True or unsafe_hash=True), \`__lt__/__le__/__gt__/__ge__\` (order=True).`
        },
        {
          front: "Why can't you use a mutable default like [] directly in a dataclass field?",
          back: `If you write \`items: list = []\`, all instances share the **same list object** as the default — mutating one instance's list mutates all others. Use \`field(default_factory=list)\` to create a fresh list for each instance.`
        },
        {
          front: "What does frozen=True do to a dataclass?",
          back: `Setting \`frozen=True\` makes the dataclass **immutable** — attempting to set or delete a field after \`__init__\` raises \`FrozenInstanceError\`. It also enables \`__hash__\`, making instances usable as dict keys or set members.`
        }
      ],
      quiz: [
        {
          question: "What is the purpose of __post_init__ in a dataclass?",
          options: [
            "It replaces __init__ entirely",
            "It runs after the auto-generated __init__ for custom validation or transformation",
            "It defines post-deletion cleanup logic",
            "It is called when the object is serialized"
          ],
          answer: 1,
          explanation: `\`__post_init__\` is called by the auto-generated \`__init__\` after it finishes setting all fields. It is the correct place for cross-field validation, computed fields, or any logic that depends on field values.`
        },
        {
          question: "Which is the correct way to declare a list field with a default in a dataclass?",
          options: [
            "items: list = []",
            "items: list = field(default_factory=list)",
            "items: list = field(default=[])",
            "items: list = List()"
          ],
          answer: 1,
          explanation: `\`field(default_factory=list)\` calls \`list()\` for each new instance, creating an independent list. Using \`default=[]\` directly raises \`ValueError\` because dataclasses detect mutable defaults and refuse them.`
        },
        {
          question: "What extra capability does frozen=True add that a normal dataclass lacks?",
          options: [
            "Automatic serialization to JSON",
            "Hashability — instances can be used as dict keys or in sets",
            "Automatic type validation",
            "Faster attribute access via __slots__"
          ],
          answer: 1,
          explanation: `By default, mutable dataclasses are not hashable (Python sets \`__hash__ = None\` when \`__eq__\` is defined without \`frozen=True\`). With \`frozen=True\`, a \`__hash__\` based on all fields is generated, making instances hashable.`
        },
        {
          question: "How does a dataclass differ from a namedtuple?",
          options: [
            "Dataclasses are always faster",
            "namedtuples support type annotations; dataclasses do not",
            "Dataclasses are mutable by default and support methods more naturally",
            "namedtuples auto-generate __init__; dataclasses do not"
          ],
          answer: 2,
          explanation: `\`namedtuple\` instances are **immutable tuples** with named fields — you cannot change attributes after creation. \`@dataclass\` instances are mutable by default (unless \`frozen=True\`) and are regular class instances that support methods, inheritance, and \`__post_init__\` naturally.`
        }
      ]
    },
    {
      id: "garbage-collection",
      title: "Garbage Collection",
      body: `## Garbage Collection in Python

CPython uses two complementary mechanisms: **reference counting** (primary) and a **cyclic garbage collector** (secondary).

### Reference counting
Every Python object has a field \`ob_refcnt\`. When the count reaches zero, the object is immediately freed.

~~~python
import sys

x = []
print(sys.getrefcount(x))  # 2 (x + getrefcount arg)
y = x
print(sys.getrefcount(x))  # 3 (x, y, getrefcount arg)
del y
print(sys.getrefcount(x))  # 2 again
del x
# x is freed immediately — refcount hit 0
~~~

### Reference cycles — the problem
Reference counting cannot collect **cycles** because neither object's count reaches zero.

~~~python
import gc

class Node:
    def __init__(self):
        self.peer = None

a = Node()
b = Node()
a.peer = b    # a -> b
b.peer = a    # b -> a  (cycle!)

del a, del b  # both refcounts go to 1 (via cycle), not 0
# Without the cyclic GC, memory leaks here
gc.collect()  # forces cyclic GC to find and free the cycle
~~~

### The cyclic GC — generational collection
Python's cyclic GC tracks objects that might participate in cycles (containers: lists, dicts, sets, instances). It uses **3 generations** — objects that survive more collections are promoted to older generations and collected less frequently.

~~~python
import gc

print(gc.get_threshold())   # (700, 10, 10) — default thresholds
print(gc.get_count())        # (n0, n1, n2) — objects in each gen

gc.disable()   # turn off cyclic GC (useful if you manage cycles manually)
gc.enable()
gc.collect(0)  # collect only generation 0
~~~

### __del__ — finalizers
\`__del__\` is called when an object is about to be freed. It is **not** a destructor in C++ terms — avoid relying on it for critical cleanup.

~~~python
class Resource:
    def __del__(self):
        print("Resource freed")   # may be delayed or never called in cycles

r = Resource()
del r   # "Resource freed" printed immediately (refcount case)
~~~

### weakref — references without ownership
~~~python
import weakref

class Cache:
    pass

obj = Cache()
ref = weakref.ref(obj)    # does not increment refcount

print(ref())      # <Cache object>
del obj
print(ref())      # None — object was freed
~~~

Use weakrefs in caches or observer patterns to avoid keeping objects alive unintentionally.
`,
      flashcards: [
        {
          front: "Why can't reference counting alone collect all garbage?",
          back: `Reference counting fails for **reference cycles** — e.g., object A holds a reference to B, and B holds a reference back to A. When both are deleted by the program, each object still has a count of 1 (from the cycle), so neither is freed. CPython's cyclic GC detects and breaks such cycles.`
        },
        {
          front: "What are CPython's three GC generations?",
          back: `Generation 0: newly allocated objects (collected most often). Generation 1: survived one gen-0 collection. Generation 2: long-lived objects (collected rarely). The threshold triggers a generation N collection after N-1 objects survive long enough — older generations are assumed more likely to survive, so collecting them less often saves work.`
        },
        {
          front: "What is a weakref and why is it useful?",
          back: `A \`weakref.ref\` points to an object **without incrementing its reference count**. If all strong references to the object are gone, the object is freed and the weakref returns \`None\`. Useful in caches and observer/event patterns to avoid keeping objects alive unintentionally.`
        }
      ],
      quiz: [
        {
          question: "When is a Python object freed under reference counting?",
          options: [
            "When the GC runs its next collection cycle",
            "When the program exits",
            "Immediately when its reference count drops to zero",
            "When gc.collect() is called manually"
          ],
          answer: 2,
          explanation: `Reference counting is **immediate** — the moment the last reference is removed and \`ob_refcnt\` reaches zero, CPython deallocates the object right then, without waiting for a GC cycle.`
        },
        {
          question: "What kind of objects does the cyclic GC track?",
          options: [
            "All Python objects",
            "Only objects allocated with malloc",
            "Container objects (lists, dicts, sets, class instances) that can hold references",
            "Only objects larger than 512 bytes"
          ],
          answer: 2,
          explanation: `The cyclic GC only needs to track **container objects** — those that can hold references to other objects, such as lists, dicts, sets, tuples, and class instances. Simple immutable objects like integers and strings cannot form cycles and are not tracked.`
        },
        {
          question: "Which of the following is a risk when relying on __del__ for cleanup?",
          options: [
            "__del__ is called too early, before all references are dropped",
            "__del__ may never be called if the object is part of a reference cycle",
            "__del__ cannot access the object's attributes",
            "__del__ raises AttributeError on frozen dataclasses"
          ],
          answer: 1,
          explanation: `In CPython, \`__del__\` on objects in reference cycles may never be called (or may be called unpredictably). The cyclic GC previously could not collect objects with \`__del__\` (fixed in Python 3.4+, but behavior is still unreliable). Use context managers or \`try/finally\` for deterministic cleanup.`
        },
        {
          question: "What does gc.disable() do?",
          options: [
            "Disables all memory management including reference counting",
            "Disables only the cyclic garbage collector",
            "Prevents new objects from being allocated",
            "Freezes all objects in place"
          ],
          answer: 1,
          explanation: `\`gc.disable()\` turns off the **cyclic GC** only. Reference counting continues working normally. If your code avoids creating reference cycles, disabling the cyclic GC can slightly improve throughput (it reduces pause time from GC runs).`
        }
      ]
    },
    {
      id: "multiprocessing",
      title: "multiprocessing",
      body: `## multiprocessing — Bypassing the GIL

The \`multiprocessing\` module spawns **separate OS processes**, each with its own Python interpreter and GIL. This is the standard way to achieve CPU parallelism in Python.

### Basic usage with Pool
~~~python
from multiprocessing import Pool
import os

def cpu_work(n):
    # Each worker runs in its own process
    result = sum(i * i for i in range(n))
    return result, os.getpid()

if __name__ == "__main__":   # required on Windows/macOS with spawn
    with Pool(processes=4) as pool:
        results = pool.map(cpu_work, [10_000_000] * 4)
    for res, pid in results:
        print(f"pid={pid}, result={res}")
~~~

### IPC and pickling cost
Sending data between processes requires **serialization (pickling)**. Large objects are expensive to transfer.

~~~python
from multiprocessing import Pool
import pickle, sys

data = list(range(1_000_000))
print(f"pickle size: {sys.getsizeof(pickle.dumps(data))} bytes")

def process_chunk(chunk):
    return sum(chunk)

if __name__ == "__main__":
    chunk_size = len(data) // 4
    chunks = [data[i:i+chunk_size] for i in range(0, len(data), chunk_size)]
    with Pool(4) as pool:
        partial_sums = pool.map(process_chunk, chunks)
    print(sum(partial_sums))
~~~

### spawn vs fork
| Start method | Behavior | Default |
|---|---|---|
| \`fork\` | Copy parent process memory | Linux (default) |
| \`spawn\` | Start fresh Python interpreter | macOS (3.8+), Windows |
| \`forkserver\` | Dedicated server forks workers | Linux optional |

\`fork\` is fast but unsafe with threads (locks may be held at fork time). \`spawn\` is slower but safe.

~~~python
import multiprocessing as mp

mp.set_start_method("spawn")   # set once at program start
~~~

### Shared memory — avoiding pickling overhead
~~~python
from multiprocessing import shared_memory, Pool
import numpy as np

if __name__ == "__main__":
    arr = np.arange(1_000_000, dtype=np.float64)
    shm = shared_memory.SharedMemory(create=True, size=arr.nbytes)
    shared_arr = np.ndarray(arr.shape, dtype=arr.dtype, buffer=shm.buf)
    shared_arr[:] = arr[:]

    # Workers access shm by name — no pickling of the array
    def process_slice(args):
        name, shape, dtype, start, end = args
        existing = shared_memory.SharedMemory(name=name)
        a = np.ndarray(shape, dtype=dtype, buffer=existing.buf)
        result = float(a[start:end].sum())
        existing.close()
        return result

    n = 4
    step = len(arr) // n
    tasks = [(shm.name, arr.shape, arr.dtype, i*step, (i+1)*step) for i in range(n)]
    with Pool(n) as pool:
        results = pool.map(process_slice, tasks)
    print(sum(results))
    shm.close()
    shm.unlink()
~~~

### When to use multiprocessing vs threading vs asyncio
| Workload | Best tool |
|---|---|
| CPU-bound (numpy, compression) | \`multiprocessing\` |
| IO-bound, many connections | \`asyncio\` or \`threading\` |
| IO-bound, simple | \`threading\` |
| Mixed CPU+IO | \`ProcessPoolExecutor\` + \`asyncio\` |
`,
      flashcards: [
        {
          front: "How does multiprocessing bypass the GIL?",
          back: `Each \`multiprocessing\` process is a **separate OS process** with its own CPython interpreter and its own GIL. Multiple processes run truly in parallel on separate CPU cores. The GIL only prevents parallel bytecode execution within a single process.`
        },
        {
          front: "Why is IPC (inter-process communication) expensive in multiprocessing?",
          back: `Processes have separate memory spaces — data cannot be shared directly. Sending objects between processes requires **pickling** (serializing to bytes) on one side and **unpickling** on the other. Large objects (big lists, DataFrames) create significant overhead. Solutions: shared memory, memory-mapped files, or designing workers to minimize data transfer.`
        },
        {
          front: "What is the difference between fork and spawn start methods?",
          back: `**fork**: copies the parent process's entire memory space instantly (fast). Risk: if the parent has live threads with held locks, the child inherits locked mutexes, causing deadlocks. Default on Linux.

**spawn**: starts a fresh Python interpreter and re-imports the module (slow, safe). Default on macOS (3.8+) and Windows.

Always guard entry point code with \`if __name__ == "__main__":\` when using spawn.`
        }
      ],
      quiz: [
        {
          question: "Why must the entry point of a multiprocessing script be guarded by `if __name__ == '__main__':`?",
          options: [
            "It is only a convention with no technical reason",
            "To prevent worker processes from recursively spawning more workers when they import the module",
            "To enable the GIL bypass",
            "To allow pickling of the Pool object"
          ],
          answer: 1,
          explanation: `With the \`spawn\` start method (macOS/Windows), each worker process imports the main module. Without the guard, the import would re-execute the \`Pool()\` call, spawning more workers infinitely. The guard ensures only the original process creates the pool.`
        },
        {
          question: "Which of the following is the best approach to avoid IPC overhead when sharing a large NumPy array?",
          options: [
            "Pickle the array and send it via a Queue",
            "Use multiprocessing.shared_memory to share the array's buffer directly",
            "Pass the array as a function argument to pool.map",
            "Store the array in a global variable"
          ],
          answer: 1,
          explanation: `\`multiprocessing.shared_memory\` (Python 3.8+) allocates memory that **multiple processes can map into their address space**. Workers access the array without any serialization, reducing IPC cost to near zero for read-heavy workloads.`
        },
        {
          question: "For a web scraper that fetches 500 URLs, which is the most appropriate concurrency tool?",
          options: [
            "multiprocessing.Pool — to bypass the GIL",
            "asyncio with aiohttp — event-loop driven IO concurrency",
            "threading with 500 threads",
            "concurrent.futures.ProcessPoolExecutor"
          ],
          answer: 1,
          explanation: `Web scraping is **IO-bound** — each request spends most of its time waiting for a network response. \`asyncio\` with an async HTTP library like \`aiohttp\` handles hundreds of concurrent connections efficiently on a single thread. \`multiprocessing\` adds process-spawn overhead with no benefit for IO-bound work.`
        },
        {
          question: "What is a key risk of using the `fork` start method in a multi-threaded parent process?",
          options: [
            "forked processes cannot use NumPy",
            "The child inherits locked mutexes from the parent, potentially causing deadlocks",
            "fork is not available on Python 3.8+",
            "forked processes share the parent GIL"
          ],
          answer: 1,
          explanation: `\`fork\` copies the parent's entire memory, including any **mutexes held by threads** at the moment of fork. The child process has no threads to release those locks, so any code path that tries to acquire them will **deadlock** indefinitely.`
        }
      ]
    }
  ]
}
