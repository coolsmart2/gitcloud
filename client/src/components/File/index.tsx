import { GoFile } from 'react-icons/go';
import './index.scss';
import { useRepoActions, useRepoValue } from '../../contexts/RepoContext';

interface FileProps {
  depth: number;
  name: string;
  path: string;
}

export default function File({ name, path, depth }: FileProps) {
  const { selectedPath, focusedPath, changedFiles, cachedFiles } =
    useRepoValue();
  const { selectFile } = useRepoActions();
  const isModified = path in changedFiles;

  return (
    <div
      className={`file-wrapper${isModified ? ' modified' : ''}${
        path === selectedPath ? ' selected' : ''
      }${path === focusedPath ? ' focused' : ''}`}
      style={{ paddingLeft: `${10 * depth + 23}px` }}
      onClick={() => {
        selectFile(path);
      }}
      onContextMenu={e => {
        e.preventDefault();
      }}
    >
      <GoFile className="file__icon" size={18} />
      <div className="file__name">{name}</div>
    </div>
  );
}
