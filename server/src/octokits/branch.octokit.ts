import { Octokit } from '@octokit/rest';

export const insertBranch = async ({
  octokit,
  owner,
  repoName,
  branchName,
  commitSha,
}: {
  octokit: Octokit;
  owner: string;
  repoName: string;
  branchName: string;
  commitSha: string;
}) => {
  await octokit.git.createRef({
    owner,
    repo: repoName,
    ref: `refs/heads/${branchName}`,
    sha: commitSha,
  });
};

export const removeBranch = async ({
  octokit,
  owner,
  repoName,
  branchName,
}: {
  octokit: Octokit;
  owner: string;
  repoName: string;
  branchName: string;
}) => {
  console.log(owner, repoName, branchName);
  await octokit.git.deleteRef({
    owner,
    repo: repoName,
    ref: `heads/${branchName}`,
  });
};

// export const selectLastCommitSha = async ({
//   octokit,
//   owner,
//   repoName,
//   branchName,
// }: {
//   octokit: Octokit;
//   owner: string;
//   repoName: string;
//   branchName: string;
// }) => {
//   try {
//     const branch = await octokit.git.getRef({
//       owner,
//       repo: repoName,
//       ref: `refs/heads/${branchName}`,
//     });

//     return branch.data.object.sha;
//   } catch (error) {
//     if (error instanceof RequestError) {
//     }
//     throw new Error();
//   }
// };
