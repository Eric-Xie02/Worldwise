import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Button from "./Button";
import styles from "./EditCity.module.css";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "./BackButton";
import { useUser } from "../hooks/useUser";
import { useUpdateCity } from "../hooks/useUpdateCity";
import { useGetCities } from "../hooks/useGetCities";
import Spinner from "./Spinner";

function EditCity() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { id } = useParams();

  const [cityName, setCityName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");

  const { updateCity, isUpdatingCity } = useUpdateCity();
  const { cities = [], isLoadingCities } = useGetCities();

  const currentCity = useMemo(() => {
    return cities.find((city) => city.id === Number(id));
  }, [cities, id]);

  useEffect(() => {
    if (!currentCity) return;
    setCityName(currentCity.city_name);
    setNotes(currentCity.notes);
    setStartDate(currentCity.start_date);
    setEndDate(currentCity.end_date);
  }, [currentCity]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !startDate) return;

    const newCity = {
      ...currentCity,
      city_name: cityName,
      start_date: startDate,
      end_date: endDate,
      notes,
    };
    updateCity({ newCity, userId: user.id });
    navigate("/app/cities");
  }

  if (isLoadingCities) return <Spinner />;

  return (
    <form
      className={`${styles.form} ${isUpdatingCity ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <DatePicker
          onChange={(dates) => {
            const [start, end] = dates;
            setStartDate(start);
            setEndDate(end);
          }}
          selected={startDate}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          dateFormat="MM/dd/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your visit to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <BackButton />
        <Button type="primary">Edit City</Button>
      </div>
    </form>
  );
}

export default EditCity;
