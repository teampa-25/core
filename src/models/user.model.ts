import { Role } from "../utils/enums";

interface User {
  id: string; // UUID
  email: string;
  password: string;
  role: Role; // Admin or User
  tokens: number;
  createdAt: Date;
}

export default User;
