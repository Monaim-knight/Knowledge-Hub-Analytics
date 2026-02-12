import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const comment = await prisma.comment.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  const existing = await prisma.commentUpvote.findUnique({
    where: {
      commentId_userId: { commentId: id, userId: session.user!.id },
    },
  });

  if (existing) {
    await prisma.commentUpvote.delete({
      where: {
        commentId_userId: { commentId: id, userId: session.user!.id },
      },
    });
    return NextResponse.json({ upvoted: false });
  } else {
    await prisma.commentUpvote.create({
      data: {
        commentId: id,
        userId: session.user!.id,
      },
    });
    return NextResponse.json({ upvoted: true });
  }
}
