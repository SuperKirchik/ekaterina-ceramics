import { NextResponse } from "next/server";
import { isAdminRequest, unauthorized } from "@/lib/admin-auth";
import {
  deleteCollection,
  getCollectionById,
  renameProductsCollection,
  saveCollection,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAdminRequest(request)) return unauthorized();

  const { id } = await params;
  const current = getCollectionById(id);

  if (!current) {
    return NextResponse.json({ message: "Collection not found" }, { status: 404 });
  }

  const collection = saveCollection({ ...current, ...(await request.json()), id });
  renameProductsCollection(current.title, collection.title);

  return NextResponse.json(collection);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAdminRequest(request)) return unauthorized();

  const { id } = await params;
  deleteCollection(id);
  return NextResponse.json({ ok: true });
}
