"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";


import { useRef } from "react";
// import supabase from "../../lib/supabase";
import {supabase} from "../../../lib/supabase";

const Map = dynamic(() => import("../../components/Map"), { ssr: false });
export default function TripDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [place, setPlace] = useState("");
  const [places, setPlaces] = useState([]);
  const [trip, setTrip] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingLocId, setEditingLocId] = useState(null);
  const [editPlace, setEditPlace] = useState("");
  const [selectedCoords, setSelectedCoords] = useState(null);
 
  const [memberEmail, setMemberEmail] = useState("");
  const [members, setMembers] = useState([]);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const chatRef = useRef(null);

  const [editingMessageId, setEditingMessageId] =
  useState(null);

const [editMessage, setEditMessage] =
  useState("");

const [currentUser, setCurrentUser] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

 



  // 🔹 Fetch single trip
  const fetchTrip = async () => {
    const res = await fetch(`/api/trips/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.data) {
      setTrip(data.data);
      setTitle(data.data.title || "");
      setDescription(data.data.description || "");
    }
  };

  // 🔹 Update trip
  const updateTrip = async () => {
    await fetch(`/api/trips/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    alert("Updated");
    fetchTrip();
  };

  // 🔹 Delete trip
  const deleteTrip = async () => {
    await fetch(`/api/trips/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    router.push("/trips");
  };
  const fetchLocations = async () => {
  const res = await fetch(`/api/locations?trip_id=${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  setPlaces(data.data || []);
};
const addLocation = async () => {
  if (!place.trim()) return alert("Enter place");

  await fetch("/api/locations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      trip_id: id,
      name: place,
      latitude: selectedCoords?.lat,
      longitude: selectedCoords?.lng, 
    }),
  });

  setPlace("");
  setSelectedCoords(null);
  fetchLocations();
};

const deleteLocation = async (locId) => {
  await fetch(`/api/locations/${locId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  fetchLocations();
};

const updateLocation = async (locId) => {
  await fetch(`/api/locations/${locId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: editPlace,
    }),
  });

  setEditingLocId(null);
  setEditPlace("");
  fetchLocations();
};

// add member
const inviteMember = async () => {
  await fetch("/api/trip-members", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      trip_id: id,
      email: memberEmail,
    }),
  });

  setMemberEmail("");
  fetchMembers();
};


const fetchMembers = async () => {
  const res = await fetch(`/api/trip-members/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  setMembers(data.data || []);
};


const sendMessage = async () => {
  if (!message.trim()) return;

  await fetch("/api/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      trip_id: id,
      content: message,
    }),
  });

  setMessage("");
  // fetchMessages();
};

const fetchMessages = async () => {
  const res = await fetch(`/api/messages/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  setMessages(data.data || []);
};



const searchPlace = async () => {
  if (!place.trim()) return;

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
  );

  const data = await res.json();

  if (data.length === 0) {
    alert("Place not found");
    return;
  }

  const coords = {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };

  setSelectedCoords(coords);
};

const deleteMessage = async (messageId) => {
  const token = localStorage.getItem("token");

  await fetch(`/api/messages/${messageId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  fetchMessages();
};

const updateMessage = async (messageId) => {
  const token = localStorage.getItem("token");

  await fetch(`/api/messages/${messageId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: editMessage,
    }),
  });

  setEditingMessageId(null);
  setEditMessage("");

  fetchMessages();
};

  useEffect(() => {
    fetchTrip();
    fetchLocations();
    fetchMembers();
    fetchMessages();
 
    // 🔥 Realtime chat subscription
  const channel = supabase
    .channel(`trip-${id}-messages`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
      },
      async (payload) => {
        const newMessage = payload.new;

        // only current trip messages
        if (newMessage.trip_id === id) {
          // fetch fresh messages
          fetchMessages();
        }
      }
    )
    .subscribe();

  // cleanup
  return () => {
    supabase.removeChannel(channel);
  };

  }, [id]);

 useEffect(() => {
  if (chatRef.current) {
    chatRef.current.scrollTop =
      chatRef.current.scrollHeight;
  }

  const user = JSON.parse(
  localStorage.getItem("user")
);

setCurrentUser(user);


}, [messages]);

  if (!trip) return <p>Loading...</p>;






return (
  <div style={{ padding: 20 }}>
    <h1>Trip Details</h1>

    {/* 🔹 Trip Info */}
    <div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
    </div>

    <div style={{ marginTop: 10 }}>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
    </div>

    <br />

    <button onClick={updateTrip}>Update</button>

    <button
      onClick={deleteTrip}
      style={{ marginLeft: 10 }}
    >
      Delete
    </button>

    {/* 🔹 Divider */}
    <hr style={{ margin: "20px 0" }} />

    {/* 🔹 Locations */}
    <h2>Locations</h2>

    <input
      value={place}
      onChange={(e) => setPlace(e.target.value)}
      placeholder="Add place"
    />

    <button
      onClick={addLocation}
      disabled={!place.trim()}
      style={{ marginLeft: 10 }}
    >
      Add Place
    </button>

    {/* 🔹 Locations List */}
    <div style={{ marginTop: 10 }}>
      {places.length === 0 && (
        <p>No locations yet</p>
      )}

      {places.map((p) => (
        <div
          key={p.id}
          style={{
            marginTop: 8,
            padding: 8,
            border: "1px solid #ddd",
            borderRadius: 6,
          }}
        >
          {editingLocId === p.id ? (
            <>
              <input
                value={editPlace}
                onChange={(e) =>
                  setEditPlace(e.target.value)
                }
              />

              <button
                onClick={() => updateLocation(p.id)}
                style={{ marginLeft: 10 }}
              >
                Save
              </button>

              <button
                onClick={() => setEditingLocId(null)}
                style={{ marginLeft: 5 }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <span>{p.name}</span>

              <button
                onClick={() => {
                  setEditingLocId(p.id);
                  setEditPlace(p.name);
                }}
                style={{ marginLeft: 10 }}
              >
                Edit
              </button>

              <button
                onClick={() => deleteLocation(p.id)}
                style={{ marginLeft: 5 }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>

    {/* 🔹 Divider */}
    <hr style={{ margin: "20px 0" }} />

    {/* 🔹 Map */}
    <h2>Map</h2>

    <input
      value={place}
      onChange={(e) => setPlace(e.target.value)}
      placeholder="Search location"
    />

    <button
      onClick={searchPlace}
      style={{ marginLeft: 10 }}
    >
      Search
    </button>

    <button
      onClick={addLocation}
      disabled={!place.trim()}
      style={{ marginLeft: 10 }}
    >
      Add Place
    </button>

    <div style={{ marginTop: 15 }}>
      <Map
        places={places}
        selectedCoords={selectedCoords}
        onSelect={(coords) =>
          setSelectedCoords(coords)
        }
      />
    </div>

    {/* 🔹 Selected Coordinates */}
    {selectedCoords && (
      <p style={{ marginTop: 10 }}>
        Selected:
        {" "}
        {selectedCoords.lat},
        {" "}
        {selectedCoords.lng}
      </p>
    )}

    {/* 🔹 Divider */}
    <hr style={{ margin: "20px 0" }} />

    {/* 🔹 Members */}
    <h2>Members</h2>

    <input
      value={memberEmail}
      onChange={(e) =>
        setMemberEmail(e.target.value)
      }
      placeholder="Invite by email"
    />

    <button
      onClick={inviteMember}
      style={{ marginLeft: 10 }}
    >
      Invite
    </button>

    <div style={{ marginTop: 10 }}>
      {members.length === 0 && (
        <p>No members yet</p>
      )}

      {members.map((m) => (
        <div
          key={m.id}
          style={{
            padding: 6,
            borderBottom: "1px solid #eee",
          }}
        >
          {m.users?.name}
          {" "}
          (
          {m.users?.email}
          )
        </div>
      ))}
    </div>

    {/* 🔹 Divider */}
    <hr style={{ margin: "20px 0" }} />

    {/* 🔹 Group Chat */}
    <h2>Group Chat</h2>

    <div ref={chatRef}
    className="bg-black"
      style={{
        border: "1px solid #ccc",
        padding: 10,
        height: 300,
        overflowY: "auto",
        borderRadius: 8,
        background: "",
      }}
    >
      {messages.length === 0 && (
        <p>No messages yet</p>
      )}

      {messages.map((m) => (
  <div
  className="bg-black"
    key={m.id}
    style={{
      marginBottom: 12,
      padding: 8,
      borderRadius: 6,
      background: "",
    }}
  >
    <b>{m.users?.name || "Unknown"}:</b>

    {editingMessageId === m.id ? (
      <>
        <input
          value={editMessage}
          onChange={(e) =>
            setEditMessage(e.target.value)
          }
          style={{ marginLeft: 10 }}
        />

        <button
          onClick={() => updateMessage(m.id)}
          style={{ marginLeft: 10 }}
        >
          Save
        </button>

        <button
          onClick={() =>
            setEditingMessageId(null)
          }
          style={{ marginLeft: 5 }}
        >
          Cancel
        </button>
      </>
    ) : (
      <>
        <div style={{ marginTop: 4 }}>
          {m.content}
        </div>

        {/* 🔹 Only sender sees controls */}
        {currentUser?.user_id === m.user_id && (
          <div style={{ marginTop: 5 }}>
            <button
              onClick={() => {
                setEditingMessageId(m.id);
                setEditMessage(m.content);
              }}
            >
              Edit
            </button>

            <button
              onClick={() =>
                deleteMessage(m.id)
              }
              style={{ marginLeft: 5 }}
            >
              Delete
            </button>
          </div>
        )}
      </>
    )}
  </div>
))}
    </div>

    {/* 🔹 Chat Input */}
    <div  style={{ marginTop: 10 }}>
      <input
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
        placeholder="Type message"
      />

      <button
        onClick={sendMessage}
        style={{ marginLeft: 10 }}
      >
        Send
      </button>
    </div>
  </div>
);
}


