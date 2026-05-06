"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* 🔴 Fix marker icons */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* 🔵 Click handler */
function LocationSelector({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

/* 🟡 Move map dynamically */
function MapController({ selectedCoords }) {
  const map = useMap();

  useEffect(() => {
    if (selectedCoords) {
      map.setView([selectedCoords.lat, selectedCoords.lng], 13);
    }
  }, [selectedCoords]);

  return null;
}

export default function Map({ places, selectedCoords, onSelect }) {
  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationSelector onSelect={onSelect} />
      <MapController selectedCoords={selectedCoords} />

      {/* Saved markers */}
      {places.map(
        (p) =>
          p.latitude &&
          p.longitude && (
            <Marker key={p.id} position={[p.latitude, p.longitude]} />
          )
      )}

      {/* Temporary marker */}
      {selectedCoords && (
        <Marker position={[selectedCoords.lat, selectedCoords.lng]} />
      )}
    </MapContainer>
  );
}