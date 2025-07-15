import enviroment from "@/config/enviroment";
import bcrypt from "bcrypt";

export async function hashPass(pass: string): Promise<string> {
  const SALT_ROUNDS = enviroment.saltRounds;
  return bcrypt.hash(pass, SALT_ROUNDS);
}
export async function comparePass(
  plainPass: string,
  hashPass: string,
): Promise<boolean> {
  return bcrypt.compare(plainPass, hashPass);
}
