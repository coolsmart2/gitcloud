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
  const { workspace, setWorkspace } = useRepoContext();
  const { currPath, changedFiles } = workspace;

  const file = useRecoilValue(
    repoFileSelector({
      reponame,
      path: workspace.currPath!,
      ref: workspace.currBranch,
    })
  );

  useEffect(() => {
    if (!currPath) {
      return;
    }
    if (!(currPath in changedFiles)) {
      const originalContent = convertBase64ToString(file.content);
      setWorkspace({
        ...workspace,
        changedFiles: {
          ...changedFiles,
          [currPath]: {
            changedContent: originalContent,
            originalContent,
          },
        },
      });
    }
  }, [currPath]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWorkspace({
      ...workspace,
      changedFiles: {
        ...changedFiles,
        [currPath!]: {
          ...changedFiles[currPath!],
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
        value={changedFiles[currPath!]?.changedContent}
        onChange={handleChange}
      />
    </div>
  );
}
