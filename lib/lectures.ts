import { getDocument, readCollection, withoutBody } from "./content";
import { readCatalog } from "./catalog";
import { listSubjects } from "./subjects";

export const getAllLectures = () => readCollection("lectures").map(withoutBody);
export const getAllExams = () => readCollection("practice").map(withoutBody);
export const getLectureBySlug = (slug: string[]) => getDocument("lectures", slug);
export const getSubjects = () => listSubjects(readCatalog(), getAllLectures(), getAllExams());
export function getPrevNextLecture(slug: string[]) {
  const lectures = getAllLectures();
  const index = lectures.findIndex(lecture => lecture.slug.join("/") === slug.join("/"));
  return index < 0 ? { prev: undefined, next: undefined } : { prev: lectures[index - 1], next: lectures[index + 1] };
}
