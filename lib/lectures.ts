import { getDocument, readCollection, withoutBody } from "./content";
import { readCatalog } from "./catalog";
import { listSubjects } from "./subjects";
import type { LectureMeta, NavDocument } from "@/types/content";

export const getAllLectures = () => readCollection("lectures").map(withoutBody);
export const getAllExams = () => readCollection("practice").map(withoutBody);
export const getLectureBySlug = (slug: string[]) => getDocument("lectures", slug);
export const toNavDocument = ({ title, path, order, slug, gradeId, semesterId, subjectId }: LectureMeta): NavDocument => ({ title, path, order, slug, gradeId, semesterId, subjectId });
export const getSubjects = () => listSubjects(readCatalog(), getAllLectures(), getAllExams());
export function getPrevNextLecture(slug: string[]) {
  const lectures = getAllLectures();
  const index = lectures.findIndex(lecture => lecture.slug.join("/") === slug.join("/"));
  return index < 0 ? { prev: undefined, next: undefined } : { prev: lectures[index - 1], next: lectures[index + 1] };
}
