import bcrypt from "bcrypt"

export async function hashPass(pass: string): Promise<string> {
  const hash = await bcrypt.hash(pass, 10);
  return hash;
}
