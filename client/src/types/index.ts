export interface File {
  name: string;
  path: string;
  sha: string;
  content: string;
  encoding: string;
}

export interface ChangedFile {
  content: string;
  isChanged: boolean;
}

export interface ChangedFiles {
  [path: string]: ChangedFile;
}

export interface Workspace {
  currPath?: string;
  currBranch?: string;
  tabPaths?: string[];
  changedFiles?: ChangedFiles;
}
