import { Octokit } from '@octokit/rest';
import axios from 'axios';

export const selectUser = async ({ token }: { token: string }) => {
  const octokit = new Octokit({
    auth: token,
  });

  const { data } = await octokit.users.getAuthenticated();

  return data;
};
