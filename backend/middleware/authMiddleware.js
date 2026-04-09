import jwt from "jsonwebtoken";

export function requireAuth(req, _res, next) {
  const authHeader = String(req.headers.authorization || "");
  const tokenFromHeader = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : "";
  const token = (tokenFromHeader || req.cookies?.token || "").trim();

  if (!token) {
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    return next(err);
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const err = new Error("Server misconfiguration: JWT_SECRET is not set");
    err.statusCode = 500;
    return next(err);
  }

  try {
    const payload = jwt.verify(token, secret);
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (e) {
    const err = new Error("Invalid or expired token");
    err.statusCode = 401;
    if (e instanceof jwt.TokenExpiredError) {
      err.message = "Session expired — sign in again";
    } else if (e instanceof jwt.JsonWebTokenError) {
      err.message =
        "Invalid session — sign out and sign in again (if you changed JWT_SECRET, old tokens no longer work)";
    }
    next(err);
  }
}
