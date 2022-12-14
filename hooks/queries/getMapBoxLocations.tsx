import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetMapBoxLocations = (searchText: string) => {
  return useQuery<MapLocations>({
    queryKey: ["location_search", searchText],
    queryFn: () =>
      axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchText}.json?access_token=${process.env.NEXT_PUBLIC_MAP_BOX_TOKEN}`
      ),
  });
};

export type MapLocations = {
  data: {
    features: MapLocation[];
  };
};
