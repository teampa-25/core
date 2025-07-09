enum ErrorEnum {
  None,
  Generic,
  Forbidden,
  Unauthorized,
  BadRequest,
  InsufficientCredits,
  DatasetNameConflict,
  InvalidFileFormat,
}

interface ErrorMessage {
  getMessage(): string;
}

class GenericError implements ErrorMessage {
  public getMessage(): string {
    return "An unexpected error occurred. Please try again later.";
  }
}

class ForbiddenError implements ErrorMessage {
  public getMessage(): string {
    return "Access denied. You do not have permission to perform this action.";
  }
}

class UnauthorizedError implements ErrorMessage {
  public getMessage(): string {
    return "Authentication required. Please log in and provide a valid token.";
  }
}

class BadRequestError implements ErrorMessage {
  public getMessage(): string {
    return "Invalid request. Please check your input parameters.";
  }
}

class InsufficientCreditsError implements ErrorMessage {
  public getMessage(): string {
    return "Insufficient credits to perform this operation.";
  }
}

class DatasetNameConflictError implements ErrorMessage {
  public getMessage(): string {
    return "A dataset with the same name already exists for this user.";
  }
}

class InvalidFileFormatError implements ErrorMessage {
  public getMessage(): string {
    return "Uploaded file format is not supported. Only video or ZIP files are allowed.";
  }
}

class ErrorFactory {
  constructor() {}
  getError(type: ErrorEnum): ErrorMessage | null {
    switch (type) {
      case ErrorEnum.Generic:
        return new GenericError();

      case ErrorEnum.Forbidden:
        return new ForbiddenError();

      case ErrorEnum.Unauthorized:
        return new UnauthorizedError();

      case ErrorEnum.BadRequest:
        return new BadRequestError();

      case ErrorEnum.InsufficientCredits:
        return new InsufficientCreditsError();

      case ErrorEnum.DatasetNameConflict:
        return new DatasetNameConflictError();

      case ErrorEnum.InvalidFileFormat:
        return new InvalidFileFormatError();

      default:
        return null;
    }
  }
}
