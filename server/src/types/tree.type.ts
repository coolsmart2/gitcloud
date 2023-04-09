export interface DefaultFile {
  name: string;
  path: string;
  type: 'file' | 'dir' | 'submodule' | 'symlink';
  sha?: string;
}

export interface File extends DefaultFile {
  content?: string;
}

export interface Directory extends DefaultFile {
  tree: (Directory | File)[];
}
