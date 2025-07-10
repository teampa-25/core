import { StatusCodes } from "http-status-codes";
import { ErrorEnum } from "./enums";

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

class NotFoundError implements ErrorObj {
  getErrorObj(): { status: number; msg: string } {
    return {
      status: StatusCodes.NOT_FOUND,
      msg: "Route not found. Please check the URL and try again.",
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
    case ErrorEnum.Generic:
      retval = new GenericError();
      break;
    case ErrorEnum.NotFound:
      retval = new NotFoundError();
      break;
    case ErrorEnum.Forbidden:
      retval = new ForbiddenError();
      break;
    case ErrorEnum.Unauthorized:
      retval = new UnauthorizedError();
      break;
    case ErrorEnum.BadRequest:
      retval = new BadRequestError();
      break;
    case ErrorEnum.InsufficientCredits:
      retval = new InsufficientCreditsError();
      break;
    case ErrorEnum.DatasetNameConflict:
      retval = new DatasetNameConflictError();
      break;
    case ErrorEnum.InvalidFileFormat:
      retval = new InvalidFileFormatError();
      break;
  }

  return retval;
}
