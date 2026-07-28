"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { WeatherStationItem } from "@/lib/web-lab/agri-weather/types";

interface Props {
  stations: WeatherStationItem[];
  center?: [number, number];
  zoom?: number;
}

export default function WeatherMapInner({ stations, center = [23.9739, 120.982], zoom = 7 }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || leafletInstance.current) return;

    const map = L.map(mapRef.current).setView(center, zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    leafletInstance.current = map;

    return () => {
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }
    };
  }, [center, zoom]);

  useEffect(() => {
    const map = leafletInstance.current;
    if (!map) return;

    // Fix default marker icon issue in Leaflet
    const defaultIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    stations.forEach((st) => {
      const popupContent = `
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
          <strong style="font-size: 14px;">測站：${st.name} (${st.stationId})</strong><br/>
          🌡️ 氣溫：<b>${st.temperature}°C</b><br/>
          🌧️ 累積雨量：<b>${st.rainfall} mm</b><br/>
          <small style="color: #666;">觀測時間：${new Date(st.observedAt).toLocaleTimeString()}</small>
        </div>
      `;

      L.marker([st.latitude, st.longitude], { icon: defaultIcon })
        .addTo(map)
        .bindPopup(popupContent);
    });
  }, [stations]);

  return <div ref={mapRef} className="w-full h-80 rounded-xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800" />;
}
