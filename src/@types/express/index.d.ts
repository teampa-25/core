import { UserPayload } from "@/common/types";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
