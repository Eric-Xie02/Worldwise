import { Link } from "react-router-dom";
import styles from "./TripItem.module.css";
import { useDeleteTrip } from "../hooks/useDeleteTrip";
import { useGetTripCities } from "../hooks/useGetTripCities";
import { useUser } from "../hooks/useUser";

function TripItem({ trip }) {
  const { id, name, status } = trip;

  const { deleteTrip, isDeletingTrip } = useDeleteTrip();
  const { tripCities, isLoadingTripCities } = useGetTripCities(Number(id));
  const { user } = useUser();

  function handleDeleteClick(e) {
    e.preventDefault();
    e.stopPropagation(); // Prevent triggering the main onClick
    deleteTrip({ tripCities, trip, userId: user.id });
  }

  return (
    <li>
      <Link className={styles.tripItem} to={`${id}`}>
        <h3 className={styles.name}>{name}</h3>
        <h3 className={styles.status}>{status}</h3>
        <button
          onClick={handleDeleteClick}
          className={styles.deleteBtn}
          disabled={isDeletingTrip || isLoadingTripCities}
        >
          &times;
        </button>
      </Link>
    </li>
  );
}

export default TripItem;
