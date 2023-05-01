import { Outlet, useLoaderData, useNavigate } from 'react-router-dom';
import { RepoInfo } from '../../types';
import RepoIcon from '../../components/RepoIcon';
import React, { useState } from 'react';
import './index.scss';

export default function GitHub() {
  const repos = useLoaderData() as RepoInfo[];
  const navigate = useNavigate();

  const [checkedRepo, setCheckedRepo] = useState<string | null>(null);

  const handleRepoClick = ({
    name,
    defaultBranch,
  }: {
    name: string;
    defaultBranch: string;
  }) => {
    return (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      setCheckedRepo(name);
      if (e.detail == 2) {
        navigate(`/github/${name}?ref=${defaultBranch}`);
      }
    };
  };

  return (
    <div className="github-container">
      <main
        className="github-background"
        onContextMenu={e => {
          e.preventDefault();
          console.log(e.currentTarget);
        }}
        onClick={() => setCheckedRepo(null)}
      >
        {repos.map(repo => (
          <RepoIcon
            key={repo.id}
            checked={checkedRepo === repo.name}
            onClick={handleRepoClick({
              name: repo.name,
              defaultBranch: repo.defaultBranch,
            })}
            {...repo}
          />
        ))}
      </main>
      <section className="github-repo">
        <Outlet />
      </section>
    </div>
  );
}
