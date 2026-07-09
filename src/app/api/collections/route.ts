import { NextResponse } from "next/server";
import { isAdminRequest, unauthorized } from "@/lib/admin-auth";
import { getCollections, saveCollection } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return unauthorized();

  return NextResponse.json(getCollections({ includeHidden: true }));
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorized();

  const collection = saveCollection(await request.json());
  return NextResponse.json(collection, { status: 201 });
}
