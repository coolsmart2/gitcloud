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
  changedPath?: string; // 파일명을 변경한 경우
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
