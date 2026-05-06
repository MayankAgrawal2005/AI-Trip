import jwt from "jsonwebtoken";

export function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function getUserFromRequest(req) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}