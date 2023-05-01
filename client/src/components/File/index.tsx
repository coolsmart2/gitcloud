import { GoFile } from 'react-icons/go';
import './index.scss';
import { useRepoContext } from '../../contexts/RepoContext';
import { ChangedFile } from '../../types';

interface FileProps {
  depth: number;
  name: string;
  path: string;
}

export default function File({ name, path, depth }: FileProps) {
  const { workspace, setWorkspace } = useRepoContext();
  const { tab, changedFiles } = workspace;
  const isChanged =
    changedFiles[path]?.originalContent !== changedFiles[path]?.changedContent;

  return (
    <div
      className={`file-wrapper${isChanged ? ' changed' : ''}`}
      style={{ paddingLeft: `${10 * depth + 23}px` }}
      onClick={() => {
        const newWorkspace = {
          ...workspace,
          currPath: path,
          tab: [...tab, path],
        };

        setWorkspace(newWorkspace);
      }}
    >
      <GoFile className="file__icon" size={18} />
      <div className="file__name">{name}</div>
    </div>
  );
}
