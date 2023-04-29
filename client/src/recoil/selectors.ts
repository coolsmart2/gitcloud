import { selector, selectorFamily } from 'recoil';
import { Tree, User } from '../types';
import { getGitHubRepoAPI, postGitHubOAuthAPI } from '../apis/github';

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
    const { data: repo } = await getGitHubRepoAPI({ reponame });
    return repo;
  },
});
