import { useQuery } from "@tanstack/react-query";
import { getCities } from "../services/apiCities";
import { useUser } from "./useUser";

export function useGetCities() {
  const { user } = useUser();
  const { isLoading: isLoadingCities, data: cities } = useQuery({
    queryKey: ["cities", user],
    queryFn: () => getCities({ currentUserId: user.id }),
    enabled: !!user,
  });

  return { cities, isLoadingCities };
}
