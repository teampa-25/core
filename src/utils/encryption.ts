import bcrypt from "bcrypt";

export async function hashPass(pass: string): Promise<string> {
  const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "12", 10);
  return bcrypt.hash(pass, SALT_ROUNDS);
}
export async function comparePass(plainPass: string, hashPass: string): Promise<boolean> {
  return bcrypt.compare(plainPass, hashPass);
}
