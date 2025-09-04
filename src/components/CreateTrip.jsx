import "react-datepicker/dist/react-datepicker.css";

import Button from "./Button";
import styles from "./Form.module.css";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import { useUser } from "../hooks/useUser";
import { useCreateCity } from "../hooks/useCreateCity";
import { useGetCities } from "../hooks/useGetCities";
import { useState } from "react";
import CityItem from "./CityItem";
import Spinner from "./Spinner";
import { useCreateTrip } from "../hooks/useCreateTrip";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function CreateTrip() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [tripName, setTripName] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState(null);
  const [emoji, setEmoji] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);

  const { cities, isLoadingCities } = useGetCities();

  const { createTrip, isCreatingTrip } = useCreateTrip();
  function handleSubmit(e) {
    e.preventDefault();

    const newTrip = {
      name: tripName,
      description: notes,
      user_id: user.id,
      status,
    };

    createTrip({ tripCities: selectedCities, trip: newTrip });
    navigate("/app/cities");
  }

  function handleCityClick(city) {
    setSelectedCities((prevCities) => {
      const isAlreadySelected = prevCities.some(
        (selectedCity) => selectedCity.id === city.id
      );

      if (isAlreadySelected) {
        return prevCities.filter((selectedCity) => selectedCity.id !== city.id);
      } else {
        return [...prevCities, city];
      }
    });
  }

  function isCitySelected(city) {
    return selectedCities.some((selectedCity) => selectedCity.id === city.id);
  }

  if (isLoadingCities) return <Spinner />;

  return (
    <form
      className={`${styles.form} ${isCreatingTrip ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="tripName">Trip Name</label>
        <input
          id="tripName"
          onChange={(e) => setTripName(e.target.value)}
          value={tripName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
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
        <Button type="primary">Create Trip</Button>
      </div>
    </form>
  );
}

export default CreateTrip;
