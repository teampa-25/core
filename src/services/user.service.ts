import User from "../models/user.model";

export class UserService {
  constructor(/*private userRepository: UserService*/) {}

  register = async (userData: {
    email: string;
    password: string;
    role: string;
  }): Promise<User> => {
    //call userService that call repo and dao
    const { email, password, role } = userData;
    // const newUser = await userService.createUser({ email, password, role });
    // return newUser;
    return null as unknown as User; // Placeholder until implementation is complete
  };

  loginWithEmailAndPassword = async (
    email: string,
    password: string,
  ): Promise<User | null> => {
    //call userService that call repo and dao
    const emailUser = email;
    const passwordUser = password;
    // const user = await userService.findUserByEmail(email);
    // if (!user) return null;

    // const isValid = await userService.comparePasswords(password, user.password);
    // if (!isValid) return null;
    return null;
    // return user;
  };

  findUserByEmail = async (email: string): Promise<User | null> => {
    // const user = await userRepo.findByEmail(email);
    // if (!user) {
    //   throw getError(ErrorEnum.NotFound);
    // }
    // return user;
    return null;
  };
}
