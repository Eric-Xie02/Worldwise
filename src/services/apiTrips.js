import supabase from "./supabase";

export async function getTrips({ currentUserId }) {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("user_id", currentUserId);

  if (error) throw new Error(error.message);
  return data;
}

// export async function getTrip({ tripId }) {
//   const { data, error } = await supabase
//     .from("trips")
//     .select("*")
//     .eq("id", tripId)
//     .single();

//   if (error) throw new Error(error.message);
//   return data;
// }

export async function createTrip({ tripCities, trip }) {
  const { data: tripData, error: tripError } = await supabase
    .from("trips")
    .insert(trip)
    .select()
    .single();

  if (tripError) {
    throw new Error(`Failed to create trip: ${tripError.message}`);
  }

  const tripId = tripData.id;
  const cityIds = tripCities.map((city) => city.id);

  const { data: cityData, error: cityError } = await supabase
    .from("visits")
    .update({ trip_id: tripId })
    .in("id", cityIds)
    .select();

  if (cityError) {
    throw new Error(`Failed to update cities: ${cityError.message}`);
  }

  return {
    trip: tripData,
    updatedCities: cityData,
  };
}

export async function updateTrip({ tripCities, trip, userId }) {
  // 0. Check if the trip belongs to this user
  const { data: tripRecord, error: fetchError } = await supabase
    .from("trips")
    .select("id, user_id")
    .eq("id", trip.id)
    .single();

  if (fetchError) throw new Error(fetchError.message);
  if (!tripRecord) throw new Error("Trip not found");
  if (tripRecord.user_id !== userId)
    throw new Error("You do not have permission to update this trip");

  // 1. Update the trip record
  const { data: tripData, error: tripError } = await supabase
    .from("trips")
    .update({
      name: trip.name,
      description: trip.description,
      status: trip.status,
    })
    .eq("id", trip.id);

  if (tripError) throw new Error(tripError.message);

  // 2. Update the visits in tripCities to belong to this trip
  const cityIds = tripCities.map((city) => city.id);
  const { error: visitsUpdateError } = await supabase
    .from("visits")
    .update({ trip_id: trip.id })
    .in("id", cityIds);

  if (visitsUpdateError) throw new Error(visitsUpdateError.message);

  // 3. Find visits currently linked to this trip but not in tripCities and null them
  const { data: currentVisits, error: currentVisitsError } = await supabase
    .from("visits")
    .select("id")
    .eq("trip_id", trip.id);

  if (currentVisitsError) throw new Error(currentVisitsError.message);

  const visitsToNull = currentVisits
    .map((v) => v.id)
    .filter((id) => !cityIds.includes(id));

  if (visitsToNull.length > 0) {
    const { error: nullVisitsError } = await supabase
      .from("visits")
      .update({ trip_id: null })
      .in("id", visitsToNull);

    if (nullVisitsError) throw new Error(nullVisitsError.message);
  }

  return { trip: tripData };
}

export async function deleteTrip({ tripCities, trip, userId }) {
  // 0. Check if the trip belongs to this user
  const { data: tripRecord, error: fetchError } = await supabase
    .from("trips")
    .select("id, user_id")
    .eq("id", trip.id)
    .single();

  if (fetchError) throw new Error(fetchError.message);
  if (!tripRecord) throw new Error("Trip not found");
  if (tripRecord.user_id !== userId)
    throw new Error("You do not have permission to update this trip");

  // 1. Set trip_id in visits in the deleted trip to null
  const cityIds = tripCities.map((city) => city.id);
  const { error: visitsError } = await supabase
    .from("visits")
    .update({ trip_id: null })
    .in("id", cityIds);

  if (visitsError) throw new Error(visitsError.message);
  // 2. Delete trip from trip table
  const { error: deleteError } = await supabase
    .from("trips")
    .delete()
    .eq("id", trip.id);

  if (deleteError) throw new Error(deleteError.message);
}
