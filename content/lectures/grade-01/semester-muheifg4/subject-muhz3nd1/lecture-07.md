---
title: "7주차: 데이터 클리닝, 시각화, 기술통계"
description: "불필요한 열 제거와 인덱스 설정, apply와 np.where를 이용한 문자열 정리, na_values·try/except·fillna를 이용한 결측치 처리, matplotlib 선 그래프 꾸미기, describe와 상자 그림·히스토그램·산점도를 Drill 701–708 코드와 그림으로 정리합니다."
order: 7
published: true
duration: 110
tags: [AI-R-PY, Pandas, 데이터클리닝, 결측치, matplotlib, 기술통계]
objectives:
  - drop과 set_index로 분석에 필요한 열과 인덱스만 남길 수 있다.
  - apply와 사용자 함수, np.where로 지저분한 문자열 열을 정리할 수 있다.
  - na_values와 try/except로 여러 형태의 결측치를 찾아 NaN으로 통일할 수 있다.
  - 결측치를 상수·중앙값으로 채우고 그 선택의 근거를 설명할 수 있다.
  - matplotlib로 선 그래프의 색·선 모양·축 범위·제목·범례를 지정할 수 있다.
  - describe 결과와 상자 그림·히스토그램·산점도를 읽고 해석할 수 있다.
---

## 학습 경로

[이전: 6주차 · 정규표현식, XML, JSON](/lectures/grade-01/semester-muheifg4/subject-muhz3nd1/lecture-06) · [과목 처음: 2주차](/lectures/grade-01/semester-muheifg4/subject-muhz3nd1/lecture-01)

**범위:** 7주차 슬라이드 3–27 · Drill 701–708 · 실습 데이터 `BL-Flickr-Images-Book.csv`, `property_data.csv`, iris

## 단원 도입

> [!BOARD]
> **이번 주의 흐름**
> - **PART 1** 문자열 클리닝 → 열 제거·인덱스 설정 → `apply`로 날짜·제목 정리 → `np.where`로 지명 통일
> - **PART 2** 결측치 처리 → 결측치가 숨어 있는 여러 모습 → `na_values` → `try/except`로 이상값 찾기 → `fillna`
> - **PART 3** 시각화 → `plt.plot`의 색·선 모양 → 축 범위·제목·라벨 → 범례
> - **PART 4** 기술통계 → `describe` → 상자 그림 → 히스토그램 → 산점도

> [!NOTE]
> 데이터 분석 시간의 대부분은 모델을 만드는 데가 아니라 ==데이터를 분석할 수 있는 모양으로 고치는 데== 쓰인다. 이번 주는 4주차에서 배운 `drop`, `fillna`, 6주차의 `.str` 문자열 처리를 실제로 지저분한 데이터에 적용하고, 정리한 데이터를 그림과 요약 통계로 확인하는 단계다.

| 핵심 포인트 | 중요도 | 이렇게 확인한다 |
|---|:---:|---|
| `na_values`로 `"n/a"`, `"na"`, `"--"`를 결측치로 읽기 | ★★★ | 읽기 전후 `isnull()` 결과 비교하기 |
| `apply(함수)`를 Series와 DataFrame(`axis=1`)에 쓰는 차이 | ★★★ | Drill 702와 703의 함수 인자 비교하기 |
| 결측치 채우기: 상수 vs 중앙값 | ★★ | 중앙값을 쓰는 이유 설명하기 |
| `np.where(조건, 참일 때, 거짓일 때)` 중첩 | ★★ | 결과 값 예측하기 |
| `describe()`의 count·mean·std·사분위수 | ★★ | 표에서 값 읽기 |
| 상자 그림의 이상치, 히스토그램, 산점도 해석 | ★★ | 그림을 보고 특징 말하기 |
| `plt.plot`의 `color`·`linestyle`·`label` 옵션 | ★ | 서식 문자열 `'-g'`, `':b'` 읽기 |

**형광펜 읽는 법:** ==yellow:노랑== 핵심 정의·결론 · ==red:빨강== 헷갈리기 쉬운 구분·함정 · ==blue:파랑== 외워야 할 순서·목록

**코드 읽는 법:** 코드 옆 주석의 `# →` 뒤가 실제 실행 결과다. 슬라이드 코드 중 최신 Pandas·NumPy에서 경고나 오류가 나는 부분은 **최신 버전에서 바꿔 쓸 점** 박스에 정리했다.

> [!PAGEBREAK]

## PART 1 · 문자열 클리닝

## 데이터 불러오기

*3p*

영국 도서관(British Library)의 도서 목록 데이터다. 출판일·출판지·제목 열에 괄호, 쉼표, 저자 이름이 섞여 있어 그대로는 분석하기 어렵다.

```python
import pandas as pd
import numpy as np

df = pd.read_csv("Datasets/BL-Flickr-Images-Book.csv")
df.head()
```

> [!TRAP]
> 슬라이드의 경로 `'Datasets\BL-Flickr-Images-Book.csv'`는 역슬래시가 ==red:이스케이프 문자로 해석될 위험==이 있다(6주차 *raw string을 쓰는 이유*). 윈도우 경로는 슬래시 `/`로 ==바꿔 쓰거나== `r"Datasets\BL-Flickr-Images-Book.csv"`처럼 raw string으로 쓴다. 10p의 `"C:\\Users\\1\\Downloads\\..."`처럼 역슬래시를 두 번 쓰는 방법도 같은 목적이다.

## Drill 701 · 필요 없는 열 제거와 인덱스 설정

*4p*

```python
to_drop = ["Edition Statement", "Corporate Author", "Corporate Contributors",
           "Former owner", "Engraver", "Contributors", "Issuance type", "Shelfmarks"]

df.drop(to_drop, inplace=True, axis=1)   # 열 8개 삭제
df.set_index("Identifier", inplace=True) # Identifier 열을 행 인덱스로
df.head()
```

| 코드 | 뜻 |
|---|---|
| `axis=1` | ==blue:열 방향==으로 삭제 (`axis=0`이면 행) |
| `inplace=True` | 새 DataFrame을 돌려주지 않고 ==원본을 직접 수정== |
| `set_index("Identifier")` | 그 열을 행 이름으로 바꿈 → `df.loc[206]`처럼 도서 번호로 조회 가능 |

> [!NOTE]
> `df.drop(columns=to_drop)`처럼 쓰면 `axis=1`을 외우지 않아도 열 삭제라는 뜻이 바로 드러난다. 또 `inplace=True`는 결과를 확인하기 전에 원본을 바꿔 버리므로, 처음에는 `df = df.drop(columns=to_drop)`처럼 ==새로 저장하는 습관==이 안전하다([보충 · Pandas 기본기능](/lectures/grade-01/semester-muheifg4/subject-muhz3nd1/lecture-04)의 *삭제·수정*).

> [!CONCEPT]
> **인덱스로 쓸 열의 조건** — 각 행을 ==yellow:하나씩 구별할 수 있도록 값이 중복되지 않아야== 한다. `df["Identifier"].is_unique`가 `True`인지 먼저 확인한다.

## Drill 702 · 출판일 정리: DataFrame.apply(axis=1)

*5p*

`Date of Publication` 열에는 `1879 [1878]`, `1839, 38-54`, `[1897?]`처럼 연도 외의 문자가 섞여 있다. 목표는 ==첫 번째 연도만 남기기==다.

```python
unwanted_characters = ["[", ",", "-"]

def clean_dates(item):                     # item = 행 하나 (Series)
    dop = str(item.loc["Date of Publication"])
    if dop == "nan" or dop[0] == "[":     # 비어 있거나 [로 시작하면 결측
        return np.nan
    for character in unwanted_characters:
        if character in dop:
            character_index = dop.find(character)
            dop = dop[:character_index]   # 그 문자 앞까지만 남김
    return dop

df["Date of Publication"] = df.apply(clean_dates, axis=1)
```

| 원래 값 | 정리 결과 | 이유 |
|---|---|---|
| `1868` | `1868` | 그대로 |
| `1839, 38-54` | `1839` | `,` 앞까지 |
| `1865-1866` | `1865` | `-` 앞까지 |
| `[1897?]` | `NaN` | `[`로 시작 |
| `1879 [1878]` | `1879 ` | `[` 앞까지 (==red:끝에 공백이 남음==) |

## Drill 703 · 같은 정리를 Series.apply로

*6p*

```python
def clean_dates(dop):        # dop = 값 하나
    dop = str(dop)
    if dop.startswith("[") or dop == "nan":
        return "NaN"
    for character in unwanted_characters:
        if character in dop:
            character_index = dop.find(character)
            dop = dop[:character_index]
    return dop

df["Date of Publication"] = df["Date of Publication"].apply(clean_dates)
```

> [!BOARD]
> **apply의 두 가지 얼굴**
> - `df.apply(f, axis=1)` → 함수가 ==blue:행 하나(Series)==를 받는다 → 안에서 `item.loc["열 이름"]`으로 값을 꺼냄 (Drill 702)
> - `df["열"].apply(f)` → 함수가 ==blue:값 하나==를 받는다 → 바로 문자열로 다룸 (Drill 703)
> - 한 열만 고칠 때는 ==Series.apply가 더 단순하고 빠르다==

> [!TRAP]
> - Drill 703은 결측을 `np.nan`이 아니라 문자열 `"NaN"`으로 돌려준다. 문자열 `"NaN"`은 `isnull()`에서 ==red:결측으로 잡히지 않는다==. 결측은 항상 `np.nan`으로 돌려준다.
> - 결과는 여전히 문자열(`"1879 "`)이다. 연도로 계산하려면 마지막에 `pd.to_numeric(df["Date of Publication"].str.strip(), errors="coerce")`로 숫자로 바꾼다.
> - 6주차 정규식을 쓰면 한 줄로 끝난다: `df["Date of Publication"].str.extract(r"^(\d{4})", expand=False)` → 맨 앞 네 자리 숫자만 추출.

## Drill 704 · 제목 정리

*7p*

```python
def clean_title(title):
    if title == "nan":
        return "NaN"
    if title[0] == "[":
        title = title[1: title.find("]")]      # [ ] 안쪽만
    if "by" in title:
        title = title[:title.find("by")]       # by 앞까지 (저자 부분 제거)
    elif "By" in title:
        title = title[:title.find("By")]
    if "[" in title:
        title = title[:title.find("[")]        # [ 앞까지
    title = title[:-2]                         # 끝 두 글자 제거 (". " 같은 꼬리)
    title = list(map(str.capitalize, title.split()))
    return " ".join(title)                     # 단어마다 첫 글자 대문자

df["Title"] = df["Title"].apply(clean_title)
```

| 원래 제목 | 정리 결과 |
|---|---|
| `Walter Forbes. [A novel.] By A. A` | `Walter Forbes` |
| `All for Greed. [A novel. The dedication signed: A. A. D. M.]` | `All For Greed` |
| `Love the Avenger. By the author of “All for Greed.” [A novel.]` | `Love The Avenger` |

> [!TRAP]
> 이 함수는 슬라이드 데이터의 앞부분에 맞춘 ==red:임시방편==이라 다른 제목에서는 틀린다.
> - `"by" in title`은 ==red:단어 안의 by도 찾는다==. `Hobby horses`는 `Hob`까지 잘린 뒤 끝 두 글자까지 지워져 `H`가 된다.
> - `title[:-2]`는 꼬리가 없는 제목도 무조건 두 글자를 지운다. `Abbotsford`는 `Abbotsfo`가 된다.
>
> 클리닝 함수를 만든 뒤에는 ==여러 예시 값에 직접 넣어 결과를 확인==한다. 단어 단위로 찾으려면 정규식 `r"\s[Bb]y\s"`를 쓴다.

> [!NOTE]
> `list(map(str.capitalize, title.split()))`는 “공백으로 나눈 단어마다 `capitalize`를 적용해 리스트로 모은다”는 뜻이다. 같은 결과를 `title.title()` 한 번으로도 얻을 수 있다.

## Drill 705 · np.where로 출판지 통일

*8p*

```python
pub = df["Place of Publication"]
df["Place of Publication"] = np.where(
    pub.str.contains("London"), "London",
    np.where(pub.str.contains("Oxford"), "Oxford",
        np.where(pub.eq("Newcastle upon Tyne"), "Newcastle-upon-Tyne",
                 df["Place of Publication"])))
```

| 원래 값 | 결과 |
|---|---|
| `London` | `London` |
| `London; Virtue & Yorston` | `London` |
| `Oxford` | `Oxford` |
| `Newcastle upon Tyne` | `Newcastle-upon-Tyne` |
| `Edinburgh` | `Edinburgh` (그대로) |

> [!CONCEPT]
> **`np.where(조건, 참일 때 값, 거짓일 때 값)`** — 조건 배열의 각 자리마다 ==yellow:True면 두 번째, False면 세 번째 값==을 고른다. 엑셀의 `IF` 함수와 같다. 세 번째 자리에 또 `np.where`를 넣으면 `if … elif … else`처럼 ==위에서부터 차례로 검사==한다.

> [!TRAP]
> `pub.str.contains("London")`은 열에 결측값이 있으면 결측값을 돌려줘 조건이 애매해진다. 결측이 섞인 열에는 `pub.str.contains("London", na=False)`처럼 쓴다. `pub.eq("…")`는 `pub == "…"`와 같은 뜻이다.

> [!PAGEBREAK]

## PART 2 · 결측치 처리

## 결측치는 여러 모습으로 숨어 있다

*9p, 12p*

`property_data.csv`

| ST_NUM | ST_NAME | NUM_BEDROOMS | OWN_OCCUPIED |
|---|---|---|---|
| 104 | PUTNAM | 3 | Y |
| 197 | LEXINGTON | 3 | N |
| *(빈칸)* | LEXINGTON | n/a | N |
| 201 | BERKELEY | 1 | ==red:12== |
| 203 | BERKELEY | 3 | Y |
| 207 | BERKELEY | n/a | Y |
| NA | WASHINGTON | 2 | *(빈칸)* |
| 213 | TREMONT | -- | Y |
| 215 | TREMONT | na | Y |

> [!BOARD]
> **결측치의 세 가지 모습**
> - ==blue:표준 결측== → 빈칸, `NA` → Pandas가 ==자동으로 NaN==으로 읽음
> - ==blue:비표준 결측== → `n/a`, `na`, `--` → 그냥 문자열로 읽힘 → `na_values`로 알려 줘야 함
> - ==blue:예상 밖의 값== → Y/N만 와야 할 `OWN_OCCUPIED`에 `12` → 직접 찾아서 NaN으로 바꿔야 함

## Drill 706 · na_values로 결측치 코드 통일

*10p~11p*

```python
df = pd.read_csv("property_data.csv")

df["ST_NUM"].isnull()
# → False, False, True, False, False, False, True, False, False   ← 빈칸과 NA는 자동 인식

df["NUM_BEDROOMS"]
# → '3', '3', NaN, '1', '3', NaN, '2', '--', 'na'                  ← --, na는 문자열로 남음

missing_values = ["n/a", "na", "--"]
df = pd.read_csv("property_data.csv", na_values=missing_values)

df["NUM_BEDROOMS"]
# → 3.0, 3.0, NaN, 1.0, 3.0, NaN, 2.0, NaN, NaN                    ← 모두 NaN, 열도 숫자형이 됨
```

> [!NOTE]
> `na_values`를 주기 전에는 `NUM_BEDROOMS` 열에 `"--"` 같은 문자열이 섞여 있어서 ==열 전체가 문자열(object) 자료형==이었다. 결측 표시를 NaN으로 바꾸고 나면 남은 값이 모두 숫자라 `float64`로 읽혀 ==평균·중앙값을 계산할 수 있다==. 정수 열인데 `3.0`처럼 소수로 보이는 이유는 NaN이 실수형(float)이기 때문이다.

> [!TRAP]
> `n/a`와 `NA`는 Pandas가 기본으로 결측으로 아는 목록에 이미 들어 있다. 진짜 문제는 `--`와 소문자 `na`처럼 ==red:데이터마다 다른 표시==다. 데이터를 읽은 직후 각 열의 `unique()`를 확인해 이런 값을 찾아낸다.

## Drill 707 · try/except로 숫자 이상값 찾기

*13p*

```python
cnt = 0
for row in df["OWN_OCCUPIED"]:
    try:
        int(row)                              # 숫자로 바뀌면 → Y/N이 아닌 이상값
        df.loc[cnt, "OWN_OCCUPIED"] = np.nan
    except ValueError:                        # "Y", "N"은 숫자로 못 바꿔 여기로
        pass
    cnt += 1

df["OWN_OCCUPIED"]
# → 'Y', 'N', 'N', NaN, 'Y', 'Y', NaN, 'Y', 'Y'   ← 12가 NaN이 됨
```

> [!NOTE]
> 3주차 *예외 처리*를 거꾸로 이용한 방법이다. `int("Y")`는 `ValueError`를 내므로 `except`로 넘어가 그대로 두고, `int("12")`는 성공하므로 그 칸을 NaN으로 바꾼다. ==오류가 나는지 여부로 값의 종류를 판별==한 것이다.

> [!TRAP]
> - `cnt`로 행 번호를 직접 세는 방식은 ==red:인덱스가 0, 1, 2, …일 때만== 맞다. `set_index`를 했거나 행을 지운 뒤라면 엉뚱한 행을 바꾼다. 같은 일을 `for idx, row in df["OWN_OCCUPIED"].items():`와 `df.loc[idx, ...]`로 하면 인덱스와 상관없이 정확하다.
> - 슬라이드 13p 마지막 줄 ` print(...)` 앞의 공백 한 칸은 들여쓰기 오류(`IndentationError`)를 낸다.
> - 반복문 없이 쓰면: `df.loc[~df["OWN_OCCUPIED"].isin(["Y", "N"]), "OWN_OCCUPIED"] = np.nan`

## Drill 708 · 결측치 세기와 채우기

*14p*

```python
df.isnull().sum()
# → ST_NUM 2, ST_NAME 0, NUM_BEDROOMS 4, OWN_OCCUPIED 2

df["ST_NUM"] = df["ST_NUM"].fillna(125)               # 상수로 채우기
median = df["NUM_BEDROOMS"].median()                  # → 3.0
df["NUM_BEDROOMS"] = df["NUM_BEDROOMS"].fillna(median)  # 중앙값으로 채우기
```

> [!CONCEPT]
> **`isnull().sum()`** — `isnull()`이 만든 True/False 표를 열마다 더한다. True는 1, False는 0으로 계산되므로 ==yellow:열별 결측치 개수==가 된다. `isnull()`과 `isna()`는 같은 함수다.

> [!NOTE]
> **왜 중앙값인가.** 평균은 아주 큰 값 하나에 크게 끌려가지만, 중앙값은 ==가운데 값이라 이상값의 영향을 덜 받는다==. 방 개수처럼 정수이고 치우칠 수 있는 값에는 중앙값이 자연스럽다. 다만 어떤 값으로 채우든 ==원래 없던 정보를 만들어 넣는 것==이므로, 결측 비율이 크면 채운 열의 분산이 작아지고 분석 결과가 왜곡될 수 있다(4주차 *결측치 대체*).

> [!CAUTION]
> **최신 버전에서 바꿔 쓸 점**
> - 슬라이드의 `df["ST_NUM"].fillna(125, inplace=True)`는 Pandas 2.x에서 ==red:FutureWarning(chained assignment)==을 내고, ==red:Pandas 3.0부터는 원본이 바뀌지 않는다==. `df["ST_NUM"] = df["ST_NUM"].fillna(125)` 또는 `df.fillna({"ST_NUM": 125}, inplace=True)`로 쓴다.
> - 슬라이드 5p의 `np.NaN`은 ==red:NumPy 2.0에서 삭제==되어 `AttributeError`가 난다. 소문자 `np.nan`으로 쓴다.

> [!PROBLEM]
> **예제 1.** 아래 열을 읽은 뒤 `fillna(df["score"].median())`를 적용한 결과를 구하시오.
> `score`: `80`, `--`, `90`, `100`, `n/a` (읽을 때 `na_values=["--"]`)
>
> **풀이.**
> 1. `--`는 `na_values`로, `n/a`는 Pandas 기본 목록으로 NaN이 된다 → `80, NaN, 90, 100, NaN`
> 2. 결측을 뺀 값 80, 90, 100의 중앙값 = **90**
> 3. 결과: `80, 90, 90, 100, 90`

> [!CHECK]
> **1.** `df.apply(f, axis=1)`과 `df["col"].apply(f)`에서 함수 `f`가 받는 인자는 각각 무엇인가?
>
> **2.** 클리닝 함수가 결측을 문자열 `"NaN"`으로 돌려주면 어떤 문제가 생기는가?
>
> **3.** `np.where(s > 0, "양수", np.where(s == 0, "영", "음수"))`에 `s = np.array([3, 0, -2])`를 넣은 결과는?

> [!PAGEBREAK]

## PART 3 · matplotlib 시각화

## 첫 번째 그래프

*15p*

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)     # 0~10을 100개 점으로 (5주차 linspace)
fig = plt.figure()
plt.plot(x, np.sin(x), "-")     # 실선
plt.plot(x, np.cos(x), "--")    # 파선
plt.show()
```

![0부터 10까지 사인 곡선은 실선, 코사인 곡선은 파선으로 겹쳐 그린 선 그래프](/materials/rpy/rpy-07-sin-cos.png)

> [!NOTE]
> `plt.plot(x, y)`는 ==x와 y 배열의 같은 자리끼리 점을 찍고 선으로 잇는다==. 같은 그림에 `plt.plot`을 여러 번 부르면 선이 겹쳐 그려지고, 색은 자동으로 바뀐다. `plt.show()`가 그림을 화면에 띄운다. Jupyter에서 마지막 줄 끝의 `;`는 `[<matplotlib.lines.Line2D ...>]` 같은 반환값 출력을 숨기는 용도다.

## 색 지정하기

*16p~17p*

```python
plt.plot(x, np.sin(x - 0), color="blue")          # 색 이름
plt.plot(x, np.sin(x - 1), color="g")             # 한 글자 색 코드 (green)
plt.plot(x, np.sin(x - 2), color="0.75")          # 0~1 사이 숫자 = 회색조
plt.plot(x, np.sin(x - 3), color="#FFDD44")       # 16진수 코드
plt.plot(x, np.sin(x - 4), color=(1.0, 0.2, 0.3)) # RGB 튜플 (0~1)
plt.plot(x, np.sin(x - 5), color="chartreuse")    # HTML 색 이름
plt.show()
```

![위상이 1씩 다른 사인 곡선 여섯 개를 파랑, 초록, 회색, 노랑, 빨강, 연두로 그린 그래프](/materials/rpy/rpy-07-colors.png)

## 선 모양 지정하기

*18p~19p*

```python
plt.plot(x, x + 0, linestyle="solid")     # 실선      = "-"
plt.plot(x, x + 1, linestyle="dashed")    # 파선      = "--"
plt.plot(x, x + 2, linestyle="dashdot")   # 쇄선      = "-."
plt.plot(x, x + 3, linestyle="dotted")    # 점선      = ":"
plt.show()
```

![기울기가 같은 직선 여덟 개를 실선, 파선, 쇄선, 점선 순서로 두 번씩 그린 그래프](/materials/rpy/rpy-07-linestyles.png)

| 이름 | 줄임 기호 | 모양 |
|---|:---:|---|
| `solid` | `-` | ────── |
| `dashed` | `--` | ─ ─ ─ |
| `dashdot` | `-.` | ─ · ─ · |
| `dotted` | `:` | · · · · |

## 축 범위, 제목, 라벨, 범례

*20p~22p*

```python
plt.plot(x, np.sin(x))
plt.xlim(-1, 11)          # x축 범위
plt.ylim(-1.5, 1.5)       # y축 범위
```

![x축을 -1에서 11, y축을 -1.5에서 1.5로 넓혀 여백을 둔 사인 곡선](/materials/rpy/rpy-07-limits.png)

```python
plt.plot(x, np.sin(x))
plt.title("A Sine Curve")
plt.xlabel("x")
plt.ylabel("sin(x)")
plt.show()
```

![A Sine Curve라는 제목과 x, sin(x) 축 라벨이 붙은 사인 곡선](/materials/rpy/rpy-07-labels.png)

```python
plt.plot(x, np.sin(x), "-g", label="sin(x)")   # 초록 실선
plt.plot(x, np.cos(x), ":b", label="cos(x)")   # 파랑 점선
plt.axis("equal")                              # x, y 눈금 간격을 같게
plt.legend()                                   # label을 모아 범례 표시
plt.show()
```

![초록 실선 사인과 파랑 점선 코사인에 범례를 붙이고 두 축의 눈금 간격을 같게 한 그래프](/materials/rpy/rpy-07-legend.png)

> [!BOARD]
> **서식 문자열 `'-g'` 읽기**
> - ==blue:선 모양 + 색 글자==를 한 문자열로 → `'-g'` 초록 실선, `':b'` 파랑 점선, `'--r'` 빨강 파선
> - 색 글자: `b` 파랑 · `g` 초록 · `r` 빨강 · `c` 청록 · `m` 자홍 · `y` 노랑 · `k` 검정 · `w` 흰색

> [!TRAP]
> `plt.legend()`는 `label=`을 ==red:준 선만== 범례에 넣는다. `label` 없이 그린 선만 있으면 “No artists with labels found” 경고와 함께 빈 범례가 된다.

> [!PAGEBREAK]

## PART 4 · 기술통계와 시각화

## iris 데이터 준비

*23p*

붓꽃(iris) 150송이의 꽃받침(sepal)·꽃잎(petal) 길이와 너비, 품종(0, 1, 2)을 담은 대표적인 연습용 데이터다.

```python
from sklearn import datasets
import pandas as pd
import matplotlib.pyplot as plt

iris = datasets.load_iris()
labels = pd.DataFrame(iris.target)
labels.columns = ["labels"]
dataset = pd.DataFrame(iris.data)
dataset.columns = ["Sepal length", "Sepal width", "Petal length", "Petal width"]
data = pd.concat([dataset, labels], axis=1)   # 좌우로 붙이기 → 열 5개
```

> [!NOTE]
> `pd.concat([dataset, labels], axis=1)`은 측정값 4개 열 옆에 품종 열을 ==좌우로== 붙인다. 행 순서가 같은 두 표를 나란히 붙일 때 쓴다([보충 · Pandas 기본기능](/lectures/grade-01/semester-muheifg4/subject-muhz3nd1/lecture-04)의 *concat과 merge*). 슬라이드는 `seaborn`도 불러오지만 이번 예제에서는 쓰지 않는다.

## describe: 요약 통계

*24p*

```python
print(dataset.describe())
#        Sepal length  Sepal width  Petal length  Petal width
# count    150.000000   150.000000    150.000000   150.000000
# mean       5.843333     3.057333      3.758000     1.199333
# std        0.828066     0.435866      1.765298     0.762238
# min        4.300000     2.000000      1.000000     0.100000
# 25%        5.100000     2.800000      1.600000     0.300000
# 50%        5.800000     3.000000      4.350000     1.300000
# 75%        6.400000     3.300000      5.100000     1.800000
# max        7.900000     4.400000      6.900000     2.500000

print(dataset.isnull().sum())   # → 네 열 모두 0
```

| 행 | 뜻 |
|---|---|
| `count` | 결측이 아닌 값의 개수 |
| `mean` | 평균 |
| `std` | 표준편차 (Pandas는 n−1로 나눔) |
| `min` / `max` | 최솟값 / 최댓값 |
| `25%` | 제1사분위수 Q1: 아래에서 25% 지점 |
| `50%` | ==yellow:중앙값==: 제2사분위수 |
| `75%` | 제3사분위수 Q3: 아래에서 75% 지점 |

> [!PROBLEM]
> **예제 2.** 위 표에서 `Petal length`의 평균(3.758)이 중앙값(4.35)보다 작다. 무엇을 짐작할 수 있는가?
>
> **풀이.**
> 1. 평균 < 중앙값이면 ==작은 쪽에 값이 몰린 덩어리==가 평균을 끌어내리고 있다는 뜻이다.
> 2. Q1이 1.6, Q3가 5.1로 간격이 넓다 → 값이 넓게 퍼져 있다.
> 3. 실제로 아래 히스토그램을 보면 꽃잎 길이는 1~2 근처의 작은 품종 무리와 4~7의 큰 품종 무리로 ==두 덩어리==로 나뉜다. 요약 통계만 보지 말고 그림을 함께 봐야 하는 이유다.

## 상자 그림 (box plot)

*25p*

```python
dataset.plot(kind="box", subplots=True, layout=(2, 2), sharex=False, sharey=False)
plt.show()
```

![네 측정값의 상자 그림을 2×2로 배치한 그림. Sepal width에만 위아래로 이상치 점이 있다](/materials/rpy/rpy-07-boxplot.png)

> [!BOARD]
> **상자 그림 읽기**
> - 상자 아래쪽 선 = ==blue:Q1(25%)==, 상자 안 선 = ==blue:중앙값(50%)==, 상자 위쪽 선 = ==blue:Q3(75%)==
> - 상자 높이 = IQR = Q3 − Q1 → 가운데 50%의 퍼짐
> - 수염(whisker) = 상자에서 1.5×IQR 안쪽의 가장 먼 값까지
> - 수염 밖의 동그라미 = ==이상치(outlier) 후보==

> [!NOTE]
> `Sepal width`에만 수염 밖의 점(4.0 이상 세 개, 2.0 한 개)이 있다. Q1 2.8, Q3 3.3이므로 IQR = 0.5, 위 경계는 3.3 + 0.75 = 4.05, 아래 경계는 2.8 − 0.75 = 2.05다. 4.1, 4.2, 4.4와 2.0이 경계 밖이라 점으로 찍혔다. `subplots=True`는 열마다 따로 그리고, `layout=(2, 2)`는 2행 2열로 배치하며, `sharey=False`는 ==단위가 다른 열마다 y축을 따로== 잡는다.

## 히스토그램

*26p*

```python
dataset.hist()
plt.show()
```

![네 측정값의 히스토그램. Petal length와 Petal width는 왼쪽 작은 값 무리와 오른쪽 큰 값 무리로 나뉜다](/materials/rpy/rpy-07-hist.png)

> [!CONCEPT]
> **히스토그램** — 값의 범위를 여러 구간(bin)으로 나누고, ==yellow:각 구간에 값이 몇 개 있는지 막대 높이로== 나타낸 그림. 분포의 모양(가운데 몰림, 치우침, 덩어리 개수)을 본다. 기본 구간 수는 10개이고 `dataset.hist(bins=20)`처럼 바꿀 수 있다.

> [!CAUTION]
> **슬라이드 정정 (26p)** — `plt.show()plt.show()`는 두 줄이 붙어 버린 오타로 `SyntaxError`가 난다. `plt.show()` 한 번이면 된다. 또 25~27p의 주석 `# box and whisker plots`는 26·27p에서 히스토그램·산점도에 그대로 복사된 것이다.

## 산점도 (scatter plot)

*27p*

```python
dataset.plot(kind="scatter", x="Sepal length", y="Sepal width")
plt.show()
```

![꽃받침 길이를 x축, 꽃받침 너비를 y축으로 150송이를 점으로 찍은 산점도](/materials/rpy/rpy-07-scatter.png)

> [!CONCEPT]
> **산점도** — 두 변수의 값을 x, y 좌표로 삼아 ==yellow:관측치 하나를 점 하나로== 찍은 그림. 두 변수가 함께 커지는지(양의 관계), 반대로 움직이는지(음의 관계), 무리가 나뉘는지를 본다.

| 그림 | `kind=` | 보는 것 |
|---|---|---|
| 선 그래프 | `"line"` (기본) | 순서·시간에 따른 변화 |
| 상자 그림 | `"box"` | 사분위수, 퍼짐, 이상치 |
| 히스토그램 | `"hist"` 또는 `.hist()` | 한 변수의 분포 모양 |
| 산점도 | `"scatter"` | 두 변수의 관계 |
| 막대 그래프 | `"bar"` | 범주별 크기 비교 |

> [!CHECK]
> **4.** `plt.plot(x, y, ':r', label='data')` 다음에 `plt.legend()`를 부르면 어떤 선이 범례에 어떻게 표시되는가?
>
> **5.** `describe()`의 `50%` 행은 무엇인가?
>
> **6.** 상자 그림에서 수염 밖의 점은 무엇을 뜻하는가?

---

## 정답과 해설

**1.** `df.apply(f, axis=1)`의 `f`는 ==행 하나(Series)==를, `df["col"].apply(f)`의 `f`는 ==값 하나==를 받는다.

**2.** 문자열 `"NaN"`은 실제 결측값이 아니라서 `isnull()`, `dropna()`, `fillna()`가 결측으로 처리하지 않는다. 결측 개수가 틀리고 숫자 변환도 실패한다. `np.nan`을 돌려줘야 한다.

**3.** `['양수', '영', '음수']`. 3은 첫 조건이 참, 0은 첫 조건이 거짓이고 두 번째 조건이 참, −2는 둘 다 거짓이다.

**4.** 빨간 점선이 `data`라는 이름으로 범례에 표시된다. `:`는 점선, `r`은 빨강이다.

**5.** 중앙값(제2사분위수). 값을 크기순으로 늘어놓았을 때 가운데 값이다.

**6.** 상자에서 1.5×IQR보다 멀리 떨어진 이상치 후보다. 측정 오류인지, 실제로 드문 값인지 따로 확인해야 한다.

## 플래시카드

> [!FLASHCARD]
> Q: 7주차 — `pd.read_csv(..., na_values=["n/a", "na", "--"])`는 무엇을 하는가?
> A: 목록의 문자열을 결측치(NaN)로 읽는다. 빈칸과 NA는 원래 자동 인식되지만 `--`, 소문자 `na` 같은 비표준 표시는 이렇게 알려 줘야 한다.

> [!FLASHCARD]
> Q: 7주차 — `df.apply(f, axis=1)`과 `df["col"].apply(f)`의 차이는?
> A: 앞은 함수가 행 하나(Series)를 받아 `item.loc["열"]`로 값을 꺼내고, 뒤는 함수가 값 하나를 바로 받는다. 한 열만 고칠 때는 뒤쪽이 단순하다.

> [!FLASHCARD]
> Q: 7주차 — `np.where(조건, A, B)`의 뜻은?
> A: 조건이 True인 자리는 A, False인 자리는 B를 고른다. B 자리에 np.where를 다시 넣으면 if-elif-else처럼 차례로 검사한다.

> [!FLASHCARD]
> Q: 7주차 — Drill 707에서 try/except로 이상값을 찾는 원리는?
> A: `int("Y")`는 ValueError가 나서 그대로 두고, `int("12")`는 성공하므로 숫자인 칸을 NaN으로 바꾼다. 오류 발생 여부로 값의 종류를 판별한다.

> [!FLASHCARD]
> Q: 7주차 — 결측치를 평균보다 중앙값으로 채우는 이유는?
> A: 중앙값은 이상값의 영향을 덜 받는다. 어떤 값으로 채우든 없던 정보를 넣는 것이므로 결측 비율이 크면 분포가 왜곡될 수 있다.

> [!FLASHCARD]
> Q: 7주차 — 최신 Pandas에서 `df["c"].fillna(0, inplace=True)` 대신 써야 하는 코드는?
> A: `df["c"] = df["c"].fillna(0)` 또는 `df.fillna({"c": 0}, inplace=True)`. 열을 꺼낸 뒤 inplace로 바꾸는 방식은 Pandas 3.0부터 원본에 반영되지 않는다.

> [!FLASHCARD]
> Q: 7주차 — matplotlib 서식 문자열 `'-g'`, `':b'`, `'--r'`의 뜻은?
> A: 초록 실선, 파랑 점선, 빨강 파선. 선 모양 기호와 색 글자를 합친 것이다.

> [!FLASHCARD]
> Q: 7주차 — 상자 그림의 상자 아래·가운데·위 선과 점은?
> A: Q1(25%), 중앙값(50%), Q3(75%). 수염 밖의 점은 1.5×IQR 밖에 있는 이상치 후보다.

> [!FLASHCARD]
> Q: 7주차 — 히스토그램과 산점도는 각각 무엇을 보는가?
> A: 히스토그램은 한 변수의 분포 모양(구간별 개수), 산점도는 두 변수의 관계(관측치 하나 = 점 하나)를 본다.

## 핵심 점검

- 열을 삭제할 때 `drop`에 {{axis=1}} 또는 `columns=`를 지정한다.
- 비표준 결측 표시를 NaN으로 읽으려면 `read_csv`에 {{na_values}}를 준다.
- 열별 결측치 개수는 `df.isnull().`{{sum()}}으로 센다.
- 이상값의 영향을 덜 받는 대표값은 {{중앙값}}이다.
- NumPy 2.0에서는 `np.NaN` 대신 {{np.nan}}을 쓴다.
- `plt.legend()`는 {{label}}을 지정한 선만 범례에 넣는다.
- `describe()`의 `25%`, `50%`, `75%`는 {{사분위수}}다.
- 상자 그림에서 수염 밖의 점은 {{이상치}} 후보다.
