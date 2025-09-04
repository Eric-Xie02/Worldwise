import { useGetCities } from "./useGetCities";

export function useGetTripCities(tripId) {
  const { cities, isLoadingCities } = useGetCities();
  const tripCities = cities?.filter((city) => city.trip_id === tripId) || [];

  return { tripCities, isLoadingTripCities: isLoadingCities };
}
