import crypto from "node:crypto";
import { NextResponse } from "next/server";

export const adminSessionCookie = "ekaterina_admin_session";

const sessionMaxAge = 60 * 60 * 12;

function envValue(name: string) {
  return process.env[name] ?? "";
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function sessionSecret() {
  return envValue("ADMIN_SESSION_SECRET");
}

export function createAdminSessionValue() {
  const secret = sessionSecret();

  if (!secret) return "";

  return crypto
    .createHmac("sha256", secret)
    .update(envValue("ADMIN_LOGIN"))
    .digest("hex");
}

export function verifyAdminCredentials(login: string, password: string) {
  const expectedLogin = envValue("ADMIN_LOGIN");
  const expectedPassword = envValue("ADMIN_PASSWORD");

  if (!expectedLogin || !expectedPassword || !sessionSecret()) return false;

  return safeEqual(login, expectedLogin) && safeEqual(password, expectedPassword);
}

export function isAdminRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const session = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${adminSessionCookie}=`))
    ?.split("=")[1];

  const expectedSession = createAdminSessionValue();

  return Boolean(
    session &&
      expectedSession &&
      safeEqual(decodeURIComponent(session), expectedSession),
  );
}

export function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export function setAdminSessionCookie(response: NextResponse) {
  response.cookies.set(adminSessionCookie, createAdminSessionValue(), {
    httpOnly: true,
    maxAge: sessionMaxAge,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(adminSessionCookie, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}
