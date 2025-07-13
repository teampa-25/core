import { UserDAO } from "@/dao-bak/user";
import { User } from "@/models/user";
import { hashPass } from "@/utils/encryption";
import { Request, Response, NextFunction } from "express";

export class UserController {

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    // this REQUIRES admin authorization!
    const dao = new UserDAO()
    const user = new User()
    let content = req.body

    user.email = content.email;
    // honestly, user should encrypt password from its side, not here
    user.password = await hashPass(content.password);
    user.role = content.role
    user.credit = content.credit

    dao.create(user)
    next()
  }


}
