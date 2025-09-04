import { QueryClient, useMutation } from "@tanstack/react-query";
import { updateCity as updateCityApi } from "../services/apiCities";
import toast from "react-hot-toast";

export function useUpdateCity() {
  const { mutate: updateCity, isLoading: isUpdatingCity } = useMutation({
    mutationFn: updateCityApi,
    onSuccess: () => {
      toast.success("City successfully updated");
      QueryClient.invalidateQueries({ queryKey: ["cities"] });
    },
  });

  return { updateCity, isUpdatingCity };
}
