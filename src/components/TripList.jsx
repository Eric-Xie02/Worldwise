import styles from "./TripList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import { useGetCities } from "../hooks/useGetCities";
import { useGetTrips } from "../hooks/useGetTrips";
import TripItem from "./TripItem";
import { Link } from "react-router-dom";

function TripList() {
  const { cities, isLoading: isLoadingCities } = useGetCities();
  const { trips, isLoadingTrips } = useGetTrips();

  if (isLoadingCities || isLoadingTrips) {
    return <Spinner />;
  }
  // if (!trips?.length) {
  //   return <Message message="Create your first trip" />;
  // }

  return (
    <div className={styles.createTripContainer}>
      {trips?.length ? (
        <ul className={styles.tripList}>
          {trips.map((trip) => (
            <TripItem key={trip.id} trip={trip} />
          ))}
        </ul>
      ) : (
        <Message message="Create your first trip" />
      )}
      <Link to="/app/trips/createtrip" className={styles.createTripBtn}>
        Create New Trip
      </Link>
    </div>
  );
}

export default TripList;
