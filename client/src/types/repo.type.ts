export interface ChangedFileDirectoryState {
  state: 'added' | 'modified' | 'deleted' | 'renamed';
  content?: string;
  originalPath?: string;
}

export interface CachedFileState {
  content: string; // todo: 문자열이 아닌 버퍼로 변환 필요해 보임
}

export type FileDirectoryState = 'default' | 'rename';

export interface FileInfo {
  path: string;
  originalPath: string;
  state: FileDirectoryState;
  name: string;
}

export interface DirectoryInfo extends FileInfo {
  children: (DirectoryInfo | FileInfo | NewFileDirectoryInfo)[];
}

export interface NewFileDirectoryInfo {
  path: string;
  type: 'file' | 'directory';
}

export type Explorer = (DirectoryInfo | FileInfo | NewFileDirectoryInfo)[];
