import { Role } from "../utils/role";

// types/User.ts
export interface UserPayload {
  id: string;
  email: string;
  role: Role;
}
