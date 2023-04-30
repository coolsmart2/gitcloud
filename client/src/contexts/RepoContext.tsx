import { createContext, useContext, useState } from 'react';

type RepoContextType = {
  state: {
    path: string;
    branch: string | null;
  };
  actions: {
    setPath: (path: string) => void;
    setBranch: (branch: string) => void;
  };
};

const RepoContext = createContext<RepoContextType | null>(null);

export const RepoProvider = ({ children }: { children: React.ReactNode }) => {
  const [path, setPath] = useState('/');
  const [branch, setBranch] = useState<string | null>(null);

  return (
    <RepoContext.Provider
      value={{ state: { path, branch }, actions: { setPath, setBranch } }}
    >
      {children}
    </RepoContext.Provider>
  );
};

export const useRepoContext = () => {
  const context = useContext(RepoContext);
  if (!context) {
    throw new Error('useRepoContext must be used within a RepoProvider');
  }
  return context;
};
