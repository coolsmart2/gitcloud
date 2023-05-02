import { useRepoContext } from '../../contexts/RepoContext';
import { RiCloseFill } from 'react-icons/ri';
import './index.scss';

const removeTab = (tab: string[], path: string) => {
  return tab.filter(item => item !== path);
};

export default function RepoTab() {
  const { workspace, setWorkspace } = useRepoContext();
  const { currPath, tab } = workspace;

  const handleCloseMouseDown = (path: string) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      const newTab = removeTab(tab, path);
      const newCurrPath =
        currPath === path ? newTab[newTab.length - 1] : currPath;
      setWorkspace({ ...workspace, tab: newTab, currPath: newCurrPath });
    };
  };

  const handleTabMouseDown = (path: string) => {
    return (e: React.MouseEvent) => {
      // 마우스 좌클릭
      if (e.button === 0) {
        setWorkspace({ ...workspace, currPath: path });
      }
      // 마우스 휠클릭
      if (e.button === 1) {
        e.preventDefault();
        handleCloseMouseDown(path)(e);
      }
    };
  };

  return (
    <div className="repo-tab-container">
      <div className="repo-tab">
        {tab.map((path, index) => {
          const filename = path.split('/').pop();
          const isActive = currPath === path;
          return (
            <div
              className={`repo-tab__item${isActive ? ' active' : ''}`}
              key={index}
              onMouseDown={handleTabMouseDown(path)}
              draggable
            >
              {filename}
              <RiCloseFill
                size={20}
                color="gray"
                cursor={'pointer'}
                onMouseDown={handleCloseMouseDown(path)}
              />
            </div>
          );
        })}
      </div>
      <div className="repo-tab__path">{currPath?.split('/').join(' > ')}</div>
    </div>
  );
}
