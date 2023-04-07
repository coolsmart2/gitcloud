import { Request, Response } from 'express';
import { Octokit } from '@octokit/rest';
import { findById } from '../service/user.service';
import {
  addBranch,
  addContent,
  addRepo,
  deleteBranch,
  deleteContent,
  deleteRepo,
  findRepos,
  findContent,
  findRepo,
  modifyContent,
} from '../service/github.service';
import { GithubError } from '../constants/errors';
import { insertTree } from '../octokits/git.octokit';

/**
 * completed
 */
export const githubRepoList = async (req: Request, res: Response) => {
  const { token } = findById(1);

  if (!token) return res.status(404).send([]);

  try {
    const repos = await findRepos(token);
    return res.send(repos);
  } catch (error) {
    if (error instanceof GithubError) {
      return res.status(422).send(error.message);
    }
    return res.status(500).send([]);
  }
};

export const githubRepo = async (req: Request, res: Response) => {
  const { repo: repoName } = req.params;
  const { ref } = req.query as { ref: string };
  const { username, token } = findById(1);

  if (!username || !token) return res.status(404).send([]);

  try {
    const repoStructure = await findRepo({
      token,
      owner: username,
      repoName,
      ref,
    });
    return res.send(repoStructure);
  } catch (error) {
    if (error instanceof GithubError) {
      return res.status(422).send(error.message);
    }
    return res.status(500).send([]);
  }
};

/**
 * completed
 */
export const githubFileContent = async (req: Request, res: Response) => {
  const { repo: repoName } = req.params;
  const path = req.params[0];
  const { ref } = req.query as { ref: string };

  const { username, token } = findById(1);

  if (!username || !token) return res.status(404).send([]);

  try {
    /* path에 따라 객체 또는 객체 배열을 반환, content가 없는 경우 undefind */
    const content = await findContent({
      token,
      owner: username,
      repoName,
      path,
      ref,
    });

    return res.send(content);
  } catch (error) {
    if (error instanceof GithubError) {
      return res.status(422).send(error.message);
    }
    return res.status(500).send([]);
  }
};

/**
 * completed
 */
export const githubRepoCreate = async (req: Request, res: Response) => {
  const { repo: repoName } = req.params;
  const { isPrivate } = req.body as { isPrivate: boolean };
  const { token } = findById(1);

  if (!token) return res.status(404).send([]);

  try {
    await addRepo({ token, repoName, isPrivate });
    return res.send('success');
  } catch (error) {
    if (error instanceof GithubError) {
      return res.status(422).send(error.message);
    }
    return res.status(500).send([]);
  }
};

/**
 * completed
 */
export const githubRepoDelete = async (req: Request, res: Response) => {
  const { repo: repoName } = req.params;
  const { token } = findById(1);

  if (!token) return res.status(404).send([]);

  try {
    await deleteRepo({ token, repoName });
    return res.send('success');
  } catch (error) {
    if (error instanceof GithubError) {
      return res.status(422).send(error.message);
    }
    return res.status(500).send([]);
  }
};

export const githubFileContentCommit = async (req: Request, res: Response) => {
  const { repo: repoName } = req.params;
  const path = req.params[0];
  const { ref: branchName } = req.query as { ref: string };
  const { message, content } = req.body as { message: string; content: string };
  const { username, token } = findById(1);

  if (!username || !token) return res.status(404).send([]);

  try {
    const oldContent = await findContent({
      token,
      owner: username,
      repoName,
      path,
      ref: branchName,
    });

    if (Array.isArray(oldContent)) return res.status(404).send([]);

    /* 기존 content가 없는 경우 -> 새로운 파일 생성 */
    if (!oldContent) {
      await addContent({
        token,
        owner: username,
        repoName,
        path,
        content,
        branchName,
        message,
      });
    } else {
      /* 기존 content가 있는 경우 -> 기존 파일 변경 */
      await modifyContent({
        token,
        owner: username,
        repoName,
        path,
        content,
        blobSHA: oldContent.sha,
      });
    }

    return res.send('success');
  } catch (error) {
    if (error instanceof GithubError) {
      return res.status(422).send(error.message);
    }
    return res.status(500).send([]);
  }
};

export const githubFileContentDelete = async (req: Request, res: Response) => {
  const { repo: repoName } = req.params;
  const path = req.params[0];
  const { ref } = req.query as { ref: string };
  const { message } = req.body as { message: string };
  const { username, token } = findById(1);

  if (!username || !token) return res.status(404).send([]);

  try {
    await deleteContent({
      token,
      owner: username,
      repoName,
      path,
      message,
      blobSHA: ref,
    });
    return res.send('success');
  } catch (error) {
    if (error instanceof GithubError) {
      return res.status(422).send(error.message);
    }
    return res.status(500).send([]);
  }
};

export const githubCommitList = async (req: Request, res: Response) => {
  const { repo: repoName } = req.params;
  const octokit = new Octokit();

  try {
    const response = await octokit.repos.listCommits({
      owner: process.env.MY_GITHUB_USERNAME!,
      repo: repoName,
    });
    const commits = response.data.map(commit => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author?.name,
      date: commit.commit.author?.date,
      url: commit.html_url,
    }));
    return res.send(commits);
  } catch (error) {
    if (error instanceof GithubError) {
      return res.status(422).send(error.message);
    }
    return res.status(500).send([]);
  }
};

export const githubBranchCreate = async (req: Request, res: Response) => {
  const { repo: repoName, branch: branchName } = req.params;
  const { ref: commitSHA } = req.query as { ref: string };
  const { username, token } = findById(1);

  if (!username || !token) return res.status(404).send([]);

  try {
    await addBranch({
      token,
      owner: username,
      repoName,
      branchName,
      commitSHA,
    });
    return res.send('success');
  } catch (error) {
    if (error instanceof GithubError) {
      return res.status(422).send(error.message);
    }
    return res.status(500).send([]);
  }
};

export const githubBranchDelete = async (req: Request, res: Response) => {
  const { repo: repoName, branch: branchName } = req.params;
  const { username, token } = findById(1);

  if (!username || !token) return res.status(404).send([]);

  try {
    await deleteBranch({
      token,
      owner: username,
      repoName,
      branchName,
    });
    return res.send('success');
  } catch (error) {
    if (error instanceof GithubError) {
      return res.status(422).send(error.message);
    }
    return res.status(500).send([]);
  }
};

export const githubTest = async (req: Request, res: Response) => {
  let { repo, branch, files } = req.body;
  const { username, token } = findById(1);

  console.log(files);

  if (!username || !token) return res.status(404).send([]);
  console.log(repo, branch, files[0].path);

  const octokit = new Octokit({ auth: token });
  try {
    const {
      data: {
        object: { sha: parentSHA },
      },
    } = await octokit.git.getRef({
      owner: username,
      repo: repo,
      ref: `heads/${branch}`,
    });

    const newTreeSHA = await insertTree({
      octokit,
      owner: username,
      repoName: repo,
      files,
    });

    const {
      data: { sha: commitSHA },
    } = await octokit.git.createCommit({
      owner: username,
      repo: repo,
      message: new Date().toUTCString(),
      parents: [parentSHA],
      tree: newTreeSHA,
    });

    const {
      data: {
        object: { sha: newSHA },
      },
    } = await octokit.git.updateRef({
      owner: username,
      repo: repo,
      ref: `heads/${branch}`,
      sha: commitSHA,
    });

    // return res.send('success');
    return res.send(newSHA);
  } catch (error) {
    console.log(error);
    if (error instanceof GithubError) {
      return res.status(422).send(error.message);
    }
    return res.status(500).send([]);
  }
};
