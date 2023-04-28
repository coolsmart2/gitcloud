import { useLoaderData } from 'react-router-dom';
import './index.scss';
import { Repo } from '../../types';

export default function GitHub() {
  const repos = useLoaderData() as Repo[];
  return (
    <div className="github-container">
      {repos.map(repo => (
        <div key={repo.id}>
          {repo.name} : {repo.private == true ? 'true' : 'false'}
        </div>
      ))}
    </div>
  );
}
