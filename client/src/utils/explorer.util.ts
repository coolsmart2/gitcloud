// import {
//   DirectoryInfo,
//   FileInfo,
//   NewFileDirectoryInfo,
// } from '../types/repo.type';
// import { TreeBlobResponse } from '../types/response.type';

// export class Explorer {
//   private explorer: (DirectoryInfo | FileInfo | NewFileDirectoryInfo)[];

//   constructor(treeBlob: TreeBlobResponse[]) {
//     this.explorer = this.convertTreeBlobResponseToExplorer(treeBlob);
//   }

//   private convertTreeBlobResponseToExplorer(
//     treeBlob: TreeBlobResponse[],
//     basePath = ''
//   ): (DirectoryInfo | FileInfo)[] {
//     return treeBlob.map(item => {
//       if ('tree' in item) {
//         return {
//           path: `${basePath}${item.path}`,
//           name: item.path,
//           state: 'default',
//           children: this.convertTreeBlobResponseToExplorer(
//             item.tree!,
//             `${basePath}${item.path}/`
//           ),
//         } as DirectoryInfo;
//       }
//       return {
//         path: `${basePath}${item.path}`,
//         name: item.path,
//         state: 'default',
//       } as FileInfo;
//     });
//   }

//   getFileDirectory(
//     path: string,
//     children = this.explorer
//   ): FileInfo | DirectoryInfo | undefined {
//     for (const item of children) {
//       if ('type' in item) {
//         continue;
//       }
//       if ('children' in item) {
//         const fileDir = this.getFileDirectory(path, item.children);
//         if (fileDir) {
//           return fileDir;
//         }
//       }
//       if (item.path === path) {
//         return item;
//       }
//     }
//   }
// }
