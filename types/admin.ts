// Which password an exam uses in file mode (written to its frontmatter as accessKey).
export type AccessChoice = { mode: "default" } | { mode: "key"; accessKey: string };
