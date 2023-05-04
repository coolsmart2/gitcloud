import { Link, useLocation, useParams } from 'react-router-dom';
import { RiCloseCircleFill } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import RepoExplorer from '../RepoExplorer';
import RepoEditor from '../RepoEditor';
import { useRepoActions, useRepoValue } from '../../contexts/RepoContext';
import RepoTab from '../RepoTab';
import './index.scss';

const VERTICAL_LINE_WIDTH = 5;
const directoryItems = [
  { label: '새 파일', onClick: () => {} },
  { label: '새 폴더', onClick: () => {} },
  { label: '이름 바꾸기', onClick: () => {} },
  { label: '삭제', onClick: () => {} },
];
const fileItems = [
  { label: '이름 바꾸기', onClick: () => {} },
  { label: '삭제', onClick: () => {} },
];

export default function RepoWindow() {
  const { reponame } = useParams() as { reponame: string };
  const query = new URLSearchParams(useLocation().search); // 이런식으로 컴포넌트에 변수를 선언해도 될까?

  const { tab } = useRepoValue();
  const { setReponame, setBranchname, removeFocusedPath } = useRepoActions();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [verticalX, setVerticalX] = useState(300);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = () => {
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.body.style.cursor = 'auto';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing) {
      setVerticalX(
        Math.max(
          0,
          Math.min(e.clientX || e.pageX, windowWidth - VERTICAL_LINE_WIDTH)
        )
      );
    }
  };

  useEffect(() => {
    setReponame(reponame);
    setBranchname(query.get('ref'));
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth);
    });
    return () => {
      window.removeEventListener('resize', () => {
        setWindowWidth(window.innerWidth);
      });
    };
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div
      className="repo-window-container"
      onMouseDown={() => {
        removeFocusedPath();
      }}
    >
      <div className="repo-window__header">
        <h1 className="repo-window__title">{reponame}</h1>
        <Link to="/github">
          <RiCloseCircleFill size={35} color="red" cursor={'pointer'} />
        </Link>
      </div>
      <div className="repo-window__body">
        <div className="repo-window__sidebar" style={{ width: verticalX }}>
          <RepoExplorer />
        </div>
        <div
          className="repo-window__vertical"
          style={{ left: verticalX }}
          onMouseDown={handleMouseDown}
        />
        <div
          className="repo-window__content"
          style={{
            width: windowWidth - verticalX - VERTICAL_LINE_WIDTH,
            left: verticalX + VERTICAL_LINE_WIDTH,
          }}
        >
          {tab.length > 0 && (
            <>
              <div className="repo-window__content__tab">
                <RepoTab />
              </div>
              <div className="repo-window__content__editor">
                <RepoEditor />
              </div>
            </>
          )}
        </div>
      </div>
      {/* {directory && <ContextMenu items={directoryItems} />}
      {file && <ContextMenu items={fileItems} />} */}
    </div>
  );
}
