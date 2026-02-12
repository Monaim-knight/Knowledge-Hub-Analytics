import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { generateUniqueSlug } from "@/lib/slug";
import { ApprovalStatus } from "@prisma/client";

const createSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  configJson: z.record(z.unknown()).optional(),
  topicIds: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

  const where: Record<string, unknown> = {};
  if (!isAdmin) {
    where.approvalStatus = ApprovalStatus.APPROVED;
  }

  const dashboards = await prisma.dashboard.findMany({
    where,
    include: {
      author: { select: { id: true, name: true } },
      topicDashboards: { include: { topic: true } },
      files: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(dashboards);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdminOrAuthor = session.user?.role === "ADMIN" || session.user?.role === "AUTHOR";

  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, description, configJson, topicIds } = parsed.data;

    const existingSlugs = (
      await prisma.dashboard.findMany({ select: { slug: true } })
    ).map((d) => d.slug);
    const slug = generateUniqueSlug(title, existingSlugs);

    const dashboard = await prisma.dashboard.create({
      data: {
        authorId: session.user!.id,
        title,
        description: description ?? null,
        slug,
        approvalStatus: isAdminOrAuthor ? ApprovalStatus.APPROVED : ApprovalStatus.PENDING,
        configJson: configJson
          ? (configJson as Prisma.InputJsonValue)
          : undefined,
        topicDashboards: topicIds?.length
          ? { create: topicIds.map((topicId) => ({ topicId })) }
          : undefined,
      },
      include: {
        author: { select: { id: true, name: true } },
        topicDashboards: { include: { topic: true } },
      },
    });

    return NextResponse.json(dashboard);
  } catch (error) {
    console.error("Create dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to create dashboard" },
      { status: 500 }
    );
  }
}
