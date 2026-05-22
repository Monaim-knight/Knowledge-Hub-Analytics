import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  storeFile,
  isAllowedMimeType,
  getMaxSize,
  inferMimeType,
} from "@/lib/storage";
import { randomUUID } from "crypto";
import { ApprovalStatus } from "@prisma/client";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { success } = rateLimit(getClientIdentifier(request), {
    prefix: "upload",
    max: 20,
    windowMs: 60 * 1000,
  });
  if (!success) {
    return NextResponse.json(
      { error: "Too many uploads. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const postId = formData.get("postId") as string | null;
    const discussionId = formData.get("discussionId") as string | null;
    const dashboardId = formData.get("dashboardId") as string | null;

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const mimeType = inferMimeType(file.name, file.type);
    if (!isAllowedMimeType(mimeType, file.name)) {
      return NextResponse.json(
        { error: "File type not allowed (executable files are blocked)" },
        { status: 400 }
      );
    }

    if (file.size > getMaxSize()) {
      return NextResponse.json(
        { error: `File too large (max ${Math.round(getMaxSize() / 1024 / 1024)}MB)` },
        { status: 400 }
      );
    }

    const id = randomUUID();
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = await storeFile(buffer, file.name, mimeType, id);

    const isAdminOrAuthor =
      session.user?.role === "ADMIN" || session.user?.role === "AUTHOR";

    const dbFile = await prisma.file.create({
      data: {
        id,
        uploaderId: session.user!.id,
        fileName: file.name,
        filePath,
        mimeType,
        sizeBytes: file.size,
        approvalStatus: isAdminOrAuthor ? ApprovalStatus.APPROVED : ApprovalStatus.PENDING,
        postId: postId || null,
        discussionId: discussionId || null,
        dashboardId: dashboardId || null,
      },
    });

    return NextResponse.json({
      id: dbFile.id,
      fileName: dbFile.fileName,
      filePath: dbFile.filePath,
      mimeType: dbFile.mimeType,
      sizeBytes: dbFile.sizeBytes,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
