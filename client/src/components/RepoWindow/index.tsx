import { Link, useLocation, useParams } from 'react-router-dom';
import { RiCloseCircleFill } from 'react-icons/ri';
import React, { useEffect, useState } from 'react';
import RepoExplorer from '../RepoExplorer';
import RepoExplorerSkeleton from '../RepoExplorer/skeleton';
import RepoEditor from '../RepoEditor';
import { useRepoContext } from '../../contexts/RepoContext';
import RepoTab from '../RepoTab';
import './index.scss';
import RepoEditorSkeleton from '../RepoEditor/skeleton';
import ContextMenu from '../ContextMenu';

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
  const query = new URLSearchParams(useLocation().search); // 이런식으로 컴포넌트에 변수를 선언해도 될까?
  const { reponame } = useParams() as { reponame: string };
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [verticalX, setVerticalX] = useState(300);
  const [isResizing, setIsResizing] = useState(false);

  const {
    state: {
      workspace,
      contextMenu: { file, directory },
    },
    action: { setWorkspace, closeAllContextMenus },
  } = useRepoContext();

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
    setWorkspace({ ...workspace, currBranch: query.get('ref') ?? undefined });
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
        closeAllContextMenus();
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
          <React.Suspense fallback={<RepoExplorerSkeleton />}>
            <RepoExplorer
              reponame={reponame}
              branchname={query.get('ref') ?? undefined}
            />
          </React.Suspense>
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
          {workspace.currPath && (
            <>
              <div className="repo-window__content__tab">
                <RepoTab />
              </div>
              <div className="repo-window__content__editor">
                <React.Suspense fallback={<RepoEditorSkeleton />}>
                  <RepoEditor reponame={reponame} />
                </React.Suspense>
              </div>
            </>
          )}
        </div>
      </div>
      {directory && <ContextMenu items={directoryItems} />}
      {file && <ContextMenu items={fileItems} />}
    </div>
  );
}
