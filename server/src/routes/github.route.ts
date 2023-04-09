import { Router } from 'express';
import dotenv from 'dotenv';
import {
  githubFileContent,
  githubCommitList,
  githubRepoCreate,
  githubRepoDelete,
  githubRepoList,
  githubBranchCreate,
  githubBranchDelete,
  githubRepo,
  githubTest,
  // githubRepo,
} from '../controllers/github.controller';

dotenv.config();
const router = Router();

/**
 * 유저 전체 레포지토리 조회
 */
router.get('/repos', githubRepoList);

/**
 * 레포지토리 생성
 */
router.post('/repos/:repo', githubRepoCreate);

/**
 * 레포지토리 삭제 (github token 생성시 delete_repo 체크박스 체크해줘야함)
 */
router.delete('/repos/:repo', githubRepoDelete);

/**
 * 레포지토리 커밋 조회
 */
router.get('/repos/:repo/commits', githubCommitList);

/**
 * 레포지토리 전체 조회 (디렉토리 구조)
 */
router.get('/repos/:repo', githubRepo);

/**
 * 특정 커밋 시점의 레포지토리, 파일 조회
 */
router.get('/repos/:repo/contents/*', githubFileContent);

/**
 * 파일 삭제
 */
// router.delete('/repos/:repo/contents/*', githubFileContentDelete);

/**
 * 브랜치 생성
 */
router.post('/repos/:repo/branchs/:branch', githubBranchCreate);

/**
 * 브랜치 삭제
 */
router.delete('/repos/:repo/branchs/:branch', githubBranchDelete);

/**
 * 테스트
 */
router.post('/test', githubTest);

export default router;
