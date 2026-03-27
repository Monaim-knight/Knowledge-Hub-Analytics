import jwt from "jsonwebtoken";

export function requireAuth(req, _res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const tokenFromHeader = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    const token = tokenFromHeader || req.cookies?.token;

    if (!token) {
      const err = new Error("Unauthorized");
      err.statusCode = 401;
      throw err;
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch {
    const err = new Error("Invalid or expired token");
    err.statusCode = 401;
    next(err);
  }
}

