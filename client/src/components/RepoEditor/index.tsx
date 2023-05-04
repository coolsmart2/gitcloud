import { useRecoilValue } from 'recoil';
import { useRepoContext } from '../../contexts/RepoContext';
import { repoFileSelector } from '../../recoil/selectors';
import './index.scss';
import { useEffect } from 'react';

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
    state: { workspace },
    action: { setWorkspace },
  } = useRepoContext();
  const { selected, changedFiles } = workspace;

  const file = useRecoilValue(
    repoFileSelector({
      reponame,
      path: workspace.selected!,
      ref: workspace.branch,
    })
  );

  useEffect(() => {
    if (!selected) {
      return;
    }
    if (!(selected in changedFiles)) {
      const originalContent = convertBase64ToString(file.content);
      setWorkspace({
        ...workspace,
        changedFiles: {
          ...changedFiles,
          [selected]: {
            changedContent: originalContent,
            originalContent,
          },
        },
      });
    }
  }, [selected]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWorkspace({
      ...workspace,
      changedFiles: {
        ...changedFiles,
        [selected!]: {
          ...changedFiles[selected!],
          changedContent: e.target.value,
        },
      },
    });
  };

  return (
    <div className="repo-editor-container">
      <textarea
        className="repo-editor__textarea"
        wrap="off"
        value={changedFiles[selected!]?.changedContent}
        onChange={handleChange}
      />
    </div>
  );
}
