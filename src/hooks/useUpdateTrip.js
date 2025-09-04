import { QueryClient, useMutation } from "@tanstack/react-query";
import { updateTrip as updateTripApi } from "../services/apiTrips";
import toast from "react-hot-toast";

export function useUpdateTrip() {
  const { mutate: updateTrip, isLoading: isUpdatingTrip } = useMutation({
    mutationFn: updateTripApi,
    onSuccess: () => {
      toast.success("Trip successfully updated");
      QueryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });

  return { updateTrip, isUpdatingTrip };
}
