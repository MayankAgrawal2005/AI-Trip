import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req) {
  const user = getUserFromRequest(req);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("trips")
    .insert([
      {
        title: body.title,
        description: body.description || null,
        created_by: user.userId,
      },
    ])
    .select()
    .single();

  return Response.json({ data, error });
}

export async function GET(req) {
  const user = getUserFromRequest(req);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("trips")
    .select("*")
    .eq("created_by", user.userId)
    .order("created_at", { ascending: false });

  return Response.json({ data, error });
}