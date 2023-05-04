// import { createContext, useContext, useState } from 'react';
// import { Workspace } from '../types';

// type ContextMenuType = 'file' | 'directory';

// interface RepoContextType {
//   state: {
//     workspace: Workspace;
//     contextMenu: Record<ContextMenuType, boolean>;
//     mousePos: { x: number; y: number };
//   };
//   action: {
//     setWorkspace: (workspace: Workspace) => void;
//     openContextMenu: (menu: ContextMenuType) => void;
//     closeAllContextMenus: () => void;
//     setMousePos: (pos: { x: number; y: number }) => void;
//   };
// }

// const RepoContext = createContext<RepoContextType | null>(null);

// export const RepoProvider = ({ children }: { children: React.ReactNode }) => {
//   const [workspace, setWorkspace] = useState<Workspace>({
//     selected: undefined,
//     focused: undefined,
//     branch: undefined,
//     tab: [],
//     changedFiles: {},
//     mode: 'DEFAULT',
//   });
//   const [contextMenu, setContextMenu] = useState<
//     Record<ContextMenuType, boolean>
//   >({
//     file: false,
//     directory: false,
//   });
//   const [mousePos, setMousePos] = useState<{
//     x: number;
//     y: number;
//   }>({
//     x: 0,
//     y: 0,
//   });

//   const openContextMenu = (menu: ContextMenuType) => {
//     setContextMenu({ ...contextMenu, [menu]: true });
//   };

//   const closeAllContextMenus = () => {
//     setContextMenu({
//       file: false,
//       directory: false,
//     });
//   };

//   return (
//     <RepoContext.Provider
//       value={{
//         state: {
//           workspace,
//           contextMenu,
//           mousePos,
//         },
//         action: {
//           setWorkspace,
//           openContextMenu,
//           closeAllContextMenus,
//           setMousePos,
//         },
//       }}
//     >
//       {children}
//     </RepoContext.Provider>
//   );
// };

// export const useRepoContext = () => {
//   const context = useContext(RepoContext);
//   if (!context) {
//     throw new Error('useRepoContext must be used within a RepoProvider');
//   }
//   return context;
// };
