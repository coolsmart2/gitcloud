import { selectorFamily } from 'recoil';
import { File, TreeBlob, User } from '../types';
import {
  getGitHubFileAPI,
  getGitHubRepoAPI,
  postGitHubOAuthAPI,
} from '../apis/github';

export const userSelector = selectorFamily<
  { message: string; data: User },
  string
>({
  key: 'userSelector',
  get: (code: string) => {
    return async () => {
      const { data } = await postGitHubOAuthAPI({ code });
      return data;
    };
  },
});

export const repoExplorerSelector = selectorFamily<
  TreeBlob[],
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
  File,
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
