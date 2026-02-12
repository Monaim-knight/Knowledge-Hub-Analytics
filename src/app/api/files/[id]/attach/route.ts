import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const file = await prisma.file.findUnique({
    where: { id },
  });

  if (!file) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (file.uploaderId !== session.user!.id && session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { postId, discussionId, dashboardId } = body;

    const updated = await prisma.file.update({
      where: { id },
      data: {
        postId: postId ?? null,
        discussionId: discussionId ?? null,
        dashboardId: dashboardId ?? null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Attach file error:", error);
    return NextResponse.json(
      { error: "Failed to attach file" },
      { status: 500 }
    );
  }
}
