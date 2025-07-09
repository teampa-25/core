import { Role } from "../utils/role";

interface UserModel {
  id: string; // UUID
  email: string;
  password: string;
  role: Role; // Admin or User
  tokens: number;
  createdAt: Date;
}

export default UserModel;
