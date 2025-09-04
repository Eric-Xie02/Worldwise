import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCity as createCityApi } from "../services/apiCities";
import toast from "react-hot-toast";

export function useCreateCity() {
  const queryClient = useQueryClient();

  const { mutate: createCity, isLoading: isCreatingCity } = useMutation({
    mutationFn: createCityApi,
    onSuccess: () => {
      toast.success("New City Created");
      queryClient.invalidateQueries({ queryKey: ["cities"] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { createCity, isCreatingCity };
}
