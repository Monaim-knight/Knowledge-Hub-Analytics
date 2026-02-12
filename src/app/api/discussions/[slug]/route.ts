import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const discussion = await prisma.discussion.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true } },
      tags: { include: { tag: true } },
      files: true,
      replies: {
        include: {
          user: { select: { id: true, name: true } },
          replies: {
            include: {
              user: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        where: { parentReplyId: null },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!discussion) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(discussion);
}
