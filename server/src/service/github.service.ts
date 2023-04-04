import { RequestError } from '@octokit/request-error';
import { Octokit } from '@octokit/rest';
import { GithubError, ServerError } from '../constants/errors';
import { insertBranch, removeBranch } from '../octokits/branch.octokit';
import {
  insertFileContents,
  updateFileContents,
} from '../octokits/commit.octokit';
import { selectContent } from '../octokits/content.octokit';
import {
  insertRepo,
  removeRepo,
  selectRepo,
  selectRepos,
} from '../octokits/repo.octokit';

export const findAllRepo = async (token: string) => {
  const octokit = new Octokit({
    auth: token,
  });
  try {
    const repos = await selectRepos({ octokit });
    return repos;
  } catch (error) {
    if (error instanceof RequestError) {
      throw new GithubError();
    }
    throw new ServerError();
  }
};

export const findRepo = async ({
  token,
  owner,
  repoName,
  ref,
}: {
  token: string;
  owner: string;
  repoName: string;
  ref?: string;
}) => {
  try {
    const repoStructure = await selectRepo({
      octokit: new Octokit({ auth: token }),
      owner,
      repoName,
      ref,
    });
    return repoStructure;
  } catch (error) {
    console.log('findRepo: ' + error);
    if (error instanceof RequestError) {
      throw new GithubError();
    }
    throw new ServerError();
  }
};

export const addRepo = async ({
  token,
  repoName,
  isPrivate,
}: {
  token: string;
  repoName: string;
  isPrivate: boolean;
}) => {
  try {
    await insertRepo({
      octokit: new Octokit({ auth: token }),
      repoName,
      isPrivate,
    });
  } catch (error) {
    if (error instanceof RequestError) {
      throw new GithubError();
    }
    throw new ServerError();
  }
};

export const deleteRepo = async ({
  token,
  repoName,
}: {
  token: string;
  repoName: string;
}) => {
  try {
    await removeRepo({ octokit: new Octokit({ auth: token }), repoName });
  } catch (error) {
    if (error instanceof RequestError) {
      throw new GithubError();
    }
    throw new ServerError();
  }
};

export const findContent = async ({
  token,
  owner,
  repoName,
  path,
  ref,
}: {
  token: string;
  owner: string;
  repoName: string;
  path: string;
  ref?: string;
}) => {
  try {
    const content = await selectContent({
      octokit: new Octokit({ auth: token }),
      owner,
      repoName,
      path,
      ref,
    });

    return content;
  } catch (error) {
    if (error instanceof RequestError) {
      throw new GithubError();
    }
    throw new ServerError();
  }
};

export const addContent = async ({
  token,
  owner,
  repoName,
  path,
  content,
  branchName,
  message,
}: {
  token: string;
  owner: string;
  repoName: string;
  path: string;
  content: string;
  branchName?: string;
  message?: string;
}) => {
  try {
    await insertFileContents({
      octokit: new Octokit({ auth: token }),
      owner,
      repoName,
      path,
      content,
      branchName,
      message,
    });
  } catch (error) {
    if (error instanceof RequestError) {
      throw new GithubError();
    }
    throw new ServerError();
  }
};

export const modifyContent = async ({
  token,
  owner,
  repoName,
  path,
  content,
  blobSha,
  message,
}: {
  token: string;
  owner: string;
  repoName: string;
  path: string;
  content: string;
  blobSha: string;
  message?: string;
}) => {
  try {
    await updateFileContents({
      octokit: new Octokit({ auth: token }),
      owner,
      repoName,
      path,
      content,
      sha: blobSha,
      message,
    });
  } catch (error) {
    if (error instanceof RequestError) {
      throw new GithubError();
    }
    throw new ServerError();
  }
};

export const addBranch = async ({
  token,
  owner,
  repoName,
  branchName,
  commitSha,
}: {
  token: string;
  owner: string;
  repoName: string;
  branchName: string;
  commitSha: string;
}) => {
  try {
    const lastCommitSha = await insertBranch({
      octokit: new Octokit({ auth: token }),
      owner,
      repoName,
      branchName,
      commitSha,
    });

    return lastCommitSha;
  } catch (error) {
    if (error instanceof RequestError) {
      throw new GithubError();
    }
    throw new ServerError();
  }
};

export const deleteBranch = async ({
  token,
  owner,
  repoName,
  branchName,
}: {
  token: string;
  owner: string;
  repoName: string;
  branchName: string;
}) => {
  try {
    await removeBranch({
      octokit: new Octokit({ auth: token }),
      owner,
      repoName,
      branchName,
    });
  } catch (error) {
    if (error instanceof RequestError) {
      throw new GithubError();
    }
    throw new ServerError();
  }
};
