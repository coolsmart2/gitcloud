import { Router } from 'express';
import dotenv from 'dotenv';
import {
  createRepo,
  deleteRepo,
  getRepos,
  getRepo,
} from '../controller/githubAPI.controller';

dotenv.config();
const router = Router();

/**
 * 유저 전체 레포지토리 가져오기
 */
router.get('/repos', getRepos);

/**
 * 유저 특정 레포지토리 가져오기
 */
router.get('/repos/:repo/:path', getRepo);

/**
 * 레포지토리 생성
 */
router.post('/repos', createRepo);

/**
 * 레포지토리 삭제 (github token에서 delete_repo 체크해줘야함)
 */
router.delete('/repos', deleteRepo);

export default router;
