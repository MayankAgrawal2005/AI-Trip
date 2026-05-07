

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req, { params }) {
  const user = getUserFromRequest(req);

  if (!user) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  // 🔹 Check membership
  const { data: membership } = await supabaseAdmin
    .from("trip_members")
    .select("*")
    .eq("trip_id", id)
    .eq("user_id", user.userId)
    .single();

  if (!membership) {
    return Response.json(
      { error: "Access denied" },
      { status: 403 }
    );
  }

  // 🔹 Fetch trip
  const { data, error } = await supabaseAdmin
    .from("trips")
    .select("*")
    .eq("id", id)
    .single();

  return Response.json({ data, error });
}

export async function PUT(req, { params }) {
  const user = getUserFromRequest(req);

  if (!user) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const body = await req.json();

  // 🔹 Verify membership
  const { data: membership } = await supabaseAdmin
    .from("trip_members")
    .select("*")
    .eq("trip_id", id)
    .eq("user_id", user.userId)
    .single();

  if (!membership) {
    return Response.json(
      { error: "Access denied" },
      { status: 403 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("trips")
    .update({
      title: body.title,
      description: body.description,
    })
    .eq("id", id)
    .select()
    .single();

  return Response.json({ data, error });
}

export async function DELETE(req, { params }) {
  const user = getUserFromRequest(req);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const { error } = await supabaseAdmin
    .from("trips")
    .delete()
    .eq("id", id)
    .eq("created_by", user.userId);

  return Response.json({ success: !error });
}





