import { useUser } from "../hooks/useUser";
import supabase from "./supabase";

export async function getCities({ currentUserId }) {
  const { data, error } = await supabase
    .from("visits")
    .select("*")
    .eq("user_id", currentUserId)
    .order("start_date", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getCity({ cityId }) {
  const { data, error } = await supabase
    .from("visits")
    .select("*")
    .eq("id", cityId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createCity({ newCity }) {
  // expect newCity: { city_name, country_code, emoji, lat, lng, startDate, endDate, notes }
  const { data, error } = await supabase
    .from("visits")
    .insert([newCity])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteCity({ cityId, userId }) {
  const { data, error } = await supabase
    .from("visits")
    .delete()
    .eq("id", cityId)
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return data;
}

export async function updateCity({ newCity, userId }) {
  const { data, error } = await supabase
    .from("visits")
    .update({
      city_name: newCity.city_name,
      notes: newCity.notes,
      start_date: newCity.start_date,
      end_date: newCity.end_date,
    })
    .eq("id", newCity.id)
    .eq("user_id", userId);

  if (error) throw new Error(`Failed to update city ${error.message}`);

  return data;
}
