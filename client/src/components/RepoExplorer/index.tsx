import { useEffect } from 'react';
import Directory from '../Directory';
import File from '../File';
import { useRepoActions, useRepoValue } from '../../contexts/RepoContext';
import RepoExplorerSkeleton from './skeleton';
import { getGitHubRepoAPI } from '../../apis/github';
import './index.scss';

export default function RepoExplorer() {
  const { reponame, branchname, explorer } = useRepoValue();
  const { setExplorer, showContextMenu } = useRepoActions();

  const fetchExplorer = async () => {
    if (reponame && branchname) {
      const { data } = await getGitHubRepoAPI({ reponame, branchname });
      setExplorer(data);
    }
  };

  useEffect(() => {
    if (!explorer) {
      fetchExplorer();
    }
  }, [explorer, reponame, branchname]);

  if (!reponame || !branchname || !explorer) {
    return <RepoExplorerSkeleton />;
  }

  return (
    <div
      className="repo-explorer-container"
      onContextMenu={e => {
        e.preventDefault();
        e.stopPropagation();
        showContextMenu('explorer', undefined, {
          x: e.clientX || e.pageX,
          y: e.clientY || e.pageY,
        });
      }}
    >
      {explorer.map(item => {
        if ('children' in item) {
          return <Directory depth={1} info={item} key={item.path} />;
        } else if ('type' in item) {
        } else {
          return <File depth={1} info={item} key={item.path} />;
        }
      })}
    </div>
  );
}
