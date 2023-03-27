import { Request, Response } from 'express';
import { Octokit } from '@octokit/rest';

export const getRepos = async (req: Request, res: Response) => {
  const octokit = new Octokit({
    auth: process.env.MY_GITHUB_PERSONAL_ACCESS_TOKEN,
  });
  try {
    const response = await octokit.repos.listForAuthenticatedUser();
    const repositores = response.data.map(repo => repo.name);

    return res.send(repositores);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const getRepo = async (req: Request, res: Response) => {
  const repo = req.params.repo;
  const path = req.params.path;
  console.log(repo);
  const octokit = new Octokit({
    auth: process.env.MY_GITHUB_PERSONAL_ACCESS_TOKEN,
  });
  try {
    const response = await octokit.repos.getContent({
      owner: process.env.MY_GITHUB_USERNAME!,
      repo,
      path,
    });

    if (!Array.isArray(response.data)) {
      return res.send(response.data);
    }

    const contents = response.data.map(content => content.name);

    return res.send(contents);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const createRepo = async (req: Request, res: Response) => {
  const { repoName, isPrivate } = req.body as {
    repoName: string;
    isPrivate: boolean;
  };

  const octokit = new Octokit({
    auth: process.env.MY_GITHUB_PERSONAL_ACCESS_TOKEN,
  });
  try {
    await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      private: isPrivate ?? false,
    });
    return res.send('success');
  } catch (error) {
    return res.status(500).send('fail');
  }
};

export const deleteRepo = async (req: Request, res: Response) => {
  const { repoName } = req.body as { repoName: string };

  const octokit = new Octokit({
    auth: process.env.MY_GITHUB_PERSONAL_ACCESS_TOKEN,
  });

  try {
    await octokit.repos.delete({
      owner: process.env.MY_GITHUB_USERNAME!,
      repo: repoName,
    });
    return res.send('success');
  } catch (error) {
    return res.status(500).send(error);
  }
};
