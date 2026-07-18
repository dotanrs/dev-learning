export default {
  id: "cpp",
  title: "C++ for Python Developers",
  subchapters: [
    {
      id: "compilation",
      title: "Compilation & the Build Model",
      body: `## Compilation & the Build Model

The biggest mental shift coming from Python: **C++ is compiled ahead of time**, not interpreted line-by-line. Your source is translated to machine code *before* it runs, and errors that Python would only discover at runtime (a typo'd variable name, a wrong argument count, a type mismatch) are caught by the compiler.

### Python vs C++ execution
| | Python | C++ |
|---|---|---|
| When code is checked | at runtime, per line | at compile time, whole program |
| What you ship | \`.py\` source | a native executable |
| Typo in a variable name | \`NameError\` when that line runs | compile error, program never builds |
| Startup | import + interpret | already machine code — instant |

### A minimal program
Every C++ program has exactly one \`main()\` — the entry point. There is no "run the file top to bottom" like a Python script.

~~~cpp
#include <iostream>   // like "import"; pulls in declarations

int main() {          // the entry point
    std::cout << "Hello, world!\\n";
    return 0;         // 0 = success (like sys.exit(0))
}
~~~

### The compile → link pipeline
1. **Preprocessor** — expands \`#include\` and macros (textual paste).
2. **Compiler** — turns each \`.cpp\` into an object file (\`.o\`), checking types and syntax.
3. **Linker** — stitches object files + libraries into one executable, resolving symbols.

~~~bash
g++ -std=c++20 -Wall -Wextra main.cpp -o app   # compile + link
./app                                          # run
~~~

### Headers vs source — declaration vs definition
Python has no header files. In C++ you typically **declare** an interface in a \`.h\` header and **define** the implementation in a \`.cpp\`. Other files \`#include\` the header to learn "what exists" without seeing the body.

~~~cpp
// math_utils.h  — the "what"
int add(int a, int b);        // declaration only

// math_utils.cpp — the "how"
#include "math_utils.h"
int add(int a, int b) { return a + b; }   // definition
~~~

> **Gotcha:** \`#include\` is a literal copy-paste. Include the same header twice and you can get "redefinition" errors — which is why headers use include guards (\`#pragma once\`).

### Best practices
- Always compile with warnings on (\`-Wall -Wextra\`) and treat them seriously.
- Use \`#pragma once\` at the top of every header.
- Pick a modern standard (\`-std=c++20\`); the language has changed a lot.

### Exercise
Write a program that defines a function \`int square(int n)\` (declaration + definition) and prints the squares of 1 through 5, one per line, from \`main()\`. Compile it with \`-std=c++20 -Wall\`.
`,
      flashcards: [
        {
          front: "What are the three stages that turn C++ source into a running program?",
          back: `1. **Preprocessor** — expands \`#include\` directives and macros (pure text substitution).
2. **Compiler** — translates each \`.cpp\` translation unit into an object file, type-checking as it goes.
3. **Linker** — combines object files and libraries into one executable, resolving cross-file symbol references.`
        },
        {
          front: "Why does C++ separate headers (.h) from source (.cpp), and what goes in each?",
          back: `Headers hold **declarations** (the interface — "what exists": function signatures, class definitions). Source files hold **definitions** (the implementation — "how it works"). Other files \`#include\` only the header, so they can compile against the interface without seeing the bodies. This enables separate compilation and faster rebuilds. Python has no equivalent — a module is both interface and implementation.`
        },
        {
          front: "Solution: print squares of 1..5 using a declared/defined square function.",
          back: `~~~cpp
#include <iostream>

int square(int n);              // declaration

int main() {
    for (int i = 1; i <= 5; ++i) {
        std::cout << square(i) << "\\n";
    }
    return 0;
}

int square(int n) {             // definition
    return n * n;
}
~~~
Compile: \`g++ -std=c++20 -Wall sq.cpp -o sq && ./sq\`. Note the declaration before \`main\` so the compiler knows \`square\` exists before it's used.`
        }
      ],
      quiz: [
        {
          question: "In Python, referencing an undefined variable name raises NameError at runtime. What happens in C++?",
          options: [
            "The program runs and returns garbage",
            "It is a compile error — the program never builds",
            "It raises a runtime exception like Python",
            "The linker silently ignores it"
          ],
          answer: 1,
          explanation: `C++ resolves names at compile time. Using an undeclared identifier is a compile error, so the executable is never produced. This is the core benefit of ahead-of-time compilation: whole classes of errors are caught before the program ever runs.`
        },
        {
          question: "What does the linker do that the compiler does not?",
          options: [
            "It checks syntax and types within a single file",
            "It expands #include directives",
            "It resolves symbols across object files and libraries into one executable",
            "It interprets the bytecode"
          ],
          answer: 2,
          explanation: `The compiler processes one translation unit at a time and emits object files with unresolved references to symbols defined elsewhere. The linker's job is to connect those references — matching a call to \`add()\` in one file with its definition in another — and produce the final binary.`
        },
        {
          question: "Why do C++ headers commonly start with #pragma once?",
          options: [
            "To speed up runtime execution",
            "To prevent the header's contents from being included/pasted more than once per translation unit",
            "To mark the file as read-only",
            "To enable multithreading"
          ],
          answer: 1,
          explanation: `\`#include\` is textual substitution. If a header is included twice (directly and transitively), its declarations would appear twice, causing redefinition errors. \`#pragma once\` tells the preprocessor to include the file at most once per translation unit.`
        },
        {
          question: "What is the entry point of a C++ program?",
          options: [
            "The first line of the file, like a Python script",
            "Any function named start()",
            "The main() function",
            "The __init__ function"
          ],
          answer: 2,
          explanation: `Execution begins at \`int main()\` (or \`int main(int argc, char** argv)\`). Unlike a Python script, top-level statements outside a function are not executed in sequence — code only runs when reached from \`main\`.`
        }
      ]
    },
    {
      id: "types-auto",
      title: "Static Typing & auto",
      body: `## Static Typing & auto

Python is **dynamically typed**: a name can hold an \`int\` now and a \`str\` later, and types are checked when operations run. C++ is **statically typed**: every variable has one fixed type known at compile time, and the compiler rejects mismatches.

### Declaring variables
~~~cpp
int count = 42;            // integer, fixed size
double ratio = 3.14;       // 64-bit float
bool ready = true;         // real boolean type
char c = 'A';              // single byte
std::string name = "Ada";  // from <string>

count = "hello";           // COMPILE ERROR — cannot assign string to int
~~~

Compare to Python where \`count = 42\` then \`count = "hello"\` is perfectly legal.

### Fixed-size numeric types — a Python surprise
Python's \`int\` is arbitrary precision; it never overflows. C++ integers have a **fixed size** and **wrap around** (undefined behavior for signed overflow!).

~~~cpp
#include <cstdint>
int32_t x = 2147483647;   // max 32-bit signed int
x = x + 1;                // OVERFLOW — undefined behavior, not a big number
~~~

> **Gotcha:** In Python \`2**100\` just works. In C++ that overflows \`int\`/\`long\` silently. Use a big-integer library if you truly need it.

### auto — let the compiler infer the type
\`auto\` asks the compiler to deduce the type from the initializer. It is *not* dynamic typing — the type is still fixed, you just don't spell it out.

~~~cpp
auto n = 42;               // int
auto pi = 3.14;            // double
auto name = std::string{"Ada"};
auto total = 0L;           // long

// Indispensable for verbose iterator types:
std::map<std::string, int> ages{{"Ada", 36}};
for (auto it = ages.begin(); it != ages.end(); ++it) { /* ... */ }
~~~

### Best practices
- Use \`auto\` when the type is obvious from the right-hand side or painfully long (iterators, lambdas).
- Prefer fixed-width types (\`int32_t\`, \`int64_t\`, \`size_t\`) when size matters.
- Enable \`-Wconversion\` to catch silent narrowing (e.g. \`double\` → \`int\`).
- \`const\` everything that shouldn't change: \`const int max = 100;\`.

### Gotcha: integer division
Like Python 2 (not Python 3), \`/\` between two ints truncates.

~~~cpp
int a = 7 / 2;        // 3, not 3.5
double b = 7 / 2;     // still 3.0 — division happened as ints first!
double c = 7.0 / 2;   // 3.5 — one operand is a double
~~~

### Exercise
Declare a \`double\` \`celsius = 100.0\`, convert it to Fahrenheit (\`F = C * 9/5 + 32\`), and print the result. Use \`auto\` for the result variable. Make sure the \`9/5\` does not truncate to 1.
`,
      flashcards: [
        {
          front: "Does auto make C++ dynamically typed like Python?",
          back: `**No.** \`auto\` performs *compile-time type inference* — the compiler deduces one fixed type from the initializer and locks it in. \`auto x = 42;\` makes \`x\` an \`int\` forever; you cannot later assign a string to it. Python's dynamic typing lets a name rebind to any type at runtime; \`auto\` never does that.`
        },
        {
          front: "Why can 7 / 2 give 3 in C++ but 3.5 in Python 3?",
          back: `In C++, \`/\` on two integer operands performs **integer division** (truncates toward zero), so \`7 / 2 == 3\`. Python 3's \`/\` is always true division (\`3.5\`); its \`//\` is the floor-division equivalent. To get \`3.5\` in C++, at least one operand must be floating point: \`7.0 / 2\`.`
        },
        {
          front: "What is the danger of C++ fixed-size integers versus Python ints?",
          back: `Python \`int\` is arbitrary precision and never overflows. C++ integers are fixed-width (e.g. 32 or 64 bits) and **overflow**: exceeding the max wraps around, and for *signed* types this is **undefined behavior**. Code like \`2**100\` is trivial in Python but overflows silently in C++.`
        },
        {
          front: "Solution: Celsius→Fahrenheit without integer-division truncation.",
          back: `~~~cpp
#include <iostream>

int main() {
    double celsius = 100.0;
    auto fahrenheit = celsius * 9.0 / 5.0 + 32;  // 9.0/5.0 keeps it floating
    std::cout << fahrenheit << "\\n";             // 212
    return 0;
}
~~~
Key point: writing \`9 / 5\` would compute \`1\` (integer division) *before* multiplying. Because \`celsius\` is a \`double\`, \`celsius * 9\` is already floating point, but writing the literals as \`9.0 / 5.0\` makes the intent unmistakable. \`fahrenheit\` is deduced as \`double\`.`
        }
      ],
      quiz: [
        {
          question: "What type does `auto x = 3.14;` deduce?",
          options: ["int", "float", "double", "auto is not a real type, it errors"],
          answer: 2,
          explanation: `A floating-point literal like \`3.14\` is a \`double\` by default in C++ (not \`float\`). \`auto\` deduces the type of the initializer, so \`x\` is a \`double\`. To get a \`float\` you'd write \`3.14f\`.`
        },
        {
          question: "In C++, what is the value of `double b = 7 / 2;`?",
          options: ["3.5", "3.0", "4.0", "Compile error"],
          answer: 1,
          explanation: `The right-hand side \`7 / 2\` is evaluated first as integer division, giving \`3\`. Only then is that \`3\` converted to \`double\` and stored, yielding \`3.0\`. The type of the destination does not change how the expression is computed.`
        },
        {
          question: "Which statement about static typing in C++ is correct?",
          options: [
            "A variable's type is checked only when its line executes",
            "A variable's type is fixed at compile time and mismatches are compile errors",
            "Variables can hold any type at any time, like Python",
            "Types only matter for function arguments"
          ],
          answer: 1,
          explanation: `C++ is statically typed: each variable has a single type determined at compile time. Assigning an incompatible type is a compile error, caught before the program runs — unlike Python, where type errors surface only when the offending operation executes.`
        },
        {
          question: "What happens when a signed 32-bit int at its maximum value is incremented?",
          options: [
            "It automatically promotes to a 64-bit int",
            "It raises an OverflowError",
            "Signed overflow — undefined behavior",
            "It saturates at the maximum value"
          ],
          answer: 2,
          explanation: `Signed integer overflow is **undefined behavior** in C++ — the compiler may assume it never happens and optimize accordingly, producing surprising results. This is unlike Python, where integers grow without bound. Use unsigned types (which wrap defined) or wider types deliberately.`
        }
      ]
    },
    {
      id: "references-pointers",
      title: "Values, References & Pointers",
      body: `## Values, References & Pointers

This is where Python intuition breaks hardest. In Python **every variable is a reference** to an object; assignment never copies. In C++ variables hold **values** by default, and assignment **copies**.

### Value semantics — the default
~~~cpp
#include <vector>
std::vector<int> a = {1, 2, 3};
std::vector<int> b = a;   // FULL COPY — b is independent
b.push_back(4);
// a is still {1, 2, 3}; b is {1, 2, 3, 4}
~~~

Compare to Python, where \`b = a\` makes both names point to the *same* list:
~~~python
a = [1, 2, 3]
b = a          # same object
b.append(4)
# a is now [1, 2, 3, 4] too!
~~~

### References — an alias for an existing variable
A reference (\`&\`) is another name for the same object. It must be bound at creation and can never be reseated. This is the closest thing to Python's "same object" behavior.

~~~cpp
int x = 10;
int& ref = x;    // ref is an alias for x
ref = 20;        // changes x
// x == 20 now
~~~

The main use is **passing to functions without copying**:
~~~cpp
void grow(std::vector<int>& v) {   // by reference — no copy
    v.push_back(99);               // modifies caller's vector
}

void inspect(const std::vector<int>& v) {  // const ref — no copy, read-only
    // v.push_back(1);  // won't compile — v is const
}
~~~

> **Best practice:** Pass large objects by \`const&\` to avoid copies while promising not to modify them. Pass by \`&\` (non-const) only when you intend to mutate the caller's object.

### Pointers — a variable holding an address
A pointer stores the *address* of an object. Unlike a reference it can be null, can be reseated, and needs \`*\` to dereference.

~~~cpp
int x = 10;
int* p = &x;     // p holds the address of x
std::cout << *p; // 10 — dereference to read the value
*p = 20;         // x is now 20
p = nullptr;     // reseat to "points to nothing"
~~~

### Reference vs pointer
| | Reference \`&\` | Pointer \`*\` |
|---|---|---|
| Can be null | no | yes (\`nullptr\`) |
| Can be reseated | no | yes |
| Syntax to use | like the variable | \`*p\` to deref, \`->\` for members |
| Best for | function params, aliases | optional/owning, dynamic structures |

> **Gotcha:** Dereferencing a null or dangling pointer is undefined behavior (often a crash). There is no \`None\`-safety net like Python.

### Exercise
Write a function \`void swap_ints(int& a, int& b)\` that swaps two integers **through references** (no return value). Call it from \`main\` on two variables and print them before and after to prove the caller's variables changed.
`,
      flashcards: [
        {
          front: "In Python `b = a` for a list shares the object; what does the equivalent do in C++?",
          back: `In C++, \`std::vector<int> b = a;\` performs a **full copy** — \`b\` is an independent object with its own elements. Mutating \`b\` does not affect \`a\`. C++ has **value semantics** by default; assignment copies. To get Python-like shared behavior you'd use a reference (\`auto& b = a;\`) or a pointer/smart pointer.`
        },
        {
          front: "What are the key differences between a C++ reference and a pointer?",
          back: `A **reference** (\`int&\`) is an alias: it must bind to an object at creation, can never be null, and can never be reseated to another object; you use it exactly like the original variable. A **pointer** (\`int*\`) holds an address: it can be \`nullptr\`, can be reseated, and needs \`*\` to dereference (or \`->\` for members). Prefer references for parameters; pointers for optional or reseatable/owning links.`
        },
        {
          front: "When should you pass a function argument by const reference in C++?",
          back: `Pass by \`const&\` when the object is **large** (vectors, strings, custom classes) and the function only needs to **read** it. This avoids an expensive copy while guaranteeing the function won't modify the caller's object. Use a plain \`&\` (non-const) only when you intend to mutate the caller's argument; pass small types (\`int\`, \`double\`) by value.`
        },
        {
          front: "Solution: swap two ints through references.",
          back: `~~~cpp
#include <iostream>

void swap_ints(int& a, int& b) {
    int tmp = a;
    a = b;
    b = tmp;
}

int main() {
    int x = 1, y = 2;
    std::cout << x << " " << y << "\\n";  // 1 2
    swap_ints(x, y);
    std::cout << x << " " << y << "\\n";  // 2 1
    return 0;
}
~~~
Because the parameters are references, \`a\` and \`b\` are aliases for the caller's \`x\` and \`y\`, so the swap is visible outside the function. (The standard library also has \`std::swap\`.)`
        }
      ],
      quiz: [
        {
          question: "After `std::vector<int> a = {1,2,3}; auto b = a; b.push_back(4);`, what is a?",
          options: ["{1, 2, 3, 4}", "{1, 2, 3}", "{4}", "Undefined behavior"],
          answer: 1,
          explanation: `\`auto b = a;\` copies the vector, so \`b\` is independent. Pushing onto \`b\` leaves \`a\` as \`{1, 2, 3}\`. This is the opposite of Python, where \`b = a\` would alias the same list and \`a\` would also see the appended element.`
        },
        {
          question: "Which of these can a reference do that distinguishes it from a pointer?",
          options: [
            "Be reseated to refer to a different object",
            "Hold a null value",
            "None of these — a reference cannot be null and cannot be reseated",
            "Point to itself"
          ],
          answer: 2,
          explanation: `A reference must be bound at initialization and stays bound to that object for its lifetime — it cannot be null and cannot be reseated. Those capabilities (null, reseating) belong to pointers. That constraint is exactly what makes references safer for parameters.`
        },
        {
          question: "Why pass a large std::string to a read-only function as `const std::string&`?",
          options: [
            "It is required syntax for strings",
            "To avoid copying the whole string while preventing modification",
            "References are faster to declare",
            "So the function can resize the string"
          ],
          answer: 1,
          explanation: `Passing by value would copy every character. A \`const&\` binds directly to the caller's string with no copy, and the \`const\` guarantees the function cannot modify it — giving you both efficiency and safety.`
        },
        {
          question: "What does the * operator do in the expression `*p` where p is an int*?",
          options: [
            "Multiplies p by itself",
            "Takes the address of p",
            "Dereferences p — accesses the int it points to",
            "Declares a new pointer"
          ],
          answer: 2,
          explanation: `In an expression, \`*p\` **dereferences** the pointer, yielding the object it points at (which you can read or assign to). The \`&\` operator does the opposite — \`&x\` produces the address of \`x\`. (In a declaration, \`int* p\` the \`*\` instead means "pointer type".)`
        }
      ]
    },
    {
      id: "memory-raii",
      title: "Memory, RAII & Smart Pointers",
      body: `## Memory, RAII & Smart Pointers

Python manages memory for you (reference counting + a cyclic GC). C++ has **no garbage collector**: you are responsible for the lifetime of anything you allocate on the heap. Modern C++ makes this safe with **RAII** and **smart pointers** — you rarely write raw \`new\`/\`delete\`.

### Stack vs heap
~~~cpp
void f() {
    int x = 5;                 // stack — freed automatically when f returns
    std::vector<int> v(1000);  // v's control lives on the stack; its buffer
                               // is on the heap, but v frees it automatically
}   // everything cleaned up here
~~~

Local (stack) objects are destroyed automatically at the end of their scope. This is the foundation of RAII.

### RAII — Resource Acquisition Is Initialization
The idea: tie a resource's lifetime to an object's lifetime. The **destructor** frees the resource, and destructors run automatically when the object goes out of scope — even if an exception is thrown. This is C++'s answer to Python's \`with\` / context managers, but built into *every* object.

~~~cpp
{
    std::ofstream file("out.txt");  // opens the file (acquire)
    file << "data";
}   // file's destructor runs here — closes the file automatically
~~~

Compare Python:
~~~python
with open("out.txt", "w") as f:   # explicit context manager needed
    f.write("data")
# closed here
~~~

In C++ the "with" behavior is the default for well-designed types — no special syntax.

### Raw new/delete — avoid in modern code
~~~cpp
int* p = new int(42);   // heap allocation
// ... if you forget the next line, you leak memory:
delete p;               // manual free — easy to forget or double-free
~~~

> **Gotcha:** Every \`new\` needs exactly one \`delete\`. Forgetting leaks; deleting twice is undefined behavior; deleting then using is a use-after-free. Manual management is the #1 source of C++ bugs.

### Smart pointers — the modern default
Smart pointers own heap memory and free it automatically. Include \`<memory>\`.

**\`unique_ptr\`** — sole ownership, zero overhead. Cannot be copied, only moved.
~~~cpp
#include <memory>
auto p = std::make_unique<int>(42);   // owns an int
std::cout << *p;                       // 42
// freed automatically when p goes out of scope — no delete needed
~~~

**\`shared_ptr\`** — shared ownership via reference counting (like Python objects!). Freed when the last owner goes away.
~~~cpp
auto a = std::make_shared<int>(42);
auto b = a;              // both own it; refcount == 2
// freed when both a and b are gone
~~~

> **Gotcha (same as Python!):** \`shared_ptr\` cycles leak, because reference counting can't reclaim a cycle. Break cycles with \`std::weak_ptr\` — exactly analogous to Python's \`weakref\`.

### Rule of thumb
| Need | Use |
|---|---|
| A local object | plain value on the stack |
| Sole heap ownership | \`std::unique_ptr\` |
| Shared heap ownership | \`std::shared_ptr\` |
| Non-owning observer | raw pointer or \`weak_ptr\` |
| Almost never | raw \`new\`/\`delete\` |

### Exercise
Write a class \`Timer\` whose **constructor** prints \`"start"\` and whose **destructor** prints \`"stop"\`. In \`main\`, create one inside a nested \`{ }\` block and confirm (by the output order) that \`"stop"\` prints when the block ends, not when \`main\` ends. This demonstrates RAII.
`,
      flashcards: [
        {
          front: "What is RAII and what Python feature is it most like?",
          back: `**RAII** (Resource Acquisition Is Initialization) ties a resource's lifetime to an object's lifetime: the constructor acquires the resource, the **destructor** releases it, and destructors run automatically at end of scope (even on exceptions). It's like Python's \`with\`/context managers — but instead of needing a special \`with\` block, *every* well-designed C++ object cleans up automatically when it goes out of scope.`
        },
        {
          front: "unique_ptr vs shared_ptr — when do you use each?",
          back: `**\`std::unique_ptr\`**: sole ownership, cannot be copied (only moved), zero runtime overhead. The default choice for heap objects with one owner. **\`std::shared_ptr\`**: shared ownership via reference counting; the object is freed when the last \`shared_ptr\` is destroyed (like Python's object model). Use it only when ownership is genuinely shared, since the refcount has a small cost and cycles can leak.`
        },
        {
          front: "How do shared_ptr reference cycles relate to Python's GC?",
          back: `\`shared_ptr\` uses reference counting, which — exactly like CPython's refcounting — **cannot reclaim a cycle** (A owns B, B owns A → each count stays ≥ 1). Python has a cyclic garbage collector as a backstop; C++ has **no GC**, so a \`shared_ptr\` cycle leaks permanently. Break it with \`std::weak_ptr\`, the direct analogue of Python's \`weakref\`.`
        },
        {
          front: "Solution: Timer class demonstrating RAII with scope.",
          back: `~~~cpp
#include <iostream>

class Timer {
public:
    Timer()  { std::cout << "start\\n"; }   // constructor
    ~Timer() { std::cout << "stop\\n"; }    // destructor
};

int main() {
    std::cout << "before block\\n";
    {
        Timer t;                    // "start" prints here
    }                               // "stop" prints here (scope ends)
    std::cout << "after block\\n";
    return 0;
}
// Output:
// before block
// start
// stop
// after block
~~~
\`"stop"\` prints at the closing brace of the inner block because \`t\`'s destructor runs when \`t\` leaves scope — the essence of RAII.`
        }
      ],
      quiz: [
        {
          question: "Does C++ have a garbage collector like Python?",
          options: [
            "Yes, identical to CPython's",
            "No — object lifetimes are managed by scope, destructors, and smart pointers",
            "Yes, but only for heap objects",
            "Only when you enable it with a compiler flag"
          ],
          answer: 1,
          explanation: `Standard C++ has no garbage collector. Stack objects are freed at end of scope; heap objects are managed manually with \`new\`/\`delete\` or, in modern code, automatically by smart pointers (\`unique_ptr\`, \`shared_ptr\`). RAII ties cleanup to object lifetime.`
        },
        {
          question: "When is the destructor of a local (stack) object called?",
          options: [
            "When the garbage collector runs",
            "When you explicitly call delete",
            "Automatically when the object goes out of scope",
            "Only at program exit"
          ],
          answer: 2,
          explanation: `A local object's destructor runs automatically at the end of its enclosing scope (the closing \`}\`), including when an exception unwinds the stack. This deterministic cleanup is what makes RAII reliable.`
        },
        {
          question: "What is the main advantage of std::unique_ptr over a raw pointer with new/delete?",
          options: [
            "It is faster at runtime than a raw pointer",
            "It automatically deletes the owned object when it goes out of scope, preventing leaks",
            "It allows multiple owners of the same object",
            "It can hold multiple objects at once"
          ],
          answer: 1,
          explanation: `\`unique_ptr\` frees its object automatically in its destructor, so you cannot forget to \`delete\` and cannot double-delete. It has the same runtime cost as a raw pointer (zero overhead) but enforces single ownership at compile time. For multiple owners you'd use \`shared_ptr\`.`
        },
        {
          question: "Why can a cycle of shared_ptrs cause a memory leak?",
          options: [
            "shared_ptr is not thread-safe",
            "Reference counting can never reach zero when two objects reference each other",
            "shared_ptr does not call destructors",
            "The compiler forbids cycles"
          ],
          answer: 1,
          explanation: `\`shared_ptr\` frees an object when its reference count hits zero. In a cycle, each object keeps the other's count at ≥ 1, so neither ever reaches zero — the same limitation as CPython's reference counting. Since C++ has no cyclic GC, this leaks; use \`weak_ptr\` to break the cycle.`
        }
      ]
    },
    {
      id: "stl-containers",
      title: "STL Containers & Algorithms",
      body: `## STL Containers & Algorithms

The Standard Template Library gives you the C++ equivalents of Python's built-in collections — but strongly typed and with explicit performance guarantees.

### Container cheat sheet (Python → C++)
| Python | C++ | Notes |
|---|---|---|
| \`list\` | \`std::vector<T>\` | dynamic array; fast random access & append |
| \`dict\` | \`std::unordered_map<K,V>\` | hash map, average O(1) |
| \`dict\` (sorted) | \`std::map<K,V>\` | balanced tree, O(log n), keys sorted |
| \`set\` | \`std::unordered_set<T>\` | hash set |
| \`tuple\` | \`std::tuple<...>\` / \`std::pair\` | fixed heterogeneous |
| \`collections.deque\` | \`std::deque<T>\` | double-ended queue |
| \`str\` | \`std::string\` | mutable, unlike Python's immutable str |

### vector — your default list
~~~cpp
#include <vector>
std::vector<int> v = {1, 2, 3};
v.push_back(4);          // like append
v[0] = 10;               // index access (no bounds check!)
v.at(0) = 10;            // bounds-checked (throws std::out_of_range)
std::cout << v.size();   // 4

for (int x : v) {        // range-based for — like "for x in v"
    std::cout << x << " ";
}
~~~

> **Gotcha:** \`v[i]\` does **no bounds checking** — an out-of-range index is undefined behavior, not an \`IndexError\`. Use \`.at(i)\` when you want a thrown exception, and note there are no negative indices (\`v[-1]\` is undefined behavior, not "last element").

### unordered_map — your default dict
~~~cpp
#include <unordered_map>
std::unordered_map<std::string, int> ages;
ages["Ada"] = 36;
ages["Alan"] = 41;

// Gotcha: operator[] INSERTS a default (0) if the key is missing!
int x = ages["ghost"];   // inserts "ghost" -> 0, returns 0

// Safe lookup without inserting:
if (auto it = ages.find("Ada"); it != ages.end()) {
    std::cout << it->second;   // 36
}
if (ages.contains("Alan")) { /* C++20 */ }
~~~

> **Gotcha vs Python:** \`dict[missing]\` raises \`KeyError\`; C++ \`map[missing]\` silently **creates** the entry with a value-initialized value. Use \`.find()\` or \`.contains()\` to check membership.

### Iterators and algorithms
The STL separates containers from algorithms via **iterators** (generalized pointers). \`<algorithm>\` gives you reusable operations.

~~~cpp
#include <algorithm>
#include <vector>
std::vector<int> v = {5, 2, 8, 1};

std::sort(v.begin(), v.end());                 // ascending: {1,2,5,8}
auto it = std::find(v.begin(), v.end(), 8);    // like "8 in v" / index
int total = std::accumulate(v.begin(), v.end(), 0);  // <numeric>, like sum()

// Sort descending with a lambda (like Python's key=/reverse):
std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });
~~~

Lambdas (\`[](int a, int b){ ... }\`) are C++'s anonymous functions, similar to Python \`lambda a, b: ...\` but with an explicit **capture list** \`[]\` for closing over variables.

### Best practices
- Default to \`std::vector\` unless you have a reason not to; it's cache-friendly and fast.
- Prefer range-based \`for (auto& x : container)\` for iteration; add \`&\` to avoid copies.
- Reserve capacity (\`v.reserve(n)\`) when you know the size to avoid reallocations.
- Use \`.find()\`/\`.contains()\`, not \`operator[]\`, to test map membership.

### Exercise
Given \`std::vector<int> nums = {4, 1, 7, 3, 9, 2}\`, use \`std::sort\` and a lambda to sort it in **descending** order, then print the elements separated by spaces using a range-based \`for\`.
`,
      flashcards: [
        {
          front: "What is the C++ equivalent of Python's list and dict, and one key difference each?",
          back: `**\`std::vector<T>\`** ≈ \`list\`: a dynamic array, but strongly typed (all elements one type) and \`v[i]\` does **no** bounds checking. **\`std::unordered_map<K,V>\`** ≈ \`dict\`: a hash map, but \`map[missing_key]\` silently **inserts** a default value rather than raising \`KeyError\`. (\`std::map\` is the ordered, O(log n) tree variant.)`
        },
        {
          front: "What's the dangerous difference between C++ map[key] and Python dict[key] for a missing key?",
          back: `Python's \`dict[missing]\` raises \`KeyError\`. C++'s \`map[missing]\` (\`operator[]\`) **default-constructs and inserts** an entry for that key (e.g. \`0\` for an int) and returns it — silently growing the map. To check membership without inserting, use \`.find(key) != end()\` or \`.contains(key)\` (C++20).`
        },
        {
          front: "What is a lambda in C++ and how does its capture list relate to Python closures?",
          back: `A lambda is an anonymous function: \`[capture](params){ body }\`. The **capture list** \`[]\` explicitly lists which surrounding variables the lambda closes over — \`[x]\` copies \`x\`, \`[&x]\` captures by reference, \`[=]\`/\`[&]\` capture everything by copy/reference. Python closures capture enclosing variables implicitly (by reference to the name); C++ makes the choice explicit.`
        },
        {
          front: "Solution: sort a vector descending with a lambda and print it.",
          back: `~~~cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> nums = {4, 1, 7, 3, 9, 2};
    std::sort(nums.begin(), nums.end(),
              [](int a, int b) { return a > b; });   // descending
    for (int x : nums) {
        std::cout << x << " ";
    }
    std::cout << "\\n";   // 9 7 4 3 2 1
    return 0;
}
~~~
The comparator lambda returns \`true\` when \`a\` should come before \`b\`; \`a > b\` therefore orders larger values first. This mirrors Python's \`sorted(nums, reverse=True)\`.`
        }
      ],
      quiz: [
        {
          question: "What happens when you read `ages[\"missing\"]` on a std::unordered_map where \"missing\" is not a key?",
          options: [
            "It throws an exception like Python's KeyError",
            "It returns a null pointer",
            "It inserts \"missing\" with a value-initialized value (e.g. 0) and returns it",
            "It returns the last inserted value"
          ],
          answer: 2,
          explanation: `\`operator[]\` on a map inserts a default-constructed value for a missing key and returns a reference to it. This differs sharply from Python's \`dict\`, which raises \`KeyError\`. Use \`.find()\` or \`.contains()\` to query without mutating the map.`
        },
        {
          question: "What is the difference between v[i] and v.at(i) on a std::vector?",
          options: [
            "They are identical",
            "v[i] is bounds-checked; v.at(i) is not",
            "v.at(i) throws std::out_of_range on a bad index; v[i] is undefined behavior",
            "v.at(i) is faster"
          ],
          answer: 2,
          explanation: `\`v.at(i)\` performs bounds checking and throws \`std::out_of_range\` for an invalid index. \`v[i]\` does **no** checking — an out-of-range access is undefined behavior (possible crash or silent corruption), unlike Python's \`IndexError\`.`
        },
        {
          question: "What do std::sort, std::find, and std::accumulate operate on?",
          options: [
            "Container objects directly",
            "Iterator ranges (begin/end pairs)",
            "Only std::vector",
            "Raw C arrays only"
          ],
          answer: 1,
          explanation: `STL algorithms are decoupled from containers: they operate on **iterator ranges**, typically \`container.begin()\` to \`container.end()\`. This is why the same \`std::sort\` works on vectors, deques, arrays, and any container exposing compatible iterators.`
        },
        {
          question: "Which container should be your default choice for a sequence in C++?",
          options: [
            "std::list (linked list)",
            "std::vector (dynamic array)",
            "std::map",
            "A raw array"
          ],
          answer: 1,
          explanation: `\`std::vector\` is the recommended default: contiguous storage makes it cache-friendly, random access is O(1), and appends are amortized O(1). Reach for other containers only when you have a specific need (e.g. \`std::map\` for sorted keys, \`std::deque\` for fast front insertion).`
        }
      ]
    },
    {
      id: "classes",
      title: "Classes & the Rule of Five",
      body: `## Classes & the Rule of Five

C++ classes look familiar coming from Python, but add **access control**, **initializer lists**, and — crucially — special member functions that govern **copying, moving, and destruction**.

### A basic class
~~~cpp
class Account {
public:                         // accessible from outside
    Account(std::string owner, double balance)
        : owner_(owner), balance_(balance) {}   // member initializer list

    void deposit(double amount) { balance_ += amount; }
    double balance() const { return balance_; }  // const = doesn't modify

private:                        // internal only (no leading-underscore convention needed)
    std::string owner_;
    double balance_;
};

Account a("Ada", 100.0);
a.deposit(50);
std::cout << a.balance();       // 150
~~~

Python parallels and differences:
- \`public:\`/\`private:\` are **enforced** by the compiler — not a naming convention like Python's leading underscore.
- The constructor is named after the class, not \`__init__\`, and \`this\` replaces \`self\` (and is usually implicit).
- The **member initializer list** (\`: owner_(owner)\`) initializes members before the body runs — prefer it over assigning in the body.
- \`const\` after a method means it promises not to modify the object.

### The special member functions
The compiler can auto-generate up to six special members. The ones that manage resources:

| Member | Purpose | Python analogue |
|---|---|---|
| Destructor \`~T()\` | clean up | \`__del__\` (but deterministic) |
| Copy constructor \`T(const T&)\` | make a copy | \`copy.copy\` behavior |
| Copy assignment \`operator=\` | copy into existing | — |
| Move constructor \`T(T&&)\` | steal resources | — (no direct analogue) |
| Move assignment | move into existing | — |

### The Rule of Five (and Rule of Zero)
> **Rule of Five:** If you manually write any one of {destructor, copy ctor, copy assign, move ctor, move assign}, you almost certainly need to consider all five — because it means your class manages a resource (raw memory, file handle) that the defaults won't handle correctly.

> **Rule of Zero (preferred):** Design classes so you don't write *any* of them — hold resources in members that already manage themselves (\`std::vector\`, \`std::string\`, \`std::unique_ptr\`). Then the compiler-generated defaults are correct and you write nothing.

~~~cpp
// Rule of Zero: members clean up after themselves, no special members needed
class Document {
    std::string title_;
    std::vector<std::string> lines_;   // manages its own memory
    // no destructor, no copy/move — defaults just work
};
~~~

### Constructors, destructor demo
~~~cpp
class Widget {
public:
    Widget()                       { std::cout << "ctor\\n"; }
    Widget(const Widget&)          { std::cout << "copy\\n"; }
    ~Widget()                      { std::cout << "dtor\\n"; }
};

void use(Widget w) {}   // pass by value → triggers a copy

Widget x;               // ctor
use(x);                 // copy (into parameter), then dtor (parameter)
                        // dtor (x) at end of scope
~~~

### Best practices
- Prefer the **Rule of Zero**: use standard containers/smart pointers as members and write no special functions.
- Mark single-argument constructors \`explicit\` to prevent surprising implicit conversions.
- Use the **member initializer list**, and initialize members in **declaration order**.
- Mark read-only methods \`const\`.

### Exercise
Write a class \`Counter\` with a private \`int count_\` initialized to 0 via a constructor, a method \`void increment()\`, and a \`const\` method \`int value() const\`. Create one, increment it three times, and print the value (should be 3). Follow the Rule of Zero — no destructor or copy/move needed.
`,
      flashcards: [
        {
          front: "How does C++ access control (public/private) differ from Python's underscore convention?",
          back: `In C++, \`public:\` and \`private:\` are **enforced by the compiler** — accessing a private member from outside the class is a compile error. Python's leading underscore (\`_x\`) is only a *convention*; nothing stops you from accessing it (name-mangled \`__x\` merely obscures, doesn't forbid). C++ access control is a real language mechanism, not etiquette.`
        },
        {
          front: "State the Rule of Five and the Rule of Zero.",
          back: `**Rule of Five:** if you hand-write any one of the destructor, copy constructor, copy assignment, move constructor, or move assignment, you should consider defining (or deleting) all five — because it signals your class manages a resource the compiler-generated defaults can't handle correctly. **Rule of Zero (preferred):** design classes so you write *none* of them, by storing resources in self-managing members (\`std::vector\`, \`std::string\`, \`std::unique_ptr\`), letting the correct defaults be generated.`
        },
        {
          front: "What is a member initializer list and why prefer it over assigning in the constructor body?",
          back: `The list after the constructor signature, e.g. \`Account(...): owner_(owner), balance_(balance) {}\`, **initializes** members directly. Assigning inside the body instead *default-constructs then reassigns* — two steps, and for \`const\` members or reference members or types without a default constructor, body assignment is impossible. Members are always initialized in **declaration order**, regardless of list order.`
        },
        {
          front: "Solution: Counter class following the Rule of Zero.",
          back: `~~~cpp
#include <iostream>

class Counter {
public:
    Counter() : count_(0) {}
    void increment() { ++count_; }
    int value() const { return count_; }   // const: read-only
private:
    int count_;
};

int main() {
    Counter c;
    c.increment();
    c.increment();
    c.increment();
    std::cout << c.value() << "\\n";   // 3
    return 0;
}
~~~
No destructor or copy/move functions are written — the \`int\` member needs no special handling, so the compiler-generated defaults are correct (Rule of Zero).`
        }
      ],
      quiz: [
        {
          question: "In C++, what enforces that a private member cannot be accessed from outside the class?",
          options: [
            "A naming convention (leading underscore)",
            "The compiler — it is a compile error",
            "A runtime check that raises an exception",
            "Nothing; private is only advisory"
          ],
          answer: 1,
          explanation: `C++ access specifiers are enforced at compile time: accessing a \`private\` member from outside the class fails to compile. This contrasts with Python, where \`_name\`/\`__name\` are conventions/name-mangling that don't actually prevent access.`
        },
        {
          question: "What does the Rule of Zero recommend?",
          options: [
            "Always write all five special member functions",
            "Never use classes",
            "Design classes so members manage their own resources, requiring no user-written special functions",
            "Delete the destructor"
          ],
          answer: 2,
          explanation: `The Rule of Zero says: build classes from members that already handle their own resource management (standard containers, smart pointers), so the compiler-generated destructor, copy, and move operations are automatically correct and you write none of them yourself.`
        },
        {
          question: "What does marking a member function `const` (e.g. `int value() const`) guarantee?",
          options: [
            "The return value cannot change",
            "The function cannot modify the object's members",
            "The function runs faster",
            "The function is private"
          ],
          answer: 1,
          explanation: `A trailing \`const\` on a method promises it will not modify the object's (non-mutable) data members. It also allows the method to be called on \`const\` instances. It says nothing about the return value's mutability or performance.`
        },
        {
          question: "Why is a member initializer list preferred over assigning members in the constructor body?",
          options: [
            "It is the only way to name the constructor",
            "It initializes members directly instead of default-constructing then reassigning, and is required for const/reference members",
            "It runs the constructor body twice",
            "It disables copying"
          ],
          answer: 1,
          explanation: `The initializer list constructs each member exactly once with the given value. Assigning in the body first default-constructs the member, then overwrites it — wasteful, and impossible for \`const\` members, reference members, or types lacking a default constructor.`
        }
      ]
    },
    {
      id: "templates",
      title: "Templates & Generic Programming",
      body: `## Templates & Generic Programming

Python is duck-typed: a function works on any object that supports the operations it uses, decided at runtime. C++ achieves generic code with **templates** — the compiler generates a separate, type-checked version of the code for each type you use. It's "compile-time duck typing".

### Function templates
~~~cpp
template <typename T>
T max_of(T a, T b) {
    return (a > b) ? a : b;
}

max_of(3, 7);        // T = int      → compiler generates max_of<int>
max_of(2.5, 1.5);    // T = double   → generates max_of<double>
max_of<std::string>("a", "b");  // explicit
~~~

Python's equivalent needs no annotation at all:
~~~python
def max_of(a, b):
    return a if a > b else b   # works on anything comparable
~~~

The difference: Python resolves \`>\` at runtime and errors then if unsupported. C++ **instantiates** the template per type at compile time and errors *then* if \`>\` isn't defined for that type.

### Class templates
\`std::vector<T>\`, \`std::unordered_map<K,V>\` — these *are* class templates. You can write your own:

~~~cpp
template <typename T>
class Stack {
public:
    void push(const T& x) { data_.push_back(x); }
    T pop() { T top = data_.back(); data_.pop_back(); return top; }
    bool empty() const { return data_.empty(); }
private:
    std::vector<T> data_;
};

Stack<int> s;
s.push(1); s.push(2);
std::cout << s.pop();   // 2
~~~

### How it differs from Python generics
| | Python | C++ templates |
|---|---|---|
| Resolution | runtime (duck typing) | compile time (per-type codegen) |
| One version of code? | yes | one *instantiation per type* |
| Type errors surface | when the operation runs | at compile time |
| Performance | dynamic dispatch overhead | fully specialized, no overhead |

### Gotchas
> **Code bloat & cryptic errors:** Each type instantiation generates separate machine code. And a mistake (using an operation the type doesn't support) can produce famously long, deep error messages — the error points into the template body, not your call site.

> **Definitions go in headers:** Because the compiler needs the full template body to instantiate it for your type, template definitions almost always live in headers, not \`.cpp\` files.

### Constraints (C++20 concepts)
Concepts let you state requirements explicitly, giving clearer errors — closer to a typed contract.

~~~cpp
#include <concepts>

template <typename T>
requires std::totally_ordered<T>     // T must support < > == etc.
T max_of(T a, T b) { return (a > b) ? a : b; }
~~~

### Best practices
- Use templates for genuinely type-independent logic (containers, algorithms).
- Prefer standard library templates over hand-rolling.
- In C++20, add **concepts** to document and enforce type requirements and get readable errors.
- Keep template code in headers.

### Exercise
Write a function template \`template <typename T> T sum(const std::vector<T>& v)\` that returns the sum of a vector's elements (start from \`T{}\`, the zero value). Test it with a \`std::vector<int>\` and a \`std::vector<double>\` and print both totals.
`,
      flashcards: [
        {
          front: "How do C++ templates differ from Python's duck typing?",
          back: `Python duck-typing resolves operations at **runtime**: one function body works on any object, and a missing operation errors only when that line runs. C++ templates resolve at **compile time**: the compiler generates a separate, fully type-checked instantiation of the code for each concrete type used, so type errors surface during compilation and the generated code has no dynamic-dispatch overhead.`
        },
        {
          front: "Why must template definitions usually live in header files?",
          back: `To instantiate a template for a particular type, the compiler needs the **full body**, not just a declaration. If a template were defined in a \`.cpp\`, other translation units including only its header couldn't generate the needed instantiation and you'd get linker errors. So template definitions go in headers where every user can see the complete code.`
        },
        {
          front: "What are C++20 concepts and what problem do they solve?",
          back: `Concepts are named, compile-time **constraints on template type parameters** (e.g. \`std::totally_ordered<T>\`, \`std::integral<T>\`). They let you state a template's requirements explicitly, so violations produce a clear "T does not satisfy concept X" message instead of a cryptic error buried deep in the template body — bringing templates closer to an enforced, readable typed contract.`
        },
        {
          front: "Solution: generic sum() function template over a vector.",
          back: `~~~cpp
#include <iostream>
#include <vector>

template <typename T>
T sum(const std::vector<T>& v) {
    T total{};                 // zero-initialize (0, 0.0, etc.)
    for (const T& x : v) {
        total += x;
    }
    return total;
}

int main() {
    std::vector<int> a = {1, 2, 3, 4};
    std::vector<double> b = {1.5, 2.5, 3.0};
    std::cout << sum(a) << "\\n";   // 10
    std::cout << sum(b) << "\\n";   // 7
    return 0;
}
~~~
\`T{}\` value-initializes the accumulator to the type's zero, and \`const T&\` in the loop avoids copying each element. The template is instantiated once for \`int\` and once for \`double\`.`
        }
      ],
      quiz: [
        {
          question: "When does a C++ function template get compiled into actual machine code?",
          options: [
            "Once, when the template is written",
            "At runtime, on first call",
            "When it is instantiated for a specific type — one version per type used",
            "Never; templates are interpreted"
          ],
          answer: 2,
          explanation: `A template is a recipe. The compiler generates concrete code (an *instantiation*) for each distinct set of type arguments actually used — \`max_of<int>\`, \`max_of<double>\`, etc. Each instantiation is separately type-checked and compiled.`
        },
        {
          question: "For `template <typename T> T max_of(T a, T b)`, what happens if T is a type with no operator> defined?",
          options: [
            "It compiles and returns a at runtime",
            "A compile error occurs when that instantiation is generated",
            "It silently returns the first argument",
            "It raises a runtime exception"
          ],
          answer: 1,
          explanation: `The template body uses \`a > b\`. When instantiated for a type lacking \`operator>\`, the compiler fails at compile time (inside the template body). This is the compile-time analogue of Python's runtime \`TypeError\` — caught earlier.`
        },
        {
          question: "Why are std::vector<int> and std::vector<double> effectively different types?",
          options: [
            "They share the same code at runtime",
            "std::vector is a class template; each type argument produces a distinct instantiation",
            "double is not allowed in vectors",
            "They are actually the same type"
          ],
          answer: 1,
          explanation: `\`std::vector\` is a class template. \`std::vector<int>\` and \`std::vector<double>\` are separate instantiations — distinct types with their own generated code, not interchangeable. This is fundamentally different from a Python \`list\`, which is one type holding anything.`
        },
        {
          question: "What is the primary benefit of C++20 concepts on template parameters?",
          options: [
            "They make templates run faster at runtime",
            "They allow templates to accept any type",
            "They express type requirements explicitly, producing clearer errors when a type doesn't qualify",
            "They eliminate the need for headers"
          ],
          answer: 2,
          explanation: `Concepts constrain what types a template accepts (e.g. \`std::totally_ordered\`). Beyond documentation, they produce readable diagnostics — "T does not satisfy concept" — instead of deep, cryptic template-instantiation errors, and prevent invalid instantiations up front.`
        }
      ]
    },
    {
      id: "move-semantics",
      title: "Move Semantics",
      body: `## Move Semantics

Move semantics is the C++ feature with the least Python analogue — because Python never copies objects on assignment in the first place. In C++, where copying is the default, **moving** is the optimization that lets you *transfer* a resource out of a temporary instead of duplicating it.

### The problem moves solve
Consider returning a big vector. Without moves, this would copy a million elements:
~~~cpp
std::vector<int> make_data() {
    std::vector<int> v(1'000'000, 7);
    return v;                 // move (or elided) — NOT a copy
}
auto data = make_data();      // cheap: steals the buffer
~~~

A **copy** duplicates the underlying heap buffer. A **move** transfers ownership of the existing buffer to the new object and leaves the source empty — O(1) pointer swaps instead of O(n) copying.

### lvalues, rvalues, and &&
- An **lvalue** has a name and persists (\`x\`, \`v\`) — you might use it again.
- An **rvalue** is a temporary about to disappear (a function's return, a literal) — safe to plunder.
- \`T&&\` is an **rvalue reference** — binds to temporaries and enables the move.

~~~cpp
std::string a = "hello";
std::string b = a;              // COPY — a still usable afterward
std::string c = std::move(a);   // MOVE — steals a's buffer; a now unspecified
~~~

> **Gotcha:** \`std::move\` does **not** move anything by itself — it's just a cast to \`T&&\` that says "I'm done with this, you may steal from it." After moving from an object, it's in a **valid but unspecified state**: don't read its value, but you may reassign or destroy it.

### Move in your own classes
With the Rule of Zero, moves come for free — \`std::vector\`, \`std::string\`, and \`unique_ptr\` members are already movable, so the compiler generates correct move operations.

~~~cpp
class Buffer {
    std::vector<char> bytes_;   // movable member
    // compiler-generated move ctor/assignment just move bytes_ — correct & fast
};
~~~

### unique_ptr — move-only
\`unique_ptr\` can't be copied (that would mean two owners), but it *can* be moved — transferring sole ownership.

~~~cpp
auto p = std::make_unique<int>(42);
// auto q = p;              // COMPILE ERROR — can't copy a unique_ptr
auto q = std::move(p);      // OK — ownership transferred; p is now null
~~~

### Why Python doesn't need this
Python assignment binds a name to an existing object — no copy happens, so there's nothing to optimize away. Moves exist precisely because C++'s default is to copy. Moves give you the efficiency of Python-style reference passing while keeping value semantics and deterministic ownership.

### Best practices
- Rely on **Rule of Zero** so moves are generated for you.
- Return big objects **by value** — moves (and copy elision) make it cheap; don't return raw pointers to avoid a "copy".
- Use \`std::move\` when you have a named lvalue you're truly finished with (e.g. passing into a sink function).
- Never use a moved-from object's value without reassigning it first.

### Exercise
Create \`std::vector<int> a = {1, 2, 3}\`. Move it into \`b\` with \`std::move\`. Print \`b.size()\` (3) and \`a.size()\` (typically 0 — the buffer was stolen). Add a comment explaining why reading \`a\`'s *elements* afterward would be unwise.
`,
      flashcards: [
        {
          front: "What is the difference between copying and moving in C++?",
          back: `A **copy** duplicates an object's underlying resources — e.g. allocating a new buffer and copying every element (O(n)). A **move** transfers ownership of the existing resources to the destination and leaves the source in a valid-but-empty state — typically just swapping pointers (O(1)). Moving is an optimization for when the source is a temporary or something you're finished with.`
        },
        {
          front: "What does std::move actually do?",
          back: `**Nothing at runtime by itself** — \`std::move(x)\` is just a *cast* to an rvalue reference (\`T&&\`). It signals "this object may be moved from / plundered." The actual moving happens in whatever move constructor or move assignment then receives that rvalue. After a move, the source is in a valid but **unspecified** state: safe to reassign or destroy, unsafe to read its value.`
        },
        {
          front: "Why does Python have no equivalent of move semantics?",
          back: `Python assignment binds a name to an already-existing object — it never copies the object — so there is nothing to optimize. Move semantics exist in C++ specifically because C++'s default is **value semantics (copying)**; moves recover reference-passing-like efficiency for temporaries while preserving value semantics and deterministic ownership. \`unique_ptr\` being move-only (not copyable) also has no Python parallel.`
        },
        {
          front: "Solution: move a vector and inspect both objects.",
          back: `~~~cpp
#include <iostream>
#include <vector>
#include <utility>   // std::move

int main() {
    std::vector<int> a = {1, 2, 3};
    std::vector<int> b = std::move(a);   // steal a's buffer

    std::cout << "b.size() = " << b.size() << "\\n";  // 3
    std::cout << "a.size() = " << a.size() << "\\n";  // typically 0

    // Reading a's *elements* now would be unwise: after being moved from,
    // 'a' is in a valid but UNSPECIFIED state. size()==0 is the usual result
    // for a moved-from vector, but relying on specific element values is UB-ish.
    // We may still safely reassign or destroy 'a'.
    a = {9, 9};   // reassignment is fine
    std::cout << "a.size() = " << a.size() << "\\n";  // 2
    return 0;
}
~~~`
        }
      ],
      quiz: [
        {
          question: "What best describes a move operation on a std::vector?",
          options: [
            "It deep-copies every element into a new buffer",
            "It transfers ownership of the existing buffer to the destination in O(1), leaving the source empty",
            "It shares the buffer between both vectors",
            "It is identical to a copy"
          ],
          answer: 1,
          explanation: `Moving a vector transfers its internal pointer/size/capacity to the destination and resets the source to empty — a constant-time pointer transfer, no element duplication. A copy would allocate a new buffer and duplicate all elements (O(n)).`
        },
        {
          question: "What does std::move(x) do?",
          options: [
            "Immediately moves x's contents somewhere",
            "Frees x",
            "Casts x to an rvalue reference, allowing a move constructor/assignment to steal from it",
            "Makes a deep copy of x"
          ],
          answer: 2,
          explanation: `\`std::move\` performs no movement itself — it's a compile-time cast to \`T&&\`. It merely enables move semantics by marking \`x\` as an rvalue, so the receiving move operation is selected over the copy operation.`
        },
        {
          question: "After `auto q = std::move(p);` where p is a std::unique_ptr, what is the state of p?",
          options: [
            "p still owns the object (both q and p own it)",
            "p is null — ownership was transferred to q",
            "The program fails to compile",
            "p and q share ownership via a reference count"
          ],
          answer: 1,
          explanation: `\`unique_ptr\` is move-only: moving transfers sole ownership to \`q\` and leaves \`p\` as \`nullptr\`. (Copying a \`unique_ptr\` — \`auto q = p;\` — would be a compile error, since two unique owners is a contradiction.)`
        },
        {
          question: "What is safe to do with an object after it has been moved from?",
          options: [
            "Read its current values and rely on them",
            "Nothing — the object is destroyed",
            "Reassign to it or let it be destroyed; it is in a valid but unspecified state",
            "Only pass it to another std::move"
          ],
          answer: 2,
          explanation: `A moved-from object is left in a **valid but unspecified** state. You must not depend on its value, but you may safely assign a new value to it or allow its destructor to run. This is why returning big objects by value is cheap and safe — the temporary is moved from and then discarded.`
        }
      ]
    }
  ]
}
