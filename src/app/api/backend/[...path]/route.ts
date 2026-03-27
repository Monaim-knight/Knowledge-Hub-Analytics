import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE =
  process.env.BACKEND_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000/api";

async function proxy(req: NextRequest, method: string, path: string[]) {
  const targetUrl = new URL(`${BACKEND_BASE}/${path.join("/")}`);
  req.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  const headers = new Headers();
  const contentType = req.headers.get("content-type");
  const authorization = req.headers.get("authorization");
  if (contentType) headers.set("content-type", contentType);
  if (authorization) headers.set("authorization", authorization);

  let body: string | undefined;
  if (!["GET", "HEAD"].includes(method)) {
    body = await req.text();
  }

  try {
    const res = await fetch(targetUrl.toString(), {
      method,
      headers,
      body,
      cache: "no-store",
    });

    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") || "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Backend API is unreachable. Ensure backend runs on port 5000.",
      },
      { status: 502 }
    );
  }
}

type RouteParams = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { path } = await params;
  return proxy(req, "GET", path);
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { path } = await params;
  return proxy(req, "POST", path);
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { path } = await params;
  return proxy(req, "PUT", path);
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { path } = await params;
  return proxy(req, "DELETE", path);
}

