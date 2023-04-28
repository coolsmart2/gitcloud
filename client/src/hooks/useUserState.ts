import { useRecoilState } from 'recoil';
import { userState } from '../recoil/atoms';
import { useCallback, useEffect } from 'react';
import { User } from '../types';

export default function useUserState() {
  const [user, setUser] = useRecoilState(userState);

  const setUserJson = useCallback((user: User) => {
    sessionStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  }, []);

  useEffect(() => {
    const userJson = sessionStorage.getItem('user');
    if (userJson) {
      setUser(JSON.parse(userJson));
    }
  }, []);

  return [user, setUserJson] as [User | null, (user: User) => void];
}
