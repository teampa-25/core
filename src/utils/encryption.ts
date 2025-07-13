import bcrypt from "bcrypt"

export function hashPass(pass: string): string {
  const hash = await crypt.hash(password, saltRounds);
  return hash
}
