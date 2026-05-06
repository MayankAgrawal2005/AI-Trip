"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Map from "../../components/Map";
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
  useEffect(() => {
    fetchTrip();
    fetchLocations();
  }, []);

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
    <button onClick={deleteTrip} style={{ marginLeft: 10 }}>
      Delete
    </button>

    {/* 🔹 Divider */}
    <hr style={{ margin: "20px 0" }} />

    {/* 🔹 Locations Section */}
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

    {/* 🔹 Location List */}
    <div style={{ marginTop: 10 }}>
      {places.length === 0 && <p>No locations yet</p>}

      {places.map((p) => (
        <div key={p.id} style={{ marginTop: 5 }}>
          {editingLocId === p.id ? (
            <>
              <input
                value={editPlace}
                onChange={(e) => setEditPlace(e.target.value)}
              />

              <button onClick={() => updateLocation(p.id)}>Save</button>
              <button onClick={() => setEditingLocId(null)}>Cancel</button>
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

    {/* 🔹 Map Section */}
    <h2>Map</h2>

    {/* 🔹 Search Input */}
    <input
      value={place}
      onChange={(e) => setPlace(e.target.value)}
      placeholder="Search location"
    />

    <button onClick={searchPlace} style={{ marginLeft: 10 }}>
      Search
    </button>

    <button
      onClick={addLocation}
      disabled={!place.trim()}
      style={{ marginLeft: 10 }}
    >
      Add Place
    </button>

    {/* 🔹 Map */}
    <Map
      places={places}
      selectedCoords={selectedCoords}
      onSelect={(coords) => setSelectedCoords(coords)}
    />

    {/* 🔹 Selected Coordinates */}
    {selectedCoords && (
      <p style={{ marginTop: 10 }}>
        Selected: {selectedCoords.lat}, {selectedCoords.lng}
      </p>
    )}
  </div>
);
}