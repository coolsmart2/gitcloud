import {
  CachedFileState,
  ChangedFileDirectoryState,
  DirectoryInfo,
  Explorer,
  FileInfo,
  Tree,
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
  path: string | undefined
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
    if (item.path === path && item.name !== '') {
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

export const removeRenamingFile = (explorer: Explorer) => {
  for (const item of explorer) {
    if ('type' in item) {
      continue;
    } else if ('children' in item) {
      if (item.name === '') {
        removeFileFromExplorer(explorer, item);
        return;
      }
      removeRenamingFile(item.children);
    } else {
      if (item.name === '') {
        removeFileFromExplorer(explorer, item);
        return;
      }
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
    if (temp.path === info.path && temp.name === info.name) {
      explorer.splice(i, 1);
      return;
    }
  }
};

export const addFileToExplorer = (
  explorer: Explorer,
  info: FileInfo | DirectoryInfo
) => {
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

  currExplorer.push(info);

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

// export const addDirToExplorer = (explorer: Explorer, info: FileInfo) => {
//   const pathArr = info.path.split('/');

//   let currExplorer = explorer;
//   for (let i = 0; i < pathArr.length; i++) {
//     for (const item of currExplorer) {
//       if ('type' in item) {
//         continue;
//       }
//       if ('children' in item && item.name === pathArr[i]) {
//         currExplorer = item.children;
//         break;
//       }
//     }
//   }
// }

export const convertChangedFilesToTree = (
  changedFiles: Record<string, ChangedFileDirectoryState>
): Tree =>
  Object.keys(changedFiles).map(key => ({
    name: key.split('/').pop() ?? key,
    type: 'file',
    path: key,
    originalPath: changedFiles[key].originalPath,
    state: changedFiles[key].state,
    content: changedFiles[key].content,
  }));

export const mergeChangedFilesToCachedFiles = (
  cachedFiles: Record<string, CachedFileState>,
  changedFiles: Record<string, ChangedFileDirectoryState>
) => {
  Object.keys(changedFiles).forEach(path => {
    switch (changedFiles[path].state) {
      case 'renamed':
      case 'modified':
      case 'added':
        if (changedFiles[path].originalPath && changedFiles[path].content) {
          cachedFiles[changedFiles[path].originalPath!] = {
            content: changedFiles[path].content!,
          };
        }
        break;
      case 'deleted':
        if (changedFiles[path].originalPath) {
          delete cachedFiles[changedFiles[path].originalPath!];
        }
    }
  });
};
