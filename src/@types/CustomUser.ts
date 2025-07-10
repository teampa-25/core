import { Role } from "../utils/enums";

// types/User.ts
export interface UserPayload {
  id: string;
  email: string;
  role: Role;
}
