export interface Commit {
  name: string;
  sha: string;
  parents: {
    sha: string;
  }[];
}
