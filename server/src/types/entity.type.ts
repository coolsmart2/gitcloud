export interface User {
  id: number;
  provider_id: string;
  username: string;
  name: string;
  avatar_url: string;
  personal_access_token: string;
  current_branch: string;
  current_commit: string;
}
