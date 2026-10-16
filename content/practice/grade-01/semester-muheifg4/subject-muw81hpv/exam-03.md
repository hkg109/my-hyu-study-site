---
title: C++ Expected Exam Questions
description: Nine expected questions based on Homework 1–3, covering concepts, operator precedence, debugging, output tracing, code writing, and converting recursion to loops.
week: 0
order: 3
published: true
---

**Instructions**

- Answer each question with the requested output, code, or explanation.
- Unless stated otherwise, assume `#include <iostream>` and `using namespace std;` are included.
- After writing your answer, open the solution to check it and record whether you were correct, unsure, or wrong.
- These are **expected questions** adapted from Homework 1–3 and may differ from the actual exam.

| Question | Type | Source |
| --- | --- | --- |
| Question 0 | Concept | Homework 2 · Exercise 3 |
| Question 1 | Operator precedence & short-circuit evaluation | Homework 1 · Exercise 1 |
| Question 2 | Debugging | Homework 3 · Exercise 1 (counting letters) |
| Question 3 | Debugging | Homework 3 · Exercise 2 (vertical histogram) |
| Question 4 | Output tracing | Recursion and references |
| Question 5 | Code writing | Homework 1 · Exercise 4 |
| Question 6 | Recursion → loop | Homework 2 · Exercise 1 |
| Question 7 | Recursion → loop | Homework 2 · Exercise 2 |
| Question 8 | Recursion → loop | Homework 2 · Exercise 3 |

## Question 0 · Recursion and parameter types

**Reference:** [Homework 2 · Exercise 3](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02)

> [!QUIZ]
> Answer the questions about the following function.
>
> ```cpp
> int sum_down(int x) {
>     if (x >= 0) {
>         x = x - 1;
>         int y = x + sum_down(x);
>         return y + sum_down(x);
>     }
>     return 1;
> }
> ```
>
> 1. What does `sum_down(2)` return, and how many times in total is `sum_down` executed by this single call (including the first call)?
> 2. Write the total number of calls made by `sum_down(x)` as a formula in `x`, and give the time complexity of the function.
> 3. Suppose the parameter `int x` is changed to each of the types below while the function body stays the same. Explain what happens at compile time and at run time in each case.
>    - `double x`
>    - `unsigned int x`
>    - `const int x`

> [!HINT 1]
> The two `sum_down(x)` calls inside the function use **the same argument**. Build up the values in order: `f(-1) = 1`, then `f(0)`, `f(1)`, `f(2)`.

> [!HINT 2]
> If `C(x)` is the number of calls, then `C(-1) = 1` and `C(x) = 1 + 2 × C(x - 1)`.

> [!HINT 3]
> An `unsigned int` cannot represent values below 0. A `const` parameter cannot be assigned to.

> [!ANSWER]
> **1.** It returns **5**, and the function runs **15 times** in total.
>
> | `x` | Computation `f(x) = (x - 1) + 2 × f(x - 1)` | Return value | Calls `C(x)` |
> | ---: | --- | ---: | ---: |
> | -1 | Base case | 1 | 1 |
> | 0 | `-1 + 2 × 1` | 1 | 3 |
> | 1 | `0 + 2 × 1` | 2 | 7 |
> | 2 | `1 + 2 × 2` | 5 | 15 |
>
> **2.** `C(x) = 2^(x+2) - 1`. Every call solves the same subproblem twice, so the time complexity is **O(2^x)**.
>
> **3.**
>
> | Change | Verdict | Reason |
> | --- | --- | --- |
> | `double x` | Works for integer inputs | Integer values are represented exactly in a `double`. However, in `int y = x + sum_down(x);` the `double` result is truncated to `int`, and a fractional input such as `2.5` changes the meaning of the original integer function. |
> | `unsigned int x` | Never terminates | `x >= 0` is **always true**. When `x = 0`, `x - 1` becomes a very large positive number (4294967295) instead of -1, so the base case is never reached and the program eventually overflows the stack. |
> | `const int x` | Compile error | `x = x - 1;` assigns to a const parameter. The body must be rewritten to call `sum_down(x - 1)` without modifying `x`. |

## Question 1 · Operator precedence and short-circuit evaluation

**Reference:** [Homework 1 · Exercise 1](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-01)

> [!QUIZ]
> **(1)** The following variables are declared. Write the value printed when each expression is output with `cout`. Evaluate each expression independently, starting from these values.
>
> ```cpp
> int a = 3;
> int b = 0;
> int c = -2;
> double d = 2.5;
> char ch = 'K';
> ```
>
> | No. | Expression | Result |
> | --- | --- | --- |
> | ① | `a > b > c` | □ |
> | ② | `!a == b` | □ |
> | ③ | `-c % a * 2` | □ |
> | ④ | `b \|\| !c && a` | □ |
> | ⑤ | `ch - 'A' > 9 && a % 2` | □ |
> | ⑥ | `a * !b - c` | □ |
> | ⑦ | `d * 2 == a + 2` | □ |
> | ⑧ | `a / 2 * 2 == a \|\| !(c < b)` | □ |
> | ⑨ | `!!c + !b * a` | □ |
>
> **(2)** The four statements below are executed **in order**, each continuing from the values left by the previous one. After each statement, write the value of the `bool` variable and the values of `a`, `b`, `c`, and `k`.
>
> ```cpp
> int a = 3, b = 0, c = -2, k = 5;
>
> bool p = b && ++a || c++;
> bool q = a++ > 3 || --b && k--;
> bool r = !c || (k -= 4) && ++b;
> bool s = (a = b) || (c = 0) || ++k;
> ```
>
> | After | `bool` value | `a` | `b` | `c` | `k` |
> | --- | :---: | :---: | :---: | :---: | :---: |
> | `p` | □ | □ | □ | □ | □ |
> | `q` | □ | □ | □ | □ | □ |
> | `r` | □ | □ | □ | □ | □ |
> | `s` | □ | □ | □ | □ | □ |
>
> **(3)** Write the exact output of the following code and the final value of `calls`.
>
> ```cpp
> int calls = 0;
>
> bool check(int v) {
>     calls++;
>     cout << v << " ";
>     return v > 0;
> }
>
> // inside main
> if (check(-1) && check(2) || check(3) && check(-4) || check(5))
>     cout << "yes" << endl;
> else
>     cout << "no" << endl;
> ```
>
> **(4)** The loop below finds the first 0 in the array. Explain why swapping the two operands of `&&` into `arr[i] != 0 && i < 5` can be dangerous when the array contains no 0.
>
> ```cpp
> int arr[5] = {4, 7, 1, 2, 9};
> int i = 0;
> while (i < 5 && arr[i] != 0)
>     i++;
> ```

> [!HINT 1]
> From highest to lowest precedence: unary `! -` and `++ --` → `* / %` → `+ -` → `< > <= >=` → `== !=` → `&&` → `||` → `=` `-=`. Comparison operators of the same level are evaluated **left to right**, and each comparison produces 0 or 1.

> [!HINT 2]
> First add parentheses based on precedence. For example, `b && ++a || c++` is `(b && ++a) || c++`. Then evaluate from left to right: `&&` **skips** its right operand when the left side is false, and `||` skips its right operand when the left side is true. A skipped `++`, `--`, or assignment does not change any variable.

> [!HINT 3]
> Postfix `c++` and `k--` use the value **before** the change in the condition. An assignment such as `(a = b)` or `(k -= 4)` has the value that was just stored, so it is true only if that value is not 0. In (3), `check` prints only when it is actually called.

> [!ANSWER]
> **(1)**
>
> | No. | How it is actually grouped | Result |
> | --- | --- | --- |
> | ① | `(3 > 0) > -2` → `1 > -2` | `1` |
> | ② | `(!3) == 0` → `0 == 0` | `1` |
> | ③ | `((-(-2)) % 3) * 2` → `2 * 2` | `4` |
> | ④ | `0 \|\| ((!-2) && 3)` → `0 \|\| (0 && 3)` | `0` |
> | ⑤ | `(('K' - 'A') > 9) && (3 % 2)` → `(10 > 9) && 1` | `1` |
> | ⑥ | `(3 * (!0)) - (-2)` → `3 * 1 + 2` | `5` |
> | ⑦ | `(2.5 * 2) == (3 + 2)` → `5.0 == 5` | `1` |
> | ⑧ | `(((3 / 2) * 2) == 3) \|\| (!(-2 < 0))` → `(2 == 3) \|\| 0` | `0` |
> | ⑨ | `(!(!-2)) + ((!0) * 3)` → `1 + 3` | `4` |
>
> - ① is not the mathematical "a > b > c". The first comparison becomes 1, and then `1 > -2` is compared.
> - ③ applies the unary minus first. `3 / 2` in ⑧ is integer division, which gives 1.
> - ⑥ and ⑨ are arithmetic expressions, so the results are integers, not `bool` values. Only `!x` becomes 0 or 1.
>
> **(2)**
>
> | After | `bool` value | `a` | `b` | `c` | `k` |
> | --- | :---: | :---: | :---: | :---: | :---: |
> | `p` | `1` | 3 | 0 | -1 | 5 |
> | `q` | `1` | 4 | -1 | -1 | 4 |
> | `r` | `0` | 4 | -1 | -1 | 0 |
> | `s` | `1` | -1 | -1 | -1 | 0 |
>
> - **`p = (b && ++a) || c++`:** `b` is 0, so `++a` is **skipped** (`a` stays 3). `c++` is evaluated: its value is -2 (true), then `c` becomes -1.
> - **`q = (a++ > 3) || (--b && k--)`:** `a++` compares the old value 3, so `3 > 3` is false, then `a` becomes 4. Since the left side is false, the right side runs: `--b` makes `b = -1` (true), so `k--` runs with the old value 5 (true), then `k` becomes 4.
> - **`r = !c || ((k -= 4) && ++b)`:** `!(-1)` is 0, so the right side runs. `k -= 4` stores 0, and its value 0 is false, so `++b` is **skipped** (`b` stays -1).
> - **`s = (a = b) || (c = 0) || ++k`:** `a = b` stores -1, which is true, so the whole expression is true immediately. `c = 0` and `++k` are **both skipped**, so `c` stays -1 and `k` stays 0.
>
> **(3)**
>
> ```text
> -1 3 -4 5 yes
> ```
>
> `calls` is **4**. The condition is grouped as `(check(-1) && check(2)) || (check(3) && check(-4)) || check(5)`.
>
> | Step | Call | Return | Reason for the next step |
> | --- | --- | --- | --- |
> | 1 | `check(-1)` | false | The first `&&` is already false, so `check(2)` is skipped. |
> | 2 | `check(3)` | true | The second `&&` needs its right operand. |
> | 3 | `check(-4)` | false | The second group is false, so the last `||` operand is needed. |
> | 4 | `check(5)` | true | The whole condition is true, so `yes` is printed. |
>
> **(4)** With `i < 5 && arr[i] != 0`, when `i` reaches 5 the left side is false and `arr[5]` is **never accessed**, thanks to short-circuit evaluation. If the order is reversed, `arr[5]` is read before `i < 5` is checked. Reading outside the array is undefined behavior: it can read a garbage value, keep looping, or crash. Put the condition that protects the range check **first**.

## Question 2 · Debugging: counting letters

**Reference:** [Homework 3 · Exercise 1](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-03)

> [!QUIZ]
> The following function receives a null-terminated string and should print how many times each letter from A to Z appears, ignoring case. For example, for `"Zoo zone."` it should print `O, o : 3` and `Z, z : 2`.
>
> The code contains **5 errors**. For each error, give the line number, explain the problem, and write the corrected code.
>
> ```cpp showLineNumbers
> void count_chars(char text[]) {
>     int counter[26];
>     int i = 0;
>     char ch;
>     while ((ch = text[i]) != '0') {
>         if (ch >= 'A' && ch < 'Z')
>             counter[ch]++;
>         if (ch >= 'a' && ch <= 'z')
>             counter[ch - 'a']++;
>     }
>
>     for (i = 0; i < 26; i++) {
>         char chUpper = 'A' + i;
>         char chLower = 'a' + i;
>         cout << chUpper << ", " << chLower << " : " << counter[i] << endl;
>     }
> }
> ```

> [!HINT 1]
> Check the array's initial values, the loop's stopping condition, how the loop advances, and the index range one at a time.

> [!HINT 2]
> A string ends with the null character `'\0'` (code 0), not the character `'0'` (code 48). For uppercase letters, subtract `'A'` to get an index from 0 to 25.

> [!HINT 3]
> `'Z'` itself is an uppercase letter. Also check whether `i` changes anywhere inside the `while` loop.

> [!ANSWER]
>
> | Line | Problem | Fix |
> | ---: | --- | --- |
> | 2 | The local array is not initialized, so counting starts from garbage values. | `int counter[26] = {0};` |
> | 5 | It compares against the character `'0'`, so the loop does not stop at the end of the string. | `!= '\0'` |
> | 6 | `< 'Z'` skips the uppercase letter `Z`. | `ch <= 'Z'` |
> | 7 | The character code (65–90) is used directly as an index, which goes out of the array's bounds. | `counter[ch - 'A']++;` |
> | 10 | `i` is never incremented, so the loop reads the first character forever. | Add `i++;` before `}` |
>
> ```cpp showLineNumbers
> void count_chars(char text[]) {
>     int counter[26] = {0};
>     int i = 0;
>     char ch;
>     while ((ch = text[i]) != '\0') {
>         if (ch >= 'A' && ch <= 'Z')
>             counter[ch - 'A']++;
>         if (ch >= 'a' && ch <= 'z')
>             counter[ch - 'a']++;
>         i++;
>     }
>
>     for (i = 0; i < 26; i++) {
>         char chUpper = 'A' + i;
>         char chLower = 'a' + i;
>         cout << chUpper << ", " << chLower << " : " << counter[i] << endl;
>     }
> }
> ```
>
> Using the ASCII values `65` instead of `'A'` and `97` instead of `'a'` gives the same code.

## Question 3 · Debugging: vertical histogram

**Reference:** [Homework 3 · Exercise 2](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-03)

> [!QUIZ]
> The following function receives a frequency array `counter` of length 26 and should print a vertical bar chart. For example, if the frequencies of A, B, and C are 3, 1, and 2 and all others are 0, it should print the following (trailing spaces omitted).
>
> ```text
> *
> * *
> ***
> ABCDEFGHIJKLMNOPQRSTUVWXYZ
> ```
>
> The code contains **5 errors**. For each error, give the line number, explain the problem, and write the corrected code.
>
> ```cpp showLineNumbers
> void print_histogram(int counter[]) {
>     int max;
>     for (int i = 0; i < 26; i++)
>         if (counter[i] > max)
>             max = i;
>
>     for (int j = max; j >= 0; j--) {
>         for (int i = 0; i < 26; i++)
>             if (counter[i] == j)
>                 cout << "*";
>             else
>                 cout << " ";
>     }
>     cout << endl;
>
>     for (int i = 0; i < 26; i++) {
>         char ch = 'A' + i;
>         cout << ch;
>     }
>     cout << endl;
> }
> ```

> [!HINT 1]
> The first loop is meant to find **the largest frequency value**. What should it start from, and what should it store?

> [!HINT 2]
> In the row for height `j`, every column whose frequency is **at least** `j` needs a star so the bars are filled all the way down. Is a row for height 0 needed?

> [!HINT 3]
> A line break is needed after each row. Check which block `cout << endl;` is in.

> [!ANSWER]
>
> | Line | Problem | Fix |
> | ---: | --- | --- |
> | 2 | `max` is not initialized, so the comparison result is unpredictable. | `int max = 0;` |
> | 5 | It stores the index `i` instead of the frequency value. | `max = counter[i];` |
> | 7 | Looping down to `j = 0` makes every column satisfy the condition, adding an extra row full of stars. | `j > 0` |
> | 9 | With `==`, only the top of each bar is printed. | `counter[i] >= j` |
> | 13–14 | `endl` is outside the outer loop, so all rows run together on one line. | Move `cout << endl;` inside the outer `for` block, after the inner `for` |
>
> ```cpp showLineNumbers
> void print_histogram(int counter[]) {
>     int max = 0;
>     for (int i = 0; i < 26; i++)
>         if (counter[i] > max)
>             max = counter[i];
>
>     for (int j = max; j > 0; j--) {
>         for (int i = 0; i < 26; i++)
>             if (counter[i] >= j)
>                 cout << "*";
>             else
>                 cout << " ";
>         cout << endl;
>     }
>
>     for (int i = 0; i < 26; i++) {
>         char ch = 'A' + i;
>         cout << ch;
>     }
>     cout << endl;
> }
> ```

## Question 4 · Tracing output with recursion and references

> [!QUIZ]
> Write the output of the following program exactly, including spaces and line breaks.
>
> ```cpp showLineNumbers
> #include <iostream>
> using namespace std;
>
> int f(int n, int& count) {
>     count++;
>     if (n <= 1)
>         return n;
>     return f(n - 1, count) + f(n - 2, count);
> }
>
> void h(int n, int& sum) {
>     if (n == 0)
>         return;
>     sum += n;
>     h(n - 1, sum);
>     cout << n << ":" << sum << " ";
> }
>
> void g(int& a, int b) {
>     a += b;
>     b += a;
>     cout << a << " " << b << endl;
> }
>
> int main() {
>     int count = 0;
>     int r = f(5, count);
>     cout << r << " " << count << endl;
>
>     int s = 0;
>     h(3, s);
>     cout << endl << s << endl;
>
>     int x = 1, y = 2;
>     g(x, y);
>     g(y, x);
>     cout << x << " " << y << endl;
>     return 0;
> }
> ```

> [!HINT 1]
> `count` and `sum` are references, so every recursive call shares **the same single variable** from `main`.

> [!HINT 2]
> `f` is the Fibonacci function. Count the calls with `C(0) = C(1) = 1` and `C(n) = 1 + C(n-1) + C(n-2)`.

> [!HINT 3]
> The `cout` in `h` runs **after** the recursive call returns, so the deepest call prints first, and by then `sum` already holds its final value. In `g`, only the first parameter is a reference.

> [!ANSWER]
>
> ```text
> 5 15
> 1:6 2:6 3:6 
> 6
> 3 5
> 5 8
> 3 5
> ```
>
> **`f(5, count)`:** The Fibonacci value is `f(5) = 5`. The call counts are `C(2) = 3`, `C(3) = 5`, `C(4) = 9`, `C(5) = 15`.
>
> **`h(3, s)`:** Going down, `sum` becomes `3 → 5 → 6`. After `h(0)` returns, the calls print in the order `n = 1, 2, 3`. Because `sum` is a reference, it is 6 all three times. One trailing space remains after the last item.
>
> | Call | `g(x, y)` | `g(y, x)` |
> | --- | --- | --- |
> | Variable the reference `a` refers to | `x` (1) | `y` (2) |
> | Copy `b` | value of `y`, 2 | value of `x`, 3 |
> | `a += b` | `x = 3` | `y = 5` |
> | `b += a` | `b = 5` (only the copy changes) | `b = 8` (only the copy changes) |
> | Output | `3 5` | `5 8` |
>
> The last line prints `x = 3` and `y = 5`.

## Question 5 · Writing code from instructions: GCD and LCM

**Reference:** [Homework 1 · Exercise 4](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-01)

> [!QUIZ]
> Write a complete program that follows the instructions below.
>
> 1. Write a function `void swap(int& i, int& j)` that takes two integers **by reference** and swaps their values.
> 2. Write a function `int gcd(int a, int b)` that returns the greatest common divisor using the Euclidean algorithm.
>    - If `a < b`, first swap the two values with `swap`.
>    - Do not use recursion. Use a `while` loop that repeats until `a % b` becomes 0.
> 3. In `main`, read two positive integers and print their greatest common divisor and least common multiple in the format below.
>    - Compute the least common multiple using `gcd`, and **divide first** to reduce the risk of multiplication overflow.
>
> ```text
> Enter first value:
> 36
> Enter second value:
> 84
> The greatest common divisor of 36 and 84 is: 12
> The least common multiple of 36 and 84 is: 252
> ```
>
> Also, for the input `36` and `84`, show in a table how `a`, `b`, and `a % b` change inside the loop.

> [!HINT 1]
> `gcd(a, b) = gcd(b, a % b)`. When the remainder becomes 0, the current `b` is the greatest common divisor.

> [!HINT 2]
> The least common multiple is `a × b / gcd(a, b)`. To reduce overflow, compute it in the order `a / g * b`.

> [!HINT 3]
> The output must show the original input values before swapping. Since `gcd` takes value parameters, swapping inside the function does not change the input variables in `main`.

> [!ANSWER]
>
> ```cpp showLineNumbers
> #include <iostream>
>
> void swap(int& i, int& j) {
>     int tmp = i;
>     i = j;
>     j = tmp;
> }
>
> int gcd(int a, int b) {
>     if (a < b)
>         swap(a, b);
>
>     while (a % b != 0) {
>         int r = a % b;
>         a = b;
>         b = r;
>     }
>     return b;
> }
>
> int main() {
>     int input_a, input_b;
>
>     std::cout << "Enter first value:" << std::endl;
>     std::cin >> input_a;
>     std::cout << "Enter second value:" << std::endl;
>     std::cin >> input_b;
>
>     int g = gcd(input_a, input_b);
>     int l = input_a / g * input_b;
>
>     std::cout << "The greatest common divisor of " << input_a
>               << " and " << input_b << " is: " << g << std::endl;
>     std::cout << "The least common multiple of " << input_a
>               << " and " << input_b << " is: " << l << std::endl;
>     return 0;
> }
> ```
>
> | Step | `a` | `b` | `a % b` |
> | --- | ---: | ---: | ---: |
> | Start (after swap) | 84 | 36 | 12 |
> | After 1st iteration | 36 | 12 | 0 → stop |
>
> The greatest common divisor is **12**, and the least common multiple is `36 / 12 × 84 = 252`.
>
> The homework solution's approach, using `while (1)` and `break` when `r == 0`, is also correct. If you write `using namespace std;` and define your own `swap`, the name can clash with `std::swap` and cause an ambiguity error, so the code above writes `std::` explicitly.

## Question 6 · Recursion to loop: factorial and binomial coefficient

**Reference:** [Homework 2 · Exercise 1](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02)

> [!QUIZ]
> The following code computes the binomial coefficient `C(n, r) = n! / ((n-r)! × r!)` recursively.
>
> ```cpp
> int fac(int n) {
>     if (n <= 1)
>         return 1;
>     else
>         return n * fac(n - 1);
> }
>
> int binomial_coefficient(int n, int r) {
>     return fac(n) / (fac(n - r) * fac(r));
> }
> ```
>
> 1. Write a function `int fac_loop(int n)` that returns the same result as `fac` **without recursion**, using a `for` loop.
> 2. Write the same function using a `while` loop.
> 3. Explain why `binomial_coefficient(13, 1)` does not give the correct value with a 32-bit `int`. Then write a function `int binomial_loop(int n, int r)` that computes `C(n, r)` with a single loop, without computing factorials separately.

> [!HINT 1]
> The base case `n <= 1 → 1` becomes **the initial value 1 of the accumulator** in the loop. Only the multiplication order changes, from `n, n-1, ..., 2` to `2, 3, ..., n`.

> [!HINT 2]
> `13! = 6,227,020,800`, while the maximum value of a 32-bit `int` is about 2.1 billion (2,147,483,647).

> [!HINT 3]
> `C(n, r) = (n-r+1)/1 × (n-r+2)/2 × ... × n/r`. The value after step `i`, `C(n-r+i, i)`, is always an integer, so if you **multiply first and then divide immediately**, the division is always exact.

> [!ANSWER]
> **1, 2.**
>
> ```cpp
> int fac_loop(int n) {
>     int result = 1;
>     for (int i = 2; i <= n; i++)
>         result *= i;
>     return result;
> }
>
> int fac_while(int n) {
>     int result = 1;
>     while (n > 1) {
>         result *= n;
>         n--;
>     }
>     return result;
> }
> ```
>
> When `n` is 0 or 1, the loop body never runs and the function returns 1, which matches the base case of the recursive version.
>
> **3.** `fac(13)` overflows the `int` range, so the result is wrong even though the answer should be 13. Any approach that computes the full factorials first has the same problem, whether it is recursive or iterative.
>
> ```cpp
> int binomial_loop(int n, int r) {
>     int result = 1;
>     for (int i = 1; i <= r; i++)
>         result = result * (n - r + i) / i;
>     return result;
> }
> ```
>
> For `C(5, 2)`: at `i = 1`, `1 × 4 / 1 = 4`; at `i = 2`, `4 × 5 / 2 = 10`. The intermediate values stay close to the final answer, so much larger `n` can be handled.

## Question 7 · Recursion to loop: backtracking permutations

**Reference:** [Homework 2 · Exercise 2](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02)

> [!QUIZ]
> When called as `permute(a, 0, n)`, the recursive function below prints every permutation of `a[0]` through `a[n]` (`n` is the **last index**).
>
> ```cpp
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
> ```
>
> 1. For `a = {1, 2, 3}`, write the output order of `permute(a, 0, 2)`.
> 2. Write `void permute_loop(int a[], int n)` that prints the permutations in the same order using **only loops, with no recursive calls**. You may use a helper array of size 30.

> [!HINT 1]
> Each recursive call remembers its own `j`. If you store the `j` of the call at depth `i` in an array `next[i]`, you can simulate the call stack yourself.

> [!HINT 2]
> The loop body does one of three things. **Go deeper**: swap `a[i]` and `a[next[i]]`, then `i++`. **Print**: if `i == n`, print and then go back. **Go back**: `i--`, undo the swap, then `next[i]++`.

> [!HINT 3]
> When entering a new depth `i`, start with `next[i] = i`. If `next[i]` goes past `n`, every choice at that depth has been tried, so go back. The loop ends when `i` becomes -1.

> [!ANSWER]
> **1.** `123`, `132`, `213`, `231`, `321`, `312`
>
> After swapping 3 and 1, the next two positions are swapped directly, so `312` comes after `321`. The order is not lexicographic.
>
> **2.**
>
> ```cpp showLineNumbers
> void permute_loop(int a[], int n) {
>     int next[30];     // next[i]: the j currently being tried at depth i
>     int i = 0;
>     next[0] = 0;
>
>     while (i >= 0) {
>         if (i == n) {                     // base case: print, then go back
>             print_array(a, n);
>             i--;
>             if (i >= 0) {
>                 swap(a[i], a[next[i]]);   // undo the swap
>                 next[i]++;
>             }
>         } else if (next[i] <= n) {        // go deeper with the next candidate
>             swap(a[i], a[next[i]]);
>             i++;
>             next[i] = i;
>         } else {                          // all candidates at this depth tried
>             i--;
>             if (i >= 0) {
>                 swap(a[i], a[next[i]]);
>                 next[i]++;
>             }
>         }
>     }
> }
> ```
>
> | Recursive version | Loop version |
> | --- | --- |
> | Local variable `j` of each call | `next[i]` |
> | Calling `permute(a, i + 1, n)` | `i++`, `next[i] = i` |
> | Returning from a call | `i--` |
> | `swap(a[i], a[j])` after the call | `swap(a[i], a[next[i]])` right after going back |
> | `j++` in the `for` loop | `next[i]++` |
>
> The output order is the same as the recursive version, and when the loop finishes the array is back to its original state `{1, 2, 3}`.

## Question 8 · Recursion to loop: double recursion in sum_down

**Reference:** [Homework 2 · Exercise 3](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02)

> [!QUIZ]
> Use `sum_down` from Question 0 again.
>
> ```cpp
> int sum_down(int x) {
>     if (x >= 0) {
>         x = x - 1;
>         int y = x + sum_down(x);
>         return y + sum_down(x);
>     }
>     return 1;
> }
> ```
>
> 1. Write `int sum_down_small(int x)` so that the recursive call happens **only once**.
> 2. Write `int sum_down_for(int x)` that returns the same value without recursion, using a `for` loop.
> 3. Write the same function using a `while` loop.
> 4. What is the smallest integer `x` for which the return value first exceeds 1,000,000?

> [!HINT 1]
> The two `sum_down(x)` calls return the same value. Rewriting the decremented `x` as the original `x - 1` gives `f(x) = (x - 1) + 2 × f(x - 1)`.

> [!HINT 2]
> The loop starts from the base value `f(-1) = 1`. If a counter `i` starts at -1 and you repeat `sum = i + 2 × sum` while incrementing it, `sum` becomes `f(i + 1)`.

> [!HINT 3]
> The value roughly doubles each step. Use `2^20 = 1,048,576` as a reference and compute the nearby values.

> [!ANSWER]
> **1.**
>
> ```cpp
> int sum_down_small(int x) {
>     if (x >= 0)
>         return (x - 1) + 2 * sum_down_small(x - 1);
>     return 1;
> }
> ```
>
> **2, 3.**
>
> ```cpp
> int sum_down_for(int x) {
>     int sum = 1;
>     for (int i = -1; i < x; i++)
>         sum = i + 2 * sum;
>     return sum;
> }
>
> int sum_down_while(int x) {
>     int sum = 1;
>     int i = -1;
>     while (i < x) {
>         sum = i + 2 * sum;
>         i++;
>     }
>     return sum;
> }
> ```
>
> For `x = 2`, `sum` goes `1 → (-1 + 2) = 1 → (0 + 2) = 2 → (1 + 4) = 5`, matching the original function.
>
> **4.** `f(18) = 524,269` and `f(19) = 1,048,556`, so the answer is **19**.
>
> | Version | Calls / iterations | Extra space |
> | --- | --- | --- |
> | Original double recursion | `2^(x+2) - 1` calls, O(2^x) | Call stack O(x) |
> | Single recursion | `x + 2` calls, O(x) | Call stack O(x) |
> | Loop | `x + 1` iterations, O(x) | O(1) |
