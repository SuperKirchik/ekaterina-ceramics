import { NextResponse } from "next/server";
import { isAdminRequest, unauthorized } from "@/lib/admin-auth";
import { deleteProduct, getProductById, saveProduct } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAdminRequest(request)) return unauthorized();

  const { id } = await params;
  const current = getProductById(id);

  if (!current) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  const product = saveProduct({ ...current, ...(await request.json()), id });
  return NextResponse.json(product);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAdminRequest(request)) return unauthorized();

  const { id } = await params;
  deleteProduct(id);
  return NextResponse.json({ ok: true });
}
