import { InferCreationAttributes } from "sequelize";
import { JwtUtils } from "@/utils/jwt";
import { hashPass, comparePass } from "@/utils/encryption";
import { User } from "@/models/user";
import { UserRole } from "@/models/enums/user.role";
import { UserRepository } from "@/repositories/user.repository";

export class UserService {
  private userRepo = new UserRepository();

  async createUser(
    email: string,
    password: string,
    role: string,
  ): Promise<User | null> {
    const selectedRole =
      role.toLowerCase() === "admin" ? UserRole.ADMIN : UserRole.USER;

    const user: InferCreationAttributes<User> = {
      email: email,
      password: await hashPass(password),
      role: selectedRole,
    };
    const createdUser = await this.userRepo.createUser(user);
    if (!user) {
      return null;
    }

    return createdUser;
  }

  async loginUser(email: string, password: string): Promise<string | null> {
    const foundUser = await this.userRepo.getUserByEmail(email);

    if (
      !foundUser ||
      !foundUser.password ||
      !(await comparePass(password, foundUser.password))
    ) {
      return null;
    }

    return JwtUtils.generateToken({
      id: foundUser.id,
      email: foundUser.email,
      role: foundUser.role,
    });
  }
}

/* static async register(req: Request, res: Response):Promise<Response> {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Missing required fields",
      });
    }

    if (!Object.values(UserRole).includes(role)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid role",
      });
    }

    try {
      const exists = await User.findOne({ where: { email } });
      if (exists) {
        return res.status(StatusCodes.CONFLICT).json({
          message: "Email already registered",
        });
      }

      const user = await User.create({
        email,
        password: await hashPass(password),
        role,
      });

      return res.status(StatusCodes.CREATED).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error("Register error:", err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }
////////////////dsads
  static async login(req: Request, res: Response):Promise<Response> {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Missing email or password",
      });
    }

    try {
      const user = await User.findOne({ where: { email } });
      if (!user || !(await comparePass(password, user.password))) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Invalid credentials",
        });
      }

      const token = JwtUtils.generateToken({ id: user.id, email: user.email, role: user.role });

      return res.status(StatusCodes.OK).json({
        message: "Login successful",
        token,
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  } */
