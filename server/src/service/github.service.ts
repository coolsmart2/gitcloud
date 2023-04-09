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
  selectListCommits,
} from '../octokits/repos.octokit';

/**
 * 레포지토리 생성
 */
export const addRepo = async ({
  token,
  reponame,
  isPrivate,
}: {
  token: string;
  reponame: string;
  isPrivate: boolean;
}) => {
  try {
    await insertRepo({
      octokit: new Octokit({ auth: token }),
      reponame,
      isPrivate,
    });
  } catch (error) {
    if (error instanceof RequestError) {
      throw new GithubError();
    }
    throw new ServerError();
  }
};

/**
 * 레포지토리 삭제
 */
export const deleteRepo = async ({
  token,
  username,
  reponame,
}: {
  token: string;
  username: string;
  reponame: string;
}) => {
  try {
    await removeRepo({
      octokit: new Octokit({ auth: token }),
      username,
      reponame,
    });
  } catch (error) {
    if (error instanceof RequestError) {
      throw new GithubError();
    }
    throw new ServerError();
  }
};

/**
 * 전체 레포지토리 목록 조회
 */
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

/**
 * 레포지토리 조회
 */
export const findRepo = async ({
  token,
  username,
  reponame,
  ref,
}: {
  token: string;
  username: string;
  reponame: string;
  ref?: string;
}) => {
  try {
    const repoStructure = await selectRepo({
      octokit: new Octokit({ auth: token }),
      username,
      reponame,
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

/**
 * 파일 조회 (폴더 제외)
 */
export const findFileContent = async ({
  token,
  username,
  reponame,
  path,
  ref,
}: {
  token: string;
  username: string;
  reponame: string;
  path: string;
  ref?: string;
}) => {
  try {
    const content = await selectFileContent({
      octokit: new Octokit({ auth: token }),
      username,
      reponame,
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

/**
 * 브랜치 커밋 리스트 조회
 */
export const findListCommits = async ({
  token,
  username,
  reponame,
  branch,
}: {
  token: string;
  username: string;
  reponame: string;
  branch?: string;
}) => {
  try {
    const commits = await selectListCommits({
      octokit: new Octokit({ auth: token }),
      username,
      reponame,
      branchname: branch,
    });

    return commits;
  } catch (error) {
    if (error instanceof RequestError) {
      throw new GithubError();
    }
    throw new ServerError();
  }
};

/**
 * 브랜치 생성
 */
export const addBranch = async ({
  token,
  username,
  reponame,
  branchname,
  commitSHA,
}: {
  token: string;
  username: string;
  reponame: string;
  branchname: string;
  commitSHA: string;
}) => {
  try {
    const lastCommitSHA = await insertBranch({
      octokit: new Octokit({ auth: token }),
      username,
      reponame,
      branchname,
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

/**
 * 브랜치 삭제
 */
export const deleteBranch = async ({
  token,
  username,
  reponame,
  branchname,
}: {
  token: string;
  username: string;
  reponame: string;
  branchname: string;
}) => {
  try {
    await removeBranch({
      octokit: new Octokit({ auth: token }),
      username,
      reponame,
      branchname,
    });
  } catch (error) {
    if (error instanceof RequestError) {
      throw new GithubError();
    }
    throw new ServerError();
  }
};
