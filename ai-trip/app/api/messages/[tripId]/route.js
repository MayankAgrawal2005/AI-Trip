import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req, { params }) {
  const user = getUserFromRequest(req);

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tripId } = await params;

  const { data, error } = await supabaseAdmin
    .from("messages")
    .select(`
      *,
      users (
        name
      )
    `)
    .eq("trip_id", tripId)
    .order("created_at", { ascending: true });

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

  // 🔹 Only sender can edit
  const { data: message } = await supabaseAdmin
    .from("messages")
    .select("*")
    .eq("id", id)
    .single();

  if (!message) {
    return Response.json(
      { error: "Message not found" },
      { status: 404 }
    );
  }

  if (message.user_id !== user.userId) {
    return Response.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("messages")
    .update({
      content: body.content,
    })
    .eq("id", id)
    .select()
    .single();

  return Response.json({ data, error });
}

export async function DELETE(req, { params }) {
  const user = getUserFromRequest(req);

  if (!user) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  // 🔹 Only sender can delete
  const { data: message } = await supabaseAdmin
    .from("messages")
    .select("*")
    .eq("id", id)
    .single();

  if (!message) {
    return Response.json(
      { error: "Message not found" },
      { status: 404 }
    );
  }

  if (message.user_id !== user.userId) {
    return Response.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const { error } = await supabaseAdmin
    .from("messages")
    .delete()
    .eq("id", id);

  return Response.json({
    success: !error,
  });
}

