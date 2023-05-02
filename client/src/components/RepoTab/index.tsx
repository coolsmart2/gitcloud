import { useRepoContext } from '../../contexts/RepoContext';
import { RiCloseFill } from 'react-icons/ri';
import './index.scss';

const removeTab = (tab: string[], path: string) => {
  return tab.filter(item => item !== path);
};

export default function RepoTab() {
  const { workspace, setWorkspace } = useRepoContext();
  const { currPath, tab } = workspace;

  const handleTabClick = (path: string) => {
    return () => {
      setWorkspace({ ...workspace, currPath: path });
    };
  };

  const handleTabRemove = (path: string) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      const newTab = removeTab(tab, path);
      const newCurrPath =
        currPath === path ? newTab[newTab.length - 1] : currPath;
      setWorkspace({ ...workspace, tab: newTab, currPath: newCurrPath });
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
              onClick={handleTabClick(path)}
            >
              {filename}
              <RiCloseFill
                size={20}
                color="gray"
                cursor={'pointer'}
                onClick={handleTabRemove(path)}
              />
            </div>
          );
        })}
      </div>
      <div className="repo-tab__path">{currPath?.split('/').join(' > ')}</div>
    </div>
  );
}
