---
title: "4주차: 파일 입출력과 Pandas 데이터 처리"
description: "with 문으로 텍스트 파일 읽고 쓰기, Pandas로 CSV·Excel 불러오기, Series·DataFrame과 인덱스, loc·iloc·at·iat 선택, 자료형 변환, 결측치·정렬·불리언 필터·중복 제거, agg·transform·apply 집계를 코드와 실행 결과로 정리합니다."
order: 3
published: true
duration: 100
tags: [AI-R-PY, 파일입출력, Pandas, DataFrame, loc, 결측치]
objectives:
  - 텍스트 파일을 안전하게 열고 읽고 쓸 수 있다.
  - CSV·Excel 데이터를 Pandas DataFrame으로 불러오고 구조를 점검할 수 있다.
  - loc와 iloc을 구분해 행과 열을 선택할 수 있다.
  - 결측치·중복값을 처리하고 조건에 맞는 행을 필터링할 수 있다.
  - 집계와 변환으로 데이터의 특징을 요약할 수 있다.
---

## 학습 경로

[이전: 3주차 · 조건문, 반복문과 함수](/lectures/grade-01/semester-muheifg4/subject-muhz3nd1/lecture-02) · [다음: 보충 · Pandas 기본기능 총정리](/lectures/grade-01/semester-muheifg4/subject-muhz3nd1/lecture-04)

**범위:** 4주차 슬라이드 3–29

## 단원 도입

> [!BOARD]
> **이번 주의 흐름**
> - **PART 1** 파일 입출력 → `open` 모드 → `with` 문 → `read`·`readline`·`readlines`
> - **PART 2** Pandas 시작 → `Series`·`DataFrame` → CSV·Excel 불러오기 → 구조 점검
> - **PART 3** 고르기 → `loc`(==red:이름==) vs `iloc`(==red:위치==) → `at`·`iat`
> - **PART 4** 다듬기 → 자료형 변환 → 결측치 → 정렬 → 불리언 필터 → 중복 제거 → 집계

| 핵심 포인트 | 중요도 | 이렇게 확인한다 |
|---|:---:|---|
| 파일 모드 `r`·`w`·`a`·`x`의 차이 | ★★★ | 기존 파일이 있을 때 `w`와 `a`의 결과 |
| `loc`(끝 포함) vs `iloc`(끝 미포함) | ★★★ | 같은 슬라이스의 결과 행 수 비교 |
| 여러 조건 필터: 괄호 + `&`·`\|`·`~` | ★★★ | 틀린 필터 코드 고치기 |
| `dropna`·`fillna`의 옵션 | ★★ | `thresh=3`의 뜻 쓰기 |
| `duplicated(keep=False)` | ★★ | 중복 그룹 표시 방식 |
| `agg`·`transform`·`apply` | ★ | 결과 모양 비교 |

**형광펜 읽는 법:** ==yellow:노랑== 핵심 정의·결론 · ==red:빨강== 헷갈리기 쉬운 구분·함정 · ==blue:파랑== 외워야 할 순서·목록

> [!PAGEBREAK]

## PART 1 · 파일 입출력

## 파일 열기와 닫기

*3p~4p*

`open()`은 파일 객체를 반환한다. 모드에 따라 읽기·쓰기 동작이 달라진다.

| 모드 | 의미 | 파일이 없을 때 | 기존 내용 |
|---|---|---|---|
| `"r"` | 읽기 (기본값) | ==red:오류== (`FileNotFoundError`) | 유지 |
| `"w"` | 쓰기 | 새로 생성 | ==red:모두 지움== |
| `"a"` | 이어 쓰기 | 새로 생성 | 뒤에 추가 |
| `"x"` | 새 파일 만들기 | 새로 생성 | 이미 있으면 오류 |

파일은 `with` 문으로 여는 것이 안전하다. 블록을 벗어나면 ==yellow:오류가 생겨도 자동으로 닫힌다==.

```python
with open("test.txt", "w", encoding="utf-8") as file:
    file.write("첫 번째 줄\n")
    file.write("두 번째 줄\n")
    file.write("세 번째 줄\n")
# 여기서 file은 이미 닫혀 있음
```

> [!TRAP]
> - `"w"` 모드는 기존 파일 내용을 ==red:지우고 처음부터== 쓴다. 내용을 보존하면서 추가하려면 `"a"`를 쓴다.
> - `write()`는 ==red:줄바꿈을 자동으로 넣지 않는다==. 줄을 나누려면 `"\n"`을 직접 붙인다. 또 문자열만 쓸 수 있어 숫자는 `str(3)`으로 바꿔 쓴다.
> - 한글 파일은 `encoding="utf-8"`을 지정해야 운영체제에 따라 글자가 깨지지 않는다.

> [!NOTE]
> `with` 없이 `file = open(...)`으로 열면 마지막에 `file.close()`를 직접 불러야 한다. 중간에 오류가 나면 `close()`까지 가지 못해 파일이 열린 채로 남을 수 있다. 6주차 정규식 실습도 `with open("mbox-short.txt", encoding="utf-8") as hand:`로 바꿔 쓴다.

## 파일 내용 읽기

*5p~6p*

```python
with open("test.txt", "r", encoding="utf-8") as file:
    first_four = file.read(4)     # → '첫 번째'   네 글자
    next_line = file.readline()   # → ' 줄\n'     현재 위치부터 줄 끝까지
    rest = file.read()            # → '두 번째 줄\n세 번째 줄\n'
```

| 메서드 | 반환 내용 |
|---|---|
| `read()` | 남은 내용 전체 (문자열 하나) |
| `read(n)` | 현재 위치에서 최대 `n`글자 |
| `readline()` | 한 줄 |
| `readlines()` | 각 줄을 요소로 갖는 리스트 |
| `for line in file:` | 한 줄씩 차례로 (큰 파일에 적합) |

> [!CONCEPT]
> **파일 위치(커서)** — 파일 객체는 ==yellow:지금까지 읽은 위치를 기억==한다. 그래서 `read(4)` 다음의 `readline()`은 다섯 번째 글자부터 읽는다. 끝까지 읽은 뒤 다시 `read()`하면 빈 문자열 `''`이 나온다. 처음부터 다시 읽으려면 `file.seek(0)`을 쓴다.

> [!NOTE]
> `for line in file:`로 읽은 각 줄 끝에는 `"\n"`이 붙어 있다. 6주차처럼 `line.rstrip()`으로 오른쪽 공백·줄바꿈을 지운 뒤 처리한다.

> [!PAGEBREAK]

## PART 2 · Pandas 시작

## Pandas와 DataFrame

*7p~8p*

Pandas는 ==yellow:표 형태 데이터를 다루는 파이썬 라이브러리==다.

| 객체 | 차원 | 비유 |
|---|---:|---|
| `Series` | 1차원 | 이름이 붙은 하나의 열 |
| `DataFrame` | 2차원 | 행과 열로 이루어진 표 |

```python
import pandas as pd
```

관례적으로 Pandas를 `pd`라는 별칭으로 불러온다. 별칭은 필수가 아니지만 문서와 예제 대부분이 이 관례를 따른다. 그림으로 보는 Series·DataFrame·Index의 관계는 [보충 · Pandas 기본기능](/lectures/grade-01/semester-muheifg4/subject-muhz3nd1/lecture-04)에 정리했다.

## CSV와 Excel 불러오기

*9p~14p*

```python
import pandas as pd

csv_df = pd.read_csv("file1.csv")
excel_df = pd.read_excel("file1.xlsx")

print(csv_df.head())     # 처음 5행
print(csv_df.head(1))    # 처음 1행
```

| 확인 방법 | 목적 |
|---|---|
| `df.head()` | 앞부분의 값과 열 이름 빠르게 확인 |
| `df.shape` | `(행 개수, 열 개수)` 확인 |
| `df.dtypes` | 각 열의 자료형 확인 |
| `df.info()` | 결측치와 메모리 사용량까지 요약 |

> [!NOTE]
> 데이터를 불러온 직후에는 `head()` → `shape` → `info()` ==순서로== 확인하면 구조와 품질 문제를 빠르게 파악할 수 있다. `shape`는 괄호 없는 속성이고, `head()`·`info()`는 괄호가 있는 메서드다.

## Series와 DataFrame 만들기

*15p*

```python
names = ["Olga", "Andrew", "Brian", "Telulah", "Nicole", "Tilda"]
ages = [29, 21, 45, 23, 39, 46]
married = [False, True, True, True, False, True]

name_series = pd.Series(names, name="name")
people = pd.DataFrame({
    "name": names,
    "age": ages,
    "married": married,
})

print(name_series.iloc[2])       # → Brian
print(people.iloc[2, 0])         # → Brian   2번 행, 0번 열
```

> [!NOTE]
> 딕셔너리의 ==키가 열 이름, 값 리스트가 그 열의 내용==이 된다(2주차 딕셔너리). 각 리스트의 길이가 같아야 하고, 행 인덱스는 따로 정하지 않으면 `0, 1, 2, …`가 붙는다.

## 인덱스와 표 구조 확인

*16p~17p*

CSV의 첫 열이 실제 행 이름이라면 불러올 때 인덱스로 지정할 수 있다.

```python
nutrition = pd.read_csv("nutrition.csv", index_col=0)

print(nutrition.axes)    # [행 인덱스, 열 인덱스]
print(nutrition.index)   # 행 이름 (식품 이름)
print(nutrition.columns) # 열 이름 (영양소)
print(nutrition.sample(n=3, random_state=12))
```

`random_state`를 고정하면 무작위 표본을 다시 실행해도 같은 결과가 나와 분석을 재현하기 쉽다(5주차 `np.random.seed`와 같은 목적).

불필요한 열은 명시적으로 제거한다.

```python
nutrition = nutrition.drop(columns=["Unnamed: 0"], errors="ignore")
```

> [!NOTE]
> `Unnamed: 0`은 저장할 때 인덱스까지 함께 저장된 CSV를 다시 읽으면 생기는 ==이름 없는 열==이다. `errors="ignore"`는 그 열이 없어도 오류를 내지 않게 한다. 저장할 때 `df.to_csv("file.csv", index=False)`로 쓰면 애초에 생기지 않는다.

> [!PAGEBREAK]

## PART 3 · 고르기

## loc: 이름으로 선택하기

*18p*

`loc`는 행과 열의 ==yellow:레이블(이름)==을 사용한다. 레이블 슬라이스는 ==끝 레이블도 포함==한다.

```python
row = nutrition.loc["Eggplant, raw"]                 # 행 하나 → Series
calories = nutrition.loc["Eggplant, raw", "calories"] # 값 하나

subset = nutrition.loc[
    ["Raspberries, raw", "Blackberries, raw"],        # 행 목록
    ["protein", "vitamin_b6", "water"],               # 열 목록
]
```

## iloc, at과 iat

*19p*

`iloc`은 0부터 시작하는 ==yellow:정수 위치==로 선택한다. 파이썬 슬라이스처럼 ==끝 위치를 포함하지 않는다==.

```python
first_row = nutrition.iloc[0]               # 첫 번째 행
selected = nutrition.iloc[[4, 6, 9], 2:5]   # 4·6·9번 행 × 2·3·4번 열
```

| 접근자 | 기준 | 슬라이스 끝 | 용도 |
|---|---|---|---|
| `loc` | 레이블 | ==포함== | 여러 행·열, 조건 선택 |
| `iloc` | 정수 위치 | ==미포함== | 여러 행·열, 위치 선택 |
| `at` | 레이블 | — | 단일 값 빠르게 접근 |
| `iat` | 정수 위치 | — | 단일 값 빠르게 접근 |

```python
value_by_label = nutrition.at["Nuts, pecans", "calories"]
value_by_position = nutrition.iat[1, 1]
```

> [!TRAP]
> 인덱스가 `0, 1, 2, …`인 표에서 `df.loc[0:2]`는 ==red:3행==(0, 1, 2), `df.iloc[0:2]`는 ==red:2행==(0, 1)이다. 숫자가 같아 보여도 `loc`의 숫자는 “이름이 0인 행”, `iloc`의 숫자는 “0번째 자리”다. 정렬이나 필터로 순서가 바뀐 뒤에는 둘이 전혀 다른 행을 가리킬 수 있다.

> [!PROBLEM]
> **예제 1.** `people` 표에서 (1) 0~2번 행의 `name`과 `age`, (2) 마지막 행의 `married` 값을 고르시오.
>
> **풀이.**
> 1. 위치로 고르면 `people.iloc[0:3, 0:2]` (끝 3, 2는 미포함)
> 2. 이름으로 고르면 `people.loc[0:2, ["name", "age"]]` (끝 2 포함)
> 3. 마지막 행은 위치 −1 → `people.iloc[-1, 2]` 또는 `people.iat[-1, 2]` → `True` (Tilda)

> [!PAGEBREAK]

## PART 4 · 다듬기

## 자료형 변환

*20p*

```python
people = pd.DataFrame({
    "age": [12, 13, 14, 16],
    "weight": [41.1, 34.5, 83.2, 90.1],
    "height": ["1.72", "1.74", "1.91", "1.54"],   # 숫자처럼 보이는 문자열
})

people["height"] = people["height"].astype(float)
people["age"] = people["age"].astype(int)
```

> [!TRAP]
> `"1.72"`처럼 따옴표 안의 숫자는 ==red:문자열==이라 평균을 낼 수 없고, 정렬도 사전 순으로 된다. `df.dtypes`에서 `object`로 나오면 의심한다. 실제 데이터에 잘못된 문자열이 섞였을 수 있다면 `pd.to_numeric(..., errors="coerce")`로 ==변환 실패 값을 NaN으로== 만든 뒤 점검한다(7주차 결측치 처리로 이어짐).

## 결측치 처리와 정렬

*21p*

결측치는 정보가 비어 있음을 나타내며 흔히 `NaN`(Not a Number)으로 표현된다.

| 코드 | 의미 |
|---|---|
| `df.isna()` | 각 값의 결측 여부 (True/False 표) |
| `df.isna().sum()` | 열별 결측치 개수 |
| `df.dropna()` | 결측치가 ==하나라도== 있는 행 제거 |
| `df.dropna(how="all")` | ==모든 값==이 결측인 행만 제거 |
| `df.dropna(thresh=3)` | 정상 값이 ==3개 이상==인 행만 유지 |
| `df.fillna(value)` | 결측치를 지정 값으로 채움 |

```python
sorted_nutrition = nutrition.sort_values(
    by=["cholesterol", "sodium"],
    ascending=[False, True],       # 콜레스테롤 내림차순 → 같으면 나트륨 오름차순
)
```

> [!CAUTION]
> 결측 행을 무조건 삭제하면 표본이 크게 줄거나 결과가 편향될 수 있다. 삭제·대체를 결정하기 전에 결측 비율과 발생 원인을 확인한다. `dropna()`, `fillna()`, `sort_values()` 모두 ==새 DataFrame을 돌려줄 뿐 원본은 그대로==이므로 결과를 변수에 다시 저장한다.

## 불리언 조건으로 행 필터링

*22p~25p*

```python
valuable  = players.loc[players["market_value"] > 40]
defenders = players.loc[players["position"].isin(["LB", "CB", "RB"])]
young     = players.loc[players["age"] <= 25]
mid_value = players.loc[players["market_value"].between(40, 50)]   # 40 이상 50 이하
```

여러 조건은 `&`(그리고), `|`(또는), `~`(부정)로 결합하고 ==각 비교식을 괄호로 감싼다==.

```python
target = players.loc[
    (players["position"] == "LB")
    & (players["age"] <= 25)
    & (players["market_value"] >= 10)
    & ~players["club"].isin(["Tottenham", "Arsenal"])
]
```

> [!BOARD]
> **필터는 3단계**
> - ==blue:① 조건식== `players["age"] <= 25` → 행마다 True/False가 담긴 Series(마스크)
> - ==blue:② 결합== `&`·`|`·`~`로 여러 마스크를 합침 (각각 괄호)
> - ==blue:③ 적용== `players.loc[마스크]` → True인 행만 남김

> [!TRAP]
> Pandas의 Series 조건에서는 파이썬의 `and`, `or`, `not`이 아니라 `&`, `|`, `~`를 ==red:쓴다==. `and`를 쓰면 `ValueError: The truth value of a Series is ambiguous`가 난다. 괄호를 빼면 `&`가 비교보다 먼저 계산되어 다른 오류가 난다.

## 중복 행 찾기와 제거

*26p*

```python
key_columns = ["club", "age", "position", "market_value"]

duplicates = players.loc[
    players.duplicated(subset=key_columns, keep=False)   # 중복 그룹의 모든 행 표시
]

deduplicated = players.drop_duplicates(
    subset=key_columns,
    keep="first",                                        # 그룹에서 첫 행만 남김
)
```

| `keep=` | `duplicated()`가 True로 표시하는 행 |
|---|---|
| `"first"` (기본값) | 첫 번째를 뺀 나머지 중복 |
| `"last"` | 마지막을 뺀 나머지 중복 |
| `False` | ==중복 그룹의 모든 행== |

`keep=False`는 중복 그룹의 모든 행을 표시하므로 조사에 유용하다. 중복 제거 전에는 ==어떤 열의 조합을 동일 관측치의 기준으로 볼지== 먼저 정해야 한다.

## 결측치 대체

*27p*

```python
players = players.fillna({
    "market_value": players["market_value"].mean(),   # 수치형: 평균
    "position": "RM",                                 # 범주형: 지정 값
})
```

> [!NOTE]
> 평균 대체는 간단하지만 ==분산을 줄이고 분포를 왜곡==할 수 있다. 범주형 값은 최빈값이나 별도 `"Unknown"` 범주를 고려하고, 수치형 값은 중앙값·그룹별 대표값도 비교한다. 7주차 Drill 708에서 중앙값으로 채우는 예를 다시 본다.

## 집계와 변환

*28p~29p*

```python
summary = (
    players.select_dtypes(include="number")   # 숫자 열만
    .agg(["min", "max", "mean"])              # 열마다 세 가지 요약
)

converted = players[["market_value", "fpl_value"]] * 0.91   # 열 전체에 한 번에 곱하기
```

| 메서드 | 역할 | 결과의 관점 |
|---|---|---|
| `agg()` | 여러 값을 하나의 요약값으로 축약 | 열별 최솟값·평균 등 |
| `transform()` | 각 입력 위치에 대응하는 값을 반환 | 원본과 같은 모양 유지 |
| `apply()` | 함수를 행 또는 열 단위로 적용 | 함수에 따라 달라짐 |

```python
def round_float_series(series):
    if pd.api.types.is_float_dtype(series):
        return series.round()
    return series

rounded = players.apply(round_float_series)   # 열마다 함수 적용
```

> [!NOTE]
> 가능하면 단순 곱셈이나 `.round()`처럼 Pandas가 제공하는 ==벡터화 연산==을 먼저 쓴다(5주차 NumPy와 같은 원리). 일반적인 `apply()`보다 의도가 분명하고 대용량 데이터에서 빠른 경우가 많다. 7주차에서는 `apply`로 지저분한 문자열 열을 정리한다.

> [!CHECK]
> **1.** 기존 파일 `log.txt`가 있을 때 `open("log.txt", "w")`와 `open("log.txt", "a")`로 한 줄을 쓰면 각각 파일 내용은 어떻게 되는가?
>
> **2.** 인덱스가 `0~9`인 표에서 `df.loc[2:5]`와 `df.iloc[2:5]`는 각각 몇 행인가?
>
> **3.** 다음 필터의 오류를 고치시오: `df[df["age"] > 20 and df["club"] == "Arsenal"]`
>
> **4.** `df.dropna(thresh=3)`의 뜻은?

---

## 정답과 해설

**1.** `"w"`는 기존 내용을 지우고 새 줄 하나만 남기고, `"a"`는 기존 내용 뒤에 새 줄을 덧붙인다.

**2.** `loc[2:5]`는 끝 포함 → **4행**(2, 3, 4, 5), `iloc[2:5]`는 끝 미포함 → **3행**(2, 3, 4).

**3.** `df[(df["age"] > 20) & (df["club"] == "Arsenal")]`. `and` 대신 `&`를 쓰고 각 비교식을 괄호로 감싼다.

**4.** 결측이 아닌 값이 3개 이상인 행만 남긴다.

## 플래시카드

> [!FLASHCARD]
> Q: 4주차 — 파일 모드 `r`, `w`, `a`, `x`의 차이는?
> A: r는 읽기(없으면 오류), w는 쓰기(기존 내용 삭제), a는 이어 쓰기(뒤에 추가), x는 새 파일 만들기(이미 있으면 오류).

> [!FLASHCARD]
> Q: 4주차 — 파일을 `with` 문으로 여는 이유는?
> A: 블록을 벗어나면 오류가 생겨도 자동으로 닫히기 때문. close()를 빠뜨릴 걱정이 없다.

> [!FLASHCARD]
> Q: 4주차 — `read()`, `readline()`, `readlines()`의 차이는?
> A: 남은 전체를 문자열 하나로, 한 줄만, 모든 줄을 리스트로. 파일 객체는 읽은 위치를 기억하며 seek(0)으로 처음으로 돌아간다.

> [!FLASHCARD]
> Q: 4주차 — 데이터를 불러온 직후 확인할 세 가지는?
> A: head()로 값과 열 이름, shape로 크기, info()로 자료형과 결측치.

> [!FLASHCARD]
> Q: 4주차 — `loc`와 `iloc`의 차이는?
> A: loc는 레이블(이름) 기준이고 슬라이스 끝을 포함한다. iloc은 정수 위치 기준이고 끝을 포함하지 않는다. 단일 값은 at, iat.

> [!FLASHCARD]
> Q: 4주차 — Pandas 조건을 여러 개 결합하는 규칙은?
> A: 각 비교식을 괄호로 감싸고 and/or/not 대신 &, |, ~를 쓴다.

> [!FLASHCARD]
> Q: 4주차 — `duplicated(keep=False)`는 무엇을 표시하는가?
> A: 중복 그룹의 모든 행을 True로 표시한다. 기본값 keep="first"는 첫 행을 뺀 나머지만 표시한다.

> [!FLASHCARD]
> Q: 4주차 — `agg`, `transform`, `apply`의 차이는?
> A: agg는 여러 값을 요약값 하나로 줄이고, transform은 원본과 같은 모양을 유지하며, apply는 함수를 행 또는 열 단위로 적용한다.

## 핵심 점검

- 파일을 자동으로 닫는 안전한 문법은 {{with 문}}이다.
- `"w"` 모드는 기존 내용을 {{지운다}}.
- `DataFrame`의 크기는 {{shape}}로 확인한다.
- `loc`는 {{레이블}}, `iloc`은 {{정수 위치}}를 기준으로 선택한다.
- Pandas 조건을 결합할 때는 각 조건을 {{괄호}}로 감싸고 `&`, `|`, `~`를 사용한다.
- 숫자처럼 보이는 문자열 열은 {{astype}} 또는 `pd.to_numeric`으로 숫자로 바꾼다.
- 중복 제거와 결측치 대체는 실행 전에 분석 목적과 데이터 의미를 먼저 확인해야 한다.
