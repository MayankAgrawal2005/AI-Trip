import { supabaseAdmin } from "@/lib/supabaseAdmin";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";

export async function POST(req) {
  const body = await req.json();

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("email", body.email)
    .single();

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 400 });
  }

  const valid = await bcrypt.compare(body.password, user.password_hash);

  if (!valid) {
    return Response.json({ error: "Invalid password" }, { status: 400 });
  }

  const token = generateToken(user);

  return Response.json({ token });
}