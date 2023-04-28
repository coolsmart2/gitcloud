export interface User {
  username: string;
  avatarUrl: string;
  hasToken: boolean;
}

export interface Repo {
  id: number;
  name: string;
  private: boolean;
}
