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
  selected?: string;
  focused?: string;
  branch?: string;
  tab: string[];
  changedFiles: ChangedFiles;
  mode:
    | 'EDIT_CONTENT'
    | 'EDIT_PATH'
    | 'DEFAULT'
    | 'ADD_FILE'
    | 'ADD_DIR'
    | 'REMOVE_FILE'
    | 'REMOVE_DIR';
}
