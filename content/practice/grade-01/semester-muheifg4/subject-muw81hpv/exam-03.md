---
title: "C++ 중간고사 족보 (2026-2)"
description: "The 2026-2 C++ midterm rebuilt as practice questions: loop output tracing, references and const, converting triple recursion to a loop, and an inner-product function on arrays."
week: 0
order: 3
published: true
password: "071025"
---

**Instructions**

- Answer each question with the requested output, code, or explanation.
- Unless stated otherwise, assume a C++17 compiler and that `#include <iostream>` is present.
- Write your answer first, then open the hints one at a time, and the solution last.
- The questions are rebuilt from a student's recollection of the 2026-2 midterm, so wording, order, and points may differ from the real exam. Every program output in the solutions was checked by compiling and running the code.

| Question | Type | Topic |
| --- | --- | --- |
| Question 1 | Output tracing | `for` loop, `%`, `if`/`else` |
| Question 2 | Debugging · Concept | References, call by reference vs. value, `const` |
| Question 3 | Code writing · Output | Recursion → loop, base cases |
| Question 4 | Code writing | Arrays as parameters, inner product |

## Question 1 · Output of a loop

> [!QUIZ]
> Write the output of the following program.
>
> ```cpp
> #include <iostream>
> int main()
> {
>     int y = 0;
>     for (int i = 5; i > 0; i--) {
>         if (i % 3 == 1)
>             y++;
>         else
>             y += i;
>         std::cout << y << std::endl;
>     }
> }
> ```

> [!HINT 1]
> `i` takes the values 5, 4, 3, 2, 1. Compute `i % 3` for each one first.

> [!HINT 2]
> Only `i = 4` and `i = 1` give `i % 3 == 1`. In every other step `y` grows by `i`.

> [!ANSWER]
> ```text
> 5
> 6
> 9
> 11
> 12
> ```
>
> | `i` | `i % 3` | Branch | `y` after |
> | ---: | ---: | --- | ---: |
> | 5 | 2 | `y += 5` | 5 |
> | 4 | 1 | `y++` | 6 |
> | 3 | 0 | `y += 3` | 9 |
> | 2 | 2 | `y += 2` | 11 |
> | 1 | 1 | `y++` | 12 |
>
> `y` is printed inside the loop, so every step produces one line.

## Question 2 · References

> [!QUIZ]
> ```cpp
> #include <iostream>
>
> void fun(int &r, int v)
> {
>     r = r + 100;
>     v = v - 100;
> }
> int main()
> {
>     int i = 3;
>     int j = 2;
>     int &r1 = i;
>     int &r2;
>     r2 = j;
>     fun(i, j);
>     std::cout << "i : " << i << "j : " << j;
> }
> ```
>
> 1. Find the incorrect statement and explain why it is wrong.
> 2. Rewrite the incorrect part so that the program compiles, and write the output of the corrected program.
> 3. In the corrected program, can `int i = 3;` be changed to `const int i = 3;`? Answer **yes** or **no** and explain why.

> [!HINT 1]
> A reference is another name for an existing variable. When must it be told which variable that is?

> [!HINT 2]
> `fun` takes its first parameter by reference and its second by value. Which change is visible in `main`?

> [!HINT 3]
> For part 3, look at every place where `i` is bound to an `int &`.

> [!ANSWER]
> **1.** `int &r2;` is wrong. A reference must be initialized when it is declared, because it cannot be re-seated later. The compiler reports `'r2' declared as reference but not initialized`. The next line, `r2 = j;`, would not bind `r2` to `j` anyway: on a reference, `=` assigns a value to the variable it already refers to.
>
> **2.** Bind the reference in its declaration and delete `r2 = j;`:
>
> ```cpp
> int &r2 = j;
> ```
>
> Output:
>
> ```text
> i : 103j : 2
> ```
>
> `r` is a reference to `i`, so `r = r + 100` changes `i` to 103. `v` is a copy of `j`, so `v = v - 100` changes only the copy and `j` stays 2. The output has no space before `j` because the string literal `"j : "` starts with `j`.
>
> **3.** **No.** A non-`const` reference `int &` cannot bind to a `const int`, otherwise the `const` variable could be changed through it. There are two such bindings:
>
> - `int &r1 = i;`
> - `fun(i, j);`, where the parameter `int &r` would bind to `i` (and `fun` really does change it).
>
> Both are compile errors (`binding reference of type 'int&' to 'const int' discards qualifiers`). Changing `int &r1` to `const int &r1` fixes only the first one. The call to `fun` stays illegal as long as `fun` modifies its first argument.

## Question 3 · Recursion to a loop

> [!QUIZ]
> ```cpp
> int g(int x)
> {
>     if (x <= 0)
>         return x + 1;
>     else
>         return g(x - 1) + g(x - 1) + g(x - 1);
> }
> ```
>
> 1. Rewrite `g` using a loop instead of recursion. It must return the same value for every `x`.
> 2. What is the value of `g(3)`?
> 3. If `if (x <= 0)` is changed to `if (x < 0)`, what is the value of `g(50)`?

> [!HINT 1]
> `g(x - 1) + g(x - 1) + g(x - 1)` is the same as `3 * g(x - 1)`. What is `g(0)`?

> [!HINT 2]
> For `x > 0`, `g(x) = 3 * 3 * … * g(0)`. Do not forget inputs with `x <= 0`.

> [!HINT 3]
> For part 3, the base case now stops at `x = -1`. What is `g(-1)`, and what does that make `g(0)`?

> [!ANSWER]
> **1.** `g(0) = 0 + 1 = 1`, and each level multiplies by 3, so `g(x) = 3^x` for `x > 0`. For `x <= 0` the function returns `x + 1` directly.
>
> ```cpp
> int g(int x)
> {
>     if (x <= 0)
>         return x + 1;
>
>     int result = 1;          // g(0)
>     for (int i = 1; i <= x; i++)
>         result = result * 3; // g(i) = 3 * g(i - 1)
>     return result;
> }
> ```
>
> The loop version makes `x` multiplications. The recursive version calls itself three times per level, so it makes about `3^x` calls.
>
> **2.** `g(3) = 3 * g(2) = 3 * 3 * g(1) = 3 * 3 * 3 * g(0) = 27`.
>
> | `x` | 0 | 1 | 2 | 3 |
> | --- | ---: | ---: | ---: | ---: |
> | `g(x)` | 1 | 3 | 9 | **27** |
>
> **3.** **0.** Now `g(-1) = -1 + 1 = 0`, so `g(0) = 3 * g(-1) = 0`. Every larger `x` is 3 times a zero, so `g(50) = 0`.
>
> Note: with the recursive code this answer is only true on paper. `g(50)` would make about `3^51` calls, so the program would not finish in any reasonable time. (With the original `x <= 0`, `g(50) = 3^50` would also overflow `int`.)

## Question 4 · Inner product

> [!QUIZ]
> 1. Complete `inner_product` so that it returns the inner product of the first `n` elements of arrays `a` and `b`.
> 2. Complete `main` so that it prints the elements of both arrays and the value of `prod`. Your loops must use `n`.
>
> ```cpp
> #include <iostream>
> void inner_product(int a[], int b[], int n)
> {
>     // return prod
> }
>
> void main()
> {
>     int n = 4;
>     int a[] = {3, 6, 2, 1};
>     int b[] = {1, 4, 2, 6};
>     int prod = inner_product(a, b, n);
>     // print a, b, prod
> }
> ```

> [!HINT 1]
> The inner product is `a[0]*b[0] + a[1]*b[1] + … + a[n-1]*b[n-1]`.

> [!HINT 2]
> Look at the return types in the skeleton. Can a `void` function return `prod`, and does standard C++ accept `void main()`?

> [!ANSWER]
> The skeleton has two problems that must be fixed for it to compile:
>
> - `inner_product` returns a value that `main` stores in `int prod`, so its return type must be `int`, not `void`.
> - Standard C++ requires `int main()`. `void main()` is rejected by g++ (`'::main' must return 'int'`).
>
> ```cpp
> #include <iostream>
>
> int inner_product(int a[], int b[], int n)
> {
>     int prod = 0;
>     for (int i = 0; i < n; i++)
>         prod += a[i] * b[i];
>     return prod;
> }
>
> int main()
> {
>     int n = 4;
>     int a[] = {3, 6, 2, 1};
>     int b[] = {1, 4, 2, 6};
>     int prod = inner_product(a, b, n);
>
>     std::cout << "a: ";
>     for (int i = 0; i < n; i++)
>         std::cout << a[i] << " ";
>     std::cout << "\nb: ";
>     for (int i = 0; i < n; i++)
>         std::cout << b[i] << " ";
>     std::cout << "\nprod: " << prod << "\n";
> }
> ```
>
> Output:
>
> ```text
> a: 3 6 2 1
> b: 1 4 2 6
> prod: 37
> ```
>
> `prod = 3·1 + 6·4 + 2·2 + 1·6 = 3 + 24 + 4 + 6 = 37`. The function must start with `prod = 0`, because an uninitialized local variable holds garbage. An array parameter `int a[]` does not carry its length, which is why `n` is passed separately.
