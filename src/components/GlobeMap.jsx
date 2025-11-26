import React, { useEffect, useRef } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useGetCities } from "../hooks/useGetCities";
import { useNavigate } from "react-router-dom";
import { useUrlPosition } from "../hooks/useUrlPosition";

const MAPBOX_KEY = import.meta.env.VITE_MAPBOX_KEY;

const GlobeMap = () => {
  const navigate = useNavigate();
  const { cities } = useGetCities();
  const [mapLat, mapLng] = useUrlPosition();

  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!mapLat || !mapLng) return;

    mapRef.current.flyTo({
      center: [mapLng, mapLat],
      zoom: 4,
      speed: 1.2,
      curve: 1.4,
      essential: true,
    });
  }, [mapLat, mapLng]);

  return (
    <Map
      reuseMaps
      ref={mapRef}
      style={{ width: "100%", height: "100%" }}
      initialViewState={{
        latitude: 20,
        longitude: 0,
        zoom: 1.8,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={MAPBOX_KEY}
      projection="globe"
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
    </Map>
  );
};

export default GlobeMap;
