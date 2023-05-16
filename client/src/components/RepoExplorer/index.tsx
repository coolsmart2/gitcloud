import { useCallback, useEffect } from 'react';
import Directory from '../Directory';
import File from '../File';
import { useRepoActions, useRepoValue } from '../../contexts/RepoContext';
import RepoExplorerSkeleton from './skeleton';
import { getGitHubRepoAPI } from '../../apis/github';
import './index.scss';

export default function RepoExplorer() {
  const { reponame, branchname, explorer, commitList } = useRepoValue();
  const { setExplorer, showContextMenu } = useRepoActions();

  const fetchExplorer = async () => {
    if (reponame && branchname) {
      const { data } = await getGitHubRepoAPI({ reponame, branchname });
      setExplorer(data);
    }
  };

  useEffect(() => {
    if (!reponame || !branchname) {
      return;
    }
    if (commitList.currBranch === branchname) {
      return;
    }
    if (!explorer) {
      fetchExplorer();
    }
  }, [explorer, reponame, branchname]);

  const handleExplorerContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      showContextMenu('explorer', undefined, {
        x: e.clientX || e.pageX,
        y: e.clientY || e.pageY,
      });
    },
    []
  );

  if (!reponame || !branchname || !explorer) {
    return <RepoExplorerSkeleton />;
  }

  return (
    <div
      className="repo-explorer-container"
      onContextMenu={handleExplorerContextMenu}
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
