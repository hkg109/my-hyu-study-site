import { getDocument, readCollection, withoutBody } from "./content";

export const getAllLectures = () => readCollection("lectures").map(withoutBody);
export const getLectureBySlug = (slug: string[]) => getDocument("lectures", slug);
export function getPrevNextLecture(slug: string[]) {
  const lectures = getAllLectures();
  const index = lectures.findIndex(lecture => lecture.slug.join("/") === slug.join("/"));
  return index < 0 ? { prev: undefined, next: undefined } : { prev: lectures[index - 1], next: lectures[index + 1] };
}
