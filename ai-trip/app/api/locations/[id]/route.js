import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserFromRequest } from "@/lib/auth";

export async function DELETE(req, { params }) {
  const user = getUserFromRequest(req);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const { error } = await supabaseAdmin
    .from("locations")
    .delete()
    .eq("id", id);

  return Response.json({ success: !error });
}

export async function PUT(req, { params }) {
  const user = getUserFromRequest(req);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("locations")
    .update({
      name: body.name,
    })
    .eq("id", id)
    .select()
    .single();

  return Response.json({ data, error });
}