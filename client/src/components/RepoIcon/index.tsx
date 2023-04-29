import {
  RiGitRepositoryFill,
  RiGitRepositoryPrivateFill,
} from 'react-icons/ri';
import './index.scss';

interface RepoIconProps {
  name: string;
  private: boolean;
  createdAt: string;
  updatedAt: string;
  checked: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}
export default function RepoIcon({
  name,
  private: _private,
  createdAt,
  updatedAt,
  checked,
  onClick,
}: RepoIconProps) {
  return (
    <div
      className={'repo-container' + (checked ? ' checked' : '')}
      onClick={onClick}
    >
      <div className="repo-image">
        {_private ? (
          <RiGitRepositoryPrivateFill size={70} />
        ) : (
          <RiGitRepositoryFill size={70} />
        )}
      </div>
      <div className="repo-name">{name}</div>
    </div>
  );
}
