import { writeFileSync } from "node:fs";
import path from "node:path";

// Figures for the 학생회 운영 플랫폼 study guide, drawn 560 units wide for phones: node scripts/generate-council-figures.mjs
const outDir = process.argv[2] ?? path.join("public", "materials", "diagrams");
const W = 560;
const sans = "'Pretendard','Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif";
const mono = "'D2Coding','JetBrains Mono','Consolas',monospace";
const esc = text => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Rough advance width so label masks hug their text.
function textWidth(text, size) {
  let width = 0;
  for (const ch of String(text)) {
    if (/[ᄀ-ᇿ㄰-㆏가-힣一-鿿]/.test(ch)) width += size * 0.98;
    else if (ch === " ") width += size * 0.3;
    else if (/[A-Z]/.test(ch)) width += size * 0.64;
    else width += size * 0.55;
  }
  return width;
}

let slug = "";
const t = (x, y, text, cls = "body", anchor = "start") => `<text class="${cls}" x="${x}" y="${y}"${anchor === "start" ? "" : ` text-anchor="${anchor}"`}>${esc(text)}</text>`;
const rect = (x, y, w, h, cls = "node", rx = 6) => `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/>`;
const p = (d, cls = "flow") => `<path class="${cls}" d="${d}"/>`;
const LH = { tag: 18, name: 23, body: 21, code: 21, small: 19, lab: 20 };

// A box with vertically centred lines: [text, cls] pairs.
function node(x, y, w, h, cls, rows, anchor = "middle") {
  const inv = cls === "focal" ? " inv" : "";
  const total = rows.reduce((sum, [, c]) => sum + LH[c.split(" ")[0]], 0);
  let cursor = y + (h - total) / 2;
  const tx = anchor === "middle" ? x + w / 2 : x + 16;
  const out = [rect(x, y, w, h, cls)];
  for (const [text, c] of rows) {
    const lh = LH[c.split(" ")[0]];
    out.push(t(tx, (cursor + lh * 0.74).toFixed(1), text, c + inv, anchor));
    cursor += lh;
  }
  return out.join("");
}

// Label on an opaque mask, either beside a vertical segment or above a horizontal one.
function label(x, y, text, anchor = "start") {
  const w = textWidth(text, 13.5) + 12;
  const left = anchor === "middle" ? x - w / 2 : x;
  return `${rect(left.toFixed(1), y - 15, w.toFixed(1), 21, "mask", 4)}${t(anchor === "middle" ? x : x + 6, y, text, "lab", anchor)}`;
}
const down = (x, y1, y2, text, cls = "flow") => p(`M${x} ${y1} V${y2}`, cls) + (text ? label(x + 8, (y1 + y2) / 2 + 5, text) : "");
const right = (x1, x2, y, text, cls = "flow") => p(`M${x1} ${y} H${x2}`, cls) + (text ? label((x1 + x2) / 2, y - 9, text, "middle") : "");

function legend(y, items) {
  let x = 24;
  return items.map(([cls, text]) => {
    const swatch = cls === "arrow" ? p(`M${x} ${y + 8} H${x + 26}`, "flow") : cls === "dasharrow" ? p(`M${x} ${y + 8} H${x + 26}`, "dash") : rect(x, y, 22, 16, cls, 3);
    const sw = cls.includes("arrow") ? 34 : 30;
    const out = `${swatch}${t(x + sw, y + 13, text, "small")}`;
    x += sw + textWidth(text, 13.5) + 22;
    return out;
  }).join("");
}

function frame(name, { tag, title, desc, sub, height }, body) {
  slug = `cpg-${name}`;
  const head = [t(24, 40, tag, "tag"), t(24, 74, title, "title"), ...sub.map((line, i) => t(24, 104 + i * 20, line, "subtitle"))].join("");
  const ruleY = 104 + sub.length * 20 + 6;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${height}" role="img" aria-labelledby="${slug}-title ${slug}-desc">
  <title id="${slug}-title">${esc(title)}</title>
  <desc id="${slug}-desc">${esc(desc)}</desc>
  <defs><marker id="${slug}-a" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto-start-reverse"><path d="M0,0 L10,4 L0,8 Z" fill="#1d1d1a"/></marker><marker id="${slug}-m" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto-start-reverse"><path d="M0,0 L10,4 L0,8 Z" fill="#65645e"/></marker></defs>
  <style>.bg{fill:#f7f6f2}.rule{stroke:#b9b6ac;stroke-width:1;fill:none}.node{fill:#f7f6f2;stroke:#b9b6ac;stroke-width:1.5}.zone{fill:#f0eee8;stroke:#b9b6ac;stroke-width:1.5}.deep{fill:#e4e1d8;stroke:#b9b6ac;stroke-width:1.5}.focal{fill:#1d1d1a;stroke:#1d1d1a;stroke-width:1.5}.outside{fill:#f7f6f2;stroke:#65645e;stroke-width:1.5;stroke-dasharray:6 4}.flow{stroke:#1d1d1a;stroke-width:2;fill:none;marker-end:url(#${slug}-a)}.dash{stroke:#65645e;stroke-width:1.8;fill:none;stroke-dasharray:7 5;marker-end:url(#${slug}-m)}.line{stroke:#1d1d1a;stroke-width:2;fill:none}.soft{stroke:#929087;stroke-width:1.4;fill:none}.boundary{stroke:#65645e;stroke-width:1.5;fill:none;stroke-dasharray:8 6}.mask{fill:#f7f6f2;stroke:none}.tag{font:600 13.5px ${sans};fill:#65645e;letter-spacing:.02em}.title{font:700 23px ${sans};fill:#1d1d1a}.subtitle{font:400 14.5px ${sans};fill:#65645e}.name{font:700 17px ${sans};fill:#1d1d1a}.body{font:400 15px ${sans};fill:#1d1d1a}.code{font:500 14px ${mono};fill:#1d1d1a}.small{font:600 13.5px ${sans};fill:#65645e}.lab{font:700 13.5px ${sans};fill:#1d1d1a}.inv{fill:#f7f6f2}.big{font:800 22px ${sans};fill:#1d1d1a}</style>
  <rect class="bg" width="${W}" height="${height}"/>
  ${head}<line class="rule" x1="24" y1="${ruleY}" x2="536" y2="${ruleY}"/>
  ${body.join("\n  ")}
</svg>
`;
  return [slug, svg];
}

const figures = [];
const add = (...args) => figures.push(frame(...args));

// 00 · course map
{
  const parts = [
    ["1부 · 서비스 이해", [["1편", "서비스 전체 그림과 요청 흐름"]]],
    ["2부 · 개발 기초", [["2편", "Git 협업과 화면 기술"], ["3편", "데이터베이스와 로그인"], ["4편", "권한과 민감 정보"], ["5편", "실시간 공동편집과 운영"]]],
    ["3부 · 기능 적용", [["6편", "조직·업무·행사"], ["7편", "회의록·건의·기수 전환"]]],
    ["4부 · 완성 경로", [["8편", "실습 경로·협업·배포 점검"], ["9편", "용어 사전과 공식 자료"]]],
  ];
  const body = [];
  let y = 168;
  parts.forEach(([name, rows], pi) => {
    const h = 40 + rows.length * 52;
    body.push(rect(24, y, 512, h, "zone"), t(40, y + 26, name, "small"));
    rows.forEach(([no, title], i) => {
      const ry = y + 38 + i * 52;
      const cls = pi === 0 ? "focal" : "node";
      const inv = pi === 0 ? " inv" : "";
      body.push(rect(40, ry, 480, 42, cls), t(58, ry + 27, no, "name" + inv), t(112, ry + 27, title, "body" + inv));
    });
    y += h;
    if (pi < parts.length - 1) { body.push(down(280, y, y + 32)); y += 32; }
  });
  body.push(legend(y + 28, [["focal", "여기서 시작"], ["zone", "부(part) 묶음"], ["node", "강의 한 편"]]));
  add("00-course-map", { tag: "0편 · 길잡이", title: "학습 가이드 전체 지도", desc: "서비스 이해, 개발 기초, 기능 적용, 완성 경로의 네 부분과 각 부분에 속한 1편부터 9편까지의 강의를 위에서 아래로 놓은 지도.", sub: ["무엇을 만들지 → 무엇을 알아야 하는지 → 기능에 어떻게", "붙이는지 → 어떤 순서로 완성하는지"], height: y + 64 }, body);
}

// 01a · user scope
add("01a-user-scope", { tag: "1편 · 누구를 위한 서비스인가", title: "로그인 ≠ 학생회 권한", desc: "학교 외 계정은 Auth Hook에서 거부되고, 학교 계정으로 로그인한 사용자는 일반 학생이며, 그 안에서 현재 Term 활성 Membership이 있는 사람만 MEMBER, DIRECTOR, EXECUTIVE Role로 내부 자료를 쓴다는 포함 관계 그림.", sub: ["사용자는 바깥에서 안으로 갈수록 더 많은 자료를 본다.", "안쪽으로 들어가는 조건은 로그인이 아니라 승인 명단이다."], height: 800 }, [
  node(24, 166, 512, 64, "outside", [["학교 외 Google 계정", "name"], ["Auth Hook에서 생성 자체를 거부", "body"]]),
  rect(24, 254, 512, 474, "zone"), t(40, 282, "학교 Google 계정으로 로그인한 사용자", "name"), t(40, 306, "일반 학생 · 건의 작성, 본인 건의의 상태와 공개 답변 확인", "body"),
  rect(40, 326, 480, 386, "deep"), t(56, 354, "승인 명단 + 현재 Term 활성 Membership", "name"), t(56, 378, "학생회 구성원 · 권한은 Role로 계산한다", "body"),
  node(56, 396, 448, 84, "node", [["MEMBER · 국원", "name"], ["담당 업무 처리, 허용된 행사 자료,", "body"], ["지정된 회의록 편집", "body"]]),
  node(56, 496, 448, 84, "node", [["DIRECTOR · 국장", "name"], ["자기 국 구성원·업무·행사 관리,", "body"], ["회의록 생성 (다른 국·승격은 불가)", "body"]]),
  node(56, 596, 448, 100, "focal", [["EXECUTIVE · 회장단", "name"], ["조직 설정, 전체 운영 권한,", "body"], ["건의 작성자 신원 확인", "body"], ["(목적과 기록을 남겨서)", "small"]]),
  t(280, 760, "회장·홍보국장 같은 Position은 화면 표시용 — 권한 계산에 쓰지 않는다", "small", "middle"),
]);

// 01b · request flow
add("01b-request-flow", { tag: "1편 · 웹 서비스의 세 부분", title: "업무 하나가 저장되는 길", desc: "국장이 업무를 입력하면 브라우저가 형식을 확인하고, 서버와 DB가 로그인·Term·권한을 확인한 뒤 tasks 테이블에 저장하고, 화면이 결과를 다시 읽어 보여 주며, 형식 오류와 권한 거부는 각각 다른 안내로 끝나는 흐름.", sub: ["실패는 어디서 막혔는지에 따라 안내가 달라진다.", "문제를 찾을 때도 이 순서대로 확인한다."], height: 820 }, [
  down(172, 232, 288, "저장 요청"), down(172, 352, 400, "검사"), down(172, 488, 536, "통과"), down(172, 600, 648, "다시 읽기"),
  right(320, 380, 320, "실패"), right(320, 380, 444, "거부"),
  node(24, 168, 296, 64, "outside", [["국장 · 업무 등록 화면", "name"], ["제목·담당자·마감일 입력", "body"]]),
  node(24, 288, 296, 64, "node", [["브라우저 (프론트엔드)", "name"], ["형식 확인 · 저장 중 표시", "body"]]),
  node(24, 400, 296, 88, "focal", [["서버 · DB 확인", "name"], ["로그인 · 현재 Term · 생성 권한", "body"], ["담당자를 지정할 수 있나?", "body"]]),
  node(24, 536, 296, 64, "deep", [["tasks 테이블에 새 행", "name"], ["DB 저장 성공", "body"]]),
  node(24, 648, 296, 64, "node", [["화면 결과", "name"], ["상세 화면에서 새 기록 확인", "body"]]),
  node(380, 288, 156, 64, "outside", [["입력창 아래 안내", "lab"], ["제목 누락·날짜 오류", "small"]]),
  node(380, 412, 156, 64, "outside", [["거부 이유 안내", "lab"], ["권한 없음·다른 Term", "small"]]),
  t(280, 750, "화면에 보임 ≠ DB에 저장됨", "name", "middle"),
  legend(776, [["focal", "실제 보안 검사"], ["deep", "저장소"], ["outside", "사용자·실패 안내"]]),
]);

// 02a · git flow
add("02a-git-flow", { tag: "2편 · Git과 GitHub", title: "변경 하나가 main에 들어가는 길", desc: "Issue 작성, Branch 생성, Commit, Pull Request, 리뷰, Merge의 여섯 단계를 위에서 아래로 놓고, 리뷰에서 수정 요청이 나오면 Commit 단계로 되돌아가는 고리를 표시한 그림.", sub: ["누가, 무엇을, 왜 바꿨는지가 단계마다 기록으로 남는다."], height: 760 }, [
  down(200, 208, 240), down(200, 296, 328), down(200, 384, 416), down(200, 488, 520), down(200, 576, 608, "승인"),
  p("M376 548 H448 Q456 548 456 540 V364 Q456 356 448 356 H376"), label(464, 458, "수정 요청"),
  node(24, 152, 352, 56, "node", [["Issue", "name"], ["목적과 완료 기준을 먼저 적는다", "body"]]),
  node(24, 240, 352, 56, "node", [["Branch", "name"], ["main과 분리된 작업 줄기", "body"]]),
  node(24, 328, 352, 56, "node", [["Commit", "name"], ["의미 있는 변경 한 번 + 이유", "body"]]),
  node(24, 416, 352, 72, "focal", [["Pull Request", "name"], ["실행 방법 · 화면 결과", "body"], ["허용·거부 테스트 결과", "body"]]),
  node(24, 520, 352, 56, "node", [["리뷰", "name"], ["다른 팀원이 읽고 Preview에서 실행", "body"]]),
  node(24, 608, 352, 56, "deep", [["Merge", "name"], ["main은 항상 실행 가능한 상태", "body"]]),
  t(280, 700, "DB 마이그레이션·RLS 정책은 작성자 외 한 명이 꼭 검토", "small", "middle"),
  legend(724, [["focal", "검토의 중심"], ["deep", "공유되는 결과"], ["arrow", "다음 단계"]]),
]);

// 02b · server / client boundary
add("02b-server-client", { tag: "2편 · React와 Next.js", title: "브라우저와 서버의 경계", desc: "위쪽 브라우저 영역의 Client Component와 아래쪽 서버 영역의 Server Component, Server Action, 그리고 RLS가 걸린 Supabase DB를 놓고, 브라우저로 넘어간 값은 사용자에게 보이므로 비밀 키는 서버에만 둔다는 점을 경계선으로 표시한 그림.", sub: ["경계 위로 올라간 값은 사용자가 볼 수 있다.", "브라우저의 검사는 편의, 서버·DB의 검사는 보안이다."], height: 800 }, [
  rect(24, 166, 512, 144, "zone"), t(40, 192, "브라우저 · 사용자 컴퓨터", "small"),
  p("M24 338 H536", "boundary"), t(280, 330, "네트워크 경계", "small", "middle"),
  rect(24, 362, 512, 236, "zone"), t(40, 388, "서버 · Next.js (Vercel)", "small"),
  p("M152 404 V292"), label(160, 352, "HTML·데이터"),
  p("M408 292 V404"), label(416, 352, "폼 제출"),
  p("M152 492 V612"), p("M408 492 V612"),
  node(40, 204, 480, 88, "node", [["Client Component", "name"], ["버튼·입력·편집기처럼 즉시 반응하는 화면", "body"], ["공개해도 되는 값만 둔다", "small"]]),
  node(40, 404, 224, 88, "node", [["Server Component", "name"], ["서버에서 데이터를", "body"], ["준비해 화면 전달", "body"]]),
  node(296, 404, 224, 88, "focal", [["Server Action", "name"], ["폼 제출 처리", "body"], ["값을 다시 검증", "body"]]),
  label(280, 556, "비밀 키 · Service Role Key · OAuth secret은 여기에만", "middle"),
  node(24, 612, 512, 72, "deep", [["Supabase DB", "name"], ["RLS가 행마다 한 번 더 검사", "body"]]),
  t(280, 724, "TypeScript가 오류를 잡아도 사용자가 보낸 값은 서버에서 다시 검증", "small", "middle"),
  legend(756, [["focal", "서버 검증 지점"], ["zone", "실행 위치"], ["deep", "저장소"]]),
]);

// 03a · ERD
{
  const rows = [
    ["departments · positions", "Term마다 새로 만드는 부서와 표시 직책"],
    ["approved_council_accounts → memberships", "승인 행이 첫 로그인 때 Membership이 된다"],
    ["events", "event_access_rules · event_resources"],
    ["tasks (event_id 선택)", "task_access_rules"],
    ["meeting_minutes (event_id 선택)", "access_rules · editors · crdt_updates · snapshots"],
    ["schedules · handovers (event_id 선택)", "일정과 인수인계"],
    ["suggestions", "suggestion_authors · suggestion_messages"],
    ["term_archive_access", "과거 Term을 읽게 해 주는 Grant"],
  ];
  const body = [rect(24, 152, 512, 112, "zone"), t(40, 176, "전역 (Term에 속하지 않음)", "small"),
    node(40, 188, 232, 60, "node", [["profiles", "code"], ["= auth.users.id", "small"]]),
    node(288, 188, 232, 60, "node", [["dashboard_links", "code"], ["activity_logs", "code"]])];
  const top = 300;
  body.push(p(`M60 ${top + 56} V${top + 76 + (rows.length - 1) * 68 + 28}`, "line"));
  rows.forEach(([name, sub], i) => {
    const y = top + 76 + i * 68;
    body.push(p(`M60 ${y + 28} H92`, "flow"), node(92, y, 444, 56, i === 6 ? "deep" : "node", [[name, "code"], [sub, "small"]], "start"));
  });
  body.push(node(24, top, 512, 56, "focal", [["terms · 학생회 기수", "name"], ["DRAFT · ACTIVE · CLOSED — ACTIVE는 하나", "small"]]));
  const end = top + 76 + rows.length * 68;
  body.push(t(280, end + 20, "업무·회의록·일정은 Term에 직접 속하고 Event 연결은 선택", "small", "middle"), t(280, end + 42, "event_id가 있으면 Event와 같은 Term이어야 한다", "small", "middle"));
  body.push(legend(end + 70, [["focal", "모든 기록의 기준"], ["deep", "신원을 분리한 테이블"], ["node", "테이블 묶음"]]));
  add("03a-erd", { tag: "3편 · 데이터베이스", title: "핵심 테이블의 관계", desc: "전역 테이블인 profiles, dashboard_links, activity_logs 아래에 terms를 두고, terms에 속하는 부서·직책, 승인 명단과 Membership, events, tasks, meeting_minutes, schedules와 handovers, suggestions, term_archive_access를 가지처럼 연결한 데이터 모델 그림.", sub: ["거의 모든 내부 기록은 어느 기수(Term)의 것인지 안다.", "이름 대신 ID로 다른 기록을 가리킨다."], height: end + 108 }, body);
}

// 03b · login flow
add("03b-login-flow", { tag: "3편 · 로그인", title: "로그인 결과는 세 갈래", desc: "학교 Google 계정을 고르면 Auth Hook이 이메일 검증과 학교 계정 여부를 확인해 아니면 생성을 거부하고, 통과하면 Profile 경로가 다시 검사한 뒤 같은 Term 승인 행이 있으면 Membership을 원자적으로 만들고, 없으면 일반 학생으로 남는 흐름.", sub: ["학교 계정 확인과 학생회 승인은 서로 다른 검사다."], height: 800 }, [
  down(172, 208, 240), down(172, 328, 368, "통과"), down(172, 432, 464), down(172, 552, 600, "있음"),
  right(320, 380, 284, "아니오"), right(320, 380, 508, "없음"),
  node(24, 152, 296, 56, "outside", [["학교 Google 계정 선택", "name"], ["hd 값은 고르기 쉽게 돕는 힌트", "small"]]),
  node(24, 240, 296, 88, "deep", [["Auth Hook", "name"], ["Before User Created", "code"], ["이메일 검증 · 학교 계정인가?", "body"]]),
  node(24, 368, 296, 64, "node", [["Profile 생성·활성화", "name"], ["같은 조건을 한 번 더 검사", "body"]]),
  node(24, 464, 296, 88, "deep", [["승인 명단 조회", "name"], ["approved_council_accounts", "code"], ["같은 Term 승인 행이 있나?", "body"]]),
  node(24, 600, 296, 72, "focal", [["Membership 생성", "name"], ["Role·부서·직책을 한 번에", "body"]]),
  node(380, 244, 156, 80, "outside", [["생성 거부", "lab"], ["auth.users·profiles", "small"], ["행이 생기지 않음", "small"]]),
  node(380, 468, 156, 80, "zone", [["일반 학생", "lab"], ["STUDENT 상태", "small"], ["건의만 가능", "small"]]),
  t(280, 712, "첫 EXECUTIVE는 화면이 아닌 검증된 운영 절차로 등록", "small", "middle"),
  legend(748, [["deep", "검사 지점"], ["focal", "내부 권한 시작"], ["outside", "입력·거부"]]),
]);

// 04a · permission layers
add("04a-permission-layers", { tag: "4편 · 권한", title: "권한은 네 단계로 판정한다", desc: "현재 사용자의 활성 Membership, Role이 주는 기본 Permission, 대상 자료의 소유 국·담당자·공개 모드·ACL, 그리고 서버·DB·Storage·Realtime에서의 실제 강제까지 네 단계를 차례로 통과해야 허용된다는 그림.", sub: ["한 단계라도 통과하지 못하면 거부된다.", "어느 한 단계만으로는 전체 권한을 설명할 수 없다."], height: 760 }, [
  down(280, 248, 280), down(280, 376, 408), down(280, 504, 536),
  node(24, 152, 512, 96, "node", [["① 현재 사용자", "name"], ["어느 Term의 활성 Membership을 가진 누구인가?", "body"], ["종료된 Membership은 어떤 권한도 없다", "small"]]),
  node(24, 280, 512, 96, "node", [["② 기본 능력 · RBAC", "name"], ["Role이 어떤 Permission을 가지는가?", "body"], ["event.create · task.access.manage", "code"]]),
  node(24, 408, 512, 96, "node", [["③ 대상 자료 · ACL", "name"], ["소유 국 · 생성자 · 담당자 · 공개 모드 · ACL", "body"], ["\"이 특정 업무를 누가 볼 수 있나?\"", "small"]]),
  node(24, 536, 512, 96, "focal", [["④ 실제 강제", "name"], ["서버 RPC · RLS · Storage · Realtime", "body"], ["모두 같은 결과를 내야 한다", "small"]]),
  t(280, 676, "버튼 숨김은 편의, ④가 보안이다", "name", "middle"),
  legend(716, [["focal", "실제로 막는 곳"], ["node", "판정 입력"], ["arrow", "통과하면 다음 단계"]]),
]);

// 04b · event scope intersection
add("04b-event-scope", { tag: "4편 · 공개 모드와 상속", title: "하위 자료는 교집합만 본다", desc: "Event 열람자 원과 Task ACL 대상 원이 겹치는 부분만 Task를 실제로 볼 수 있으며, Task ACL에만 있고 Event를 볼 수 없는 사람은 Task도 볼 수 없다는 교집합 그림.", sub: ["유효 열람자 = Event 열람자 ∩ Task·Meeting 열람자"], height: 716 }, [
  `<defs><clipPath id="${"cpg-04b-event-scope"}-clip"><circle cx="208" cy="330" r="148"/></clipPath></defs>`,
  `<circle class="zone" cx="208" cy="330" r="148"/><circle class="zone" cx="352" cy="330" r="148" style="fill-opacity:.55"/>`,
  `<circle class="deep" cx="352" cy="330" r="148" clip-path="url(#cpg-04b-event-scope-clip)"/>`,
  `<circle cx="208" cy="330" r="148" class="soft"/><circle cx="352" cy="330" r="148" class="soft"/>`,
  t(132, 300, "Event", "name", "middle"), t(132, 322, "열람자", "name", "middle"), t(132, 348, "재무국 등", "small", "middle"),
  t(428, 300, "Task ACL", "name", "middle"), t(428, 322, "대상", "name", "middle"), t(428, 348, "홍보국원 B", "small", "middle"),
  t(280, 312, "Task를", "lab", "middle"), t(280, 332, "실제로", "lab", "middle"), t(280, 352, "보는 사람", "lab", "middle"),
  node(24, 500, 512, 96, "outside", [["B는 Task ACL에만 있다 → Task도 못 본다", "name"], ["그래서 v0.7은 처음부터 Event 열람자 중에서만", "body"], ["담당자·편집자·ACL 대상을 고르게 한다", "body"]]),
  t(280, 632, "Resource · Schedule · Handover는 Event 범위를 그대로 따르고", "small", "middle"),
  t(280, 654, "Task · Meeting은 그 안에서 더 좁힐 수만 있다", "small", "middle"),
  legend(680, [["deep", "유효 열람자"], ["zone", "각 규칙의 대상"], ["outside", "막아야 할 지정"]]),
]);

// 04c · where data goes
add("04c-data-placement", { tag: "4편 · 파일·개인정보", title: "무엇을 어디에 저장하나", desc: "행사 PDF를 올리면 제목과 경로 같은 메타데이터는 DB의 event_resources에, 파일 본체는 비공개 Storage Bucket에 저장되고, 익명 건의를 내면 내용과 상태는 suggestions에, 작성자 연결은 suggestion_authors에 따로 저장되며, 두 경우 모두 Activity Log에는 민감값 없이 변경 사실만 남는다는 그림.", sub: ["한 번의 행동이 여러 저장소로 나뉘어 들어간다.", "나누는 이유는 보여 줄 사람이 다르기 때문이다."], height: 760 }, [
  right(164, 216, 196), right(164, 216, 284), right(164, 216, 412), right(164, 216, 500),
  node(24, 160, 140, 160, "outside", [["행사 PDF", "name"], ["업로드", "name"]]),
  node(216, 160, 320, 72, "node", [["DB · event_resources", "name"], ["제목 · 행사 ID · 저장 경로", "body"]]),
  node(216, 248, 320, 72, "node", [["Storage · 비공개 Bucket", "name"], ["파일 본체 · Signed URL로 잠깐 연다", "body"]]),
  node(24, 376, 140, 160, "outside", [["익명 건의", "name"], ["제출", "name"]]),
  node(216, 376, 320, 72, "node", [["suggestions", "code"], ["내용 · 상태 · 담당자 → 처리자도 본다", "body"]]),
  node(216, 464, 320, 72, "focal", [["suggestion_authors", "code"], ["작성자 연결 → 본인 · 회장단만", "body"]]),
  node(24, 576, 512, 92, "deep", [["두 경우 모두 · activity_logs (append-only)", "name"], ["누가 · 언제 · 무엇을 바꿨는지", "body"], ["본문 · 작성자 ID · Token · Signed URL은 넣지 않는다", "small"]]),
  legend(708, [["focal", "가장 좁게 공개"], ["deep", "변경 기록"], ["outside", "사용자 행동"]]),
]);

// 05a · CRDT save sequence
{
  const xs = [88, 216, 344, 472];
  const heads = [["편집자 A", "브라우저"], ["save_meeting", "DB 함수"], ["Realtime", "Private 채널"], ["편집자 B", "브라우저"]];
  const body = [];
  xs.forEach(x => body.push(p(`M${x} 212 V748`, "soft")));
  heads.forEach(([a, b], i) => body.push(node(xs[i] - 58, 156, 116, 56, i === 1 ? "deep" : "node", [[a, "lab"], [b, "small"]])));
  body.push(
    node(30, 236, 116, 64, "node", [["입력 → Yjs", "small"], ["Update 묶기", "small"]]),
    right(88, 216, 340, "RPC + JWT"),
    node(150, 364, 132, 108, "focal", [["편집 권한·", "small"], ["회의록 상태", "small"], ["검사 → 순번", "small"], ["발급·저장", "small"]]),
    right(282, 344, 500, "발행"),
    p("M216 552 H88", "dash"), label(152, 543, "Ack · 순번", "middle"),
    right(344, 472, 600, "Broadcast"),
    node(414, 624, 116, 64, "node", [["Y.apply", "small"], ["Update()", "small"]]),
    t(280, 790, "Realtime으로 보였다 ≠ 저장됐다 · Ack 전엔 \"저장 완료\" 표시 X", "small", "middle"),
    legend(816, [["focal", "저장 판정"], ["arrow", "요청·전달"], ["dasharrow", "응답(Ack)"]]),
  );
  add("05a-crdt-save", { tag: "5편 · 실시간 공동편집", title: "회의록 변경이 저장되는 순서", desc: "편집자 A의 브라우저가 Yjs Update를 묶어 save_meeting_update RPC를 호출하면, DB 함수가 편집 권한과 회의록 상태를 검사해 순번을 발급하고 저장한 뒤 같은 트랜잭션에서 Realtime으로 발행하고 A에게 Ack를 돌려주며, Realtime이 편집자 B에게 Broadcast해 B가 Update를 적용하는 순서도.", sub: ["저장이 먼저, 전파는 그다음이다.", "키 입력마다 Vercel 함수를 거치지 않는다."], height: 852 }, body);
}

// 05b · recovery
{
  const seq = (x, y, label2, cls = "node") => node(x, y, 64, 44, cls, [[label2, "lab"]]);
  add("05b-recovery", { tag: "5편 · 실시간 공동편집", title: "순번과 Snapshot으로 복구하기", desc: "재접속하면 최신 Snapshot과 그 뒤 Update로 문서를 복원하고, 받은 순번이 5 다음 7이면 6이 빠졌음을 알아차려 DB에서 다시 읽으며, 같은 client_update_id로 재시도해도 한 번만 저장된다는 세 가지 복구 장면.", sub: ["Broadcast는 놓칠 수 있다. DB에 남은 순번이 기준이다."], height: 760 }, [
    rect(24, 148, 512, 164, "zone"), t(40, 174, "① 재접속 · 새로 열기", "name"),
    node(40, 192, 160, 44, "deep", [["Snapshot ≤ #4", "lab"]]), t(214, 220, "+", "big"),
    seq(240, 192, "#5"), seq(312, 192, "#6"), seq(384, 192, "#7"), right(452, 484, 214), t(510, 220, "문서", "lab", "middle"),
    t(40, 278, "Snapshot이 포함한 마지막 순번(last_sequence_no) 뒤만 읽는다", "small"),
    t(40, 298, "오래된 Update 정리도 이 순번 이하만 대상", "small"),
    rect(24, 332, 512, 176, "zone"), t(40, 358, "② Broadcast 유실 · 순번 공백 감지", "name"),
    seq(40, 376, "#5"), seq(112, 376, "#6", "outside"), seq(184, 376, "#7"),
    node(272, 376, 248, 44, "focal", [["5 다음 7 → 6이 빠짐", "lab"]]),
    down(144, 420, 452), node(112, 452, 408, 40, "node", [["DB에서 #6을 다시 읽고 순서대로 적용", "body"]]),
    rect(24, 528, 512, 156, "zone"), t(40, 554, "③ 저장 실패 후 재시도 · 멱등성", "name"),
    node(40, 572, 152, 44, "node", [["update id = u-17", "small"]]), node(40, 624, 152, 44, "node", [["update id = u-17", "small"]]),
    p("M192 594 H292 Q300 594 300 602 V616"), p("M192 646 H264", "flow"),
    node(264, 616, 256, 60, "deep", [["DB에는 한 번만 기록", "lab"], ["기존 순번을 돌려준다", "small"]]),
    legend(712, [["focal", "이상 감지"], ["deep", "기준이 되는 저장"], ["outside", "받지 못한 Update"]]),
  ]);
}

// 06a · task lifecycle
add("06a-task-lifecycle", { tag: "6편 · Task Tracker", title: "업무의 상태와 되돌리기", desc: "TODO, IN_PROGRESS, REVIEW, DONE의 네 상태를 위에서 아래로 놓고, DONE은 잠금이 아니어서 권한자가 IN_PROGRESS로 재개할 수 있으며, 잘못 만든 업무는 어느 상태에서든 물리 삭제 대신 보관하고 복원한다는 상태 그림.", sub: ["DONE은 영구 잠금이 아니다.", "지우는 대신 보관하고, 변경은 Activity Log에 남는다."], height: 700 }, [
  down(150, 216, 252), down(150, 308, 344), down(150, 400, 436),
  p("M276 464 H340 Q348 464 348 456 V288 Q348 280 340 280 H276"), label(356, 380, "재개"),
  node(24, 160, 252, 56, "node", [["TODO", "code"], ["할 일", "small"]]),
  node(24, 252, 252, 56, "node", [["IN_PROGRESS", "code"], ["진행 중", "small"]]),
  node(24, 344, 252, 56, "node", [["REVIEW", "code"], ["검토 중", "small"]]),
  node(24, 436, 252, 56, "focal", [["DONE", "code"], ["완료 · 권한자는 수정·재개", "small"]]),
  node(24, 520, 512, 64, "outside", [["어느 상태에서든 → 보관 (archived_at) ⇄ 복원", "name"], ["물리 삭제 대신 Soft Delete", "small"]]),
  node(408, 160, 128, 104, "zone", [["MEMBER", "lab"], ["본인 담당의", "small"], ["상태·설명·첨부", "small"]]),
  node(408, 280, 128, 104, "zone", [["DIRECTOR", "lab"], ["관리 Task의", "small"], ["제목·담당자·마감", "small"]]),
  node(408, 400, 128, 92, "zone", [["공개 모드·ACL", "lab"], ["별도 권한", "small"]]),
  t(280, 624, "볼 수 있다고 모든 필드를 고칠 수 있는 것은 아니다", "small", "middle"),
  legend(660, [["focal", "다시 열 수 있는 끝"], ["zone", "누가 무엇을 고치나"], ["outside", "보관"]]),
]);

// 06b · event hub
add("06b-event-hub", { tag: "6편 · Event", title: "행사는 하위 자료의 상한이다", desc: "Event 아래에 Event 범위를 그대로 따르는 Resource, Schedule, Handover 묶음과, 그 범위 안에서 더 좁힐 수 있는 Task와 Meeting 묶음을 두고, 범위를 좁힐 때는 충돌 목록을 해결해야 저장된다는 그림.", sub: ["Event를 못 보는 사람은 그 아래 어떤 자료도 못 본다."], height: 672 }, [
  rect(24, 152, 512, 384, "zone"),
  node(24, 152, 512, 80, "focal", [["Event 범위 · 행사 개요", "name"], ["ALL_COUNCIL 또는 RESTRICTED", "code"]]),
  rect(40, 248, 480, 128, "node"), t(56, 272, "그대로 상속 · 같은 범위", "small"),
  node(56, 284, 140, 76, "zone", [["Resource", "lab"], ["업로드·링크", "small"]]),
  node(208, 284, 140, 76, "zone", [["Schedule", "lab"], ["행사 일정", "small"]]),
  node(360, 284, 144, 76, "zone", [["Handover", "lab"], ["인수인계", "small"]]),
  rect(40, 392, 480, 128, "node"), t(56, 416, "이 범위 안에서 더 좁힐 수 있음", "small"),
  node(56, 428, 218, 76, "deep", [["Task", "lab"], ["DEFAULT · RESTRICTED", "small"]]),
  node(286, 428, 218, 76, "deep", [["Meeting", "lab"], ["Preset · 편집자 지정", "small"]]),
  t(280, 572, "범위를 좁히면 충돌 목록을 보여 주고", "small", "middle"),
  t(280, 594, "ACL에 남기기 · 담당자 바꾸기 · 지정 제거 중 골라야 저장된다", "small", "middle"),
  legend(630, [["focal", "상한이 되는 범위"], ["zone", "그대로 상속"], ["deep", "추가로 좁힘"]]),
]);

// 07a · meeting states
add("07a-meeting-states", { tag: "7편 · 회의록", title: "회의록 상태와 편집 가능 여부", desc: "DRAFT에서는 지정 편집자와 회장단이 편집하고, 생성자나 회장단이 CONFIRMED로 확정하면 편집자도 저장할 수 없으며, ARCHIVED는 목록에서 숨는 읽기 전용이고, CONFIRMED를 DRAFT로 되돌리는 것은 회장단만 사유를 남겨 할 수 있다는 상태 그림.", sub: ["상태가 바뀌면 재구독 신호로 편집기를 읽기 전용으로 바꾼다."], height: 640 }, [
  down(150, 232, 304, "확정"), down(150, 384, 456, "보관"),
  p("M276 344 H340 Q348 344 348 336 V200 Q348 192 340 192 H276"), label(356, 274, "되돌리기"),
  node(24, 152, 252, 80, "node", [["DRAFT", "code"], ["편집자 · 회장단 편집", "small"], ["생성 시 기본값", "small"]]),
  node(24, 304, 252, 80, "focal", [["CONFIRMED", "code"], ["읽기 전용", "small"], ["편집자도 저장 불가", "small"]]),
  node(24, 456, 252, 80, "deep", [["ARCHIVED", "code"], ["읽기 전용", "small"], ["목록에서 숨김", "small"]]),
  node(408, 236, 128, 76, "outside", [["회장단만", "lab"], ["사유를", "small"], ["Activity Log에", "small"]]),
  t(280, 572, "확정은 생성자 또는 회장단 · 확정 시 최종 Snapshot을 만든다", "small", "middle"),
  legend(604, [["focal", "편집 잠금"], ["deep", "보관"], ["outside", "예외 권한"]]),
]);

// 07b · suggestion visibility matrix
{
  const cols = [["작성자", "본인"], ["처리 담당", "국원·국장"], ["회장단", "해당 Term"]];
  const rows = [["건의 내용·상태", ["O", "O", "O"]], ["공개 답변", ["O", "O", "O"]], ["내부 메모", ["X", "O", "O"]], ["작성자 신원", ["O", "X", "O"]]];
  const body = [];
  const x0 = 188, cw = 116, y0 = 160;
  cols.forEach(([a, b], i) => body.push(node(x0 + i * cw + 4, y0, cw - 8, 56, "zone", [[a, "lab"], [b, "small"]])));
  rows.forEach(([name, cells], r) => {
    const y = y0 + 72 + r * 72;
    body.push(node(24, y, 156, 60, "node", [[name, "lab"]]));
    cells.forEach((v, c) => {
      const focal = r === 3 && c === 1;
      const cls = focal ? "focal" : v === "X" ? "outside" : "node";
      body.push(node(x0 + c * cw + 4, y, cw - 8, 60, cls, [[v === "O" ? "볼 수 있음" : "못 봄", "lab"]]));
    });
  });
  const end = y0 + 72 + rows.length * 72;
  body.push(t(280, end + 20, "담당자의 목록·상세·API·네트워크 탭·로그 어디에도", "small", "middle"), t(280, end + 42, "작성자 ID와 이메일이 나오면 안 된다", "small", "middle"));
  body.push(legend(end + 72, [["focal", "가장 중요한 차단"], ["outside", "못 봄"], ["node", "볼 수 있음"]]));
  add("07b-suggestion-visibility", { tag: "7편 · Suggestion", title: "건의는 누가 무엇을 보나", desc: "건의 내용과 상태, 공개 답변, 내부 메모, 작성자 신원의 네 항목을 작성자, 처리 담당 국원과 국장, 회장단이 각각 볼 수 있는지 표시한 격자이며, 처리 담당자는 작성자 신원을 볼 수 없고 작성자는 내부 메모를 볼 수 없다.", sub: ["작성자 신원은 suggestion_authors로 분리해서 지킨다."], height: end + 108 }, body);
}

// 07c · term transition
add("07c-term-transition", { tag: "7편 · Term 전환", title: "새 기수로 넘어가는 다섯 단계", desc: "새 Term을 DRAFT로 만들고 첫 EXECUTIVE를 등록한 뒤, 새 회장단이 부서와 승인 계정을 준비하고, 한 트랜잭션에서 이전 Term을 CLOSED, 새 Term을 ACTIVE로 바꾸며 이전 Membership을 종료하고, Realtime 재구독 신호를 보낸 다음, 필요한 과거 자료만 기간이 있는 Archive Grant로 열어 주는 순서.", sub: ["새 Term은 빈 상태로 시작한다. 자동 복제는 없다."], height: 760 }, [
  down(280, 232, 256), down(280, 336, 360), down(280, 480, 504), down(280, 568, 592),
  node(24, 152, 512, 80, "node", [["① 새 Term을 DRAFT로", "name"], ["검증된 절차로 첫 EXECUTIVE 등록", "body"]]),
  node(24, 256, 512, 80, "node", [["② 새 회장단이 준비", "name"], ["부서 · 직책 · 승인 계정 · Template", "body"]]),
  node(24, 360, 512, 120, "focal", [["③ 전환 트랜잭션 (전부 아니면 전무)", "name"], ["이전 Term → CLOSED · 새 Term → ACTIVE", "body"], ["이전 Membership 종료 (left_at)", "body"], ["미처리 건의: 정한 정책대로 이월 또는 마감", "body"]]),
  node(24, 504, 512, 64, "node", [["④ 열린 Realtime 연결에 재구독 신호", "name"]]),
  node(24, 592, 512, 80, "deep", [["⑤ 필요하면 Archive Grant", "name"], ["TERM · EVENT · DEPARTMENT · HANDOVER + 만료 · 회수", "small"]]),
  legend(708, [["focal", "한 번에 처리"], ["deep", "과거 자료 읽기"], ["node", "준비·후속 단계"]]),
]);

// 08 · learning path
{
  const stages = [
    ["준비", "README · 첫 Issue·PR · 흐름 그림"],
    ["화면 연습", "가짜 Task 목록 · 상태별 화면"],
    ["실제 저장", "Task 생성·조회 · 새로고침 후 유지"],
    ["계정·권한", "Allowlist · RLS · 거부 계정 확인"],
    ["행사 묶음", "Event ACL · 자료 · 일정 · 인수인계"],
    ["회의록 기본", "단일 사용자 저장 · 상태 · Template"],
    ["공동편집 PoC", "두 사람 동시 편집 · 실패 복구"],
    ["건의·기수", "신원 분리 · Term 전환 · Grant"],
    ["운영 QA", "E2E · 접근성 · 백업 복구 · 점검표"],
  ];
  const body = [p(`M52 176 V${176 + 8 * 60}`, "line")];
  stages.forEach(([name, out], i) => {
    const y = 152 + i * 60;
    const focal = i === 6;
    body.push(`<circle class="${focal ? "focal" : "node"}" cx="52" cy="${y + 24}" r="14"/>`, t(52, y + 29, String(i + 1), focal ? "lab inv" : "lab", "middle"));
    body.push(node(80, y, 456, 48, focal ? "focal" : i < 2 ? "zone" : "node", [[`${name} — ${out}`, "body"]], "start"));
  });
  const end = 152 + 9 * 60;
  body.push(t(280, end + 16, "기간 약속이 아니다 · 다음 단계 기준을 통과하면 넘어간다", "small", "middle"));
  body.push(legend(end + 44, [["zone", "가짜 데이터 연습"], ["node", "실제 기능"], ["focal", "가장 큰 기술 위험"]]));
  add("08-learning-path", { tag: "8편 · 완성 경로", title: "아홉 단계 학습 경로", desc: "준비, 화면 연습, 실제 저장, 계정과 권한, 행사 묶음, 회의록 기본, 공동편집 PoC, 건의와 기수, 운영 QA의 아홉 단계를 순서대로 놓고 각 단계에서 손에 남아야 할 결과를 적은 경로 그림이며, 공동편집 PoC를 가장 큰 기술 위험으로 강조했다.", sub: ["앞 단계의 결과물이 다음 단계의 출발점이 된다."], height: end + 80 }, body);
}

for (const [name, svg] of figures) writeFileSync(path.join(outDir, `${name}.svg`), svg);
console.log(figures.map(([name]) => name).join(" "));
