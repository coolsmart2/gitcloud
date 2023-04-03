import { Router } from 'express';
import dotenv from 'dotenv';
import {
  githubRepoContent,
  githubRepoCommit,
  githubRepoCommitList,
  githubRepoCreate,
  githubRepoDelete,
  githubRepoList,
} from '../controllers/github.controller';

dotenv.config();
const router = Router();

/**
 * 유저 전체 레포지토리 가져오기
 */
router.get('/repos', githubRepoList);

/**
 * 레포지토리 생성
 */
router.post('/repos', githubRepoCreate);

/**
 * 레포지토리 삭제 (github token에서 delete_repo 체크해줘야함)
 */
router.delete('/repos', githubRepoDelete);

/**
 * 레포지토리 커밋 가져오기
 */
router.get('/repos/:repo/commits', githubRepoCommitList);

/**
 * 유저 특정 레포지토리 가져오기
 */
router.get('/repos/:repo/contents/*', githubRepoContent);

/**
 * 파일 커밋
 */
router.post('/repos/:repo/contents/*', githubRepoCommit);

export default router;
