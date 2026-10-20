---
title: "6주차: 정규표현식, Pandas 문자열, XML, JSON"
description: "정규표현식 메타문자와 re 모듈의 match·search·findall·finditer, Pandas .str 문자열 처리, ElementTree로 XML 읽기·수정·만들기, json 모듈의 loads·load·dumps를 Drill 601–606 코드와 실행 결과로 정리합니다."
order: 6
published: true
duration: 120
tags: [AI-R-PY, 정규표현식, re, Pandas, XML, JSON]
objectives:
  - 정규표현식 메타문자(^ $ . \s \S * + ? [] {} ())의 뜻을 읽고 쓸 수 있다.
  - re 모듈의 match, search, findall, finditer의 차이를 설명할 수 있다.
  - 괄호 그룹으로 원하는 부분만 추출할 수 있다.
  - Pandas의 .str 접근자로 열 전체의 문자열을 가공·검색·치환할 수 있다.
  - ElementTree로 XML을 탐색·수정·생성하고, json 모듈로 JSON과 파이썬 객체를 변환할 수 있다.
---

## 학습 경로

[이전: 5주차 · NumPy](/lectures/grade-01/semester-muheifg4/subject-muhz3nd1/lecture-05) · [다음: 7주차 · 데이터 클리닝과 시각화](/lectures/grade-01/semester-muheifg4/subject-muhz3nd1/lecture-07)

**범위:** 6주차 슬라이드 3–47 · Drill 601–606 · 실습 노트북 `RPY6주차.ipynb` · 실습 파일 `mbox-short.txt`, `country_data.xml`, `person.json`

## 단원 도입

> [!BOARD]
> **이번 주의 흐름**
> - **PART 1** 정규표현식 문법 → 메타문자 → 문자 클래스 `[ ]` → 반복 `* + ? {m,n}` → 그룹 `( )`
> - **PART 2** 파이썬 `re` 모듈 → `match` vs `search` → `findall` vs `finditer` → match 객체의 `group`·`start`·`end`·`span`
> - **PART 3** Pandas 문자열 → `.str.upper`·`split`·`get`·`cat`·`contains`·`replace` (Drill 601–603)
> - **PART 4** 데이터 교환 형식 → XML(ElementTree, Drill 604–605) → JSON(`json`, Drill 606)

| 핵심 포인트 | 중요도 | 이렇게 확인한다 |
|---|:---:|---|
| 메타문자 표(`^ $ . \s \S * + [ ] ( )`) | ★★★ | 패턴을 보고 어떤 문자열과 매치되는지 판단하기 |
| `match`(처음부터) vs `search`(전체에서) | ★★★ | `"3 python"`에 두 메서드를 적용한 결과 쓰기 |
| `findall`(리스트) vs `finditer`(반복자) | ★★ | 결과의 자료형과 두 번 순회했을 때의 차이 |
| 괄호 그룹으로 숫자만 추출 | ★★ | `^X\S*: ([0-9.]+)`의 결과 예측하기 |
| `.str` 접근자와 `regex=True` | ★★ | `split(', ').str.get(1)` 결과 쓰기 |
| XML `find`·`findall`·`iter`, `get` vs `.text` | ★★ | 태그·속성·텍스트를 꺼내는 코드 쓰기 |
| JSON `loads`(문자열) vs `load`(파일), `dumps` | ★★ | 함수 이름의 `s` 의미 설명하기 |

**형광펜 읽는 법:** ==yellow:노랑== 핵심 정의·결론 · ==red:빨강== 헷갈리기 쉬운 구분·함정 · ==blue:파랑== 외워야 할 순서·목록

**코드 읽는 법:** 코드 옆 주석의 `# →` 뒤가 실제 실행 결과다. 패턴 문자열은 모두 ==raw string==(`r'...'`)으로 적었다. 이유는 *raw string을 쓰는 이유*에서 설명한다.

> [!PAGEBREAK]

## PART 1 · 정규표현식 문법

## 정규표현식이란

*3p~4p*

- 찾고자 하는 문자열, 더 나아가 문자열 관련 ‘정보’를 ==yellow:효율적으로 검색하기 위한 표현 방법==
- 컴퓨터 언어의 문법이라기보다 텍스트 **매칭과 서칭을 위한 작은 언어**
- 웹 프로그래밍처럼 문자열을 많이 다루는 분야에서는 거의 필수
- ==와일드카드(wild card)== 기법: 카드 게임의 조커처럼 어떤 문자든 대신할 수 있는 기호를 쓴다
- 배우고 기억하기는 어렵다 → 아래 표를 반복해서 본다

> [!CONCEPT]
> **정규표현식(regular expression, regex)** — 문자열의 ==yellow:패턴(규칙)을 기호로 적은 식==. “`From:`으로 시작하고 `@`가 들어 있는 줄”, “숫자와 점으로만 된 부분” 같은 조건을 짧게 표현한다.

## 메타문자 표

*5p*

| 기호 | 뜻 | 예 |
|---|---|---|
| `^` | ==blue:줄의 시작== | `^From` → From으로 시작 |
| `$` | ==blue:줄의 끝== | `Will$` → Will로 끝남 |
| `.` | 아무 문자 하나 (줄바꿈 `\n` 제외) | `a.b` → aab, a0b |
| `\s` | 공백 문자 하나 | 스페이스, 탭, 줄바꿈 |
| `\S` | 공백이 아닌 문자 하나 | 글자, 숫자, `@` 등 |
| `*` | 앞 문자를 ==0번 이상== 반복 | `ca*t` → ct, cat, caat |
| `*?` | 0번 이상 반복, 가능한 한 적게 (non-greedy) | |
| `+` | 앞 문자를 ==1번 이상== 반복 | `ca+t` → cat, caat |
| `+?` | 1번 이상 반복, 가능한 한 적게 (non-greedy) | |
| `[aeiou]` | 목록 안의 문자 하나 | 모음 하나 |
| `[^XYZ]` | 목록에 ==없는== 문자 하나 | X, Y, Z가 아닌 문자 |
| `[a-z0-9]` | 범위로 지정한 문자 하나 | 소문자 또는 숫자 |
| `(` `)` | ==추출할 부분의 시작과 끝== (그룹) | `rev=([0-9]+)` → 숫자만 추출 |

> [!TRAP]
> `^`는 위치에 따라 뜻이 다르다. 패턴 맨 앞의 `^`는 ==red:“줄의 시작”==이고, 대괄호 안 맨 앞의 `[^...]`는 ==red:“목록에 없는 문자”==다. `^[^0-9]`는 “숫자가 아닌 문자로 시작하는 줄”이다.

## 문자 클래스 [ ]

*6p~9p*

`[ ]` 사이의 문자 중 ==한 개==와 매치된다.

```python
import re

for s in ["a", "before", "dude"]:
    print(s, bool(re.search(r"[abc]", s)))
# → a True        ← "a"가 있음
# → before True   ← "b"가 있음
# → dude False    ← a, b, c 중 아무것도 없음
```

대괄호 안에서 두 문자 사이의 하이픈 `-`는 ==범위(From–To)==를 뜻한다. `[a-c]`는 `[abc]`, `[0-5]`는 `[012345]`와 같다. `[a-zA-Z]`는 알파벳 전체, `[0-9]`는 숫자 전체다.

자주 쓰는 클래스는 줄임 표기가 있다.

| 줄임 | 같은 표현 | 뜻 |
|---|---|---|
| `\d` | `[0-9]` | 숫자 |
| `\D` | `[^0-9]` | 숫자가 아닌 것 |
| `\s` | `[ \t\n\r\f\v]` | 공백 문자 (맨 앞 칸은 스페이스) |
| `\S` | `[^ \t\n\r\f\v]` | 공백이 아닌 것 |
| `\w` | `[a-zA-Z0-9_]` | 영문자·숫자·밑줄 (alphanumeric) |
| `\W` | `[^a-zA-Z0-9_]` | 위가 아닌 것 |

> [!NOTE]
> ==대문자는 소문자의 반대==다. `\d`↔`\D`, `\s`↔`\S`, `\w`↔`\W` 세 쌍만 기억하면 여섯 개를 모두 외운 것이다. 슬라이드의 `￦d`는 한글 글꼴에서 역슬래시 `\`가 원화 기호 `￦`로 보이는 것일 뿐 같은 문자다.

## Dot(.) — 아무 문자 하나

*10p~11p*

```python
for s in ["aab", "a0b", "abc"]:
    print(s, bool(re.match(r"a.b", s)))
# → aab True    ← 가운데 "a"가 . 과 매치
# → a0b True    ← 가운데 "0"이 . 과 매치
# → abc False   ← "a"와 "b" 사이에 문자가 없음
```

> [!TRAP]
> `.`은 ==red:정확히 한 문자==를 뜻한다. 0개는 안 된다. 그래서 `a.b`는 `ab`와 매치되지 않는다. 또한 줄바꿈 문자 `\n`과는 매치되지 않는다. 진짜 마침표 문자를 찾으려면 `\.`으로 쓴다.

## 반복: * + {m,n}

*12p~16p*

| 정규식 | 문자열 | 매치 | 이유 |
|---|---|:---:|---|
| `ca+t` | `ct` | ✗ | `a`가 0번 → `+`는 1번 이상 필요 |
| `ca+t` | `cat` | ○ | `a` 1번 |
| `ca+t` | `caaat` | ○ | `a` 3번 |
| `ca{2}t` | `cat` | ✗ | `a`가 1번뿐 |
| `ca{2}t` | `caat` | ○ | `a`가 정확히 2번 |
| `ca{2,5}t` | `cat` | ✗ | 1번은 범위 밖 |
| `ca{2,5}t` | `caat` | ○ | 2번 |
| `ca{2,5}t` | `caaaaat` | ○ | 5번 |

> [!BOARD]
> **반복 기호 한눈에**
> - `*` = `{0,}` → 0번 이상
> - `+` = `{1,}` → 1번 이상
> - `?` = `{0,1}` → 있어도 되고 없어도 됨
> - `{m}` → 정확히 m번 / `{m,n}` → m~n번 / `{3,}` → 3번 이상 / `{,3}` → 3번 이하
> - 생략된 m은 0, 생략된 n은 무한대

> [!NOTE]
> **greedy와 non-greedy.** `+`와 `*`는 기본적으로 ==가능한 한 길게(greedy)== 매치한다. 뒤에 `?`를 붙이면 ==가능한 한 짧게(non-greedy)== 매치한다.
> ```python
> re.findall(r"<.+>",  "<b>bold</b>")   # → ['<b>bold</b>']   끝까지 길게
> re.findall(r"<.+?>", "<b>bold</b>")   # → ['<b>', '</b>']   짧게 두 번
> ```

## 괄호 ( ) — 필요한 부분만 꺼내기

*5p, 20p*

괄호는 ==yellow:매치는 전체 패턴으로 하되, 결과로 돌려줄 부분만 지정==한다.

```python
line = "X-DSPAM-Confidence: 0.8475"

re.findall(r"^X\S*: [0-9.]+", line)     # → ['X-DSPAM-Confidence: 0.8475']   괄호 없음: 매치 전체
re.findall(r"^X\S*: ([0-9.]+)", line)   # → ['0.8475']                       괄호 안만
```

실습 노트북의 cell 3과 cell 4가 바로 이 차이를 보여 준다. 괄호가 있으면 숫자만 나오고, 없으면 `'X-DSPAM-Confidence: 0.8475'` 같은 줄 전체가 나온다.

> [!PROBLEM]
> **예제 1.** 패턴 `^X\S*: ([0-9.]+)`를 한 덩어리씩 읽으시오.
>
> **풀이.**
> 1. `^X` → 줄이 `X`로 시작
> 2. `\S*` → 공백이 아닌 문자가 0개 이상 (`-DSPAM-Confidence`)
> 3. `: ` → 콜론과 스페이스 한 칸
> 4. `([0-9.]+)` → 숫자 또는 점이 1개 이상, ==이 부분만 추출==
> 5. 결과: `X-DSPAM-Confidence: 0.8475` → `['0.8475']`, `X-DSPAM-Probability: 0.0000` → `['0.0000']`

> [!PAGEBREAK]

## PART 2 · 파이썬 re 모듈

## mbox 파일에서 줄 찾기

*18p~21p*

`mbox-short.txt`는 이메일 기록을 이어 붙인 텍스트 파일이다. 각 예제는 “파일을 한 줄씩 읽고 → 끝의 줄바꿈을 지우고(`rstrip`) → 패턴을 검사”하는 같은 틀을 쓴다.

```python
import re

with open("mbox-short.txt", encoding="utf-8") as hand:
    for line in hand:
        line = line.rstrip()
        if re.search(r"^From:.+@", line):
            print(line)
# → From: stephen.marquard@uct.ac.za
# → From: louis@media.berkeley.edu
# → ... (27줄)
```

| 슬라이드 | 패턴 | 찾는 것 | 실제 결과 예 |
|---|---|---|---|
| 18p | `^From:.+@` | `From:`으로 시작하고, 아무 문자 1개 이상 뒤에 `@`가 있는 줄 | `From: stephen.marquard@uct.ac.za` |
| 19p | `[a-zA-Z0-9]\S+@\S+[a-zA-Z]` | 영문자·숫자로 시작해 공백 없이 `@`를 지나 영문자로 끝나는 부분 = 이메일 주소 | `['stephen.marquard@uct.ac.za']` |
| 20p | `^X\S*: ([0-9.]+)` | `X`로 시작하는 헤더 줄의 숫자 | `['0.8475']` |
| 21p | `^Details: rev=([0-9.]+)` | ==red:아무것도 찾지 못함== (아래 정정) | 없음 |

> [!CAUTION]
> **슬라이드 정정 (21p)** — 실제 파일의 줄은 `Details: http://source.sakaiproject.org/viewsvn/?view=rev&rev=39772`처럼 `Details: ` 바로 뒤에 `rev=`가 오지 않는다. 그래서 `^Details: rev=([0-9.]+)`는 ==red:한 줄도 매치하지 못한다==(실습 노트북 cell 7이 아무것도 출력하지 않은 이유). 중간의 URL을 건너뛰도록 `.*`를 넣은 `^Details: .*rev=([0-9]+)`를 써야 `39772`, `39771`, …이 나온다(cell 5).

> [!NOTE]
> 19p의 설명은 `\S*`(0번 이상)라고 적었지만 코드는 `\S+`(1번 이상)다. 코드 기준으로 외운다. 또 이 패턴은 `<postmaster@collab.sakaiproject.org>`처럼 꺾쇠로 둘러싼 주소에서 `<`와 `>`를 빼고 주소만 꺼낸다. 앞뒤를 `[a-zA-Z0-9]`와 `[a-zA-Z]`로 제한했기 때문이다.

> [!NOTE]
> 실습 노트북은 슬라이드의 `open()` … `for` 대신 `with open(..., encoding="utf-8") as hand:`를 썼다. 4주차에서 배운 대로 `with` 문은 ==파일을 자동으로 닫아 준다==.

## raw string을 쓰는 이유

*18p~22p 보충*

파이썬 문자열에서 `\`는 `\n`(줄바꿈), `\t`(탭)처럼 특수 문자를 만든다. 정규식의 `\s`, `\d`, `\b`도 `\`로 시작하므로 일반 문자열로 쓰면 둘이 충돌한다.

```python
"\b"    # 파이썬이 백스페이스 문자로 바꿔 버림 → 정규식의 단어 경계가 아님
r"\b"   # 역슬래시와 b 두 글자 그대로 → 정규식이 단어 경계로 해석
```

> [!TRAP]
> 슬라이드처럼 `re.findall('^X\S*: ([0-9.]+)', line)`라고 써도 지금은 동작하지만, 최신 파이썬(3.12 이상)은 `SyntaxWarning: invalid escape sequence '\S'` ==red:경고==를 낸다. 패턴 문자열 앞에는 항상 `r`을 ==붙인다==.

## re 모듈의 네 가지 검색 메서드

*17p, 22p~23p*

| 메서드 | 하는 일 | 결과 |
|---|---|---|
| `match()` | 문자열의 ==blue:처음부터== 패턴과 맞는지 검사 | match 객체 또는 `None` |
| `search()` | 문자열 ==blue:전체에서== 처음 맞는 곳을 찾음 | match 객체 또는 `None` |
| `findall()` | 맞는 부분 문자열을 ==모두== 찾음 | ==리스트== |
| `finditer()` | 맞는 부분을 ==모두== 찾음 | ==반복자(iterator)==, 각 원소는 match 객체 |

패턴을 여러 번 쓸 때는 `re.compile()`로 패턴 객체를 미리 만들어 두는 것이 편하다.

```python
m = re.match(r"[a-z]+", "python")     # 축약형: 한 번만 쓸 때

p = re.compile(r"[a-z]+")             # 컴파일형: 여러 번 쓸 때
m = p.match("python")
```

## match vs search

*24p~27p*

```python
p = re.compile(r"[a-z]+")

p.match("python")      # → <re.Match object; span=(0, 6), match='python'>
p.match("3 python")    # → None   ← 첫 글자 "3"이 [a-z]가 아님
p.search("python")     # → <re.Match object; span=(0, 6), match='python'>
p.search("3 python")   # → <re.Match object; span=(2, 8), match='python'>   ← 전체를 훑어 찾음
```

> [!TRAP]
> `match()`는 ==red:문자열 맨 앞에서만== 검사한다. 중간에 패턴이 있어도 맨 앞이 안 맞으면 `None`이다. “어딘가에 있는지”를 찾으려면 `search()`를 쓴다. 슬라이드의 `<_sre.SRE_Match object at 0x...>`는 옛 파이썬의 표시 방식이고, 지금은 `<re.Match object; span=(0, 6), match='python'>`처럼 위치와 내용까지 보여 준다.

## findall vs finditer

*28p~29p*

```python
p.findall("life is too short")    # → ['life', 'is', 'too', 'short']

result = p.finditer("life is too short")
result                            # → <callable_iterator object at 0x...>
for r in result:
    print(r.group())              # → life / is / too / short
```

> [!TRAP]
> ==red:반복자는 한 번 순회하면 소진된다.== 실습 노트북 cell 8은 `finditer` 결과를 두 번 `for`로 돌렸는데, 두 번째 루프는 ==아무것도 출력하지 않았다==. 리스트를 돌려주는 `findall`은 cell 9처럼 몇 번이든 다시 순회할 수 있다. 결과를 여러 번 써야 하면 `list(p.finditer(...))`로 바꿔 저장한다.

## match 객체의 메서드

*30p~31p*

| 메서드 | 돌려주는 것 |
|---|---|
| `group()` | 매치된 문자열 |
| `start()` | 매치 시작 위치 |
| `end()` | 매치 끝 위치 (그 위치의 문자는 포함하지 않음) |
| `span()` | `(start, end)` 튜플 |

```python
m = p.match("python")
m.group(), m.start(), m.end(), m.span()   # → ('python', 0, 6, (0, 6))

m = p.search("3 python")
m.group(), m.start(), m.end(), m.span()   # → ('python', 2, 8, (2, 8))
```

```python
text = "3 Hello Python3 World 2026!"
m = re.compile(r"[a-zA-Z]+").search(text)
m.group(), m.start(), m.end()             # → ('Hello', 2, 7)
```

> [!NOTE]
> `end()`는 슬라이스의 끝처럼 ==마지막 글자 다음 위치==다. 그래서 `text[m.start():m.end()]`가 정확히 `m.group()`과 같다. 괄호 그룹이 있으면 `m.group(1)`, `m.group(2)`로 각 그룹을 꺼낸다.

> [!CHECK]
> **1.** 정규식 `^\d+` 에 대해 `re.match`와 `re.search`를 문자열 `"abc 123"`에 적용한 결과는 각각 무엇인가?
>
> **2.** `re.findall(r"rev=([0-9]+)", "view=rev&rev=39772")`의 결과는?
>
> **3.** `ca{2,}t`와 매치되는 것을 모두 고르시오: `cat`, `caat`, `caaaaaat`

> [!PAGEBREAK]

## PART 3 · Pandas 문자열 처리

## .str 접근자

*32p*

Series에 `.str`을 붙이면 ==yellow:파이썬 문자열 메서드를 열 전체에 한 번에 적용==할 수 있다. 실습 데이터는 보스턴 마라톤 기록 1,000행이다.

```python
import pandas as pd

boston_url = "https://andybek.com/pandas-marathon"
boston = pd.read_csv(boston_url)
boston.info()
# → RangeIndex: 1000 entries, 0 to 999
# → Name, Age, M/F, City, State, Country, Official Time, Overall, Gender, Years Ran
```

### Drill 601 · 대소문자, 공백, 분리, 결합

```python
boston.City.str.upper()        # KERINGET, PORTLAND, ...
boston.City.str.lower()        # keringet, portland, ...
boston.City.str.capitalize()   # 첫 글자만 대문자: Machida-City → Machida-city
boston.City.str.swapcase()     # 대소문자 뒤집기: Keringet → kERINGET

boston.Name.iloc[0:2].str.strip()   # 앞뒤 공백 제거 → 'Kirui, Geoffrey', 'Rupp, Galen'
```

```python
boston.Name.str.split(", ")[0]               # → [' Kirui', 'Geoffrey ']   0번 행의 리스트
boston.Name.str.split(", ").str.get(1)       # → 'Geoffrey ', 'Galen   ', ...   각 리스트의 1번 원소
boston.Name.str.split(", ").str.get(0)       # → 'Kirui', 'Rupp', ...

boston["First Name"] = boston.Name.str.split(", ").str.get(1)
boston["Last Name"]  = boston.Name.str.split(", ").str.get(0)

boston["M/F"].str.cat(boston.Age.astype(str), sep="_")   # → 'M_24', 'M_30', ...
```

> [!TRAP]
> - `boston.Name.str.split(", ")[0]`은 ==red:0번 행의 리스트==(`[' Kirui', 'Geoffrey ']`)다. 모든 행의 첫 조각을 원하면 `.str.get(0)` 또는 `.str[0]`을 쓴다.
> - 원본 이름에 앞뒤 공백이 섞여 있어서 `'Geoffrey '`처럼 ==공백이 남는다==. 이름 열을 새로 만들 때는 `boston.Name.str.strip().str.split(", ")`처럼 먼저 `strip()`한다.
> - `str.cat`은 ==문자열끼리만== 이어 붙인다. 숫자 열 `Age`는 `.astype(str)`로 바꾼 뒤 붙인다.
> - `capitalize()`는 ==첫 글자만== 대문자로 만들고 나머지는 모두 소문자로 바꾼다. 단어마다 대문자로 만들려면 `title()`을 쓴다.

### Drill 602 · 자르기와 패턴 매치

*33p*

```python
boston.Country.str.slice(0, 2, 1)               # 'KEN' → 'KE'
boston.Country.str.slice(start=-2)              # 'KEN' → 'EN'   뒤에서 두 글자
boston.Country.str.match("ITA")                 # 처음부터 ITA인지 True/False
boston[boston.Country.str.match("ITA")]         # 이탈리아 선수 행만
wills = boston.Name.str.contains("Will")        # 이름 어딘가에 Will이 있는지
```

### Drill 603 · contains와 replace에 정규식 쓰기

*34p*

```python
boston.Name[boston.Name.str.contains(r"[wW]ill", regex=True)]
# → Vanos, William / Guzick, William F / ... / Williamson, David / ... (15명)

boston.Name[boston.Name.str.contains(r",\s[wW]ill$", regex=True)]
# → Cunha, Will / Swenson, Will / Vargas, Will / Rivera, Will   (이름이 정확히 Will)

boston["Official Time"].str.replace(
    r"(\d+):(\d+):(\d+)",
    r"\1 hours, \2 minutes, and \3 seconds",
    regex=True,
)
# → '2 hours, 09 minutes, and 37 seconds', ...
```

> [!NOTE]
> - `[wW]ill`은 ==성 Williamson까지== 잡는다. `,\s[wW]ill$`는 “쉼표, 공백, Will, 줄 끝”이므로 ==이름이 정확히 Will인 사람만== 남는다. 슬라이드의 `\b`(단어 경계) 버전 `,\s[wW]ill\b`는 `Will` 뒤에 다른 글자가 붙지 않은 경우를 찾는다.
> - `replace`의 두 번째 인자에서 `\1`, `\2`, `\3`은 ==첫째·둘째·셋째 괄호 그룹이 잡은 값==이다. `2:09:37`은 그룹이 `2`, `09`, `37`이 된다.

> [!TRAP]
> 슬라이드 34p는 `str.replace(r'(\d+):(\d+):(\d+)', r'\1 hours, ...')`에 `regex=True`가 없다. ==red:Pandas 2.0부터== `str.replace`의 기본값은 `regex=False`라서, 그렇게 쓰면 패턴을 글자 그대로 찾다가 아무것도 바꾸지 못하고 `2:09:37`이 그대로 남는다. 실습 노트북처럼 `regex=True`를 꼭 쓴다. 결측값이 있는 열에 `contains`를 쓰면 결과에도 결측값이 생기므로, 필터에 쓸 때는 `na=False`를 함께 준다.

| `.str` 메서드 | 하는 일 |
|---|---|
| `upper`·`lower`·`capitalize`·`swapcase`·`title` | 대소문자 변환 |
| `strip`·`lstrip`·`rstrip` | 공백 제거 |
| `split(sep)` → `.str.get(i)` | 나눈 뒤 i번 조각 꺼내기 |
| `cat(other, sep)` | 두 문자열 열 이어 붙이기 |
| `slice(start, stop, step)` | 부분 문자열 |
| `match(pat)` | 처음부터 패턴과 맞는지 |
| `contains(pat, regex=True, na=False)` | 어딘가에 패턴이 있는지 |
| `replace(pat, repl, regex=True)` | 패턴을 찾아 치환 |

> [!PAGEBREAK]

## PART 4 · 데이터 교환 형식: XML과 JSON

## XML의 구조

*35p~37p*

```xml
<person>
  <name>Chuck</name>
  <phone type="intl">
    +1 734 303 4456
  </phone>
  <email hide="yes" />
</person>
```

> [!BOARD]
> **XML을 나무로 읽기**
> - ==blue:태그(tag)== `person`, `name`, `phone`, `email` → 나무의 마디(요소, element)
> - ==blue:텍스트(text)== `Chuck`, `+1 734 303 4456` → 태그 사이의 내용
> - ==blue:속성(attribute)== `type="intl"`, `hide="yes"` → 여는 태그 안의 `이름="값"`
> - `<email hide="yes" />`처럼 `/>`로 끝나면 내용이 없는 빈 요소
> - 맨 바깥 요소(`person`, `data`)가 ==뿌리(root)==

## Drill 604 · ElementTree로 XML 읽기

*38p*

`country_data.xml`은 나라 세 개(Liechtenstein, Singapore, Panama)의 순위·연도·1인당 GDP·이웃 나라를 담고 있다.

```python
import xml.etree.ElementTree as ET

tree = ET.parse("country_data.xml")   # 파일에서 읽기
root = tree.getroot()                 # 뿌리 요소 <data>

root.tag        # → 'data'
root.attrib     # → {}            <data>에는 속성이 없음

for child in root:
    print(child.tag, child.attrib)
# → country {'name': 'Liechtenstein'}
# → country {'name': 'Singapore'}
# → country {'name': 'Panama'}

root[0][1].text   # → '2008'   0번 country의 1번 자식 <year>
```

> [!NOTE]
> 요소는 리스트처럼 ==인덱스로 자식에 접근==할 수 있다. `root[0]`은 첫 번째 `<country>`, `root[0][0]`은 `<rank>`, `root[0][1]`은 `<year>`다. 파일 대신 문자열을 읽을 때는 `ET.fromstring(xml_data)`가 곧바로 뿌리 요소를 돌려준다(실습 노트북 cell 26).

## Drill 605 · 찾기, 수정, 저장

*39p~41p*

```python
for neighbor in root.iter("neighbor"):     # 깊이에 상관없이 모든 <neighbor>
    print(neighbor.attrib)
# → {'name': 'Austria', 'direction': 'E'} ... (5개)

for country in root.findall("country"):    # 바로 아래 자식 중 <country>
    rank = country.find("rank").text       # 첫 번째 <rank>의 텍스트
    name = country.get("name")             # 속성 name의 값
    print(name, rank)
# → Liechtenstein 1 / Singapore 4 / Panama 68
```

| 메서드 | 찾는 범위 | 결과 |
|---|---|---|
| `elem.find("tag")` | ==바로 아래 자식== 중 첫 번째 | 요소 하나 또는 `None` |
| `elem.findall("tag")` | ==바로 아래 자식== 전부 | 요소 리스트 |
| `elem.iter("tag")` | ==모든 후손==(손자 이하 포함) | 반복자 |
| `elem.findtext("tag")` | 바로 아래 첫 번째 자식의 텍스트 | 문자열 |
| `elem.get("attr")` | 자기 자신의 속성 | 속성 값 문자열 |
| `elem.text` | 자기 자신의 텍스트 | 문자열 |

> [!TRAP]
> - `.get()`은 ==red:속성==, `.text`는 ==red:태그 사이 내용==이다. `<country name="Panama">`에서 나라 이름은 `country.get("name")`이지 `country.text`가 아니다.
> - `root.findall("neighbor")`는 ==red:빈 리스트==다. `<neighbor>`는 `<data>`의 손자라서 바로 아래 자식이 아니다. 모든 깊이에서 찾으려면 `root.iter("neighbor")` 또는 `root.findall(".//neighbor")`를 쓴다.
> - `.text`는 항상 ==문자열==이다. 계산하려면 `int(country.find("rank").text)`처럼 변환한다.

**수정하고 저장하기**

```python
for rank in root.iter("rank"):
    new_rank = int(rank.text) + 1
    rank.text = str(new_rank)        # 텍스트 바꾸기 (문자열로 넣어야 함)
    rank.set("updated", "yes")       # 속성 추가
tree.write("output.xml")

for country in root.findall("country"):
    rank = int(country.find("rank").text)
    if rank > 50:
        root.remove(country)         # 순위가 50보다 낮은 나라 삭제
tree.write("output2.xml")
```

`output2.xml`에는 Panama(순위 69)가 빠지고, 남은 두 나라의 `<rank>`가 `<rank updated="yes">2</rank>`, `<rank updated="yes">5</rank>`로 바뀌어 있다.

> [!CAUTION]
> **슬라이드 정정 (39p)** — `print(neighbor.attrib))`는 닫는 괄호가 하나 더 있어 `SyntaxError`가 난다. `print(neighbor.attrib)`가 맞다.

## XML을 DataFrame으로

*실습 노트북 cell 25~26*

```python
root = ET.fromstring(xml_data)
rows = []
for country in root.findall("country"):
    rows.append({
        "name": country.get("name"),
        "rank": int(country.findtext("rank")),
        "year": int(country.findtext("year")),
        "gdppc": int(country.findtext("gdppc")),
        "neighbors": [n.get("name") for n in country.findall("neighbor")],
    })

df = pd.DataFrame(rows)
#             name  rank  year   gdppc               neighbors
# 0  Liechtenstein     1  2008  141100  [Austria, Switzerland]
# 1      Singapore     4  2011   59900              [Malaysia]
# 2         Panama    68  2011   13600  [Costa Rica, Colombia]
```

> [!NOTE]
> “==한 행은 딕셔너리 하나==”로 리스트에 모은 뒤 `pd.DataFrame(rows)`로 바꾸는 방법은 XML, JSON, 웹 API 데이터를 표로 만들 때 공통으로 쓰는 패턴이다([보충 · Pandas 기본기능](/lectures/grade-01/semester-muheifg4/subject-muhz3nd1/lecture-04)의 *list of dict* 참고).

## XML 만들기

*42p*

```python
a = ET.Element("a")            # 뿌리 요소
b = ET.SubElement(a, "b")      # a의 자식
c = ET.SubElement(a, "c")      # a의 자식
d = ET.SubElement(c, "d")      # c의 자식
ET.dump(a)
# → <a><b /><c><d /></c></a>
```

## JSON이란

*43p~45p*

- ==yellow:XML보다 훨씬 간단한 데이터 교환 형식==
- 사람이 읽고 쓰기 쉽고, 기계가 분석·생성하기도 쉬움
- 자바스크립트(JavaScript) 문법에 기반 → 웹에서 널리 쓰임

```json
{"name": "Bob",
 "languages": ["English", "Fench"]
}
```

| JSON | 파이썬 |
|---|---|
| 객체 `{ }` | `dict` |
| 배열 `[ ]` | `list` |
| 문자열 `"..."` | `str` |
| 숫자 | `int`, `float` |
| `true` / `false` | `True` / `False` |
| `null` | `None` |

> [!TRAP]
> JSON 문자열은 ==red:반드시 큰따옴표==를 쓴다. `{'name': 'Bob'}`처럼 작은따옴표로 쓴 문자열을 `json.loads`에 넣으면 `JSONDecodeError`가 난다. 또 JSON의 `null`, `true`는 소문자이고, 파이썬으로 읽으면 `None`, `True`가 된다.

## Drill 606 · json 모듈

*44p~47p*

```python
import json

person = '{"name": "Bob", "languages": ["English", "Fench"]}'   # JSON 문자열
person_dict = json.loads(person)       # 문자열 → 파이썬 dict
person_dict                            # → {'name': 'Bob', 'languages': ['English', 'Fench']}
person_dict["languages"]               # → ['English', 'Fench']

with open("person.json") as f:
    data = json.load(f)                # 파일 → 파이썬 dict

person_json = json.dumps({"name": "Bob", "age": 12, "children": None})
person_json                            # → '{"name": "Bob", "age": 12, "children": null}'
```

```python
person_string = '{"name": "Bob", "languages": "English", "numbers": [2, 1.6, null]}'
person_dict = json.loads(person_string)
print(json.dumps(person_dict, indent=4, sort_keys=True))
# {
#     "languages": "English",
#     "name": "Bob",
#     "numbers": [
#         2,
#         1.6,
#         null
#     ]
# }
```

> [!BOARD]
> **json 함수 이름 외우기: ==blue:s는 string==**
> - `json.loads(문자열)` → 파이썬 객체 (load **s**tring)
> - `json.load(파일)` → 파이썬 객체
> - `json.dumps(객체)` → JSON 문자열 (dump **s**tring)
> - `json.dump(객체, 파일)` → 파일에 저장
> - 옵션: `indent=4` 들여쓰기, `sort_keys=True` 키 정렬, `ensure_ascii=False` 한글을 그대로 저장

> [!NOTE]
> 한글이 든 딕셔너리를 그냥 `json.dumps`하면 `"이름"`처럼 유니코드 이스케이프로 바뀐다. 사람이 읽을 파일로 저장할 때는 `json.dump(data, f, ensure_ascii=False, indent=2)`와 `open(..., "w", encoding="utf-8")`를 함께 쓴다.

> [!CHECK]
> **4.** `boston.Name.str.split(", ").str.get(0)`과 `boston.Name.str.split(", ")[0]`의 차이를 쓰시오.
>
> **5.** `<country name="Panama"><rank>68</rank></country>`에서 `Panama`와 `68`을 꺼내는 코드를 각각 쓰시오(`country`는 이 요소).
>
> **6.** `json.loads`와 `json.load`의 차이는?

---

## 정답과 해설

**1.** `re.match(r"^\d+", "abc 123")` → `None`(맨 앞이 숫자가 아님). `re.search(r"^\d+", "abc 123")`도 → `None`. 패턴에 `^`가 있어 “줄의 시작”에 숫자가 와야 하기 때문이다. `^`를 빼고 `re.search(r"\d+", ...)`로 쓰면 `'123'`을 찾는다.

**2.** `['39772']`. 첫 번째 `rev`는 뒤에 `=`이 아니라 `&`가 오므로 맞지 않고, 두 번째 `rev=39772`의 괄호 부분만 추출된다.

**3.** `caat`, `caaaaaat`. `{2,}`는 2번 이상이다.

**4.** `.str.get(0)`은 ==모든 행==의 리스트에서 0번 조각을 꺼낸 Series(성 목록)이고, `[0]`은 ==0번 행==의 리스트 하나(`[' Kirui', 'Geoffrey ']`)다.

**5.** `country.get("name")` → `'Panama'`, `country.find("rank").text` → `'68'`(문자열). 숫자로 쓰려면 `int(...)`로 감싼다.

**6.** `loads`는 ==JSON 문자열==을, `load`는 ==열린 파일 객체==를 받아 파이썬 객체로 바꾼다.

## 플래시카드

> [!FLASHCARD]
> Q: 6주차 — 정규식 `^`, `$`, `.`, `\s`, `\S`의 뜻은?
> A: 줄의 시작, 줄의 끝, 줄바꿈을 뺀 아무 문자 하나, 공백 문자 하나, 공백이 아닌 문자 하나.

> [!FLASHCARD]
> Q: 6주차 — `*`, `+`, `{m,n}`의 차이는?
> A: `*`는 0번 이상(`{0,}`), `+`는 1번 이상(`{1,}`), `{m,n}`은 m번 이상 n번 이하 반복.

> [!FLASHCARD]
> Q: 6주차 — `[^0-9]`와 `^[0-9]`의 차이는?
> A: `[^0-9]`는 숫자가 아닌 문자 하나, `^[0-9]`는 숫자로 시작하는 줄. 대괄호 안의 ^는 부정, 밖의 ^는 줄의 시작.

> [!FLASHCARD]
> Q: 6주차 — `match()`와 `search()`의 차이는?
> A: match는 문자열 처음부터만 검사하고, search는 전체를 훑어 처음 맞는 곳을 찾는다. `"3 python"`에 `[a-z]+`를 쓰면 match는 None, search는 'python'.

> [!FLASHCARD]
> Q: 6주차 — `findall()`과 `finditer()`의 차이는?
> A: findall은 문자열 리스트를, finditer는 match 객체를 하나씩 내는 반복자를 돌려준다. 반복자는 한 번 순회하면 소진된다.

> [!FLASHCARD]
> Q: 6주차 — 정규식에서 괄호 ( )의 역할은?
> A: 매치는 전체 패턴으로 하되, 결과로 꺼낼 부분을 지정한다. `^X\S*: ([0-9.]+)`는 숫자만 돌려준다. replace에서는 `\1`, `\2`로 다시 쓸 수 있다.

> [!FLASHCARD]
> Q: 6주차 — Pandas `str.replace`에 정규식을 쓸 때 주의할 점은?
> A: Pandas 2.0부터 기본값이 `regex=False`이므로 `regex=True`를 반드시 써야 한다.

> [!FLASHCARD]
> Q: 6주차 — XML에서 `.get()`, `.text`, `find`, `findall`, `iter`의 차이는?
> A: get은 속성 값, text는 태그 사이 내용. find는 바로 아래 자식 중 첫 번째, findall은 바로 아래 자식 전부, iter는 모든 후손을 찾는다.

> [!FLASHCARD]
> Q: 6주차 — `json.loads`, `json.load`, `json.dumps`, `json.dump`는?
> A: s는 string. loads는 JSON 문자열→객체, load는 파일→객체, dumps는 객체→JSON 문자열, dump는 객체→파일.

## 핵심 점검

- 정규식 패턴 문자열 앞에는 역슬래시 충돌을 막기 위해 {{r}}을 붙인다.
- `+`는 앞 문자를 {{1번 이상}}, `*`는 {{0번 이상}} 반복한다.
- 문자열 처음부터 검사하는 메서드는 {{match}}, 전체에서 찾는 메서드는 {{search}}다.
- `findall`의 결과 자료형은 {{리스트}}다.
- `^Details: rev=`가 실제 mbox 줄과 맞지 않는 이유는 `Details: ` 뒤에 {{URL}}이 먼저 오기 때문이다.
- Pandas에서 열 전체에 문자열 메서드를 쓰려면 {{.str}} 접근자를 붙인다.
- XML 요소의 속성 값은 {{.get()}}, 태그 사이의 내용은 {{.text}}로 꺼낸다.
- JSON의 `null`은 파이썬에서 {{None}}이 된다.
