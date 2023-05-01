export interface File {
  name: string;
  path: string;
  sha: string;
  content: string;
  encoding: string;
}

export interface ChangedFile {
  changedContent: string;
  originalContent: string;
}

export interface ChangedFiles {
  [path: string]: ChangedFile;
}

export interface Workspace {
  currPath?: string;
  currBranch?: string;
  tab: string[];
  changedFiles: ChangedFiles;
}
