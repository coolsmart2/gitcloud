import {
  CachedFileState,
  DirectoryInfo,
  Explorer,
  FileInfo,
} from '../types/repo.type';
import { FileResponse, TreeBlobResponse } from '../types/response.type';

export const convertTreeBlobResponseToExplorer = (
  treeBlob: TreeBlobResponse[],
  basePath = ''
): Explorer => {
  return treeBlob.map(item => {
    if ('tree' in item) {
      return {
        path: `${basePath}${item.path}`,
        originalPath: `${basePath}${item.path}`,
        name: item.path,
        children: convertTreeBlobResponseToExplorer(
          item.tree!,
          `${basePath}${item.path}/`
        ),
      } as DirectoryInfo;
    }
    return {
      path: `${basePath}${item.path}`,
      originalPath: `${basePath}${item.path}`,
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

export const findFileDirectory = (
  explorer: Explorer,
  path: string | null
): FileInfo | undefined => {
  if (!path) return;
  for (const item of explorer) {
    if ('type' in item) {
      continue;
    }
    if ('children' in item) {
      const fileDir = findFileDirectory(item.children, path);
      if (fileDir) {
        return fileDir;
      }
    }
    if (item.path === path) {
      return item;
    }
  }
};

export const initExplorer = (explorer: Explorer) => {
  for (const item of explorer) {
    if ('type' in item) {
      continue;
    }
    if ('children' in item) {
      initExplorer(item.children);
    }
  }
};

export const removeFileFromExplorer = (explorer: Explorer, info: FileInfo) => {
  for (let i = 0; i < explorer.length; i++) {
    const temp = explorer[i];
    if ('type' in temp) {
      continue;
    }
    if ('children' in temp) {
      removeFileFromExplorer(temp.children, info);
    }
    if (temp.path === info.path) {
      explorer.splice(i, 1);
      return;
    }
  }
};

export const addFileToExplorer = (explorer: Explorer, info: FileInfo) => {
  const pathArr = info.path.split('/');

  let currExplorer = explorer;
  for (let i = 0; i < pathArr.length; i++) {
    for (const item of currExplorer) {
      if ('type' in item) {
        continue;
      }
      if ('children' in item && item.name === pathArr[i]) {
        currExplorer = item.children;
        break;
      }
    }
  }

  currExplorer.push({
    ...info,
  });

  // 폴더 우선순위로 정렬 후 파일 정렬 (이름 순)
  currExplorer.sort((a, b) => {
    if ('children' in a && 'children' in b) {
      return 0;
    }
    if ('children' in a) {
      return -1;
    }
    if ('children' in b) {
      return 1;
    }
    return a.path.localeCompare(b.path);
  });
};
