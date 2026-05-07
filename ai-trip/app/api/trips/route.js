// import { supabaseAdmin } from "@/lib/supabaseAdmin";
// import { getUserFromRequest } from "@/lib/auth";

// export async function POST(req) {
//   const user = getUserFromRequest(req);
//   if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

//   const body = await req.json();

//   const { data, error } = await supabaseAdmin
//     .from("trips")
//     .insert([
//       {
//         title: body.title,
//         description: body.description || null,
//         created_by: user.userId,
//       },
//     ])
//     .select()
//     .single();


//     if (data) {
//   await supabaseAdmin
//     .from("trip_members")
//     .insert([
//       {
//         trip_id: data.id,
//         user_id: user.userId,
//         role: "owner",
//       },
//     ]);
//   }

//   return Response.json({ data, error });
// }

// export async function GET(req) {
//   const user = getUserFromRequest(req);

//   if (!user) {
//     return Response.json(
//       { error: "Unauthorized" },
//       { status: 401 }
//     );
//   }

//   // 🔹 Find memberships
//   const { data: memberships, error: memberError } =
//     await supabaseAdmin
//       .from("trip_members")
//       .select(`
//         trip_id,
//         trips (
//           *
//         )
//       `)
//       .eq("user_id", user.userId);

//   if (memberError) {
//     return Response.json({
//       error: memberError.message,
//     });
//   }

//   // 🔹 Extract trips
//   const trips = memberships.map((m) => m.trips);

//   return Response.json({
//     data: trips,
//   });
// }


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
    if (data) {
  await supabaseAdmin
    .from("trip_members")
    .insert([
      {
        trip_id: data.id,
        user_id: user.userId,
        role: "owner",
      },
    ]);}
  return Response.json({ data, error });
}

export async function GET(req) {
  const user = getUserFromRequest(req);

  if (!user) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("trip_members")
    .select(`
      trip_id,
      trips (
        id,
        title,
        description,
        created_at
      )
    `)
    .eq("user_id", user.userId);

  if (error) {
    return Response.json({ error: error.message });
  }

  // remove null trips
  const trips = data
    .map((item) => item.trips)
    .filter(Boolean);

  return Response.json({
    data: trips,
  });
}