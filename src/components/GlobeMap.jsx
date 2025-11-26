import React, { useEffect, useState } from "react";
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
  const [viewState, setViewState] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 2,
    pitch: 0,
    bearing: 0,
  });

  useEffect(
    function () {
      if (mapLat && mapLng) {
        setViewState((viewState) => ({
          ...viewState,
          latitude: mapLat,
          longitude: mapLng,
        }));
      }
    },
    [mapLat, mapLng]
  );

  return (
    <Map
      reuseMaps
      style={{ width: "100%", height: "100%" }}
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={MAPBOX_KEY}
      projection="globe"
      onClick={(e) => {
        console.log(e);
        navigate(`form?lat=${e.lngLat.lat}&lng=${e.lngLat.lng}`);
      }}
    >
      <NavigationControl position="top-left" />
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
