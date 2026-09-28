---
title: "4주차: 파일 입출력과 Pandas 데이터 처리"
description: "텍스트 파일 입출력과 Pandas의 데이터 불러오기, 선택, 정제, 필터링, 집계를 익힙니다."
order: 3
published: true
---

# 4주차: 파일 입출력과 Pandas 데이터 처리

## 이번 주 학습 목표

*1p~2p*

- 텍스트 파일을 안전하게 열고 읽고 쓸 수 있다.
- CSV·Excel 데이터를 Pandas `DataFrame`으로 불러올 수 있다.
- `loc`와 `iloc`을 구분해 행과 열을 선택할 수 있다.
- 결측치·중복값을 처리하고 조건에 맞는 행을 필터링할 수 있다.
- 집계와 변환으로 데이터의 특징을 요약할 수 있다.

## 파일 열기와 닫기

*3p~4p*

`open()`은 파일 객체를 반환한다. 모드에 따라 읽기·쓰기 동작이 달라진다.

| 모드 | 의미 | 파일이 없을 때 | 기존 내용 |
|---|---|---|---|
| `"r"` | 읽기 | 오류 | 유지 |
| `"w"` | 쓰기 | 새로 생성 | 모두 지움 |
| `"a"` | 이어 쓰기 | 새로 생성 | 뒤에 추가 |
| `"x"` | 새 파일 만들기 | 새로 생성 | 이미 있으면 오류 |

파일은 `with` 문으로 여는 것이 안전하다. 블록을 벗어나면 오류가 생겨도 자동으로 닫힌다.

```python
with open("test.txt", "w", encoding="utf-8") as file:
    file.write("첫 번째 줄\n")
    file.write("두 번째 줄\n")
    file.write("세 번째 줄\n")
```

> [!CAUTION]
> `"w"` 모드는 기존 파일 내용을 지우고 처음부터 쓴다. 내용을 보존하면서 추가하려면 `"a"`를 사용한다.

## 파일 내용 읽기

*5p~6p*

```python
with open("test.txt", "r", encoding="utf-8") as file:
    first_four = file.read(4)
    next_line = file.readline()
    rest = file.read()
```

| 메서드 | 반환 내용 |
|---|---|
| `read()` | 남은 내용 전체 |
| `read(n)` | 현재 위치에서 최대 `n`글자 |
| `readline()` | 한 줄 |
| `readlines()` | 각 줄을 요소로 갖는 리스트 |

파일 객체는 현재 읽은 위치를 기억한다. 끝까지 읽은 뒤 다시 `read()`하면 빈 문자열이 나온다. 처음부터 다시 읽으려면 `file.seek(0)`을 사용한다.

## Pandas와 DataFrame

*7p~8p*

Pandas는 표 형태 데이터를 다루는 파이썬 라이브러리이다.

| 객체 | 차원 | 비유 |
|---|---:|---|
| `Series` | 1차원 | 이름이 붙은 하나의 열 |
| `DataFrame` | 2차원 | 행과 열로 이루어진 표 |

```python
import pandas as pd
```

관례적으로 Pandas를 `pd`라는 별칭으로 불러온다. 별칭은 필수가 아니지만 문서와 예제 대부분이 이 관례를 따른다.

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

> [!TIP]
> 데이터를 불러온 직후에는 `head()`, `shape`, `info()`를 차례로 확인하면 구조와 품질 문제를 빠르게 파악할 수 있다.

## Series와 DataFrame 만들기

*15p*

```python
import pandas as pd

names = ["Olga", "Andrew", "Brian", "Telulah", "Nicole", "Tilda"]
ages = [29, 21, 45, 23, 39, 46]
married = [False, True, True, True, False, True]

name_series = pd.Series(names, name="name")
people = pd.DataFrame({
    "name": names,
    "age": ages,
    "married": married,
})

print(name_series.iloc[2])       # Brian
print(people.iloc[2, 0])         # Brian
```

## 인덱스와 표 구조 확인

*16p~17p*

CSV의 첫 열이 실제 행 이름이라면 불러올 때 인덱스로 지정할 수 있다.

```python
nutrition = pd.read_csv("nutrition.csv", index_col=0)

print(nutrition.axes)    # [행 인덱스, 열 인덱스]
print(nutrition.index)   # 행 이름
print(nutrition.columns) # 열 이름
print(nutrition.sample(n=3, random_state=12))
```

`random_state`를 고정하면 무작위 표본을 다시 실행해도 같은 결과가 나와 분석을 재현하기 쉽다.

불필요한 열은 명시적으로 제거한다.

```python
nutrition = nutrition.drop(columns=["Unnamed: 0"], errors="ignore")
```

## loc: 이름으로 선택하기

*18p*

`loc`는 행과 열의 **레이블**을 사용한다. 레이블 슬라이스는 끝 레이블도 포함한다.

```python
row = nutrition.loc["Eggplant, raw"]
calories = nutrition.loc["Eggplant, raw", "calories"]

subset = nutrition.loc[
    ["Raspberries, raw", "Blackberries, raw"],
    ["protein", "vitamin_b6", "water"],
]
```

## iloc, at과 iat

*19p*

`iloc`은 0부터 시작하는 **정수 위치**로 선택한다. 파이썬 슬라이스처럼 끝 위치를 포함하지 않는다.

```python
first_row = nutrition.iloc[0]
selected = nutrition.iloc[[4, 6, 9], 2:5]
```

| 접근자 | 기준 | 용도 |
|---|---|---|
| `loc` | 레이블 | 여러 행·열, 조건 선택 |
| `iloc` | 정수 위치 | 여러 행·열, 위치 선택 |
| `at` | 레이블 | 단일 값 빠르게 접근 |
| `iat` | 정수 위치 | 단일 값 빠르게 접근 |

```python
value_by_label = nutrition.at["Nuts, pecans", "calories"]
value_by_position = nutrition.iat[1, 1]
```

## 자료형 변환

*20p*

```python
people = pd.DataFrame({
    "age": [12, 13, 14, 16],
    "weight": [41.1, 34.5, 83.2, 90.1],
    "height": ["1.72", "1.74", "1.91", "1.54"],
})

people["height"] = people["height"].astype(float)
people["age"] = people["age"].astype(int)
```

실제 데이터에 잘못된 문자열이 섞였을 수 있다면 `pd.to_numeric(..., errors="coerce")`로 변환 실패 값을 `NaN`으로 만든 뒤 점검한다.

## 결측치 처리와 정렬

*21p*

결측치는 정보가 비어 있음을 나타내며 흔히 `NaN`으로 표현된다.

| 코드 | 의미 |
|---|---|
| `df.isna()` | 각 값의 결측 여부 |
| `df.dropna()` | 결측치가 있는 행 제거 |
| `df.dropna(how="all")` | 모든 값이 결측인 행 제거 |
| `df.dropna(thresh=3)` | 정상 값이 3개 이상인 행만 유지 |
| `df.fillna(value)` | 결측치를 지정 값으로 채움 |

```python
sorted_nutrition = nutrition.sort_values(
    by=["cholesterol", "sodium"],
    ascending=[False, True],
)
```

> [!CAUTION]
> 결측 행을 무조건 삭제하면 표본이 크게 줄거나 결과가 편향될 수 있다. 삭제·대체를 결정하기 전에 결측 비율과 발생 원인을 확인한다.

## 불리언 조건으로 행 필터링

*22p~25p*

```python
valuable = players.loc[players["market_value"] > 40]
defenders = players.loc[players["position"].isin(["LB", "CB", "RB"])]
young = players.loc[players["age"] <= 25]
mid_value = players.loc[players["market_value"].between(40, 50)]
```

여러 조건은 `&`(그리고), `|`(또는), `~`(부정)로 결합하고 각 비교식을 괄호로 감싼다.

```python
target = players.loc[
    (players["position"] == "LB")
    & (players["age"] <= 25)
    & (players["market_value"] >= 10)
    & ~players["club"].isin(["Tottenham", "Arsenal"])
]
```

> [!CAUTION]
> Pandas의 Series 조건에서는 파이썬의 `and`, `or`, `not`이 아니라 `&`, `|`, `~`를 사용한다.

## 중복 행 찾기와 제거

*26p*

```python
key_columns = ["club", "age", "position", "market_value"]

duplicates = players.loc[
    players.duplicated(subset=key_columns, keep=False)
]

deduplicated = players.drop_duplicates(
    subset=key_columns,
    keep="first",
)
```

`keep=False`는 중복 그룹의 모든 행을 표시하므로 조사에 유용하다. 중복 제거 전에는 어떤 열의 조합을 동일 관측치의 기준으로 볼지 먼저 정해야 한다.

## 결측치 대체

*27p*

```python
players = players.fillna({
    "market_value": players["market_value"].mean(),
    "position": "RM",
})
```

평균 대체는 간단하지만 분산을 줄이고 분포를 왜곡할 수 있다. 범주형 값은 최빈값이나 별도 `"Unknown"` 범주를 고려하고, 수치형 값은 중앙값·그룹별 대표값도 비교한다.

## 집계와 변환

*28p~29p*

```python
summary = (
    players.select_dtypes(include="number")
    .agg(["min", "max", "mean"])
)

converted = players[["market_value", "fpl_value"]] * 0.91
```

| 메서드 | 역할 | 결과의 관점 |
|---|---|---|
| `agg()` | 여러 값을 하나의 요약값으로 축약 | 열별 최솟값·평균 등 |
| `transform()` | 각 입력 위치에 대응하는 값을 반환 | 원본과 같은 축 유지 |
| `apply()` | 함수를 행 또는 열 단위로 적용 | 함수에 따라 달라짐 |

```python
def round_float_series(series):
    if pd.api.types.is_float_dtype(series):
        return series.round()
    return series

rounded = players.apply(round_float_series)
```

가능하면 단순 곱셈이나 `.round()`처럼 Pandas가 제공하는 벡터화 연산을 먼저 사용한다. 일반적인 `apply()`보다 의도가 분명하고 대용량 데이터에서 빠른 경우가 많다.

## 핵심 점검

*3p~29p*

- 파일을 자동으로 닫는 안전한 문법은 {{with 문}}이다.
- `DataFrame`의 크기는 {{shape}}로 확인한다.
- `loc`는 {{레이블}}, `iloc`은 {{정수 위치}}를 기준으로 선택한다.
- Pandas 조건을 결합할 때는 각 조건을 {{괄호}}로 감싸고 `&`, `|`, `~`를 사용한다.
- 중복 제거와 결측치 대체는 실행 전에 분석 목적과 데이터 의미를 먼저 확인해야 한다.

