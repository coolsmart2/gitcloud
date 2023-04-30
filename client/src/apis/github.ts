import { defaultAxios } from '.';
import { RepoExplorerResponse, RepoFileResponse } from '../types/response';

export const postGitHubOAuthAPI = async ({ code }: { code: string }) => {
  const { data } = await defaultAxios.post('/github/oauth', { code });
  return data;
};

export const getGitHubReposAPI = async () => {
  const { data } = await defaultAxios.get('/github/repos');
  return data;
};

export const getGitHubRepoAPI = async ({
  reponame,
}: {
  reponame: string;
}): Promise<RepoExplorerResponse> => {
  const { data } = await defaultAxios.get(`/github/repos/${reponame}`);
  return data;
};

export const getGitHubFileAPI = async ({
  reponame,
  path,
  ref,
}: {
  reponame: string;
  path: string;
  ref?: string;
}): Promise<RepoFileResponse> => {
  const { data } = await defaultAxios.get(
    `/github/repos/${reponame}/contents/${path}${ref ? `?ref=${ref}` : ''}`
  );
  return data;
};
