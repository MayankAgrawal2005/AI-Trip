import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req, { params }) {
  const user = getUserFromRequest(req);

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tripId } = await params;

  const { data, error } = await supabaseAdmin
    .from("trip_members")
    .select(`
      id,
      users (
        id,
        name,
        email
      )
    `)
    .eq("trip_id", tripId);

  return Response.json({ data, error });
}