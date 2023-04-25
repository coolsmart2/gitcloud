import { Octokit } from '@octokit/rest';
import { Directory, File } from '../types/tree.type';

/**
 * 레포지토리 생성
 */
export const insertRepo = async ({
  token,
  reponame,
  isPrivate,
}: {
  token: string;
  reponame: string;
  isPrivate: boolean;
}) => {
  const octokit = new Octokit({
    auth: token,
  });
  await octokit.repos.createForAuthenticatedUser({
    name: reponame,
    private: isPrivate,
    auto_init: true,
    description: new Date().toString(),
  });
};

/**
 * 레포지토리 삭제
 */
export const removeRepo = async ({
  token,
  username,
  reponame,
}: {
  token: string;
  username: string;
  reponame: string;
}) => {
  const octokit = new Octokit({
    auth: token,
  });
  await octokit.repos.delete({
    owner: username,
    repo: reponame,
  });
};

/**
 * 전체 레포지토리 목록 조회
 */
export const selectRepos = async ({ token }: { token: string }) => {
  const octokit = new Octokit({
    auth: token,
  });

  const { data } = await octokit.repos.listForAuthenticatedUser();
  const repositories = data.map(repo => ({
    name: repo.name,
    private: repo.private,
  }));

  return repositories;
};

/**
 * 레포지토리 조회
 */
export const selectRepo = async ({
  token,
  username,
  reponame,
  path = '',
  ref,
}: {
  token: string;
  username: string;
  reponame: string;
  path?: string;
  ref?: string;
}) => {
  const octokit = new Octokit({
    auth: token,
  });

  const { data } = await octokit.repos.getContent({
    owner: username,
    repo: reponame,
    path,
    ref,
  });

  const root = !Array.isArray(data) ? [data] : data;

  const structure: (Directory | File)[] = await Promise.all(
    root.map(async sub => {
      if (sub.type === 'dir') {
        return {
          name: sub.name,
          type: sub.type,
          path: sub.path,
          sha: sub.sha,
          tree: await selectRepo({
            token,
            username,
            reponame,
            path: `${path}/${sub.name}`,
            ref,
          }),
        };
      } else {
        return {
          name: sub.name,
          type: sub.type,
          path: sub.path,
          sha: sub.sha,
        };
      }
    })
  );

  return structure;
};

/**
 * 파일 조회 (폴더 제외)
 */
export const selectFileContent = async ({
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
  const octokit = new Octokit({
    auth: token,
  });
  const { data } = await octokit.repos.getContent({
    owner: username,
    repo: reponame,
    path,
    ref,
  });

  if ('content' in data && 'encoding' in data) {
    const content = {
      name: data.name,
      path: data.path,
      sha: data.sha,
      content: data.content,
      encoding: data.encoding,
    };

    return content;
  }

  throw new Error('존재하지 않는 파일입니다.');
};

export const selectListBranchs = async ({
  token,
  username,
  reponame,
}: {
  token: string;
  username: string;
  reponame: string;
}) => {
  const octokit = new Octokit({
    auth: token,
  });
  const { data } = await octokit.repos.listBranches({
    owner: username,
    repo: reponame,
  });

  const branches = data.map(branch => ({
    name: branch.name,
    sha: branch.commit.sha,
  }));

  return branches;
};

/**
 * 브랜치 커밋 리스트 조회
 */
export const selectListCommits = async ({
  token,
  username,
  reponame,
  commitSHA,
}: {
  token: string;
  username: string;
  reponame: string;
  commitSHA?: string;
}) => {
  const octokit = new Octokit({
    auth: token,
  });

  const { data } = await octokit.repos.listCommits({
    owner: username,
    repo: reponame,
    sha: commitSHA,
  });

  const commits = data.map(commit => ({
    sha: commit.sha,
    name: commit.commit.message,
    parents: commit.parents.map(parent => ({
      sha: parent.sha,
    })),
  }));

  return commits;
};
