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
      <div>{file.name}</div>
      <hr />
      <div>{file.path}</div>
      <hr />
      <textarea value={file.content} style={{ width: '90%', height: '90%' }} />
    </div>
  );
}
