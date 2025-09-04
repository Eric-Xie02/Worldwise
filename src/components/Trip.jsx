import { useNavigate, useParams } from "react-router-dom";
import { useGetTrips } from "../hooks/useGetTrips";
import { useGetCities } from "../hooks/useGetCities";
import { differenceInDays, min, max } from "date-fns";
import Spinner from "./Spinner";
import BackButton from "./BackButton";
import CityItem from "./CityItem";
import styles from "./Trip.module.css";

import { getMinMaxDate } from "../utils/helpers";
import { useState } from "react";
import EditButton from "./EditButton";
import { useGetTripCities } from "../hooks/useGetTripCities";

const formatDateWithYear = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

const formatDateWithoutYear = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
  }).format(new Date(date));

function Trip() {
  const { id } = useParams();
  const { isEditing, setIsEditing } = useState(false);
  const { trips, isLoadingTrips } = useGetTrips();

  const { tripCities, isLoadingTripCities } = useGetTripCities(Number(id));

  const navigate = useNavigate();

  if (isLoadingTrips || isLoadingTripCities) return <Spinner />;

  const currentTrip = trips?.find((trip) => trip.id === Number(id));

  if (!currentTrip) {
    return (
      <div className={styles.trip}>
        <p>Trip not found.</p>
        <BackButton />
      </div>
    );
  }

  const { name, description } = currentTrip;

  const { minDate: startDate, maxDate: endDate } = getMinMaxDate(tripCities);

  const tripDuration =
    startDate && endDate
      ? differenceInDays(new Date(endDate), new Date(startDate)) + 1
      : null;

  const formatTripDateRange = () => {
    if (!startDate) return "—";

    if (!endDate || startDate === endDate) {
      return formatDateWithYear(startDate);
    }

    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();

    if (startYear === endYear) {
      return `${formatDateWithoutYear(startDate)} to ${formatDateWithYear(
        endDate
      )}`;
    } else {
      return `${formatDateWithYear(startDate)} to ${formatDateWithYear(
        endDate
      )}`;
    }
  };

  function handleClick(city) {
    navigate(
      `/app/cities/${city.id}?lat=${city.position.lat}&lng=${city.position.lng}`
    );
  }

  return (
    <div className={styles.trip}>
      <div className={styles.row}>
        <h6>Trip name</h6>
        <h3>{name}</h3>
      </div>

      {description && (
        <div className={styles.row}>
          <h6>Notes</h6>
          <p>{description}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Trip dates</h6>
        <p>
          {formatTripDateRange()}
          {tripDuration &&
            ` (${tripDuration} ${tripDuration === 1 ? "day" : "days"})`}
        </p>
      </div>

      {tripCities.length > 0 && (
        <div className={styles.row}>
          <h6>Cities visited ({tripCities.length})</h6>
          <ul className={styles.cityList}>
            {tripCities.map((city) => (
              <CityItem
                key={city.id}
                city={city}
                showDeleteButton={false}
                onClick={handleClick}
              />
            ))}
          </ul>
        </div>
      )}

      <div className={styles.buttonContainer}>
        <BackButton />
        <EditButton path={`/app/trips/${id}/edit`} />
      </div>
    </div>
  );
}

export default Trip;
