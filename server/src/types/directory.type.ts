export interface File {
  name: string;
  type: string;
  path: string;
  sha: string;
}

export interface Directory extends File {
  sub: (Directory | File)[];
}

const repo: (Directory | File)[] = [
  {
    name: 'src',
    type: 'dir',
    path: '',
    sha: '',
    sub: [
      {
        name: 'file.txt',
        type: 'file',
        path: '',
        sha: '',
      },
    ],
  },
  {
    name: 'file.txt',
    type: 'file',
    path: '',
    sha: '',
  },
];
