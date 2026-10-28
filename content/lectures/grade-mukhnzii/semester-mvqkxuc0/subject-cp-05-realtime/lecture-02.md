---
title: "05-2 · Yjs와 CRDT"
description: "두 사람이 같은 문장을 동시에 고칠 때 왜 충돌이 생기는지, CRDT가 순서와 상관없이 같은 결과로 합치는 원리를 그림 없이 따라가고, Yjs의 Y.Doc·Update·상태 벡터·mergeUpdates·Awareness를 실제 코드로 실행해 보며 회의록 저장 설계의 근거를 이해합니다."
order: 2
published: true
duration: 45
tags: [Yjs, CRDT, Y.Doc, Update, 상태 벡터, Awareness, 공동 편집]
objectives:
  - 마지막 저장이 이기는 방식이 공동 편집에서 내용을 잃는 이유를 말한다.
  - CRDT의 세 성질(순서 무관·중복 무관·같은 결과)을 설명한다.
  - Y.Doc에서 Update를 만들고 다른 Doc에 적용하는 코드를 읽는다.
  - 상태 벡터로 빠진 부분만 주고받는 원리와 Awareness의 역할을 말한다.
---

## 1. 동시에 고치면 무슨 일이 생기나

회의록에 "예산 200만 원"이 있습니다. 같은 순간에

- A는 "예산" 앞에 "축제 "를 넣고 → "축제 예산 200만 원"
- B는 "200"을 "250"으로 바꿉니다 → "예산 250만 원"

**마지막 저장이 이기는** 방식이면, 나중에 저장한 사람의 문서 전체가 앞사람의 변경을 덮어씁니다. 둘 중 하나는 사라집니다. 문장을 통째로 잠그는 방식이면, 한 사람이 쓰는 동안 다른 사람은 기다려야 합니다.

공동 편집에 필요한 결과는 "**축제 예산 250만 원**" — 두 변경이 모두 살아 있는 것입니다.

## 2. CRDT — 순서가 달라도 같은 결과

**CRDT**(Conflict-free Replicated Data Type)는 각자 변경을 독립적으로 만들고, 그 변경들을 **어떤 순서로, 몇 번 받아도** 모두가 같은 결과에 도달하도록 설계된 데이터 구조입니다.

| 성질 | 뜻 | 회의록 저장 설계에서 |
| --- | --- | --- |
| 순서 무관 | A→B로 받든 B→A로 받든 결과가 같다 | Realtime 메시지가 뒤바뀌어 와도 됨 |
| 중복 무관 (멱등) | 같은 변경을 두 번 적용해도 한 번과 같다 | 재시도·재접속 때 이미 받은 것을 또 받아도 됨 |
| 수렴 | 모든 변경을 받은 사람들은 같은 문서를 본다 | 서버가 충돌을 판정할 필요 없음 |

원리를 아주 단순하게 말하면: 글자 하나하나에 "누가, 몇 번째로 만든 글자인지"라는 **고유 ID**를 붙이고, 새 글자는 "어느 글자 **오른쪽에**"라는 식으로 위치를 ID로 기억합니다. 숫자 위치(5번째 칸)가 아니라 이웃 글자의 ID로 기억하므로, 다른 사람이 앞에 글자를 넣어도 위치가 밀리지 않습니다. 지운 글자는 바로 없애지 않고 "지워짐" 표시만 남겨서 나중에 온 변경도 위치를 찾을 수 있게 합니다.

> [!NOTE]
> 기획서 6.4절이 "중앙 서버에서 문자 단위 충돌 해결 로직을 직접 작성할 필요가 없다"고 하는 이유가 이 성질입니다. 우리 DB 함수는 내용을 **이해하지 않고** Update 바이트를 저장하고 순서대로 전달만 합니다.

## 3. Yjs 기본 — Doc과 Update

**Yjs**는 자바스크립트 CRDT 라이브러리입니다. 아래 코드는 Node.js나 브라우저 Console에서 `yjs` 패키지로 실행해 볼 수 있습니다.

```ts
import * as Y from "yjs";

// 두 사람의 브라우저를 흉내 내는 두 문서
const docA = new Y.Doc();
const docB = new Y.Doc();

// 문서 안의 공유 텍스트 (BlockNote는 XmlFragment를 쓰지만 원리는 같다)
const textA = docA.getText("memo");
textA.insert(0, "예산 200만 원");

// A의 변경 전체를 바이트로 만들어 B에 적용
const update1 = Y.encodeStateAsUpdate(docA);
Y.applyUpdate(docB, update1);
console.log(docB.getText("memo").toString());   // "예산 200만 원"
```

| 코드 | 읽는 법 |
| --- | --- |
| `new Y.Doc()` | 문서 하나 (브라우저마다 하나씩 가짐) |
| `doc.getText("memo")` | 문서 안의 이름 붙은 공유 텍스트 |
| `encodeStateAsUpdate(doc)` | 문서 상태를 **Update**(바이트 배열, `Uint8Array`)로 |
| `applyUpdate(doc, update)` | 받은 Update를 내 문서에 합침 |

### 동시 편집 실험

```ts
// 이제 둘이 동시에, 서로 모르는 채로 고친다
docA.getText("memo").insert(0, "축제 ");                 // A: 앞에 "축제 "
const t = docB.getText("memo");
t.delete(3, 3); t.insert(3, "250");                      // B: "200" → "250"

// 변경이 생길 때마다 나오는 Update를 모아 둔다고 하자
const fromA = Y.encodeStateAsUpdate(docA, Y.encodeStateVector(docB));
const fromB = Y.encodeStateAsUpdate(docB, Y.encodeStateVector(docA));

Y.applyUpdate(docA, fromB);
Y.applyUpdate(docB, fromA);
console.log(docA.getText("memo").toString());   // "축제 예산 250만 원"
console.log(docB.getText("memo").toString());   // "축제 예산 250만 원"  ← 같다
Y.applyUpdate(docA, fromB);                      // 같은 걸 또 적용해도
console.log(docA.getText("memo").toString());   // 여전히 같다 (멱등)
```

## 4. 상태 벡터 — 빠진 부분만

**상태 벡터**(state vector)는 "나는 각 사람의 변경을 몇 번째까지 받았다"는 요약입니다. 상대의 상태 벡터를 알면 **상대에게 없는 부분만** Update로 만들 수 있습니다.

```ts
const svB = Y.encodeStateVector(docB);           // B가 가진 것의 요약
const missing = Y.encodeStateAsUpdate(docA, svB); // A가 가졌는데 B에 없는 것만
```

기획서 6.5절 5단계의 "Yjs 상태 벡터로 누락 차이를 재동기화"가 이것입니다. 재접속한 사용자가 문서 전체를 다시 받지 않고 차이만 맞출 수 있습니다.

## 5. Update 듣기와 묶기

```ts
const doc = new Y.Doc();
const pending: Uint8Array[] = [];

doc.on("update", (update: Uint8Array, origin: unknown) => {
  if (origin === "remote") return;               // 남에게서 받은 것은 다시 보내지 않음
  pending.push(update);                          // 내가 만든 변경만 모은다
});

// 300ms마다 모은 것을 하나로 합쳐 보낸다 (기획서 0.2절: 200–500ms 운영값)
setInterval(() => {
  if (pending.length === 0) return;
  const merged = Y.mergeUpdates(pending.splice(0));   // 여러 Update → 하나
  send(merged);                                        // 05-3: save_meeting_update RPC
}, 300);

// 남에게서 받은 Update는 origin을 "remote"로 표시해 적용
function onRemote(update: Uint8Array) {
  Y.applyUpdate(doc, update, "remote");
}
```

| 코드 | 읽는 법 |
| --- | --- |
| `doc.on("update", (update, origin) => …)` | 문서가 바뀔 때마다 그 변경분이 Update로 나옴 |
| `origin` | 누가 바꿨는지 표시. 받은 Update를 다시 보내는 무한 반복을 막는 데 씀 |
| `Y.mergeUpdates([...])` | 여러 Update를 하나로 합침. 키 입력마다 보내지 않고 묶어 보내 요청 수를 줄임 |

> [!CAUTION]
> `mergeUpdates`는 Update들을 붙여 줄 뿐, 지운 글자의 흔적까지 깔끔하게 정리하지는 않습니다. 그래서 기획서 6.5절 6단계는 주기적으로 **서버가 Y.Doc을 실제로 불러와** 전체 Snapshot(`encodeStateAsUpdate(doc)`)을 새로 만들라고 정합니다(05-3).

## 6. BlockNote와 연결

BlockNote는 Yjs 문서의 `XmlFragment`를 블록 구조의 원본으로 씁니다.

```tsx
const doc = new Y.Doc();
const editor = useCreateBlockNote({
  schema: meetingSchema,
  collaboration: {
    fragment: doc.getXmlFragment("document-store"),   // 블록이 저장되는 곳
    user: { name: "김국원", color: "#2563eb" },          // 다른 사람 화면에 보일 커서 이름·색
    provider,                                           // 05-3에서 만드는 전달자
  },
});
```

이제 사용자가 에디터에 입력하면 BlockNote가 `XmlFragment`를 바꾸고, Yjs가 `update` 이벤트로 변경분을 내놓습니다. 우리는 그 Update를 저장·전달하는 **provider**만 만들면 됩니다.

## 7. Awareness — 커서와 접속자

**Awareness**는 "누가 지금 어디에 커서를 두고 있나" 같은 **임시 상태**입니다. 문서 내용이 아니므로 DB에 저장하지 않습니다.

| 정보 | 어디로 | 이유 (기획서 6.4절) |
| --- | --- | --- |
| 커서 위치·선택 영역 | Realtime **Broadcast**의 `awareness` 이벤트 | 아주 자주 바뀜 |
| 접속자 목록 | Realtime **Presence** | 가끔 바뀜. Presence는 자주 바뀌는 값에 맞지 않음 |
| 문서 내용 (Update) | **DB 함수** → 저장 후 Broadcast | 사라지면 안 됨 |

> [!QUIZ]
> A의 Update가 네트워크 문제로 B에게 두 번 도착했습니다. B의 문서는 어떻게 되나요? 이 성질 덕분에 저장 설계에서 무엇이 쉬워지나요?

> [!ANSWER]
> 같은 Update를 두 번 적용해도 한 번 적용한 것과 같습니다(멱등). 그래서 재시도나 재접속 때 "이미 받은 것일지도 모르는" Update를 다시 받아도 안전하고, 순번으로 빠진 구간만 다시 읽어 오는 단순한 복구가 가능합니다.

> [!QUIZ]
> 키 입력마다 Update를 바로 DB에 보내지 않고 300ms씩 묶어 보내는 이유는?

> [!ANSWER]
> 한 글자마다 요청을 보내면 요청 수와 Realtime 메시지 수가 너무 많아져 느려지고 무료 요금제 한도도 빨리 씁니다. 짧게 모아 `mergeUpdates`로 합치면 요청 수가 크게 줄어도 사람이 느끼는 지연은 거의 없습니다. 묶음 간격은 기획서 0.2절의 운영값입니다.

## 학습 경로

[← 05-1 BlockNote 에디터](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-05-realtime/lecture-01) · [05-3 저장·전파·복구 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-05-realtime/lecture-03)
