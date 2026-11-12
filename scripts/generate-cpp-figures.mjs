import { writeFileSync } from "node:fs";
import path from "node:path";
import { C, T, W, box, cells, figure, tag, wire, zone } from "./cpp-figure-kit.mjs";

// Figures for the C++ course (subject-muw81hpv), rebuilt from the 2026 lecture slides.
// Run: node scripts/generate-cpp-figures.mjs [outDir]
const outDir = process.argv[2] ?? path.join("public", "materials", "diagrams");
const figs = [];
const fig = (slug, meta, body) => figs.push([slug, figure(slug, meta, body.join(""))]);

// ---------------------------------------------------------------- 00 · course map
fig("cpp-00-course-map", {
  eyebrow: "C++ · 과목 지도", title: "절차형 기초에서 객체지향으로",
  desc: "2026 C++ 강의 순서를 중간고사 전 절차형 기초(기초 문법, 제어 구조, 함수, 배열·참조, 포인터)와 중간고사 후 객체지향(클래스, 상속·다형성, 예외, 템플릿·STL)의 두 구간으로 나누고, 각 슬라이드 덱과 사이트 강의 번호를 짝지은 지도",
  height: 520, legend: [["flow", "다음 단계"], ["focal", "구간의 핵심"], ["zone", "시험 범위"]],
}, [
  zone(32, 112, 316, 384, "중간고사 범위 · 절차형"),
  zone(372, 112, 316, 384, "기말고사 범위 · 객체지향"),
  ...[0, 1, 2, 3].map(i => wire([[190, 192 + i * 68], [190, 208 + i * 68]])),
  ...[0, 1, 2, 3].map(i => wire([[530, 192 + i * 68], [530, 208 + i * 68]])),
  wire([[324, 166 + 4 * 68], [348, 166 + 4 * 68], [348, 166], [396, 166]]),
  tag(348, 312, "중간고사"),
  ...[["01", "기초 문법", "Lecture 2"], ["02", "형 변환·제어 구조", "Lecture 3"], ["03", "함수·재귀·스코프", "Lecture 4"], ["04", "참조·배열·vector", "Lecture 5"], ["05", "오버로딩·포인터·힙", "Lecture 6"]]
    .map(([n, name, deck], i) => box(56, 140 + i * 68, 268, 52, { name: `${n}  ${name}`, sub: deck, subCode: true, kind: i === 4 ? "focal" : "node", size: 14 })),
  ...[["06", "클래스 기초", "Lecture 9"], ["07", "상속·다형성·연산자", "Lecture 10"], ["08", "예외 처리", "Lecture 11"], ["09", "템플릿·STL", "Week 13–14"], ["10", "시험 직전 정리", "족보 유형"]]
    .map(([n, name, deck], i) => box(396, 140 + i * 68, 268, 52, { name: `${n}  ${name}`, sub: deck, subCode: true, kind: i === 1 ? "focal" : n === "10" ? "deep" : "node", size: 14 })),
]);

// ---------------------------------------------------------------- 01 · build pipeline
fig("cpp-01-build-pipeline", {
  eyebrow: "01 · C++ 시작하기", title: "소스 코드가 실행 파일이 되기까지",
  desc: "편집기로 쓴 C++ 프로그램이 전처리기를 거쳐 #include와 #define이 펼쳐진 임시 파일이 되고, 컴파일러가 이를 기계어 실행 파일(.exe)로 바꾸는 과정",
  height: 344, legend: [["flow", "변환 단계"], ["focal", "사람이 쓰는 파일"]],
}, [
  box(32, 132, 152, 88, { tag: "직접 작성", name: "C++ 프로그램", sub: "main.cpp", subCode: true, kind: "focal" }),
  box(220, 132, 136, 88, { name: "전처리기", sub: ["#include 펼치기", "#define 치환"] }),
  box(392, 132, 136, 88, { name: "임시 파일", sub: ["순수 C++ 코드"], kind: "soft" }),
  box(564, 132, 124, 88, { name: "컴파일러", sub: ["기계어로 번역"] }),
  wire([[184, 176], [220, 176]]), wire([[356, 176], [392, 176]]), wire([[528, 176], [564, 176]]),
  box(564, 252, 124, 64, { name: "실행 파일", sub: ".exe", subCode: true, kind: "deep" }),
  wire([[626, 220], [626, 252]]),
  T(32, 268, "전처리는 컴파일 전에 자동으로 실행된다.", { size: 13, anchor: "start", fill: C.muted }),
  T(32, 292, "# 으로 시작하는 줄(지시문)만 처리하고, 결과를 컴파일러에 넘긴다.", { size: 13, anchor: "start", fill: C.muted }),
]);

// ---------------------------------------------------------------- 01 · precedence
fig("cpp-01-precedence", {
  eyebrow: "01·02 · 연산자", title: "우선순위 사다리 — 위가 먼저 계산된다",
  desc: "괄호, 증감, 곱셈·나눗셈·나머지, 덧셈·뺄셈, 크기 비교, 같음 비교, 논리곱, 논리합, 대입 순으로 우선순위가 낮아지며, 대입만 오른쪽에서 왼쪽으로 결합한다는 사다리 그림",
  height: 600, legend: [["focal", "결합 방향이 다른 연산자"]],
}, [
  ...[["( )", "괄호 — 가장 먼저"], ["++  --", "증감"], ["*  /  %", "곱셈·나눗셈·나머지"], ["+  -", "덧셈·뺄셈"], ["<  <=  >  >=", "크기 비교"], ["==  !=", "같음 비교"], ["&&", "논리곱 AND"], ["||", "논리합 OR"], ["=  +=  -=", "대입 — 가장 나중"]]
    .map(([op, ko], i) => {
      const y = 112 + i * 48, w = 560 - i * 24, x = (W - w) / 2;
      return box(x, y, w, 40, { name: `${op}   ${ko}`, kind: i === 8 ? "focal" : i % 2 ? "soft" : "node", size: 14 });
    }),
  T(32, 576, "같은 단계끼리는 왼쪽부터(3 / 4 / 5). 대입만 오른쪽부터: x = y = z + 15", { size: 13, anchor: "start", fill: C.muted }),
]);

// ---------------------------------------------------------------- 02 · conversion ladder
fig("cpp-02-conversion-ladder", {
  eyebrow: "02 · 형 변환", title: "섞어 쓰면 넓은 쪽으로 올라간다",
  desc: "bool·char·short가 먼저 int로 올라가고, 서로 다른 형이 섞이면 int, unsigned int, long, unsigned long, long long, unsigned long long, float, double 순서에서 더 넓은 쪽으로 자동 변환되며, 반대로 좁은 형에 넣으면 값이 잘리는 조용한 축소가 일어난다는 그림",
  height: 420, legend: [["flow", "자동 승격"], ["accent", "조용한 축소(값 손실)"]],
}, [
  wire([[176, 146], [216, 146]]), tag(196, 120, "승격"),
  ...[0, 1, 2, 3, 4].map(i => wire([[284 + i * 80, 146], [296 + i * 80, 146]])),
  box(32, 120, 144, 52, { name: "bool·char·short", size: 13, kind: "soft" }),
  ...["int", "unsigned", "long", "long long", "float", "double"].map((t, i) => box(216 + i * 80, 120, 68, 52, { name: t, code: true, size: t.length > 6 ? 11 : 13, kind: i === 5 ? "focal" : "node" })),
  T(32, 216, "3 + 4.5  →  3이 double로 올라가 7.5 (double)", { size: 14, anchor: "start", code: true }),
  T(32, 244, "7 / 2    →  둘 다 int라 3 (소수점 버림)", { size: 14, anchor: "start", code: true }),
  T(32, 272, "7 / 2.0  →  7이 double로 올라가 3.5", { size: 14, anchor: "start", code: true }),
  box(32, 300, 300, 96, { tag: "축소 · narrowing", name: "double 3.14 → int", sub: ["3 (소수점 사라짐)", "컴파일러가 보통 경고하지 않음"], kind: "accent" }),
  box(388, 300, 300, 96, { tag: "명시적 캐스트", name: "(double)7 / 2", code: true, sub: ["= 3.5", "변환을 내가 정한다"] }),
  wire([[332, 348], [388, 348]], { color: C.accent }),
]);

// ---------------------------------------------------------------- 02 · loops
fig("cpp-02-loops", {
  eyebrow: "02 · 반복 구조", title: "조건을 언제 검사하느냐가 다르다",
  desc: "while은 본문 전에 조건을 검사해 0번 실행될 수 있고, do-while은 본문 뒤에 검사해 최소 한 번 실행되며, for는 초기화 후 조건 검사, 본문, 갱신을 반복한다는 세 흐름도",
  height: 476, legend: [["flow", "실행 흐름"], ["dash", "조건이 거짓일 때"]],
}, (() => {
  const out = [];
  const col = (x, title, steps) => {
    out.push(T(x + 100, 128, title, { size: 15, weight: 700, code: true }));
    steps.forEach(([name, kind], i) => out.push(box(x, 144 + i * 76, 200, 48, { name, kind, size: 13 })));
    for (let i = 0; i < steps.length - 1; i++) out.push(wire([[x + 100, 192 + i * 76], [x + 100, 220 + i * 76]]));
  };
  out.push(wire([[232, 168], [244, 168], [244, 432], [148, 432]], { dashed: true }), T(132, 448, "0번 실행 가능", { size: 12, fill: C.muted }));
  out.push(wire([[460, 244], [472, 244], [472, 432], [376, 432]], { dashed: true }), T(360, 448, "최소 1번 실행", { size: 12, fill: C.muted }));
  out.push(wire([[688, 244], [700, 244], [700, 452], [604, 452]], { dashed: true }), T(588, 468, "종료", { size: 12, fill: C.muted }));
  col(32, "while", [["조건 검사", "focal"], ["본문 실행", "node"], ["조건 검사로", "soft"]]);
  col(260, "do-while", [["본문 실행", "node"], ["조건 검사", "focal"], ["본문 실행으로", "soft"]]);
  col(488, "for", [["초기화 (1번)", "soft"], ["조건 검사", "focal"], ["본문 실행", "node"], ["갱신 후 조건으로", "soft"]]);
  return out;
})());

// ---------------------------------------------------------------- 02 · switch
fig("cpp-02-switch", {
  eyebrow: "02 · 선택 구조", title: "switch는 맞는 case로 뛰어든 뒤 break까지 내려간다",
  desc: "switch 식의 값과 같은 case로 들어가 그 아래 문장을 실행하고 break를 만나면 switch를 빠져나가며, break가 없으면 다음 case 문장까지 이어서 실행되고, 어느 case에도 맞지 않으면 default로 가는 흐름",
  height: 420, legend: [["flow", "실행"], ["accent", "break 없음 → 아래로 계속"], ["dash", "다음 case 검사"]],
}, [
  box(32, 128, 168, 52, { name: "switch (식)", code: true, kind: "focal" }),
  ...[["case 'A':", "A 문장", true], ["case 'B':", "B 문장", false], ["default:", "기본 문장", true]].map(([c, s, brk], i) => {
    const y = 128 + i * 92;
    return box(256, y, 136, 52, { name: c, code: true, size: 13 }) + box(440, y, 128, 52, { name: s, size: 13 }) +
      wire([[392, y + 26], [440, y + 26]]) + (brk ? box(608, y + 8, 80, 36, { name: "break", code: true, size: 13, kind: "soft" }) + wire([[568, y + 26], [608, y + 26]]) : "");
  }),
  wire([[200, 154], [256, 154]]),
  wire([[200, 166], [228, 166], [228, 246], [256, 246]], { dashed: true }),
  wire([[504, 272], [504, 312]], { color: C.accent }), tag(552, 292, "break 없음"),
  T(32, 400, "정수·문자만 가능(double 불가). 같은 case 값이 겹치면 컴파일 오류.", { size: 13, anchor: "start", fill: C.muted }),
]);

// ---------------------------------------------------------------- 03 · call by value
fig("cpp-03-call-by-value", {
  eyebrow: "03 · 함수", title: "값에 의한 호출 — 인수는 복사된다",
  desc: "main의 변수 a=5와 b=2의 값이 max 함수의 매개변수 i와 j로 복사되고, max의 지역 변수 m에 계산한 5가 return으로 main의 x에 돌아오며, 함수가 끝나면 i, j, m은 사라진다는 그림",
  height: 404, legend: [["flow", "값 복사"], ["accent", "반환 값"], ["zone", "함수의 메모리 영역"]],
}, [
  zone(32, 112, 260, 236, "main"),
  zone(428, 112, 260, 236, "max(int i, int j)"),
  wire([[192, 160], [516, 160]]), tag(354, 146, "5 복사"),
  wire([[192, 220], [516, 220]]), tag(354, 206, "2 복사"),
  wire([[516, 296], [192, 296]], { color: C.accent }), tag(354, 282, "return m (5)"),
  cells(128, 140, [{ value: "5" }], { w: 64 }), T(112, 166, "a", { code: true, anchor: "end", fill: C.muted }),
  cells(128, 200, [{ value: "2" }], { w: 64 }), T(112, 226, "b", { code: true, anchor: "end", fill: C.muted }),
  cells(128, 276, [{ value: "5", kind: "accent" }], { w: 64 }), T(112, 302, "x", { code: true, anchor: "end", fill: C.muted }),
  cells(516, 140, [{ value: "5" }], { w: 64 }), T(596, 166, "i", { code: true, anchor: "start", fill: C.muted }),
  cells(516, 200, [{ value: "2" }], { w: 64 }), T(596, 226, "j", { code: true, anchor: "start", fill: C.muted }),
  cells(516, 276, [{ value: "5" }], { w: 64 }), T(596, 302, "m", { code: true, anchor: "start", fill: C.muted }),
  T(32, 380, "i, j를 바꿔도 a, b는 그대로다. max가 끝나면 i, j, m은 사라진다.", { size: 13, anchor: "start", fill: C.muted }),
]);

// ---------------------------------------------------------------- 03 · recursion
fig("cpp-03-factorial-stack", {
  eyebrow: "03 · 재귀", title: "factorial(4) — 내려가며 부르고, 올라오며 곱한다",
  desc: "factorial(4)가 factorial(3), factorial(2), factorial(1)을 차례로 호출하며 내려가고, 기저 조건 factorial(1)이 1을 돌려준 뒤 2, 6, 24를 차례로 돌려주며 올라오는 호출 그림",
  height: 452, legend: [["flow", "호출"], ["accent", "반환 값"], ["focal", "기저 조건"]],
}, [
  ...[0, 1, 2].map(i => wire([[200, 160 + i * 76], [200, 196 + i * 76]])),
  ...[0, 1, 2].map(i => wire([[456, 196 + i * 76], [456, 160 + i * 76]], { color: C.accent })),
  ...[["factorial(4)", "4 * factorial(3)", "24"], ["factorial(3)", "3 * factorial(2)", "6"], ["factorial(2)", "2 * factorial(1)", "2"], ["factorial(1)", "x <= 1 → return 1", "1"]].map(([call, body, ret], i) => {
    const y = 120 + i * 76;
    return box(96, y, 208, 40, { name: call, code: true, size: 14, kind: i === 3 ? "focal" : "node" }) +
      box(352, y, 208, 40, { name: body, code: true, size: 12, kind: i === 3 ? "focal" : "soft" }) +
      T(600, y + 26, `→ ${ret}`, { size: 15, weight: 700, code: true, fill: C.accent, anchor: "start" });
  }),
  T(32, 428, "기저 조건이 없으면 끝없이 내려가다 스택이 넘친다(stack overflow).", { size: 13, anchor: "start", fill: C.muted }),
]);

// ---------------------------------------------------------------- 03 · scope
fig("cpp-03-scope", {
  eyebrow: "03 · 스코프와 저장 클래스", title: "이름이 보이는 범위는 바깥에서 안으로 좁아진다",
  desc: "전역 변수는 파일 끝까지, 지역 변수는 함수 끝까지, 블록 변수는 중괄호 블록 끝까지 보이며, static 지역 변수는 보이는 범위는 함수 안이지만 값은 프로그램이 끝날 때까지 남는다는 포함 관계 그림",
  height: 444, legend: [["zone", "스코프(보이는 범위)"], ["accentBox", "수명이 다른 변수"]],
}, [
  zone(32, 112, 656, 308, "전역 스코프 · 파일 끝까지  —  int count = 0;", { kind: "paper" }),
  zone(56, 148, 608, 252, "함수 스코프 · 함수 끝까지  —  int countcalls() { … }"),
  zone(80, 184, 300, 196, "블록 스코프 · } 까지", { kind: "deep" }),
  box(104, 220, 252, 64, { name: "int k = j * 10;", code: true, sub: "블록이 끝나면 사라짐", size: 13 }),
  box(104, 300, 252, 60, { name: "{ int m = j + k; }", code: true, sub: "더 안쪽 블록", size: 13, kind: "soft" }),
  box(404, 220, 236, 140, { tag: "static", name: "static int count = 0;", code: true, size: 12, sub: ["보이는 곳: 함수 안", "수명: 프로그램 끝까지", "→ 호출마다 1, 2, 3"], kind: "accent" }),
]);

// ---------------------------------------------------------------- 04 · reference
fig("cpp-04-reference", {
  eyebrow: "04 · 참조", title: "참조는 같은 메모리 칸의 또 다른 이름",
  desc: "int count와 int &blah = count가 같은 메모리 칸 하나를 가리키는 두 이름이라서 blah++ 하면 count도 바뀌고, 참조 매개변수 int &x로 받은 함수가 호출한 쪽 변수를 직접 바꾼다는 그림",
  height: 364, legend: [["flow", "같은 칸을 가리킴"], ["focal", "실제 메모리 칸"]],
}, [
  wire([[176, 156], [312, 156], [312, 172]]),
  wire([[176, 236], [312, 236], [312, 220]]),
  box(32, 132, 144, 48, { name: "count", code: true }),
  box(32, 212, 144, 48, { name: "blah (참조)", code: false, size: 14 }),
  box(264, 172, 96, 48, { name: "2", code: true, kind: "focal", size: 18 }),
  T(376, 192, "int count = 1;", { size: 13, code: true, anchor: "start" }),
  T(376, 212, "int &blah = count;", { size: 13, code: true, anchor: "start" }),
  T(376, 232, "blah++;   // count도 2", { size: 13, code: true, anchor: "start" }),
  T(32, 300, "참조는 선언할 때 반드시 초기화하고, 다른 변수로 다시 연결할 수 없다.", { size: 13, anchor: "start", fill: C.muted }),
  T(32, 324, "void add10(int &x) 는 호출한 쪽 변수를 직접 바꾼다 (call by reference).", { size: 13, anchor: "start", fill: C.muted }),
]);

// ---------------------------------------------------------------- 04 · array memory
fig("cpp-04-array-memory", {
  eyebrow: "04 · 배열", title: "double x[8] — 붙어 있는 8칸, 번호는 0부터",
  desc: "double 배열 x의 원소 8개가 메모리에 8바이트씩 연속으로 놓이고 첨자는 0부터 7까지이며, x[8]은 배열 밖이라 잘못된 접근이라는 그림",
  height: 316, legend: [["cell", "배열 원소 (8바이트)"], ["accentBox", "범위 밖"]],
}, [
  cells(40, 152, [0, 1, 2, 3, 4, 5, 6, 7].map(i => ({ label: `x[${i}]`, value: ["16.0", "12.0", "6.0", "8.0", "2.5", "12.0", "14.0", "-54.5"][i], note: `+${i * 8}` })), { w: 76, size: 12 }),
  `<rect x="648" y="152" width="40" height="40" fill="${C.accentTint}" stroke="${C.accent}" stroke-dasharray="5,4"/>`,
  T(668, 144, "x[8]", { size: 12, code: true, fill: C.accent }),
  T(32, 244, "첫 원소는 x[0], 마지막은 x[7] (원소 n개면 n-1).", { size: 13, anchor: "start", fill: C.muted }),
  T(32, 268, "x[8]처럼 범위를 벗어나도 컴파일은 되지만, 실행 중 오류나 엉뚱한 값이 나온다.", { size: 13, anchor: "start", fill: C.muted }),
]);

// ---------------------------------------------------------------- 04 · 2-D row-major
fig("cpp-04-2d-row-major", {
  eyebrow: "04 · 다차원 배열", title: "int A[4][3]은 3칸짜리 배열 4개가 한 줄로 이어진 것",
  desc: "2차원 배열 A[4][3]을 표로 보면 4행 3열이지만 메모리에는 A[0]행의 세 칸, A[1]행의 세 칸 순서로 한 줄로 저장되는 행 우선 배치 그림",
  height: 436, legend: [["flow", "메모리 배치 순서"], ["zone", "한 행 = 3칸 배열"]],
}, [
  T(32, 128, "표로 볼 때", { size: 13, weight: 700, anchor: "start" }),
  ...[0, 1, 2, 3].map(r => cells(80, 140 + r * 40, [0, 1, 2].map(c => ({ value: `A[${r}][${c}]`, kind: r === 1 ? "soft" : "node" })), { w: 84, h: 40, size: 11 }) + T(68, 165 + r * 40, `A[${r}]`, { size: 12, code: true, anchor: "end", fill: C.muted })),
  T(400, 128, "메모리에서 (행 우선)", { size: 13, weight: 700, anchor: "start" }),
  ...[0, 1, 2, 3].map(r => zone(400, 140 + r * 64, 288, 56, "", { kind: r === 1 ? "deep" : "soft" }) + cells(412, 148 + r * 64, [0, 1, 2].map(c => ({ value: `A[${r}][${c}]` })), { w: 88, h: 40, size: 11 })),
  ...[0, 1, 2].map(r => wire([[544, 196 + r * 64], [544, 204 + r * 64]])),
  T(32, 420, "함수 매개변수로 넘길 때 첫 번째 크기만 생략할 수 있다: void f(int A[][3])", { size: 13, anchor: "start", fill: C.muted }),
]);

// ---------------------------------------------------------------- 05 · pointer memory
fig("cpp-05-pointer-memory", {
  eyebrow: "05 · 포인터", title: "포인터는 주소를 값으로 저장하는 변수",
  desc: "주소 1004에 있는 int x와 주소 1016에 있는 포인터 p를 메모리 표로 그리고, p = &x 로 p에 1004가 들어가 x를 가리키며, *p = 5 로 x의 값이 5가 되는 과정",
  height: 420, legend: [["accent", "p가 가리키는 칸"], ["focal", "주소를 담은 칸"]],
}, [
  T(84, 128, "주소", { size: 12, fill: C.muted, code: true }), T(196, 128, "값", { size: 12, fill: C.muted }),
  ...[1000, 1004, 1008, 1012, 1016, 1020].map((a, i) => {
    const y = 140 + i * 40, isX = a === 1004, isP = a === 1016;
    return T(84, y + 25, String(a), { size: 13, code: true, fill: C.muted }) +
      `<rect x="136" y="${y}" width="120" height="40" fill="${isX ? C.accentTint : isP ? C.ink : C.paper}" stroke="${isX ? C.accent : C.rule}" stroke-width="1.4"/>` +
      T(196, y + 26, isX ? "5" : isP ? "1004" : "", { size: 15, weight: 700, code: true, fill: isP ? C.paper : C.ink }) +
      (isX ? T(272, y + 25, "x", { size: 14, code: true, anchor: "start", weight: 700 }) : "") +
      (isP ? T(272, y + 25, "p", { size: 14, code: true, anchor: "start", weight: 700 }) : "");
  }),
  wire([[256, 312], [300, 312], [300, 208], [260, 208]], { color: C.accent }),
  tag(348, 260, "가리킴"),
  T(400, 168, "int x = 0;", { size: 14, code: true, anchor: "start" }),
  T(400, 196, "int *p;      // 선언의 *", { size: 14, code: true, anchor: "start" }),
  T(400, 224, "p = &x;      // & = 주소", { size: 14, code: true, anchor: "start" }),
  T(400, 252, "*p = 5;      // 식의 * = 역참조", { size: 14, code: true, anchor: "start" }),
  T(400, 296, "→ x는 5, p는 1004", { size: 14, weight: 700, anchor: "start" }),
  T(400, 324, "주소 숫자는 실행마다 다르다.", { size: 12, anchor: "start", fill: C.muted }),
  T(400, 344, "중요한 것은 \"어느 칸을 가리키나\"다.", { size: 12, anchor: "start", fill: C.muted }),
]);

// ---------------------------------------------------------------- 05 · swap by value vs pointer
fig("cpp-05-swap", {
  eyebrow: "05 · 포인터와 함수", title: "swap(n, m)과 swap(&n, &m)의 차이",
  desc: "값으로 받은 swap은 복사본 x, y만 바꿔 n과 m이 1과 2로 그대로 남고, 포인터로 받은 swap은 p1, p2가 n과 m을 가리켜 *p1, *p2를 바꾸므로 n과 m이 2와 1로 바뀐다는 비교 그림",
  height: 416, legend: [["flow", "값 복사"], ["accent", "주소로 원본을 가리킴"], ["zone", "함수 영역"]],
}, [
  zone(32, 112, 316, 280, "call by value · swap(n, m)"),
  zone(372, 112, 316, 280, "call by reference · swap(&n, &m)"),
  wire([[120, 192], [120, 256]]), wire([[248, 192], [248, 256]]),
  tag(184, 224, "값 복사"),
  cells(88, 152, [{ label: "n", value: "1" }], {}), cells(216, 152, [{ label: "m", value: "2" }], {}),
  cells(88, 256, [{ value: "2", kind: "soft" }], {}), cells(216, 256, [{ value: "1", kind: "soft" }], {}),
  T(120, 316, "x", { code: true, fill: C.muted }), T(248, 316, "y", { code: true, fill: C.muted }),
  T(190, 360, "출력: 1 2  (원본 그대로)", { size: 13, weight: 700 }),
  wire([[460, 256], [460, 192]], { color: C.accent }), wire([[588, 256], [588, 192]], { color: C.accent }),
  tag(524, 224, "주소"),
  cells(428, 152, [{ label: "n", value: "2", kind: "accent" }], {}), cells(556, 152, [{ label: "m", value: "1", kind: "accent" }], {}),
  cells(428, 256, [{ value: "&n", kind: "focal" }], {}), cells(556, 256, [{ value: "&m", kind: "focal" }], {}),
  T(460, 316, "p1", { code: true, fill: C.muted }), T(588, 316, "p2", { code: true, fill: C.muted }),
  T(530, 360, "출력: 2 1  (원본이 바뀜)", { size: 13, weight: 700 }),
]);

// ---------------------------------------------------------------- 05 · pointer arithmetic
fig("cpp-05-pointer-arithmetic", {
  eyebrow: "05 · 포인터 연산", title: "ptr + 1은 1바이트가 아니라 원소 한 칸",
  desc: "int 배열 a의 다섯 칸 위에 ptr이 a[0]을 가리키고, ptr+2는 두 칸 뒤 a[2], ptr+4는 a[4]를 가리키며 int는 4바이트라 주소는 8, 16바이트 뒤가 된다는 그림",
  height: 336, legend: [["flow", "포인터가 가리키는 칸"]],
}, [
  ...[0, 2, 4].map(i => wire([[112 + i * 112, 152], [112 + i * 112, 188]])),
  ...[0, 2, 4].map(i => T(112 + i * 112, 140, i ? `ptr + ${i}` : "ptr", { size: 14, code: true, weight: 700 })),
  cells(56, 188, [0, 1, 2, 3, 4].map(i => ({ value: `a[${i}]`, note: `+${i * 4} B`, kind: i % 2 === 0 ? "soft" : "node" })), { w: 112, h: 44, top: true, size: 14 }),
  T(32, 284, "a[i] == *(a + i) == *(ptr + i) == ptr[i]", { size: 15, code: true, anchor: "start", weight: 700 }),
  T(32, 312, "배열 이름 a는 첫 원소 주소를 가진 고정 포인터라 a++는 안 되지만 ptr++는 된다.", { size: 13, anchor: "start", fill: C.muted }),
]);

// ---------------------------------------------------------------- 05 · stack and heap
fig("cpp-05-stack-heap", {
  eyebrow: "05 · 동적 메모리", title: "스택의 포인터가 힙의 블록을 가리킨다",
  desc: "함수의 지역 변수는 스택에 있다가 함수가 끝나면 사라지고, new로 힙에 빌린 블록은 delete할 때까지 남으며, 포인터를 잃어버리면 힙 블록을 돌려줄 수 없는 메모리 누수가 생긴다는 그림",
  height: 404, legend: [["flow", "주소로 가리킴"], ["accentBox", "누수: 가리키는 포인터가 없음"], ["zone", "메모리 영역"]],
}, [
  zone(32, 112, 240, 268, "스택 · 자동으로 사라짐"),
  zone(320, 112, 368, 268, "힙 · delete 해야 사라짐"),
  wire([[240, 168], [368, 168]]),
  wire([[240, 248], [368, 248]]),
  box(56, 144, 184, 48, { name: "int *arr", code: true, sub: "지역 변수 · 8 B", size: 14 }),
  box(56, 224, 184, 48, { name: "Circle *c", code: true, sub: "지역 변수 · 8 B", size: 14 }),
  box(368, 144, 296, 48, { name: "new int[n]", code: true, sub: "실행 중에 크기 결정 → delete[]", size: 14, kind: "soft" }),
  box(368, 224, 296, 48, { name: "new Circle(9)", code: true, sub: "객체 하나 → delete", size: 14, kind: "soft" }),
  box(368, 304, 296, 52, { name: "주소를 잃은 블록", sub: "p = new int(1); p = new int(2);", subCode: true, size: 14, kind: "accent" }),
  T(56, 320, "C++에는 가비지 컬렉터가", { size: 12, anchor: "start", fill: C.muted }),
  T(56, 340, "없다 — 직접 delete", { size: 12, anchor: "start", fill: C.muted }),
]);

// ---------------------------------------------------------------- 06 · class and objects
fig("cpp-06-class-objects", {
  eyebrow: "06 · 클래스", title: "클래스는 설계도, 객체는 설계도로 만든 실체",
  desc: "Circle 클래스가 속성 radius와 메서드 area()를 정의하고, 그 클래스로 만든 네 객체가 각자 radius 2, 12, 3, 7을 가지며 같은 area() 메서드를 공유한다는 그림",
  height: 400, legend: [["flow", "인스턴스화"], ["focal", "클래스"]],
}, [
  ...[0, 1, 2, 3].map(i => wire([[312 + i * 32, 224], [312 + i * 32, 248], [96 + i * 176, 248], [96 + i * 176, 288]])),
  box(256, 120, 208, 104, { tag: "class", name: "Circle", sub: ["radius : double", "area() : double"], subCode: true, kind: "focal", size: 16 }),
  ...[2, 12, 3, 7].map((r, i) => box(32 + i * 176, 288, 128, 64, { name: `object ${i + 1}`, sub: `radius = ${r}`, subCode: true, size: 13 })),
  T(480, 156, "← 속성 (attribute)", { size: 12, anchor: "start", fill: C.muted }),
  T(480, 180, "← 메서드 (method)", { size: 12, anchor: "start", fill: C.muted }),
  T(32, 380, "클래스를 정의만 해서는 객체가 생기지 않는다. Circle c; 처럼 변수를 만들 때 생긴다(인스턴스화).", { size: 13, anchor: "start", fill: C.muted }),
]);

// ---------------------------------------------------------------- 06 · access and lifecycle
fig("cpp-06-encapsulation", {
  eyebrow: "06 · 정보 은닉", title: "private 속성은 public 메서드를 통해서만",
  desc: "Circle 클래스 안의 private radius는 바깥 main에서 직접 접근할 수 없고, public 메서드 set_radius, get_radius, area를 통해서만 읽고 쓰며, 생성자는 객체가 생길 때 소멸자는 사라질 때 자동으로 불린다는 그림",
  height: 424, legend: [["flow", "허용된 접근"], ["accent", "막힌 접근 (컴파일 오류)"], ["outside", "클래스 바깥"]],
}, [
  zone(240, 112, 448, 288, "class Circle"),
  wire([[192, 180], [264, 180]]), wire([[192, 236], [264, 236]]),
  wire([[160, 288], [160, 348], [480, 348], [480, 324]], { color: C.accent }),
  tag(320, 330, "c.radius = 3; ✕"),
  box(32, 152, 160, 136, { name: "main()", code: true, sub: ["Circle c(5.0);", "c.set_radius(3);", "c.area();"], subCode: true, kind: "outside" }),
  box(264, 148, 196, 64, { tag: "public", name: "set_radius(r)", code: true, sub: "setter", size: 13 }),
  box(264, 220, 196, 52, { name: "get_radius() · area()", code: true, size: 12, sub: "getter · 계산" }),
  box(480, 272, 184, 52, { tag: "private", name: "double radius", code: true, kind: "focal", size: 13 }),
  wire([[460, 180], [572, 180], [572, 272]]),
  box(480, 128, 184, 36, { name: "Circle(double r)", code: true, size: 12, kind: "soft" }),
  box(480, 344, 184, 36, { name: "~Circle()", code: true, size: 12, kind: "soft" }),
]);

// ---------------------------------------------------------------- 07 · inheritance
fig("cpp-07-inheritance", {
  eyebrow: "07 · 상속", title: "Cylinder는 Circle을 물려받아 높이와 부피를 더한다",
  desc: "기반 클래스 Circle의 protected radius와 virtual area()를 파생 클래스 Cylinder가 물려받고, height 속성과 volume() 메서드를 더하며 area()를 원기둥 겉넓이로 오버라이딩하고, 생성자에서 Circle(r)을 먼저 호출한다는 UML 클래스 그림",
  height: 444, legend: [["flow", "상속 (is-a)"], ["focal", "기반 클래스"], ["accentBox", "오버라이딩"]],
}, [
  wire([[360, 300], [360, 236]], { color: C.ink }),
  tag(416, 268, "public 상속"),
  box(208, 120, 304, 116, { tag: "base · superclass", name: "Circle", sub: ["# radius : double", "+ virtual area() : double", "+ Circle(double r)"], subCode: true, kind: "focal", size: 16 }),
  box(208, 300, 304, 116, { tag: "derived · subclass", name: "Cylinder", sub: ["- height : double", "+ area() : double   // 겉넓이", "+ volume() : double"], subCode: true, kind: "accent", size: 16 }),
  T(536, 330, "Cylinder(r, h)", { size: 12, code: true, anchor: "start" }),
  T(536, 350, "  : Circle(r) { … }", { size: 12, code: true, anchor: "start" }),
  T(536, 376, "기반 생성자 먼저", { size: 12, anchor: "start", fill: C.muted }),
  T(32, 150, "# protected", { size: 12, code: true, anchor: "start", fill: C.muted }),
  T(32, 170, "+ public", { size: 12, code: true, anchor: "start", fill: C.muted }),
  T(32, 190, "- private", { size: 12, code: true, anchor: "start", fill: C.muted }),
]);

// ---------------------------------------------------------------- 07 · dynamic binding
fig("cpp-07-dynamic-binding", {
  eyebrow: "07 · 다형성", title: "Circle* 로 Cylinder를 가리킬 때 area()는 누구의 것?",
  desc: "Circle 포인터 cir1이 Cylinder 객체를 가리킬 때, area()가 virtual이면 실행 중에 실제 객체를 보고 Cylinder::area()를, virtual이 아니면 컴파일할 때 포인터 자료형을 보고 Circle::area()를 호출한다는 흐름",
  height: 412, legend: [["flow", "결정 흐름"], ["focal", "판단 지점"], ["accentBox", "동적 바인딩 결과"]],
}, [
  wire([[360, 176], [360, 208]]),
  wire([[256, 236], [176, 236], [176, 300]]), tag(176, 268, "아니오"),
  wire([[464, 236], [544, 236], [544, 300]]), tag(544, 268, "예"),
  box(208, 120, 304, 56, { name: "Circle* cir1 = cyl;", code: true, sub: "실제 객체는 Cylinder", size: 14 }),
  box(256, 208, 208, 56, { name: "area()가 virtual?", code: false, kind: "focal", size: 14 }),
  box(56, 300, 240, 72, { tag: "정적 바인딩 · 컴파일 때", name: "Circle::area()", code: true, sub: "포인터 자료형 기준", size: 14 }),
  box(424, 300, 240, 72, { tag: "동적 바인딩 · 실행 때", name: "Cylinder::area()", code: true, sub: "실제 객체 기준", size: 14, kind: "accent" }),
]);

// ---------------------------------------------------------------- 07 · static member
fig("cpp-07-static-member", {
  eyebrow: "07 · static 멤버", title: "static 속성은 모든 객체가 함께 쓰는 하나",
  desc: "foo 클래스의 static int cnt는 클래스에 하나만 있고 세 객체 f1, f2, f3이 같은 cnt를 공유하며, 일반 속성 i는 객체마다 따로 있고, static 속성은 클래스 밖 cpp 파일에서 정의해야 한다는 그림",
  height: 384, legend: [["flow", "공유"], ["focal", "클래스에 하나"]],
}, [
  ...[0, 1, 2].map(i => wire([[120 + i * 232, 264], [120 + i * 232, 236], [328 + i * 32, 236], [328 + i * 32, 196]])),
  box(248, 120, 224, 76, { tag: "static", name: "foo::cnt = 3", code: true, sub: "int foo::cnt = 0;  // .cpp", subCode: true, kind: "focal", size: 15 }),
  ...["f1", "f2", "f3"].map((n, i) => box(40 + i * 232, 264, 160, 64, { name: n, code: true, sub: `i = ${[4, 9, 1][i]}  (각자)`, subCode: true, size: 14 })),
  T(32, 364, "static 메서드는 객체 없이 foo::count() 로 부르고, 일반 속성(i)은 쓸 수 없다(this가 없다).", { size: 13, anchor: "start", fill: C.muted }),
]);

// ---------------------------------------------------------------- 08 · exception propagation
fig("cpp-08-exception-flow", {
  eyebrow: "08 · 예외 처리", title: "throw는 맞는 catch를 찾을 때까지 위로 올라간다",
  desc: "main이 foo를, foo가 foo_1을 호출한 상태에서 foo_1이 throw 1을 하면 foo_1에는 try가 없어 즉시 빠져나가고, foo의 try에 딸린 catch(int)가 받아 처리한 뒤 catch 다음 문장으로 이어지며, 맞는 catch가 끝까지 없으면 기본 처리기가 프로그램을 끝낸다는 흐름",
  height: 452, legend: [["flow", "호출"], ["accent", "예외 전파"], ["focal", "처리하는 catch"]],
}, [
  wire([[200, 176], [200, 212]]), wire([[200, 268], [200, 304]]),
  wire([[376, 332], [432, 332], [432, 240], [376, 240]], { color: C.accent }), tag(504, 286, "catch 없음"),
  box(56, 120, 320, 56, { name: "main()", code: true, sub: "foo() 호출", size: 14 }),
  box(56, 212, 320, 56, { name: "foo()  try { foo_1(); }", code: true, sub: "catch (int i) 가 받음", size: 13, kind: "focal" }),
  box(56, 304, 320, 56, { name: "foo_1()  throw 1;", code: true, sub: "try 없음 → 즉시 빠져나감", size: 13, kind: "accent" }),
  T(56, 400, "처리 후에는 catch 블록 다음 문장으로 간다 (throw 지점으로 돌아가지 않음).", { size: 13, anchor: "start", fill: C.muted }),
  T(56, 424, "catch는 자료형이 정확히 맞아야 받는다. 끝까지 없으면 기본 처리기가 종료시킨다.", { size: 13, anchor: "start", fill: C.muted }),
]);

// ---------------------------------------------------------------- 08 · stack unwinding
fig("cpp-08-stack-unwinding", {
  eyebrow: "08 · 스택 풀기", title: "예외가 지나가는 함수의 지역 객체는 소멸자가 불린다",
  desc: "main의 try 블록 안 객체 g(main), outer의 g(out), inner의 g(in)이 쌓인 상태에서 inner가 throw 1을 하면 in, out, main 순서로 소멸자가 불린 뒤에 catch가 실행되는 스택 풀기 그림",
  height: 404, legend: [["accent", "풀리는 순서"], ["focal", "catch 실행"]],
}, [
  wire([[472, 176], [520, 176], [520, 344], [472, 344]], { color: C.accent }),
  box(96, 144, 376, 64, { tag: "① 먼저 소멸", name: "inner()  G g(\"in\"); throw 1;", code: true, size: 13, kind: "accent" }),
  box(96, 216, 376, 52, { tag: "②", name: "outer()  G g(\"out\");", code: true, size: 13 }),
  box(96, 276, 376, 52, { tag: "③", name: "main try { G g(\"main\"); }", code: true, size: 13 }),
  box(96, 336, 376, 44, { name: "catch (int e) — 정리가 끝난 뒤", size: 13, kind: "focal" }),
  T(560, 200, "출력", { size: 13, weight: 700, anchor: "start" }),
  ...["main+ out+ in+", "in- out- main-", "catch1 end"].map((l, i) => T(560, 228 + i * 24, l, { size: 13, code: true, anchor: "start" })),
  T(96, 132, "호출 스택 (위가 가장 최근)", { size: 12, anchor: "start", fill: C.muted }),
]);

// ---------------------------------------------------------------- 09 · template instantiation
fig("cpp-09-template-instantiation", {
  eyebrow: "09 · 템플릿", title: "템플릿은 틀 — 컴파일러가 자료형마다 함수를 찍어 낸다",
  desc: "template <typename T> void change(T& a, T& b) 하나에서 int, double, string으로 호출하면 컴파일러가 change<int>, change<double>, change<string> 세 함수를 따로 만들고, 서로 다른 자료형을 섞으면 T를 정할 수 없어 컴파일 오류가 난다는 그림",
  height: 404, legend: [["flow", "인스턴스화"], ["focal", "템플릿 (설계도)"], ["accentBox", "T를 정할 수 없음"]],
}, [
  ...[0, 1, 2].map(i => wire([[328 + i * 32, 200], [328 + i * 32, 228], [120 + i * 240, 228], [120 + i * 240, 268]])),
  box(200, 120, 320, 80, { tag: "template <typename T>", name: "void change(T& a, T& b)", code: true, kind: "focal", size: 14 }),
  ...[["change<int>", "change(i1, i2)"], ["change<double>", "change(x, y)"], ["change<string>", "change(s, t)"]].map(([n, call], i) => box(32 + i * 240, 268, 176, 64, { name: n, code: true, sub: call, subCode: true, size: 13 })),
  box(32, 352, 656, 36, { name: "change(i, d)   // int와 double을 섞음 → T를 정할 수 없어 컴파일 오류", code: true, size: 12, kind: "accent" }),
]);

for (const [slug, svg] of figs) writeFileSync(path.join(outDir, `${slug}.svg`), svg);
console.log(figs.map(([s]) => s).join(" "));
