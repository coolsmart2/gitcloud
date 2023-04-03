import { Octokit } from '@octokit/rest';

/**
 * path로 파일 위치를 입력하면 파일의 내용을 반환한다.
 * path로 폴더 위치를 입력하면 폴더안의 폴더와 파일을 반환한다.
 */
export const selectContent = async ({
  octokit,
  owner,
  repo,
  path,
}: {
  octokit: Octokit;
  owner: string;
  repo: string;
  path: string;
}) => {
  try {
    const { data: content } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    return content;
  } catch (error) {
    return undefined;
  }
};
