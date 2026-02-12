import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PostStatus, ApprovalStatus } from "@prisma/client";
import { z } from "zod";

const bodySchema = z.object({
  entity: z.enum(["post", "discussion", "dashboard", "file"]),
  id: z.string(),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { entity, id } = parsed.data;

  try {
    if (entity === "post") {
      const post = await prisma.post.findUnique({ where: { id } });
      if (!post || post.status !== PostStatus.PENDING_APPROVAL) {
        return NextResponse.json({ error: "Post not found or not pending" }, { status: 404 });
      }
      await prisma.post.update({
        where: { id },
        data: { status: PostStatus.DRAFT, publishedAt: null },
      });
    } else if (entity === "discussion") {
      const d = await prisma.discussion.findUnique({ where: { id } });
      if (!d || d.approvalStatus !== ApprovalStatus.PENDING) {
        return NextResponse.json({ error: "Discussion not found or not pending" }, { status: 404 });
      }
      await prisma.discussion.update({
        where: { id },
        data: { approvalStatus: ApprovalStatus.REJECTED },
      });
    } else if (entity === "dashboard") {
      const d = await prisma.dashboard.findUnique({ where: { id } });
      if (!d || d.approvalStatus !== ApprovalStatus.PENDING) {
        return NextResponse.json({ error: "Dashboard not found or not pending" }, { status: 404 });
      }
      await prisma.dashboard.update({
        where: { id },
        data: { approvalStatus: ApprovalStatus.REJECTED },
      });
    } else {
      const f = await prisma.file.findUnique({ where: { id } });
      if (!f || f.approvalStatus !== ApprovalStatus.PENDING) {
        return NextResponse.json({ error: "File not found or not pending" }, { status: 404 });
      }
      await prisma.file.update({
        where: { id },
        data: { approvalStatus: ApprovalStatus.REJECTED },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reject error:", error);
    return NextResponse.json({ error: "Failed to reject" }, { status: 500 });
  }
}
