import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isAdminRequest, unauthorized } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedTypes = new Set([
  "image/jpg",
  "image/jpeg",
  "image/pjpeg",
  "image/png",
]);

const allowedExtensions = new Set([
  ".jpeg",
  ".jpg",
  ".png",
]);

function extensionFromFile(file: File) {
  const fromName = path.extname(file.name).toLowerCase();

  if (fromName === ".jpeg") return ".jpg";
  if (allowedExtensions.has(fromName)) return fromName;
  if (file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/pjpeg") return ".jpg";
  if (file.type === "image/png") return ".png";

  return "";
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorized();

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "File is required" }, { status: 400 });
  }

  const extension = extensionFromFile(file);

  if (!allowedTypes.has(file.type) && !allowedExtensions.has(path.extname(file.name).toLowerCase())) {
    return NextResponse.json(
      { message: "Only JPG, JPEG and PNG images are allowed" },
      { status: 400 },
    );
  }

  if (!extension) {
    return NextResponse.json(
      { message: "Could not detect image format" },
      { status: 400 },
    );
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const fileName = `${randomUUID()}${extension}`;
  const filePath = path.join(uploadDir, fileName);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/uploads/${fileName}` }, { status: 201 });
}
