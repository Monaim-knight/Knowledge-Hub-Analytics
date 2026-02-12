import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  content: z.string().min(1, "Content is required").max(2000),
  parentReplyId: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  const discussion = await prisma.discussion.findUnique({
    where: { slug },
  });

  if (!discussion) {
    return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { content, parentReplyId } = parsed.data;

    if (parentReplyId) {
      const parent = await prisma.discussionReply.findUnique({
        where: { id: parentReplyId },
      });
      if (!parent || parent.discussionId !== discussion.id) {
        return NextResponse.json({ error: "Invalid parent reply" }, { status: 400 });
      }
    }

    const reply = await prisma.discussionReply.create({
      data: {
        discussionId: discussion.id,
        userId: session.user!.id,
        content,
        parentReplyId: parentReplyId ?? null,
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(reply);
  } catch (error) {
    console.error("Create reply error:", error);
    return NextResponse.json(
      { error: "Failed to create reply" },
      { status: 500 }
    );
  }
}
