/**
 * Health check endpoint for API readiness.
 */
export async function GET() {
  return Response.json({ status: "ok", timestamp: new Date().toISOString() });
}
