export interface FileRequest {
  path: string;
  status: 'added' | 'modified' | 'removed';
  content?: string;
  url?: string;
}

export interface FileResponse {
  path: string;
  content: string;
}

export interface Tree {}
