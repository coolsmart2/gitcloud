import { RequestError } from '@octokit/request-error';
import { Octokit } from '@octokit/rest';
import {
  RepositoryCreationFailedError,
  RequiresAuthenticationError,
  BadCredentialsError,
  NotFoundError,
} from '../constants/errors/octokit.error';

export const insertRepo = async ({
  octokit,
  name,
  isPrivate,
}: {
  octokit: Octokit;
  name: string;
  isPrivate: boolean;
}) => {
  try {
    await octokit.repos.createForAuthenticatedUser({
      name,
      private: isPrivate,
    });
  } catch (error) {
    if (error instanceof RequestError) {
      switch (error.message) {
        case BadCredentialsError.name:
          throw new BadCredentialsError();
        case RequiresAuthenticationError.name:
          throw new RequiresAuthenticationError();
        case RepositoryCreationFailedError.name:
          throw new RepositoryCreationFailedError();
      }
    }
    throw new Error();
  }
};

export const removeRepo = async ({
  octokit,
  name,
}: {
  octokit: Octokit;
  name: string;
}) => {
  try {
    await octokit.repos.delete({
      owner: process.env.MY_GITHUB_USERNAME!,
      repo: name,
    });
  } catch (error) {
    if (error instanceof RequestError) {
      switch (error.message) {
        case BadCredentialsError.name:
          throw new BadCredentialsError();
        case RequiresAuthenticationError.name:
          throw new RequiresAuthenticationError();
        case NotFoundError.name:
          throw new NotFoundError();
      }
    }
    throw new Error();
  }
};

export const selectRepoList = async ({ octokit }: { octokit: Octokit }) => {
  try {
    const { data } = await octokit.repos.listForAuthenticatedUser();
    const repositories = data.map(repo => repo.name);
    return repositories;
  } catch (error) {
    if (error instanceof RequestError) {
      switch (error.message) {
        case BadCredentialsError.name:
          throw new BadCredentialsError();
        case RequiresAuthenticationError.name:
          throw new RequiresAuthenticationError();
      }
    }
    throw new Error();
  }
};
