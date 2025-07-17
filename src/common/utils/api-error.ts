import { StatusCodes } from "http-status-codes";
import { ErrorEnum } from "@/common/enums";

export class ErrorObj {
  status: number;
  msg: string;
  type: ErrorEnum;

  constructor(status: number, msg: string, type: ErrorEnum) {
    this.status = status;
    this.msg = msg;
    this.type = type;
  }

  toJSON() {
    return { status: this.status, msg: this.msg };
  }
}

const errorConfig: Record<ErrorEnum, { status: number; msg: string }> = {
  [ErrorEnum.GENERIC_ERROR]: {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    msg: "An unexpected error occurred. Please try again later.",
  },
  [ErrorEnum.NOT_IMPLEMENTED_ERROR]: {
    status: StatusCodes.NO_CONTENT,
    msg: "This feature is not implemented yet. Contact support.",
  },
  [ErrorEnum.NOT_FOUND_ERROR]: {
    status: StatusCodes.NOT_FOUND,
    msg: "Object not found. Please check the params and try again.",
  },
  [ErrorEnum.NOT_FOUND_ROUTE_ERROR]: {
    status: StatusCodes.NOT_FOUND,
    msg: "Route not found. Please check the URL and try again.",
  },
  [ErrorEnum.FORBIDDEN_ERROR]: {
    status: StatusCodes.FORBIDDEN,
    msg: "Access denied. You do not have permission to perform this action.",
  },
  [ErrorEnum.UNAUTHORIZED_ERROR]: {
    status: StatusCodes.UNAUTHORIZED,
    msg: "Authentication required. Please log in and provide a valid token.",
  },
  [ErrorEnum.BAD_REQUEST_ERROR]: {
    status: StatusCodes.BAD_REQUEST,
    msg: "Invalid request. Please check your input parameters.",
  },
  [ErrorEnum.DATASET_NAME_CONFLICT_ERROR]: {
    status: StatusCodes.CONFLICT,
    msg: "A dataset with the same name already exists for this user.",
  },
  [ErrorEnum.INVALID_FILE_FORMAT_ERROR]: {
    status: StatusCodes.UNSUPPORTED_MEDIA_TYPE,
    msg: "Uploaded file format is not supported. Only video or ZIP files are allowed.",
  },
  [ErrorEnum.INVALID_JWT_FORMAT]: {
    status: StatusCodes.BAD_REQUEST,
    msg: "Invalid JWT format.",
  },
  [ErrorEnum.IM_A_TEAPOT]: {
    status: StatusCodes.IM_A_TEAPOT,
    msg: "I'm a teapot",
  },
};

/**
 * Function 'getError'
 *
 * This function takes an ErrorEnum type as input and returns an object that implements the ErrorObj interface.
 *
 * @param type exception type, one of the ErrorEnum values
 * @returns An object implementing the ErrorObj interface, or null if the type is None.
 */
export function getError(type: ErrorEnum): ErrorObj {
  const config = errorConfig[type] ?? errorConfig[ErrorEnum.GENERIC_ERROR];
  return new ErrorObj(config.status, config.msg, type);
}
