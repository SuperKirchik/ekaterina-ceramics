import { NextResponse } from "next/server";
import { isAdminRequest, unauthorized } from "@/lib/admin-auth";
import { getProducts, saveProduct } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return unauthorized();

  return NextResponse.json(getProducts({ includeHidden: true }));
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorized();

  const product = saveProduct(await request.json());
  return NextResponse.json(product, { status: 201 });
}
