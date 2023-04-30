import { selectorFamily } from 'recoil';
import { File, Tree, User } from '../types';
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

export const repoExplorerSelector = selectorFamily<Tree[], string>({
  key: 'repoExplorerSelector',
  get: (reponame: string) => async () => {
    const { data } = await getGitHubRepoAPI({ reponame });
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
