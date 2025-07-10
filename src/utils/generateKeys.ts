import { generateKeyPairSync } from "crypto";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { logger } from "../config/logger";

const keysDir = join(__dirname, "../../keys");

if (!existsSync(keysDir)) {
  mkdirSync(keysDir);
}

const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
});

writeFileSync(join(keysDir, "private.key"), privateKey);
writeFileSync(join(keysDir, "public.key"), publicKey);

logger.info(`🗝️ Keys generated successfully ${keysDir}`);
