import { Link, useLoaderData, useParams } from 'react-router-dom';
import { Repo } from '../../types';
import { RiCloseCircleFill } from 'react-icons/ri';
import './index.scss';
import React, { useContext, useEffect } from 'react';
import RepoContext from '../../contexts/RepoContext';
import RepoExplorer from '../RepoExplorer';
import RepoExplorerSkeleton from '../RepoExplorer/skeleton';

export default function RepoWindow() {
  const repo = useLoaderData() as Repo;
  const { reponame } = useParams() as { reponame: string };
  const { setRepo } = useContext(RepoContext);

  useEffect(() => {
    setRepo(repo);
  }, []);

  return (
    <div className="repo-window-container">
      <div className="repo-window__header">
        <Link to="/github">
          <RiCloseCircleFill size={35} color="red" cursor={'pointer'} />
        </Link>
      </div>
      <div className="repo-window__body">
        <React.Suspense fallback={<RepoExplorerSkeleton />}>
          <RepoExplorer reponame={reponame} />
        </React.Suspense>
        <div className="repo-content__content">
          <div className="repo-content__content__editer">에디터</div>
          <div className="repo-content__content__log">로그</div>
        </div>
      </div>
    </div>
  );
}
