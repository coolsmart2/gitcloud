export interface File {
  name: string;
  path: string;
  type: 'file' | 'dir' | 'submodule' | 'symlink';
  content?: string;
  sha?: string;
}

export interface Directory extends File {
  tree: (Directory | File)[];
}
