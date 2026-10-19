---
title: "C++ Mid Expected Exam 2"
description: "Ten expected midterm questions built only from Homework 1 (before pointers): evaluating conditions, short-circuit evaluation, the maximum of several values, sentinel loops, references, and the Euclidean algorithm."
week: 0
order: 4
published: true
---

**Instructions**

- Answer each question with the requested output, code, or explanation.
- Unless stated otherwise, assume a C++17 compiler, `#include <iostream>`, and `using namespace std;`.
- Scope: **Homework 1 only** (conditions, selection, loops, the Euclidean algorithm). Nothing after pointers is used.
- Write your answer first, then open the hints one at a time, and the solution last.
- These are **expected questions** adapted from Homework 1 and may differ from the actual exam. Every program output in the solutions was checked by compiling and running the code.

| Question | Type | Source |
| --- | --- | --- |
| Question 1 | Concept · Output | Homework 1 · Exercise 1 |
| Question 2 | Output tracing | Homework 1 · Exercise 1 (short-circuit evaluation) |
| Question 3 | Debugging | Homework 1 · Exercise 2 |
| Question 4 | Code writing | Homework 1 · Exercise 2 |
| Question 5 | Output tracing | Homework 1 · Exercise 3 |
| Question 6 | Output tracing · Comparison | Homework 1 · Exercise 3 |
| Question 7 | Tracing | Homework 1 · Exercise 4 |
| Question 8 | Output tracing · Concept | Homework 1 · Exercise 4 (`swap` with references) |
| Question 9 | Debugging | Homework 1 · Exercise 4 |
| Question 10 | Code writing | Homework 1 · Exercises 3 + 4 |

## Question 1 · Conditions with mixed types

**Reference:** [Homework 1 · Exercise 1](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-01)

> [!QUIZ]
> The variables are the same as in Homework 1. Write the value (1 for true, 0 for false) of each condition.
>
> ```cpp
> int x = -5;  int power = 1024;  int y = 7;
> double item = 1.5;  double MIN = -12.0;  char DAY = 'M';
> int num = 12;  int MAX = 1024;  int Sens = 12;
> ```
>
> | | Condition |
> | --- | --- |
> | a | `!x == 0` |
> | b | `x < y < num` |
> | c | `y < x < num` |
> | d | `DAY == 'M' && item * 8 > MIN * -1` |
> | e | `!(x > 0) && (Sens % 5 == 2)` |
> | f | `x % 3 == -2` |
> | g | `(DAY + 1 == 'N') && !(item - 1.5)` |

> [!HINT 1]
> `!` binds tighter than `==` and `<`. Comparisons with the same precedence are evaluated left to right, and each one produces 0 or 1.

> [!HINT 2]
> In C++, integer division truncates toward zero, so the remainder has the sign of the left operand. A `char` is an integer code, and `'M' + 1` is the code of `'N'`.

> [!ANSWER]
> | | Work | Value |
> | --- | --- | ---: |
> | a | `!x` is `!(-5)` = 0, then `0 == 0` | **1** |
> | b | `(x < y)` = 1, then `1 < 12` | **1** |
> | c | `(y < x)` = 0, then `0 < 12` | **1** |
> | d | `1.5 * 8 = 12.0` and `-12.0 * -1 = 12.0`, so `12.0 > 12.0` is false | **0** |
> | e | `!(-5 > 0)` = 1, `12 % 5 = 2` | **1** |
> | f | `-5 % 3 = -2` (truncation toward zero) | **1** |
> | g | `'M' + 1 == 'N'` is true, `item - 1.5 = 0.0` and `!0.0` is true | **1** |
>
> b and c are the trap: `x < y < num` does **not** mean "y is between x and num". It compares the bool result of `x < y` with `num`, so c is true even though 7 < −5 is false. Write `x < y && y < num` instead.

## Question 2 · Short-circuit evaluation with side effects

**Reference:** [Homework 1 · Exercise 1](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-01)

> [!QUIZ]
> 1. Write the output.
>
> ```cpp
> int main() {
>     int a = 0, b = 5, c = 0;
>     if (a != 0 && b / a > 1) c += 1;
>     if (a == 0 || ++b > 5) c += 10;
>     if (b-- > 4 && c++) c += 100;
>     cout << a << ' ' << b << ' ' << c << '\n';
>     return 0;
> }
> ```
>
> 2. What happens if the first condition is written as `b / a > 1 && a != 0` instead?

> [!HINT 1]
> `&&` does not evaluate the right side when the left side is false. `||` does not evaluate the right side when the left side is true.

> [!HINT 2]
> `b--` and `c++` use the **old** value in the comparison, then change the variable.

> [!ANSWER]
> **1.** **`0 4 111`**
>
> | Line | What is evaluated | a | b | c |
> | --- | --- | ---: | ---: | ---: |
> | 1st `if` | `a != 0` is false → `b / a` is skipped | 0 | 5 | 0 |
> | 2nd `if` | `a == 0` is true → `++b` is skipped, `c += 10` | 0 | 5 | 10 |
> | 3rd `if` | `b-- > 4`: 5 > 4 is true, b = 4; `c++`: 10 is true, c = 11; then `c += 100` | 0 | 4 | 111 |
>
> **2.** Now `b / a` is evaluated first with `a = 0`: integer division by zero. This is undefined behavior and usually crashes the program. The order of operands matters: put the **guard** (`a != 0`) on the left.

## Question 3 · Debugging the maximum of three values

**Reference:** [Homework 1 · Exercise 2](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-01)

> [!QUIZ]
> ```cpp
> int max3(int a, int b, int c) {
>     if (a > b && a > c) return a;
>     else if (b > a && b > c) return b;
>     else return c;
> }
> ```
>
> 1. Write the return value for `max3(5, 5, 3)`, `max3(3, 5, 5)`, `max3(4, 4, 4)`, `max3(-8, -3, -5)` and `max3(5, 3, 5)`.
> 2. Which calls are wrong? Describe exactly which inputs fail.
> 3. Fix the function with the smallest change, then rewrite it with the "current maximum" pattern from Homework 1.

> [!HINT 1]
> With `5, 5, 3`, is `5 > 5` true? Then which branch is left?

> [!HINT 2]
> The `else` branch returns `c` without checking anything.

> [!ANSWER]
> **1.** `3`, `5`, `4`, `-3`, `5`.
>
> **2.** Only `max3(5, 5, 3)` is wrong. The function fails exactly when **a and b are tied for the largest value** (a == b > c): both strict comparisons are false, so it falls through to `return c`. A tie involving c is harmless, because c is then the maximum anyway.
>
> **3.** Smallest fix: change `>` to `>=` in the first two conditions. The current maximum pattern avoids the problem completely:
>
> ```cpp
> int max3(int a, int b, int c) {
>     int max = a;
>     if (b > max) max = b;
>     if (c > max) max = c;
>     return max;
> }
> ```
>
> The two `if` statements are independent (no `else`), so every candidate is checked once.

## Question 4 · Maximum of n values and its position

**Reference:** [Homework 1 · Exercise 2](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-01)

> [!QUIZ]
> Extend Exercise 2. The program first reads `n` (n ≥ 1), then `n` integers. It prints the maximum and the position (1-based) where the maximum **first** appears.
>
> 1. Write the program.
> 2. Write the output for the input `5  -3 -7 -1 -9 -1`.
> 3. A student initializes `max = 0` and `pos = 0` before the loop and reads all n values inside it. What does that version print for the same input?
> 4. To report the **last** position instead, what single character changes?

> [!HINT 1]
> Read the first value before the loop and use it to initialize `max`.

> [!HINT 2]
> `>` updates only on a strictly larger value, so the earlier position is kept on a tie.

> [!ANSWER]
> **1.**
>
> ```cpp
> int main() {
>     int n;
>     cin >> n;
>     int value;
>     cin >> value;
>     int max = value, pos = 1;
>     for (int i = 2; i <= n; ++i) {
>         cin >> value;
>         if (value > max) {
>             max = value;
>             pos = i;
>         }
>     }
>     cout << "max " << max << " at " << pos << '\n';
>     return 0;
> }
> ```
>
> **2.** `max -1 at 3`
>
> **3.** `max 0 at 0`. Every input is negative, so no value is ever greater than 0 and the made-up starting value is reported. This is the same reason Homework 1 initializes `max` with the first input.
>
> **4.** Change `value > max` to `value >= max`. Then a tie also updates `pos`, and the output becomes `max -1 at 5`.

## Question 5 · Sentinel loop with `continue`

**Reference:** [Homework 1 · Exercise 3](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-01)

> [!QUIZ]
> ```cpp
> int main() {
>     double sum = 0;
>     int count = 0;
>     while (true) {
>         double input;
>         cin >> input;
>         if (input == 0.0) break;
>         if (input < 0) continue;
>         sum += input;
>         ++count;
>         cout << sum << '\n';
>     }
>     cout << count << ' ' << sum / count << '\n';
>     return 0;
> }
> ```
>
> 1. Write the output for the input `2.5 -4 1.5 3 0`.
> 2. What happens for the input `0`? Fix it.
> 3. What is the difference between `break` and `continue` here?

> [!HINT 1]
> A negative value skips the rest of the loop body, so it is neither added nor counted.

> [!HINT 2]
> `sum / count` is `double / int`, so `count` is converted to `double`.

> [!ANSWER]
> **1.**
>
> ```text
> 2.5
> 4
> 7
> 3 2.33333
> ```
>
> `-4` is skipped. `cout` prints at most six significant digits by default, so 7/3 is shown as `2.33333`.
>
> **2.** The loop ends immediately with `sum = 0` and `count = 0`, so the program computes `0.0 / 0.0`. Because it is a floating-point division, it does not crash; it produces **NaN** (printed as `nan` or `-nan`, depending on the platform). Fix:
>
> ```cpp
> if (count > 0) cout << count << ' ' << sum / count << '\n';
> else cout << "no positive input\n";
> ```
>
> **3.** `break` leaves the loop completely (the sentinel 0 ends the input). `continue` skips only the rest of the **current** iteration and goes on to read the next value.

## Question 6 · Four versions of the cumulative sum loop

**Reference:** [Homework 1 · Exercise 3](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-01)

> [!QUIZ]
> Each version reads integers into `int x` and starts with `int sum = 0;`. For the input `3 -1 5 0`, write what each version prints. Which ones meet the task "print the running sum after each number, stop at 0"?
>
> ```cpp
> // A
> while (1) { cin >> x; sum += x; if (x == 0) break; cout << ' ' << sum; }
>
> // B
> cin >> x;
> while (x != 0) { sum += x; cout << ' ' << sum; cin >> x; }
>
> // C
> do { cin >> x; sum += x; cout << ' ' << sum; } while (x != 0);
>
> // D
> while (1) { cin >> x; if (x == 0) break; cout << ' ' << sum; sum += x; }
> ```

> [!HINT 1]
> Order matters in each iteration: read → check → add → print.

> [!HINT 2]
> A `do while` loop checks the condition only **after** the body has run.

> [!ANSWER]
> | Version | Output | Correct? |
> | --- | --- | --- |
> | A | ` 3 2 7` | Yes. It adds the 0 before checking, but adding 0 changes nothing. |
> | B | ` 3 2 7` | Yes. Read once before the loop, then read again at the end of each iteration. |
> | C | ` 3 2 7 7` | No. The 0 is added and the sum is printed once more before the check. |
> | D | ` 0 3 2` | No. It prints **before** adding, so each line shows the previous sum. |
>
> A only works because the sentinel is 0. If the sentinel were, for example, −1, A would add it to the sum. Checking the sentinel right after reading (as in Homework 1 and B) is the safe pattern.

## Question 7 · Tracing the Euclidean algorithm

**Reference:** [Homework 1 · Exercise 4](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-01)

> [!QUIZ]
> Use the Homework 1 algorithm (swap if a < b; r = a % b; if r = 0 report b; otherwise a = b, b = r).
>
> 1. Trace the algorithm for the input `462 1071`. Write (a, b, r) for each iteration and the number of times the remainder is computed.
> 2. What happens if the user enters `25 0`? And `0 25`?
> 3. Give the time complexity and explain in one sentence why the loop always ends for positive inputs.

> [!HINT 1]
> 462 < 1071, so the values are swapped first.

> [!HINT 2]
> Look at which value is used as the divisor in the first iteration after the swap.

> [!ANSWER]
> **1.** After the swap a = 1071, b = 462.
>
> | a | b | r = a % b |
> | ---: | ---: | ---: |
> | 1071 | 462 | 147 |
> | 462 | 147 | 21 |
> | 147 | 21 | 0 → GCD = **21** |
>
> The remainder is computed **3** times.
>
> **2.** `25 0`: no swap (25 < 0 is false), so `a % b` is `25 % 0`, a **division by zero** (undefined behavior, usually a crash). `0 25`: swap gives a = 25, b = 0, so the same problem happens. The algorithm requires two **positive** integers; a robust version would check for 0 first, since gcd(x, 0) = x.
>
> **3.** O(log(min(a, b))). Each iteration replaces b by r < b, so b strictly decreases and stays ≥ 0; it must reach a remainder of 0 after finitely many steps.

## Question 8 · `swap` by value and by reference

**Reference:** [Homework 1 · Exercise 4](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-01)

> [!QUIZ]
> ```cpp
> void swapV(int i, int j) { int t = i; i = j; j = t; }
> void swapR(int& i, int& j) { int t = i; i = j; j = t; }
>
> int main() {
>     int a = 12, b = 30;
>     swapV(a, b);
>     cout << a << ' ' << b << '\n';
>     swapR(a, b);
>     cout << a << ' ' << b << '\n';
>     swapR(a, a);
>     cout << a << '\n';
>     return 0;
> }
> ```
>
> 1. Write the output.
> 2. In the Homework 1 GCD program, `swap(a, b)` is replaced by `swapV(a, b)`. What does the program now print for the input `12 30`? Explain.

> [!HINT 1]
> A value parameter is a copy. A reference parameter is another name for the caller's variable.

> [!HINT 2]
> If a < b, what is `a % b`?

> [!ANSWER]
> **1.**
>
> ```text
> 12 30
> 30 12
> 30
> ```
>
> `swapV` swaps its own copies, so `main` does not change. `swapR` swaps `main`'s variables. `swapR(a, a)` makes `i` and `j` refer to the same variable; it stores 30 in `t` and writes 30 back, so the value stays 30.
>
> **2.** It still prints **6**. `swapV` changes nothing, so the loop starts with a = 12, b = 30. The first remainder is `12 % 30 = 12`, and the update `a = b; b = r;` gives a = 30, b = 12, which is exactly the swap. The loop then continues 30, 12 → 12, 6 → r = 0. The swap step is not needed for correctness; it only saves one iteration.

## Question 9 · Debugging a GCD function

**Reference:** [Homework 1 · Exercise 4](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-01)

> [!QUIZ]
> Both functions should return the GCD of two positive integers.
>
> ```cpp
> int gcd1(int a, int b) {
>     int r;
>     while (r != 0) {
>         r = a % b;
>         a = b;
>         b = r;
>     }
>     return b;
> }
>
> int gcd2(int a, int b) {
>     while (b != 0) {
>         a = b;
>         b = a % b;
>     }
>     return a;
> }
> ```
>
> 1. Find the bugs in `gcd1`. Assuming `r` happens to start with a nonzero value, what does `gcd1(48, 18)` return?
> 2. What does `gcd2(48, 18)` return? Explain the bug.
> 3. Write a correct version.

> [!HINT 1]
> When the loop in `gcd1` ends, r is 0. Which variable then holds the last nonzero divisor?

> [!HINT 2]
> In `gcd2`, which value of `a` does the line `b = a % b;` use?

> [!ANSWER]
> **1.** Two bugs:
>
> - `r` is **not initialized**, so the first `while (r != 0)` reads a garbage value. If it happens to be 0, the loop never runs.
> - It returns `b`, but after the last step `b = r = 0`. The GCD has just been moved into `a`.
>
> With a nonzero start: (48, 18) → r = 12 → (18, 12) → r = 6 → (12, 6) → r = 0 → (6, 0). It returns **0** instead of 6.
>
> **2.** It returns **18**. `a = b;` overwrites `a` first, so `b = a % b;` computes `18 % 18 = 0`. This is the "no temporary variable" trap from Homework 1: the remainder must be saved **before** `a` changes.
>
> **3.**
>
> ```cpp
> int gcd(int a, int b) {
>     while (b != 0) {
>         int r = a % b;
>         a = b;
>         b = r;
>     }
>     return a;
> }
> ```

## Question 10 · Reducing fractions until the sentinel

**Reference:** [Homework 1 · Exercises 3 and 4](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-01)

> [!QUIZ]
> Write a program that repeatedly reads two positive integers, a numerator and a denominator, and prints the fraction in lowest terms as `num/den`. The program stops when the numerator is 0. Use the `gcd` function from Question 9.
>
> Then write the exact output for the input `84 36 10 25 13 7 18 6 0 0`.

> [!HINT 1]
> Combine the sentinel loop of Exercise 3 (read → check → process) with the GCD of Exercise 4.

> [!HINT 2]
> Divide **both** numbers by the same GCD.

> [!ANSWER]
> ```cpp
> int gcd(int a, int b) {
>     while (b != 0) {
>         int r = a % b;
>         a = b;
>         b = r;
>     }
>     return a;
> }
>
> int main() {
>     int num, den;
>     while (true) {
>         cin >> num >> den;
>         if (num == 0) break;
>         int g = gcd(num, den);
>         cout << num / g << '/' << den / g << '\n';
>     }
>     return 0;
> }
> ```
>
> ```text
> 7/3
> 2/5
> 13/7
> 3/1
> ```
>
> gcd(84, 36) = 12, gcd(10, 25) = 5, gcd(13, 7) = 1, gcd(18, 6) = 6. This `gcd` does not need the swap step (Question 8), and the sentinel is checked before `gcd` runs, so the final `0 0` never causes a division by zero.
