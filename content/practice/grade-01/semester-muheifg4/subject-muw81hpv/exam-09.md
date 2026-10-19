---
title: "C++ Mid Expected Exam 5"
description: "Ten predicted midterm questions plus a five-step permutNumbers memorization drill (before pointers): GCD/LCM and binomial recursion to loops, short-circuit precedence, permutations, sum_down, a static/reference debugging task, 2D arrays, static tracing, loop conversion, and reference errors."
week: 0
order: 7
published: true
---

**Instructions**

- Answer each question with the requested output, code, or explanation.
- Unless stated otherwise, assume a C++17 compiler, `#include <iostream>`, and `using namespace std;`.
- Scope: everything **before pointers** (Homework 1–3, Exercise sessions, and lectures 01–03).
- Questions 4-1 to 4-5 are a **memorization drill** for the Homework 2 `permutNumbers` program. Each step removes more of the code. Repeat them until you can write the whole program from memory.
- These are **expected questions** and may differ from the actual exam. Every program output in the solutions was checked by compiling and running the code.

| Question | Type | Source |
| --- | --- | --- |
| Question 1 | Recursion ↔ loop | Homework 1 · Exercise 4 (GCD, LCM) |
| Question 2 | Precedence · Short-circuit | Homework 1 · Exercise 1 |
| Question 3 | Recursion ↔ loop | Homework 2 · Exercise 1 (binomial coefficient) |
| Question 4 | Output tracing | Homework 2 · Exercise 2 (permutNumbers) |
| Question 4-1 – 4-5 | Fill in the blanks · Write from memory | Homework 2 · Exercise 2 (permutNumbers) |
| Question 5 | Recursion → loop · Concept | Homework 2 · Exercise 3 (sum_down) |
| Question 6 | Debugging (static · reference · precedence) | Homework 3 · Exercise 1a |
| Question 7 | 2D arrays | Lecture 03 · 2D arrays |
| Question 8 | Static tracing with an array | Past midterm Q1–2 |
| Question 9 | while ↔ for · Values after the loop | Past midterm Q7–8 |
| Question 10 | Reference compile errors | Past midterm Q9–10 |

## Question 1 · GCD and LCM: recursion ↔ loops

**Reference:** [Homework 1](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-01) · [Lecture 02 · Recursion to loops](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-02)

> [!QUIZ]
> ```cpp
> int gcd(int a, int b) {
>     if (b == 0) return a;
>     return gcd(b, a % b);
> }
> long long lcm(int a, int b) { return (long long)a / gcd(a, b) * b; }
> ```
>
> 1. Write every call made by `gcd(84, 36)`, the return value, and the total number of calls. How many calls does `gcd(36, 84)` make?
> 2. Rewrite `gcd` with a **while** loop and with a **for** loop.
> 3. Homework 1 swaps `a` and `b` when `a < b`, then computes the remainder. Write that version **recursively**.
> 4. Compute `lcm(84, 36)`. Why is `a / gcd(a, b) * b` safer than `a * b / gcd(a, b)`?

> [!HINT 1]
> Each call replaces (a, b) with (b, a % b) until the second argument is 0.

> [!HINT 2]
> If a < b, then a % b = a, so the first call swaps the values by itself.

> [!ANSWER]
> **1.** `gcd(84,36) → gcd(36,12) → gcd(12,0)`, returns **12**, **3** calls. `gcd(36,84)` makes **4** calls, because its first call becomes `gcd(84,36)`.
>
> **2.**
>
> ```cpp
> int gcdW(int a, int b) { while (b != 0) { int r = a % b; a = b; b = r; } return a; }
> int gcdF(int a, int b) { for (int r; b != 0; a = b, b = r) r = a % b; return a; }
> ```
>
> **3.**
>
> ```cpp
> int gcdR(int a, int b) {
>     if (a < b) { int t = a; a = b; b = t; }
>     int r = a % b;
>     if (r == 0) return b;
>     return gcdR(b, r);
> }
> ```
>
> **4.** **252.** Multiplying first can overflow `int` (signed overflow is undefined behavior). Dividing first keeps the intermediate value small.

## Question 2 · Operator precedence and short-circuit evaluation

**Reference:** [Lecture 01 · Precedence](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-01)

> [!QUIZ]
> ```cpp
> int a = 3, b = 0, c = 5;
> bool r1 = a > 2 || ++b && c--;
> bool r2 = !a == 0 && (b = 4);
> int  r3 = a + b * c % 4 > 7 == 1;
> cout << r1 << r2 << r3 << ' ' << a << b << c << '\n';
>
> int x = 1, y = 1;
> bool p = x-- && y++ || ++x;
> cout << p << ' ' << x << ' ' << y << '\n';
> ```
>
> 1. Add parentheses to show how each expression is grouped, then write the output.
> 2. Explain, using precedence and short-circuit evaluation, why `++b` is never executed in `r1`.

> [!HINT 1]
> Order: unary (`!`, `++`) → arithmetic → relational → equality → `&&` → `||` → assignment. `&&` groups before `||`.

> [!HINT 2]
> `||` does not evaluate its right operand when the left operand is true. Here the right operand is the whole `&&` group.

> [!ANSWER]
> **Grouping**
>
> - `r1`: `(a > 2) || ((++b) && (c--))`
> - `r2`: `((!a) == 0) && (b = 4)`
> - `r3`: `((a + ((b * c) % 4)) > 7) == 1`
> - `p`: `((x--) && (y++)) || (++x)`
>
> ```text
> 110 345
> 1 0 2
> ```
>
> - `r1`: `a > 2` is true, so the entire right group `++b && c--` is skipped. b and c are unchanged.
> - `r2`: `!3` is 0 and `0 == 0` is true, so `b = 4` runs and its value 4 is true.
> - `r3`: 4·5 = 20, 20 % 4 = 0, 3 + 0 = 3, `3 > 7` is 0, `0 == 1` is 0.
> - `p`: `x--` is 1 (x becomes 0), `y++` is 1 (y becomes 2), so the `&&` group is true and `++x` is skipped.

## Question 3 · Binomial coefficient: recursion ↔ loops

**Reference:** [Homework 2](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02)

> [!QUIZ]
> ```cpp
> int C(int n, int r) {
>     if (r == 0 || r == n) return 1;
>     return C(n - 1, r - 1) + C(n - 1, r);
> }
> ```
>
> 1. Compute `C(5, 2)` and the total number of calls.
> 2. Using `C(n, r) = C(n, r - 1) × (n - r + 1) / r`, write a **for** version and a **while** version.
> 3. The Homework 2 formula `fac(n) / (fac(n - r) * fac(r))` with `int` gives 532 for `C(13, 6)` instead of 1716. Why?

> [!HINT 1]
> Count the calls with a small tree, or use calls(n, r) = 1 + calls(n−1, r−1) + calls(n−1, r).

> [!HINT 2]
> Multiply first, then divide. After step i the partial result is a binomial coefficient, so the division is exact.

> [!ANSWER]
> **1.** `C(5, 2)` = **10** with **19** calls. The same subproblems are computed again and again.
>
> **2.**
>
> ```cpp
> long long Cfor(int n, int r) {
>     long long res = 1;
>     for (int i = 1; i <= r; i++) res = res * (n - r + i) / i;
>     return res;
> }
> long long Cwhile(int n, int r) {
>     long long res = 1;
>     int i = 1;
>     while (i <= r) { res = res * (n - r + i) / i; i++; }
>     return res;
> }
> ```
>
> Both return 10 for (5, 2), and `Cfor(30, 15)` = 155117520 without overflow.
>
> **3.** 13! = 6,227,020,800 does not fit in a 32-bit `int`. The answer is small, but an **intermediate value overflows**.

## Question 4 · permutNumbers output

**Reference:** [Homework 2 · Exercise 2](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02)

> [!QUIZ]
> This is the Homework 2 program without the diagnostic messages. `n` in `permute` is the **last index**.
>
> ```cpp
> void permute(int a[], int i, int n) {
>     if (i == n) {
>         print_array(a, n);              // prints a[0..n] and a newline
>     } else {
>         for (int j = i; j <= n; j++) {
>             swap(a[i], a[j]);
>             permute(a, i + 1, n);
>             swap(a[i], a[j]);           // (*)
>         }
>     }
> }
>
> void permutNumbers(int n) {
>     int a[30];
>     for (int i = 1; i <= n; i++) a[i - 1] = i;
>     permute(a, 0, n - 1);
> }
> ```
>
> 1. Write the output of `permutNumbers(3)` in order.
> 2. What is printed if the line marked `// (*)` (the second `swap(a[i], a[j]);`, after the recursive call) is removed? What does that line do?
> 3. Why is the output not in dictionary order (123 132 213 231 312 321)?

> [!HINT 1]
> Position `i` is fixed by swapping each candidate `a[j]` (j = i … n) into it, then positions `i + 1 …` are filled recursively.

> [!HINT 2]
> When the first position is 3, the array becomes {3, 2, 1} after swapping 1 and 3.

> [!ANSWER]
> **1.**
>
> ```text
> 123
> 132
> 213
> 231
> 321
> 312
> ```
>
> **2.** `123 132 312 321 123 132` (one per line). Some permutations repeat and 213, 231 are missing. The line marked `(*)` is the **restore step of backtracking**: it undoes the swap so that every choice starts from the same array.
>
> **3.** The branch with 3 in front starts from `321` (1 and 3 swapped), so `321` is printed before `312`.

## Question 4-1 · Memorize permutNumbers ①: three blanks

**Reference:** [Homework 2 · Exercise 2](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02)

> [!QUIZ]
> Fill in (A)–(C).
>
> ```cpp
> void permute(int a[], int i, int n) {
>     if (____(A)____) {
>         print_array(a, n);
>     } else {
>         for (int j = ____(B)____; j <= n; j++) {
>             swap(a[i], a[j]);
>             permute(a, ____(C)____, n);
>             swap(a[i], a[j]);
>         }
>     }
> }
> ```

> [!HINT 1]
> The recursion stops when every position has been fixed.

> [!HINT 2]
> Position i can receive any element from index i to the last index n.

> [!ANSWER]
> (A) `i == n` · (B) `i` · (C) `i + 1`
>
> If (B) were `0`, already fixed positions would be swapped again and the output would contain repeated and wrong arrangements.

## Question 4-2 · Memorize permutNumbers ②: the helper functions

**Reference:** [Homework 2 · Exercise 2](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02)

> [!QUIZ]
> Fill in (A)–(E).
>
> ```cpp
> void swap(____(A)____) {
>     int temp = x;
>     x = y;
>     y = temp;
> }
>
> void print_array(int a[], int n) {
>     for (int j = 0; ____(B)____; j++)
>         cout << a[j];
>     cout << endl;
> }
>
> void permutNumbers(int n) {
>     int a[30];
>     for (int i = 1; i <= n; i++)
>         ____(C)____;
>     permute(a, ____(D)____, ____(E)____);
> }
> ```
>
> Then answer: what is printed for `permutNumbers(3)` if (B) is written as `j < n`?

> [!HINT 1]
> The swap must change the caller's array elements, not copies.

> [!HINT 2]
> `n` passed to `permute` and `print_array` is the **last index**, not the number of elements.

> [!ANSWER]
> (A) `int& x, int& y` · (B) `j <= n` · (C) `a[i - 1] = i` · (D) `0` · (E) `n - 1`
>
> With `j < n` in `print_array`, the last element is never printed: `12 13 21 23 32 31` (one per line). With value parameters `int x, int y` in (A), nothing is swapped and `123` is printed six times.

## Question 4-3 · Memorize permutNumbers ③: the recursive body

**Reference:** [Homework 2 · Exercise 2](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02)

> [!QUIZ]
> Write the four missing lines (A)–(D) of `permute`.
>
> ```cpp
> void permute(int a[], int i, int n) {
>     if (i == n) {
>         ____(A)____
>     } else {
>         for (int j = i; j <= n; j++) {
>             ____(B)____     // choose
>             ____(C)____     // explore
>             ____(D)____     // restore
>         }
>     }
> }
> ```
>
> Then answer: how many times is `permute` called in total by `permutNumbers(3)`? By `permutNumbers(4)`?

> [!HINT 1]
> Backtracking is **choose → explore → restore**.

> [!HINT 2]
> Count calls level by level: 1 call at i = 0, then 3 at i = 1, then 3·2 at i = 2 for n = 3.

> [!ANSWER]
> (A) `print_array(a, n);` · (B) `swap(a[i], a[j]);` · (C) `permute(a, i + 1, n);` · (D) `swap(a[i], a[j]);`
>
> Calls: n = 3 → 1 + 3 + 6 = **10**; n = 4 → 1 + 4 + 12 + 24 = **41**. Only the last level (6 or 24 calls) prints.

## Question 4-4 · Memorize permutNumbers ④: everything except permute

**Reference:** [Homework 2 · Exercise 2](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02)

> [!QUIZ]
> Only `permute` is given. Write `swap`, `print_array`, `permutNumbers`, and `main` so that the program prints all permutations of 1–3.
>
> ```cpp
> void permute(int a[], int i, int n) {
>     if (i == n) {
>         print_array(a, n);
>     } else {
>         for (int j = i; j <= n; j++) {
>             swap(a[i], a[j]);
>             permute(a, i + 1, n);
>             swap(a[i], a[j]);
>         }
>     }
> }
> ```
>
> Then answer: what does `int d[] = {1, 2, 3}; permute(d, 1, 2);` print?

> [!HINT 1]
> Three things to get right: reference parameters in `swap`, `<=` in `print_array`, and `n - 1` when calling `permute`.

> [!HINT 2]
> Starting at `i = 1` keeps `d[0]` fixed.

> [!ANSWER]
> ```cpp
> void swap(int& x, int& y) {
>     int temp = x;
>     x = y;
>     y = temp;
> }
>
> void print_array(int a[], int n) {
>     for (int j = 0; j <= n; j++)
>         cout << a[j];
>     cout << endl;
> }
>
> void permutNumbers(int n) {
>     int a[30];
>     for (int i = 1; i <= n; i++)
>         a[i - 1] = i;
>     permute(a, 0, n - 1);
> }
>
> int main() {
>     permutNumbers(3);
>     return 0;
> }
> ```
>
> In a real file, `swap` and `print_array` must be declared **before** `permute` (or given prototypes).
>
> `permute(d, 1, 2)` fixes the first element and permutes only the last two: `123` and `132`.

## Question 4-5 · Memorize permutNumbers ⑤: the whole program from memory

**Reference:** [Homework 2 · Exercise 2](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02)

> [!QUIZ]
> Without looking at the previous questions, write the complete program: `swap`, `print_array`, `permute`, `permutNumbers`, and `main` calling `permutNumbers(4)`.
>
> Then answer:
>
> 1. How many lines are printed, and what are the first six lines?
> 2. A student writes the loop in `permute` as `for (int j = i; j < n; j++)`. What does `permutNumbers(3)` print?

> [!HINT 1]
> Write it in this order: swap → print_array → permute → permutNumbers → main. Check the three traps from 4-4.

> [!HINT 2]
> With `j < n`, the last index can never be chosen for any position.

> [!ANSWER]
> ```cpp
> #include <iostream>
> using namespace std;
>
> void swap(int& x, int& y) {
>     int temp = x;
>     x = y;
>     y = temp;
> }
>
> void print_array(int a[], int n) {
>     for (int j = 0; j <= n; j++)
>         cout << a[j];
>     cout << endl;
> }
>
> void permute(int a[], int i, int n) {
>     if (i == n) {
>         print_array(a, n);
>     } else {
>         for (int j = i; j <= n; j++) {
>             swap(a[i], a[j]);
>             permute(a, i + 1, n);
>             swap(a[i], a[j]);
>         }
>     }
> }
>
> void permutNumbers(int n) {
>     int a[30];
>     for (int i = 1; i <= n; i++)
>         a[i - 1] = i;
>     permute(a, 0, n - 1);
> }
>
> int main() {
>     permutNumbers(4);
>     return 0;
> }
> ```
>
> **1.** 4! = **24** lines. The first six are `1234 1243 1324 1342 1432 1423`.
>
> **2.** Only `123` and `213`. With `j < n`, element 3 (the last index) is never swapped into any position.
>
> **Self-check list:** `int&` in swap · `j <= n` in print_array · base case `i == n` · loop starts at `j = i` · `i + 1` in the recursive call · swap again after the call · `a[i - 1] = i` · `permute(a, 0, n - 1)`.

## Question 5 · sum_down: recursion → loops

**Reference:** [Homework 2 · Exercise 3](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02)

> [!QUIZ]
> ```cpp
> int sum_down(int x) {
>     if (x >= 0) { x = x - 1; int y = x + sum_down(x); return y + sum_down(x); }
>     return 1;
> }
> ```
>
> 1. Write the values of `sum_down(0)` … `sum_down(3)` and the number of calls for each.
> 2. Rewrite it with a single recursive call.
> 3. Rewrite it with a **for** loop and a **while** loop.
> 4. What is the smallest x for which the result exceeds 1,000,000?
> 5. Why must the parameter not be changed to `unsigned int`? What goes wrong with `const int x`?

> [!HINT 1]
> Both recursive calls use the same argument, so `sum_down(x) = (x − 1) + 2 · sum_down(x − 1)` with `sum_down(−1) = 1`.

> [!HINT 2]
> For unsigned, `0 − 1` is the largest value and `x >= 0` is always true.

> [!ANSWER]
> **1.** Values 1, 2, 5, 12 · calls 3, 7, 15, 31.
>
> **2.**
>
> ```cpp
> int sum_down(int x) { if (x >= 0) return (x - 1) + 2 * sum_down(x - 1); return 1; }
> ```
>
> **3.**
>
> ```cpp
> int sdFor(int x) { int sum = 1; for (int i = -1; i < x; i++) sum = i + 2 * sum; return sum; }
> int sdWhile(int x) { int sum = 1, i = -1; while (i < x) { sum = i + 2 * sum; i++; } return sum; }
> ```
>
> **4.** **19** (f(18) = 524269, f(19) = 1048556).
>
> **5.** With `unsigned`, x = 0 makes `x - 1` equal 4294967295 and `x >= 0` is always true, so the recursion never ends. With `const int x`, the line `x = x - 1;` modifies a const parameter, which is a compile error.

## Question 6 · Debugging a letter counter (static · reference · precedence)

**Reference:** [Homework 3](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-03) · [Lecture 02 · static](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-02)

> [!QUIZ]
> **Requirement:** counts must **accumulate** over several calls, and `total` in `main` must hold the number of letters counted so far.
>
> ```cpp
> void count_chars(char text[], int total) {
>     int counter[26];
>     int i = 0;
>     char ch;
>     while (ch = text[i] != '\0') {
>         if (ch >= 'A' && ch <= 'Z') counter[ch - 'A']++;
>         if (ch >= 'a' && ch <= 'z') counter[ch - 'A']++;
>         total++;
>         i++;
>     }
>     for (i = 0; i <= 26; i++)
>         if (counter[i]) cout << char('A' + i) << counter[i] << ' ';
>     cout << "| total " << total << '\n';
> }
>
> int main() {
>     char t1[] = "Hi", t2[] = "hey!";
>     int total = 0;
>     count_chars(t1, total);
>     count_chars(t2, total);
>     cout << "main total " << total << '\n';
> }
> ```
>
> 1. Find and fix the six bugs.
> 2. Write the output after fixing.
> 3. If only `static` is removed (with `int counter[26] = {0};`), what is the second line? If only `int& total` is changed back to `int total`, what is printed?

> [!HINT 1]
> `!=` has higher precedence than `=`. Local arrays start with garbage and disappear after each call.

> [!HINT 2]
> A value parameter is a copy. `'!'` is not a letter.

> [!ANSWER]
> **1.**
>
> | Bug | Fix |
> | --- | --- |
> | `int counter[26];` is uninitialized and recreated every call | `static int counter[26];` (static starts at 0) |
> | `ch = text[i] != '\0'` stores 0 or 1 in ch | `(ch = text[i]) != '\0'` |
> | lowercase uses `ch - 'A'` (out of range) | `ch - 'a'` |
> | `total++` also counts `'!'` | increment only for letters |
> | `i <= 26` reads `counter[26]` | `i < 26` |
> | `int total` is a copy | `int& total` |
>
> **2.**
>
> ```text
> H1 I1 | total 2
> E1 H2 I1 Y1 | total 5
> main total 5
> ```
>
> **3.** Without `static`: the second line is `E1 H1 Y1 | total 5` (only this call's letters). With `int total`: the second line is `E1 H2 I1 Y1 | total 3` and the last line is `main total 0`.

## Question 7 · Two-dimensional arrays

**Reference:** [Lecture 03 · 2D arrays](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-03)

> [!QUIZ]
> ```cpp
> int a[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
> for (int i = 0; i < 3; i++)
>     for (int j = i + 1; j < 3; j++) {
>         int t = a[i][j]; a[i][j] = a[j][i]; a[j][i] = t;
>     }
> ```
>
> 1. Write the array after the loop. What happens if the inner loop starts at `j = 0`?
> 2. For `int c[2][3] = {1, 2, 3, 4};`, write `c[1][0]` and `c[1][2]`. Why is the parameter `int m[][]` an error?
> 3. Write `void rowMax(int m[][3], int rows, int out[])` that stores each row's maximum in `out`, and give the result for `{{3, 9, 1}, {-2, -7, -5}, {4, 4, 0}}`.
> 4. For the same array `m`, what is `s`?
>
> ```cpp
> int s = 0;
> for (int i = 0; i < 3; i++)
>     for (int j = 0; j < 3; j++) {
>         if (i == j) continue;
>         if (m[i][j] < 0) break;
>         s += m[i][j];
>     }
> ```

> [!HINT 1]
> Starting at `j = i + 1` visits each pair above the diagonal exactly once.

> [!HINT 2]
> `break` ends only the inner loop. Elements are stored row by row.

> [!ANSWER]
> **1.** Transposed: `1 4 7 / 2 5 8 / 3 6 9`. Starting at `j = 0` swaps every pair **twice**, so the array is unchanged.
>
> **2.** `c[1][0]` = **4**, `c[1][2]` = **0** (filled row by row, the rest is 0). The compiler needs the **column size** to find where `m[i]` starts, so only the first dimension may be empty: `int m[][3]`.
>
> **3.** Result `9 -2 4`. Start the maximum at `m[i][0]`, not 0, or the all-negative row is wrong.
>
> ```cpp
> void rowMax(int m[][3], int rows, int out[]) {
>     for (int i = 0; i < rows; i++) {
>         out[i] = m[i][0];
>         for (int j = 1; j < 3; j++)
>             if (m[i][j] > out[i]) out[i] = m[i][j];
>     }
> }
> ```
>
> **4.** **18** (9 + 1 + 4 + 4). Row 1 stops at −2; rows 0 and 2 skip only their diagonal element.

## Question 8 · Tracing a static local variable with an array

**Reference:** [C++ midterm past exam](/practice/grade-01/semester-muheifg4/subject-muw81hpv/exam-01) · [Lecture 02 · static](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-02)

> [!QUIZ]
> ```cpp
> int pick(int a[], int k) {
>     static int turn = 0;
>     turn++;
>     a[k] += turn;
>     if (turn % 3 == 0) return k;     // stay on multiples of 3
>     return k + 1;
> }
>
> int main() {
>     int a[4] = {0, 0, 0, 0};
>     int i = 0;
>     while (i < 4) i = pick(a, i);
>     for (int v : a) cout << v << ' ';
> }
> ```
>
> 1. Trace each call (start k, turn, changed element, returned k). Write the final array and the number of calls.
> 2. `main` then repeats the same loop with a **new** array `b[4] = {0, 0, 0, 0}`. Write `b` and the number of calls.
> 3. If `static` is removed, write `a` and the number of calls.

> [!HINT 1]
> `= 0` in a static declaration runs only on the first call.

> [!HINT 2]
> In part 2, turn continues from where part 1 stopped.

> [!ANSWER]
> **1.** `1 2 7 5`, **5** calls.
>
> | Call | start k | turn | changed | returned k |
> | ---: | ---: | ---: | --- | ---: |
> | 1 | 0 | 1 | a[0] = 1 | 1 |
> | 2 | 1 | 2 | a[1] = 2 | 2 |
> | 3 | 2 | 3 | a[2] = 3 | **2** (stay) |
> | 4 | 2 | 4 | a[2] = 7 | 3 |
> | 5 | 3 | 5 | a[3] = 5 | 4 |
>
> **2.** `13 8 19 11`, **6** calls. turn continues from 6, so the stays happen at turn 6 and 9.
>
> **3.** `1 1 1 1`, **4** calls. turn is 1 every time and never a multiple of 3.

## Question 9 · while ↔ for and values after the loop

**Reference:** [C++ midterm past exam](/practice/grade-01/semester-muheifg4/subject-muw81hpv/exam-01) · [Lecture 01 · Loops](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-01)

> [!QUIZ]
> ```cpp
> // (A)
> int sum = 0, j = 1;
> while (j < 20) { sum += j; j *= 3; }
>
> // (B)
> int n = 0, k = 10;
> do { n++; k -= 4; } while (k > 0);
>
> // (C)
> int s = 0;
> for (int i = 0; i < 6; i++) {
>     if (i % 2 == 0) continue;
>     s += i;
> }
> ```
>
> 1. Rewrite (A) as a `for` loop. Both variables must still be usable after the loop. Write `sum` and `j` after the loop.
> 2. Write `n` and `k` after (B). Is `while (k > 0) { n++; k -= 4; }` always equivalent? Compare both when k starts at −1.
> 3. Rewrite (C) as a `while` loop. What goes wrong with this version?
>
> ```cpp
> int i = 0;
> while (i < 6) { if (i % 2 == 0) continue; s += i; i++; }
> ```

> [!HINT 1]
> A variable declared inside `for (…)` disappears after the loop.

> [!HINT 2]
> `continue` in a `for` loop goes to the update; in a `while` loop it goes straight to the condition.

> [!ANSWER]
> **1.** `sum = 13`, `j = 27` (j: 1 → 3 → 9 → 27).
>
> ```cpp
> int sum = 0, j = 1;
> for (; j < 20; j *= 3) sum += j;
> ```
>
> **2.** `n = 3`, `k = -2`. Not always equivalent: starting at k = −1, the do-while runs once (`n = 1, k = -5`), but the while loop does not run (`n = 0, k = -1`).
>
> **3.** The given version loops forever at i = 0 because `continue` skips `i++`. Correct version (s = 9, i = 6 at the end):
>
> ```cpp
> int s = 0, i = 0;
> while (i < 6) {
>     if (i % 2 == 0) { i++; continue; }
>     s += i;
>     i++;
> }
> ```

## Question 10 · Reference declarations and reference parameters

**Reference:** [C++ midterm past exam](/practice/grade-01/semester-muheifg4/subject-muw81hpv/exam-01) · [Lecture 03 · References](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-03)

> [!QUIZ]
> ```cpp
> void f(int& a, const int& b, int c) { a += b; c += b; }
>
> int main() {
>     int x = 1, y = 2;
>     const int z = 3;
>     int& r1 = x;           // (1)
>     int& r2;               // (2)
>     const int& r3 = 10;    // (3)
>     int& r4 = z;           // (4)
>     f(x, y, y);            // (5)
>     f(r1, z, 5);           // (6)
>     f(5, x, y);            // (7)
>     f(x, x + y, z);        // (8)
>     r1 = y;                // (9)
>     cout << x << y << z;
> }
> ```
>
> 1. Which lines are compile errors? Why?
> 2. After removing the error lines, write x after (5), (6), (8), (9) and the final output.
> 3. Does line (9) make `r1` refer to `y`?

> [!HINT 1]
> A non-const reference must be initialized with a modifiable variable. A const reference can bind to literals and expressions.

> [!HINT 2]
> The third parameter `c` is a copy, so changing it affects nothing outside.

> [!ANSWER]
> **1.** **(2), (4), (7).** (2) a reference must be initialized; (4) a const variable cannot bind to `int&`; (7) a literal cannot bind to `int&`. (3), (6) and (8) are fine because `const int&` accepts literals, const variables and expressions.
>
> **2.**
>
> | Line | Work | x |
> | --- | --- | ---: |
> | (5) | x += 2 | 3 |
> | (6) | r1 is x, x += 3 | 6 |
> | (8) | b = 6 + 2 = 8, x += 8 | 14 |
> | (9) | x = y | 2 |
>
> Final output: **`223`**.
>
> **3.** No. A reference cannot be reseated. `r1 = y` assigns the value of y to x.
