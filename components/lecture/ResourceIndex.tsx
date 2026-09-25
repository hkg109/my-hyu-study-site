import { readCollection, withoutBody } from "@/lib/content";
import { Footer } from "@/components/layout/Footer";
import { ResourceList } from "./ResourceList";

export function ResourceIndex({ kind }: { kind: "practice" | "assignments" }) {
  const docs = readCollection(kind);
  const practice = kind === "practice";
  return <div className="index-page"><header className="page-title"><span className="eyebrow">{practice ? "PAST EXAMS" : "ASSIGNMENTS"}</span><h1>{practice ? "족보" : "과제"}</h1><p>{practice ? "Markdown으로 정리한 시험 자료와 해설을 확인하세요." : "배운 내용을 연결해 과제를 완성합니다."}</p><span className="meta">{docs.length}개의 {practice ? "족보" : "과제"}</span></header><ResourceList docs={docs.map(withoutBody)} practice={practice} /><Footer /></div>;
}
