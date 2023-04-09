import { Octokit } from '@octokit/rest';
import { Directory, File } from '../types/file.type';

/**
 * 레포지토리 생성
 */
export const insertRepo = async ({
  octokit,
  reponame,
  isPrivate,
}: {
  octokit: Octokit;
  reponame: string;
  isPrivate: boolean;
}) => {
  await octokit.repos.createForAuthenticatedUser({
    name: reponame,
    private: isPrivate,
  });
};

/**
 * 레포지토리 삭제
 */
export const removeRepo = async ({
  octokit,
  username,
  reponame,
}: {
  octokit: Octokit;
  username: string;
  reponame: string;
}) => {
  await octokit.repos.delete({
    owner: username,
    repo: reponame,
  });
};

/**
 * 전체 레포지토리 목록 조회
 */
export const selectRepos = async ({ octokit }: { octokit: Octokit }) => {
  const { data } = await octokit.repos.listForAuthenticatedUser();
  const repositories = data.map(repo => ({
    name: repo.name,
    private: repo.private,
  }));

  return repositories;
};

/**
 * 레포지토리 조회
 */
export const selectRepo = async ({
  octokit,
  username,
  reponame,
  path = '',
  ref,
}: {
  octokit: Octokit;
  username: string;
  reponame: string;
  path?: string;
  ref?: string;
}) => {
  const { data } = await octokit.repos.getContent({
    owner: username,
    repo: reponame,
    path,
    ref,
  });

  const root = !Array.isArray(data) ? [data] : data;

  const structure: (Directory | File)[] = await Promise.all(
    root.map(async sub => {
      if (sub.type === 'dir') {
        return {
          name: sub.name,
          type: sub.type,
          path: sub.path,
          sha: sub.sha,
          tree: await selectRepo({
            octokit,
            username,
            reponame,
            path: `${path}/${sub.name}`,
            ref,
          }),
        };
      } else {
        return {
          name: sub.name,
          type: sub.type,
          path: sub.path,
          sha: sub.sha,
        };
      }
    })
  );

  return structure;
};

/**
 * 파일 조회 (폴더 제외)
 */
export const selectFileContent = async ({
  octokit,
  username,
  reponame,
  path,
  ref,
}: {
  octokit: Octokit;
  username: string;
  reponame: string;
  path: string;
  ref?: string;
}) => {
  const { data } = await octokit.repos.getContent({
    owner: username,
    repo: reponame,
    path,
    ref,
  });

  if ('content' in data && 'encoding' in data) {
    const content = {
      name: data.name,
      path: data.path,
      sha: data.sha,
      content: data.content,
      encoding: data.encoding,
    };

    return content;
  }

  throw new Error('존재하지 않는 파일입니다.');
};

/**
 * 브랜치 커밋 리스트 조회
 */
export const selectListCommits = async ({
  octokit,
  username,
  reponame,
  branchname,
}: {
  octokit: Octokit;
  username: string;
  reponame: string;
  branchname?: string;
}) => {
  try {
    const { data } = await octokit.repos.listCommits({
      owner: username,
      repo: reponame,
      sha: branchname,
    });
    return data;
  } catch (error) {
    return undefined;
  }
};

// export const selectCommit = async ({
//   octokit,
//   username,
//   reponame,
//   ref,
// }: {
//   octokit: Octokit;
//   username: string;
//   reponame: string;
//   ref: string;
// }) => {
//   try {
//     const { data } = await octokit.repos.getCommit({
//       username,
//       repo: reponame,
//       ref,
//     });
//     return data;
//   } catch (error) {
//     return undefined;
//   }
// };
