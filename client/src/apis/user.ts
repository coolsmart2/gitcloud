import { defaultAxios } from '.';

export const postTokenAPI = async ({ token }: { token: string }) => {
  const { data } = await defaultAxios.post('/user/token', { token });
  return data;
};
