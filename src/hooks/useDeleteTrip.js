import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteTrip as deleteTripApi } from "../services/apiTrips";

export function useDeleteTrip() {
  const queryClient = useQueryClient();
  const { isLioading: isDeletingTrip, mutate: deleteTrip } = useMutation({
    mutationFn: deleteTripApi,
    onSuccess: () => {
      toast.success("Trip successfully deleted");
      queryClient.invalidateQueries({
        queryKey: ["trips"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { deleteTrip, isDeletingTrip };
}
