import { Octokit } from '@octokit/rest';

export const insertFileContents = async ({
  octokit,
  owner,
  repo,
  path,
  message = new Date().toISOString(),
  content,
}: {
  octokit: Octokit;
  owner: string;
  repo: string;
  path: string;
  message?: string;
  content: string;
}) => {
  try {
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const updateFileContents = async ({
  octokit,
  owner,
  repo,
  path,
  message = new Date().toISOString(),
  content,
  sha,
}: {
  octokit: Octokit;
  owner: string;
  repo: string;
  path: string;
  message?: string;
  content: string;
  sha: string;
}) => {
  try {
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      sha,
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const selectListCommits = async ({
  octokit,
  owner,
  repo,
}: {
  octokit: Octokit;
  owner: string;
  repo: string;
}) => {
  try {
    const { data } = await octokit.repos.listCommits({
      owner,
      repo,
    });
    return data;
  } catch (error) {
    return undefined;
  }
};
