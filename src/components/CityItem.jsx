import { useCities } from "../contexts/CitiesContext";
import { useDeleteCity } from "../hooks/useDeleteCity";
import styles from "./CityItem.module.css";
import { differenceInDays } from "date-fns";
import { formatStayDuration } from "../utils/helpers";
import { useUser } from "../hooks/useUser";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

function CityItem({
  city,
  onClick,
  showDeleteButton = true,
  isSelected = false,
}) {
  const { currentCity } = useCities();
  const { deleteCity, isDeletingCity } = useDeleteCity();
  const { user } = useUser();

  const {
    city_name: cityName,
    emoji,
    start_date: startDate,
    end_date: endDate,
    id,
    position,
  } = city;

  const daysVisited = differenceInDays(endDate, startDate) + 1;

  function handleDeleteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    deleteCity({ cityId: id, userId: user.id });
  }

  function handleCityClick() {
    if (onClick) {
      onClick(city);
    }
  }

  const content = (
    <>
      <span className={styles.emoji}>{emoji}</span>
      <h3 className={styles.name}>{cityName}</h3>
      <time className={styles.date}>({formatDate(startDate)})</time>
      <div className={styles.timeVisited}>
        {formatStayDuration(daysVisited)}
      </div>
      {showDeleteButton && (
        <button
          className={styles.deleteBtn}
          onClick={handleDeleteClick}
          disabled={isDeletingCity}
        >
          &times;
        </button>
      )}
      {isSelected && <span className={styles.selectedIndicator}>✓</span>}
    </>
  );

  return (
    <li>
      {onClick ? (
        <button
          type="button"
          className={`${styles.cityItem} ${
            isSelected
              ? styles["cityItem--selected"]
              : id === currentCity?.id
              ? styles["cityItem--active"]
              : ""
          }`}
          onClick={handleCityClick}
          disabled={isDeletingCity}
          style={{
            width: "100%",
            textAlign: "left",
            cursor: "pointer",
          }}
        >
          {content}
        </button>
      ) : (
        <div
          className={`${styles.cityItem} ${
            isSelected
              ? styles["cityItem--selected"]
              : id === currentCity?.id
              ? styles["cityItem--active"]
              : ""
          }`}
          style={{
            width: "100%",
            cursor: "default",
          }}
        >
          {content}
        </div>
      )}
    </li>
  );
}

export default CityItem;
