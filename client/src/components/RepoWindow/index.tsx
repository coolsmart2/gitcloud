import { Link, useLoaderData, useParams } from 'react-router-dom';
import { Repo } from '../../types';
import { RiCloseCircleFill } from 'react-icons/ri';
import './index.scss';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import RepoContext from '../../contexts/RepoContext';
import RepoExplorer from '../RepoExplorer';
import RepoExplorerSkeleton from '../RepoExplorer/skeleton';

const VERTICAL_LINE_WIDTH = 5;

export default function RepoWindow() {
  const { reponame } = useParams() as { reponame: string };
  const [isResizing, setIsResizing] = useState(false);
  const [verticalX, setVerticalX] = useState(300);

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
            <RepoExplorer reponame={reponame} />
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
            width: window.innerWidth - verticalX - VERTICAL_LINE_WIDTH,
            left: verticalX + VERTICAL_LINE_WIDTH,
          }}
        >
          <div className="repo-window__content__editer">에디터</div>
          <div className="repo-window__content__log">로그</div>
        </div>
      </div>
    </div>
  );
}
