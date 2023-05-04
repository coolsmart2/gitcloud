import { useEffect } from 'react';
import Directory from '../Directory';
import File from '../File';
import { useRepoActions, useRepoValue } from '../../contexts/RepoContext';
import RepoExplorerSkeleton from './skeleton';
import { getGitHubRepoAPI } from '../../apis/github';
import './index.scss';

interface RepoExplorerProps {
  reponame: string;
  branchname?: string;
}

export default function RepoExplorer({
  reponame,
  branchname,
}: RepoExplorerProps) {
  const { explorer } = useRepoValue();
  const { setExplorer } = useRepoActions();

  const fetchExplorer = async () => {
    const { data } = await getGitHubRepoAPI({ reponame, branchname });
    setExplorer(data);
  };

  useEffect(() => {
    if (!explorer) {
      fetchExplorer();
    }
  }, [explorer]);

  if (!explorer || !branchname) {
    return <RepoExplorerSkeleton />;
  }

  return (
    <div className="repo-explorer-container">
      {explorer.map(item => {
        if ('children' in item) {
          return (
            <Directory
              depth={1}
              name={item.name}
              path={item.path}
              children={item.children}
              key={item.path}
            />
          );
        }
        return (
          <File depth={1} name={item.name} path={item.path} key={item.path} />
        );
      })}
    </div>
  );
}
