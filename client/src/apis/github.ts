import { defaultAxios } from '.';

export const postGithubOauth = async ({ code }: { code: string }) => {
  const { data } = await defaultAxios.post('/github/oauth', { code });
  // if
};
