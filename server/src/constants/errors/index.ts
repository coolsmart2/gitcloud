export class GithubError extends Error {
  constructor() {
    super('GithubError');
  }
}

export class ServerError extends Error {
  constructor() {
    super('ServerError');
  }
}
