import "react-datepicker/dist/react-datepicker.css";

import Button from "./Button";
import styles from "./Form.module.css";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "./BackButton";
import { useGetCities } from "../hooks/useGetCities";
import { useGetTrips } from "../hooks/useGetTrips";
import { useUpdateTrip } from "../hooks/useUpdateTrip";
import { useState, useMemo, useEffect } from "react";
import CityItem from "./CityItem";
import Spinner from "./Spinner";
import { useUser } from "../hooks/useUser";

function EditTrip() {
  const navigate = useNavigate();
  const { cities = [], isLoadingCities } = useGetCities();
  const { trips = [], isLoadingTrips } = useGetTrips();
  const { updateTrip, isUpdatingTrip } = useUpdateTrip();
  const { user } = useUser();
  const { id } = useParams();

  const currentTrip = useMemo(() => {
    return trips.find((trip) => trip.id === Number(id));
  }, [trips, id]);

  const currentTripCities = useMemo(() => {
    return cities.filter((city) => city.trip_id === Number(id));
  }, [cities, id]);

  const [tripName, setTripName] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState(null);
  const [selectedCities, setSelectedCities] = useState([]);

  useEffect(() => {
    if (!currentTrip) return;

    setTripName(currentTrip.name);
    setNotes(currentTrip.description);
    setSelectedCities(currentTripCities);
    setStatus(currentTrip.status);
  }, [currentTrip, currentTripCities]);

  function handleSubmit(e) {
    e.preventDefault();

    const updatedTrip = {
      ...currentTrip,
      name: tripName,
      description: notes,
      status,
    };

    updateTrip({
      tripCities: selectedCities,
      trip: updatedTrip,
      userId: user.id,
    });
    navigate(`/app/trips/${id}`);
  }

  function handleCityClick(city) {
    setSelectedCities((prevCities) =>
      prevCities.some((c) => c.id === city.id)
        ? prevCities.filter((c) => c.id !== city.id)
        : [...prevCities, city]
    );
  }

  function isCitySelected(city) {
    return selectedCities.some((c) => c.id === city.id);
  }

  if (isLoadingCities || isLoadingTrips) return <Spinner />;

  return (
    <form
      className={`${styles.form} ${isUpdatingTrip ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="tripName">Trip Name</label>
        <input
          id="tripName"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <div className={styles.row}>
        <label htmlFor="status">Trip Status</label>
        <select
          id="status"
          onChange={(e) => setStatus(e.target.value)}
          value={status || ""}
          className={styles.select}
        >
          <option value="">-- Select Status --</option>
          <option value="Completed">Completed</option>
          <option value="Planning">Planning</option>
          <option value="Booked">Booked</option>
          <option value="Current">Currently Travelling</option>
        </select>
      </div>

      <div>
        <ul className={styles.cityList}>
          {cities.map((city) => (
            <CityItem
              key={city.id}
              city={city}
              showDeleteButton={false}
              onClick={handleCityClick}
              isSelected={isCitySelected(city)}
            />
          ))}
        </ul>
      </div>

      <div className={styles.buttons}>
        <BackButton />
        <Button type="primary">Edit Trip</Button>
      </div>
    </form>
  );
}

export default EditTrip;
