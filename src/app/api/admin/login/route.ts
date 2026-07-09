import { NextResponse } from "next/server";
import {
  setAdminSessionCookie,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { login, password } = (await request.json()) as {
    login?: string;
    password?: string;
  };

  if (!verifyAdminCredentials(login ?? "", password ?? "")) {
    return NextResponse.json(
      { message: "Неверный логин или пароль" },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  setAdminSessionCookie(response);

  return response;
}
