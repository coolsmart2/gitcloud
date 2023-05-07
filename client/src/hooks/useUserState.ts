import { useRecoilState } from 'recoil';
import { useCallback, useEffect } from 'react';
import { userState } from '../recoil/atoms';
import { UserResponse } from '../types/response.type';

export default function useUserState() {
  const [user, setUser] = useRecoilState(userState); // todo: context api로 변환 생각

  const setUserJson = useCallback((user: UserResponse) => {
    sessionStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  }, []);

  useEffect(() => {
    if (user) {
      return;
    }

    const userJson = sessionStorage.getItem('user');
    if (userJson) {
      setUser(JSON.parse(userJson));
    }
  }, []);

  return [user, setUserJson] as [
    UserResponse | null,
    (user: UserResponse) => void
  ];
}
