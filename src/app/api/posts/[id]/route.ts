import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { generateUniqueSlug } from "@/lib/slug";
import { PostStatus, PostType } from "@prisma/client";

const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().optional(),
  content: z.string().min(1).optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  type: z.nativeEnum(PostType).optional(),
  status: z.nativeEnum(PostStatus).optional(),
  tagIds: z.array(z.string()).optional(),
  topicIds: z.array(z.string()).optional(),
  fileIds: z.array(z.string()).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdminOrAuthor = session.user?.role === "ADMIN" || session.user?.role === "AUTHOR";

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (post.authorId !== session.user!.id && session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = updatePostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const { tagIds, topicIds, fileIds, ...updateData } = data;
    let slug = post.slug;

    if (data.title && data.title !== post.title) {
      const existingSlugs = (
        await prisma.post.findMany({
          where: { id: { not: id } },
          select: { slug: true },
        })
      ).map((p) => p.slug);
      slug = generateUniqueSlug(data.title, existingSlugs);
    }

    const content = data.content ?? post.content;
    const readingTimeMinutes = Math.max(1, Math.ceil(content.split(/\s+/).length / 200));

    // MEMBER cannot publish; status changes only for ADMIN/AUTHOR
    const effectiveStatus =
      !isAdminOrAuthor && data.status === PostStatus.PUBLISHED
        ? post.status
        : data.status;

    await prisma.post.update({
      where: { id },
      data: {
        ...updateData,
        status: effectiveStatus ?? post.status,
        slug,
        readingTimeMinutes,
        coverImageUrl: data.coverImageUrl === "" ? null : data.coverImageUrl,
        publishedAt:
          effectiveStatus === PostStatus.PUBLISHED && !post.publishedAt
            ? new Date()
            : effectiveStatus === PostStatus.DRAFT
              ? null
              : post.publishedAt,
        postTags:
          tagIds !== undefined
            ? {
                deleteMany: {},
                create: tagIds.map((tagId) => ({ tagId })),
              }
            : undefined,
        topicPosts:
          topicIds !== undefined
            ? {
                deleteMany: {},
                create: topicIds.map((topicId) => ({ topicId })),
              }
            : undefined,
      },
    });

    if (fileIds !== undefined) {
      await prisma.file.updateMany({
        where: { postId: id },
        data: { postId: null },
      });
      if (fileIds.length > 0) {
        await prisma.file.updateMany({
          where: {
            id: { in: fileIds },
            uploaderId: session.user!.id,
          },
          data: { postId: id },
        });
      }
    }

    const updated = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        postTags: { include: { tag: true } },
        topicPosts: { include: { topic: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update post error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "AUTHOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (post.authorId !== session.user!.id && session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
