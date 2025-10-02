import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

function getEncryptionKey(): Buffer {
  const key = process.env.PROJECT_ENCRYPTION_KEY;
  if (!key) {
    throw new Error("PROJECT_ENCRYPTION_KEY environment variable is required");
  }
  return Buffer.from(key, "hex");
}

/**
 * 비밀번호를 암호화
 */
export function encryptPassword(password: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);

  let encrypted = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  // iv:encrypted:authTag 형태로 결합
  return `${iv.toString("hex")}:${encrypted}:${authTag.toString("hex")}`;
}

/**
 * 암호화된 데이터를 복호화
 */
export function decryptPassword(encryptedData: string): string | null {
  try {
    const [ivHex, encrypted, authTagHex] = encryptedData.split(":");

    if (!ivHex || !encrypted || !authTagHex) {
      return null;
    }

    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Failed to decrypt password:", error);
    return null;
  }
}
