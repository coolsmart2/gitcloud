export class GithubError extends Error {
  constructor() {
    super('GithubError');
  }
}

export class GithubBadCredentialsError extends Error {
  constructor() {
    super('GithubBadCredentialsError');
  }
}

export class ServerError extends Error {
  constructor() {
    super('ServerError');
  }
}
