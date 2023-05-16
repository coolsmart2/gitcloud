import { Octokit } from '@octokit/rest';
import { FileRequest, TreeBlob } from '../types/tree.type';
import { mergeNewTreeToPrevTree } from '../utils/github.util';

/**
 * 브랜치 (마지막 커밋) 조회
 */
export const selectCommitSHA = async ({
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
    ref: `heads/${branchname}`,
  });

  return commitSHA;
};

/**
 * 브랜치 생성
 */
export const insertBranch = async ({
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
  const octokit = new Octokit({
    auth: token,
  });

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
  const octokit = new Octokit({
    auth: token,
  });

  await octokit.git.deleteRef({
    owner: username,
    repo: reponame,
    ref: `heads/${branchname}`,
  });
};

export const insertTree = async ({
  token,
  username,
  reponame,
  tree,
  baseTreeSHA,
}: {
  token: string;
  username: string;
  reponame: string;
  tree: FileRequest[];
  baseTreeSHA?: string;
}): Promise<string> => {
  const octokit = new Octokit({
    auth: token,
  });

  const prevTree = await selectTree({
    token,
    username,
    reponame,
    baseTreeSHA: baseTreeSHA!,
  });

  const {
    data: { sha },
  } = await octokit.git.createTree({
    owner: username,
    repo: reponame,
    tree: mergeNewTreeToPrevTree(prevTree, tree),
  });
  return sha;
};

export const insertCommit = async ({
  token,
  username,
  reponame,
  parentSHA,
  treeSHA,
  message = new Date().toString(),
}: {
  token: string;
  username: string;
  reponame: string;
  treeSHA: string;
  parentSHA: string;
  message?: string;
}) => {
  const octokit = new Octokit({
    auth: token,
  });

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
  const octokit = new Octokit({
    auth: token,
  });

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

export const selectBaseTreeSHA = async ({
  token,
  username,
  reponame,
  commitSHA,
}: {
  token: string;
  username: string;
  reponame: string;
  commitSHA: string;
}) => {
  const octokit = new Octokit({
    auth: token,
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

  return baseTreeSHA;
};

export const selectTree = async ({
  token,
  username,
  reponame,
  baseTreeSHA,
}: {
  token: string;
  username: string;
  reponame: string;
  baseTreeSHA: string;
}) => {
  const octokit = new Octokit({
    auth: token,
  });

  const {
    data: { tree },
  } = await octokit.git.getTree({
    owner: username,
    repo: reponame,
    tree_sha: baseTreeSHA,
    recursive: 'true',
  });

  return tree;
};

export const selectRecursiveTree = async ({
  token,
  username,
  reponame,
  baseTreeSHA,
}: {
  token: string;
  username: string;
  reponame: string;
  baseTreeSHA: string;
}): Promise<TreeBlob[]> => {
  const octokit = new Octokit({
    auth: token,
  });

  const {
    data: { tree },
  } = await octokit.git.getTree({
    owner: username,
    repo: reponame,
    tree_sha: baseTreeSHA,
  });

  const recursiveTree = await Promise.all(
    tree.map(async item => {
      if (item.type === 'blob') {
        return item;
      }
      const subTree = await selectRecursiveTree({
        token,
        username,
        reponame,
        baseTreeSHA: item.sha!,
      });
      return { ...item, tree: subTree };
    })
  );

  return recursiveTree.sort((a, b) => {
    if (a.type === 'tree' && b.type === 'tree') {
      return 0;
    }
    if (a.type === 'tree') {
      return -1;
    }
    if (b.type === 'tree') {
      return 1;
    }
    const aPath = a.path || '';
    const bPath = b.path || '';
    return aPath.localeCompare(bPath);
  });
};
