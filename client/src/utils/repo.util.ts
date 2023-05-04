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

export const convertBase64ToString = (base64: string) => {
  const decodedString = atob(base64);
  const utf8Decoder = new TextDecoder('utf-8');
  const urf8String = utf8Decoder.decode(
    new Uint8Array([...decodedString].map(char => char.charCodeAt(0)))
  );
  return urf8String;
};
