import { StatusCodes } from "http-status-codes";
import { ErrorEnum } from "@/common/enums";

/**
 * Interface 'ErrorObj'
 *
 * This interface defines the structure of an error object that can be returned in the response body.
 * This interface is implemented in every class-specific error to return the corrent status code and message
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

class InvalidJWTFormat implements ErrorObj {
  getErrorObj(): { status: number; msg: string } {
    return {
      status: StatusCodes.BAD_REQUEST,
      msg: "Invalid jwt format.",
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
export function getError(type: ErrorEnum): ErrorObj {
  let retval: ErrorObj = new GenericError();

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
    case ErrorEnum.DATASET_NAME_CONFLICT_ERROR:
      retval = new DatasetNameConflictError();
      break;
    case ErrorEnum.INVALID_FILE_FORMAT_ERROR:
      retval = new InvalidFileFormatError();
      break;
    case ErrorEnum.INVALID_JWT_FORMAT:
      retval = new InvalidJWTFormat();
      break;

    default:
      retval = new GenericError();
      break;
  }

  return retval;
}
