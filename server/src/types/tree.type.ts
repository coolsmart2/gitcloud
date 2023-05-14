export interface FileRequest {
  path: string;
  originalPath: string;
  state: 'added' | 'deleted' | 'renamed' | 'modified';
  content?: string;
}

export interface FileResponse {
  path: string;
  content: string;
}

export interface TreeBlob {
  path?: string | undefined;
  mode?: string | undefined;
  type?: string | undefined;
  sha?: string | undefined;
  size?: number | undefined;
  url?: string | undefined;
  tree?: TreeBlob[];
}
