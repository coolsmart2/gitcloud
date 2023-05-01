import { useRecoilValue } from 'recoil';
import { useRepoContext } from '../../contexts/RepoContext';
import { repoFileSelector } from '../../recoil/selectors';
import './index.scss';

interface RepoEditorProps {
  reponame: string;
}

export default function RepoEditor({ reponame }: RepoEditorProps) {
  const {
    state: { path, branch },
  } = useRepoContext();

  const file = useRecoilValue(
    repoFileSelector({ reponame, path, ref: branch })
  );

  return (
    <div className="repo-editor-container">
      <div className="repo-editor__title">
        <b>{file.name}</b> {file.path}
      </div>
      <textarea
        className="repo-editor__textarea"
        wrap="off"
        value={file.content}
      />
    </div>
  );
}
