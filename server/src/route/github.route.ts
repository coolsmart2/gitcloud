import { Router } from 'express';
import dotenv from 'dotenv';
import {
  githubRepoContent,
  githubFileContentCommit,
  githubCommitList,
  githubRepoCreate,
  githubRepoDelete,
  githubRepoList,
  githubBranchCreate,
  githubBranchDelete,
  githubRepo,
  // githubRepo,
} from '../controller/github.controller';

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
router.get('/repos/:repo/contents/*', githubRepoContent);

/**
 * 파일 커밋
 * 어떤 브랜치의 마지막 커밋에서 커밋할 경우 그대로 커밋
 * 어떤 브랜치의 중간 커밋에서 커밋할 경우 새로운 브랜치 생성 후 새로운 브랜치에 커밋
 */
router.post('/repos/:repo/contents/*', githubFileContentCommit);

/**
 * 브랜치 생성
 */
router.post('/repos/:repo/branchs/:branch', githubBranchCreate);

/**
 * 브랜치 삭제
 */
router.delete('/repos/:repo/branchs/:branch', githubBranchDelete);

export default router;
