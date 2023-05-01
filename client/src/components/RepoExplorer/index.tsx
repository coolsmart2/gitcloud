import { useRecoilValue } from 'recoil';
import { repoExplorerSelector } from '../../recoil/selectors';
import './index.scss';
import Directory from '../Directory';
import File from '../File';

interface RepoExplorerProps {
  reponame: string;
  branchname?: string;
}

export default function RepoExplorer({
  reponame,
  branchname,
}: RepoExplorerProps) {
  const tree = useRecoilValue(repoExplorerSelector({ reponame, branchname }));
  return (
    <div className="repo-explorer-container">
      {tree.map(item => {
        if (item.type === 'tree') {
          return (
            <Directory
              depth={1}
              name={item.path}
              path={item.path}
              tree={item.tree!}
              key={item.sha}
            />
          );
        }
        return (
          <File depth={1} name={item.path} path={item.path} key={item.sha} />
        );
      })}
    </div>
  );
}
