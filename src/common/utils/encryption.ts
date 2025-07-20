import enviroment from "@/config/enviroment";
import bcrypt from "bcrypt";

/**
 * Hash a password using bcrypt with a salt rounds from enviroment
 * @param pass the plain password to hash
 * @returns the hashed password
 */
export async function hashPass(pass: string): Promise<string> {
  const SALT_ROUNDS = enviroment.saltRounds;
  return bcrypt.hash(pass, SALT_ROUNDS);
}

/**
 * Hash a password using bcrypt with a salt rounds from enviroment
 * @param pass the plain password to hash
 * @returns the hashed password
 */
export function hashPassSync(pass: string): string {
  const SALT_ROUNDS = enviroment.saltRounds;
  return bcrypt.hashSync(pass, SALT_ROUNDS);
}

/**
 *
 * @param plainPass the plain password
 * @param hashPass the hashed password
 * @returns true if the passwords match, false otherwise
 */
export async function comparePass(
  plainPass: string,
  hashPass: string,
): Promise<boolean> {
  return bcrypt.compare(plainPass, hashPass);
}
