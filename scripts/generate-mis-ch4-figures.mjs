import { writeFileSync } from "node:fs";
import path from "node:path";
import { box, circle, frame, lines, p, t } from "./mis-figure-kit.mjs";

// Redraws the Chapter 4 textbook figures from the course notes (no slide PDF was available): node scripts/generate-mis-ch4-figures.mjs
const outDir = process.argv[2] ?? path.join("public", "materials", "diagrams");
const f = (n, meta, body) => {
  const slug = `mis-fig-4-${String(n).padStart(2, "0")}`;
  return [slug, frame(slug, { chapter: 4, figure: `4.${n}`, ...meta }, body.join("\n  "))];
};
const note = (height) => t(1216, height - 20, "교재 그림의 구성을 바탕으로 다시 그림", "small", "end");

const figures = [
  f(1, { title: "The Relationship Between Ethical, Social, and Political Issues", subtitle: "새로운 정보기술은 개인의 윤리 문제에서 사회 문제, 정치 문제로 물결처럼 번지며 다섯 가지 도덕적 차원에서 검토된다", height: 820 }, [
    circle(640, 440, 270, "zone"), circle(640, 440, 200, "deep"), circle(640, 440, 130, "node"), circle(640, 440, 64, "focal"),
    lines(640, 432, ["Information", "Technology"], "small inverse", 16, "middle"),
    t(640, 340, "Individual · 개인", "name", "middle"), t(640, 362, "Ethical issues", "sub", "middle"),
    t(640, 266, "Society · 사회", "name", "middle"), t(640, 288, "Social issues", "sub", "middle"),
    t(640, 196, "Polity · 정치", "name", "middle"), t(640, 218, "Political issues", "sub", "middle"),
    ...[[150, 300, "Information rights", "and obligations", "정보 권리·의무"], [1130, 300, "Property rights", "and obligations", "재산권·의무"], [150, 580, "Accountability", "and control", "책임과 통제"], [1130, 580, "System quality", "", "시스템 품질"], [640, 748, "Quality of life", "", "삶의 질"]]
      .map(([x, y, a, b, ko]) => `${t(x, y, a, "name", "middle")}${b ? t(x, y + 22, b, "name", "middle") : ""}${t(x, y + (b ? 44 : 22), ko, "sub", "middle")}`),
    p("M270 330 L 400 360", "soft"), p("M1010 330 L 880 360", "soft"), p("M270 560 L 400 520", "soft"), p("M1010 560 L 880 520", "soft"), p("M640 712 V 726", "soft"), note(820),
    t(96, 196, "Five moral dimensions · 다섯 가지 도덕적 차원", "small"),
  ]),
  f(2, { title: "Nonobvious Relationship Awareness (NORA)", subtitle: "여러 출처의 데이터를 이름 표준화·대조·병합해 겉으로 드러나지 않던 관계를 찾아 경고를 보낸다", height: 640 }, [
    ...["Incident and arrest systems", "Customer transaction systems", "Telephone records", "Human resources systems", "Watch lists"].map((label, i) => `${box(64, 176 + i * 78, 300, 58, "zone")}${t(214, 212 + i * 78, label, "label", "middle")}${p(`M364 ${205 + i * 78} H 420`, "line")}`),
    p("M420 205 V 517", "line"), p("M420 361 H 476", "flow"),
    ...[[["Name", "standardization"], "이름 표준화"], [["Match"], "대조"], [["Merge"], "병합"]].map(([en, ko], i) => `${box(480 + i * 210, 306, 180, 110, i === 2 ? "deep" : "node")}${lines(570 + i * 210, en.length > 1 ? 346 : 358, en, "name", 22, "middle")}${t(570 + i * 210, 394, ko, "sub", "middle")}${i < 2 ? p(`M${660 + i * 210} 361 H ${686 + i * 210}`, "flow") : ""}`),
    p("M1080 361 H 1096", "flow"), box(1100, 306, 116, 110, "focal"), lines(1158, 356, ["NORA", "Alerts"], "name inverse", 24, "middle"),
    t(860, 470, "같은 주소·전화번호·이름 변형을 찾아 사람들 사이의 숨은 관계를 드러낸다", "sub", "middle"),
    note(640),
  ]),
  f(3, { title: "How Cookies Identify Web Visitors", subtitle: "웹 서버가 브라우저에 저장한 쿠키 ID로 재방문자를 알아보고, 저장해 둔 방문 기록을 불러온다", height: 660 }, [
    box(96, 220, 300, 300, "zone"), t(246, 256, "User’s computer · 사용자", "name", "middle"),
    lines(246, 300, ["Browser · OS · IP address", "브라우저 정보"], "sub", 22, "middle"),
    box(146, 380, 200, 90, "node"), lines(246, 418, ["Cookie file", "ID 9 3 1 2 7"], "label", 24, "middle"),
    box(884, 220, 300, 300, "deep"), t(1034, 256, "Web server · 웹 서버", "name", "middle"),
    lines(1034, 300, ["Stored visitor data", "방문 기록 · 선호"], "sub", 22, "middle"),
    p("M396 270 H 880", "flow"), t(640, 258, "① 방문하면 서버가 브라우저·OS·IP 정보를 읽는다", "label", "middle"),
    p("M880 330 H 400", "flow"), t(640, 318, "② 서버가 고유 ID가 담긴 쿠키를 보낸다", "label", "middle"),
    t(640, 378, "③ 브라우저가 쿠키를 컴퓨터에 저장한다", "label", "middle"),
    p("M396 450 H 880", "flow"), t(640, 438, "④ 재방문 때 서버가 쿠키를 요청해 ID로 방문자를 알아본다", "label", "middle"),
    box(96, 560, 1088, 64, "zone"), t(640, 598, "쿠키 자체는 식별자일 뿐이지만, 방문 기록과 연결되면 개인의 행동 프로필이 된다", "label", "middle"),
    note(660),
  ]),
];

for (const [slug, svg] of figures) writeFileSync(path.join(outDir, `${slug}.svg`), svg);
console.log(figures.map(([slug]) => slug).join(" "));
