---
title: "04-2 · SQL 읽기·쓰기"
description: "SELECT·WHERE·ORDER BY·LIMIT부터 JOIN·GROUP BY·EXISTS, INSERT·UPDATE·RETURNING까지 학생회 실제 쿼리로 익히고, Supabase JavaScript 쿼리(.from().select().eq())가 어떤 SQL로 바뀌는지 짝지어 읽습니다."
order: 2
published: false
duration: 50
tags: [SQL, SELECT, JOIN, GROUP BY, INSERT, UPDATE, Supabase 쿼리]
objectives:
  - SELECT 문을 FROM → WHERE → SELECT → ORDER BY 순서로 읽는다.
  - JOIN으로 업무와 담당자 이름을 함께 가져오는 쿼리를 읽는다.
  - GROUP BY와 COUNT로 국별 미완료 업무 수를 구한다.
  - Supabase JS 쿼리와 SQL을 서로 바꿔 읽는다.
---

## 1. SQL은 "무엇을 원하는지"를 적는다

SQL은 DB에 "이런 데이터를 달라/바꿔라"를 적는 언어입니다. **어떻게** 찾을지는 DB가 알아서 정합니다.

```sql
SELECT id, title, status, due_date      -- ③ 이 열들을
FROM tasks                              -- ① tasks 테이블에서
WHERE term_id = '…' AND status <> 'DONE' -- ② 이 조건에 맞는 행만
ORDER BY due_date ASC                   -- ④ 마감일 빠른 순으로
LIMIT 20;                               -- ⑤ 20개만
```

적힌 순서와 달리 **① FROM → ② WHERE → ③ SELECT → ④ ORDER BY → ⑤ LIMIT** 순서로 읽으면 이해가 쉽습니다.

| 키워드 | 뜻 |
| --- | --- |
| `SELECT 열들` | 가져올 열. `*`는 전부 (실무에서는 필요한 열만) |
| `FROM 테이블` | 어느 테이블에서 |
| `WHERE 조건` | 어떤 행만 |
| `ORDER BY 열 ASC/DESC` | 오름차순/내림차순 정렬 |
| `LIMIT n OFFSET m` | n개만, m개 건너뛰고 (페이지네이션) |

### WHERE 조건들

| 조건 | 뜻 |
| --- | --- |
| `status = 'DONE'` / `<>` | 같다 / 다르다 |
| `due_date < now()` | 지금보다 이전 |
| `assignee_id IS NULL` | 비어 있다 (`= NULL`은 항상 거짓이라 쓰면 안 됨) |
| `status IN ('TODO', 'IN_PROGRESS')` | 이 중 하나 |
| `title ILIKE '%축제%'` | 제목에 "축제" 포함 (대소문자 무시) |
| `a AND b` / `a OR b` / `NOT a` | 그리고 / 또는 / 아님 |

## 2. JOIN — 여러 테이블을 붙여 읽기

업무 목록에 담당자 **이름**을 보여 주려면 `tasks`와 `profiles`를 붙입니다.

```sql
SELECT t.title, t.status, p.display_name AS assignee_name
FROM tasks AS t
LEFT JOIN profiles AS p ON p.id = t.assignee_id
WHERE t.term_id = '…'
  AND t.archived_at IS NULL;
```

| 부분 | 읽는 법 |
| --- | --- |
| `tasks AS t` | tasks를 짧게 `t`라고 부름 |
| `LEFT JOIN profiles AS p` | profiles를 `p`로 붙이되, 짝이 없어도 업무는 남김 |
| `ON p.id = t.assignee_id` | 붙이는 조건: 담당자 ID가 같은 행끼리 |
| `AS assignee_name` | 결과 열 이름을 바꿈 |

| JOIN 종류 | 짝이 없는 행 | 언제 |
| --- | --- | --- |
| `INNER JOIN` (`JOIN`) | 버림 | 반드시 짝이 있어야 할 때 |
| `LEFT JOIN` | 왼쪽은 남기고 오른쪽 열은 NULL | 담당자가 없는 업무도 보여 줄 때 |

## 3. 모아서 세기 — GROUP BY

국별 미완료 업무 수 (Dashboard·회장단 화면):

```sql
SELECT d.name AS department, COUNT(*) AS open_tasks
FROM tasks t
JOIN departments d ON d.id = t.department_id
WHERE t.term_id = '…' AND t.status <> 'DONE' AND t.archived_at IS NULL
GROUP BY d.name
ORDER BY open_tasks DESC;
```

| 부분 | 읽는 법 |
| --- | --- |
| `GROUP BY d.name` | 국 이름이 같은 행끼리 한 묶음으로 |
| `COUNT(*)` | 묶음마다 행 수 |
| `HAVING COUNT(*) > 5` | (붙인다면) 묶은 결과에 거는 조건 |

## 4. EXISTS — "그런 행이 하나라도 있나"

권한 검사에서 가장 많이 쓰는 형태입니다.

```sql
-- 이 사용자가 지금 ACTIVE 기수의 활성 구성원인가?
SELECT EXISTS (
  SELECT 1
  FROM memberships m
  JOIN terms tm ON tm.id = m.term_id
  WHERE m.user_id = auth.uid()
    AND m.is_active
    AND tm.status = 'ACTIVE'
);
```

`SELECT 1`은 "값은 상관없고 행이 있는지만"이라는 관용 표현입니다. 04-4편의 RLS 정책 대부분이 이 모양입니다.

## 5. 쓰기 — INSERT, UPDATE, RETURNING

```sql
-- 새 업무
INSERT INTO tasks (term_id, department_id, title, creator_id, status, visibility_mode)
VALUES ('…', '…', '현수막 시안', auth.uid(), 'TODO', 'DEFAULT')
RETURNING id;

-- 완료 처리
UPDATE tasks
SET status = 'DONE', completed_at = now(), updated_at = now()
WHERE id = '…'
RETURNING id, status;

-- 삭제 대신 보관 (기획서 4.6절)
UPDATE tasks SET archived_at = now(), archived_by = auth.uid() WHERE id = '…';
```

| 부분 | 읽는 법 |
| --- | --- |
| `INSERT INTO 테이블 (열들) VALUES (값들)` | 새 행 추가 |
| `UPDATE 테이블 SET 열 = 값 WHERE 조건` | 조건에 맞는 행의 값 변경 |
| `RETURNING id` | 바뀐 행의 값을 돌려받음 |

> [!CAUTION]
> ==red:UPDATE·DELETE에서 WHERE를 빼먹으면 테이블의 모든 행이 바뀝니다.== RLS가 켜져 있으면 "볼 수 있는 행 전부"로 줄어들지만 그래도 위험합니다. 이 프로젝트는 업무·회의록을 물리 삭제하지 않고 보관 처리합니다.

## 6. Supabase JS 쿼리 ↔ SQL

Supabase 클라이언트의 쿼리는 내부에서 SQL과 같은 요청으로 바뀝니다(PostgREST라는 중간 서버가 변환).

| Supabase JS | SQL |
| --- | --- |
| `.from("tasks")` | `FROM tasks` |
| `.select("id, title")` | `SELECT id, title` |
| `.select("title, assignee:profiles!assignee_id(display_name)")` | `LEFT JOIN profiles ON profiles.id = tasks.assignee_id` |
| `.eq("status", "DONE")` | `WHERE status = 'DONE'` |
| `.neq("status", "DONE")` | `WHERE status <> 'DONE'` |
| `.in("status", ["TODO", "REVIEW"])` | `WHERE status IN (…)` |
| `.is("archived_at", null)` | `WHERE archived_at IS NULL` |
| `.lt("due_date", today)` | `WHERE due_date < …` |
| `.ilike("title", "%축제%")` | `WHERE title ILIKE '%축제%'` |
| `.order("due_date", { ascending: true })` | `ORDER BY due_date ASC` |
| `.range(0, 19)` | `LIMIT 20 OFFSET 0` |
| `.single()` / `.maybeSingle()` | 한 행 (없으면 오류 / null) |
| `.insert({...}).select("id")` | `INSERT … RETURNING id` |
| `.update({...}).eq("id", x)` | `UPDATE … WHERE id = x` |
| `.rpc("create_task", {...})` | `SELECT create_task(…)` — DB 함수 호출 |

> [!NOTE]
> 어느 쪽으로 쓰든 **RLS는 똑같이 적용됩니다.** `.from("tasks").select()`를 해도 사용자가 볼 수 있는 행만 돌아옵니다. 그래서 화면 코드에 `.eq("department_id", 내 부서)`를 빼먹어도 다른 국 제한 업무가 새지는 않습니다. 다만 성능과 의도를 위해 필요한 조건은 명시합니다.

## 7. 직접 해보기 (개발 프로젝트의 SQL Editor)

1. 마감이 지났는데 DONE이 아닌 업무를 담당자 이름과 함께 마감일 순으로.
2. 행사별 업무 수 (`event_id`가 없는 업무는 "행사 없음"으로 묶기: `COALESCE(e.name, '행사 없음')`).
3. 위 1번을 Supabase JS 쿼리로 바꿔 쓰기.

> [!QUIZ]
> 1번의 SQL을 쓰세요.

> [!ANSWER]
> ```sql
> SELECT t.title, t.due_date, p.display_name AS assignee_name
> FROM tasks t
> LEFT JOIN profiles p ON p.id = t.assignee_id
> WHERE t.status <> 'DONE'
>   AND t.due_date < current_date
>   AND t.archived_at IS NULL
> ORDER BY t.due_date;
> ```
> 담당자가 없는 업무도 보여야 하므로 `LEFT JOIN`을 씁니다.

> [!QUIZ]
> `WHERE assignee_id = NULL`이 원하는 결과를 주지 않는 이유는?

> [!ANSWER]
> SQL에서 NULL은 "모르는 값"이라 어떤 값과 `=`로 비교해도 참이 아니라 "알 수 없음"이 됩니다. 그래서 어떤 행도 고르지 못합니다. 비어 있는지 확인할 때는 `IS NULL`(Supabase JS에서는 `.is("assignee_id", null)`)을 씁니다.

## 학습 경로

[← 04-1 테이블과 관계](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-04-database/lecture-01) · [04-3 마이그레이션과 제약조건 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-04-database/lecture-03)
