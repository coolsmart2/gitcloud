import { Octokit } from '@octokit/rest';

export const selectUser = async ({ token }: { token: string }) => {
  const octokit = new Octokit({
    auth: token,
  });

  const { data } = await octokit.users.getAuthenticated();

  return data;
};
