import { useEffect } from 'react';
import { getGitHubFileAPI } from '../../apis/github';
import { useRepoActions, useRepoValue } from '../../contexts/RepoContext';
import RepoEditorSkeleton from './skeleton';
import './index.scss';

export default function RepoEditor() {
  const { reponame, branchname, selectedFile, cachedFiles, changedFiles } =
    useRepoValue();
  const { cacheFile, modifyFile, removeChangedFile } = useRepoActions();

  const content =
    selectedFile &&
    (changedFiles[selectedFile.path]?.content ||
      cachedFiles[selectedFile.originalPath]?.content);

  const fetchFile = async () => {
    for (const path in changedFiles) {
      if (path === selectedFile?.path && changedFiles[path].state === 'added') {
        return;
      }
    }

    if (
      reponame &&
      branchname &&
      selectedFile &&
      !cachedFiles[selectedFile.originalPath]
    ) {
      const { data } = await getGitHubFileAPI({
        reponame,
        path: selectedFile.originalPath,
        ref: branchname,
      });
      cacheFile(data.path, data.content);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedFile && selectedFile.originalPath in cachedFiles) {
      const { value } = e.target;
      if (cachedFiles[selectedFile.originalPath].content !== value) {
        modifyFile(selectedFile, value);
      } else {
        removeChangedFile(selectedFile);
      }
    }
  };

  useEffect(() => {
    fetchFile();
  }, [selectedFile]);

  if (!reponame || !branchname || !selectedFile || !content) {
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
