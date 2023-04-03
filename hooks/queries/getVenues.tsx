import { useQuery } from "@tanstack/react-query";
import client from "../../axios/apiClient";

export const useGetVenues = () => {
  return useQuery<VenuesResponse, any, any>({
    queryKey: ["venues"],
    queryFn: () => client.get("venues"),
  });
};
