import { defaultAxios } from '.';
import {
  FileResponse,
  RepoInfoResponse,
  TreeBlobResponse,
  UserResponse,
} from '../types/response.type';

export const postGitHubOAuthAPI = async ({
  code,
}: {
  code: string;
}): Promise<{ message: string; data: UserResponse }> => {
  const { data } = await defaultAxios.post('/github/oauth', { code });
  return data;
};

export const getGitHubReposAPI = async (): Promise<{
  message: string;
  data: RepoInfoResponse[];
}> => {
  const { data } = await defaultAxios.get('/github/repos');
  return data;
};

export const getGitHubRepoAPI = async ({
  reponame,
  branchname,
}: {
  reponame: string;
  branchname?: string;
}): Promise<{ message: string; data: TreeBlobResponse[] }> => {
  const { data } = await defaultAxios.get(
    `/github/repos/${reponame}${branchname ? `?ref=${branchname}` : ''}`
  );
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
}): Promise<{ message: string; data: FileResponse }> => {
  const { data } = await defaultAxios.get(
    `/github/repos/${reponame}/contents/${path}${ref ? `?ref=${ref}` : ''}`
  );
  return data;
};
