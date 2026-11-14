import { getCatalog, getCollection, getDocument } from "./content";
import { listSubjects } from "./subjects";
import type { LectureMeta, NavDocument } from "@/types/content";

export const getAllLectures = () => getCollection("lectures");
export const getAllExams = () => getCollection("practice");
export const getLectureBySlug = (slug: string[]) => getDocument("lectures", slug);
export const toNavDocument = ({ title, path, order, slug, gradeId, semesterId, subjectId }: LectureMeta): NavDocument => ({ title, path, order, slug, gradeId, semesterId, subjectId });
export async function getSubjects() {
  const [catalog, lectures, exams] = await Promise.all([getCatalog(), getAllLectures(), getAllExams()]);
  return listSubjects(catalog, lectures, exams);
}
export async function getPrevNextLecture(slug: string[]) {
  const lectures = await getAllLectures();
  const index = lectures.findIndex(lecture => lecture.slug.join("/") === slug.join("/"));
  return index < 0 ? { prev: undefined, next: undefined } : { prev: lectures[index - 1], next: lectures[index + 1] };
}
