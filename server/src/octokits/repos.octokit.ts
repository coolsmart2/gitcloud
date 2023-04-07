import { Octokit } from '@octokit/rest';
import { Directory, File } from '../types/file.type';

/**
 * 새로운 레포지토리 생성
 */
export const insertRepo = async ({
  octokit,
  repoName,
  isPrivate,
}: {
  octokit: Octokit;
  repoName: string;
  isPrivate: boolean;
}) => {
  await octokit.repos.createForAuthenticatedUser({
    name: repoName,
    private: isPrivate,
  });
};

/**
 * 기존의 레포지토리 삭제
 */
export const removeRepo = async ({
  octokit,
  repoName,
}: {
  octokit: Octokit;
  repoName: string;
}) => {
  await octokit.repos.delete({
    owner: process.env.MY_GITHUB_USERNAME!,
    repo: repoName,
  });
};

/**
 * 전체 레포지토리 목록 조회
 */
export const selectRepos = async ({ octokit }: { octokit: Octokit }) => {
  const { data } = await octokit.repos.listForAuthenticatedUser();
  const repositories = data.map(repo => ({
    name: repo.name,
    private: repo.anonymous_access_enabled,
  }));
  return repositories;
};

/**
 * 레포지토리 조회
 */
export const selectRepo = async ({
  octokit,
  owner,
  repoName,
  path = '',
  ref,
}: {
  octokit: Octokit;
  owner: string;
  repoName: string;
  path?: string;
  ref?: string;
}) => {
  const { data } = await octokit.repos.getContent({
    owner,
    repo: repoName,
    path,
    ref,
  });

  const root = !Array.isArray(data) ? [data] : data;

  const structure: (Directory | File)[] = await Promise.all(
    root.map(async sub => {
      if (sub.type === 'dir') {
        const subPath = `${path}/${sub.name}`;
        const subContents = await selectRepo({
          octokit,
          owner,
          repoName,
          path: subPath,
          ref,
        });
        return {
          name: sub.name,
          type: sub.type,
          path: sub.path.replace(
            sub.name,
            ''
          ) /* 경로에 포한되어 있는 파일 이름 삭제 */,
          sha: sub.sha,
          tree: subContents,
        };
      } else {
        return {
          name: sub.name,
          type: sub.type,
          path: sub.path.replace(sub.name, ''),
          sha: sub.sha,
        };
      }
    })
  );

  return structure;
};

/**
 * path로 파일 위치를 입력하면 파일의 내용을 반환한다.
 * path로 폴더 위치를 입력하면 폴더안의 폴더와 파일을 반환한다.
 */
export const selectFileContent = async ({
  octokit,
  owner,
  repoName,
  path,
  ref,
}: {
  octokit: Octokit;
  owner: string;
  repoName: string;
  path: string;
  ref?: string;
}) => {
  const { data: content } = await octokit.repos.getContent({
    owner,
    repo: repoName,
    path,
    ref,
  });

  return content;
};

export const insertFileContent = async ({
  octokit,
  owner,
  repoName,
  path,
  content,
  message = new Date().toLocaleString('ko-KR', { timeZone: 'UTC' }),
  branchName,
}: {
  octokit: Octokit;
  owner: string;
  repoName: string;
  path: string;
  content: string;
  message?: string;
  branchName?: string;
}) => {
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo: repoName,
    path,
    message,
    content: Buffer.from(content).toString('base64'),
    branch: branchName,
  });
};

export const updateFileContent = async ({
  octokit,
  owner,
  repoName,
  path,
  content,
  sha,
  message = new Date().toLocaleString('ko-KR', { timeZone: 'UTC' }),
}: {
  octokit: Octokit;
  owner: string;
  repoName: string;
  path: string;
  content: string;
  sha: string;
  message?: string;
}) => {
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo: repoName,
    path,
    message,
    content: Buffer.from(content).toString('base64'),
    sha,
  });
};

export const deleteFileContent = async ({
  octokit,
  owner,
  repoName,
  path,
  sha,
  message = new Date().toLocaleString('ko-KR', { timeZone: 'UTC' }),
}: {
  octokit: Octokit;
  owner: string;
  repoName: string;
  path: string;
  sha: string;
  message?: string;
}) => {
  await octokit.repos.deleteFile({
    owner,
    repo: repoName,
    path,
    message,
    sha,
  });
};

export const selectListCommits = async ({
  octokit,
  owner,
  repo,
}: {
  octokit: Octokit;
  owner: string;
  repo: string;
}) => {
  try {
    const { data } = await octokit.repos.listCommits({
      owner,
      repo,
    });
    return data;
  } catch (error) {
    return undefined;
  }
};

export const selectCommit = async ({
  octokit,
  owner,
  repo,
  ref,
}: {
  octokit: Octokit;
  owner: string;
  repo: string;
  ref: string;
}) => {
  try {
    const { data } = await octokit.repos.getCommit({
      owner,
      repo,
      ref,
    });
    return data;
  } catch (error) {
    return undefined;
  }
};
