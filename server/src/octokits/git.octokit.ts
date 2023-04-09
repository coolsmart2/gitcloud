import { Octokit } from '@octokit/rest';
import { Directory, File } from '../types/tree.type';

/**
 * 브랜치 (마지막 커밋) 조회
 */
export const selectBranch = async ({
  octokit,
  username,
  reponame,
  branchname,
}: {
  octokit: Octokit;
  username: string;
  reponame: string;
  branchname: string;
}) => {
  const {
    data: {
      object: { sha },
    },
  } = await octokit.git.getRef({
    owner: username,
    repo: reponame,
    ref: `heads/${branchname}`,
  });
  return sha;
};

/**
 * 브랜치 생성
 */
export const insertBranch = async ({
  octokit,
  username,
  reponame,
  branchname,
  commitSHA,
}: {
  octokit: Octokit;
  username: string;
  reponame: string;
  branchname: string;
  commitSHA: string;
}) => {
  await octokit.git.createRef({
    owner: username,
    repo: reponame,
    ref: `refs/heads/${branchname}`,
    sha: commitSHA,
  });
};

/**
 * 브랜치 삭제
 */
export const removeBranch = async ({
  octokit,
  username,
  reponame,
  branchname,
}: {
  octokit: Octokit;
  username: string;
  reponame: string;
  branchname: string;
}) => {
  await octokit.git.deleteRef({
    owner: username,
    repo: reponame,
    ref: `heads/${branchname}`,
  });
};

export const insertTree = async ({
  octokit,
  username,
  reponame,
  tree,
  baseSHA,
}: {
  octokit: Octokit;
  username: string;
  reponame: string;
  tree: (File | Directory)[];
  baseSHA?: string;
}) => {
  const {
    data: { sha },
  } = await octokit.git.createTree({
    owner: username,
    repo: reponame,
    tree: await Promise.all(
      tree.map(async file => {
        if ('tree' in file) {
          const childTreeSHA = (await insertTree({
            octokit,
            username,
            reponame,
            tree: file.tree,
          })) as string;
          return {
            path: file.path,
            mode: '040000',
            type: 'tree',
            sha: childTreeSHA,
          };
        } else {
          return {
            path: file.path,
            mode: '100644',
            type: 'blob',
            content: file.content,
          };
        }
      })
    ),
  });
  return sha;
};

export const insertCommit = async ({
  octokit,
  username,
  reponame,
  parentSHA,
  treeSHA,
  message = new Date().toString(),
}: {
  octokit: Octokit;
  username: string;
  reponame: string;
  treeSHA: string;
  parentSHA: string;
  message?: string;
}) => {
  const {
    data: { sha },
  } = await octokit.git.createCommit({
    owner: username,
    repo: reponame,
    parents: [parentSHA],
    tree: treeSHA,
    message,
  });
  return sha;
};

export const updateRef = async ({
  octokit,
  username,
  reponame,
  branchname,
  commitSHA,
}: {
  octokit: Octokit;
  username: string;
  reponame: string;
  branchname: string;
  commitSHA: string;
}) => {
  const {
    data: {
      object: { sha },
    },
  } = await octokit.git.updateRef({
    owner: username,
    repo: reponame,
    ref: `heads/${branchname}`,
    sha: commitSHA,
  });
  return sha;
};
