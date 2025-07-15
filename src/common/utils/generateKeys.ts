import { generateKeyPairSync } from "crypto";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { logger } from "../../config/logger";
import { exit } from "process";

/**
 * Script that generates public and private keys for JWT authentication using RSA
 * it can be executed via npm scripts:
 * npn run keys to generate keys
 * npm run keys-force to force the keys generation
 */

const keysDir = "./keys";
let force = false;
let directory_exists = false;
let keys_found = false;
const args = process.argv.slice(2); // remove uneccessary values

if (args.length > 0) {
  if (args.includes("--force")) {
    logger.info("forcing generation of keys");
    force = true;
  }
}

// TODO: rimuovere check
if (existsSync(keysDir)) {
  logger.info("directory already exists - skipping");
  directory_exists = true;
  keys_found = true;
} else {
  logger.info("keys directory not found - generating");
}
if (!directory_exists) {
  mkdirSync(keysDir);
}

if (keys_found && !force) {
  exit();
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
logger.info(`keys generated successfully ${keysDir}`);
