// app/trips/[id]/page.js
"use client";

import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { useEffect, useState } from "react";

export default function TripDetails() {
  const { id } = useParams();

  const [trip, setTrip] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      const { data } = await supabase
        .from("trips")
        .select("*")
        .eq("id", id)
        .single();

      setTrip(data);
    };

    fetchTrip();
  }, [id]);

  if (!trip) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{trip.title}</h1>
      <p>{trip.description}</p>
    </div>
  );
}