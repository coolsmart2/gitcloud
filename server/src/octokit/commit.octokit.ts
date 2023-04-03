import { RequestError } from '@octokit/request-error';
import { Octokit } from '@octokit/rest';
import {
  BadCredentialsError,
  NotFoundError,
  RequiresAuthenticationError,
} from '../constant/error/octokit.error';
import {
  BAD_CREDENTIALS,
  REQUIRES_AUTHENTICATION,
  NOT_FOUND,
} from '../constant/error/octokit.message';

export const insertFileContents = async ({
  octokit,
  owner,
  repoName,
  path,
  content,
  message = new Date().toLocaleString('ko-KR', { timeZone: 'UTC' }),
  branchName,
}: {
  octokit: Octokit;
  owner: string;
  repoName: string;
  path: string;
  content: string;
  message?: string;
  branchName?: string;
}) => {
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo: repoName,
    path,
    message,
    content: Buffer.from(content).toString('base64'),
    branch: branchName,
  });
};

export const updateFileContents = async ({
  octokit,
  owner,
  repoName,
  path,
  content,
  sha,
  message = new Date().toLocaleString('ko-KR', { timeZone: 'UTC' }),
}: {
  octokit: Octokit;
  owner: string;
  repoName: string;
  path: string;
  content: string;
  sha: string;
  message?: string;
}) => {
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo: repoName,
    path,
    message,
    content: Buffer.from(content).toString('base64'),
    sha,
  });
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

export const selectCommit = async ({
  octokit,
  owner,
  repo,
  ref,
}: {
  octokit: Octokit;
  owner: string;
  repo: string;
  ref: string;
}) => {
  try {
    const { data } = await octokit.repos.getCommit({
      owner,
      repo,
      ref,
    });
    return data;
  } catch (error) {
    return undefined;
  }
};
