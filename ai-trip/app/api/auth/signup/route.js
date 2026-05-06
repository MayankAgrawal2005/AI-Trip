import { supabaseAdmin } from "@/lib/supabaseAdmin";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const body = await req.json();

  const hashed = await bcrypt.hash(body.password, 10);

  const { data, error } = await supabaseAdmin
    .from("users")
    .insert([
      {
        name: body.name,
        email: body.email,
        password_hash: hashed,
      },
    ])
    .select()
    .single();

  if (error) {
    return Response.json({ error }, { status: 400 });
  }

  return Response.json({ user: data });
}