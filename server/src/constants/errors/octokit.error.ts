export class NotFoundError extends Error {
  constructor() {
    super('Not Found');
    this.name = 'Not Found';
  }
}

export class CreateFileContentsError extends Error {
  constructor() {
    super('CreateFileContentsError');
    this.name = 'CreateFileContentsError';
  }
}

export class UpdateFileContentsError extends Error {
  constructor() {
    super('UpdateFileContentsError');
    this.name = 'UpdateFileContentsError';
  }
}

export class RepositoryCreationFailedError extends Error {
  constructor() {
    super('RepositoryCreationFailedError');
    this.name = 'Repository creation failed';
  }
}

export class RequiresAuthenticationError extends Error {
  constructor() {
    super('RequiresAuthenticationError');
    this.name = 'Requires authentication';
  }
}

export class BadCredentialsError extends Error {
  constructor() {
    super('BadCredentialsError');
    this.name = 'Bad credentials';
  }
}
