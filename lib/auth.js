import crypto from "crypto";

const SECRET = process.env.AUTH_SECRET || "dev-secret-change-me";
const COOKIE_NAME = "bk_auth";
const MAX_AGE = 7 * 24 * 60 * 60; // 7 days

function sign(value) {
  const mac = crypto.createHmac("sha256", SECRET).update(value).digest("base64url");
  return `${value}.${mac}`;
}

/** Set a signed, HttpOnly auth cookie with the user's email */
export function setAuthCookie(res, email) {
  const signed = sign(email);
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${signed}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${MAX_AGE}`
  );
}
