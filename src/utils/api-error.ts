import { StatusCodes } from "http-status-codes";


export enum ErrorEnum {
  GENERIC_ERROR = "GENERIC_ERROR",
  NOT_FOUND_ERROR = "NOT_FOUND_ERROR",
  NOT_FOUND_ROUTE_ERROR = "NOT_FOUND_ROUTE_ERROR",
  FORBIDDEN_ERROR = "FORBIDDEN_ERROR",
  UNAUTHORIZED_ERROR = "UNAUTHORIZED_ERROR",
  BAD_REQUEST_ERROR = "BAD_REQUEST_ERROR",
  INSUFFICIENT_CREDITS_ERROR = "INSUFFICIENT_CREDITS_ERROR",
  DATASET_NAME_CONFLICT_ERROR = "DATASET_NAME_CONFLICT_ERROR",
  INVALID_FILE_FORMAT_ERROR = "INVALID_FILE_FORMAT_ERROR",
}

/**
 * Interface 'ErrorObj'
 *
 * This interface defines the structure of an error object that can be returned in the response body.
 * @returns object with status code and message
 */
export interface ErrorObj {
  getErrorObj(): { status: number; msg: string };
}

class GenericError implements ErrorObj {
  getErrorObj(): { status: number; msg: string } {
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      msg: "An unexpected error occurred. Please try again later.",
    };
  }
}

class NotFoundRouteError implements ErrorObj {
  getErrorObj(): { status: number; msg: string } {
    return {
      status: StatusCodes.NOT_FOUND,
      msg: "Route not found. Please check the URL and try again.",
    };
  }
}

class NotFoundError implements ErrorObj {
  getErrorObj(): { status: number; msg: string } {
    return {
      status: StatusCodes.NOT_FOUND,
      msg: "Object not found. Please check the params and try again.",
    };
  }
}

class ForbiddenError implements ErrorObj {
  getErrorObj(): { status: number; msg: string } {
    return {
      status: StatusCodes.FORBIDDEN,
      msg: "Access denied. You do not have permission to perform this action.",
    };
  }
}

class UnauthorizedError implements ErrorObj {
  getErrorObj(): { status: number; msg: string } {
    return {
      status: StatusCodes.UNAUTHORIZED,
      msg: "Authentication required. Please log in and provide a valid token.",
    };
  }
}

class BadRequestError implements ErrorObj {
  getErrorObj(): { status: number; msg: string } {
    return {
      status: StatusCodes.BAD_REQUEST,
      msg: "Invalid request. Please check your input parameters.",
    };
  }
}

class InsufficientCreditsError implements ErrorObj {
  getErrorObj(): { status: number; msg: string } {
    return {
      status: StatusCodes.PAYMENT_REQUIRED,
      msg: "Insufficient credits to perform this operation.",
    };
  }
}

class DatasetNameConflictError implements ErrorObj {
  getErrorObj(): { status: number; msg: string } {
    return {
      status: StatusCodes.CONFLICT,
      msg: "A dataset with the same name already exists for this user.",
    };
  }
}

class InvalidFileFormatError implements ErrorObj {
  getErrorObj(): { status: number; msg: string } {
    return {
      status: StatusCodes.UNSUPPORTED_MEDIA_TYPE,
      msg: "Uploaded file format is not supported. Only video or ZIP files are allowed.",
    };
  }
}

/**
 * Function 'getError'
 *
 * This function takes an ErrorEnum type as input and returns an object that implements the ErrorObj interface.
 *
 * @param type exception type, one of the ErrorEnum values
 * @returns An object implementing the ErrorObj interface, or null if the type is None.
 */
export function getError(type: ErrorEnum): ErrorObj | null {
  let retval: ErrorObj | null = null;

  switch (type) {
    case ErrorEnum.GENERIC_ERROR:
      retval = new GenericError();
      break;
    case ErrorEnum.NOT_FOUND_ERROR:
      retval = new NotFoundError();
      break;
    case ErrorEnum.NOT_FOUND_ROUTE_ERROR:
      retval = new NotFoundRouteError();
      break;
    case ErrorEnum.FORBIDDEN_ERROR:
      retval = new ForbiddenError();
      break;
    case ErrorEnum.UNAUTHORIZED_ERROR:
      retval = new UnauthorizedError();
      break;
    case ErrorEnum.BAD_REQUEST_ERROR:
      retval = new BadRequestError();
      break;
    case ErrorEnum.INSUFFICIENT_CREDITS_ERROR:
      retval = new InsufficientCreditsError();
      break;
    case ErrorEnum.DATASET_NAME_CONFLICT_ERROR:
      retval = new DatasetNameConflictError();
      break;
    case ErrorEnum.INVALID_FILE_FORMAT_ERROR:
      retval = new InvalidFileFormatError();
      break;
  }

  return retval;
}
