import { Request, Response } from 'express';
import { Octokit } from '@octokit/rest';
import * as userService from '../service/user.service';
import * as githubService from '../service/github.service';
import { GithubError } from '../constants/errors';
import { insertTree } from '../octokits/git.octokit';

/**
 * 전체 레포지토리 목록 조회
 */
export const githubRepoList = async (req: Request, res: Response) => {
  const { token } = userService.findById(1);

  if (!token) return res.status(404).send([]);

  try {
    const repos = await githubService.findRepos(token);

    return res.send(repos);
  } catch (error) {
    if (error instanceof GithubError) {
      return res.status(422).send(error.message);
    }
    return res.status(500).send([]);
  }
};

/**
 * 레포지토리 조회
 */
export const githubRepo = async (req: Request, res: Response) => {
  const { repo: reponame } = req.params;
  const { ref } = req.query as { ref: string };
  const { username, token } = userService.findById(1);

  if (!username || !token) return res.status(404).send([]);

  try {
    const repoTree = await githubService.findRepo({
      token,
      username,
      reponame,
      ref,
    });
    return res.send(repoTree);
  } catch (error) {
    if (error instanceof GithubError) {
      return res.status(422).send(error.message);
    }
    return res.status(500).send([]);
  }
};

/**
 * 파일 조회 (폴더 제외)
 */
export const githubFileContent = async (req: Request, res: Response) => {
  const { repo: reponame } = req.params;
  const path = req.params[0];
  const { ref } = req.query as { ref: string };

  const { username, token } = userService.findById(1);

  if (!username || !token) return res.status(404).send([]);

  try {
    const content = await githubService.findFileContent({
      token,
      username,
      reponame,
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
 * 레포지토리 생성
 */
export const githubRepoCreate = async (req: Request, res: Response) => {
  const { repo: reponame } = req.params;
  const { isPrivate } = req.body as { isPrivate: boolean };
  const { token } = userService.findById(1);

  if (!token) return res.status(404).send([]);

  try {
    await githubService.addRepo({ token, reponame, isPrivate });

    return res.send('success');
  } catch (error) {
    if (error instanceof GithubError) {
      return res.status(422).send(error.message);
    }
    return res.status(500).send([]);
  }
};

/**
 * 레포지토리 삭제
 */
export const githubRepoDelete = async (req: Request, res: Response) => {
  const { repo: reponame } = req.params;
  const { username, token } = userService.findById(1);

  if (!username || !token) return res.status(404).send([]);

  try {
    await githubService.deleteRepo({ username, token, reponame });
    return res.send('success');
  } catch (error) {
    if (error instanceof GithubError) {
      return res.status(422).send(error.message);
    }
    return res.status(500).send([]);
  }
};

/**
 * 브랜치 커밋 리스트 조회
 */
export const githubCommitList = async (req: Request, res: Response) => {
  const { repo: reponame } = req.params;
  const { username, token } = userService.findById(1);

  if (!username || !token) return res.status(404).send([]);

  try {
    const commits = await githubService.findListCommits({
      token,
      username,
      reponame,
    });

    return res.send(commits);
  } catch (error) {
    if (error instanceof GithubError) {
      return res.status(422).send(error.message);
    }
    return res.status(500).send([]);
  }
};

/**
 * 브랜치 생성
 */
export const githubBranchCreate = async (req: Request, res: Response) => {
  const { repo: reponame, branch: branchname } = req.params;
  const { ref: commitSHA } = req.query as { ref: string };
  const { username, token } = userService.findById(1);

  if (!username || !token) return res.status(404).send([]);

  try {
    await githubService.addBranch({
      token,
      username,
      reponame,
      branchname,
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

/**
 * 브랜치 삭제
 */
export const githubBranchDelete = async (req: Request, res: Response) => {
  const { repo: reponame, branch: branchname } = req.params;
  const { username, token } = userService.findById(1);

  if (!username || !token) return res.status(404).send([]);

  try {
    await githubService.deleteBranch({
      token,
      username,
      reponame,
      branchname,
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
  const { username, token } = userService.findById(1);

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
      username,
      reponame: repo,
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
