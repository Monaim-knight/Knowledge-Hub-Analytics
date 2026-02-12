import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { generateUniqueSlug } from "@/lib/slug";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  configJson: z.record(z.unknown()).optional(),
  topicIds: z.array(z.string()).optional(),
});

async function findDashboard(param: string) {
  return prisma.dashboard.findFirst({
    where: { OR: [{ slug: param }, { id: param }] },
    include: {
      author: { select: { id: true, name: true } },
      topicDashboards: { include: { topic: true } },
      files: true,
    },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ param: string }> }
) {
  const { param } = await params;
  const dashboard = await findDashboard(param);

  if (!dashboard) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(dashboard);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ param: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { param } = await params;
  const dashboard = await prisma.dashboard.findFirst({
    where: { OR: [{ slug: param }, { id: param }] },
  });

  if (!dashboard) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (dashboard.authorId !== session.user!.id && session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const { topicIds, configJson, ...baseUpdate } = data;
    let slug = dashboard.slug;

    if (data.title && data.title !== dashboard.title) {
      const existingSlugs = (
        await prisma.dashboard.findMany({
          where: { id: { not: dashboard.id } },
          select: { slug: true },
        })
      ).map((d) => d.slug);
      slug = generateUniqueSlug(data.title, existingSlugs);
    }

    const updated = await prisma.dashboard.update({
      where: { id: dashboard.id },
      data: {
        ...baseUpdate,
        ...(configJson !== undefined && { configJson: configJson as Prisma.InputJsonValue }),
        slug,
        topicDashboards:
          topicIds !== undefined
            ? {
                deleteMany: {},
                create: topicIds.map((topicId) => ({ topicId })),
              }
            : undefined,
      },
      include: {
        author: { select: { id: true, name: true } },
        topicDashboards: { include: { topic: true } },
        files: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to update dashboard" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ param: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { param } = await params;
  const dashboard = await prisma.dashboard.findFirst({
    where: { OR: [{ slug: param }, { id: param }] },
  });

  if (!dashboard) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (dashboard.authorId !== session.user!.id && session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.dashboard.delete({ where: { id: dashboard.id } });
  return NextResponse.json({ deleted: true });
}
