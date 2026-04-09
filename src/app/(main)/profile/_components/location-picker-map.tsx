"use client";

import { useEffect, useMemo, useState } from "react";
import L, { type LatLngExpression } from "leaflet";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

type LocationPickerMapProps = {
  latitude: number;
  longitude: number;
  onChange: (latitude: number, longitude: number) => void;
};

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
});

function MapResizeFix() {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 50);

    return () => window.clearTimeout(timer);
  }, [map]);

  return null;
}

function MapClickHandler({
  onPick,
}: {
  onPick: (latitude: number, longitude: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

function MapCenterUpdater({ position }: { position: LatLngExpression }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position);
  }, [map, position]);

  return null;
}

export default function LocationPickerMap({
  latitude,
  longitude,
  onChange,
}: LocationPickerMapProps) {
  const [position, setPosition] = useState<LatLngExpression>([
    latitude,
    longitude,
  ]);

  useEffect(() => {
    setPosition([latitude, longitude]);
  }, [latitude, longitude]);

  const markerPosition = useMemo(() => position, [position]);

  return (
    <MapContainer
      center={position}
      zoom={15}
      scrollWheelZoom
      className="h-72 w-full rounded-xl border-2 border-gray-200 dark:border-gray-600"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapResizeFix />
      <MapCenterUpdater position={position} />
      <MapClickHandler
        onPick={(lat, lng) => {
          const next: LatLngExpression = [lat, lng];
          setPosition(next);
          onChange(lat, lng);
        }}
      />
      <Marker
        position={markerPosition}
        icon={markerIcon}
        draggable
        eventHandlers={{
          dragend: (event) => {
            const marker = event.target as L.Marker;
            const latLng = marker.getLatLng();
            const next: LatLngExpression = [latLng.lat, latLng.lng];
            setPosition(next);
            onChange(latLng.lat, latLng.lng);
          },
        }}
      />
    </MapContainer>
  );
}
