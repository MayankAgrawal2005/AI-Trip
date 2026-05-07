"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [invites,setInvites] = useState([]);


  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;


  const fetchTrips = async () => {
    const res = await fetch("/api/trips", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTrips(data.data || []);
  };
  

  const createTrip = async () => {
    await fetch("/api/trips", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    setTitle("");
    fetchTrips();
  };

  const updateTrip = async (id) => {
    await fetch(`/api/trips/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    setEditingId(null);
    setTitle("");
    fetchTrips();
  };

  const deleteTrip = async (id) => {
    await fetch(`/api/trips/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchTrips();
  };


  const fetchInvites = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("/api/invites", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  setInvites(data.data || []);
};


const acceptInvite = async (inviteId) => {
  const token = localStorage.getItem("token");

  await fetch(`/api/invites/${inviteId}/accept`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  fetchInvites();
  fetchTrips();
};

  useEffect(() => {
    fetchTrips();
    fetchInvites();
  }, []);




  return (
    <div style={{ padding: 20 }}>
      <h1>Trips</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Trip title"
      />

      <hr />

<h2>Pending Invites</h2>

{invites.length === 0 && <p>No pending invites</p>}

{invites.map((invite) => (
  <div key={invite.id} style={{ marginBottom: 10 }}>
    <span>
      Invited to: {invite.trips?.title}
    </span>

    <button
      onClick={() => acceptInvite(invite.id)}
      style={{ marginLeft: 10 }}
    >
      Accept
    </button>
  </div>
))}
      <button onClick={editingId ? () => updateTrip(editingId) : createTrip}>
        {editingId ? "Update" : "Create"}
      </button>

      {trips.map((trip) => (
        <div key={trip.id}>
          <Link href={`/trips/${trip.id}`}>
            <b>{trip.title}</b>
          </Link>

          <button onClick={() => {
            setEditingId(trip.id);
            setTitle(trip.title);
          }}>
            Edit
          </button>

          <button onClick={() => deleteTrip(trip.id)}>
            Delete
          </button>
        </div>
      ))}












    </div>
  );
}