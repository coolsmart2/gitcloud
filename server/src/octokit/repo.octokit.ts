import { Octokit } from '@octokit/rest';

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
  const repositories = data.map(repo => repo.name);
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

  if (Array.isArray(data)) {
    const files: any = await Promise.all(
      data.map(async sub => {
        if (sub.type === 'file') {
          return sub.name;
        } else if (sub.type === 'dir') {
          const subPath = `${path}/${sub.name}`;
          const subContents = await selectRepo({
            octokit,
            owner,
            repoName,
            path: subPath,
            ref,
          });
          return {
            [sub.name]: subContents,
          };
        } else {
          return sub.name;
        }
      })
    );

    console.log(files);
    return files.filter(Boolean);
  }

  return data.name;
};
