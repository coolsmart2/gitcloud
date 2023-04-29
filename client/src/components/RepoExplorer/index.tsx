import { useRecoilValue } from 'recoil';
import { repoExplorerSelector } from '../../recoil/selectors';
import './index.scss';
import Directory from '../Directory';
import File from '../File';

interface RepoExplorerProps {
  reponame: string;
}

export default function RepoExplorer({ reponame }: RepoExplorerProps) {
  const tree = useRecoilValue(repoExplorerSelector(reponame));
  return (
    <div className="repo-explorer-container">
      {tree.map(data => {
        if (data.type === 'dir') {
          return (
            <Directory
              name={data.name}
              depth={1}
              tree={data.tree!}
              key={data.sha}
            />
          );
        }
        return <File name={data.name} depth={1} key={data.sha} />;
      })}
    </div>
  );
}
