import { RequestError } from '@octokit/request-error';
import {
  GithubBadCredentialsError,
  GithubError,
  ServerError,
} from '../constants/errors';
import * as GithubOctokit from '../octokits/git.octokit';
import * as ReposOctokit from '../octokits/repos.octokit';
import * as UsersOctokit from '../octokits/users.octokit';
import { Directory, File } from '../types/tree.type';
import { Commit } from '../types/commit.type';

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
    await ReposOctokit.insertRepo({
      token,
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
    await ReposOctokit.removeRepo({
      token,
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
    const repos = await ReposOctokit.selectRepos({ token });

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
    const repoStructure = await ReposOctokit.selectRepo({
      token,
      username,
      reponame,
      ref,
    });
    return repoStructure;
  } catch (error) {
    if (error instanceof RequestError) {
      if (error.message === 'This repository is empty.') {
        return [];
      }
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
    const content = await ReposOctokit.selectFileContent({
      token,
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
}: {
  token: string;
  username: string;
  reponame: string;
}) => {
  try {
    const branchs = await ReposOctokit.selectListBranchs({
      token,
      username,
      reponame,
    });

    const totalCommits: Record<string, Commit[]> = {};

    await Promise.all(
      branchs.map(async ({ name, sha }) => {
        const commits = await ReposOctokit.selectListCommits({
          token,
          username,
          reponame,
          commitSHA: sha,
        });
        totalCommits[name] = commits;
      })
    );

    return totalCommits;
  } catch (error) {
    if (error instanceof RequestError) {
      if (error.message === 'Git Repository is empty.') {
        return [];
      }
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
    const lastCommitSHA = await GithubOctokit.insertBranch({
      token,
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
    await GithubOctokit.removeBranch({
      token,
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

/**
 * 트리 커밋
 */
export const addCommit = async ({
  token,
  username,
  reponame,
  branchname,
  tree,
  message,
}: {
  token: string;
  username: string;
  reponame: string;
  branchname: string;
  tree: (File | Directory)[];
  message?: string;
}) => {
  try {
    const parentSHA = await GithubOctokit.selectBranch({
      token,
      username,
      reponame,
      branchname,
    });

    const treeSHA = await GithubOctokit.insertTree({
      token,
      username,
      reponame,
      tree,
    });

    const commitSHA = await GithubOctokit.insertCommit({
      token,
      username,
      reponame,
      parentSHA,
      treeSHA,
      message,
    });

    await GithubOctokit.updateRef({
      token,
      username,
      reponame,
      branchname,
      commitSHA,
    });
  } catch (error) {
    if (error instanceof RequestError) {
      throw new GithubError();
    }
    throw new ServerError();
  }
};

export const findUser = async ({ token }: { token: string }) => {
  try {
    const user = await UsersOctokit.selectUser({ token });
    return user;
  } catch (error) {
    if (error instanceof RequestError) {
      console.log(error);
      if (error.message === 'Bad credentials.') {
        throw new GithubBadCredentialsError();
      }
      throw new GithubError();
    }
    throw new ServerError();
  }
};
