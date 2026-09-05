import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("name");

  if (!filename) {
    return NextResponse.json({ error: "Missing file name" }, { status: 400 });
  }

  // Prevent directory traversal
  const safeBase = path.basename(filename);
  const filePath = path.join(process.cwd(), ".data", "uploads", safeBase);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const isPdf = safeBase.endsWith(".pdf");
  const contentType = isPdf
    ? "application/pdf"
    : safeBase.endsWith(".png")
    ? "image/png"
    : "image/jpeg";

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `inline; filename="${safeBase}"`,
    },
  });
}
