---
title: "C++ Mid Expected Exam 2"
description: "Ten expected midterm questions built only from the Exercise sessions (02–06, before pointers): macros, conversions, operators, control flow, functions, recursion, arrays, and sorting."
week: 0
order: 4
published: true
---

**Instructions**

- Answer each question with the requested output, code, or explanation.
- Unless stated otherwise, assume a C++17 compiler and that `#include <iostream>` is present.
- Scope: everything **before pointers** (Exercise 02–05 and function overloading from Exercise 06).
- Write your answer first, then open the hints one at a time, and the solution last.
- These are **expected questions** adapted from the Exercise session slides and solutions (Week 02–06). They may differ from the actual exam. Every program output in the solutions was checked by compiling and running the code.

| Question | Type | Source |
| --- | --- | --- |
| Question 1 | Output tracing | Exercise 02 · Macros |
| Question 2 | Output tracing | Exercise 02–03 · Arithmetic, conversions |
| Question 3 | Output tracing | Exercise 03 · Operators |
| Question 4 | Output tracing | Exercise 03 · Control structures |
| Question 5 | Code writing | Exercise 02 · Quiz 2 |
| Question 6 | Output tracing · Concept | Exercise 04–06 · Functions, scope, overloading |
| Question 7 | Output tracing · Code writing | Exercise 04 · Recursion |
| Question 8 | Code completion · Tracing | Exercise 04 · Quiz 1 and solution |
| Question 9 | Output tracing · Concept | Exercise 05 · Arrays and vectors |
| Question 10 | Tracing · Concept | Exercise 05 · Quiz 1 and solution |

## Question 1 · Macro expansion

**Reference:** [Exercise 02](/lectures/grade-01/semester-muheifg4/subject-cpp-exercise/lecture-02)

> [!QUIZ]
> Write the four lines this program prints, and show the expanded expression for each line.
>
> ```cpp
> #include <iostream>
> #define SIDE 3
> #define SQUARE_BAD(x) x * x
> #define SQUARE(x) ((x) * (x))
> #define HALF(x) x / 2
> int main() {
>     std::cout << SQUARE_BAD(SIDE + 2) << '\n';
>     std::cout << SQUARE(SIDE + 2) << '\n';
>     std::cout << 100 / SQUARE_BAD(5) << '\n';
>     std::cout << HALF(7 + 1) << '\n';
>     return 0;
> }
> ```
>
> Then explain why the slides recommend parentheses around **each parameter** and around **the whole replacement**.

> [!HINT 1]
> The preprocessor replaces text before compilation. It does not evaluate `SIDE + 2` first.

> [!HINT 2]
> Write the expansion literally, then apply normal precedence: `*` and `/` before `+`, and left-to-right for `*` and `/`.

> [!ANSWER]
> **Output**
>
> ```text
> 11
> 25
> 100
> 7
> ```
>
> | Line | Expansion | Value |
> | --- | --- | --- |
> | 1 | `3 + 2 * 3 + 2` | 3 + 6 + 2 = **11** |
> | 2 | `((3 + 2) * (3 + 2))` | **25** |
> | 3 | `100 / 5 * 5` | (100 / 5) * 5 = **100** |
> | 4 | `7 + 1 / 2` | 7 + 0 = **7** (integer division) |
>
> Parentheses around each parameter keep an argument like `SIDE + 2` together (line 1 vs line 2). Parentheses around the whole replacement keep the macro together inside a larger expression (line 3: `100 / ((5) * (5))` would give 4).

## Question 2 · Integer division and conversions

**Reference:** [Exercise 02](/lectures/grade-01/semester-muheifg4/subject-cpp-exercise/lecture-02) · [Exercise 03](/lectures/grade-01/semester-muheifg4/subject-cpp-exercise/lecture-03)

> [!QUIZ]
> 1. Write the two lines this program prints.
>
> ```cpp
> #include <iostream>
> int main() {
>     int total = 7, count = 2;
>     double a = total / count;
>     double b = static_cast<double>(total) / count;
>     int c = static_cast<int>(-3.75);
>     double d = 7 / 2.0;
>     std::cout << a << ' ' << b << ' ' << c << ' ' << d << '\n';
>     std::cout << 17 % 5 << ' ' << -17 % 5 << ' ' << 17 / -5 << '\n';
>     return 0;
> }
> ```
>
> 2. Does `int whole{3.75};` compile? What about `int whole = 3.75;`? Explain.

> [!HINT 1]
> If both operands are `int`, the division is done in `int` first. Assigning the result to `double` happens afterwards.

> [!HINT 2]
> Converting a floating-point value to `int` truncates **toward zero**. In C++, `%` and `/` with a negative operand also round the quotient toward zero.

> [!ANSWER]
> **1.**
>
> ```text
> 3 3.5 -3 3.5
> 2 -2 -3
> ```
>
> - `a`: `7 / 2` is integer division (3), then stored as `3.0`, printed as `3`. Assigning to `double` does **not** restore the fraction.
> - `b`: `static_cast<double>(7) / 2` = 3.5.
> - `c`: truncation toward zero gives **-3**, not -4.
> - `-17 % 5` is **-2** and `17 / -5` is **-3** because the quotient is truncated toward zero.
>
> **2.** `int whole{3.75};` is a **compile error**: list initialization `{}` does not allow narrowing conversions. `int whole = 3.75;` compiles (usually with a warning) and stores 3.

## Question 3 · Increment, compound assignment, and precedence

**Reference:** [Exercise 03](/lectures/grade-01/semester-muheifg4/subject-cpp-exercise/lecture-03)

> [!QUIZ]
> Write the output and the values of `x` and `y` after each statement.
>
> ```cpp
> #include <iostream>
> int main() {
>     int x = 5, y = 2;
>     int a = x++ + ++y;
>     int b = x-- * 2 - y;
>     x += y *= 2;
>     bool c = x > 10 && y++ < 6 || !y;
>     std::cout << a << ' ' << b << ' ' << x << ' ' << y << ' ' << c << '\n';
>     return 0;
> }
> ```

> [!HINT 1]
> `x++` yields the old value, `++y` yields the new value. Compound assignments group right to left: `x += (y *= 2)`.

> [!HINT 2]
> `&&` binds tighter than `||`, so the condition is `(x > 10 && y++ < 6) || !y`. `y++ < 6` compares the **old** value of `y`.

> [!ANSWER]
> **Output:** `8 9 11 7 0`
>
> | Statement | Result | x | y |
> | --- | --- | ---: | ---: |
> | `a = x++ + ++y` | 5 + 3 = 8 | 6 | 3 |
> | `b = x-- * 2 - y` | 6 × 2 − 3 = 9 | 5 | 3 |
> | `x += y *= 2` | y = 6, then x = 5 + 6 | 11 | 6 |
> | `c = (x > 10 && y++ < 6) \|\| !y` | `true && (6 < 6)` is false, y becomes 7; `!7` is false | 11 | 7 |
>
> `c` is `false`, which `std::cout` prints as `0`.

## Question 4 · Control flow: continue, break, switch, do-while

**Reference:** [Exercise 03](/lectures/grade-01/semester-muheifg4/subject-cpp-exercise/lecture-03)

> [!QUIZ]
> Write the three lines of output and explain each.
>
> ```cpp
> #include <iostream>
> int main() {
>     for (int i = 1; i <= 10; ++i) {
>         if (i % 3 == 0) continue;
>         if (i > 7) break;
>         std::cout << i << ' ';
>     }
>     std::cout << '\n';
>     int code = 2;
>     switch (code) {
>         case 1: std::cout << "A";
>         case 2: std::cout << "B";
>         case 3: std::cout << "C"; break;
>         default: std::cout << "D";
>     }
>     std::cout << '\n';
>     int n = 0;
>     do {
>         ++n;
>     } while (n < 0);
>     std::cout << n << '\n';
>     return 0;
> }
> ```

> [!HINT 1]
> In a `for` loop, `continue` jumps to the update `++i`. `break` leaves the loop completely.

> [!HINT 2]
> A `case` without `break` falls through to the next case. A `do while` loop runs its body before checking the condition.

> [!ANSWER]
> ```text
> 1 2 4 5 7 
> BC
> 1
> ```
>
> - **Line 1:** 3 and 6 are skipped by `continue`; 9 is also a multiple of 3, but the loop already stopped at **i = 8** with `break`.
> - **Line 2:** execution starts at `case 2`, prints B, **falls through** to case 3, prints C, then `break`.
> - **Line 3:** the body runs once before `n < 0` is checked, so `n` is **1**.

## Question 5 · Writing code: timestamp conversion

**Reference:** [Exercise 02](/lectures/grade-01/semester-muheifg4/subject-cpp-exercise/lecture-02)

> [!QUIZ]
> The reference time is Day 0, 00:00:00. Write a complete program that reads `elapsedSeconds` (0 to 1,000,000,000) and prints the day number and the time of day in this exact format:
>
> ```text
> Days: 1 Hours: 2 Minutes: 0 Seconds: 5
> ```
>
> Then write the output for the inputs `93605` and `1000000000`.

> [!HINT 1]
> One day has 86,400 seconds and one hour has 3,600 seconds.

> [!HINT 2]
> Use `/` to take whole units and `%` to keep what is left: days first, then hours, minutes, seconds.

> [!ANSWER]
> ```cpp
> #include <iostream>
> int main() {
>     long long elapsedSeconds = 0;
>     std::cin >> elapsedSeconds;
>     long long days = elapsedSeconds / 86400;
>     long long rest = elapsedSeconds % 86400;
>     long long hours = rest / 3600;
>     long long minutes = rest % 3600 / 60;
>     long long seconds = rest % 60;
>     std::cout << "Days: " << days << " Hours: " << hours
>               << " Minutes: " << minutes << " Seconds: " << seconds << '\n';
>     return 0;
> }
> ```
>
> | Input | Output |
> | --- | --- |
> | `93605` | `Days: 1 Hours: 2 Minutes: 0 Seconds: 5` |
> | `1000000000` | `Days: 11574 Hours: 1 Minutes: 46 Seconds: 40` |
>
> 1,000,000,000 still fits in `int`, but `long long` leaves room if the range grows.

## Question 6 · Functions: pass by value, references, static locals, scope, overloading

**Reference:** [Exercise 04](/lectures/grade-01/semester-muheifg4/subject-cpp-exercise/lecture-04) · [Exercise 05](/lectures/grade-01/semester-muheifg4/subject-cpp-exercise/lecture-05)

> [!QUIZ]
> 1. Write the four lines this program prints.
>
> ```cpp
> #include <iostream>
> int counter = 10;
> int next() {
>     static int n = 0;
>     ++n;
>     return n + counter;
> }
> void bump(int x, int& y) {
>     ++x;
>     ++y;
>     ++counter;
> }
> int main() {
>     int a = 1, b = 1;
>     bump(a, b);
>     std::cout << a << ' ' << b << ' ' << counter << '\n';
>     std::cout << next() << '\n';
>     std::cout << next() << '\n';
>     {
>         int counter = 0;
>         std::cout << counter + next() << '\n';
>     }
>     return 0;
> }
> ```
>
> 2. Given the two overloads below, which of the three calls compiles, and what does each print or report?
>
> ```cpp
> int larger(int a, int b) { return a > b ? a : b; }
> double larger(double a, double b) { return a > b ? a : b; }
> larger(2, 3);
> larger(2.5, 3.5);
> larger(2.5, 1);
> ```
>
> 3. Can you add `double twice(int x)` next to an existing `int twice(int x)`? Why?

> [!HINT 1]
> A value parameter is a copy; a reference parameter is the caller's variable. A `static` local is initialized once and keeps its value between calls.

> [!HINT 2]
> Inside the block, the local `counter` hides the global one in `main`, but `next()` still uses the **global** `counter`. For overloading, check whether one function is the best match for **every** argument.

> [!ANSWER]
> **1.**
>
> ```text
> 1 2 11
> 12
> 13
> 14
> ```
>
> - `bump`: `x` is a copy (a stays 1), `y` is a reference (b becomes 2), the global `counter` becomes 11.
> - `next()` returns 1 + 11 = 12, then 2 + 11 = 13. The static `n` keeps its value.
> - In the block, the local `counter` is 0, but `next()` reads the global (11): 0 + (3 + 11) = **14**.
>
> **2.** `larger(2, 3)` → 3 (int version). `larger(2.5, 3.5)` → 3.5 (double version). `larger(2.5, 1)` → **compile error: ambiguous call**. The double version matches the first argument better and the int version matches the second argument better, so neither is best for all arguments. Fix with an explicit conversion, e.g. `larger(2.5, 1.0)`.
>
> **3.** No. Overloads must differ in their **parameter lists**; a different return type alone is not enough (compile error).

## Question 7 · Mutual recursion and recursion to iteration

**Reference:** [Exercise 04](/lectures/grade-01/semester-muheifg4/subject-cpp-exercise/lecture-04)

> [!QUIZ]
> 1. Write the output and list the chain of calls made by `isOdd(5)`.
>
> ```cpp
> #include <iostream>
> int calls = 0;
> bool isEven(int n);
> bool isOdd(int n);
> bool isEven(int n) {
>     ++calls;
>     if (n == 0) return true;
>     return isOdd(n - 1);
> }
> bool isOdd(int n) {
>     ++calls;
>     if (n == 0) return false;
>     return isEven(n - 1);
> }
> void show(int n) {
>     if (n == 0) return;
>     show(n - 1);
>     std::cout << n << ' ';
> }
> int main() {
>     bool result = isOdd(5);
>     std::cout << std::boolalpha << result << ' ' << calls << '\n';
>     show(4);
>     std::cout << '\n';
>     return 0;
> }
> ```
>
> 2. Why are the declarations `bool isEven(int n);` and `bool isOdd(int n);` needed?
> 3. What happens if `isEven(-1)` is called?
> 4. Rewrite `show` with a loop so that it prints the same output.

> [!HINT 1]
> Each call decreases `n` by one and switches function until `n == 0`. Count every call, including the first.

> [!HINT 2]
> `show` prints **after** the recursive call returns, so the smallest value is printed first.

> [!ANSWER]
> **1.**
>
> ```text
> true 6
> 1 2 3 4 
> ```
>
> `isOdd(5) → isEven(4) → isOdd(3) → isEven(2) → isOdd(1) → isEven(0)` returns `true`, and every caller returns that value: **6 calls**. `std::boolalpha` prints `true` instead of `1`.
>
> **2.** Each function calls the other, so at least one must be declared before it is used. Declaring both first is the clearest way.
>
> **3.** `n` goes -2, -3, … and never reaches the base case `n == 0`. The recursion does not stop and the program eventually runs out of stack (**stack overflow**).
>
> **4.**
>
> ```cpp
> void show(int n) {
>     for (int i = 1; i <= n; ++i) std::cout << i << ' ';
> }
> ```

## Question 8 · Modular power with recursion

**Reference:** [Exercise 04](/lectures/grade-01/semester-muheifg4/subject-cpp-exercise/lecture-04)

> [!QUIZ]
> The function returns aᵇ mod m, with a⁰ = 1.
>
> ```cpp
> long long powerMod(long long a, long long b, long long m) {
>     if (b == 0) return ____(1)____;
>     long long half = powerMod(a, ____(2)____, m);
>     long long result = half * half % m;
>     if (____(3)____) result = result * (a % m) % m;
>     return result;
> }
> ```
>
> 1. Fill in blanks (1)–(3).
> 2. Trace `powerMod(3, 13, 1000)`: list each value of `b`, `half`, and `result`.
> 3. Why does the solution use `long long`, and what is the time complexity?

> [!HINT 1]
> a^b = (a^(b/2))² when b is even, and (a^(b/2))² · a when b is odd.

> [!HINT 2]
> The calls go b = 13 → 6 → 3 → 1 → 0. Compute results from the bottom up and take `% 1000` after each multiplication.

> [!ANSWER]
> **1.** (1) `1`  (2) `b / 2`  (3) `b % 2 != 0`
>
> **2.**
>
> | b | half | result |
> | ---: | ---: | ---: |
> | 0 | — | 1 (base case) |
> | 1 | 1 | 1·1 = 1, odd → 1·3 = **3** |
> | 3 | 3 | 9, odd → 9·3 = **27** |
> | 6 | 27 | 729, even → **729** |
> | 13 | 729 | 531441 % 1000 = 441, odd → 441·3 % 1000 = **323** |
>
> `powerMod(3, 13, 1000)` returns **323**.
>
> **3.** `half * half` can be as large as (m − 1)² ≈ 10¹⁸ when m ≤ 10⁹, which overflows `int` but fits in `long long`. Each call halves `b`, so the time is **O(log b)**.

## Question 9 · Arrays, character arrays, and std::vector

**Reference:** [Exercise 05](/lectures/grade-01/semester-muheifg4/subject-cpp-exercise/lecture-05)

> [!QUIZ]
> 1. Write the four lines of output.
>
> ```cpp
> #include <iostream>
> #include <vector>
> int main() {
>     int a[5] = {4, 7};
>     a[2] = a[0] + a[1];
>     for (int x : a) std::cout << x << ' ';
>     std::cout << '\n';
>     char word[] = "Hi!";
>     std::cout << sizeof(word) << ' ' << (word[3] == '\0') << '\n';
>     std::vector<int> v = {3, 1};
>     v.push_back(5);
>     v.push_back(2);
>     v.pop_back();
>     v.at(1) = 9;
>     std::cout << v.size() << ':';
>     for (int x : v) std::cout << ' ' << x;
>     std::cout << '\n';
>     int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
>     int sum = 0;
>     for (int r = 0; r < 2; ++r) sum += m[r][2];
>     std::cout << sum << '\n';
>     return 0;
> }
> ```
>
> 2. What is the difference between `a[5]` and `v.at(5)` in this program?
> 3. A function is declared as `void fill(int a[], int n, int value)`. Does it change the caller's array? Why does it need `n`?

> [!HINT 1]
> Elements not listed in an array initializer become 0. A string literal includes a terminating `'\0'`.

> [!HINT 2]
> Follow the vector step by step: {3, 1} → push 5 → push 2 → pop → change index 1.

> [!ANSWER]
> **1.**
>
> ```text
> 4 7 11 0 0 
> 4 1
> 3: 3 9 5
> 9
> ```
>
> - Missing initializers become 0; `a[2]` = 4 + 7 = 11.
> - `"Hi!"` has 3 characters plus `'\0'`, so `sizeof(word)` is **4** and `word[3]` is the terminator.
> - Vector: {3, 1} → {3, 1, 5} → {3, 1, 5, 2} → {3, 1, 5} → {3, 9, 5}, size 3.
> - Column index 2 of each row: 3 + 6 = **9**.
>
> **2.** Valid indices are 0–4. `a[5]` is out of bounds and has **undefined behavior** (no check). `v.at(5)` checks the index and **throws** `std::out_of_range`.
>
> **3.** Yes. An array parameter does not copy the elements, so writes go to the caller's array. The function cannot tell how many elements the array has, so the size must be passed separately.

## Question 10 · Quick sort partition

**Reference:** [Exercise 05](/lectures/grade-01/semester-muheifg4/subject-cpp-exercise/lecture-05)

> [!QUIZ]
> 1. Trace `partition(a, 0, 5)` for `a = {6, 2, 9, 1, 5}`. Show the array after each swap, the final array, and the returned index.
>
> ```cpp
> int partition(std::vector<int>& a, int begin, int end) {
>     int pivot = a[end - 1];
>     int i = begin;
>     for (int j = begin; j < end - 1; ++j) {
>         if (a[j] < pivot) {
>             std::swap(a[i], a[j]);
>             ++i;
>         }
>     }
>     std::swap(a[i], a[end - 1]);
>     return i;
> }
> ```
>
> 2. Which two recursive calls does `quickSort` make next?
> 3. With the last element as the pivot, which input of size 5 causes the worst case, and how many pivot comparisons does it make in total?

> [!HINT 1]
> The pivot is the last element, 5. `i` is the next position for a value smaller than the pivot.

> [!HINT 2]
> The worst case happens when the pivot is always the largest (or smallest) value, so one side is empty at every level.

> [!ANSWER]
> **1.**
>
> | j | a[j] | Action | Array | i |
> | ---: | ---: | --- | --- | ---: |
> | 0 | 6 | 6 ≥ 5, no swap | 6 2 9 1 5 | 0 |
> | 1 | 2 | swap a[0], a[1] | 2 6 9 1 5 | 1 |
> | 2 | 9 | no swap | 2 6 9 1 5 | 1 |
> | 3 | 1 | swap a[1], a[3] | 2 1 9 6 5 | 2 |
> | end | — | swap a[2] with pivot | **2 1 5 6 9** | 2 |
>
> It returns **2**: everything left of index 2 is smaller than 5, everything right is at least 5.
>
> **2.** `quickSort(a, 0, 2)` and `quickSort(a, 3, 5)`. The pivot at index 2 is excluded from both ranges.
>
> **3.** An already sorted input such as `1 2 3 4 5`. Each level compares 4 + 3 + 2 + 1 = **10** times in total, which is n(n − 1)/2 = Θ(n²).
