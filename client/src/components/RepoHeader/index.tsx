import { Link } from 'react-router-dom';
import { RiCloseCircleFill } from 'react-icons/ri';
import './index.scss';
import { useRepoValue } from '../../contexts/RepoContext';
import { postGitHubCommitAPI } from '../../apis/github';
import { convertChangedFilesToTree } from '../../utils/repo.util';

interface RephHeaderProps {
  reponame: string;
  branchname: string;
}

export default function RepoHeader({ reponame, branchname }: RephHeaderProps) {
  const { changedFiles } = useRepoValue();

  return (
    <div className="repo-header">
      <div className="repo-header__title">
        <span className="repo-title__reponame">{reponame}</span>
        <span className="repo-title__branchname">{branchname}</span>
      </div>
      <div className="repo-header__options">
        <button className="repo-options__branch">브랜치 이동</button>
        <button className="repo-options__list">저장기록</button>
        <button
          className="repo-options__save"
          onClick={async () => {
            console.log(changedFiles);
            try {
              const data = await postGitHubCommitAPI({
                reponame,
                ref: branchname,
                tree: convertChangedFilesToTree(changedFiles),
              });
              console.log(data);
            } catch (err) {
              console.log(err);
            }
          }}
        >
          저장하기
        </button>
      </div>
      <Link to="/github">
        <RiCloseCircleFill size={35} color="red" cursor={'pointer'} />
      </Link>
    </div>
  );
}
