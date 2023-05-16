import { Router } from 'express';
import * as githubController from '../controllers/github.controller';
import * as authMiddleware from '../middlewares/auth.middleware';

const router = Router();

/**
 * 전체 레포지토리 목록 조회
 */
router.get(
  '/repos',
  authMiddleware.checkSession,
  githubController.githubRepoList
);

/**
 * 레포지토리 생성
 */
router.post('/repos/:repo', githubController.githubRepoCreate);

/**
 * 레포지토리 삭제 (github token 생성시 delete_repo 체크박스 체크해줘야함)
 */
router.delete('/repos/:repo', githubController.githubRepoDelete);

/**
 * 레포지토리 조회 (디렉토리 구조)
 */
router.get(
  '/repos/:repo/branchs/:branch',
  authMiddleware.checkSession,
  githubController.githubRepoTree
);

/**
 * 특정 커밋 시점의 레포지토리, 파일 조회
 */
router.get('/repos/:repo/contents/*', githubController.githubFileContent);

// /**
//  * 브랜치 생성
//  */
// router.post(
//   '/repos/:repo/branchs/:branch',
//   githubController.githubBranchCreate
// );

// /**
//  * 브랜치 삭제
//  */
// router.delete(
//   '/repos/:repo/branchs/:branch',
//   githubController.githubBranchDelete
// );

/**
 * 브랜치 커밋 리스트 조회
 */
router.get('/repos/:repo/commits', githubController.githubCommitList);

/**
 * 커밋 생성
 */
router.post(
  '/repos/:repo/branchs/:branch/commits',
  githubController.githubCommitCreate
);

// router.post('/users', githubController.githubUser);

router.post('/oauth', githubController.githubOAuth);

router.post(
  '/test/repos/:repo/branchs/:branch/commits',
  githubController.githubTest
);

export default router;
