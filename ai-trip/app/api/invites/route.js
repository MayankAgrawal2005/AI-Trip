import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req) {
  const user = getUserFromRequest(req);

  if (!user) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("trip_invites")
    .select(`
      *,
      trips (
        title
      )
    `)
    .eq("invited_user_id", user.userId)
    .eq("status", "pending");

  return Response.json({ data, error });
}
