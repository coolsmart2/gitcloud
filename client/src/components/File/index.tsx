import { GoFile } from 'react-icons/go';
import './index.scss';
import { useRepoContext } from '../../contexts/RepoContext';

// todo: 유틸로 옮기기
const addTab = (tab: string[], path: string) => {
  if (tab.includes(path)) {
    return tab;
  }
  return [...tab, path];
};

interface FileProps {
  depth: number;
  name: string;
  path: string;
}

export default function File({ name, path, depth }: FileProps) {
  const {
    state: { workspace },
    action: { setWorkspace, openContextMenu, setMousePos },
  } = useRepoContext();
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
          tab: addTab(tab, path),
        };
        setWorkspace(newWorkspace);
      }}
      onContextMenu={e => {
        e.preventDefault();
        openContextMenu('file');
        setMousePos({ x: e.clientX || e.pageX, y: e.clientY || e.pageY });
      }}
    >
      <GoFile className="file__icon" size={18} />
      <div className="file__name">{name}</div>
    </div>
  );
}
