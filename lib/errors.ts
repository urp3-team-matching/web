export class BadRequestError extends Error {
  constructor(message = "Bad Request") {
    super(message);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized: Incorrect or missing credentials.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class NotFoundError extends Error {
  constructor(message = "Resource not found.") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends Error {
  constructor(
    message = "Forbidden: You do not have permission to perform this action."
  ) {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class MaxApplicantsError extends Error {
  constructor(message = "Maximum number of applicants reached.") {
    super(message);
    this.name = "MaxApplicantsError";
  }
}

export class InternalServerError extends Error {
  constructor(message = "Internal Server Error") {
    super(message);
    this.name = "InternalServerError";
  }
}
