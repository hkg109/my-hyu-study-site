---
title: "보충: Pandas 기본기능 총정리 (생성·필터·정렬·삭제·병합)"
description: "DataFrame을 만들고 확인하고, 열과 행을 고르고, 조건으로 거르고, 정렬·삭제·이름 변경으로 정돈한 뒤 concat·merge로 합치고 groupby로 요약하는 흐름을 그림 같은 표와 함께 정리합니다. 자주 나는 오류와 디버깅 순서도 담았습니다."
order: 4
published: true
duration: 80
tags: [AI-R-PY, Pandas, DataFrame, merge, groupby, 보충]
objectives:
  - DataFrame, Series, Index의 관계를 설명할 수 있다.
  - dict와 list of dict, 파일에서 DataFrame을 만들고 읽은 직후 점검할 수 있다.
  - 열 선택, 조건 필터, query, loc·iloc을 구분해 쓸 수 있다.
  - sort_values, drop, rename, assign으로 표를 정돈할 수 있다.
  - concat과 merge의 차이, merge의 how 옵션 네 가지를 설명할 수 있다.
  - groupby와 agg로 그룹별 요약표를 만들고 병합 결과를 검증할 수 있다.
---

## 학습 경로

[이전: 4주차 · 파일 입출력과 Pandas](/lectures/grade-01/semester-muheifg4/subject-muhz3nd1/lecture-03) · [다음: 5주차 · NumPy](/lectures/grade-01/semester-muheifg4/subject-muhz3nd1/lecture-05)

**범위:** 보충 자료 `pandas_basic_functions_visual_lecture.pdf` 1–17쪽. 4주차에서 배운 불러오기·선택·필터를 한 흐름으로 다시 묶고, 정렬·삭제·병합·groupby를 더한다. 6·7주차 실습에서 쓰는 `concat`, `apply`, `fillna`의 바탕이 된다.

## 단원 도입

> [!BOARD]
> **Pandas는 “데이터가 흘러가는 순서”로 외운다**
> - ==blue:① 가져오기== → dict · list · CSV · Excel → `pd.DataFrame`, `pd.read_csv`
> - ==blue:② 확인하기== → `head` · `info` · `shape` · `describe`
> - ==blue:③ 고르기== → 열 선택 · 행 필터 · `loc`/`iloc` · `query`
> - ==blue:④ 정리하기== → 정렬 · 삭제 · 이름 변경 · 새 열
> - ==blue:⑤ 합치기== → `concat` · `merge` → `groupby`로 요약·검증

| 구간 | 핵심 질문 | 대표 코드 |
|---|---|---|
| 생성 | 표를 어떻게 만들까? | `pd.DataFrame`, `pd.read_csv` |
| 필터 | 필요한 행만 어떻게 남길까? | `df[조건]`, `df.query()` |
| 정렬·삭제 | 표를 어떻게 정돈할까? | `sort_values`, `drop` |
| 병합 | 여러 표를 어떻게 연결할까? | `merge`, `concat` |
| 요약 | 그룹별로 어떻게 묶어 볼까? | `groupby().agg()` |

**목표:** DataFrame을 ==yellow:표처럼 보고, 코드로 조작하는 감각==을 만든다.

**형광펜 읽는 법:** ==yellow:노랑== 핵심 정의·결론 · ==red:빨강== 헷갈리기 쉬운 구분·함정 · ==blue:파랑== 외워야 할 순서·목록

> [!PAGEBREAK]

## 기본 단위: Series · DataFrame · Index

*3쪽*

| Index | name | dept | score |
|:---:|---|:---:|---:|
| **0** | Kim | A | 92 |
| **1** | Lee | B | 83 |
| **2** | Park | A | 77 |
| **3** | Choi | C | 88 |

> [!BOARD]
> **세 가지 단위**
> - ==blue:DataFrame== = 표 전체 (행 × 열)
> - ==blue:Series== = 한 열(또는 한 줄) → `df["score"]`는 `92, 83, 77, 88`
> - ==blue:Index== = 행의 주소(행 이름) → `0, 1, 2, 3`

> [!NOTE]
> 엑셀 표를 코드로 다룬다고 생각하면 된다. 다만 Pandas는 ==화면에 보이는 셀을 클릭하는 대신 열 이름과 조건식으로 움직인다==. 그래서 열 이름은 정확해야 하고, ==숫자처럼 보이는 문자나 문자처럼 보이는 숫자==는 반드시 자료형을 확인해야 한다.

## 시작 템플릿과 데이터 점검 순서

*4쪽*

```python
import pandas as pd

df = pd.read_csv("sales.csv")
print(df.shape)    # (행 수, 열 수)
print(df.head())   # 앞 5행
df.info()          # 자료형과 결측치
```

| 메서드 | 의미 | 확인할 것 |
|---|---|---|
| `df.shape` | 크기 | 행 수가 예상과 같은가 |
| `df.head()` | 앞부분 | 열 이름과 값이 정상인가 |
| `df.info()` | 구조 | 자료형과 null 여부 |
| `df.describe()` | 요약통계 | 이상치와 범위 |

> [!BOARD]
> **읽은 직후 점검 3단계**
> - ==blue:① 열 이름== → 공백, 한글, 대소문자, 오타
> - ==blue:② 자료형== → 날짜·숫자가 문자열로 들어오면 정렬·계산이 틀어진다
> - ==blue:③ 결측치== → 비어 있는 값은 평균·정렬·병합 결과를 흔든다

> [!NOTE]
> 처음에는 ==불러오기 → 모양 확인 → 앞부분 보기==만 해도 문제의 절반은 해결된다. `df.info()`는 화면에 직접 출력하고 `None`을 돌려주므로 `print(df.info())`라고 쓰면 마지막에 `None`이 한 줄 더 찍힌다.

## 생성 ① dict와 list of dict

*5쪽*

```python
data = {
    "name": ["Kim", "Lee", "Park"],
    "dept": ["A", "B", "A"],
    "sales": [120, 95, 180],
}
df = pd.DataFrame(data)
#   name dept  sales
# 0  Kim    A    120
# 1  Lee    B     95
# 2 Park    A    180

rows = [{"name": "Kim", "sales": 120}, {"name": "Lee", "sales": 95}]
df2 = pd.DataFrame(rows)   # 한 행 = 딕셔너리 하나
```

| 방식 | 생각하는 단위 | 어울리는 데이터 |
|---|---|---|
| dict of list | ==열 중심==: “열 이름: 값 목록” | 직접 만드는 작은 예제 |
| list of dict | ==행 중심==: “한 행 = dict 하나” | JSON, 웹 API, XML 파싱 결과 (6주차) |

> [!TRAP]
> dict 방식에서는 ==red:각 리스트의 길이가 같아야== 한다. 하나라도 길이가 다르면 `ValueError: All arrays must be of the same length`가 난다. 인덱스를 따로 지정하지 않으면 `0, 1, 2, …`가 붙고, 필요하면 `pd.DataFrame(data, index=["a", "b", "c"])`처럼 지정한다.

## 생성 ② 파일에서 읽기

*6쪽*

```python
df_csv  = pd.read_csv("sales.csv")
df_xlsx = pd.read_excel("sales.xlsx", sheet_name="2026")

pd.read_csv("sales.csv", encoding="utf-8-sig")       # 한글이 깨질 때
pd.read_csv("sales.csv", parse_dates=["date"])       # 날짜 열을 날짜형으로
pd.read_csv("sales.csv", usecols=["id", "sales"])    # 필요한 열만
```

| 함수 | 입력 | 주요 옵션 |
|---|---|---|
| `read_csv` | csv, txt | `encoding`, `sep`, `parse_dates`, `na_values`(7주차) |
| `read_excel` | xlsx | `sheet_name`, `usecols` |
| `read_json` | json | `orient`, `lines` |
| `read_sql` | DB | 쿼리, 연결 객체 |

## 선택: 열과 행을 정확히 집기

*7쪽*

| idx | name | dept | sales | cost |
|:---:|---|:---:|---:|---:|
| **0** | Kim | A | 120 | 70 |
| **1** | Lee | B | 95 | 60 |
| **2** | Park | A | 180 | 100 |
| **3** | Choi | C | 88 | 52 |

```python
df["sales"]                       # 한 열 → Series
df[["name", "sales"]]             # 여러 열 → DataFrame (대괄호 두 겹)
df.loc[0:2, ["name", "sales"]]    # 이름 기준 → 행 0, 1, 2 (끝 포함) × 열 2개
df.iloc[0:2, 1:3]                 # 위치 기준 → 행 0, 1 × 열 1, 2 (끝 미포함)
```

> [!BOARD]
> **대괄호 안에 무엇이 들어가나**
> - `df["열"]` → ==blue:열 하나== → Series
> - `df[["열1", "열2"]]` → ==blue:열 여러 개== → DataFrame
> - `df[조건]` → ==blue:행 필터== → 조건이 True인 행만
> - 행과 열을 동시에 고를 때는 `loc`(이름) 또는 `iloc`(위치)

> [!TRAP]
> 같은 `0:2`라도 ==red:loc은 끝을 포함==(행 0, 1, 2 → 3행)하고 ==red:iloc은 끝을 빼고==(행 0, 1 → 2행) 고른다. 실제 분석에서는 열 이름으로 고르는 `loc`이 순서가 바뀌어도 안전하다(4주차 *loc*, *iloc*).

## 필터 ① 조건식 → 마스크 → 남기기

*8쪽*

| idx | name | sales | `sales >= 100` |
|:---:|---|---:|:---:|
| 0 | Kim | 120 | ==True== |
| 1 | Lee | 95 | False |
| 2 | Park | 180 | ==True== |
| 3 | Choi | 88 | False |

```python
cond = df["sales"] >= 100     # True/False로 된 Series = 마스크(mask)
df2 = df[cond]                # True인 행(0, 2)만 남음

df2 = df[df["sales"] >= 100]  # 한 줄로도 가능
```

> [!CONCEPT]
> **불리언 마스크(boolean mask)** — 행마다 조건의 참·거짓을 담은 Series. `df[mask]`는 ==yellow:True 자리의 행만 남긴다==. 필터는 “조건식 → True/False 마스크 → True인 행만”의 세 단계다.

> [!NOTE]
> 조건 안의 비교는 `=`가 아니라 `==`다. 문자열 조건은 따옴표가 필요하다(`df["dept"] == "A"`). 복잡한 필터는 `cond`라는 변수로 나눠 두면 읽기 쉽다.

## 필터 ② 여러 조건 결합하기

*9쪽*

```python
df[(df["dept"] == "A") & (df["sales"] >= 100)]       # A 부서이면서 매출 100 이상 → Kim, Park
df[df["dept"].isin(["A", "B"])]                      # A 또는 B 부서 → Kim, Lee, Park
df[df["name"].str.contains("Kim", na=False)]         # 이름에 Kim 포함
df[df["sales"].between(88, 120)]                     # 88 이상 120 이하 → Kim, Lee, Choi
df.query("dept == 'A' and sales >= 100")             # query 방식 → Kim, Park
```

| 목적 | 문법 | 주의 |
|---|---|---|
| AND | `&` | 각 조건을 ==괄호로 묶기== |
| OR | `\|` | 파이프 기호 |
| NOT | `~` | 조건 앞에 붙임 |
| 목록 포함 | `isin([...])` | 여러 값 비교 |
| 범위 | `between(a, b)` | ==양 끝 포함== |

> [!TRAP]
> 가장 흔한 오류: `df[df["sales"] >= 100 & df["dept"] == "A"]`처럼 괄호를 빼면 `&`가 비교보다 먼저 계산되어 `100 & df["dept"]`를 먼저 하려다 `TypeError`가 ==red:난다==. 비교식마다 괄호를 씌운다. 또 Series 조건에는 파이썬의 `and`, `or`, `not`이 아니라 기호 `&`, `|`, `~`를 ==red:쓴다==. 반대로 `query()` 문자열 안에서는 `and`, `or`를 쓸 수 있다.

> [!NOTE]
> 조건이 길어지면 `cond1 = df["dept"] == "A"`, `cond2 = df["sales"] >= 100`으로 나눈 뒤 `df[cond1 & cond2]`로 합친다. `query()`는 SQL처럼 읽혀 짧지만, 열 이름에 공백이 있으면 `` `열 이름` ``처럼 백틱으로 감싸야 한다.

> [!PAGEBREAK]

## 정렬: sort_values와 sort_index

*10쪽*

```python
df.sort_values("sales")                                     # 오름차순: Choi 88, Lee 95, Kim 120, Park 180
df.sort_values("sales", ascending=False)                    # 내림차순: Park, Kim, Lee, Choi
df.sort_values(["dept", "sales"], ascending=[True, False])  # 부서 오름차순 → 같은 부서 안에서 매출 내림차순
df.sort_index()                                             # 행 인덱스 순서로 되돌리기
```

> [!NOTE]
> 여러 열로 정렬하면 ==첫 번째 열로 먼저 줄 세우고, 값이 같을 때만 두 번째 열을 본다==. `["dept", "sales"]`에서 A 부서인 Kim(120)과 Park(180)은 매출 내림차순으로 Park이 먼저 온다. 결과: Park, Kim, Lee, Choi.

> [!TRAP]
> 숫자 열이 문자열로 읽혔다면 정렬이 ==red:사전 순==(`"100" < "88"`)으로 된다. 정렬 결과가 이상하면 `df.dtypes`부터 확인한다. 정렬도 ==새 DataFrame을 돌려줄 뿐 원본은 그대로==다.

## 삭제·수정: drop, rename, assign

*11쪽*

```python
df2 = df.drop(columns=["cost"])                    # 열 삭제
df2 = df.drop(index=[0, 2])                        # 행 삭제 → Lee, Choi
df2 = df.rename(columns={"sales": "revenue"})      # 열 이름 변경
df2 = df.assign(profit=df["sales"] - df["cost"])   # 새 열 → 50, 35, 80, 36
```

| name | sales | cost | profit |
|---|---:|---:|---:|
| Kim | 120 | 70 | 50 |
| Lee | 95 | 60 | 35 |
| Park | 180 | 100 | 80 |

> [!BOARD]
> **정돈할 때의 두 가지 습관**
> - inplace=True ==blue:대신 새 변수에== → `df2 = ...`로 결과를 확인한 뒤 원본에 반영 (7주차의 `inplace` 경고 참고)
> - ==blue:axis 대신 columns / index== → `drop(axis=1)`보다 `drop(columns=[...])`가 뜻이 분명

> [!NOTE]
> `df["profit"] = df["sales"] - df["cost"]`도 새 열을 만들지만 원본을 바로 바꾼다. `assign()`은 ==새 DataFrame을 돌려줘서 여러 단계를 점(.)으로 이어 쓰기 좋다==(아래 *미니 프로젝트*의 파이프라인).

## 병합 ① concat과 merge의 차이

*12쪽*

> [!BOARD]
> **붙이기 vs 연결하기**
> - ==blue:concat== = 같은 구조의 표를 위아래(`axis=0`) 또는 좌우(`axis=1`)로 ==단순히 붙이기==
> - ==blue:merge== = 공통 열(key)을 기준으로 ==서로 다른 정보를 짝지어 연결하기==
> - 먼저 판단할 것: 행을 늘리는가, 열을 늘리는가, 공통 key가 필요한가?

```python
pd.concat([df1, df2], axis=0)                 # 위아래로 (행이 늘어남)
pd.concat([df1, df2], axis=1)                 # 좌우로 (열이 늘어남)
pd.merge(left, right, on="id", how="left")    # id를 기준으로 연결
```

| concat (위아래) | | merge (key = id) | |
|---|---|---|---|
| `id 1, 2` + `id 3, 4` | → `id 1, 2, 3, 4` | `id, sales` + `id, dept` | → `id, sales, dept` |

> [!TRAP]
> `pd.concat([L, L])`의 결과 인덱스는 `0, 1, 2, 0, 1, 2`처럼 ==red:중복==된다. 새 번호가 필요하면 `ignore_index=True`를 준다. 7주차의 `pd.concat([dataset, labels], axis=1)`은 행 순서가 같은 두 표를 좌우로 붙인 예다.

## 병합 ② how 옵션: inner · left · right · outer

*13쪽*

```python
left  = pd.DataFrame({"id": [1, 2, 3], "sales": [120, 95, 180]})
right = pd.DataFrame({"id": [2, 3, 4], "grade": ["B", "A", "C"]})

pd.merge(left, right, on="id", how="inner")   # id 2, 3
pd.merge(left, right, on="id", how="left")    # id 1, 2, 3   (id 1의 grade는 NaN)
pd.merge(left, right, on="id", how="right")   # id 2, 3, 4   (id 4의 sales는 NaN)
pd.merge(left, right, on="id", how="outer")   # id 1, 2, 3, 4
```

| how | 남기는 행 | 결과 id |
|---|---|---|
| `inner` (기본값) | ==양쪽 모두 있는 key만== | 2, 3 |
| `left` | 왼쪽 표는 모두 유지 | 1, 2, 3 |
| `right` | 오른쪽 표는 모두 유지 | 2, 3, 4 |
| `outer` | 한쪽에만 있어도 유지 | 1, 2, 3, 4 |

> [!NOTE]
> 짝이 없는 칸은 ==NaN==으로 채워진다. `how="right"`에서 id 4는 왼쪽에 매출이 없으므로 `sales`가 NaN이 되고, NaN 때문에 그 열은 `95.0, 180.0`처럼 실수형으로 바뀐다. `how`를 생략하면 ==inner==다.

## groupby로 요약표 만들기

*14쪽*

```python
summary = (
    df.groupby("dept", as_index=False)
      .agg(sum_sales=("sales", "sum"),
           avg_sales=("sales", "mean"),
           n=("sales", "count"))
)
#   dept  sum_sales  avg_sales  n
# 0    A        300      150.0  2
# 1    B         95       95.0  1
# 2    C         88       88.0  1
```

> [!CONCEPT]
> **Split-Apply-Combine** — `groupby`는 ==yellow:① 같은 값끼리 나누고(split) → ② 그룹마다 계산하고(apply) → ③ 결과를 한 표로 합친다(combine)==. A 부서는 Kim 120 + Park 180 = 300이다.

> [!NOTE]
> `agg(새 열 이름=("원래 열", "함수"))` 형식을 ==named aggregation==이라고 한다. 결과 열 이름을 직접 정할 수 있어 읽기 좋다. `as_index=False`를 주면 `dept`가 인덱스로 올라가지 않고 일반 열로 남는다.

> [!TRAP]
> ==red:merge 후 행 수가 갑자기 늘면 key 중복을 의심==한다. 오른쪽 표에 `id 1`이 두 번 있으면 왼쪽의 `id 1` 한 행이 두 행으로 불어난다. 병합 전후에 `len(df)`와 `df["id"].value_counts()`로 key별 건수를 확인한다.

> [!PAGEBREAK]

## 미니 프로젝트: 매출 데이터 정리 파이프라인

*15쪽*

```python
orders = pd.DataFrame({
    "order_id": ["o1", "o2", "o3"],
    "customer_id": ["c1", "c2", "c1"],
    "amount": [120, 95, 180],
})
customers = pd.DataFrame({
    "customer_id": ["c1", "c2", "c3"],
    "region": ["Seoul", "Busan", "Daegu"],
})

result = (
    orders.merge(customers, on="customer_id", how="left")   # ① 주문에 지역 붙이기
          .query("amount >= 100")                           # ② 100 이상만
          .sort_values("amount", ascending=False)           # ③ 큰 순서로
          .groupby("region", as_index=False)["amount"].sum()  # ④ 지역별 합계
)
#   region  amount
# 0  Seoul     300
```

> [!CAUTION]
> **자료 정정 (15쪽)** — 자료의 결과 그림에는 `Busan 95`도 있지만, ② `query("amount >= 100")`에서 95원짜리 주문 o2가 빠지므로 ==red:실제 결과는 Seoul 300 한 줄==이다. Busan까지 보려면 필터 조건을 빼거나 `amount >= 90`처럼 바꿔야 한다. 파이프라인은 중간 단계를 하나씩 실행해 보며 결과를 확인하는 습관이 중요하다.

> [!PROBLEM]
> **실습 과제 1.** amount가 100 이상인 주문만 남긴 뒤 지역별 합계를 구하시오.
>
> **풀이.** 위 파이프라인 그대로다. ① merge로 c1 → Seoul, c2 → Busan을 붙인다. ② 100 이상인 o1(120), o3(180)만 남는다. ③ 정렬은 합계에 영향을 주지 않는다. ④ 둘 다 Seoul이므로 `Seoul 300`.

> [!PROBLEM]
> **실습 과제 2.** 고객 정보가 없는 주문을 찾고, 어떤 join을 써야 하는지 설명하시오.
>
> **풀이.**
> 1. 주문은 ==모두 남겨야== 하므로 주문 표를 왼쪽에 두고 `how="left"`로 합친다.
> 2. 고객 표에 짝이 없는 주문은 `region`이 NaN이 된다 → `merged[merged["region"].isna()]`로 찾는다.
> 3. `how="inner"`를 쓰면 그런 주문이 ==결과에서 조용히 사라져== 찾을 수 없다. `merge(..., indicator=True)`를 주면 `_merge` 열에 `left_only`라고 표시되어 더 쉽게 찾는다.

## 자주 나는 오류와 디버깅 순서

*16쪽*

| 오류·증상 | 주요 원인 | 확인 코드 |
|---|---|---|
| `KeyError` | 열 이름 오타·공백 | `df.columns` |
| 빈 결과 | 조건식과 실제 값 불일치 | `df["열"].unique()` |
| 정렬 이상 | 숫자가 문자열 | `df.dtypes` |
| merge 후 행 폭증 | key 중복 | `value_counts()` |
| `SettingWithCopyWarning` | 필터한 부분 복사본을 수정 | `.loc` 사용 |

```python
print(df.columns)                      # 1. 열 이름
print(df.dtypes)                       # 2. 자료형
print(df.isna().sum())                 # 3. 결측치
print(df["id"].value_counts().head())  # 4. key 중복
```

> [!NOTE]
> `SettingWithCopyWarning`은 `sub = df[df["sales"] > 100]` 다음에 `sub["x"] = 1`처럼 ==잘라 낸 결과에 값을 넣을 때== 난다. 원본을 바꾸려면 `df.loc[df["sales"] > 100, "x"] = 1`처럼 한 번에 쓰고, 복사본을 따로 쓰려면 `sub = df[...].copy()`로 만든다.

> [!NOTE]
> 한 줄 코드를 길게 쓰기보다 ==중간 결과를 df2, df3로 확인==하면 오류를 빨리 찾는다.

## 핵심 문법 요약

*17쪽*

| 구간 | 문법 |
|---|---|
| 생성 | `pd.DataFrame(data)`, `pd.read_csv("file.csv")` |
| 확인 | `df.head()`, `df.info()`, `df.shape` |
| 선택 | `df["col"]`, `df[["a", "b"]]`, `df.loc[rows, cols]` |
| 필터 | `df[df["x"] >= 10]`, `df.query("x >= 10")` |
| 정렬 | `df.sort_values("x")`, `df.sort_index()` |
| 삭제·수정 | `df.drop(columns=["x"])`, `df.rename(columns={"a": "b"})` |
| 병합 | `pd.concat([a, b])`, `a.merge(b, on="id", how="left")` |
| 요약 | `df.groupby("g").agg(...)`, `df.value_counts()` |

> [!CHECK]
> **1.** `df[["name"]]`과 `df["name"]`의 결과 자료형은 각각 무엇인가?
>
> **2.** `left`(id 1, 2, 3)와 `right`(id 2, 3, 4)를 `how="outer"`로 합치면 결과는 몇 행인가?
>
> **3.** 연습 문제(17쪽): 고객·주문 두 표를 합쳐서 2026년 주문만 남긴 뒤 고객별 매출 합계를 내림차순으로 정렬하는 파이프라인을 쓰시오. 주문 표에는 `order_date`(날짜형), `customer_id`, `amount` 열이 있다.

---

## 정답과 해설

**1.** `df[["name"]]`은 열이 하나인 ==DataFrame==, `df["name"]`은 ==Series==다. 대괄호를 두 겹 쓰면 “열 목록”으로 고른 것이라 표 모양이 유지된다.

**2.** **4행**(id 1, 2, 3, 4). 한쪽에만 있는 id도 모두 남는다.

**3.** 예시 답안:

```python
result = (
    orders.merge(customers, on="customer_id", how="left")
          .query("order_date.dt.year == 2026")
          .groupby("customer_id", as_index=False)["amount"].sum()
          .sort_values("amount", ascending=False)
)
```

정렬은 합계를 구한 ==뒤에== 해야 “고객별 합계의 내림차순”이 된다. `query` 대신 `[lambda d: d["order_date"].dt.year == 2026]`나, 미리 만든 마스크로 걸러도 된다. 날짜가 문자열이면 먼저 `pd.to_datetime()`으로 바꾼다.

## 플래시카드

> [!FLASHCARD]
> Q: 보충 Pandas — DataFrame, Series, Index의 관계는?
> A: DataFrame은 표 전체, Series는 한 열(한 줄), Index는 행의 주소(행 이름)다.

> [!FLASHCARD]
> Q: 보충 Pandas — 데이터를 읽은 직후 점검하는 3단계는?
> A: ① 열 이름(공백·대소문자·오타) ② 자료형(숫자·날짜가 문자열인지) ③ 결측치. 코드로는 `df.columns`, `df.dtypes`/`info()`, `df.isna().sum()`.

> [!FLASHCARD]
> Q: 보충 Pandas — `df["a"]`, `df[["a", "b"]]`, `df[조건]`의 차이는?
> A: 열 하나(Series), 열 여러 개(DataFrame), 조건이 True인 행만 남긴 행 필터.

> [!FLASHCARD]
> Q: 보충 Pandas — 여러 조건 필터에서 가장 흔한 실수는?
> A: 비교식마다 괄호를 빼먹는 것. `(df.a == 1) & (df.b >= 2)`처럼 괄호로 묶고, and/or/not 대신 &, |, ~를 쓴다.

> [!FLASHCARD]
> Q: 보충 Pandas — concat과 merge의 차이는?
> A: concat은 같은 구조의 표를 위아래·좌우로 단순히 붙이고, merge는 공통 key 열을 기준으로 서로 다른 정보를 짝지어 연결한다.

> [!FLASHCARD]
> Q: 보충 Pandas — merge의 how 네 가지는?
> A: inner(양쪽 모두 있는 key만, 기본값), left(왼쪽 모두 유지), right(오른쪽 모두 유지), outer(한쪽에만 있어도 유지). 짝 없는 칸은 NaN.

> [!FLASHCARD]
> Q: 보충 Pandas — groupby의 Split-Apply-Combine이란?
> A: 같은 값끼리 나누고(split), 그룹마다 계산하고(apply), 결과를 한 표로 합친다(combine).

> [!FLASHCARD]
> Q: 보충 Pandas — merge 후 행 수가 갑자기 늘었다면?
> A: key 중복을 의심한다. 병합 전후 행 수와 `value_counts()`로 key별 건수를 확인한다.

## 핵심 점검

- DataFrame에서 한 열을 꺼내면 {{Series}}가 된다.
- 필터는 조건식 → True/False {{마스크}} → True인 행만 남기는 흐름이다.
- `between(a, b)`는 양 끝을 {{포함}}한다.
- `sort_values(..., ascending=False)`는 {{내림차순}} 정렬이다.
- 공통 key로 두 표를 연결하는 함수는 {{merge}}, 단순히 붙이는 함수는 {{concat}}이다.
- `how`를 생략한 merge는 {{inner}} 조인이다.
- merge 후 행이 늘면 {{key 중복}}을 의심한다.
