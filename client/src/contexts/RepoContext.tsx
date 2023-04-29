import { createContext, useState } from 'react';
import { Repo } from '../types';

const RepoContext = createContext(
  {} as { repo: Repo | null; setRepo: (repo: Repo) => void }
);

const RepoProvider = ({ children }: { children: React.ReactNode }) => {
  const [repo, setRepo] = useState<Repo | null>(null);

  return (
    <RepoContext.Provider value={{ repo, setRepo }}>
      {children}
    </RepoContext.Provider>
  );
};

export { RepoProvider };
export default RepoContext;
