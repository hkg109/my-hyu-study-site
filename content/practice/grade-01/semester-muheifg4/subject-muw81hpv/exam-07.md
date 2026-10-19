---
title: "C++ Homework Expected Exam 2"
description: "Ten expected midterm questions built only from Homework 2 (before pointers): recursive factorials, binomial coefficients, Pascal's triangle, permutations with backtracking, and turning double recursion into loops."
week: 0
order: 7
published: true
---

**Instructions**

- Answer each question with the requested output, code, or explanation.
- Unless stated otherwise, assume a C++17 compiler, `#include <iostream>`, and `using namespace std;`.
- Scope: **Homework 2 only** (recursion, backtracking, recursion → loop). Arrays are passed as `int a[]`; nothing after pointers is used.
- Write your answer first, then open the hints one at a time, and the solution last.
- These are **expected questions** adapted from Homework 2 and may differ from the actual exam. Every program output in the solutions was checked by compiling and running the code.

| Question | Type | Source |
| --- | --- | --- |
| Question 1 | Output tracing | Homework 2 · Exercise 1 (`fac`) |
| Question 2 | Output · Concept | Homework 2 · Exercise 1 (`binomial_coefficient`) |
| Question 3 | Code writing · Tracing | Homework 2 · Exercise 1 (Pascal's rule) |
| Question 4 | Output tracing | Homework 2 · Exercise 2 (diagnostic output) |
| Question 5 | Code completion · Debugging | Homework 2 · Exercise 2 (lexicographic order) |
| Question 6 | Output · Code writing | Homework 2 · Exercise 2 (repeated elements) |
| Question 7 | Tracing · Concept | Homework 2 · Exercise 3 (a), (b) |
| Question 8 | Output tracing · Concept | Homework 2 · Exercise 3 (c), (d), (e) |
| Question 9 | Output tracing · Code writing | Homework 2 · Recursion structure |
| Question 10 | Tracing · Code writing | Homework 2 · Exercise 3 (b) technique |

## Question 1 · Tracing the factorial call stack

**Reference:** [Homework 2 · Exercise 1](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02)

> [!QUIZ]
> 1. Write the output of `fac(4);`.
>
> ```cpp
> int fac(int n) {
>     cout << "in " << n << '\n';
>     int result = (n <= 1) ? 1 : n * fac(n - 1);
>     cout << "out " << n << " = " << result << '\n';
>     return result;
> }
> ```
>
> 2. How many calls of `fac` are active at the same time at most?
> 3. The base case is changed to `n == 1`. What happens for `fac(0)`?

> [!HINT 1]
> Every "in" line is printed on the way down. No "out" line can appear until the base case returns.

> [!HINT 2]
> With `n == 1`, follow the arguments of `fac(0)`: 0, −1, −2, …

> [!ANSWER]
> **1.**
>
> ```text
> in 4
> in 3
> in 2
> in 1
> out 1 = 1
> out 2 = 2
> out 3 = 6
> out 4 = 24
> ```
>
> The calls go down to the base case, and the multiplications happen while the calls **return** (the combining step).
>
> **2.** **4** (`fac(4)`, `fac(3)`, `fac(2)`, `fac(1)`), so the stack depth is O(n).
>
> **3.** `fac(0)` never reaches `n == 1`: it calls `fac(-1)`, `fac(-2)`, … without end, until the call stack overflows and the program crashes. The base case `n <= 1` also covers 0 (0! = 1) and stops on negative input.

## Question 2 · Binomial coefficient edge cases

**Reference:** [Homework 2 · Exercise 1](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02)

> [!QUIZ]
> The Homework 2 solution is:
>
> ```cpp
> int fac(int n) {
>     if (n <= 1) return 1;
>     else return n * fac(n - 1);
> }
> int binomial_coefficient(int n, int r) {
>     return fac(n) / (fac(n - r) * fac(r));
> }
> ```
>
> 1. Write the return value of `binomial_coefficient(5, 0)`, `(5, 5)`, `(0, 0)`, `(12, 5)` and `(3, 5)`.
> 2. Which of these results is mathematically wrong, and which precondition does the function need?
> 3. On a typical compiler, `binomial_coefficient(13, 6)` returns `532` instead of `1716`. Explain why.

> [!HINT 1]
> `fac` returns 1 for every n ≤ 1, including negative n. Integer division truncates.

> [!HINT 2]
> 12! = 479001600 fits in a 32-bit `int`, but 13! = 6227020800 does not.

> [!ANSWER]
> **1.**
>
> | Call | Work | Result |
> | --- | --- | ---: |
> | (5, 0) | 120 / (120 · 1) | **1** |
> | (5, 5) | 120 / (1 · 120) | **1** |
> | (0, 0) | 1 / (1 · 1) | **1** |
> | (12, 5) | 479001600 / (5040 · 120) | **792** |
> | (3, 5) | 6 / (fac(−2) · 120) = 6 / 120 | **0** |
>
> **2.** `(3, 5)` should be "undefined" (you cannot choose 5 from 3), but the function quietly returns 0 because `fac(-2)` returns 1. The function needs **0 ≤ r ≤ n**, and the caller should check it.
>
> **3.** `fac(13)` overflows `int` (signed overflow is undefined behavior; here the value wraps around to 1932053504). The division then uses a wrong numerator: 1932053504 / (5040 · 720) = 532. The answer 1716 is small, but an intermediate value is too large.

## Question 3 · Pascal's triangle with one array

**Reference:** [Homework 2 · Exercise 1](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02)

> [!QUIZ]
> Pascal's rule says C(n, r) = C(n − 1, r − 1) + C(n − 1, r), with C(n, 0) = C(n, n) = 1. This needs only additions, so no factorial can overflow.
>
> ```cpp
> void pascal(int rows) {
>     int c[20] = {0};
>     c[0] = 1;
>     for (int n = 0; n < rows; ++n) {
>         for (int r = n; r >= 1; --r)
>             c[r] = c[r] + c[r - 1];
>         for (int r = 0; r <= n; ++r)
>             cout << c[r] << (r < n ? " " : "\n");
>     }
> }
> ```
>
> 1. Write the output of `pascal(7)`. Which line contains C(6, 2)?
> 2. The inner loop is changed to run **left to right**: `for (int r = 1; r <= n; ++r)`. Write the output of `pascal(5)`.
> 3. Explain why the update must go from right to left.

> [!HINT 1]
> Before row n is computed, `c[0..n-1]` holds row n − 1 and `c[n]` is 0.

> [!HINT 2]
> When going left to right, `c[r - 1]` has already been changed to the new row when `c[r]` is computed.

> [!ANSWER]
> **1.**
>
> ```text
> 1
> 1 1
> 1 2 1
> 1 3 3 1
> 1 4 6 4 1
> 1 5 10 10 5 1
> 1 6 15 20 15 6 1
> ```
>
> C(6, 2) = **15**, the third number in the last line.
>
> **2.**
>
> ```text
> 1
> 1 1
> 1 2 2
> 1 3 5 5
> 1 4 9 14 14
> ```
>
> **3.** `c[r]` needs the **old** value of `c[r - 1]` (from row n − 1). Going right to left, `c[r - 1]` is updated only after `c[r]` has used it. Going left to right, `c[r]` adds the **new** value, so the rows become wrong from row 2 on.

## Question 4 · Diagnostic output of `permute`

**Reference:** [Homework 2 · Exercise 2](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02)

> [!QUIZ]
> This is the Homework 2 solution with its diagnostic messages. Write the exact output of `permutNumbers(2);`.
>
> ```cpp
> void swap(int& x, int& y) { int temp = x; x = y; y = temp; }
>
> void print_array(int a[], int n) {
>     for (int j = 0; j <= n; j++) cout << a[j];
>     cout << endl;
> }
>
> void permute(int a[], int i, int n) {
>     cout << "Start Call i: " << i << " array: ";
>     print_array(a, n);
>     if (i == n) {
>         print_array(a, n);
>     } else {
>         for (int j = i; j <= n; j++) {
>             cout << "swap to   i:" << i << " j: " << j
>                  << " with a[i]: " << a[i] << " and a[j]: " << a[j] << endl;
>             swap(a[i], a[j]);
>             permute(a, i + 1, n);
>             cout << "swap back i:" << i << " j: " << j
>                  << " with a[i]: " << a[i] << " and a[j]: " << a[j] << endl;
>             swap(a[i], a[j]);
>         }
>     }
>     cout << "End  Call i: " << i << " array: " << endl;
> }
>
> void permutNumbers(int n) {
>     int a[30];
>     for (int i = 1; i <= n; i++) a[i - 1] = i;
>     permute(a, 0, n - 1);
> }
> ```
>
> How many lines does `permutNumbers(3)` print that contain only a permutation?

> [!HINT 1]
> Here `n` in `permute` is the **last index** (1 for two elements), not the number of elements.

> [!HINT 2]
> "swap back" prints the values **before** they are swapped back.

> [!ANSWER]
> ```text
> Start Call i: 0 array: 12
> swap to   i:0 j: 0 with a[i]: 1 and a[j]: 1
> Start Call i: 1 array: 12
> 12
> End  Call i: 1 array: 
> swap back i:0 j: 0 with a[i]: 1 and a[j]: 1
> swap to   i:0 j: 1 with a[i]: 1 and a[j]: 2
> Start Call i: 1 array: 21
> 21
> End  Call i: 1 array: 
> swap back i:0 j: 1 with a[i]: 2 and a[j]: 1
> End  Call i: 0 array: 
> ```
>
> `End Call` prints only the label, so each such line ends with `array: ` and nothing after it. The first `j = i` iteration swaps an element with itself, which changes nothing but still counts as a choice ("keep the current value here").
>
> For `permutNumbers(3)`: **6** permutation lines (3!), one for each base-case call.

## Question 5 · Permutations in lexicographic order with `used[]`

**Reference:** [Homework 2 · Exercise 2](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02)

> [!QUIZ]
> The swap method prints `321` before `312`. To print in lexicographic (dictionary) order, choose the **smallest unused number** for each position.
>
> ```cpp
> int perm[10];
> bool used[10];   // global, so all false at the start
>
> void gen(int pos, int n) {
>     if (pos == n) {
>         for (int i = 0; i < n; ++i) cout << perm[i];
>         cout << ' ';
>         return;
>     }
>     for (int v = 1; v <= n; ++v) {
>         if (________) continue;      // (A)
>         used[v] = true;
>         perm[pos] = v;
>         gen(pos + 1, n);
>         ________;                    // (B)
>     }
> }
> ```
>
> 1. Fill in (A) and (B), and write the output of `gen(0, 3)`.
> 2. A student forgets line (B). What does `gen(0, 3)` print? Explain.

> [!HINT 1]
> (A) skips a number that is already placed. (B) is the "restore" step of backtracking.

> [!HINT 2]
> Without (B), after `123` is printed, which numbers are still marked as used when the calls return?

> [!ANSWER]
> **1.** (A) `used[v]`, (B) `used[v] = false`
>
> ```text
> 123 132 213 231 312 321 
> ```
>
> **2.** Only **`123 `**. After the first branch, 1, 2 and 3 all stay marked as used. When the calls return and the loops try other values, every number is skipped, so no other permutation is ever completed. This is the same **choose → explore → restore** structure as the second `swap` in Homework 2; here the state to restore is the `used` array.

## Question 6 · Permutations with repeated letters

**Reference:** [Homework 2 · Exercise 2](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02)

> [!QUIZ]
> The swap method is applied to a C string.
>
> ```cpp
> void swapc(char& a, char& b) { char t = a; a = b; b = t; }
>
> void ps(char s[], int k, int n) {
>     if (k == n) { cout << s << ' '; return; }
>     for (int i = k; i < n; ++i) {
>         swapc(s[k], s[i]);
>         ps(s, k + 1, n);
>         swapc(s[k], s[i]);
>     }
> }
> ```
>
> 1. Write the output of `char s[] = "AAB"; ps(s, 0, 3);`.
> 2. Modify the loop so that each distinct arrangement is printed only once. (Idea: do not place a letter at position k if the same letter was already placed there in this loop.) Write the output for `"AAB"` and for `"ABA"`.

> [!HINT 1]
> The algorithm still makes 3! = 6 leaves. It does not know that the two A's are the same.

> [!HINT 2]
> Before swapping `s[i]` into position k, check whether `s[i]` equals any of `s[k] … s[i - 1]`.

> [!ANSWER]
> **1.**
>
> ```text
> AAB ABA AAB ABA BAA BAA 
> ```
>
> 6 lines, but only 3 distinct arrangements (3! / 2! = 3).
>
> **2.**
>
> ```cpp
> for (int i = k; i < n; ++i) {
>     bool dup = false;
>     for (int j = k; j < i; ++j)
>         if (s[j] == s[i]) dup = true;
>     if (dup) continue;
>     swapc(s[k], s[i]);
>     ps(s, k + 1, n);
>     swapc(s[k], s[i]);
> }
> ```
>
> `"AAB"` → `AAB ABA BAA`, `"ABA"` → `ABA AAB BAA`. Because the array is restored after each branch, `s[k] … s[i - 1]` are exactly the letters that have already been tried at position k.

## Question 7 · `sum_down`: closed formula and number of calls

**Reference:** [Homework 2 · Exercise 3](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02)

> [!QUIZ]
> ```cpp
> int sum_down(int x) {
>     if (x >= 0) {
>         x = x - 1;
>         int y = x + sum_down(x);
>         return y + sum_down(x);
>     } else {
>         return 1;
>     }
> }
> ```
>
> 1. Fill in the table for x = −1 … 4: the return value and the total number of calls made by `sum_down(x)`.
> 2. Show that `sum_down(x) = 2^(x+1) − x − 1` for x ≥ −1, and use it to confirm the Homework answer 19 for "the smallest x with a result greater than 1,000,000".
> 3. How many calls does `sum_down(19)` make? How many loop iterations does the iterative version need?

> [!HINT 1]
> f(x) = (x − 1) + 2 · f(x − 1), f(−1) = 1. Calls: C(−1) = 1, C(x) = 1 + 2 · C(x − 1).

> [!HINT 2]
> Insert the formula into the recurrence and check both sides, then check the base case.

> [!ANSWER]
> **1.**
>
> | x | −1 | 0 | 1 | 2 | 3 | 4 |
> | --- | ---: | ---: | ---: | ---: | ---: | ---: |
> | sum_down(x) | 1 | 1 | 2 | 5 | 12 | 27 |
> | calls | 1 | 3 | 7 | 15 | 31 | 63 |
>
> **2.** Base case: 2^0 − (−1) − 1 = 1 ✓. Step: (x − 1) + 2 · (2^x − (x − 1) − 1) = (x − 1) + 2^(x+1) − 2x = 2^(x+1) − x − 1 ✓.
> f(18) = 2^19 − 19 = 524269 ≤ 1,000,000 and f(19) = 2^20 − 20 = **1048556** > 1,000,000, so the answer is **19**.
>
> **3.** Calls C(x) = 2^(x+2) − 1, so `sum_down(19)` makes 2^21 − 1 = **2,097,151** calls. The loop runs **20** times (i = −1 … 18), so it is O(x) instead of O(2^x).

## Question 8 · Changing the parameter type of `sum_down`

**Reference:** [Homework 2 · Exercise 3](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02)

> [!QUIZ]
> 1. The parameter is changed to `double x` (the body and the `int` return type are unchanged). Write the value of `sum_down(0.5)`, `sum_down(1.5)` and `sum_down(2.5)`, and compare `sum_down(2.5)` with the `int` version's `sum_down(2)`.
> 2. With `unsigned int x`, what happens when `sum_down(0)` is called?
> 3. The head is changed to `int sum_down(const int x)`. Does the original body compile? Rewrite the body so that it does, keeping the same results.

> [!HINT 1]
> `int y = x + sum_down(x);` converts a `double` to `int`, which cuts off the fractional part (toward zero).

> [!HINT 2]
> For `unsigned`, `0 - 1` is the largest unsigned value, and `x >= 0` is always true.

> [!ANSWER]
> **1.**
>
> | Call | x after `x = x - 1` | y | Result |
> | --- | ---: | --- | ---: |
> | `sum_down(-0.5)` | — | base case | 1 |
> | `sum_down(0.5)` | −0.5 | int(−0.5 + 1) = int(0.5) = 0 | 0 + 1 = **1** |
> | `sum_down(1.5)` | 0.5 | int(0.5 + 1) = int(1.5) = 1 | 1 + 1 = **2** |
> | `sum_down(2.5)` | 1.5 | int(1.5 + 2) = int(3.5) = 3 | 3 + 2 = **5** |
>
> `sum_down(2.5)` = 5 = `sum_down(2)`. The fractional parts disappear in the `int` conversions, so a non-integer input silently behaves like an integer one. For integer inputs, `double` gives exactly the same results, so the change is acceptable only if callers pass whole numbers.
>
> **2.** `x >= 0` is always true, and `x = x - 1` at x = 0 wraps around to 4294967295 (for a 32-bit `unsigned`). The base case is never reached, so the recursion continues until the stack overflows. **Not acceptable.**
>
> **3.** No: `x = x - 1;` assigns to a `const` parameter, which is a compile error. A version that compiles:
>
> ```cpp
> int sum_down(const int x) {
>     if (x >= 0) {
>         int y = (x - 1) + sum_down(x - 1);
>         return y + sum_down(x - 1);
>     }
>     return 1;
> }
> ```

## Question 9 · Work before and after the recursive call

**Reference:** [Homework 2](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02)

> [!QUIZ]
> ```cpp
> void down(int x) {
>     if (x < 0) return;
>     cout << x;
>     down(x - 1);
>     cout << x;
> }
> ```
>
> 1. Write the output of `down(2)`.
> 2. Name the base case, the progress step, and the combining step (the three questions from Homework 2).
> 3. Rewrite `down` without recursion, using two loops.

> [!HINT 1]
> Code before the recursive call runs on the way **down**, code after it on the way **back up**.

> [!HINT 2]
> The first half counts x … 0, the second half counts 0 … x.

> [!ANSWER]
> **1.** **`210012`**
>
> **2.** Base case: `x < 0` (return without printing). Progress: the argument decreases by 1 in each call. Combining step: the second `cout << x` runs after the inner call returns, so the numbers come back in reverse order.
>
> **3.**
>
> ```cpp
> void downLoop(int x) {
>     for (int i = x; i >= 0; --i) cout << i;
>     for (int i = 0; i <= x; ++i) cout << i;
> }
> ```

## Question 10 · Fibonacci: double recursion to a loop

**Reference:** [Homework 2 · Exercise 3](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02)

> [!QUIZ]
> ```cpp
> int fib(int n) {
>     if (n < 2) return n;
>     return fib(n - 1) + fib(n - 2);
> }
> ```
>
> 1. Write `fib(n)` and the total number of calls for n = 0 … 6.
> 2. Unlike `sum_down`, the two recursive calls have **different** arguments, so the trick "compute once and double it" does not apply. Write an iterative version that keeps only the last two values.
> 3. Trace your loop for n = 6.

> [!HINT 1]
> Calls: C(0) = C(1) = 1 and C(n) = 1 + C(n − 1) + C(n − 2).

> [!HINT 2]
> Keep `prev = fib(i - 1)` and `cur = fib(i)`. One step moves to `prev = cur`, `cur = prev + cur` (use a temporary variable).

> [!ANSWER]
> **1.**
>
> | n | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
> | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
> | fib(n) | 0 | 1 | 1 | 2 | 3 | 5 | 8 |
> | calls | 1 | 1 | 3 | 5 | 9 | 15 | 25 |
>
> The number of calls grows exponentially because the same values are computed again and again (fib(4) computes fib(2) twice).
>
> **2.**
>
> ```cpp
> int fibLoop(int n) {
>     if (n < 2) return n;
>     int prev = 0, cur = 1;          // fib(0), fib(1)
>     for (int i = 2; i <= n; ++i) {
>         int next = prev + cur;
>         prev = cur;
>         cur = next;
>     }
>     return cur;
> }
> ```
>
> **3.**
>
> | i | prev | cur |
> | ---: | ---: | ---: |
> | start | 0 | 1 |
> | 2 | 1 | 1 |
> | 3 | 1 | 2 |
> | 4 | 2 | 3 |
> | 5 | 3 | 5 |
> | 6 | 5 | **8** |
>
> As in the Homework, the loop starts at the base case and moves **upward**, so it needs n − 1 steps and O(1) extra space.
