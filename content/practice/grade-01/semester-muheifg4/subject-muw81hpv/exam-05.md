---
title: "C++ Mid Expected Exam 3"
description: "Ten expected midterm questions that mix the Exercise sessions with Homework 1–3 (before pointers): conditions, loops, GCD, binomial coefficients, permutations, recursion to loops, character counting, histograms, heap sort, and greedy reverse operations."
week: 0
order: 5
published: true
---

**Instructions**

- Answer each question with the requested output, code, or explanation.
- Unless stated otherwise, assume a C++17 compiler and that `#include <iostream>` is present.
- Scope: everything **before pointers** (Exercise 02–05 and function overloading from Exercise 06).
- Write your answer first, then open the hints one at a time, and the solution last.
- These are **expected questions** adapted from the Exercise sessions (Week 02–06) and Homework 1–3. They may differ from the actual exam. Every program output in the solutions was checked by compiling and running the code.

| Question | Type | Source |
| --- | --- | --- |
| Question 1 | Concept · Output | Homework 1 · Exercise 1 + Exercise 03 · Boolean operators |
| Question 2 | Debugging | Homework 1 · Exercise 3 + Exercise 03 · do while |
| Question 3 | Tracing · Code writing | Homework 1 · Exercise 4 + Exercise 03 · Quiz 1 |
| Question 4 | Code writing · Concept | Homework 2 · Exercise 1 + Exercise 02 · Overflow |
| Question 5 | Output tracing | Homework 2 · Exercise 2 + Exercise 05 · Arrays as parameters |
| Question 6 | Tracing · Code writing | Homework 2 · Exercise 3 + Exercise 04 · Recursion to iteration |
| Question 7 | Debugging | Homework 3 · Exercise 1a + Exercise 05 · Character arrays |
| Question 8 | Code writing · Output | Homework 3 · Exercise 1b |
| Question 9 | Tracing | Exercise 05 · Quiz 2 and solution |
| Question 10 | Tracing · Concept | Exercise 04 · Quiz 2 and solution |

## Question 1 · Evaluating conditions and short-circuit evaluation

**Reference:** [Homework 1](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-01) · [Exercise 03](/lectures/grade-01/semester-muheifg4/subject-cpp-exercise/lecture-03)

> [!QUIZ]
> Given the variables below, write the value (1 for true, 0 for false) of each condition.
>
> ```cpp
> int x = 0, y = 1, num = 5, power = 1024, item = 7, Sens = 5, DAY = 3;
> const int MIN = 3, MAX = 1024;
> ```
>
> | | Condition |
> | --- | --- |
> | a | `(x > y) && !y` |
> | b | `(item > MIN) \|\| (DAY != 3)` |
> | c | `((num * 128) < power) && y` |
> | d | `(!(power != MAX)) && (Sens == num)` |
> | e | `((y + x) < num) \|\| (DAY == 2)` |
> | f | `(Sens * (!y)) != 0` |
> | g | `(!x \|\| y) && (!y \|\| x)` |
>
> Then write the output of:
>
> ```cpp
> int k = 0;
> bool r = (x != 0) && (++k > 0);
> bool s = (y != 0) || (++k > 0);
> std::cout << r << ' ' << s << ' ' << k << '\n';
> ```

> [!HINT 1]
> Any nonzero integer converts to true, zero to false. `!y` is 0 when `y` is 1.

> [!HINT 2]
> `&&` stops as soon as the left side is false, and `||` stops as soon as the left side is true. The right side is then **not evaluated at all**.

> [!ANSWER]
> | | Work | Value |
> | --- | --- | ---: |
> | a | `0 > 1` is false | **0** |
> | b | `7 > 3` is true | **1** |
> | c | `640 < 1024` is true, `y` is 1 | **1** |
> | d | `!(1024 != 1024)` is true, `5 == 5` | **1** |
> | e | `1 < 5` is true | **1** |
> | f | `5 * 0 = 0`, `0 != 0` is false | **0** |
> | g | `(1 \|\| 1)` is true, `(0 \|\| 0)` is false | **0** |
>
> Second part: **`0 1 0`**. In `r`, `x != 0` is false, so `++k` never runs. In `s`, `y != 0` is true, so `++k` never runs either. `k` stays 0.

## Question 2 · Debugging a cumulative sum loop

**Reference:** [Homework 1](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-01) · [Exercise 03](/lectures/grade-01/semester-muheifg4/subject-cpp-exercise/lecture-03)

> [!QUIZ]
> The program should print the running sum after each number and stop when the user enters 0. It compiles but is wrong.
>
> ```cpp
> #include <iostream>
> int main() {
>     int sum = 0, value = 0;
>     do {
>         std::cin >> value;
>         sum =+ value;
>         std::cout << "Sum: " << sum << '\n';
>     } while (value = 0);
>     return 0;
> }
> ```
>
> 1. Find the two bugs and fix them.
> 2. For the input `4 3 0`, what does the buggy version print, and what does the fixed version print?

> [!HINT 1]
> `=+` is not a compound operator. Read it as `=` followed by unary `+`.

> [!HINT 2]
> `value = 0` is an assignment. What is the value of an assignment expression, and is it true or false?

> [!ANSWER]
> **1.**
> - `sum =+ value;` assigns `+value` to `sum`. Fix: `sum += value;`
> - `while (value = 0)` assigns 0 and the condition is always false, so the loop runs only once. Fix: `while (value != 0)`
>
> **2.** Buggy version: `Sum: 4` (one line, then it stops). Fixed version:
>
> ```text
> Sum: 4
> Sum: 7
> Sum: 7
> ```
>
> A `do while` loop fits this task because the program must read at least one number before checking it.

## Question 3 · Greatest common divisor: loop and recursion

**Reference:** [Homework 1](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-01) · [Exercise 03](/lectures/grade-01/semester-muheifg4/subject-cpp-exercise/lecture-03)

> [!QUIZ]
> The Euclidean algorithm: if a < b, swap them; divide a by b to get the remainder r; if r = 0, b is the GCD; otherwise replace a by b and b by r and repeat.
>
> 1. Trace the algorithm for `a = 48, b = 18`. List each (a, b, r).
> 2. Write a **recursive** function `int gcd(int a, int b)` in one line, and trace `gcd(17, 13)`.
> 3. To compute the least common multiple of `a = 1000000000` and `b = 999999999`, why is `a / gcd(a, b) * b` (with `long long`) better than `a * b / gcd(a, b)`?

> [!HINT 1]
> 48 % 18 = 12. Keep replacing (a, b) with (b, r) until the remainder is 0.

> [!HINT 2]
> The recursive version stops when the second argument is 0: gcd(a, 0) = a.

> [!ANSWER]
> **1.**
>
> | a | b | r |
> | ---: | ---: | ---: |
> | 48 | 18 | 12 |
> | 18 | 12 | 6 |
> | 12 | 6 | 0 → GCD = **6** |
>
> **2.**
>
> ```cpp
> int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }
> ```
>
> `gcd(17, 13) → gcd(13, 4) → gcd(4, 1) → gcd(1, 0) = 1`. The swap step is not needed: if a < b, the first call just swaps them (`gcd(13, 17) → gcd(17, 13)`).
>
> **3.** `a * b` is about 10¹⁸ before dividing, which is near the `long long` limit and overflows for larger inputs. Dividing first keeps the intermediate value small. Here the GCD is 1, so the LCM is **999999999000000000**.

## Question 4 · Binomial coefficient without overflow

**Reference:** [Homework 2](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02) · [Exercise 02](/lectures/grade-01/semester-muheifg4/subject-cpp-exercise/lecture-02)

> [!QUIZ]
> C(n, r) = n! / ((n − r)! · r!).
>
> 1. A student computes `n!` in an `int` and gets `1932053504` for 13!. What went wrong, and why is computing the three factorials a bad idea even with `long long` for C(30, 15)?
> 2. Write `long long binomial(int n, int r)` using the multiplicative loop `result = result * (n - r + i) / i` for i = 1 … r. Trace it for C(6, 2).
> 3. The recursive definition `C(n, r) = C(n − 1, r − 1) + C(n − 1, r)` with `C(n, 0) = C(n, n) = 1` is correct. How many calls does it make for C(5, 2), and why is it slow for large n?

> [!HINT 1]
> 13! = 6,227,020,800 is larger than the `int` maximum of about 2.1 × 10⁹. 30! has 33 digits.

> [!HINT 2]
> In the loop, after step i, `result` equals C(n − r + i, i), which is always an integer, so the division is exact.

> [!ANSWER]
> **1.** 13! does not fit in a 32-bit `int`, so signed overflow occurs (undefined behavior; here it printed a wrong value). 30! ≈ 2.65 × 10³² also overflows `long long`, even though C(30, 15) = 155117520 is small. The intermediate values are the problem, not the answer.
>
> **2.**
>
> ```cpp
> long long binomial(int n, int r) {
>     if (r > n - r) r = n - r;   // use the smaller r
>     long long result = 1;
>     for (int i = 1; i <= r; ++i)
>         result = result * (n - r + i) / i;
>     return result;
> }
> ```
>
> C(6, 2): i = 1 → 1 · 5 / 1 = 5; i = 2 → 5 · 6 / 2 = **15**. Multiply first, then divide, so each step stays an integer.
>
> **3.** C(5, 2) = 10 with **19 calls**. The same subproblems are recomputed many times, so the number of calls grows exponentially, while the loop needs only r steps.

## Question 5 · Permutations with backtracking

**Reference:** [Homework 2](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02) · [Exercise 05](/lectures/grade-01/semester-muheifg4/subject-cpp-exercise/lecture-05)

> [!QUIZ]
> 1. Write the output in order.
>
> ```cpp
> #include <iostream>
> #include <utility>
> void permute(int a[], int k, int n) {
>     if (k == n) {
>         for (int i = 0; i < n; ++i) std::cout << a[i];
>         std::cout << ' ';
>         return;
>     }
>     for (int i = k; i < n; ++i) {
>         std::swap(a[k], a[i]);
>         permute(a, k + 1, n);
>         std::swap(a[k], a[i]);
>     }
> }
> int main() {
>     int a[] = {1, 2, 3};
>     permute(a, 0, 3);
>     return 0;
> }
> ```
>
> 2. How many permutations are printed for `n = 4`?
> 3. What is the purpose of the **second** `std::swap`? What would the output be without it?

> [!HINT 1]
> Position `k` is fixed by swapping each candidate `a[i]` into it, then positions `k + 1 …` are filled recursively.

> [!HINT 2]
> The array is shared by all calls (no copy). The second swap restores the array before the next candidate is tried.

> [!ANSWER]
> **1.**
>
> ```text
> 123 132 213 231 321 312 
> ```
>
> With 3 in front, the swap order produces `321` before `312`.
>
> **2.** 4! = **24**.
>
> **3.** It **undoes** the first swap (backtracking) so each loop iteration starts from the same array. Without it the array keeps changing and the output is `123 132 312 321 123 132` — some permutations repeat and `213`, `231` are missing.

## Question 6 · Double recursion to a single loop

**Reference:** [Homework 2](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02) · [Exercise 04](/lectures/grade-01/semester-muheifg4/subject-cpp-exercise/lecture-04)

> [!QUIZ]
>
> ```cpp
> int g(int x) {
>     if (x <= 0) return 2;
>     int t = g(x - 1);
>     return t + g(x - 1) - x;
> }
> ```
>
> 1. Compute `g(3)` and count how many times `g` is called in total.
> 2. Rewrite `g` with a single recursive call, then as a loop. What closed formula does `g(x)` follow for x ≥ 0?
> 3. In Homework 2, changing `sum_down` to take `unsigned int` was a serious problem. Is changing `g` to `unsigned g(unsigned x)` a problem? Explain.

> [!HINT 1]
> Both recursive calls use the same argument, so `g(x) = 2 · g(x − 1) − x`. Build up from g(0) = 2.

> [!HINT 2]
> If C(x) is the number of calls, C(0) = 1 and C(x) = 1 + 2 · C(x − 1).

> [!ANSWER]
> **1.** g(0) = 2, g(1) = 2·2 − 1 = 3, g(2) = 2·3 − 2 = 4, g(3) = 2·4 − 3 = **5**. Calls: C(0) = 1, C(1) = 3, C(2) = 7, C(3) = **15** (= 2^(x+1) − 1).
>
> **2.**
>
> ```cpp
> int g(int x) {                 // one recursive call
>     if (x <= 0) return 2;
>     return 2 * g(x - 1) - x;
> }
>
> int gLoop(int x) {             // loop
>     int value = 2;
>     for (int i = 1; i <= x; ++i) value = 2 * value - i;
>     return value;
> }
> ```
>
> The values are 2, 3, 4, 5, …, so **g(x) = x + 2**. The loop is O(x) instead of O(2^x).
>
> **3.** Not a problem here. With `unsigned`, `x <= 0` means `x == 0`, and `x - 1` is only computed when x ≥ 1, so it never wraps around. In `sum_down`, the test was `x >= 0` (always true for unsigned) and `x - 1` was computed at x = 0, which wrapped to a huge value.

## Question 7 · Debugging a character counter

**Reference:** [Homework 3](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-03) · [Exercise 05](/lectures/grade-01/semester-muheifg4/subject-cpp-exercise/lecture-05)

> [!QUIZ]
> `count_chars` should print how many times each letter A–Z appears, counting uppercase and lowercase together. Find **three** bugs and fix them.
>
> ```cpp
> void count_chars(char text[]) {
>     int count[26];
>     for (int i = 0; text[i] != '\0'; ++i) {
>         char c = text[i];
>         if (c >= 'a' && c <= 'z') count[c - 'A']++;
>         else if (c >= 'A' && c <= 'Z') count[c - 'A']++;
>     }
>     for (int i = 0; i <= 26; ++i)
>         std::cout << char('A' + i) << ", " << char('a' + i) << " : " << count[i] << '\n';
> }
> ```
>
> After fixing it, which lines show a count greater than 0 for `char text[] = "Hello, World";`?

> [!HINT 1]
> Local arrays are not initialized automatically. Check what index `'h' - 'A'` produces.

> [!HINT 2]
> Valid indices of `count[26]` are 0–25. How does the first loop know where the text ends?

> [!ANSWER]
> | Bug | Fix |
> | --- | --- |
> | `int count[26];` holds garbage values | `int count[26] = {0};` |
> | Lowercase uses `c - 'A'` (e.g. `'h' - 'A'` = 39, out of range) | `count[c - 'a']++` |
> | `i <= 26` reads `count[26]`, one past the end | `i < 26` |
>
> The loop stops at the terminating `'\0'`, so the length does not need to be passed.
>
> Nonzero counts for "Hello, World": `D, d : 1`, `E, e : 1`, `H, h : 1`, `L, l : 3`, `O, o : 2`, `R, r : 1`, `W, w : 1`. The comma and space are not letters and are skipped.

## Question 8 · Printing a vertical histogram

**Reference:** [Homework 3](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-03)

> [!QUIZ]
> The code counts the letters a–e. Write the remaining code so that it prints a vertical bar chart: one row per height from the tallest bar down to 1, a `*` where the letter's count reaches that height, a space otherwise, and the label row `ABCDE` at the bottom. End each bar row with `|` so trailing spaces are visible.
>
> ```cpp
> char text[] = "abacabad";
> int count[5] = {0};
> for (int i = 0; text[i] != '\0'; ++i)
>     if (text[i] >= 'a' && text[i] <= 'e') count[text[i] - 'a']++;
> ```
>
> Then write the exact output.

> [!HINT 1]
> First find the largest count. That is the number of rows.

> [!HINT 2]
> For height h from the maximum down to 1, column i gets `*` if `count[i] >= h`.

> [!ANSWER]
> ```cpp
> int maxCount = 0;
> for (int i = 0; i < 5; ++i)
>     if (count[i] > maxCount) maxCount = count[i];
> for (int h = maxCount; h >= 1; --h) {
>     for (int i = 0; i < 5; ++i) std::cout << (count[i] >= h ? '*' : ' ');
>     std::cout << "|\n";
> }
> std::cout << "ABCDE\n";
> ```
>
> Counts: a = 4, b = 2, c = 1, d = 1, e = 0.
>
> ```text
> *    |
> *    |
> **   |
> **** |
> ABCDE
> ```
>
> The key idea is printing **row by row from the top**, because the console cannot print a column at a time.

## Question 9 · Heap sort: building the heap and the first extraction

**Reference:** [Exercise 05](/lectures/grade-01/semester-muheifg4/subject-cpp-exercise/lecture-05)

> [!QUIZ]
> For `a = {3, 9, 2, 1, 4, 5}` (n = 6, zero-based):
>
> ```cpp
> void heapify(std::vector<int>& a, int begin, int end, int root) {
>     while (true) {
>         int largest = root;
>         int left = begin + 2 * (root - begin) + 1;
>         int right = left + 1;
>         if (left < end && a[left] > a[largest]) largest = left;
>         if (right < end && a[right] > a[largest]) largest = right;
>         if (largest == root) return;
>         std::swap(a[root], a[largest]);
>         root = largest;
>     }
> }
> ```
>
> 1. Which indices does the build-heap loop call `heapify` on, and in what order? Write the array after each call.
> 2. Perform the first extraction step (swap the root with the last element of the heap, shrink the heap, heapify the root). Write the array.
> 3. Why does build-heap start at index `n / 2 - 1` instead of 0?

> [!HINT 1]
> Children of index i are 2i + 1 and 2i + 2. The last non-leaf index for n = 6 is 2.

> [!HINT 2]
> In heapify, compare **both** children and swap with the larger one; keep going down until no swap is needed.

> [!ANSWER]
> **1.** Indices 2, 1, 0 in that order.
>
> | Call | What happens | Array |
> | --- | --- | --- |
> | heapify(2) | 2 < child 5 → swap | 3 9 5 1 4 2 |
> | heapify(1) | 9 ≥ children 1, 4 → stop | 3 9 5 1 4 2 |
> | heapify(0) | 3 < 9 → swap; then 3 < 4 → swap | **9 4 5 1 3 2** |
>
> **2.** Swap 9 and 2 → `2 4 5 1 3 | 9`; heapify the root in the first 5: 2 < 5 → swap → `5 4 2 1 3 | 9`. Index 2 has no children inside the heap, so it stops: **`5 4 2 1 3 9`**.
>
> **3.** Indices after `n / 2 - 1` are leaves, and a single node is already a heap. Heapify also needs both child subtrees to be heaps already, so it must work from the bottom up.

## Question 10 · Minimum transformations by working backward

**Reference:** [Exercise 04](/lectures/grade-01/semester-muheifg4/subject-cpp-exercise/lecture-04)

> [!QUIZ]
> Start from a positive integer a. One operation either doubles the value or subtracts 1. The function returns the minimum number of operations to reach b.
>
> ```cpp
> long long minOperations(long long a, long long b) {
>     long long steps = 0;
>     while (b > a) {
>         if (b % 2 != 0) ++b;
>         else b /= 2;
>         ++steps;
>     }
>     return steps + a - b;
> }
> ```
>
> 1. Trace `minOperations(5, 17)` and give the result.
> 2. Give the results for `(3, 10)` and `(10, 3)`.
> 3. Why does the solution work **backward from b**, and why is halving immediately optimal when b is even and larger than a?

> [!HINT 1]
> Backward, the operations reverse: doubling becomes halving (only for even values), subtracting 1 becomes adding 1.

> [!HINT 2]
> Once b ≤ a, the only useful forward move is subtracting 1, which takes a − b steps.

> [!ANSWER]
> **1.** 17 is odd → 18 (1), 18 → 9 (2), 9 is odd → 10 (3), 10 → 5 (4). Now b = 5 = a, so the result is 4 + 0 = **4** (forward: 5 → 10 → 9 → 18 → 17).
>
> **2.** `(3, 10)`: 10 → 5 → 6 → 3, **3** steps. `(10, 3)`: b is already smaller, so 10 − 3 = **7** steps.
>
> **3.** Going backward, each value has at most one sensible move (an odd value can only add 1; an even value above a should halve), so the choice is greedy and unique. Adding 1 to an even value would require an even number of extra increments before halving, which never costs less than halving first (t + 1 ≤ 2t + 1). The loop runs O(log b) times.
