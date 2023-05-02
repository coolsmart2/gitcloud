import { Link, useLocation, useParams } from 'react-router-dom';
import { RiCloseCircleFill } from 'react-icons/ri';
import React, { useEffect, useState } from 'react';
import RepoExplorer from '../RepoExplorer';
import RepoExplorerSkeleton from '../RepoExplorer/skeleton';
import RepoEditor from '../RepoEditor';
import { useRepoContext } from '../../contexts/RepoContext';
import RepoTab from '../RepoTab';
import './index.scss';

const VERTICAL_LINE_WIDTH = 5;

export default function RepoWindow() {
  const query = new URLSearchParams(useLocation().search); // 이런식으로 컴포넌트에 변수를 선언해도 될까?
  const { reponame } = useParams() as { reponame: string };
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [verticalX, setVerticalX] = useState(300);
  const [isResizing, setIsResizing] = useState(false);

  const { workspace, setWorkspace } = useRepoContext();
  const { currPath } = workspace;

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

  const handleMouseDown = () => {
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.body.style.cursor = 'auto';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isResizing) {
      setVerticalX(e.clientX || e.pageX);
    }
  };

  return (
    <div className="repo-window-container">
      <div className="repo-window__header">
        <Link to="/github">
          <RiCloseCircleFill size={35} color="red" cursor={'pointer'} />
        </Link>
      </div>
      <div
        className="repo-window__body"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
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
          <div className="repo-window__content__tab">
            <RepoTab />
          </div>
          <div className="repo-window__content__editor">
            {currPath && (
              <React.Suspense fallback={<div>loading...</div>}>
                <RepoEditor reponame={reponame} />
              </React.Suspense>
            )}
          </div>
          {/* <div className="repo-window__content__log">로그</div> */}
        </div>
      </div>
    </div>
  );
}
