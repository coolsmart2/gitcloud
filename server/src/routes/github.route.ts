import { Router, Request, Response } from 'express';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();

/**
 * 유저 전체 레포지토리 가져오기
 */
router.get('/repos', async (req: Request, res: Response) => {
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
});

/**
 * 유저 특정 레포지토리 최상위 레이어 가져오기
 */
router.get('/repos/:repo', async (req: Request, res: Response) => {
  const repo = req.params.repo;
  console.log(repo);
  const octokit = new Octokit({
    auth: process.env.MY_GITHUB_PERSONAL_ACCESS_TOKEN,
  });
  try {
    const response = await octokit.repos.getContent({
      owner: process.env.MY_GITHUB_USERNAME!,
      repo: repo,
      path: '',
    });

    if (!Array.isArray(response.data)) {
      return res.send(response.data);
    }

    const contents = response.data.map(content => content.name);

    return res.send(contents);
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * 레포지토리 생성
 */
router.post('/repos', async (req: Request, res: Response) => {
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
});

/**
 * 레포지토리 삭제 (github token에서 delete_repo 체크해줘야함)
 */
router.delete('/repos', async (req: Request, res: Response) => {
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
});

export default router;
