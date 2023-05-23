import { atom } from 'recoil';
import { UserResponse } from '../types/response.type';

export const userState = atom<UserResponse | null>({
  key: 'userState',
  default: null,
});
