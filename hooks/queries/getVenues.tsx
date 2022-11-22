import { useQuery } from "@tanstack/react-query";
import client from "../../axios/apiClient";

export const useGetVenues = () => {
  return useQuery<VenueResponse, any, any>({
    queryKey: ["venues"],
    queryFn: () => client.get("venues"),
  });
};
