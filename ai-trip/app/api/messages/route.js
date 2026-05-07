import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req) {
  const user = getUserFromRequest(req);

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("messages")
    .insert([
      {
        trip_id: body.trip_id,
        user_id: user.userId,
        content: body.content,
      },
    ])
    .select()
    .single();

  return Response.json({ data, error });
}