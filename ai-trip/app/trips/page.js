// app/trips/page.js
"use client";

import { supabase } from "../../lib/supabase";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function TripsPage() {
  const [title, setTitle] = useState("");
  const [trips, setTrips] = useState([]);

  const createTrip = async () => {
    await supabase.from("trips").insert([{ title }]);
    setTitle("");
    fetchTrips();
  };

  const fetchTrips = async () => {
    const { data } = await supabase
      .from("trips")
      .select("*")
      .order("created_at", { ascending: false });

    setTrips(data || []);
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Trips</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Trip title"
      />
      <button onClick={createTrip}>Create Trip</button>

      {trips.map((trip) => (
        <div key={trip.id}>
          <Link href={`/trips/${trip.id}`}>
            {trip.title}
          </Link>
        </div>
      ))}
    </div>
  );
}