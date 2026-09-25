import { ResourceIndex } from "@/components/lecture/ResourceIndex";
export const metadata = { title: "과제", description: "과목별 과제와 제출 안내를 확인하세요." };
export default function AssignmentsPage() { return <ResourceIndex kind="assignments" />; }
