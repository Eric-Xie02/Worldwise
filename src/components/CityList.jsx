import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import CityItem from "./CityItem";
import Message from "./Message";
import { useGetCities } from "../hooks/useGetCities";
import { useNavigate } from "react-router-dom";

function CityList() {
  const { cities, isLoading } = useGetCities();
  const navigate = useNavigate();

  if (isLoading) {
    return <Spinner />;
  }
  if (!cities?.length) {
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );
  }

  function handleClick(city) {
    navigate(
      `/app/cities/${city.id}?lat=${city.position.lat}&lng=${city.position.lng}`
    );
  }

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem key={city.id} city={city} onClick={() => handleClick(city)} />
      ))}
    </ul>
  );
}

export default CityList;
