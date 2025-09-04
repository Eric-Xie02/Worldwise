import { useLocation, useParams } from "react-router-dom";
import styles from "./City.module.css";
import Spinner from "./Spinner";
import BackButton from "./BackButton";
import Button from "./Button";
import { useGetCities } from "../hooks/useGetCities";
import { differenceInDays } from "date-fns";
import EditButton from "./EditButton";

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

export default function City() {
  const { id } = useParams();
  const { cities, isLoadingCities } = useGetCities();
  const location = useLocation();

  if (isLoadingCities) return <Spinner />;

  const currentCity = cities?.find((c) => String(c.id) === String(id));

  if (!currentCity) {
    return (
      <div className={styles.city}>
        <p>City not found.</p>
        <BackButton />
      </div>
    );
  }

  const {
    city_name: cityName,
    emoji,
    start_date: startDate,
    end_date: endDate,
    notes,
  } = currentCity;

  const stayDuration = differenceInDays(endDate, startDate);

  const formatDateRange = () => {
    if (!startDate) return "—";

    if (stayDuration <= 1) {
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

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>
          You went to {cityName} {stayDuration > 1 ? "from" : "on"}
        </h6>
        <p>{formatDateRange()}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div className={styles.buttonContainer}>
        <BackButton />
        <EditButton path={`${location.pathname}/edit${location.search}`} />
      </div>
    </div>
  );
}
