---
title: "C++ Homework Expected Exam 3"
description: "Ten expected midterm questions built from Homework 3 with a few combined Homework 1–3 tasks (before pointers): character codes, C strings, counting letters, vertical and horizontal histograms, and frequency arrays."
week: 0
order: 8
published: true
---

**Instructions**

- Answer each question with the requested output, code, or explanation.
- Unless stated otherwise, assume a C++17 compiler, `#include <iostream>`, `using namespace std;`, and ASCII character codes.
- Scope: **Homework 3**, plus Questions 9–10 that combine it with Homework 1–2. C strings are passed as `char text[]`; nothing after pointers is used.
- Write your answer first, then open the hints one at a time, and the solution last.
- These are **expected questions** adapted from Homework 1–3 and may differ from the actual exam. Every program output in the solutions was checked by compiling and running the code.

| Question | Type | Source |
| --- | --- | --- |
| Question 1 | Output tracing | Homework 3 · Exercise 1a |
| Question 2 | Output · Concept | Homework 3 · Character codes |
| Question 3 | Debugging | Homework 3 · Exercise 1a (string loop) |
| Question 4 | Code writing · Output | Homework 3 · Exercise 1a (array parameters) |
| Question 5 | Output tracing · Code completion | Homework 3 · Exercise 1b |
| Question 6 | Debugging · Output | Homework 3 · Exercise 1b |
| Question 7 | Code writing · Comparison | Homework 3 · Exercise 1b |
| Question 8 | Code writing · Output | Homework 3 · Exercise 1a |
| Question 9 | Code writing · Output | Homework 1 · Exercise 3 + Homework 3 · Exercise 1b |
| Question 10 | Code writing · Output | Homework 3 · Exercise 1a (counting array) |

## Question 1 · Tracing `count_chars`

**Reference:** [Homework 3 · Exercise 1a](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-03)

> [!QUIZ]
> `count_chars` is the Homework 3 function (uppercase and lowercase counted together).
>
> ```cpp
> char text[] = "Programming in C++ 2026!";
> count_chars(text);
> ```
>
> 1. List every line of the table whose count is **not** 0.
> 2. How many characters of `text` are skipped (not counted), and how many elements does the array `text` have?

> [!HINT 1]
> Only `'A'…'Z'` and `'a'…'z'` are counted. `+`, digits, spaces and `!` are skipped.

> [!HINT 2]
> `char text[] = "..."` stores one extra element for the terminating `'\0'`.

> [!ANSWER]
> **1.**
>
> ```text
> A, a : 1
> C, c : 1
> G, g : 2
> I, i : 2
> M, m : 2
> N, n : 2
> O, o : 1
> P, p : 1
> R, r : 2
> ```
>
> `P` and `C` are uppercase and land in the same counters as `p` and `c`.
>
> **2.** The string has 24 visible characters, and 14 of them are letters, so **10** are skipped: 3 spaces, 2 `+`, 4 digits and 1 `!`. The array has **25** elements: 24 characters + `'\0'`.

## Question 2 · Characters are integer codes

**Reference:** [Homework 3](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-03)

> [!QUIZ]
> Write the output of each statement (each on its own line).
>
> ```cpp
> cout << 'A' + 2;
> cout << char('A' + 2);
> cout << char('a' + 25);
> cout << '7' - '0';
> cout << 'z' - 'a';
> cout << ('b' > 'B');
> cout << char('q' - 'a' + 'A');
> ```
>
> Then explain why the Homework solution can use `counter[ch - 97]` instead of `counter[ch - 'a']`, and why `counter[ch]` is wrong.

> [!HINT 1]
> `'A'` is 65 and `'a'` is 97. Arithmetic on two `char` values gives an `int`, and `cout` prints an `int` as a number.

> [!HINT 2]
> `char(...)` converts back, so `cout` prints a character.

> [!ANSWER]
> | Statement | Output |
> | --- | --- |
> | `'A' + 2` | `67` (an `int`) |
> | `char('A' + 2)` | `C` |
> | `char('a' + 25)` | `z` |
> | `'7' - '0'` | `7` (digit character → its value) |
> | `'z' - 'a'` | `25` |
> | `'b' > 'B'` | `1` (98 > 66) |
> | `char('q' - 'a' + 'A')` | `Q` (lowercase → uppercase) |
>
> `'a'` **is** 97, so both are the same index; `'a'` just shows the intent better. `counter[ch]` uses the raw code (65–122) as the index, which is far outside `counter[26]` (indices 0–25).

## Question 3 · Debugging the string loop

**Reference:** [Homework 3 · Exercise 1a](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-03)

> [!QUIZ]
> The Homework loop is `while ((ch = text[i]) != '\0') { …; i++; }`. Two students changed it.
>
> ```cpp
> // Student A
> char text[] = "Hi!";
> int i = 0;
> char ch;
> while ((ch = text[i] != '\0')) {
>     cout << int(ch) << ' ';
>     i++;
> }
>
> // Student B
> char text[] = "ab0cd";
> int i = 0, n = 0;
> char ch;
> while ((ch = text[i]) != '0') {
>     n++;
>     i++;
> }
> cout << n;
> ```
>
> 1. Write the output of each program and explain the bug.
> 2. What would Student B's loop do for `"abcd"`?

> [!HINT 1]
> `!=` has higher precedence than `=`. Where do the parentheses go in Student A's version?

> [!HINT 2]
> `'0'` is the digit zero (code 48). `'\0'` is the null character (code 0).

> [!ANSWER]
> **1.**
>
> - **Student A** prints **`1 1 1`**. Without the inner parentheses it means `ch = (text[i] != '\0')`, so `ch` gets the comparison result 1 (or 0 at the end), not the character. The loop still runs 3 times, but every use of `ch` inside the loop is wrong. Fix: `while ((ch = text[i]) != '\0')`.
> - **Student B** prints **`2`**. The loop stops at the digit `'0'` instead of the end of the string. Fix: compare with `'\0'`.
>
> **2.** `"abcd"` contains no `'0'`, so the loop runs past the terminating `'\0'` and reads outside the array (undefined behavior) until it happens to find a byte with value 48.

## Question 4 · Changing a string inside a function

**Reference:** [Homework 3 · Exercise 1a](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-03)

> [!QUIZ]
> 1. Write `int toUpper(char text[])` that changes every lowercase letter of `text` to uppercase and returns how many letters were changed. Other characters stay the same.
> 2. Write the output of:
>
> ```cpp
> char s[] = "Hello, World 42";
> int k = toUpper(s);
> cout << s << ' ' << k << '\n';
> ```
>
> 3. In Homework 1, `swap` needed `int&` to change the caller's variables. Why can `toUpper` change `s` without `&`?

> [!HINT 1]
> A lowercase letter `c` becomes `c - 'a' + 'A'`.

> [!HINT 2]
> An array is never copied when it is passed to a function.

> [!ANSWER]
> **1.**
>
> ```cpp
> int toUpper(char text[]) {
>     int changed = 0;
>     for (int i = 0; text[i] != '\0'; ++i) {
>         if (text[i] >= 'a' && text[i] <= 'z') {
>             text[i] = text[i] - 'a' + 'A';
>             ++changed;
>         }
>     }
>     return changed;
> }
> ```
>
> **2.** **`HELLO, WORLD 42 8`** (e, l, l, o, o, r, l, d are changed; `H`, `W`, the comma, the space and the digits are not).
>
> **3.** An array parameter refers to the caller's array; the elements are not copied. So `text[i] = …` writes into `s` itself. A single `int` parameter, in contrast, is a copy, which is why `swap` needs references.

## Question 5 · A compact histogram

**Reference:** [Homework 3 · Exercise 1b](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-03)

> [!QUIZ]
> The Homework histogram always prints 26 columns. This version prints only the letters that appear at least once. `|` marks the end of each bar row.
>
> ```cpp
> void compact_histogram(int counter[]) {
>     int max = 0;
>     for (int i = 0; i < 26; i++)
>         if (counter[i] > max) max = counter[i];
>     for (int j = max; j > 0; j--) {
>         for (int i = 0; i < 26; i++) {
>             if (________) continue;          // (A)
>             cout << (counter[i] >= j ? '*' : ' ');
>         }
>         cout << "|\n";
>     }
>     for (int i = 0; i < 26; i++)
>         if (________) cout << char('A' + i); // (B)
>     cout << '\n';
> }
> ```
>
> 1. Fill in (A) and (B).
> 2. The counters come from `"Banana Bread"` (counted like `count_chars`). Write the exact output.

> [!HINT 1]
> (A) and (B) must skip exactly the same columns, or the labels will not line up with the bars.

> [!HINT 2]
> Banana Bread: a = 4, b = 2, n = 2, d = 1, e = 1, r = 1.

> [!ANSWER]
> **1.** (A) `counter[i] == 0`, (B) `counter[i] > 0`
>
> **2.**
>
> ```text
> *     |
> *     |
> **  * |
> ******|
> ABDENR
> ```
>
> The number of rows is the largest count (4, for A). Row h has a `*` in each column whose count is at least h.

## Question 6 · Histogram bugs

**Reference:** [Homework 3 · Exercise 1b](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-03)

> [!QUIZ]
> Use only the columns A–F, with the counts from `"banana bread"`: A = 4, B = 2, C = 0, D = 1, E = 1, F = 0. Each bar row ends with `|`.
>
> ```cpp
> for (int j = max; j > 0; j--) {
>     for (int i = 0; i < 6; i++)
>         cout << (counter[i] >= j ? '*' : ' ');
>     cout << "|\n";
> }
> ```
>
> Write the bar rows printed by
>
> 1. the code above,
> 2. the code with `counter[i] == j` instead of `>=`,
> 3. the code with `j >= 0` instead of `j > 0`.

> [!HINT 1]
> `==` prints a star only on the row that equals the count exactly.

> [!HINT 2]
> On row 0, `counter[i] >= 0` is true for every column.

> [!ANSWER]
> **1.** Correct version:
>
> ```text
> *     |
> *     |
> **    |
> ** ** |
> ```
>
> **2.** With `==`, only the **top** of each bar is printed:
>
> ```text
> *     |
>       |
>  *    |
>    ** |
> ```
>
> **3.** With `j >= 0`, an extra row 0 is added where every column, even C and F with count 0, gets a star:
>
> ```text
> *     |
> *     |
> **    |
> ** ** |
> ******|
> ```

## Question 7 · Horizontal histogram

**Reference:** [Homework 3 · Exercise 1b](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-03)

> [!QUIZ]
> 1. Write `void horizontal(int counter[], int cols)` that prints one line per letter: the letter, a space, then one `*` per occurrence.
> 2. Write the output for the A–F counts of Question 6.
> 3. Why is the horizontal version simpler than the vertical one from Homework 3? Give the time complexity of both for `cols` columns and a largest count h.

> [!HINT 1]
> Each line is independent: an outer loop over letters, an inner loop over the count.

> [!HINT 2]
> The vertical version must look at every column on every row.

> [!ANSWER]
> **1.**
>
> ```cpp
> void horizontal(int counter[], int cols) {
>     for (int i = 0; i < cols; ++i) {
>         cout << char('A' + i) << ' ';
>         for (int k = 0; k < counter[i]; ++k) cout << '*';
>         cout << '\n';
>     }
> }
> ```
>
> **2.**
>
> ```text
> A ****
> B **
> C 
> D *
> E *
> F 
> ```
>
> (`C` and `F` are followed by a single space.)
>
> **3.** The console prints line by line, and here one line = one bar, so no maximum is needed. The horizontal version prints O(cols + total count) characters. The vertical version needs the maximum first and then visits every column on every row: O(cols · h).

## Question 8 · The most frequent letter

**Reference:** [Homework 3 · Exercise 1a](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-03)

> [!QUIZ]
> Write `char mostFrequent(char text[])` that returns the uppercase letter that appears most often (uppercase and lowercase together). On a tie, return the letter that comes first in the alphabet. If the text contains no letters, return `'-'`.
>
> Write the result for `"Mississippi"`, `"banana bread"` and `"123 ..."`.

> [!HINT 1]
> Build the counter array as in Homework 3, then find the index of the largest count with the "current maximum" pattern from Homework 1.

> [!HINT 2]
> With `>` (not `>=`), the first index keeps the lead on a tie.

> [!ANSWER]
> ```cpp
> char mostFrequent(char text[]) {
>     int c[26] = {0};
>     for (int i = 0; text[i] != '\0'; ++i) {
>         char ch = text[i];
>         if (ch >= 'A' && ch <= 'Z') c[ch - 'A']++;
>         else if (ch >= 'a' && ch <= 'z') c[ch - 'a']++;
>     }
>     int best = 0;
>     for (int i = 1; i < 26; ++i)
>         if (c[i] > c[best]) best = i;
>     return c[best] == 0 ? '-' : char('A' + best);
> }
> ```
>
> | Input | Counts | Result |
> | --- | --- | --- |
> | `"Mississippi"` | I = 4, S = 4, P = 2, M = 1 | **I** (tie with S, I comes first) |
> | `"banana bread"` | A = 4, B = 2, N = 2, … | **A** |
> | `"123 ..."` | all 0 | **-** |
>
> Without the final check, the empty case would return `'A'`, because `best` starts at 0.

## Question 9 · Vote counter: sentinel input and histogram

**Reference:** [Homework 1 · Exercise 3](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-01) · [Homework 3 · Exercise 1b](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-03)

> [!QUIZ]
> Write a program that reads votes (integers 1–5) until the user enters 0. Votes outside 1–5 are counted as invalid and ignored. Then print a vertical histogram of the five options (rows end with `|`), the label row `12345`, and the number of invalid votes.
>
> Write the exact output for the input `3 1 3 5 7 3 1 -2 4 0`.

> [!HINT 1]
> Vote v goes into `count[v - 1]`, the same mapping idea as `ch - 'a'`.

> [!HINT 2]
> Check the sentinel first, then the range, then count.

> [!ANSWER]
> ```cpp
> int main() {
>     int count[5] = {0};
>     int vote, invalid = 0;
>     while (true) {
>         cin >> vote;
>         if (vote == 0) break;
>         if (vote < 1 || vote > 5) { ++invalid; continue; }
>         count[vote - 1]++;
>     }
>     int max = 0;
>     for (int i = 0; i < 5; ++i)
>         if (count[i] > max) max = count[i];
>     for (int h = max; h >= 1; --h) {
>         for (int i = 0; i < 5; ++i) cout << (count[i] >= h ? '*' : ' ');
>         cout << "|\n";
>     }
>     cout << "12345\n" << "invalid: " << invalid << '\n';
>     return 0;
> }
> ```
>
> Counts: 1 → 2, 2 → 0, 3 → 3, 4 → 1, 5 → 1; invalid: 7 and −2.
>
> ```text
>   *  |
> * *  |
> * ***|
> 12345
> invalid: 2
> ```
>
> Without the range check, `count[7 - 1]` and `count[-2 - 1]` would write outside the array.

## Question 10 · Anagram check with one counting array

**Reference:** [Homework 3 · Exercise 1a](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-03)

> [!QUIZ]
> Two texts are **anagrams** if they contain exactly the same letters with the same counts (ignore case and every non-letter character).
>
> 1. Write `bool isAnagram(char s[], char t[])` using **one** array `int c[26]`.
> 2. Write the results (1 or 0) for `("Listen", "Silent")`, `("Dormitory", "Dirty room")`, `("apple", "paple!")` and `("aab", "abb")`.
> 3. Compare its time complexity with "generate all permutations of s (Homework 2) and check whether t is one of them".

> [!HINT 1]
> Add 1 for each letter of s and subtract 1 for each letter of t.

> [!HINT 2]
> The texts are anagrams exactly when every counter ends at 0.

> [!ANSWER]
> **1.**
>
> ```cpp
> bool isAnagram(char s[], char t[]) {
>     int c[26] = {0};
>     for (int i = 0; s[i] != '\0'; ++i) {
>         char ch = s[i];
>         if (ch >= 'A' && ch <= 'Z') c[ch - 'A']++;
>         else if (ch >= 'a' && ch <= 'z') c[ch - 'a']++;
>     }
>     for (int i = 0; t[i] != '\0'; ++i) {
>         char ch = t[i];
>         if (ch >= 'A' && ch <= 'Z') c[ch - 'A']--;
>         else if (ch >= 'a' && ch <= 'z') c[ch - 'a']--;
>     }
>     for (int i = 0; i < 26; ++i)
>         if (c[i] != 0) return false;
>     return true;
> }
> ```
>
> **2.** `1`, `1`, `1`, `0`. In `("aab", "abb")`, A ends at +1 and B at −1.
>
> **3.** Counting is O(|s| + |t| + 26), i.e. linear. Generating all permutations of s needs n! arrangements (each O(n) to compare), so even 12 letters already give 479,001,600 permutations.
