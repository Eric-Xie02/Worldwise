import React, { useEffect, useRef } from "react";
import MapboxMap, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useGetCities } from "../hooks/useGetCities";
import { useNavigate } from "react-router-dom";
import { useUrlPosition } from "../hooks/useUrlPosition";

const MAPBOX_KEY = import.meta.env.VITE_MAPBOX_KEY;

function Map() {
  const navigate = useNavigate();
  const { cities } = useGetCities();
  const [mapLat, mapLng] = useUrlPosition();

  const mapRef = useRef(null);

  //Move map to url location
  useEffect(() => {
    if (!mapRef.current) return;
    if (!mapLat || !mapLng) return;

    const zoomOptions = mapRef.current.getZoom() < 8 ? { zoom: 8 } : {};

    mapRef.current.flyTo({
      center: [mapLng, mapLat],
      zoom: zoomOptions.zoom,
      speed: 1.2,
      curve: 1.4,
      essential: true,
    });
  }, [mapLat, mapLng]);

  //Moves map to location specified in url on page load/reload
  const handleMapLoad = () => {
    if (!mapRef.current) return;
    if (!mapLat || !mapLng) return;

    const zoomOptions = mapRef.current.getZoom() < 8 ? { zoom: 8 } : {};

    mapRef.current.flyTo({
      center: [mapLng, mapLat],
      ...zoomOptions,
      speed: 1.2,
      curve: 1.4,
      essential: true,
    });
  };

  return (
    <MapboxMap
      reuseMaps
      ref={mapRef}
      style={{ width: "100%", height: "100%" }}
      initialViewState={{
        latitude: 20,
        longitude: 0,
        zoom: 1.8,
      }}
      fog={{
        color: "rgb(186,210,235)",
        "horizon-blend": 0.02,
        "star-intensity": 0.6,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={MAPBOX_KEY}
      projection="globe"
      onLoad={handleMapLoad}
      onClick={(e) => {
        navigate(`form?lat=${e.lngLat.lat}&lng=${e.lngLat.lng}`);
      }}
    >
      {cities?.map((city) => (
        <Marker
          key={city.id}
          latitude={city.position.lat}
          longitude={city.position.lng}
          anchor="bottom"
        />
      ))}
    </MapboxMap>
  );
}

export default Map;
