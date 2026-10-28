---
title: "05-1 · BlockNote 에디터"
description: "Notion형 블록 에디터 BlockNote가 문서를 블록 목록으로 다루는 방식, React에서 에디터를 띄우는 코드, 기본 블록과 커스텀 Callout 블록, 한국어 별칭이 있는 Slash 메뉴, Template·안건을 블록 JSON으로 저장하는 법, Markdown 내보내기와 라이선스 범위를 익힙니다."
order: 1
published: true
duration: 45
tags: [BlockNote, 에디터, 블록, Slash 메뉴, 커스텀 블록, Template]
objectives:
  - BlockNote 문서가 블록 객체의 배열이라는 것을 JSON으로 읽는다.
  - useCreateBlockNote와 BlockNoteView로 에디터를 띄우는 코드를 읽는다.
  - 커스텀 Callout 블록과 한국어 별칭 Slash 메뉴 항목을 만드는 원리를 설명한다.
  - Template과 안건이 회의록 초기 블록으로 바뀌는 과정을 말한다.
---

[![브라우저 층의 BlockNote·Yjs와 Supabase 층의 Realtime이 강조된 세 층 지도](/materials/diagrams/cpg-15-stack-realtime.svg)](/materials/diagrams/cpg-15-stack-realtime.svg)

*그림 05-1 · 편집기와 Realtime이 만나는 곳 — 누르면 원본 크기로 열린다.*

## 1. 이 과목의 세 부품

| 부품 | 층 | 맡는 일 | 편 |
| --- | --- | --- | --- |
| **BlockNote** | 브라우저 | 사람이 보고 입력하는 블록 화면 | 05-1 |
| **Yjs** | 브라우저 | 여러 사람의 변경을 충돌 없이 합치는 데이터 구조 | 05-2 |
| **Supabase Realtime + DB 함수** | Supabase | 변경을 저장하고, 순번을 붙이고, 다른 사람에게 전달 | 05-3 |

## 2. 문서 = 블록의 배열

BlockNote는 문서를 **블록 객체의 배열**로 다룹니다. 화면의 한 줄(제목, 목록 항목, 할 일…)이 블록 하나입니다.

```json
[
  { "id": "b1", "type": "heading", "props": { "level": 2 }, "content": [{ "type": "text", "text": "안건 1. 축제 예산", "styles": {} }], "children": [] },
  { "id": "b2", "type": "checkListItem", "props": { "checked": false }, "content": [{ "type": "text", "text": "견적서 3곳 받기", "styles": {} }], "children": [] },
  { "id": "b3", "type": "callout", "props": { "tone": "warning" }, "content": [{ "type": "text", "text": "예산 상한 200만 원", "styles": { "bold": true } }], "children": [] }
]
```

| 속성 | 뜻 |
| --- | --- |
| `id` | 블록 고유 ID |
| `type` | 블록 종류 (`paragraph`, `heading`, `bulletListItem`, `numberedListItem`, `checkListItem`, `quote`, `codeBlock`, `table`…) |
| `props` | 종류별 설정 (제목 단계, 체크 여부, 색) |
| `content` | 글자 조각 배열. 조각마다 굵게·기울임 같은 `styles`, 링크는 `type: "link"` |
| `children` | 들여쓴 하위 블록 |

기획서 6.1절: 원본은 Markdown 문자열이 아니라 **이 블록 구조를 보존**합니다. 공동 편집 중에는 Yjs 문서가 원본이고(05-2), 필요할 때 Markdown·JSON으로 내보냅니다.

## 3. 에디터 띄우기

```tsx
// app/(council)/meetings/[meetingId]/editor.tsx
"use client";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

export function MeetingEditor({ editable }: { editable: boolean }) {
  const editor = useCreateBlockNote();          // 혼자 쓰는 에디터 (공동 편집 연결은 05-3)
  return <BlockNoteView editor={editor} editable={editable} />;
}
```

| 줄 | 읽는 법 |
| --- | --- |
| `"use client"` | 에디터는 키 입력·커서가 필요하므로 브라우저 Component (02-3) |
| `useCreateBlockNote()` | 에디터 객체를 한 번 만들어 기억 |
| `<BlockNoteView editor={editor} />` | 화면에 그림 (`@blocknote/mantine`은 Mantine UI로 꾸민 버전) |
| `editable={editable}` | `false`면 읽기 전용. CONFIRMED 회의록, 열람만 가능한 사람 |

> [!CAUTION]
> BlockNote는 버전이 빠르게 바뀝니다. 위 import 경로와 아래 커스텀 블록 API는 쓰는 버전의 공식 문서로 확인합니다. 기획서 Phase 0의 "BlockNote Block 지원 범위 PoC"가 바로 이 확인입니다.

## 4. 기본 입력 사양 (기획서 6.1절)

| 입력 | 결과 | 구현 |
| --- | --- | --- |
| `# ` `## ` `### ` | 제목 1·2·3 | 기본 |
| `- ` / `1. ` | 글머리·번호 목록 | 기본 |
| `[] ` | 할 일 | 기본 (`checkListItem`) |
| `> ` | 인용 | 기본 (버전 확인) |
| `/표`, `/코드`, `/구분선` | 표·코드·구분선 | 기본 (버전 확인) |
| `/콜아웃` | Callout | **커스텀 블록** |
| `/링크` | 링크 삽입 | Slash 항목 → 인라인 링크 |

## 5. 커스텀 Callout 블록

BlockNote 기본 블록에는 Callout이 없어서 직접 만듭니다.

```tsx
// components/editor/callout-block.tsx
import { createReactBlockSpec } from "@blocknote/react";

export const CalloutBlock = createReactBlockSpec(
  {
    type: "callout",
    propSchema: {
      tone: { default: "info", values: ["info", "warning", "decision"] as const },
    },
    content: "inline",                                    // 안에 글자를 쓸 수 있음
  },
  {
    render: ({ block, contentRef }) => (
      <div className={`callout callout-${block.props.tone}`} role="note">
        <span aria-hidden="true">{block.props.tone === "decision" ? "✅" : block.props.tone === "warning" ? "⚠️" : "💡"}</span>
        <div ref={contentRef} />                          {/* 사용자가 쓰는 글자가 들어갈 자리 */}
      </div>
    ),
  },
);
```

```tsx
// components/editor/schema.ts
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { CalloutBlock } from "./callout-block";

export const meetingSchema = BlockNoteSchema.create({
  blockSpecs: { ...defaultBlockSpecs, callout: CalloutBlock() },
});
```

| 부분 | 읽는 법 |
| --- | --- |
| `type: "callout"` | 블록 JSON의 `type` 값 |
| `propSchema` | 이 블록이 가질 설정과 허용 값 |
| `content: "inline"` | 글자 내용을 가짐 (`"none"`이면 내용 없는 블록) |
| `render` | 화면에 그리는 법. `contentRef`를 단 곳에 사용자의 글자가 들어감 |
| `{ ...defaultBlockSpecs, callout: … }` | 기본 블록 전부 + Callout |

Markdown으로 내보낼 때 커스텀 Callout은 인용(`>`)으로 바뀌는 **손실을 허용**합니다(기획서 6.1절).

## 6. 한국어 별칭이 있는 Slash 메뉴

```tsx
import { filterSuggestionItems } from "@blocknote/core";
import { SuggestionMenuController, getDefaultReactSlashMenuItems } from "@blocknote/react";
import { meetingSchema } from "./schema";

type MeetingEditor = typeof meetingSchema.BlockNoteEditor;   // 우리 스키마를 아는 에디터 타입

function calloutItem(editor: MeetingEditor) {
  return {
    title: "콜아웃",
    aliases: ["콜아웃", "강조", "callout", "알림"],      // /강조, /callout 으로도 찾음
    group: "기본 블록",
    onItemClick: () => {
      editor.insertBlocks([{ type: "callout", props: { tone: "info" } }], editor.getTextCursorPosition().block, "after");
    },
  };
}

<BlockNoteView editor={editor} slashMenu={false}>
  <SuggestionMenuController
    triggerCharacter="/"
    getItems={async (query) =>
      filterSuggestionItems([...getDefaultReactSlashMenuItems(editor), calloutItem(editor)], query)}
  />
</BlockNoteView>
```

| 부분 | 읽는 법 |
| --- | --- |
| `slashMenu={false}` | 기본 Slash 메뉴를 끄고 우리가 만든 것을 씀 |
| `triggerCharacter="/"` | `/`를 입력하면 메뉴가 열림 |
| `getItems(query)` | `/` 뒤에 입력한 글자로 항목을 거름 |
| `aliases` | 제목 외에 이 단어로도 찾게 함 (기획서: `/콜아웃`, `/강조`, `/callout` → 같은 기능) |
| `insertBlocks([...], 기준블록, "after")` | 커서가 있는 블록 뒤에 새 블록 삽입 |

기본 항목의 제목에도 한국어 별칭을 붙이려면 `getDefaultReactSlashMenuItems(editor)` 결과를 `map`으로 돌며 `aliases`에 `"제목"`, `"할일"`, `"표"`, `"코드"`, `"인용"`, `"구분선"`을 더합니다.

## 7. Template과 안건 → 초기 블록

회의록 Template(`meeting_templates.blocks`)은 위 블록 JSON 배열로 저장합니다. 회의 안건(추가 결정 4)에서 회의록을 만들 때는 서버가 Template 블록 뒤에 안건 항목마다 블록을 붙입니다.

```ts
// lib/meetings/agenda-blocks.ts  · 서버에서 실행
type AgendaItem = { title: string; description: string | null };

export function agendaToBlocks(items: AgendaItem[]) {
  return items.flatMap((item, i) => [
    { type: "heading", props: { level: 2 }, content: `안건 ${i + 1}. ${item.title}` },
    ...(item.description ? [{ type: "paragraph", content: item.description }] : []),
    { type: "heading", props: { level: 3 }, content: "논의" },
    { type: "paragraph", content: "" },
    { type: "heading", props: { level: 3 }, content: "결정" },
    { type: "callout", props: { tone: "decision" }, content: "" },
    { type: "heading", props: { level: 3 }, content: "할 일" },
    { type: "checkListItem", props: { checked: false }, content: "" },
  ]);
}
```

이 블록들을 **브라우저가 아니라 서버가** Yjs 문서로 바꿔 초기 Snapshot으로 저장합니다. 브라우저마다 넣으면 두 사람이 동시에 열었을 때 두 번 들어가기 때문입니다(기획서 6.7절, 05-3·06-3편).

## 8. 라이선스

BlockNote core 패키지는 MPL-2.0이라 이 프로젝트에 쓸 수 있습니다. 일부 확장 패키지(XL 계열의 PDF·DOCX 내보내기, 다단 블록 등)는 **별도 라이선스 조건**이 있으므로, MVP는 core 범위에서 만들고 확장을 쓰려면 먼저 조건을 확인합니다(기획서 6.1절).

> [!QUIZ]
> 열람만 가능한 사람이 회의록을 열었을 때 에디터 코드에서 바꿔야 할 한 가지와, 그것만으로 충분하지 않은 이유는?

> [!ANSWER]
> `<BlockNoteView editable={false} />`로 읽기 전용으로 엽니다. 하지만 이것은 화면 설정일 뿐이라 사용자가 코드를 바꿔 편집하고 저장 요청을 보낼 수 있습니다. 실제로는 `save_meeting_update()` DB 함수가 매 요청마다 편집 권한과 회의록 상태를 검사해 거부합니다(05-3).

> [!QUIZ]
> 사용자가 `/강조`를 입력했을 때 Callout 항목이 메뉴에 나오는 원리는?

> [!ANSWER]
> Slash 메뉴의 `getItems`가 `/` 뒤의 글자 `강조`로 항목들을 거르는데, `filterSuggestionItems`는 항목의 `title`뿐 아니라 `aliases`도 비교합니다. Callout 항목의 `aliases`에 `"강조"`가 있어서 메뉴에 나타납니다.

## 학습 경로

[← 04-5 DB 테스트와 성능](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-04-database/lecture-05) · [05-2 Yjs와 CRDT →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-05-realtime/lecture-02)
