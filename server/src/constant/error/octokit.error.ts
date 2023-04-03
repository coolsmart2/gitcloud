/**
 * 찾는 파일이 없는 경우
 */
export class NotFoundError extends Error {
  constructor() {
    super('Not Found');
  }
}

/**
 * 같은 이름의 레포지토리가 있는 경우
 */
export class RepositoryCreationFailedError extends Error {
  constructor() {
    super('RepositoryCreationFailedError');
  }
}

/**
 * 깃허브 토큰이 입력이 안된 경우
 */
export class RequiresAuthenticationError extends Error {
  constructor() {
    super('RequiresAuthenticationError');
  }
}

/**
 * 깃허브 토큰이 인증이 안될 경우
 */
export class BadCredentialsError extends Error {
  constructor() {
    super('BadCredentialsError');
  }
}

/**
 * 중복된 브랜치를 만들 경우
 */
export class ReferenceAlreadyExistsError extends Error {
  constructor() {
    super('ReferenceAlreadyExistsError');
  }
}

/**
 * 브랜치가 없는 경우
 */
export class ReferenceDoesNotExistError extends Error {
  constructor() {
    super('ReferenceDoesNotExistError');
  }
}

/**
 * 레포지토리가 비어있는 경우 (새로 생성된 레포지토리 등)
 */
export class RepositoryIsEmptyError extends Error {
  constructor() {
    super('RepositoryIsEmptyError');
  }
}
