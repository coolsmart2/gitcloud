import { File, Tree } from '.';

export interface RepoTreeResponse {
  message: string;
  data: Tree[];
}

export interface RepoFileResponse {
  message: string;
  data: File;
}
