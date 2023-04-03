import { RequestError } from '@octokit/request-error';
import { Octokit } from '@octokit/rest';
import {
  BadCredentialsError,
  NotFoundError,
  ReferenceAlreadyExistsError,
  ReferenceDoesNotExistError,
  RepositoryCreationFailedError,
  RequiresAuthenticationError,
} from '../constant/error/octokit.error';
import {
  BAD_CREDENTIALS,
  REQUIRES_AUTHENTICATION,
  REPOSITORY_CREATION_FAILED,
  NOT_FOUND,
  REFERENCE_ALREADY_EXISTS,
  REFERENCE_DOES_NOT_EXIST,
  REPOSITORY_IS_EMPTY,
} from '../constant/error/octokit.message';
import { insertBranch, removeBranch } from '../octokit/branch.octokit';
import {
  insertFileContents,
  updateFileContents,
} from '../octokit/commit.octokit';
import { selectContent } from '../octokit/content.octokit';
import {
  insertRepo,
  removeRepo,
  selectRepo,
  selectRepos,
} from '../octokit/repo.octokit';

export const findAllRepo = async (token: string) => {
  const octokit = new Octokit({
    auth: token,
  });
  try {
    const repos = await selectRepos({ octokit });
    return repos;
  } catch (error) {
    if (error instanceof RequestError) {
      switch (error.message) {
        case BAD_CREDENTIALS:
          throw new BadCredentialsError();
        case REQUIRES_AUTHENTICATION:
          throw new RequiresAuthenticationError();
      }
    }
    throw new Error();
  }
};

export const findRepo = async ({
  token,
  owner,
  repoName,
  ref,
}: {
  token: string;
  owner: string;
  repoName: string;
  ref?: string;
}) => {
  try {
    const repoStructure = await selectRepo({
      octokit: new Octokit({ auth: token }),
      owner,
      repoName,
      ref,
    });
    return repoStructure;
  } catch (error) {
    // console.log('findRepo: ' + error);
    if (error instanceof RequestError) {
      switch (error.message) {
        case BAD_CREDENTIALS:
          throw new BadCredentialsError();
        case REQUIRES_AUTHENTICATION:
          throw new RequiresAuthenticationError();
      }
    }
    throw new Error();
  }
};

export const addRepo = async ({
  token,
  repoName,
  isPrivate,
}: {
  token: string;
  repoName: string;
  isPrivate: boolean;
}) => {
  try {
    await insertRepo({
      octokit: new Octokit({ auth: token }),
      repoName,
      isPrivate,
    });
  } catch (error) {
    if (error instanceof RequestError) {
      switch (error.message) {
        case BAD_CREDENTIALS:
          throw new BadCredentialsError();
        case REQUIRES_AUTHENTICATION:
          throw new RequiresAuthenticationError();
        case REPOSITORY_CREATION_FAILED:
          throw new RepositoryCreationFailedError();
      }
    }
    throw new Error();
  }
};

export const deleteRepo = async ({
  token,
  repoName,
}: {
  token: string;
  repoName: string;
}) => {
  try {
    await removeRepo({ octokit: new Octokit({ auth: token }), repoName });
  } catch (error) {
    if (error instanceof RequestError) {
      switch (error.message) {
        case BAD_CREDENTIALS:
          throw new BadCredentialsError();
        case REQUIRES_AUTHENTICATION:
          throw new RequiresAuthenticationError();
        case NOT_FOUND:
          throw new NotFoundError();
      }
    }
    throw new Error();
  }
};

export const findContent = async ({
  token,
  owner,
  repoName,
  path,
  ref,
}: {
  token: string;
  owner: string;
  repoName: string;
  path: string;
  ref?: string;
}) => {
  try {
    const content = await selectContent({
      octokit: new Octokit({ auth: token }),
      owner,
      repoName,
      path,
      ref,
    });

    return content;
  } catch (error) {
    if (error instanceof RequestError) {
      switch (error.message) {
        case BAD_CREDENTIALS:
          throw new BadCredentialsError();
        case REQUIRES_AUTHENTICATION:
          throw new RequiresAuthenticationError();
        case NOT_FOUND:
        case REPOSITORY_IS_EMPTY:
          return;
      }
    }

    throw new Error();
  }
};

export const addContent = async ({
  token,
  owner,
  repoName,
  path,
  content,
  branchName,
  message,
}: {
  token: string;
  owner: string;
  repoName: string;
  path: string;
  content: string;
  branchName?: string;
  message?: string;
}) => {
  try {
    await insertFileContents({
      octokit: new Octokit({ auth: token }),
      owner,
      repoName,
      path,
      content,
      branchName,
      message,
    });
  } catch (error) {
    if (error instanceof RequestError) {
      switch (error.message) {
        case BAD_CREDENTIALS:
          throw new BadCredentialsError();
        case REQUIRES_AUTHENTICATION:
          throw new RequiresAuthenticationError();
        case NOT_FOUND:
          throw new NotFoundError();
      }
    }
    throw new Error();
  }
};

export const modifyContent = async ({
  token,
  owner,
  repoName,
  path,
  content,
  blobSha,
  message,
}: {
  token: string;
  owner: string;
  repoName: string;
  path: string;
  content: string;
  blobSha: string;
  message?: string;
}) => {
  try {
    await updateFileContents({
      octokit: new Octokit({ auth: token }),
      owner,
      repoName,
      path,
      content,
      sha: blobSha,
      message,
    });
  } catch (error) {
    if (error instanceof RequestError) {
      switch (error.message) {
        case BAD_CREDENTIALS:
          throw new BadCredentialsError();
        case REQUIRES_AUTHENTICATION:
          throw new RequiresAuthenticationError();
        case NOT_FOUND:
          throw new NotFoundError();
      }
    }
    throw new Error();
  }
};

export const addBranch = async ({
  token,
  owner,
  repoName,
  branchName,
  commitSha,
}: {
  token: string;
  owner: string;
  repoName: string;
  branchName: string;
  commitSha: string;
}) => {
  try {
    const lastCommitSha = await insertBranch({
      octokit: new Octokit({ auth: token }),
      owner,
      repoName,
      branchName,
      commitSha,
    });

    return lastCommitSha;
  } catch (error) {
    if (error instanceof RequestError) {
      switch (error.message) {
        case BAD_CREDENTIALS:
          throw new BadCredentialsError();
        case REQUIRES_AUTHENTICATION:
          throw new RequiresAuthenticationError();
        case REFERENCE_ALREADY_EXISTS:
          throw new ReferenceAlreadyExistsError();
      }
    }
    throw new Error();
  }
};

export const deleteBranch = async ({
  token,
  owner,
  repoName,
  branchName,
}: {
  token: string;
  owner: string;
  repoName: string;
  branchName: string;
}) => {
  try {
    await removeBranch({
      octokit: new Octokit({ auth: token }),
      owner,
      repoName,
      branchName,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof RequestError) {
      switch (error.message) {
        case BAD_CREDENTIALS:
          throw new BadCredentialsError();
        case REQUIRES_AUTHENTICATION:
          throw new RequiresAuthenticationError();
        case REFERENCE_DOES_NOT_EXIST:
          throw new ReferenceDoesNotExistError();
      }
    }
    throw new Error();
  }
};
