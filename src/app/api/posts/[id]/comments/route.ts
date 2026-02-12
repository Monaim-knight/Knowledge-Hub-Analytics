import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createCommentSchema = z.object({
  content: z.string().min(1, "Content is required").max(2000),
  parentCommentId: z.string().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params;

  const comments = await prisma.comment.findMany({
    where: {
      postId,
      isHidden: false,
      parentCommentId: null,
    },
    include: {
      user: { select: { id: true, name: true } },
      upvotes: { select: { userId: true } },
      replies: {
        where: { isHidden: false },
        include: {
          user: { select: { id: true, name: true } },
          upvotes: { select: { userId: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(comments);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: postId } = await params;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, status: true },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (post.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Cannot comment on draft posts" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const parsed = createCommentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { content, parentCommentId } = parsed.data;

    if (parentCommentId) {
      const parent = await prisma.comment.findUnique({
        where: { id: parentCommentId },
      });
      if (!parent || parent.postId !== postId || parent.isHidden) {
        return NextResponse.json({ error: "Invalid parent comment" }, { status: 400 });
      }
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        userId: session.user!.id,
        content,
        parentCommentId: parentCommentId ?? null,
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Create comment error:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
