import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { generateUniqueSlug } from "@/lib/slug";
import { ApprovalStatus } from "@prisma/client";

const createSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required").max(5000),
  tagIds: z.array(z.string()).optional(),
  topicIds: z.array(z.string()).optional(),
  fileIds: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");
  const topic = searchParams.get("topic");
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

  const where: Record<string, unknown> = {};
  if (!isAdmin) {
    where.approvalStatus = ApprovalStatus.APPROVED;
  }
  if (tag) {
    where.tags = {
      some: { tag: { slug: tag } },
    };
  }
  if (topic) {
    where.topicDiscussions = {
      some: { topic: { slug: topic } },
    };
  }

  const discussions = await prisma.discussion.findMany({
    where,
    include: {
      author: { select: { id: true, name: true } },
      tags: { include: { tag: true } },
      topicDiscussions: { include: { topic: true } },
      _count: { select: { replies: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(discussions);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const { title, content, tagIds, topicIds, fileIds } = parsed.data;

    const existingSlugs = (
      await prisma.discussion.findMany({ select: { slug: true } })
    ).map((d) => d.slug);
    const slug = generateUniqueSlug(title, existingSlugs);

    const isAdminOrAuthor = session.user?.role === "ADMIN" || session.user?.role === "AUTHOR";

    const discussion = await prisma.discussion.create({
      data: {
        authorId: session.user!.id,
        title,
        content,
        slug,
        approvalStatus: isAdminOrAuthor ? ApprovalStatus.APPROVED : ApprovalStatus.PENDING,
        tags: tagIds?.length
          ? { create: tagIds.map((tagId) => ({ tagId })) }
          : undefined,
        topicDiscussions: topicIds?.length
          ? { create: topicIds.map((topicId) => ({ topicId })) }
          : undefined,
      },
      include: {
        author: { select: { id: true, name: true } },
        tags: { include: { tag: true } },
      },
    });

    if (fileIds?.length) {
      await prisma.file.updateMany({
        where: {
          id: { in: fileIds },
          uploaderId: session.user!.id,
        },
        data: { discussionId: discussion.id },
      });
    }

    return NextResponse.json(discussion);
  } catch (error) {
    console.error("Create discussion error:", error);
    return NextResponse.json(
      { error: "Failed to create discussion" },
      { status: 500 }
    );
  }
}
