// Rebuilds a rendered exam page as a CSAT-style test paper (문제지) and answer booklet (정답과 해설) for printing.
// It reads the DOM the page already rendered, so every exam format the site supports prints the same way.

export type ExamPaperMode = "both" | "questions" | "answers";

export interface ExamPaperOptions {
  mode: ExamPaperMode;
  /** Exam title, printed as the small line above the masthead. */
  title: string;
  /** Catalog subject name, e.g. "정시개 · 경영정보시스템". */
  subjectName?: string;
  /** Position of this exam among the subject's exams, printed as "제 N 교시". */
  period?: number;
}

interface Question {
  number: string;
  topic: string;
  points?: string;
  section?: string;
  body: Element[];
  answers: Element[];
  /** Correct choice letters, one per part, when every part is multiple choice. */
  choices: string[];
}

type RawQuestion = Omit<Question, "choices">;

const CIRCLED = "①②③④⑤⑥⑦⑧⑨⑩";
const QUESTION_HEADING = /^(?:(?:문제|문항|question|q)\s*)?0*(\d{1,3})(?=$|\s|[.)·:\]]|번)/i;
const POINTS = /`?(\d+(?:\.\d+)?)\s*(?:점|points?|pts?)`?/i;
const HEADING = /^H[2-6]$/;

export const circled = (letter: string) => CIRCLED[letter.toUpperCase().charCodeAt(0) - 65] ?? letter;

/** "정시개 · 경영정보시스템" → ["정시개", "경영정보시스템"], printed as "정시개 영역(경영정보시스템)". */
export function subjectTitle(subjectName = "") {
  const [main, ...rest] = subjectName.split(/\s+·\s+/);
  return { main: main?.trim() || "학습", sub: rest.join(" · ").trim() };
}

export function parseQuestionHeading(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  const match = QUESTION_HEADING.exec(clean);
  if (!match) return undefined;
  const points = POINTS.exec(clean.slice(match[0].length))?.[1];
  const topic = clean.slice(match[0].length).replace(POINTS, "").replace(/^[\s·.:)\]\-–—]+|[\s·.:\-–—]+$/g, "").trim();
  return { number: String(Number(match[1])), topic, points };
}

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

const isHeading = (node: Element) => HEADING.test(node.tagName);
const headingLevel = (node: Element) => Number(node.tagName[1]);
const is = (node: Element, selector: string) => node.matches(selector);
const isAnswer = (node: Element) => is(node, "details.study-answer:not(.study-answer-translation), details.answer, details.study-hint-solution");
const isQuiz = (node: Element) => is(node, "section.study-quiz");

/** Splits the rendered exam into numbered questions, keeping section headings that contain questions. */
export function collectQuestions(prose: Element): Question[] {
  const nodes = [...prose.children];
  const levels = new Map<number, number>();
  for (const node of nodes) if (isHeading(node) && parseQuestionHeading(node.textContent ?? "")) levels.set(headingLevel(node), (levels.get(headingLevel(node)) ?? 0) + 1);
  const questionLevel = [...levels.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0]?.[0];

  const questions: RawQuestion[] = [];
  if (questionLevel === undefined) {
    // No numbered headings: every quiz is a question, numbered in order.
    let current: RawQuestion | undefined;
    for (const node of nodes) {
      if (isQuiz(node)) { current = { number: String(questions.length + 1), topic: "", body: [node], answers: [] }; questions.push(current); }
      else if (current && isAnswer(node)) current.answers.push(node);
    }
    return finish(questions);
  }

  let section: string | undefined;
  let current: RawQuestion | undefined;
  for (const node of nodes) {
    if (isHeading(node)) {
      const level = headingLevel(node);
      const parsed = level === questionLevel ? parseQuestionHeading(node.textContent ?? "") : undefined;
      if (parsed) { current = { ...parsed, section, body: [], answers: [] }; questions.push(current); continue; }
      if (level < questionLevel) { section = node.textContent?.replace(/\s+/g, " ").trim(); current = undefined; continue; }
      if (level === questionLevel) { current = undefined; continue; }
    }
    if (!current) continue;
    if (isAnswer(node)) current.answers.push(node);
    else current.body.push(node);
  }
  return finish(questions);
}

function finish(questions: RawQuestion[]): Question[] {
  // Keep the page's own numbers unless they repeat, which would make the answer key ambiguous.
  const unique = new Set(questions.map(question => question.number)).size === questions.length;
  return questions.map((question, index) => {
    const quizzes = question.body.filter(isQuiz);
    // Notes written before the first quiz or sub-question (sources, recall reliability) are study aids, not part of the question.
    const start = quizzes.length ? question.body.findIndex(node => isQuiz(node) || isHeading(node)) : 0;
    const body = question.body.slice(start).filter(node => !is(node, "details, aside.study-callout, hr, .print-page-break"));
    const choices = quizzes.map(quiz => (quiz as HTMLElement).dataset.quizAnswer).filter((letter): letter is string => Boolean(letter));
    // Only a question whose every part is multiple choice is answered by marking choices.
    const allChoice = choices.length > 0 && choices.length === quizzes.length;
    return { ...question, number: unique ? question.number : String(index + 1), body, choices: allChoice ? choices : [] };
  });
}

/** Copies rendered content without the page's interactive controls, ids or study styling. */
function cleanClone(node: Element, paper: "questions" | "answers") {
  const clone = node.cloneNode(true) as Element;
  clone.querySelectorAll("summary, .study-quiz-check, .study-quiz-results, .study-card-results, .copy-button, .code-feedback, .sr-only, .study-translation").forEach(item => item.remove());
  for (const item of [clone, ...clone.querySelectorAll("*")]) {
    item.removeAttribute("id");
    for (const attribute of [...item.attributes]) if (attribute.name.startsWith("data-") && attribute.name !== "data-theme" && attribute.name !== "data-language" && attribute.name !== "data-line") item.removeAttribute(attribute.name);
    item.removeAttribute("aria-pressed");
    item.removeAttribute("role");
  }
  clone.querySelectorAll("mark").forEach(mark => mark.replaceWith(...mark.childNodes));
  clone.querySelectorAll("button.study-blank").forEach(blank => {
    const answer = blank.textContent ?? "";
    const span = el("span", paper === "answers" ? "exam-blank filled" : "exam-blank", paper === "answers" ? answer : " ".repeat(Math.max(6, Math.min(24, answer.length * 2))));
    blank.replaceWith(span);
  });
  return clone;
}

/** Turns "**B.** text" choice buttons into "② text" lines grouped like a printed test. */
function formatChoices(container: Element) {
  const choices = [...container.querySelectorAll("button.study-quiz-choice")];
  if (!choices.length) return;
  const group = el("div", "exam-choices");
  choices[0].before(group);
  let longest = 0;
  for (const button of choices) {
    const letter = button.querySelector(":scope > strong")?.textContent?.trim().replace(/\.$/, "") ?? "";
    button.querySelector(":scope > strong")?.remove();
    const line = el("div", "exam-choice");
    line.append(el("span", "exam-choice-mark", circled(letter)));
    const text = el("span", "exam-choice-text");
    text.append(...button.childNodes);
    if (text.firstChild?.nodeType === Node.TEXT_NODE) text.firstChild.textContent = text.firstChild.textContent?.replace(/^\s+/, "") ?? "";
    line.append(text);
    longest = Math.max(longest, text.textContent?.trim().length ?? 0);
    group.append(line);
    button.remove();
  }
  // Short options sit on one line, as they do on a printed exam.
  if (longest <= 8 && choices.length <= 5) group.classList.add("inline");
  else if (longest <= 22 && choices.length <= 6) group.classList.add("pairs");
}

/** Unwraps a quiz box so the stem and choices read as plain exam text. */
function unwrapQuiz(node: Element) {
  if (!is(node, "section.study-quiz")) return [node];
  const holder = el("div", "exam-q-content");
  holder.append(...node.childNodes);
  return [holder];
}

function questionBlock(question: Question) {
  const block = el("div", "exam-q");
  const content = question.body.flatMap(node => unwrapQuiz(cleanClone(node, "questions")));
  for (const node of content) { formatChoices(node); block.append(node); }
  const number = el("b", "exam-q-num", `${question.number}.`);
  // The number opens the stem, as in "1. 다음 중 …"; otherwise it gets a line of its own.
  const first = block.firstElementChild;
  let stem = first && is(first, "p") ? first : first && is(first, ".exam-q-content") ? first.querySelector(":scope > p:first-child") : null;
  if (stem) stem.prepend(number, " ");
  else {
    // A question made of sub-questions opens with its own title line, e.g. "1. Concept Questions [7점]".
    stem = el("p", "exam-q-stem");
    stem.append(number);
    if (question.topic) stem.append(" ", question.topic);
    block.prepend(stem);
  }
  if (question.points) stem.append(" ", el("span", "exam-q-points", `[${question.points}점]`));
  // Written questions get room for the answer.
  if (!question.choices.length) block.append(el("div", "exam-write", "답"));
  return block;
}

// Part labels ("(1)", "1)", "가.") and heading words ("모범 답안") open many explanations but are not answers; a bare "T" or "7" is.
const NOT_AN_ANSWER = /^(?:[(\[]\s*[\p{L}\p{N}]{1,3}\s*[)\]]|[\p{L}\p{N}]{1,3}[).:]|(?:모범\s*답안|정답|해설|풀이|채점\s*기준|answer|solution)\s*:?)$/iu;

/** Whether a short bold line that opens an explanation can stand in the answer key. */
export const isKeyAnswer = (text: string) => text.length > 0 && text.length <= 18 && !NOT_AN_ANSWER.test(text);

function answerKey(question: Question) {
  // A question with several multiple-choice parts lists each part's answer in order.
  if (question.choices.length) return question.choices.map(circled).join(" ");
  // A short bold answer that opens the explanation, e.g. "**O(2ⁿ)**", doubles as the key; part labels like "(1)" do not.
  const answer = question.answers[0];
  const firstBlock = answer && [...answer.children].find(child => !is(child, "summary"));
  const lead = firstBlock && is(firstBlock, "p") && firstBlock.firstElementChild && is(firstBlock.firstElementChild, "strong") && firstBlock.firstChild === firstBlock.firstElementChild ? firstBlock.firstElementChild : undefined;
  const text = lead?.textContent?.replace(/\s+/g, " ").trim() ?? "";
  return isKeyAnswer(text) ? text : "해설 참조";
}

function answerBlock(question: Question) {
  const block = el("div", "exam-a");
  const head = el("p", "exam-a-head");
  head.append(el("b", "exam-q-num", `${question.number}.`));
  if (question.topic) head.append(" ", el("span", "exam-a-topic", question.topic));
  head.append(el("span", "exam-a-key", `[정답] ${answerKey(question)}`));
  block.append(head);
  for (const answer of question.answers) {
    const body = el("div", "exam-a-body");
    body.append(...[...cleanClone(answer, "answers").childNodes]);
    // "**B. Insight** — 원본 정답 ②" reads "② Insight" on paper.
    const lead = body.querySelector("p:first-child > strong:first-child");
    if ((answer as HTMLElement).dataset.quizAnswer && lead?.firstChild?.nodeType === Node.TEXT_NODE) lead.firstChild.textContent = lead.firstChild.textContent!.replace(/^\s*([A-J])\.\s*/, (_, letter: string) => `${circled(letter)} `);
    block.append(body);
  }
  if (!question.answers.length) block.append(el("p", "exam-a-body muted", "이 문항은 해설이 없습니다."));
  return block;
}

function masthead(options: ExamPaperOptions, kind: "questions" | "answers", first: boolean) {
  const { main, sub } = subjectTitle(options.subjectName);
  const header = el("header", "exam-masthead");
  header.append(el("p", "exam-kicker", options.title));
  const row = el("div", "exam-title-row");
  row.append(el("span", "exam-period", `제 ${options.period ?? 1} 교시`));
  const title = el("h1", "exam-title", `${main} 영역`);
  if (sub) title.append(el("small", undefined, `(${sub})`));
  row.append(title, el("span", "exam-title-spacer"));
  header.append(row);
  const ids = el("div", "exam-id-row");
  if (kind === "questions") {
    const name = el("span", "exam-id-field");
    name.append(el("span", "exam-id-label", "성명"), el("span", "exam-id-box wide"));
    const number = el("span", "exam-id-field");
    number.append(el("span", "exam-id-label", "수험번호"));
    for (let index = 0; index < 5; index += 1) number.append(el("span", "exam-id-box"));
    number.append(el("span", "exam-id-dash", "–"));
    for (let index = 0; index < 7; index += 1) number.append(el("span", "exam-id-box"));
    ids.append(name, number);
  } else ids.append(el("span", "exam-answer-band", "정답과 해설"));
  ids.append(el("span", "exam-page-number", first ? "1" : ""));
  header.append(ids);
  return header;
}

function sectionLabel(text: string) {
  return el("p", "exam-section", text);
}

function columns(questions: Question[], render: (question: Question) => Element) {
  const body = el("div", "exam-columns");
  let section: string | undefined;
  for (const question of questions) {
    if (question.section && question.section !== section) body.append(sectionLabel(question.section));
    section = question.section;
    body.append(render(question));
  }
  return body;
}

function keyTable(questions: Question[]) {
  const wrapper = el("div", "exam-key");
  for (let start = 0; start < questions.length; start += 10) {
    const table = el("table");
    const numbers = el("tr");
    const answers = el("tr");
    numbers.append(el("th", undefined, "문항"));
    answers.append(el("th", undefined, "정답"));
    const slice = questions.slice(start, start + 10);
    for (const question of slice) { numbers.append(el("td", undefined, question.number)); answers.append(el("td", undefined, answerKey(question))); }
    for (let index = slice.length; index < 10; index += 1) { numbers.append(el("td")); answers.append(el("td")); }
    table.append(numbers, answers);
    wrapper.append(table);
  }
  return wrapper;
}

/** Builds the printable paper. Returns undefined when the page has no questions to print. */
export function buildExamPaper(prose: Element, options: ExamPaperOptions) {
  const questions = collectQuestions(prose);
  if (!questions.length) return undefined;
  const root = el("div", "exam-paper-root");
  root.setAttribute("aria-hidden", "true");
  if (options.mode !== "answers") {
    const paper = el("section", "exam-paper exam-paper-questions");
    paper.append(masthead(options, "questions", true), columns(questions, questionBlock), el("p", "exam-end", "※ 확인 사항: 답안을 모두 작성했는지 확인하시오."));
    root.append(paper);
  }
  if (options.mode !== "questions") {
    const paper = el("section", "exam-paper exam-paper-answers");
    paper.append(masthead(options, "answers", options.mode === "answers"), keyTable(questions), columns(questions, answerBlock));
    root.append(paper);
  }
  return root;
}
