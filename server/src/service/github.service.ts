import { RequestError } from '@octokit/request-error';
import { Octokit } from '@octokit/rest';
import { GithubError, ServerError } from '../constants/errors';
import { insertBranch, removeBranch } from '../octokits/git.octokit';
import {
  insertRepo,
  removeRepo,
  selectRepo,
  selectRepos,
  selectFileContent,
  insertFileContent,
  updateFileContent,
  deleteFileContent,
} from '../octokits/repos.octokit';

export const findRepos = async (token: string) => {
  try {
    const repos = await selectRepos({ octokit: new Octokit({ auth: token }) });

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
    const content = await selectFileContent({
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
    await insertFileContent({
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
  blobSHA,
  message,
}: {
  token: string;
  owner: string;
  repoName: string;
  path: string;
  content: string;
  blobSHA: string;
  message?: string;
}) => {
  try {
    await updateFileContent({
      octokit: new Octokit({ auth: token }),
      owner,
      repoName,
      path,
      content,
      sha: blobSHA,
      message,
    });
  } catch (error) {
    if (error instanceof RequestError) {
      throw new GithubError();
    }
    throw new ServerError();
  }
};

export const deleteContent = async ({
  token,
  owner,
  repoName,
  path,
  blobSHA,
  message,
}: {
  token: string;
  owner: string;
  repoName: string;
  path: string;
  blobSHA: string;
  message?: string;
}) => {
  try {
    await deleteFileContent({
      octokit: new Octokit({ auth: token }),
      owner,
      repoName,
      path,
      sha: blobSHA,
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
  commitSHA,
}: {
  token: string;
  owner: string;
  repoName: string;
  branchName: string;
  commitSHA: string;
}) => {
  try {
    const lastCommitSHA = await insertBranch({
      octokit: new Octokit({ auth: token }),
      owner,
      repoName,
      branchName,
      commitSHA,
    });

    return lastCommitSHA;
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
