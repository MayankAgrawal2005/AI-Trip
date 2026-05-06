import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req) {
  const user = getUserFromRequest(req);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("locations")
    .insert([
      {
        trip_id: body.trip_id,
        name: body.name,
        latitude: body.latitude || null,
        longitude: body.longitude || null,
      },
    ])
    .select()
    .single();

  return Response.json({ data, error });
}

export async function GET(req) {
  const user = getUserFromRequest(req);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const trip_id = searchParams.get("trip_id");

  const { data, error } = await supabaseAdmin
    .from("locations")
    .select("*")
    .eq("trip_id", trip_id)
    .order("created_at", { ascending: true });

  return Response.json({ data, error });
}