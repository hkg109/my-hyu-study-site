export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type ContentKind = "lectures" | "practice";

export interface LectureFrontmatter {
  title: string;
  description: string;
  order: number;
  duration?: number;
  difficulty?: Difficulty;
  tags?: string[];
  objectives?: string[];
  published: boolean;
  gradeId?: string;
  gradeName?: string;
  semesterId?: string;
  semesterName?: string;
  subjectId?: string;
  subjectName?: string;
}

export interface LectureMeta extends LectureFrontmatter {
  slug: string[];
  path: string;
  kind: ContentKind;
}

/** The fields the site menu reads. Every page carries this list, so it holds nothing else. */
export type NavDocument = Pick<LectureMeta, "title" | "path" | "order" | "slug" | "gradeId" | "semesterId" | "subjectId">;

export interface ContentDocument extends LectureMeta {
  content: string;
  format?: "md" | "mdx";
}

export interface Heading { id: string; text: string; level: number }
export interface SearchEntry {
  title: string;
  description: string;
  tags: string[];
  body: string;
  path: string;
  kind: ContentKind;
  location?: string;
}

export interface CatalogSubject { id: string; name: string; order: number }
export interface CatalogSemester { id: string; name: string; order: number; subjects: CatalogSubject[] }
export interface CatalogGrade { id: string; name: string; order: number; semesters: CatalogSemester[] }
export interface AcademicCatalog { grades: CatalogGrade[] }
