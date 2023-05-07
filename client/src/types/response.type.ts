export interface DefaultResponse {
  message: string;
}

export interface UserResponse {
  username: string;
  avatarUrl: string;
  hasToken: boolean;
}

export interface RepoInfoResponse {
  id: number;
  name: string;
  private: boolean;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
}

export interface TreeBlobResponse {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size: number;
  url: string;
  tree?: TreeBlobResponse[];
}

export interface FileResponse {
  name: string;
  path: string;
  sha: string;
  content: string;
  encoding: string;
}
