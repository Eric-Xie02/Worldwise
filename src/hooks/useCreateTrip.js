import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTrip as createTripApi } from "../services/apiTrips";
import toast from "react-hot-toast";

export function useCreateTrip() {
  const queryClient = useQueryClient();

  const { mutate: createTrip, isLoading: isCreatingTrip } = useMutation({
    mutationFn: createTripApi,
    onSuccess: () => {
      toast.success("New Trip Created");
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { createTrip, isCreatingTrip };
}
