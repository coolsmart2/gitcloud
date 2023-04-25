import { useState } from 'react';
import { User } from '../types';

export default function useUserState() {
  const [user, setUser] = useState<User>();
  return {};
}
