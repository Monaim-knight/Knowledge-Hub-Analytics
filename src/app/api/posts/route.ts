import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { slugify, generateUniqueSlug } from "@/lib/slug";
import { PostStatus, PostType } from "@prisma/client";

const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  type: z.nativeEnum(PostType),
  status: z.nativeEnum(PostStatus),
  tagIds: z.array(z.string()).optional(),
  topicIds: z.array(z.string()).optional(),
  fileIds: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");
  const topic = searchParams.get("topic");
  const type = searchParams.get("type") as PostType | null;
  const status = searchParams.get("status") as PostStatus | null;
  const session = await getServerSession(authOptions);

  const isAuthor = session?.user?.role === "ADMIN" || session?.user?.role === "AUTHOR";

  const where: Record<string, unknown> = {};

  if (!isAuthor) {
    where.status = PostStatus.PUBLISHED;
  } else if (status) {
    where.status = status;
  }

  if (type) where.type = type;
  if (tag) {
    where.postTags = {
      some: { tag: { slug: tag } },
    };
  }
  if (topic) {
    where.topicPosts = {
      some: { topic: { slug: topic } },
    };
  }

  const posts = await prisma.post.findMany({
    where,
    include: {
      author: { select: { id: true, name: true, email: true } },
      postTags: { include: { tag: true } },
      topicPosts: { include: { topic: true } },
    },
    orderBy: [{ status: "asc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdminOrAuthor = session.user?.role === "ADMIN" || session.user?.role === "AUTHOR";

  try {
    const body = await request.json();
    const parsed = createPostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, subtitle, content, coverImageUrl, type, status, tagIds, topicIds, fileIds } = parsed.data;

    // Non-admin/author submissions go to PENDING_APPROVAL regardless of requested status
    const effectiveStatus =
      isAdminOrAuthor ? status : status === PostStatus.PUBLISHED ? PostStatus.PENDING_APPROVAL : status;

    const existingSlugs = (await prisma.post.findMany({ select: { slug: true } })).map(
      (p) => p.slug
    );
    const slug = generateUniqueSlug(title, existingSlugs);

    const readingTimeMinutes = Math.max(1, Math.ceil(content.split(/\s+/).length / 200));

    const post = await prisma.post.create({
      data: {
        authorId: session.user!.id,
        title,
        subtitle: subtitle || null,
        content,
        coverImageUrl: coverImageUrl || null,
        type,
        status: effectiveStatus,
        slug,
        readingTimeMinutes,
        publishedAt: effectiveStatus === PostStatus.PUBLISHED ? new Date() : null,
        postTags: tagIds?.length
          ? { create: tagIds.map((tagId) => ({ tagId })) }
          : undefined,
        topicPosts: topicIds?.length
          ? { create: topicIds.map((topicId) => ({ topicId })) }
          : undefined,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        postTags: { include: { tag: true } },
        topicPosts: { include: { topic: true } },
      },
    });

    if (fileIds?.length) {
      await prisma.file.updateMany({
        where: {
          id: { in: fileIds },
          uploaderId: session.user!.id,
        },
        data: { postId: post.id },
      });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
