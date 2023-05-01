import { useRecoilValue } from 'recoil';
import { useRepoContext } from '../../contexts/RepoContext';
import { repoFileSelector } from '../../recoil/selectors';
import './index.scss';

// todo: 나중에 유틸로 빼주자
const convertBase64ToString = (base64: string) => {
  const decodedString = atob(base64);
  const utf8Decoder = new TextDecoder('utf-8');
  const urf8String = utf8Decoder.decode(
    new Uint8Array([...decodedString].map(char => char.charCodeAt(0)))
  );
  return urf8String;
};

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
        value={convertBase64ToString(file.content)}
      />
    </div>
  );
}
