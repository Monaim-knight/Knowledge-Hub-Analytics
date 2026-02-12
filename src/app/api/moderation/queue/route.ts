import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PostStatus, ApprovalStatus } from "@prisma/client";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [pendingPosts, pendingDiscussions, pendingDashboards, pendingFiles] =
    await Promise.all([
      prisma.post.findMany({
        where: { status: PostStatus.PENDING_APPROVAL },
        include: {
          author: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.discussion.findMany({
        where: { approvalStatus: ApprovalStatus.PENDING },
        include: {
          author: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.dashboard.findMany({
        where: { approvalStatus: ApprovalStatus.PENDING },
        include: {
          author: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.file.findMany({
        where: {
          approvalStatus: ApprovalStatus.PENDING,
          postId: null,
          discussionId: null,
          dashboardId: null,
        },
        include: {
          uploader: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  return NextResponse.json({
    posts: pendingPosts,
    discussions: pendingDiscussions,
    dashboards: pendingDashboards,
    files: pendingFiles,
  });
}
