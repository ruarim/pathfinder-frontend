import { useQuery } from "@tanstack/react-query";
import client from "../../axios/apiClient";

export const useGetVenuesByName = (searchParam: string) => {
  return useQuery<VenuesResponse, any, any>({
    queryKey: ["searchParam", searchParam],
    queryFn: () => client.get(`venue_name_search?name=${searchParam}`),
  });
};
