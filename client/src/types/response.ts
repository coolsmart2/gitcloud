import { File, Tree } from '.';

export interface RepoExplorerResponse {
  message: string;
  data: Tree[];
}

export interface RepoFileResponse {
  message: string;
  data: File;
}
