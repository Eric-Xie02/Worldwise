import { useQuery } from "@tanstack/react-query";
import { useUser } from "./useUser";
import { getTrips } from "../services/apiTrips";

export function useGetTrips() {
  const { user } = useUser();
  const { isLoading: isLoadingTrips, data: trips } = useQuery({
    queryKey: ["trips", user],
    queryFn: () => getTrips({ currentUserId: user.id }),
    enabled: !!user,
  });

  return { trips, isLoadingTrips };
}
