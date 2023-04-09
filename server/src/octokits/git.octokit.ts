import { Octokit } from '@octokit/rest';
import { Directory, File } from '../types/file.type';

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
      object: { sha: parentSHA },
    },
  } = await octokit.git.getRef({
    owner: username,
    repo: reponame,
    ref: `heads/${branchname}`,
  });
  return parentSHA;
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
  files,
  baseSHA,
}: {
  octokit: Octokit;
  username: string;
  reponame: string;
  files: (File | Directory)[];
  baseSHA?: string;
}) => {
  const {
    data: { sha: treeSHA },
  } = await octokit.git.createTree({
    owner: username,
    repo: reponame,
    tree: await Promise.all(
      files.map(async file => {
        if ('tree' in file) {
          const childTreeSHA = (await insertTree({
            octokit,
            username,
            reponame,
            files: file.tree,
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
  return treeSHA;
};

export const insertCommit = async ({
  octokit,
  username,
  reponame,
  parentSHA,
  treeSHA,
  message = new Date().toLocaleString('ko-KR', { timeZone: 'UTC' }),
}: {
  octokit: Octokit;
  username: string;
  reponame: string;
  parentSHA: string;
  treeSHA: string;
  message?: string;
}) => {
  const {
    data: { sha: commitSHA },
  } = await octokit.git.createCommit({
    owner: username,
    repo: reponame,
    parent: [parentSHA],
    tree: treeSHA,
    message,
  });
  return commitSHA;
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
      object: { sha: parentSHA },
    },
  } = await octokit.git.updateRef({
    owner: username,
    repo: reponame,
    ref: `heads/${branchname}`,
    sha: commitSHA,
  });
  return parentSHA;
};
