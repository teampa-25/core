import jwt, { JwtPayload } from "jsonwebtoken";
import fs from "fs";
import enviroment from "@/config/enviroment";

export class JwtUtils {
  private static privateKeyPath = enviroment.jwtPrivateKeyPath;
  private static publicKeyPath = enviroment.jwtPublicKeyPath;
  private static expiresIn = enviroment.jwtExpiresIn;
  private static algorithm = enviroment.jwtAlgorithm as jwt.Algorithm;

  private static privateKey = fs.readFileSync(JwtUtils.privateKeyPath, "utf8");
  private static publicKey = fs.readFileSync(JwtUtils.publicKeyPath, "utf8");

  static generateToken(payload: object): string {
    return jwt.sign(payload, JwtUtils.privateKey, {
      algorithm: JwtUtils.algorithm,
      expiresIn: JwtUtils.expiresIn,
    });
  }

  static verifyToken(token: string): JwtPayload | string {
    return jwt.verify(token, JwtUtils.publicKey, {
      algorithms: [JwtUtils.algorithm],
    });
  }
}
