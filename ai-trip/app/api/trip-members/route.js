import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req) {
  const user = getUserFromRequest(req);

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // 🔹 Find invited user by email
  const { data: invitedUser } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("email", body.email)
    .single();

  if (!invitedUser) {
    return Response.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  // 🔹 Add member
const { data, error } = await supabaseAdmin
  .from("trip_invites")
  .insert([
    {
      trip_id: body.trip_id,
      invited_by: user.userId,
      invited_user_id: invitedUser.id,
    },
  ])
  .select()
  .single();

  return Response.json({ data, error });
}