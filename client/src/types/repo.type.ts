export interface ChangedFileState {
  state: 'added' | 'modified' | 'deleted';
  content: string;
}

export interface CachedFileState {
  content: string; // todo: 문자열이 아닌 버퍼로 변환 필요해 보임
}

export interface DirectoryInfo {
  path: string;
  name: string;
  children: (FileInfo | DirectoryInfo)[];
}

export interface FileInfo {
  path: string;
  name: string;
}
