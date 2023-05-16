export const mergeNewTreeToPrevTree = (
  prevTree: {
    path?: string | undefined;
    mode?: string | undefined;
    type?: string | undefined;
    sha?: string | undefined;
  }[],
  changedTree: {
    path: string;
    originalPath: string;
    state: 'added' | 'deleted' | 'renamed' | 'modified';
    content?: string;
  }[]
) => {
  console.log('prevTree : ' + JSON.stringify(prevTree));
  console.log('================================================');
  console.log('changedTree : ' + JSON.stringify(changedTree));

  const newTree: {
    path?: string | undefined;
    mode?: '100644' | '100755' | '040000' | '160000' | '120000' | undefined;
    type?: 'tree' | 'commit' | 'blob' | undefined;
    sha?: string | undefined;
    content?: string | undefined;
  }[] = [];

  prevTree.forEach(item => {
    if (item.type === 'blob') {
      const matchedTree = changedTree.filter(
        el => el.originalPath === item.path
      );
      if (matchedTree.length > 0) {
        matchedTree.forEach(file => {
          if (file.state === 'modified') {
            newTree.push({
              path: item.path,
              mode: item.mode as
                | '100644'
                | '100755'
                | '040000'
                | '160000'
                | '120000',
              type: item.type as 'tree' | 'commit' | 'blob',
              content: file.content,
              sha: item.sha,
            });
          } else if (file.state === 'renamed') {
            console.log(file);
            newTree.push({
              path: file.path,
              mode: item.mode as
                | '100644'
                | '100755'
                | '040000'
                | '160000'
                | '120000',
              type: item.type as 'tree' | 'commit' | 'blob',
              content: file.content,
              sha: item.sha,
            });
          }
        });
      } else {
        newTree.push({
          path: item.path,
          mode: item.mode as
            | '100644'
            | '100755'
            | '040000'
            | '160000'
            | '120000',
          type: item.type as 'tree' | 'commit' | 'blob',
          sha: item.sha,
        });
      }
    }
  });
  changedTree.forEach(item => {
    if (item.state === 'added') {
      newTree.push({
        path: item.path,
        mode: '100644',
        type: 'blob',
        content: item.content,
      });
    }
  });

  console.log('================================================');
  console.log('newTree : ' + JSON.stringify(newTree));

  return newTree;
};
