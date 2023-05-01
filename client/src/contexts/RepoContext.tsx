import { createContext, useContext, useState } from 'react';
import { Workspace } from '../types';

type RepoContextType = {
  workspace: Workspace;
  setWorkspace: (workspace: Workspace) => void;
};

const RepoContext = createContext<RepoContextType | null>(null);

export const RepoProvider = ({ children }: { children: React.ReactNode }) => {
  const [workspace, setWorkspace] = useState<Workspace>({
    currPath: undefined,
    currBranch: undefined,
    tab: [],
    changedFiles: {},
  });

  return (
    <RepoContext.Provider value={{ workspace, setWorkspace }}>
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
