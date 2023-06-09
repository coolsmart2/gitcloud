import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import * as githubService from '../services/github.service';
import { GithubError } from '../constants/errors';

/**
 * 전체 레포지토리 목록 조회
 */
export const githubRepoList = async (req: Request, res: Response) => {
  const userId = req.session.userId as number;
  const { personal_access_token: token } = await userService.findOneById(
    userId
  );

  if (!token) return res.status(404).send({ message: 'token error' });

  try {
    console.log(token);
    const repos = await githubService.findRepoList(token);

    return res.send({ message: 'success', data: repos });
  } catch (error) {
    if (error instanceof GithubError) {
      return res.status(422).send({ message: 'github api error' });
    }
    return res.status(500).send({ message: 'server error' });
  }
};

/**
 * 레포지토리 조회
 */
export const githubRepoTree = async (req: Request, res: Response) => {
  const { repo: reponame, branch: branchname } = req.params;
  const { ref } = req.query as { ref: string };
  const userId = req.session.userId as number;
  const { username, personal_access_token: token } =
    await userService.findOneById(userId);

  if (!username || !token)
    return res.status(404).send({ message: 'token error' });

  try {
    const repoTree = await githubService.findRepoTree({
      token,
      username,
      reponame,
      branchname,
      ref,
    });
    return res.send({ message: 'success', data: repoTree });
  } catch (error) {
    if (error instanceof GithubError) {
      return res.status(422).send({ message: 'github api error' });
    }
    return res.status(500).send({ message: 'server error' });
  }
};

/**
 * 파일 조회 (폴더 제외)
 */
export const githubFileContent = async (req: Request, res: Response) => {
  const { repo: reponame } = req.params;
  const path = req.params[0];
  const { ref } = req.query as { ref: string };
  const userId = req.session.userId as number;
  const { username, personal_access_token: token } =
    await userService.findOneById(userId);

  if (!username || !token)
    return res.status(404).send({ message: 'token error' });

  try {
    const content = await githubService.findFileContent({
      token,
      username,
      reponame,
      path,
      ref,
    });

    return res.send({ message: 'success', data: content });
  } catch (error) {
    if (error instanceof GithubError) {
      return res.status(422).send({ message: 'github api error' });
    }
    return res.status(500).send({ message: 'server error' });
  }
};

/**
 * 레포지토리 생성
 */
export const githubRepoCreate = async (req: Request, res: Response) => {
  const { repo: reponame } = req.params;
  const { isPrivate } = req.body as { isPrivate: boolean };
  const userId = req.session.userId as number;
  const { personal_access_token: token } = await userService.findOneById(
    userId
  );

  if (!token) return res.status(404).send({ message: 'token error' });

  try {
    const repo = await githubService.addRepo({ token, reponame, isPrivate });

    return res.send({ message: 'success', data: repo });
  } catch (error) {
    if (error instanceof GithubError) {
      return res.status(422).send({ message: 'github api error' });
    }
    return res.status(500).send({ message: 'server error' });
  }
};

/**
 * 레포지토리 삭제
 */
export const githubRepoDelete = async (req: Request, res: Response) => {
  const { repo: reponame } = req.params;
  const userId = req.session.userId as number;
  const { username, personal_access_token: token } =
    await userService.findOneById(userId);

  if (!username || !token)
    return res.status(404).send({ message: 'token error' });

  try {
    await githubService.deleteRepo({ username, token, reponame });
    return res.send({ message: 'success' });
  } catch (error) {
    if (error instanceof GithubError) {
      return res.status(422).send({ message: 'github api error' });
    }
    return res.status(500).send({ message: 'server error' });
  }
};

/**
 * 브랜치 커밋 리스트 조회
 */
export const githubCommitList = async (req: Request, res: Response) => {
  const { repo: reponame } = req.params;
  const userId = req.session.userId as number;
  const { username, personal_access_token: token } =
    await userService.findOneById(userId);

  if (!username || !token)
    return res.status(404).send({ message: 'token error' });

  try {
    const commits = await githubService.findListCommits({
      token,
      username,
      reponame,
    });

    return res.send({ message: 'success', data: commits });
  } catch (error) {
    if (error instanceof GithubError) {
      return res.status(422).send({ message: 'github api error' });
    }
    return res.status(500).send({ message: 'server error' });
  }
};

/**
 * 브랜치 생성
 */
export const githubBranchCreate = async (req: Request, res: Response) => {
  const { repo: reponame, branch: branchname } = req.params;
  const { commitSHA } = req.body as { commitSHA: string };
  const userId = req.session.userId as number;
  const { username, personal_access_token: token } =
    await userService.findOneById(userId);

  if (!username || !token)
    return res.status(404).send({ message: 'token error' });

  try {
    await githubService.addBranch({
      token,
      username,
      reponame,
      branchname,
      commitSHA,
    });
    return res.send({ message: 'success' });
  } catch (error) {
    if (error instanceof GithubError) {
      return res.status(422).send({ message: 'github api error' });
    }
    return res.status(500).send({ message: 'server error' });
  }
};

// /**
//  * 브랜치 삭제
//  */
// export const githubBranchDelete = async (req: Request, res: Response) => {
//   const { repo: reponame, branch: branchname } = req.params;
//   const { username, token } = userService.findOneById(1);

//   if (!username || !token)
//     return res.status(404).send({ message: 'token error' });

//   try {
//     await githubService.deleteBranch({
//       token,
//       username,
//       reponame,
//       branchname,
//     });
//     return res.send({ message: 'success' });
//   } catch (error) {
//     if (error instanceof GithubError) {
//       return res.status(422).send({ message: 'github api error' });
//     }
//     return res.status(500).send({ message: 'server error' });
//   }
// };

/**
 * 커밋 생성
 */
export const githubCommitCreate = async (req: Request, res: Response) => {
  const { repo: reponame, branch: branchname } = req.params;
  let { message, tree } = req.body;
  const userId = req.session.userId as number;
  const { username, personal_access_token: token } =
    await userService.findOneById(userId);

  if (!username || !token)
    return res.status(404).send({ message: 'token error' });

  try {
    await githubService.addCommit({
      token,
      username,
      reponame,
      branchname,
      tree,
      message,
    });

    return res.send({ message: 'success' });
  } catch (error) {
    console.log(error);
    if (error instanceof GithubError) {
      return res.status(422).send({ message: 'github api error' });
    }
    return res.status(500).send({ message: 'server error' });
  }
};

// export const githubUser = async (req: Request, res: Response) => {
//   const { token } = req.body;

//   try {
//     const user = await githubService.findUser(token);
//     return res.send({ message: 'success', data: user });
//   } catch (error) {
//     if (error instanceof GithubError) {
//       return res.status(422).send({ message: 'github api error' });
//     }
//     return res.status(500).send({ message: 'server error' });
//   }
// };

export const githubOAuth = async (req: Request, res: Response) => {
  const { code } = req.body;
  try {
    const oauthUser = await githubService.findUserByCode(code);
    let user = await userService.findOneByProviderId(oauthUser.node_id);
    // 사용자가 회원가입이 되어 있지 않은 경우
    if (!user) {
      console.log(oauthUser);
      await userService.add({
        providerId: oauthUser.node_id,
        username: oauthUser.login,
        avatarUrl: oauthUser.avatar_url,
      });
      user = await userService.findOneByProviderId(oauthUser.node_id);
    }
    req.session.userId = user.id;
    return res.send({
      message: 'success',
      data: {
        username: user.username,
        avatarUrl: user.avatar_url,
        hasToken: !!user.personal_access_token,
      },
    });
  } catch (error) {
    return res.status(500).send({ message: 'server error' });
  }
};

export const githubTest = async (req: Request, res: Response) => {
  const { repo: reponame, branch: branchname } = req.params;
  let { message, tree } = req.body;

  const { username, personal_access_token: token } =
    await userService.findOneById(1);

  if (!username || !token)
    return res.status(404).send({ message: 'token error' });

  try {
    await githubService.addCommit({
      token,
      username,
      reponame,
      branchname,
      tree,
      message,
    });

    return res.send({ message: 'success' });
  } catch (error) {
    console.log(error);
    if (error instanceof GithubError) {
      return res.status(422).send({ message: 'github api error' });
    }
    return res.status(500).send({ message: 'server error' });
  }
};
