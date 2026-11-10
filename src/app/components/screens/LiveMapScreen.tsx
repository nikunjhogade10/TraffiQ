import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import type { Map as MapLibreMap } from "maplibre-gl";
import { ArrowLeft, Plus, Minus, Compass, Info, X } from "lucide-react";
import { Screen, TrafficState, SensorTelemetry } from "../../types";
import { BottomNavBar } from "../BottomNavBar";

interface LiveMapScreenProps {
  navigate: (screen: Screen) => void;
  trafficState: TrafficState;
  sensorTelemetry: SensorTelemetry;
}

// Actual Geographical Coordinates for MIT-ADT University Main Campus Gate (Loni Kalbhor, Pune)
const MAIN_GATE_COORDS: [number, number] = [74.0264, 18.4908]; // [Lng, Lat]
const INITIAL_ZOOM = 16.2;

// Helper to generate polygon circle coordinates for sensor zone (~25m radius)
function createGeoJsonCircle(center: [number, number], radiusInMeters: number, points = 32) {
  const coords: [number, number][] = [];
  const distanceX = radiusInMeters / (111320 * Math.cos((center[1] * Math.PI) / 180));
  const distanceY = radiusInMeters / 110540;

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    coords.push([center[0] + x, center[1] + y]);
  }
  coords.push(coords[0]);
  return coords;
}

export function LiveMapScreen({ navigate, trafficState }: LiveMapScreenProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<MapLibreMap | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [showLegend, setShowLegend] = useState(true);

  const isOffline = trafficState.dataSource === "OFFLINE";
  const roadColor = isOffline
    ? "#94A3B8"
    : trafficState.trafficLevel === "Heavy Traffic"
    ? "#DC2626"
    : trafficState.trafficLevel === "Moderate Traffic"
    ? "#D97706"
    : "#059669";

  // Initialize MapLibre GL JS instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            "osm-raster-tiles": {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "&copy; OpenStreetMap contributors",
            },
          },
          layers: [
            {
              id: "osm-raster-layer",
              type: "raster",
              source: "osm-raster-tiles",
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: MAIN_GATE_COORDS,
        zoom: INITIAL_ZOOM,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      map.on("load", () => {
        setMapReady(true);

        // 1. Monitored Approach Road Segment (GeoJSON LineString from Solapur Road junction to Main Gate)
        const approachRoadGeoJSON = {
          type: "FeatureCollection" as const,
          features: [
            {
              type: "Feature" as const,
              properties: { name: "Rajbaug Main Gate Approach Road" },
              geometry: {
                type: "LineString" as const,
                coordinates: [
                  [74.0274, 18.4870], // Pune - Solapur Road (NH 65) junction
                  [74.0271, 18.4883],
                  [74.0268, 18.4897],
                  [74.0264, 18.4908], // Main Gate entrance arch
                  [74.0259, 18.4918], // Campus internal circulation
                ],
              },
            },
          ],
        };

        map.addSource("approach-road", {
          type: "geojson",
          data: approachRoadGeoJSON,
        });

        // Casing / Outline for visual prominence
        map.addLayer({
          id: "approach-road-casing",
          type: "line",
          source: "approach-road",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#0F172A",
            "line-width": 8,
            "line-opacity": 0.8,
          },
        });

        // Traffic State Colored Segment Layer
        map.addLayer({
          id: "approach-road-traffic",
          type: "line",
          source: "approach-road",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": roadColor,
            "line-width": 5,
          },
        });

        // 2. Approximate Sensor Monitoring Zone (Polygon Circle ~25m radius)
        const circleCoords = createGeoJsonCircle(MAIN_GATE_COORDS, 25);
        const sensorZoneGeoJSON = {
          type: "FeatureCollection" as const,
          features: [
            {
              type: "Feature" as const,
              properties: { name: "PIR & Ultrasonic Detection Radius (Approx. 25m)" },
              geometry: {
                type: "Polygon" as const,
                coordinates: [circleCoords],
              },
            },
          ],
        };

        map.addSource("sensor-zone", {
          type: "geojson",
          data: sensorZoneGeoJSON,
        });

        map.addLayer({
          id: "sensor-zone-fill",
          type: "fill",
          source: "sensor-zone",
          paint: {
            "fill-color": "#4B168C",
            "fill-opacity": 0.14,
          },
        });

        map.addLayer({
          id: "sensor-zone-stroke",
          type: "line",
          source: "sensor-zone",
          paint: {
            "line-color": "#D6A52A",
            "line-width": 2,
            "line-dasharray": [3, 2],
          },
        });

        // 3. Main Campus Gate Custom DOM Marker
        const gateMarkerEl = document.createElement("div");
        gateMarkerEl.className = "main-gate-map-pin";
        gateMarkerEl.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; cursor:pointer;">
            <div style="background:#4B168C; color:#FFFFFF; border:1.5px solid #D6A52A; border-radius:12px; padding:3px 8px; font-size:11px; font-weight:700; box-shadow:0 2px 6px rgba(0,0,0,0.18); display:flex; align-items:center; gap:4px; white-space:nowrap;">
              <span>Main Campus Gate</span>
            </div>
            <div style="width:0; height:0; border-left:4px solid transparent; border-right:4px solid transparent; border-top:5px solid #4B168C; margin-top:-1px;"></div>
          </div>
        `;
        new maplibregl.Marker({ element: gateMarkerEl, anchor: "bottom" })
          .setLngLat(MAIN_GATE_COORDS)
          .addTo(map);

        // 4. Sensor Node Marker
        const sensorMarkerEl = document.createElement("div");
        sensorMarkerEl.innerHTML = `
          <div style="background:#0F172A; color:#E2E8F0; border:1px solid #94A3B8; border-radius:8px; padding:2px 6px; font-size:10px; font-weight:600; box-shadow:0 2px 4px rgba(0,0,0,0.2); display:flex; align-items:center; gap:4px;">
            <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#10B981;"></span>
            <span>Edge Node (Pi 3B+)</span>
          </div>
        `;
        new maplibregl.Marker({ element: sensorMarkerEl, anchor: "top" })
          .setLngLat([74.0263, 18.4909])
          .addTo(map);
      });

      map.on("error", (e) => {
        console.warn("MapLibre event error:", e);
      });

      return () => {
        map.remove();
        mapInstanceRef.current = null;
      };
    } catch (err: any) {
      console.error("MapLibre init error:", err);
      setMapError(err?.message || "Failed to initialize WebGL map.");
    }
  }, []);

  // Sync approach road overlay color whenever traffic state changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    try {
      if (map.getLayer("approach-road-traffic")) {
        map.setPaintProperty("approach-road-traffic", "line-color", roadColor);
      }
    } catch (err) {
      console.warn("Error updating road color layer:", err);
    }
  }, [roadColor, mapReady]);

  // Recenter Handler
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo({
      center: MAIN_GATE_COORDS,
      zoom: INITIAL_ZOOM,
      essential: true,
      duration: 1000,
    });
  };

  const handleZoomIn = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.zoomOut();
  };

  return (
    <div className="flex flex-col h-full relative bg-slate-50">
      {/* ── Top Header Overlay ── */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200/80 z-10 shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate("dashboard")}
            aria-label="Back to dashboard"
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200/70 text-slate-700 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-[15px] font-bold text-slate-900 tracking-tight leading-tight">
              Live Approach Map
            </h1>
            <p className="text-[10.5px] text-slate-500 font-medium">
              Rajbaug Campus • NH 65 Junction
            </p>
          </div>
        </div>

        {/* Traffic Level Status Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-700">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: roadColor }}
            aria-hidden="true"
          />
          <span>{isOffline ? "Offline" : trafficState.trafficLevel}</span>
        </div>
      </header>

      {/* ── Map Canvas Container ── */}
      <div className="flex-1 relative overflow-hidden">
        {mapError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-50 text-slate-600">
            <Info size={32} className="text-slate-400 mb-2" />
            <p className="text-[14px] font-semibold text-slate-900">Map Error</p>
            <p className="text-[12px] text-slate-500 mt-1">{mapError}</p>
          </div>
        ) : (
          <div ref={mapContainerRef} className="w-full h-full" />
        )}

        {/* Floating Zoom & Compass Controls */}
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={handleRecenter}
            aria-label="Recenter gate location"
            title="Recenter Main Gate"
            className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-xs flex items-center justify-center transition-colors"
          >
            <Compass size={15} />
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            aria-label="Zoom in"
            className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-xs flex items-center justify-center transition-colors"
          >
            <Plus size={15} />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            aria-label="Zoom out"
            className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-xs flex items-center justify-center transition-colors"
          >
            <Minus size={15} />
          </button>
        </div>

        {/* Legend Box */}
        {showLegend && (
          <div className="absolute left-3 bottom-3 z-10 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl p-3 shadow-sm max-w-[210px]">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
              <span className="text-[11px] font-bold text-slate-800">Map Legend</span>
              <button
                type="button"
                onClick={() => setShowLegend(false)}
                aria-label="Close legend"
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={13} />
              </button>
            </div>

            <div className="space-y-1.5 text-[10.5px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-1.5 rounded-xs bg-emerald-600" />
                <span className="text-slate-700 font-medium">Low Traffic (Free Flow)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1.5 rounded-xs bg-amber-500" />
                <span className="text-slate-700 font-medium">Moderate Traffic</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1.5 rounded-xs bg-rose-600" />
                <span className="text-slate-700 font-medium">Heavy Queue</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border border-dashed border-[#D6A52A] bg-purple-100/50 flex-shrink-0" />
                <span className="text-slate-700 font-medium">Edge Sensor Area</span>
              </div>
            </div>
          </div>
        )}

        {!showLegend && (
          <button
            type="button"
            onClick={() => setShowLegend(true)}
            className="absolute left-3 bottom-3 z-10 px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 bg-white border border-slate-200 shadow-xs text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Info size={13} />
            <span>Legend</span>
          </button>
        )}

        {/* Attribution Badge */}
        <div className="absolute right-2 bottom-1 z-10 px-1.5 py-0.5 rounded text-[8.5px] font-medium bg-white/80 text-slate-500">
          © OpenStreetMap contributors
        </div>
      </div>

      {/* ── Unified Bottom Navigation Bar ── */}
      <BottomNavBar currentScreen="live-map" navigate={navigate} />
    </div>
  );
}
