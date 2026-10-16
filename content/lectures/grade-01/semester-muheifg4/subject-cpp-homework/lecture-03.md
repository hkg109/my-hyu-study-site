---
title: "Homework 3 · 문자 빈도와 세로 히스토그램"
description: "C 문자열을 순회해 알파벳 빈도를 세고, 카운트 배열을 세로 막대그래프로 출력합니다."
order: 3
published: true
objectives:
  - "널 문자로 끝나는 C 문자열을 안전하게 순회할 수 있다."
  - "문자를 배열 인덱스로 변환해 대소문자 빈도를 함께 셀 수 있다."
  - "카운트 배열을 행과 열의 관점으로 바꾸어 세로 히스토그램을 출력할 수 있다."
---

Homework 3은 하나의 카운트 배열을 두 방식으로 읽는 문제입니다. 먼저 문자열을 왼쪽에서 오른쪽으로 읽어 빈도를 만들고, 그다음 빈도를 위에서 아래로 읽어 세로 막대그래프를 그립니다.

[Homework 1](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-01) · [Homework 2](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02) · [Homework 3](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-03)

> 출처: **Homework 3.doc**와 `Code_Exercise_1.cpp`. 정답 코드는 제공 파일의 구현을 유지했습니다.

## 문제 1a · 알파벳 빈도 세기

### 문제 이해

`void count_chars(char text[])` 함수는 널 문자 `\0`로 끝나는 C 문자열을 받아 A부터 Z까지 각 알파벳의 등장 횟수를 출력합니다. 대문자와 소문자는 같은 알파벳으로 합산합니다.

~~~text
counter[0]  → A 또는 a의 개수
counter[1]  → B 또는 b의 개수
...
counter[25] → Z 또는 z의 개수
~~~

영문 대문자의 코드 값은 연속이고 소문자도 연속입니다. 따라서 대문자라면 `ch - 'A'`, 소문자라면 `ch - 'a'`가 0~25의 인덱스가 됩니다. 제공 코드는 같은 원리를 ASCII 코드 값 65와 97로 표현합니다.

### 문자열 순회

~~~cpp
while ((ch = text[i]) != '\0') {
    // ch 처리
    i++;
}
~~~

대입식 전체의 값은 대입된 문자입니다. 현재 문자를 `ch`에 저장한 뒤 그 값이 널 문자인지 검사합니다. 공백, 마침표 같은 문자는 알파벳 범위에 들어오지 않으므로 카운트하지 않고 다음 위치로 넘어갑니다.

## 문제 1b · 세로 막대그래프 출력

가장 높은 빈도 `max`를 찾은 뒤 높이 `j`를 `max`부터 1까지 줄입니다. 각 행에서 `counter[i] >= j`이면 별을, 아니면 공백을 출력합니다.

예를 들어 A, B, C의 빈도가 각각 3, 1, 2라면 다음처럼 읽습니다.

| 출력 높이 `j` | A: 3 | B: 1 | C: 2 | 출력 행 |
| ---: | :---: | :---: | :---: | --- |
| 3 | `*` | 공백 | 공백 | `*  ` |
| 2 | `*` | 공백 | `*` | `* *` |
| 1 | `*` | `*` | `*` | `***` |

마지막에 `ABCDEFGHIJKLMNOPQRSTUVWXYZ`를 출력하면 각 열이 어떤 문자에 해당하는지 알 수 있습니다.

<Answer>

~~~cpp title="homework3_exercise1.cpp" showLineNumbers
#include <iostream>

void print_histogram(int counter[]) {
    int max = 0;
    for (int i = 0; i < 26; i++)
        if (counter[i] > max)
            max = counter[i];

    for (int j = max; j > 0; j--) {
        for (int i = 0; i < 26; i++)
            if (counter[i] >= j)
                std::cout << "*";
            else
                std::cout << " ";
        std::cout << std::endl;
    }

    for (int i = 0; i < 26; i++) {
        char ch = 65 + i;
        std::cout << ch;
    }
    std::cout << std::endl;
}

void count_chars(char text[]) {
    int counter[26] = {
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    };

    int i = 0;
    char ch;
    while ((ch = text[i]) != '\0') {
        if (ch >= 65 && ch <= 90)
            counter[ch - 65]++;
        if (ch >= 97 && ch <= 122)
            counter[ch - 97]++;
        i++;
    }

    for (i = 0; i < 26; i++) {
        char chUpper = 65 + i;
        char chLower = 97 + i;
        std::cout << chUpper << ", " << chLower << " : " << counter[i] << std::endl;
    }

    print_histogram(counter);
}

int main() {
    char text[] = "Today is a nice day for having a little picnic.";
    count_chars(text);
    return 0;
}
~~~

</Answer>

## 코드 실행 흐름

1. `counter[26]`의 모든 원소를 0으로 초기화합니다.
2. `text[i]`가 널 문자가 될 때까지 한 글자씩 읽습니다.
3. 대문자면 `counter[ch - 65]`, 소문자면 `counter[ch - 97]`를 증가시킵니다.
4. A/a부터 Z/z까지 빈도표를 출력합니다.
5. 가장 큰 빈도를 구하고, 그 높이부터 한 줄씩 내려오며 별 또는 공백을 출력합니다.
6. 마지막 행에 A부터 Z까지 출력합니다.

문자열 길이를 n, 가장 큰 빈도를 h라고 하면 문자 세기는 O(n), 빈도표 출력은 O(26), 히스토그램은 O(26h)입니다. 알파벳 26개는 고정이므로 전체를 O(n + h)로 볼 수 있고, 카운트 배열의 추가 공간은 O(1)입니다.

## 실수하기 쉬운 부분

> [!CAUTION]
> `counter[ch]`를 사용하면 문자 코드 값 자체를 인덱스로 사용하므로 크기 26인 배열 범위를 벗어납니다. 반드시 `'A'` 또는 `'a'`를 빼 0~25로 변환해야 합니다.

- 카운트 배열을 초기화하지 않으면 쓰레기 값에서 증가가 시작됩니다.
- 문자열의 끝은 글자 `'0'`이 아니라 널 문자 `'\0'`입니다.
- 히스토그램 조건을 `counter[i] == j`로 쓰면 막대의 꼭대기만 출력됩니다. 아래 칸도 채우려면 `counter[i] >= j`여야 합니다.
- `65`, `90`, `97`, `122` 대신 `'A'`, `'Z'`, `'a'`, `'z'`를 쓰면 의도가 더 잘 드러납니다. 제공 코드는 ASCII 값에 기반합니다.
- 음수가 될 수 있는 `char` 값을 `<cctype>` 함수에 직접 전달할 때는 `unsigned char` 변환이 필요합니다. 이 정답은 ASCII 범위를 직접 비교하므로 해당 함수를 사용하지 않습니다.

## 마무리 점검

- 빈도 배열은 문자 종류를 인덱스로 바꾸는 대표적인 카운팅 패턴입니다.
- 대문자와 소문자는 서로 다른 기준 문자를 빼도 같은 0~25 위치로 합쳐집니다.
- 세로 히스토그램은 각 빈도를 높이 기준으로 다시 읽는 문제입니다.
