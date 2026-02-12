import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PageViewEntityType } from "@prisma/client";
import { z } from "zod";

const schema = z.object({
  entityType: z.enum(["POST", "DASHBOARD", "OTHER"]),
  entityId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { entityType, entityId } = parsed.data;

    const forward = request.headers.get("x-forwarded-for");
    const ip = forward?.split(",")[0]?.trim() ?? null;

    await prisma.pageView.create({
      data: {
        entityType: entityType as PageViewEntityType,
        entityId,
        viewerIp: ip,
      },
    });

    return NextResponse.json({ recorded: true });
  } catch (error) {
    console.error("PageView error:", error);
    return NextResponse.json(
      { error: "Failed to record view" },
      { status: 500 }
    );
  }
}
