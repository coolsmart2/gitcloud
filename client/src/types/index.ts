export interface User {
  username: string;
  avatarUrl: string;
  hasToken: boolean;
}

export interface RepoInfo {
  id: number;
  name: string;
  private: boolean;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
}

export interface TreeBlob {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size: number;
  url: string;
  tree?: TreeBlob[];
}

// export interface Repo {
//   name: string;
//   tree: TreeBlob[];
// }

export interface File {
  name: string;
  path: string;
  sha: string;
  content: string;
  encoding: string;
}

interface OpenedFiles {
  [path: string]: File & {
    isChanged: boolean;
  };
}

interface Workspace {
  currPath: string;
  tabPaths: string[];
  changedFiles: OpenedFiles;
  branch?: string;
}
