
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

export class JwtUtils {
  private static privateKeyPath = process.env.JWT_PRIVATE_KEY_PATH || path.resolve(__dirname, "../keys/private.key");
  private static publicKeyPath = process.env.JWT_PUBLIC_KEY_PATH || path.resolve(__dirname, "../keys/public.key");
  private static expiresIn = process.env.JWT_EXPIRES_IN || "1h";

  private static privateKey = fs.readFileSync(JwtUtils.privateKeyPath, "utf8");
  private static publicKey = fs.readFileSync(JwtUtils.publicKeyPath, "utf8");

  static generateToken(payload: object): string {
    return jwt.sign(payload, JwtUtils.privateKey, {
      algorithm: "RS256",
      expiresIn: JwtUtils.expiresIn,
    });
  }

  static verifyToken(token: string): any {
    return jwt.verify(token, JwtUtils.publicKey, {
      algorithms: ["RS256"],
    });
  }
}