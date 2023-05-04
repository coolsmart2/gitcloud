import { useEffect } from 'react';
import { getGitHubFileAPI } from '../../apis/github';
import { useRepoActions, useRepoValue } from '../../contexts/RepoContext';
import RepoEditorSkeleton from './skeleton';
import './index.scss';

export default function RepoEditor() {
  const { reponame, branchname, selectedPath, cachedFiles, changedFiles } =
    useRepoValue();
  const { cacheFile, modifyFile, popFile } = useRepoActions();

  const content =
    selectedPath &&
    (changedFiles[selectedPath]?.content || cachedFiles[selectedPath]?.content);

  const fetchFile = async () => {
    if (reponame && branchname && selectedPath && !cachedFiles[selectedPath]) {
      const { data } = await getGitHubFileAPI({
        reponame,
        path: selectedPath,
        ref: branchname,
      });
      cacheFile(data.path, data.content);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedPath && selectedPath in cachedFiles) {
      const { value } = e.target;
      if (cachedFiles[selectedPath].content !== value) {
        modifyFile(selectedPath, value);
      } else {
        popFile(selectedPath);
      }
    }
  };

  useEffect(() => {
    fetchFile();
  }, [selectedPath]);

  if (!reponame || !branchname || !selectedPath || !content) {
    return <RepoEditorSkeleton />;
  }

  return (
    <div className="repo-editor-container">
      <textarea
        className="repo-editor__textarea"
        wrap="off"
        value={content}
        onChange={handleChange}
      />
    </div>
  );
}
