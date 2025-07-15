import fs from "fs";
import jwt, { JwtPayload, Algorithm } from "jsonwebtoken";
import enviroment from "@/config/enviroment";
import path from "path";
import { ErrorEnum } from "../enums";
import { getError } from "./api-error";

/**
 * Utility class for JWT operations
 * @property privateKey the private key to sign the JWT
 * @property publicKey the public key to verify the JWT
 * @property algorithm the algorithm to use for the JWT
 * @property expiresIn the expiration time for the JWT
 */
export class JwtUtils {
  private static readonly privateKey: string = JwtUtils.loadKey(
    enviroment.jwtPrivateKeyPath,
  );
  private static readonly publicKey: string = JwtUtils.loadKey(
    enviroment.jwtPublicKeyPath,
  );
  private static readonly algorithm: Algorithm =
    enviroment.jwtAlgorithm as Algorithm;
  private static readonly expiresIn = enviroment.jwtExpiresIn;

  /**
   * Load a key from the PEM file
   * @param pathStr path to the file
   * @returns the file content (key)
   */
  private static loadKey(pathStr: string): string {
    try {
      return fs.readFileSync(path.resolve(pathStr), "utf8");
    } catch {
      throw getError(ErrorEnum.GENERIC_ERROR);
    }
  }

  /**
   * Generate a JWT token using sign() method
   * @param payload the payload to sign
   * @returns the generated JWT token or throw an error
   */
  static generateToken(payload: object): string {
    try {
      return jwt.sign(payload, this.privateKey, {
        algorithm: this.algorithm,
        expiresIn: this.expiresIn,
      });
    } catch (err) {
      throw getError(ErrorEnum.GENERIC_ERROR);
    }
  }

  /**
   * Verify a JWT token using verify() method
   * @param token the JWT token to verify
   * @returns the decoded JWT payload or throw an error
   */
  static verifyToken(token: string): JwtPayload {
    try {
      const payload = jwt.verify(token, this.publicKey, {
        algorithms: [this.algorithm],
      });

      if (typeof payload === "string") {
        throw getError(ErrorEnum.INVALID_JWT_FORMAT);
      }

      return payload;
    } catch (err) {
      throw getError(ErrorEnum.UNAUTHORIZED_ERROR);
    }
  }
}
