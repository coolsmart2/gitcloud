import { defaultAxios } from '.';

export const postGitHubOAuthAPI = async ({ code }: { code: string }) => {
  const { data } = await defaultAxios.post('/github/oauth', { code });
  return data;
};

export const getGitHubReposAPI = async () => {
  const { data } = await defaultAxios.get('/github/repos');
  return data;
};

export const getGitHubRepoAPI = async ({ reponame }: { reponame: string }) => {
  const { data } = await defaultAxios.get(`/github/repos/${reponame}`);
  return data;
};
