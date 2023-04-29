export interface User {
  username: string;
  avatarUrl: string;
  hasToken: boolean;
}

export interface RepoInfo {
  id: number;
  name: string;
  private: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tree {
  name: string;
  type: 'file' | 'dir' | 'submodule' | 'symlink';
  path: string;
  sha?: string;
  tree?: Tree[];
}

export interface Repo {
  name: string;
  tree: Tree[];
}
