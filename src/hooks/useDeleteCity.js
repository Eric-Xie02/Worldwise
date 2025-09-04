import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteCity as deleteCityApi } from "../services/apiCities";

export function useDeleteCity() {
  const queryClient = useQueryClient();
  const { isLoading: isDeletingCity, mutate: deleteCity } = useMutation({
    mutationFn: deleteCityApi,
    onSuccess: () => {
      toast.success("City successfully deleted");
      queryClient.invalidateQueries({
        queryKey: ["cities"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { deleteCity, isDeletingCity };
}
