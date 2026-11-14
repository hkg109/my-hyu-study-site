// Where lecture notes and exams live: the files in content/ (default) or Supabase (CONTENT_SOURCE=db).
export const contentFromDb = () => process.env.CONTENT_SOURCE === "db";
