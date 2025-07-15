import path from "path";
import decompress from "decompress";
import { faker } from "@faker-js/faker";

export async function unzip(name: string) {
  const tmpDir = path.join("/tmp/", name);
  const tmpDirDist = path.join("/tmp/", name, "/dist/");
  return decompress(tmpDir, tmpDirDist);
}

export async function unzipBuffer(
  buf: Buffer,
  bufname: string,
): Promise<decompress.File[]> {
  const id = faker.string.alphanumeric(10);
  // const tmpDir = path.join("/tmp/", bufname);

  // TODO: check better solution to not overload RAM
  const files = await decompress(buf);

  return files;
}
