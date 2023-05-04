import { CachedFileState, DirectoryInfo, FileInfo } from '../types/repo.type';
import { FileResponse, TreeBlobResponse } from '../types/response';

export const convertTreeBlobResponseToExplorer = (
  treeBlob: TreeBlobResponse[],
  basePath = ''
): (FileInfo | DirectoryInfo)[] => {
  return treeBlob.map(item => {
    if ('tree' in item) {
      return {
        path: `${basePath}${item.path}`,
        name: item.path,
        children: convertTreeBlobResponseToExplorer(
          item.tree!,
          `${basePath}${item.path}/`
        ),
      } as DirectoryInfo;
    }
    return {
      path: `${basePath}${item.path}`,
      name: item.path,
    } as FileInfo;
  });
};

export const addCachedFile = (
  fileResponse: FileResponse,
  cachedFiles: Record<string, CachedFileState>
) => {
  return {
    ...cachedFiles,
    [fileResponse.path]: { content: fileResponse.content },
  };
};
