import { Octokit } from '@octokit/rest';

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
  const { data } = await octokit.repos.createForAuthenticatedUser({
    name: reponame,
    private: isPrivate,
    auto_init: true,
    description: new Date().toString(),
  });

  return {
    id: data.id,
    name: data.name,
    private: data.private,
    defaultBranch: data.default_branch,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
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

  const { data } = await octokit.repos.listForAuthenticatedUser({
    type: 'owner',
  });
  const repositories = data.map(repo => ({
    id: repo.id,
    name: repo.name,
    private: repo.private,
    defaultBranch: repo.default_branch,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
  }));

  return repositories;
};

/**
 * 레포지토리 트리 조회
 */
export const selectRepoTree = async ({
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

  const {
    data: {
      object: { sha: commitSHA },
    },
  } = await octokit.git.getRef({
    owner: username,
    repo: reponame,
    ref: `heads/${ref}`,
  });

  const {
    data: {
      tree: { sha: baseTreeSHA },
    },
  } = await octokit.git.getCommit({
    owner: username,
    repo: reponame,
    commit_sha: commitSHA,
  });

  const { data: tree } = await octokit.git.getTree({
    owner: username,
    repo: reponame,
    tree_sha: baseTreeSHA,
    recursive: 'true',
  });

  return tree;
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
