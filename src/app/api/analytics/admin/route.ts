import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PostStatus } from "@prisma/client";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    topPostsByViews,
    topPostsByComments,
    userSignupsOverTime,
    totalPageViews,
  ] = await Promise.all([
    prisma.pageView.groupBy({
      by: ["entityId"],
      where: { entityType: "POST" },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }).then(async (views) => {
      const postIds = views.map((v) => v.entityId);
      const posts = await prisma.post.findMany({
        where: { id: { in: postIds }, status: PostStatus.PUBLISHED },
        select: { id: true, title: true, slug: true },
      });
      const postMap = new Map(posts.map((p) => [p.id, p]));
      return views.map((v) => ({
        postId: v.entityId,
        views: v._count.id,
        title: postMap.get(v.entityId)?.title ?? "Unknown",
        slug: postMap.get(v.entityId)?.slug ?? "",
      }));
    }),
    prisma.post.findMany({
      where: { status: PostStatus.PUBLISHED },
      select: {
        id: true,
        title: true,
        slug: true,
        _count: { select: { comments: true } },
      },
      orderBy: { comments: { _count: "desc" } },
      take: 10,
    }).then((posts) =>
      posts.map((p) => ({
        postId: p.id,
        title: p.title,
        slug: p.slug,
        comments: p._count.comments,
      }))
    ),
    prisma.user.findMany({
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }).then((users) => {
      const byDate = new Map<string, number>();
      for (const u of users) {
        const date = u.createdAt.toISOString().slice(0, 10);
        byDate.set(date, (byDate.get(date) ?? 0) + 1);
      }
      const sorted = Array.from(byDate.entries()).sort(
        ([a], [b]) => a.localeCompare(b)
      );
      return sorted.map(([date, count]) => ({ date, count }));
    }),
    prisma.pageView.count(),
  ]);

  return NextResponse.json({
    topPostsByViews,
    topPostsByComments,
    userSignupsOverTime,
    totalPageViews,
  });
}
