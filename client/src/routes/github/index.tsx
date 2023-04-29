import { useLoaderData, useNavigate } from 'react-router-dom';
import { Repo } from '../../types';
import Repository from '../../components/Repository';
import { useState } from 'react';
import './index.scss';

export default function GitHub() {
  const repos = useLoaderData() as Repo[];
  const navigate = useNavigate();

  const [checkedRepo, setCheckedRepo] = useState<string | null>(null);

  const handleRepoClick = (name: string) => {
    return (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      setCheckedRepo(name);
      if (e.detail == 2) {
        navigate(`/github/${name}`);
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
          <Repository
            key={repo.id}
            checked={checkedRepo === repo.name}
            onClick={handleRepoClick(repo.name)}
            {...repo}
          />
        ))}
      </main>
    </div>
  );
}
