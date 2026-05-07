import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req, { params }) {
  const user = getUserFromRequest(req);

  if (!user) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  // 🔹 Get invite
  const { data: invite } = await supabaseAdmin
    .from("trip_invites")
    .select("*")
    .eq("id", id)
    .single();

  if (!invite) {
    return Response.json(
      { error: "Invite not found" },
      { status: 404 }
    );
  }

  // 🔹 Add member
  await supabaseAdmin
    .from("trip_members")
    .insert([
      {
        trip_id: invite.trip_id,
        user_id: user.userId,
      },
    ]);

  // 🔹 Update invite
  await supabaseAdmin
    .from("trip_invites")
    .update({
      status: "accepted",
    })
    .eq("id", id);

  return Response.json({ success: true });
}