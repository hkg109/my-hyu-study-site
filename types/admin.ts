// Shapes returned by the admin access APIs. They carry variable names and booleans, never password values.

export interface AccessKeyStatus { accessKey: string; envName: string; configuredLocally: boolean; documents: number }

export interface PracticeAccessOverview {
  defaultEnvName: string;
  defaultConfiguredLocally: boolean;
  authSecretConfiguredLocally: boolean;
  keys: AccessKeyStatus[];
  candidate?: AccessKeyStatus;
}

export interface PracticeDocumentAccess {
  mode: "default" | "key";
  accessKey?: string;
  envName: string;
  configuredLocally: boolean;
  /** Why the exam's current frontmatter can't be used (it stays locked until saved again). */
  problem?: string;
}

export type AccessChoice = { mode: "default" } | { mode: "key"; accessKey: string };
