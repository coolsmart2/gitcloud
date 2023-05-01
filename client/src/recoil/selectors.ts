import { selectorFamily } from 'recoil';
import {
  getGitHubFileAPI,
  getGitHubRepoAPI,
  postGitHubOAuthAPI,
} from '../apis/github';
import {
  FileResponse,
  TreeBlobResponse,
  UserResponse,
} from '../types/response';

export const userSelector = selectorFamily<UserResponse, string>({
  key: 'userSelector',
  get: (code: string) => {
    return async () => {
      const { data } = await postGitHubOAuthAPI({ code });
      return data;
    };
  },
});

export const repoExplorerSelector = selectorFamily<
  TreeBlobResponse[],
  { reponame: string; branchname?: string }
>({
  key: 'repoExplorerSelector',
  get:
    ({ reponame, branchname }) =>
    async () => {
      const { data } = await getGitHubRepoAPI({ reponame, branchname });
      return data;
    },
});

export const repoFileSelector = selectorFamily<
  FileResponse,
  { reponame: string; path: string; ref?: string }
>({
  key: 'repoFileSelector',
  get:
    ({ reponame, path, ref }) =>
    async () => {
      const { data } = await getGitHubFileAPI({ reponame, path, ref });
      return data;
    },
});
