import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");
  const discussionId = searchParams.get("discussionId");
  const dashboardId = searchParams.get("dashboardId");

  const where: Record<string, string> = {};
  if (postId) where.postId = postId;
  if (discussionId) where.discussionId = discussionId;
  if (dashboardId) where.dashboardId = dashboardId;

  if (Object.keys(where).length === 0) {
    return NextResponse.json(
      { error: "Provide postId, discussionId, or dashboardId" },
      { status: 400 }
    );
  }

  const files = await prisma.file.findMany({
    where,
    include: {
      uploader: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(files);
}
