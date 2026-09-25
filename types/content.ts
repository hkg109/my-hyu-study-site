export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type ContentKind = "lectures" | "practice" | "assignments";

export interface LectureFrontmatter {
  title: string;
  description: string;
  week: number;
  order: number;
  duration?: number;
  difficulty?: Difficulty;
  tags?: string[];
  objectives?: string[];
  published: boolean;
  due?: string;
  submissionUrl?: string;
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
  week: number;
  kind: ContentKind;
  location?: string;
}

export interface CatalogSubject { id: string; name: string; order: number; legacySource?: "weeks" }
export interface CatalogSemester { id: string; name: string; order: number; subjects: CatalogSubject[] }
export interface CatalogGrade { id: string; name: string; order: number; semesters: CatalogSemester[] }
export interface AcademicCatalog { grades: CatalogGrade[] }
