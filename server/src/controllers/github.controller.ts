import { Request, Response } from 'express';
import { Octokit } from '@octokit/rest';
import { selectContent } from '../octokit/content.octokit';
import {
  insertFileContents,
  updateFileContents,
} from '../octokit/commit.octokit';
import {
  insertRepo,
  removeRepo,
  selectRepoList,
} from '../octokit/repo.octokit';

export const githubRepoList = async (req: Request, res: Response) => {
  const octokit = new Octokit({
    auth: process.env.MY_GITHUB_PERSONAL_ACCESS_TOKEN,
  });
  try {
    const repositores = await selectRepoList({ octokit });
    return res.send(repositores);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const githubRepoContent = async (req: Request, res: Response) => {
  const repo = req.params.repo;
  const path = req.params[0];

  const octokit = new Octokit({
    auth: process.env.MY_GITHUB_PERSONAL_ACCESS_TOKEN,
  });
  try {
    const content = await selectContent({
      octokit,
      owner: process.env.MY_GITHUB_USERNAME!,
      repo,
      path,
    });

    if (!Array.isArray(content)) {
      return res.send(content);
    }

    const contents = content.map(file => file.name);
    return res.send(contents);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const githubRepoCreate = async (req: Request, res: Response) => {
  const { repoName, isPrivate } = req.body as {
    repoName: string;
    isPrivate: boolean;
  };

  const octokit = new Octokit({
    auth: process.env.MY_GITHUB_PERSONAL_ACCESS_TOKEN,
  });
  try {
    await insertRepo({ octokit, name: repoName, isPrivate });
    return res.send('success');
  } catch (error) {
    return res.status(500).send('fail');
  }
};

export const githubRepoDelete = async (req: Request, res: Response) => {
  const { repoName } = req.body as { repoName: string };

  const octokit = new Octokit({
    auth: process.env.MY_GITHUB_PERSONAL_ACCESS_TOKEN,
  });

  try {
    await removeRepo({ octokit, name: repoName });
    return res.send('success');
  } catch (error) {
    return res.status(500).send('fail');
  }
};

export const githubRepoCommit = async (req: Request, res: Response) => {
  const repo = req.params.repo;
  const path = req.params[0];
  const { content } = req.body as { content: string };
  const octokit = new Octokit({
    auth: process.env.MY_GITHUB_PERSONAL_ACCESS_TOKEN,
  });

  try {
    const oldContent = await selectContent({
      octokit,
      owner: process.env.MY_GITHUB_USERNAME!,
      repo,
      path,
    });
    if (Array.isArray(oldContent)) {
      console.log(oldContent.map(content => content.name));
      return res.status(404).send('fail');
    }
    // 새로운 파일일 경우 생성
    if (!oldContent) {
      await insertFileContents({
        octokit,
        owner: process.env.MY_GITHUB_USERNAME!,
        repo,
        path,
        content,
      });
    }
    // 기존 파일이 있다면 업데이트
    else {
      await updateFileContents({
        octokit,
        owner: process.env.MY_GITHUB_USERNAME!,
        repo,
        path,
        content,
        sha: oldContent.sha,
      });
    }
    return res.send('success');
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const githubRepoCommitList = async (req: Request, res: Response) => {
  console.log('getCommits');
  const repo = req.params.repo;
  const octokit = new Octokit();
  console.log(repo);
  try {
    const response = await octokit.repos.listCommits({
      owner: process.env.MY_GITHUB_USERNAME!,
      repo,
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
    return res.status(500).send(error);
  }
};
