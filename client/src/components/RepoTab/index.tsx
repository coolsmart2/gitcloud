import { useRepoActions, useRepoValue } from '../../contexts/RepoContext';
import { RiCloseFill } from 'react-icons/ri';
import './index.scss';
import { FileInfo } from '../../types/repo.type';

export default function RepoTab() {
  const { selectedFile, tab } = useRepoValue();
  const { selectTab, removeTab } = useRepoActions();

  const handleCloseMouseDown = (info: FileInfo) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      removeTab(info);
    };
  };

  const handleTabMouseDown = (info: FileInfo) => {
    return (e: React.MouseEvent) => {
      // 마우스 좌클릭
      if (e.button === 0) {
        e.stopPropagation(); // 왜 버블링을 막아줘야 동작하는지 모름
        selectTab(info);
      }
      // 마우스 휠클릭
      if (e.button === 1) {
        e.preventDefault();
        removeTab(info);
      }
    };
  };

  return (
    <div className="repo-tab-container">
      <div className="repo-tab">
        {tab.map((file, index) => {
          const { path } = file;
          const name = path.split('/').pop();
          return (
            <div
              className={`repo-tab__item${
                selectedFile?.originalPath === file.originalPath
                  ? ' active'
                  : ''
              }`}
              onMouseDown={handleTabMouseDown(file)}
              draggable
              key={index}
            >
              {name}
              <RiCloseFill
                size={20}
                color="gray"
                cursor={'pointer'}
                onMouseDown={handleCloseMouseDown(file)}
              />
            </div>
          );
        })}
      </div>
      <div className="repo-tab__path">
        {selectedFile?.path?.split('/').join(' > ')}
      </div>
    </div>
  );
}
