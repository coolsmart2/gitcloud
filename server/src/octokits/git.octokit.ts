import { Octokit } from '@octokit/rest';
import { Directory, File } from '../types/file.type';

export const selectBranch = async ({
  octokit,
  owner,
  repoName,
  branchName,
}: {
  octokit: Octokit;
  owner: string;
  repoName: string;
  branchName: string;
}) => {
  const {
    data: {
      object: { sha: parentSHA },
    },
  } = await octokit.git.getRef({
    owner,
    repo: repoName,
    ref: `heads/${branchName}`,
  });
  return parentSHA;
};

export const insertBranch = async ({
  octokit,
  owner,
  repoName,
  branchName,
  commitSHA,
}: {
  octokit: Octokit;
  owner: string;
  repoName: string;
  branchName: string;
  commitSHA: string;
}) => {
  await octokit.git.createRef({
    owner,
    repo: repoName,
    ref: `refs/heads/${branchName}`,
    sha: commitSHA,
  });
};

export const removeBranch = async ({
  octokit,
  owner,
  repoName,
  branchName,
}: {
  octokit: Octokit;
  owner: string;
  repoName: string;
  branchName: string;
}) => {
  await octokit.git.deleteRef({
    owner,
    repo: repoName,
    ref: `heads/${branchName}`,
  });
};

export const insertTree = async ({
  octokit,
  owner,
  repoName,
  files,
  baseSHA,
}: {
  octokit: Octokit;
  owner: string;
  repoName: string;
  files: (File | Directory)[];
  baseSHA?: string;
}) => {
  const {
    data: { sha: treeSHA },
  } = await octokit.git.createTree({
    owner,
    repo: repoName,
    tree: await Promise.all(
      files.map(async file => {
        if ('tree' in file) {
          const childTreeSHA = (await insertTree({
            octokit,
            owner,
            repoName,
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
  owner,
  repoName,
  parentSHA,
  treeSHA,
  message = new Date().toLocaleString('ko-KR', { timeZone: 'UTC' }),
}: {
  octokit: Octokit;
  owner: string;
  repoName: string;
  parentSHA: string;
  treeSHA: string;
  message?: string;
}) => {
  const {
    data: { sha: commitSHA },
  } = await octokit.git.createCommit({
    owner,
    repo: repoName,
    parent: [parentSHA],
    tree: treeSHA,
    message,
  });
  return commitSHA;
};

export const updateRef = async ({
  octokit,
  owner,
  repoName,
  branchName,
  commitSHA,
}: {
  octokit: Octokit;
  owner: string;
  repoName: string;
  branchName: string;
  commitSHA: string;
}) => {
  const {
    data: {
      object: { sha: parentSHA },
    },
  } = await octokit.git.updateRef({
    owner,
    repo: repoName,
    ref: `heads/${branchName}`,
    sha: commitSHA,
  });
  return parentSHA;
};
