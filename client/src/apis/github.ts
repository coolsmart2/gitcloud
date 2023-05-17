import { defaultAxios } from '.';
import { Tree } from '../types/repo.type';
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
  ref,
}: {
  reponame: string;
  branchname: string;
  ref?: string;
}): Promise<{ message: string; data: TreeBlobResponse[] }> => {
  const { data } = await defaultAxios.get(
    `/github/repos/${reponame}/branchs/${branchname}${ref ? `?ref=${ref}` : ''}`
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

export const postGitHubCommitAPI = async ({
  reponame,
  ref,
  tree,
  message,
}: {
  reponame: string;
  ref: string;
  tree: Tree;
  message?: string;
}) => {
  const { data } = await defaultAxios.post(
    `/github/repos/${reponame}/branchs/${ref}/commits`,
    { message, tree }
  );
  return data;
};

export const postGitHubRepoAPI = async ({
  reponame,
  isPrivate,
}: {
  reponame: string;
  isPrivate: boolean;
}): Promise<{ message: string; data: RepoInfoResponse }> => {
  const { data } = await defaultAxios.post(`/github/repos/${reponame}`, {
    isPrivate,
  });
  return data;
};

export const deleteGitHubRepoAPI = async ({
  reponame,
}: {
  reponame: string;
}) => {
  const { data } = await defaultAxios.delete(`/github/repos/${reponame}`);

  return data;
};

export const getGitHubCommitListAPI = async ({
  reponame,
}: {
  reponame: string;
}) => {
  const { data } = await defaultAxios.get(`/github/repos/${reponame}/commits`);

  return data;
};
