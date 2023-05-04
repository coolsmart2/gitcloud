import { useRepoActions, useRepoValue } from '../../contexts/RepoContext';
import { RiCloseFill } from 'react-icons/ri';
import './index.scss';

export default function RepoTab() {
  const { selectedPath, tab } = useRepoValue();
  const { selectTab, removeTab } = useRepoActions();

  const handleCloseMouseDown = (path: string) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      removeTab(path);
    };
  };

  const handleTabMouseDown = (path: string) => {
    return (e: React.MouseEvent) => {
      // 마우스 좌클릭
      if (e.button === 0) {
        e.stopPropagation(); // 왜 버블링을 막아줘야 동작하는지 모름
        selectTab(path);
      }
      // 마우스 휠클릭
      if (e.button === 1) {
        e.preventDefault();
        removeTab(path);
      }
    };
  };

  return (
    <div className="repo-tab-container">
      <div className="repo-tab">
        {tab.map((path, index) => {
          const name = path.split('/').pop();
          return (
            <div
              className={`repo-tab__item${
                selectedPath === path ? ' active' : ''
              }`}
              onMouseDown={handleTabMouseDown(path)}
              draggable
              key={path}
            >
              {name}
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
      <div className="repo-tab__path">
        {selectedPath?.split('/').join(' > ')}
      </div>
    </div>
  );
}
