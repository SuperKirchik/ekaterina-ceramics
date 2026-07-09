import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  const safeFile = path.basename(file);
  const extension = path.extname(safeFile).toLowerCase();
  const contentType = contentTypes[extension];

  if (!contentType || safeFile !== file) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  try {
    const filePath = path.join(process.cwd(), "public", "uploads", safeFile);
    const bytes = await readFile(filePath);

    return new NextResponse(bytes, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": contentType,
      },
    });
  } catch {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
}
